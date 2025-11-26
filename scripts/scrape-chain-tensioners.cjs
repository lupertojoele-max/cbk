const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/it/tendicatena-e-viti-mondokart/';
const ID_PREFIX = 'mk-tendicatena';
const OUTPUT_FILE = 'chain-tensioners-data.json';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

function cleanName(name) {
  return name
    .replace(/,?\s*MONDOKART,?\s*/gi, ' ')
    .replace(/,?\s*mondokart,?\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*karting\s*$/gi, '')
    .replace(/,\s*$/g, '')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractBrand(name) {
  const brandPatterns = [
    { pattern: /tonykart|tony\s*kart|otk/i, brand: 'TonyKart OTK' },
    { pattern: /birel|freeline/i, brand: 'Birel' },
    { pattern: /crg/i, brand: 'CRG' },
    { pattern: /intrepid/i, brand: 'Intrepid' },
    { pattern: /wildkart|wild\s*kart/i, brand: 'WildKart' },
    { pattern: /top\s*kart|topkart/i, brand: 'Top-Kart' },
    { pattern: /pcr/i, brand: 'PCR' },
    { pattern: /righetti|ridolfi/i, brand: 'Righetti Ridolfi' },
    { pattern: /parolin/i, brand: 'Parolin' },
    { pattern: /kart\s*republic|kr/i, brand: 'Kart Republic' },
    { pattern: /kosmic/i, brand: 'Kosmic' },
    { pattern: /exprit/i, brand: 'Exprit' },
    { pattern: /sniper/i, brand: 'Sniper' },
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return 'CBK Racing';
}

async function scrapeProducts() {
  console.log('🚀 Starting Mondokart Chain Tensioners scraper...\n');
  console.log(`📍 URL: ${MONDOKART_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  let allProducts = [];
  let currentPage = 1;

  try {
    while (true) {
      const url = currentPage === 1 ? MONDOKART_URL : `${MONDOKART_URL}?page=${currentPage}`;
      console.log(`📄 Scraping page ${currentPage}: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Scroll to load all images
      await page.evaluate(async () => {
        for (let i = 0; i < 5; i++) {
          window.scrollBy(0, 500);
          await new Promise(r => setTimeout(r, 300));
        }
        window.scrollTo(0, 0);
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const products = await page.evaluate(() => {
        const items = [];
        const productCards = document.querySelectorAll('.js-product-miniature');

        productCards.forEach(card => {
          try {
            const imageEl = card.querySelector('img');
            const priceEl = card.querySelector('.price');
            const linkEl = card.querySelector('a');

            const name = imageEl ? imageEl.getAttribute('alt') : null;

            if (name && priceEl) {
              let imageUrl = '';
              if (imageEl) {
                imageUrl = imageEl.getAttribute('data-full-size-image-url') ||
                          imageEl.getAttribute('data-src') ||
                          imageEl.getAttribute('src') || '';
                imageUrl = imageUrl.replace('square_home_default', 'large_default');
              }

              const productUrl = linkEl ? linkEl.href : '';

              // LOGICA PREZZI CORRETTA:
              // - Se c'è .regular-price -> è il prezzo ORIGINALE (barrato), .price è lo sconto
              // - Se NON c'è .regular-price -> .price è il prezzo normale (nessuno sconto)
              // - Aggiungiamo IVA 22% perché il sito mostra prezzi senza IVA allo scraper
              const IVA = 1.22;
              const regularPriceEl = card.querySelector('.product-prices .regular-price');
              let mainPrice = 0;
              let discountedPrice = null;

              if (regularPriceEl) {
                // C'è uno sconto: regular-price è l'originale, .price è lo scontato
                let regPrice = regularPriceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
                mainPrice = (parseFloat(regPrice) || 0) * IVA;

                let salePrice = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
                discountedPrice = ((parseFloat(salePrice) || 0) * IVA) || null;
              } else {
                // Nessuno sconto: .price è il prezzo normale
                let price = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
                mainPrice = (parseFloat(price) || 0) * IVA;
              }

              items.push({
                name: name.trim(),
                price: mainPrice.toFixed(2),
                discountedPrice: discountedPrice ? discountedPrice.toFixed(2) : null,
                imageUrl,
                productUrl
              });
            }
          } catch (e) {
            console.error('Error parsing product:', e);
          }
        });

        return items;
      });

      console.log(`   Found ${products.length} products on page ${currentPage}`);

      if (products.length === 0) {
        console.log('   No more products found, stopping pagination.');
        break;
      }

      allProducts = allProducts.concat(products);

      // Check for next page
      const hasNextPage = await page.evaluate(() => {
        const nextBtn = document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled)');
        return !!nextBtn;
      });

      if (!hasNextPage) {
        console.log('   No next page found, stopping pagination.');
        break;
      }

      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n✅ Total products scraped: ${allProducts.length}`);

    // Process products
    const processedProducts = allProducts.map((product, index) => {
      const cleanedName = cleanName(product.name);
      const slug = slugify(cleanedName);
      const brand = extractBrand(product.name);

      return {
        id: `${ID_PREFIX}-${index + 1}`,
        name: cleanedName,
        slug: slug,
        brand: brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`,
        productUrl: product.productUrl
      };
    });

    // Save data
    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);

    // Print summary
    console.log('\n📊 Products:');
    processedProducts.forEach(p => {
      const priceInfo = p.discountedPrice
        ? `€${p.price} -> €${p.discountedPrice} (SCONTO)`
        : `€${p.price}`;
      console.log(`   - ${p.name.substring(0, 45)}... (${p.brand}) ${priceInfo}`);
    });

    // Print brands summary
    const brandCounts = {};
    processedProducts.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    console.log('\n📊 Brands breakdown:');
    Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
      console.log(`   ${brand}: ${count}`);
    });

    // Print discount summary
    const discounted = processedProducts.filter(p => p.discountedPrice);
    console.log(`\n💰 Products with discount: ${discounted.length}/${processedProducts.length}`);

    await browser.close();
    return processedProducts;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

scrapeProducts().then(products => {
  console.log(`\n🎉 Scraping completed! ${products.length} chain tensioners found.`);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
