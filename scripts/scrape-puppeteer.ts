import puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  brand: string
  price: string
  originalPrice?: string
  image: string
  imageLocal?: string
  description: string
  specifications?: Record<string, string>
  inStock: boolean
  mondokartUrl: string
  featured?: boolean
}

class PuppeteerScraper {
  private products: Product[] = []
  private baseUrl = 'https://www.mondokart.com'

  constructor() {
    this.ensureDirectories()
  }

  private ensureDirectories() {
    const dirs = [
      path.join(process.cwd(), 'data'),
      path.join(process.cwd(), 'public', 'images', 'products')
    ]

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  async scrapePage(url: string, category: string, maxProducts: number = 0) {
    console.log(`\n🚀 Avvio browser headless...`)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
      const page = await browser.newPage()

      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

      console.log(`\n🔍 Navigando verso: ${url}`)
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

      console.log(`⏳ Aspetto caricamento prodotti...`)

      // Aspetta che i prodotti siano caricati
      try {
        await page.waitForSelector('.js-product-miniature, .product-miniature, .product', { timeout: 10000 })
      } catch (error) {
        console.log(`⚠️  Timeout - provo comunque a estrarre i prodotti`)
      }

      // Scroll per caricare eventuali lazy-loaded images
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await this.delay(2000)

      console.log(`\n📦 Estrazione dati prodotti...`)

      // Estrai tutti i prodotti dalla pagina
      const productsData = await page.evaluate(() => {
        const products: any[] = []

        // Prova diversi selettori
        const selectors = [
          '.js-product-miniature',
          '.product-miniature',
          '.product',
          'article[data-id-product]'
        ]

        let productElements: NodeListOf<Element> | null = null

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector)
          if (elements.length > 0) {
            productElements = elements
            console.log(`Trovato selettore: ${selector} (${elements.length} prodotti)`)
            break
          }
        }

        if (!productElements) return []

        productElements.forEach((element) => {
          try {
            // Estrai nome dal .product_name a oppure da [itemprop="name"]
            const nameEl = element.querySelector('.product_name a, [itemprop="name"]')
            const name = nameEl?.textContent?.trim() || nameEl?.getAttribute('content') || ''

            // Estrai link dal primo <a> nell'element-top
            const linkEl = element.querySelector('.element-top a, .product_name a')
            const link = linkEl?.getAttribute('href') || ''

            // Estrai prezzo da [itemprop="price"]
            const priceEl = element.querySelector('[itemprop="price"]')
            const priceText = priceEl?.getAttribute('content') || priceEl?.textContent?.trim() || ''

            // Estrai immagine
            const imgEl = element.querySelector('img')
            const imageSrc = imgEl?.getAttribute('src') ||
                           imgEl?.getAttribute('data-src') ||
                           imgEl?.getAttribute('data-lazy-src') || ''

            // Estrai brand da [itemprop="brand"] [itemprop="name"]
            const brandEl = element.querySelector('[itemprop="brand"] [itemprop="name"]')
            const brand = brandEl?.getAttribute('content') || ''

            // Estrai descrizione breve
            const descEl = element.querySelector('.product-short-description, [itemprop="description"]')
            const shortDesc = descEl?.textContent?.trim() || descEl?.getAttribute('content') || ''

            if (name && link) {
              products.push({
                name,
                link,
                price: priceText,
                image: imageSrc,
                brand,
                shortDescription: shortDesc
              })
            }
          } catch (err) {
            console.error('Errore estrazione prodotto:', err)
          }
        })

        return products
      })

      console.log(`\n✅ Trovati ${productsData.length} prodotti\n`)

      // Limita se richiesto
      const toProcess = maxProducts > 0 ? productsData.slice(0, maxProducts) : productsData

      // Converti in formato Product
      for (let i = 0; i < toProcess.length; i++) {
        const data = toProcess[i]

        const product: Product = {
          id: `mk-${Date.now()}-${i}`,
          name: data.name,
          slug: this.generateSlug(data.name),
          category: category,
          brand: data.brand || this.extractBrand(data.name),
          price: this.cleanPrice(data.price),
          image: this.normalizeImageUrl(data.image),
          description: data.shortDescription || '', // Verrà migliorato dal dettaglio
          inStock: true,
          mondokartUrl: this.normalizeUrl(data.link)
        }

        this.products.push(product)

        console.log(`  ✅ ${i + 1}. ${product.name}`)
        console.log(`     💰 ${data.price}`)
      }

