import puppeteer from 'puppeteer'

async function debugPrices() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Test con un prodotto che ha prezzo 0.00
  const testUrl = 'https://www.mondokart.com/it/telaio-accessori/freni-e-accessori-mondokart/pastiglie-freno-mondokart/pastiglia-speciale-145mm-freno-posteriore-v05-v09-v10-v11-v13-crg.html'

  console.log(`\n🔍 Debug prezzi per: ${testUrl}\n`)

  await page.goto(testUrl, { waitUntil: 'networkidle2' })

  const priceInfo = await page.evaluate(() => {
    const info: any = {}

    // Tutti i possibili selettori prezzo
    const selectors = [
      '.current-price [itemprop="price"]',
      '.product-price',
      '.current-price-value',
      '[itemprop="price"]',
      '.product-prices',
      '.price',
      'span[itemprop="price"]'
    ]

    info.selectors = {}

    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el) {
        info.selectors[sel] = {
          textContent: el.textContent?.trim(),
          content: el.getAttribute('content'),
          innerHTML: el.innerHTML.substring(0, 200)
        }
      }
    }

    // Cerca qualsiasi elemento che contiene "€"
    const allText = document.body.innerText
    const priceMatches = allText.match(/€\s*[\d.,]+/g)
    info.pricesFound = priceMatches || []

    return info
  })

  console.log('═══════════════════════════════════════')
  console.log('RISULTATI SELETTORI PREZZO:')
  console.log('═══════════════════════════════════════')
  console.log(JSON.stringify(priceInfo.selectors, null, 2))

  console.log('\n═══════════════════════════════════════')
  console.log('PREZZI TROVATI NEL TESTO:')
  console.log('═══════════════════════════════════════')
  console.log(priceInfo.pricesFound)

  await browser.close()
}

debugPrices().catch(console.error)
