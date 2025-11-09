import puppeteer from 'puppeteer'

async function debugDiscounts() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Test prodotti con e senza sconto
  const testProducts = [
    {
      name: 'Pastiglia posteriore standard',
      url: 'https://www.mondokart.com/it/telaio-accessori/freni-e-accessori-mondokart/pastiglie-freno-mondokart/pastiglia-freno-posteriore-standard-karting.html'
    },
    {
      name: 'Pastiglia CRG V05 anteriore',
      url: 'https://www.mondokart.com/it/telaio-accessori/freni-e-accessori-mondokart/pastiglie-freno-mondokart/pastiglia-freno-compatibile-crg-v05-anteriore.html'
    },
    {
      name: 'Pastiglia AZZURRA CRG',
      url: 'https://www.mondokart.com/it/telaio-accessori/freni-e-accessori-mondokart/pastiglie-freno-mondokart/pastiglie-freno-posteriore-blu-v05-v09-v10-v11-v13-crg.html'
    }
  ]

  for (const product of testProducts) {
    console.log(`\n═══════════════════════════════════════`)
    console.log(`PRODOTTO: ${product.name}`)
    console.log(`═══════════════════════════════════════`)

    await page.goto(product.url, { waitUntil: 'networkidle2' })

    const priceInfo = await page.evaluate(() => {
      const info: any = {}

      // Prezzo corrente
      const currentPriceEl = document.querySelector('.current-price-value')
      info.currentPrice = currentPriceEl?.getAttribute('content') || currentPriceEl?.textContent?.trim()

      // Prezzo regolare/scontato
      const regularPriceEl = document.querySelector('.regular-price')
      info.regularPrice = regularPriceEl?.textContent?.trim() || null
      info.hasRegularPriceElement = !!regularPriceEl

      // Verifica badge sconto
      const discountBadge = document.querySelector('.discount-percentage, .discount-amount, .product-flag.discount')
      info.hasDiscountBadge = !!discountBadge
      info.discountBadgeText = discountBadge?.textContent?.trim() || null

      // HTML del blocco prezzi
      const priceBlock = document.querySelector('.product-prices')
      info.priceBlockHTML = priceBlock?.innerHTML.substring(0, 500) || null

      return info
    })

    console.log('Prezzo Corrente:', priceInfo.currentPrice)
    console.log('Prezzo Regolare:', priceInfo.regularPrice)
    console.log('Elemento .regular-price presente?', priceInfo.hasRegularPriceElement)
    console.log('Badge sconto presente?', priceInfo.hasDiscountBadge)
    console.log('Testo badge sconto:', priceInfo.discountBadgeText)
    console.log('\nHTML blocco prezzi (primi 500 char):')
    console.log(priceInfo.priceBlockHTML)
  }

  await browser.close()
}

debugDiscounts().catch(console.error)
