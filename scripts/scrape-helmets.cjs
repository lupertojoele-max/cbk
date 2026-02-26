/**
 * Scraper per CASCHI e ACCESSORI CASCHI da mondokart.com
 * Categorie: caschi (tutte le marche) + accessori caschi
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SUBCATEGORIES = [
  'https://www.mondokart.com/it/caschi-bell/',
  'https://www.mondokart.com/it/caschi-stilo/',
  'https://www.mondokart.com/it/caschi-omp-mondokart/',
  'https://www.mondokart.com/it/caschi-sparco-mondokart/',
  'https://www.mondokart.com/it/caschi-arai-mondokart/',
  'https://www.mondokart.com/it/caschi-schuberth/',
  'https://www.mondokart.com/it/caschi-zamp/',
  'https://www.mondokart.com/it/accessori-caschi/',
];

const ID_PREFIX = 'mk-casco';
const OUTPUT_FILE = 'helmets-data.json';

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
    { pattern: /\bbell\b/i, brand: 'Bell' },
    { pattern: /\bstilo\b/i, brand: 'Stilo' },
    { pattern: /\bomp\b/i, brand: 'OMP' },
    { pattern: /\bsparco\b/i, brand: 'Sparco' },
    { pattern: /\barai\b/i, brand: 'Arai' },
    { pattern: /\bschuberth\b/i, brand: 'Schuberth' },
    { pattern: /\bzamp\b/i, brand: 'Zamp' },
    { pattern: /\balpinestars\b/i, brand: 'Alpinestars' },
    { pattern: /\btonykart|tony\s*kart|otk\b/i, brand: 'TonyKart OTK' },
    { pattern: /\bcrg\b/i, brand: 'CRG' },
    { pattern: /\bbirel\b/i, brand: 'Birel' },
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return 'CBK Racing';
}

async function scrapePage(page, url) {
  const products = [];
  let currentPage = 1;

  while (true) {
    const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`;
    console.log(`  📄 Scraping: ${pageUrl}`);

    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Scroll to load images
      await page.evaluate(async () => {
        for (let i = 0; i < 5; i++) {
          window.scrollBy(0, 500);
          await new Promise(r => setTimeout(r, 300));
        }
        window.scrollTo(0, 0);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const pageProducts = await page.evaluate(() => {
        const items = [];
        const cards = document.querySelectorAll('.js-product-miniature');

        cards.forEach(card => {
          try {
            const imageEl = card.querySelector('img');
            const priceEl = card.querySelector('.price');
            const linkEl = card.querySelector('a');

            const name = imageEl ? imageEl.getAttribute('alt') : null;
            if (!name || !priceEl) return;

            let imageUrl = '';
            if (imageEl) {
              imageUrl = imageEl.getAttribute('data-full-size-image-url') ||
                        imageEl.getAttribute('data-src') ||
                        imageEl.getAttribute('src') || '';
              imageUrl = imageUrl.replace('square_home_default', 'large_default');
            }

            const productUrl = linkEl ? linkEl.href : '';

            const IVA = 1.22;
            const regularPriceEl = card.querySelector('.product-prices .regular-price');
            let mainPrice = 0;
            let discountedPrice = null;

            if (regularPriceEl) {
              let regPrice = regularPriceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              mainPrice = (parseFloat(regPrice) || 0) * IVA;
              let salePrice = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              discountedPrice = ((parseFloat(salePrice) || 0) * IVA) || null;
            } else {
              let price = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              mainPrice = (parseFloat(price) || 0) * IVA;
            }

            if (mainPrice > 0) {
              items.push({
                name: name.trim(),
                price: mainPrice.toFixed(2),
                discountedPrice: discountedPrice ? discountedPrice.toFixed(2) : null,
                imageUrl,
                productUrl
              });
            }
          } catch (e) {}
        });

        return items;
      });

      console.log(`     Found ${pageProducts.length} products`);
      if (pageProducts.length === 0) break;

      products.push(...pageProducts);

      const hasNextPage = await page.evaluate(() => {
        const nextBtn = document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled)');
        return !!nextBtn;
      });

      if (!hasNextPage) break;
      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (e) {
      console.error(`  ❌ Error on ${pageUrl}:`, e.message);
      break;
    }
  }

  return products;
}

async function scrapeProducts() {
  console.log('🚀 Starting Caschi scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  let allProducts = [];

  try {
    for (const url of SUBCATEGORIES) {
      console.log(`\n📂 Category: ${url}`);
      const products = await scrapePage(page, url);
      allProducts.push(...products);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n✅ Total products scraped: ${allProducts.length}`);

    // Deduplicate by name
    const seen = new Set();
    const unique = allProducts.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    console.log(`✅ After deduplication: ${unique.length}`);

    const processedProducts = unique.map((product, index) => {
      const cleanedName = cleanName(product.name);
      const slug = slugify(cleanedName);
      const brand = extractBrand(product.name);

      return {
        id: `${ID_PREFIX}-${index + 1}`,
        name: cleanedName,
        slug,
        brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`,
        productUrl: product.productUrl
      };
    });

    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);

    const brandCounts = {};
    processedProducts.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    console.log('\n📊 Brands:');
    Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).forEach(([b, c]) => {
      console.log(`   ${b}: ${c}`);
    });

    await browser.close();
    return processedProducts;

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

scrapeProducts().then(products => {
  console.log(`\n🎉 Caschi scraping completato! ${products.length} prodotti.`);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
