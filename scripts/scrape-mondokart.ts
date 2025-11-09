import axios from 'axios'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'

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
}

class MondoKartScraper {
  private baseUrl = 'https://www.mondokart.com'
  private products: Product[] = []

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

  async scrapeCategoryPage(categoryUrl: string, category: string): Promise<Product[]> {
    try {
      console.log(`\n🔍 Scraping categoria: ${categoryUrl}`)

      const response = await axios.get(categoryUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        }
      })

      const $ = cheerio.load(response.data)
      const products: Product[] = []

      // Selettori multipli per MondoKart (prova tutti questi)
      const selectors = [
        '.product-item',
        '.product-card',
        '.item-product',
        '.product-miniature',
        '.js-product-miniature',
        '.product-container',
        'article[data-id-product]',
        '.product',
        '.ajax_block_product'
      ]

      let productElements: cheerio.Cheerio | null = null

      // Trova il selettore che funziona
      for (const selector of selectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          productElements = elements
          console.log(`  ℹ️  Trovato selettore: ${selector} (${elements.length} prodotti)`)
          break
        }
      }

      if (!productElements || productElements.length === 0) {
        console.log(`  ⚠️  Nessun prodotto trovato. Salvo HTML per analisi...`)
        fs.writeFileSync('debug-page.html', response.data)
        console.log(`  💾 HTML salvato in debug-page.html - analizza la struttura`)
        return []
      }

      productElements.each((index: number, element: cheerio.Element) => {
        try {
          const $el = $(element)

          // Estrai TUTTO il testo esattamente come appare
          const nameSelectors = [
            '.product-title',
            '.product-name',
            'h2.product-title',
            'h3.product-title',
            '.h3.product-title',
            'a.product-name',
            '.product-title a',
            'h2 a',
            'h3 a'
          ]

          let name = ''
          for (const sel of nameSelectors) {
            name = $el.find(sel).first().text().trim()
            if (name) break
          }

          // Estrai prezzo ESATTO
          const priceSelectors = [
            '.product-price',
            '.price',
            '.current-price',
            '.product-price-and-shipping',
            'span.price',
            '.price-final',
            '[itemprop="price"]'
          ]

          let priceText = ''
          for (const sel of priceSelectors) {
            priceText = $el.find(sel).first().text().trim()
            if (priceText && /[\d.,]+/.test(priceText)) break
          }

          // Estrai descrizione breve se disponibile
          const descriptionSelectors = [
            '.product-description',
            '.product-desc',
            '.short-description',
            '.product-short-description'
          ]

          let shortDescription = ''
          for (const sel of descriptionSelectors) {
            shortDescription = $el.find(sel).first().text().trim()
            if (shortDescription) break
          }

          // Estrai immagine (prova src, data-src, srcset)
          const $img = $el.find('img').first()
          let imageUrl = $img.attr('src') ||
                        $img.attr('data-src') ||
                        $img.attr('data-lazy-src') ||
                        $img.attr('srcset')?.split(',')[0]?.split(' ')[0] || ''

          // Estrai link prodotto
          const $link = $el.find('a').first()
          const productLink = $link.attr('href') || ''

          if (!name || !productLink) {
            console.log(`  ⚠️  Prodotto ${index + 1}: mancano dati essenziali, salto`)
            return
          }

          // Genera slug dal nome ESATTO
          const slug = this.generateSlug(name)

          // Estrai brand dal nome
          const brand = this.extractBrand(name)

          // Pulisci prezzo ma MANTIENI formato originale
          const price = this.cleanPrice(priceText)

          const product: Product = {
            id: `mk-${Date.now()}-${index}`,
            name: name, // NOME ESATTO
            slug,
            category,
            brand,
            price,
            image: this.normalizeImageUrl(imageUrl),
            description: shortDescription || '', // Descrizione dalla lista
            inStock: true,
            mondokartUrl: this.normalizeUrl(productLink)
          }

          products.push(product)
          console.log(`  ✅ ${products.length}. ${name}`)
          console.log(`     💰 ${priceText}`)
          if (shortDescription) {
            console.log(`     📝 ${shortDescription.substring(0, 50)}...`)
          }

        } catch (error) {
          console.error(`  ❌ Errore elaborazione prodotto ${index}:`, error)
        }
      })

      console.log(`\n📦 Trovati ${products.length} prodotti in questa pagina\n`)
      return products

    } catch (error) {
      console.error(`❌ Errore scraping categoria:`, error)
      return []
    }
  }

  async scrapeProductDetail(product: Product): Promise<Product> {
    try {
      console.log(`    📄 Dettagli: ${product.name}`)

      const response = await axios.get(product.mondokartUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'it-IT,it;q=0.9'
        }
      })

      const $ = cheerio.load(response.data)

      // Estrai descrizione COMPLETA esattamente come appare
      const descriptionSelectors = [
        '#description',
        '.product-description',
        '.description',
        '.product-detail-description',
        '[itemprop="description"]',
        '.rte-content',
        '.product-full-description',
        '.tab-content #description'
      ]

      let fullDescription = ''
      for (const sel of descriptionSelectors) {
        fullDescription = $(sel).first().text().trim()
        if (fullDescription && fullDescription.length > 50) break
      }

      if (fullDescription) {
        product.description = fullDescription
      }

      // Estrai prezzo se non presente (dalla pagina dettaglio)
      if (!product.price || product.price === '0.00') {
        const priceSelectors = [
          '.current-price span[itemprop="price"]',
          '.product-price',
          '.current-price-value',
          '[itemprop="price"]'
        ]

        for (const sel of priceSelectors) {
          const priceText = $(sel).first().text().trim()
          if (priceText && /[\d.,]+/.test(priceText)) {
            product.price = this.cleanPrice(priceText)
            break
          }
        }
      }

      // Estrai prezzo originale (se scontato)
      const originalPriceSelectors = [
        '.regular-price',
        '.old-price',
        '.product-discount s',
        'span.regular-price'
      ]

      for (const sel of originalPriceSelectors) {
        const originalPriceText = $(sel).first().text().trim()
        if (originalPriceText && /[\d.,]+/.test(originalPriceText)) {
          product.originalPrice = this.cleanPrice(originalPriceText)
          break
        }
      }

      // Estrai specifiche tecniche
      const specifications: Record<string, string> = {}

      // Prova diversi formati di specifiche
      $('.product-features tr, .specifications tr, .data-sheet tr').each((_i: number, el: cheerio.Element) => {
        const $el = $(el)
        const key = $el.find('th, td:first-child, .label, strong').first().text().trim()
        const value = $el.find('td:last-child, .value, span').last().text().trim()
        if (key && value && key !== value) {
          specifications[key] = value
        }
      })

      // Prova anche liste
      $('.product-features li, .specifications li').each((_i: number, el: cheerio.Element) => {
        const $el = $(el)
        const text = $el.text().trim()
        const parts = text.split(':')
        if (parts.length === 2) {
          specifications[parts[0].trim()] = parts[1].trim()
        }
      })

      if (Object.keys(specifications).length > 0) {
        product.specifications = specifications
      }

      // Verifica disponibilità
      const availability = $('.product-availability, .availability, [itemprop="availability"]').first().text().toLowerCase()
      product.inStock = !availability.includes('esaurito') && !availability.includes('out of stock')

      return product

    } catch (error) {
      console.error(`  ⚠️  Errore dettagli per ${product.name}`)
      return product
    }
  }

  async downloadImage(imageUrl: string, productSlug: string): Promise<string | null> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
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

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private extractBrand(name: string): string {
    const brands = ['LeCont', 'Vega', 'Maxxis', 'MG', 'Komet', 'AIM', 'Alfano',
                    'CRG', 'Tony Kart', 'Birel', 'IAME', 'ROK', 'Rotax', 'Alpinestars',
                    'Sparco', 'OMP', 'Tillotson']

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

  saveToJson(filename: string = 'products.json') {
    const outputPath = path.join(process.cwd(), 'data', filename)
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ products: this.products }, null, 2),
      'utf-8'
    )
    console.log(`\n💾 Salvati ${this.products.length} prodotti in: ${outputPath}`)
  }

  async run(categoryUrl: string, categoryName: string, downloadImages: boolean = false, maxProducts: number = 0) {
    console.log(`\n🚀 Inizio scraping MondoKart...`)
    console.log(`📂 Categoria: ${categoryName}`)
    console.log(`🔗 URL: ${categoryUrl}`)
    console.log(`📥 Download immagini: ${downloadImages ? 'SÌ' : 'NO'}`)
    console.log(`🔢 Limite prodotti: ${maxProducts > 0 ? maxProducts : 'TUTTI'}\n`)

    // Step 1: Scrape lista prodotti
    const products = await this.scrapeCategoryPage(categoryUrl, categoryName)

    if (products.length === 0) {
      console.log(`\n⚠️  Nessun prodotto trovato. Verifica l'URL e i selettori CSS.\n`)
      console.log(`💡 Controlla il file debug-page.html per vedere la struttura HTML\n`)
      return
    }

    // Limita prodotti se richiesto
    const productsToProcess = maxProducts > 0 ? products.slice(0, maxProducts) : products

    // Step 2: Scrape dettagli COMPLETI per ogni prodotto
    console.log(`\n📝 Recupero dettagli completi...`)
    console.log(`📦 Processando ${productsToProcess.length} prodotti\n`)

    for (let i = 0; i < productsToProcess.length; i++) {
      console.log(`[${i + 1}/${productsToProcess.length}] ${productsToProcess[i].name}`)
      await this.scrapeProductDetail(productsToProcess[i])
      await this.delay(500) // Rate limiting - rispetta il server
    }

    // Step 3: Download TUTTE le immagini in alta qualità
    if (downloadImages) {
      console.log(`\n📸 Download immagini (alta qualità)...`)
      console.log(`🖼️  ${productsToProcess.length} immagini da scaricare\n`)

      for (let i = 0; i < productsToProcess.length; i++) {
        const product = productsToProcess[i]
        console.log(`[${i + 1}/${productsToProcess.length}] Scarico: ${product.slug}`)

        const localPath = await this.downloadImage(product.image, product.slug)
        if (localPath) {
          product.imageLocal = localPath
          console.log(`  ✅ Salvata: ${localPath}`)
        } else {
          console.log(`  ⚠️  Errore download, uso URL esterno`)
        }

        await this.delay(300) // Rate limiting
      }
    }

    this.products = productsToProcess
    const filename = `products-${categoryName}.json`
    this.saveToJson(filename)

    // Statistiche finali
    console.log(`\n✅ ========== SCRAPING COMPLETATO! ==========`)
    console.log(`📊 Totale prodotti: ${this.products.length}`)
    console.log(`💾 File JSON: data/${filename}`)
    if (downloadImages) {
      const downloadedImages = this.products.filter(p => p.imageLocal).length
      console.log(`🖼️  Immagini scaricate: ${downloadedImages}/${this.products.length}`)
      console.log(`📁 Cartella immagini: public/images/products/`)
    }
    console.log(`\n🎯 Prossimo passo: Copia i prodotti da data/${filename}`)
    console.log(`               in data/products.json`)
    console.log(`===============================================\n`)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ESEMPIO DI UTILIZZO
// Esegui con: npx ts-node scripts/scrape-mondokart.ts

async function main() {
  const scraper = new MondoKartScraper()

  // URL Pastiglie Freno da MondoKart
  const categoryUrl = 'https://www.mondokart.com/it/pastiglie-freno-mondokart/'
  const categoryName = 'freni-accessori'

  console.log(`
╔════════════════════════════════════════════════════════════╗
║         SCRAPER PRODOTTI MONDOKART - CBK RACING           ║
╚════════════════════════════════════════════════════════════╝

📋 Configurazione:
   • Categoria: Freni e Accessori (Pastiglie Freno)
   • URL: ${categoryUrl}
   • Limite: 10 prodotti (TEST)
   • Download immagini: SÌ

`)

  await scraper.run(
    categoryUrl,
    categoryName,
    true,  // scarica immagini
    10     // LIMITE: solo 10 prodotti per il test
  )

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    TEST COMPLETATO!                        ║
╚════════════════════════════════════════════════════════════╝

📝 Prossimi passi:
   1. Controlla i prodotti in: data/products-${categoryName}.json
   2. Verifica le immagini in: public/images/products/
   3. Se tutto ok, rilancia senza limite per importare tutti i prodotti

💡 Per importare TUTTI i prodotti, modifica lo script:
   Cambia 'maxProducts: 10' in 'maxProducts: 0'

`)
}

main().catch(console.error)