      // Scarica dettagli per ogni prodotto
      if (this.products.length > 0) {
        console.log(`\n📝 Recupero dettagli prodotti...\n`)

        for (let i = 0; i < this.products.length; i++) {
          console.log(`[${i + 1}/${this.products.length}] ${this.products[i].name}`)
          await this.scrapeProductDetail(page, this.products[i])
          await this.delay(500) // Rate limiting
        }
      }

    } finally {
      await browser.close()
      console.log(`\n🔒 Browser chiuso`)
    }

    return this.products
  }

  async scrapeProductDetail(page: any, product: Product): Promise<Product> {
    try {
      await page.goto(product.mondokartUrl, { waitUntil: 'networkidle2', timeout: 30000 })

      const details = await page.evaluate(() => {
        // Descrizione - cerca nel tab description
        const descSelectors = [
          '.tab-pane#description .rte-content',
          '#description .rte-content',
          '.product-description',
          '[itemprop="description"]',
          '.rte-content'
        ]

        let description = ''
        for (const sel of descSelectors) {
          const el = document.querySelector(sel)
          if (el && el.textContent && el.textContent.trim().length > 50) {
            description = el.textContent.trim()
            break
          }
        }

        // Prezzo corrente dalla pagina dettaglio
        let currentPrice = ''
        const priceSelectors = [
          '.current-price-value',
          '.current-price [itemprop="price"]',
          '[itemprop="price"]',
          '.product-price'
        ]

        for (const sel of priceSelectors) {
          const priceEl = document.querySelector(sel)
          if (priceEl) {
            const priceContent = priceEl.getAttribute('content')
            const priceText = priceEl.textContent?.trim()
            if (priceContent && priceContent !== '' && priceContent !== '0') {
              currentPrice = priceContent
              break
            } else if (priceText && priceText.includes('€')) {
              currentPrice = priceText
              break
            }
          }
        }

        // Prezzo originale (solo se esiste DAVVERO uno sconto)
        let originalPrice = ''
        // Cerca il badge sconto SOLO nell'area prodotto (non in altre promozioni sulla pagina)
        const productPricesArea = document.querySelector('.product-prices')
        const productPriceEl = document.querySelector('.product-price')
        const hasDiscount = productPriceEl?.classList.contains('has-discount')
        // Badge sconto deve essere dentro l'area product-prices per essere valido
        const discountBadge = productPricesArea?.querySelector('.discount-badge, .discount-percentage')

        // Solo se c'è un vero sconto (classe has-discount O badge sconto nell'area prezzi)
        if (hasDiscount || discountBadge) {
          const regularPriceEl = document.querySelector('.regular-price')
          if (regularPriceEl && regularPriceEl.textContent) {
            originalPrice = regularPriceEl.textContent.trim()
          }
        }

        // Disponibilità
        const availEl = document.querySelector('.product-availability, [itemprop="availability"]')
        const availability = availEl?.textContent?.toLowerCase() || ''
        const inStock = !availability.includes('esaurito') && !availability.includes('out of stock')

        // Specifiche tecniche
        const specs: Record<string, string> = {}
        document.querySelectorAll('.product-features tr, .data-sheet tr').forEach(row => {
          const key = row.querySelector('th, td:first-child')?.textContent?.trim()
          const value = row.querySelector('td:last-child')?.textContent?.trim()
          if (key && value && key !== value) {
            specs[key] = value
          }
        })

        return { description, currentPrice, originalPrice, inStock, specifications: specs }
      })

      // Aggiorna descrizione se trovata e più lunga
      if (details.description && details.description.length > (product.description?.length || 0)) {
        product.description = details.description
      }

      // Aggiorna prezzo se trovato nella pagina dettaglio
      if (details.currentPrice) {
        product.price = this.cleanPrice(details.currentPrice)
      }

      // Imposta originalPrice SOLO se c'è davvero uno sconto
      if (details.originalPrice) {
        product.originalPrice = this.cleanPrice(details.originalPrice)
      }

      product.inStock = details.inStock

      if (Object.keys(details.specifications).length > 0) {
        product.specifications = details.specifications
      }

      console.log(`    ✓ Dettagli estratti`)

    } catch (error) {
      console.log(`    ⚠️  Errore dettagli (continuo comunque)`)
    }

    return product
  }

  async downloadImage(imageUrl: string, productSlug: string): Promise<string | null> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      const ext = path.extname(new URL(imageUrl).pathname) || '.jpg'
      const filename = `${productSlug}${ext}`
      const localPath = path.join('public', 'images', 'products', filename)

      fs.writeFileSync(localPath, response.data)
      return `/images/products/${filename}`

    } catch (error) {
      console.error(`  ⚠️  Errore download immagine`)
      return null
    }
  }

  async downloadAllImages() {
    console.log(`\n📸 Download immagini (${this.products.length} totali)...\n`)

    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i]
      console.log(`[${i + 1}/${this.products.length}] ${product.slug}`)

      const localPath = await this.downloadImage(product.image, product.slug)
      if (localPath) {
        product.imageLocal = localPath
        console.log(`  ✅ Salvata`)
      }

      await this.delay(300)
    }
  }

  saveToJson(filename: string) {
    const outputPath = path.join(process.cwd(), 'data', filename)
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ products: this.products }, null, 2),
      'utf-8'
    )
    console.log(`\n💾 Salvati ${this.products.length} prodotti in: ${outputPath}`)
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private extractBrand(name: string): string {
    const brands = [
      'LeCont', 'Vega', 'Maxxis', 'MG', 'Komet', 'AIM', 'Alfano',
      'CRG', 'Tony Kart', 'Birel', 'IAME', 'ROK', 'Rotax',
      'Alpinestars', 'Sparco', 'OMP', 'Tillotson', 'Mondokart'
    ]

    for (const brand of brands) {
      if (name.toLowerCase().includes(brand.toLowerCase())) {
        return brand
      }
    }

    return 'Varie'
  }

  private cleanPrice(priceText: string): string {
    const match = priceText.match(/[\d.,]+/)
    if (match) {
      return match[0].replace(',', '.')
    }
    return '0.00'
  }

  private normalizeImageUrl(imageUrl: string): string {
    if (!imageUrl) return ''
    if (imageUrl.startsWith('http')) return imageUrl
    if (imageUrl.startsWith('//')) return `https:${imageUrl}`
    return `${this.baseUrl}${imageUrl}`
  }

  private normalizeUrl(url: string): string {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${this.baseUrl}${url}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

async function main() {
  const scraper = new PuppeteerScraper()

  const categoryUrl = 'https://www.mondokart.com/it/pastiglie-freno-mondokart/'
  const categoryName = 'freni-accessori'

  console.log(`
╔════════════════════════════════════════════════════════════╗
║      SCRAPER PUPPETEER MONDOKART - CBK RACING             ║
╚════════════════════════════════════════════════════════════╝

📋 Configurazione:
   • Categoria: Freni e Accessori (Pastiglie Freno)
   • URL: ${categoryUrl}
   • Limite: 10 prodotti (TEST)
   • Download immagini: SÌ
   • Metodo: Puppeteer (JavaScript dinamico)

`)

  // Scrape prodotti
  await scraper.scrapePage(categoryUrl, categoryName, 0) // 0 = tutti i prodotti

  // Download immagini
  if (scraper['products'].length > 0) {
    await scraper.downloadAllImages()
  }

  // Salva JSON
  const filename = `products-${categoryName}.json`
  scraper.saveToJson(filename)

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                 SCRAPING COMPLETATO!                       ║
╚════════════════════════════════════════════════════════════╝

📊 Statistiche:
   • Prodotti trovati: ${scraper['products'].length}
   • File JSON: data/${filename}
   • Immagini: public/images/products/

📝 Prossimi passi:
   1. Controlla i prodotti in data/${filename}
   2. Se ok, cambia il limite da 10 a 0 per importare tutti
   3. Copia i prodotti in data/products.json

💡 Per tutti i prodotti: maxProducts = 0 (riga 314)

`)
}

main().catch(console.error)
