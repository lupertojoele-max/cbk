import puppeteer from 'puppeteer'
import * as fs from 'fs'

async function inspectWithPuppeteer() {
  console.log(`🔍 Ispezione con Puppeteer della pagina MondoKart...\n`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

  const url = 'https://www.mondokart.com/it/pastiglie-freno-mondokart/'
  console.log(`📡 Navigando verso: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

  console.log(`⏳ Aspetto 3 secondi per il caricamento completo...`)
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Scroll per lazy loading
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log(`\n📊 Analisi della pagina...\n`)

  // Estrai informazioni sulla struttura
  const pageInfo = await page.evaluate(() => {
    const info: any = {
      selectors: {},
      firstProduct: null,
      allClasses: new Set<string>()
    }

    // Prova diversi selettori comuni
    const selectors = [
      '.js-product-miniature',
      '.product-miniature',
      '.product',
      'article',
      '[data-id-product]',
      '.product-item',
      '.item-product',
      '.grid-item',
      '.product-card',
      '[itemtype*="Product"]'
    ]

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector)
      info.selectors[selector] = elements.length
    }

    // Cerca elementi che contengono "pastiglie" o prezzo
    const allDivs = document.querySelectorAll('div, article, li, section')
    let productLikeElements = 0

    allDivs.forEach(el => {
      const text = el.textContent?.toLowerCase() || ''
      const hasPrice = text.includes('€') || text.includes('eur')
      const hasProduct = text.includes('pastiglie') || text.includes('freno')

      if (hasPrice && hasProduct && el.textContent && el.textContent.length < 500) {
        productLikeElements++

        // Salva il primo elemento trovato
        if (!info.firstProduct) {
          info.firstProduct = {
            tagName: el.tagName,
            className: el.className,
            innerHTML: el.innerHTML.substring(0, 1000),
            textContent: el.textContent.substring(0, 300)
          }
        }
      }

      // Raccogli tutte le classi
      if (el.className && typeof el.className === 'string') {
        el.className.split(' ').forEach(cls => {
          if (cls) info.allClasses.add(cls)
        })
      }
    })

    info.productLikeElements = productLikeElements

    return {
      ...info,
      allClasses: Array.from(info.allClasses).slice(0, 100) // Prime 100 classi
    }
  })

  console.log(`═══════════════════════════════════════════════════════════`)
  console.log(`RISULTATI SELETTORI:`)
  console.log(`═══════════════════════════════════════════════════════════`)

  for (const [selector, count] of Object.entries(pageInfo.selectors)) {
    if (count > 0) {
      console.log(`✅ ${selector}: ${count} elementi`)
    } else {
      console.log(`❌ ${selector}: 0 elementi`)
    }
  }

  console.log(`\n═══════════════════════════════════════════════════════════`)
  console.log(`ELEMENTI CHE SEMBRANO PRODOTTI: ${pageInfo.productLikeElements}`)
  console.log(`═══════════════════════════════════════════════════════════`)

  if (pageInfo.firstProduct) {
    console.log(`\nPRIMO ELEMENTO SIMILE A PRODOTTO:`)
    console.log(`Tag: ${pageInfo.firstProduct.tagName}`)
    console.log(`Classe: ${pageInfo.firstProduct.className}`)
    console.log(`\nTesto (primi 300 caratteri):`)
    console.log(pageInfo.firstProduct.textContent)

    // Salva HTML
    fs.writeFileSync('first-product-element.html', pageInfo.firstProduct.innerHTML)
    console.log(`\n💾 HTML salvato in: first-product-element.html`)
  }

  console.log(`\n═══════════════════════════════════════════════════════════`)
  console.log(`CLASSI CSS TROVATE (prime 50):`)
  console.log(`═══════════════════════════════════════════════════════════`)
  console.log(pageInfo.allClasses.slice(0, 50).join(', '))

  // Salva screenshot
  await page.screenshot({ path: 'mondokart-screenshot.png', fullPage: true })
  console.log(`\n📸 Screenshot salvato in: mondokart-screenshot.png`)

  // Salva HTML completo
  const html = await page.content()
  fs.writeFileSync('mondokart-full.html', html)
  console.log(`💾 HTML completo salvato in: mondokart-full.html`)

  await browser.close()
  console.log(`\n✅ Ispezione completata!`)
}

inspectWithPuppeteer().catch(console.error)
