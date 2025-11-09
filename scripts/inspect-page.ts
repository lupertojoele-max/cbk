import axios from 'axios'
import * as cheerio from 'cheerio'
import * as fs from 'fs'

async function inspectPage() {
  const url = 'https://www.mondokart.com/it/pastiglie-freno-mondokart/'

  console.log(`🔍 Ispezionando: ${url}\n`)

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  })

  const $ = cheerio.load(response.data)

  // Trova i prodotti
  const products = $('.js-product-miniature')
  console.log(`📦 Trovati ${products.length} prodotti\n`)

  // Analizza il primo prodotto in dettaglio
  if (products.length > 0) {
    const $first = $(products[0])

    console.log('=== STRUTTURA PRIMO PRODOTTO ===\n')

    // Prova a trovare il nome
    console.log('🏷️  NOME PRODOTTO:')
    const nameSelectors = [
      '.product-title',
      '.product-name',
      'h2',
      'h3',
      'h2 a',
      'h3 a',
      '.h3',
      'a[href*="product"]'
    ]

    nameSelectors.forEach(sel => {
      const text = $first.find(sel).first().text().trim()
      if (text) {
        console.log(`   ✓ ${sel}: "${text.substring(0, 80)}..."`)
      }
    })

    // Prova a trovare il link
    console.log('\n🔗 LINK PRODOTTO:')
    const linkSelectors = [
      'a',
      'a[href*="product"]',
      '.product-link',
      '[itemprop="url"]'
    ]

    linkSelectors.forEach(sel => {
      const href = $first.find(sel).first().attr('href')
      if (href && href.includes('http')) {
        console.log(`   ✓ ${sel}: ${href.substring(0, 80)}...`)
      } else if (href) {
        console.log(`   ✓ ${sel}: ${href}`)
      }
    })

    // Prova a trovare il prezzo
    console.log('\n💰 PREZZO:')
    const priceSelectors = [
      '.price',
      '.product-price',
      '[itemprop="price"]',
      '.current-price',
      'span.price'
    ]

    priceSelectors.forEach(sel => {
      const text = $first.find(sel).first().text().trim()
      if (text) {
        console.log(`   ✓ ${sel}: "${text}"`)
      }
    })

    // Salva HTML del primo prodotto
    console.log('\n💾 HTML primo prodotto salvato in product-sample.html')
    fs.writeFileSync('product-sample.html', $first.html() || '')

    // Salva anche la pagina completa
    console.log('💾 Pagina completa salvata in page-full.html\n')
    fs.writeFileSync('page-full.html', response.data)
  }
}

inspectPage().catch(console.error)
