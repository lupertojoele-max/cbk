const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Sottocategorie di carenature (basate sulla lista utente)
const SUBCATEGORIES = [
  // Carenature CRG (contiene sottocategorie, le scrape tutte)
  'https://www.mondokart.com/it/carenature-e-supporti-crg-mondokart/',
  'https://www.mondokart.com/it/carenature-mini-crg/',
  'https://www.mondokart.com/it/carenature-kg-na2-na3-crg/',

  // Carenature Birel Freeline BirelArt
  'https://www.mondokart.com/it/carenature-birel-freeline-birelart-mondokart/',

  // Carenature Tony Kart - OTK
  'https://www.mondokart.com/it/carenature-m10-m11/',
  'https://www.mondokart.com/it/carenature-m6/',
  'https://www.mondokart.com/it/carenature-m4-mondokart/',
  'https://www.mondokart.com/it/carenature-m5-m8-m9-mini/',
  'https://www.mondokart.com/it/paraurti-posteriori-otk-mondokart/',

  // Carenature Top-Kart
  'https://www.mondokart.com/it/carenature-topkart-mondokart/',

  // Carenature Parolin
  'https://www.mondokart.com/it/carenature-mini-parolin-kart/',
  'https://www.mondokart.com/it/carenature-ok-okj-kz-parolin/',

  // Frontalino portanumero KG
  'https://www.mondokart.com/it/frontalino-portanumero-kg-mondokart/',

  // Spoiler anteriori KG
  'https://www.mondokart.com/it/spoiler-anteriori-kg-mondokart/',

  // Spoiler posteriori
  'https://www.mondokart.com/it/spoiler-posteriori-mondokart/',

  // Carenature laterali KG
  'https://www.mondokart.com/it/carenature-laterali-kg-mondokart/',

  // Supporti carenature
  'https://www.mondokart.com/it/supporti-carenature-mondokart/',

  // Accessori carenature
  'https://www.mondokart.com/it/accessori-carenature-mondokart/',
];

const ID_PREFIX = 'mk-carenatura';
const OUTPUT_FILE = 'fairings-data.json';

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
    { pattern: /birel|freeline|birelart/i, brand: 'Birel' },
    { pattern: /crg/i, brand: 'CRG' },
    { pattern: /intrepid/i, brand: 'Intrepid' },
    { pattern: /wildkart|wild\s*kart/i, brand: 'WildKart' },
    { pattern: /top\s*kart|topkart/i, brand: 'Top-Kart' },
    { pattern: /pcr/i, brand: 'PCR' },
    { pattern: /righetti|ridolfi/i, brand: 'Righetti Ridolfi' },
    { pattern: /parolin/i, brand: 'Parolin' },
    { pattern: /kart\s*republic|kr\b/i, brand: 'Kart Republic' },
    { pattern: /kosmic/i, brand: 'Kosmic' },
    { pattern: /exprit/i, brand: 'Exprit' },
    { pattern: /zanardi/i, brand: 'Zanardi' },
    { pattern: /praga/i, brand: 'Praga' },
    { pattern: /ipk|formula\s*k/i, brand: 'IPK' },
    { pattern: /easykart/i, brand: 'EasyKart' },
    { pattern: /kg\s/i, brand: 'KG' },
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return 'CBK Racing';
}

async function scrapeSubcategory(page, url) {
  let allProducts = [];
  let currentPage = 1;

  while (true) {
    const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`;

    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

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

            // LOGICA PREZZI con IVA 22%
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

    if (products.length === 0) {
      break;
    }

    allProducts = allProducts.concat(products);

    // Check for next page
    const hasNextPage = await page.evaluate(() => {
      const nextBtn = document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled)');
      return !!nextBtn;
    });

    if (!hasNextPage) {
      break;
    }

    currentPage++;
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  return allProducts;
}

async function scrapeProducts() {
  console.log('🚀 Starting Mondokart Fairings scraper...\n');
  console.log(`📍 ${SUBCATEGORIES.length} subcategories to scrape\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  let allProducts = [];

  try {
    for (let i = 0; i < SUBCATEGORIES.length; i++) {
      const url = SUBCATEGORIES[i];
      const categoryName = url.split('/').filter(Boolean).pop().replace('-mondokart', '');

      console.log(`📂 [${i + 1}/${SUBCATEGORIES.length}] Scraping: ${categoryName}`);

      const products = await scrapeSubcategory(page, url);
      console.log(`   Found ${products.length} products`);

      allProducts = allProducts.concat(products);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✅ Total products scraped: ${allProducts.length}`);

    // Remove duplicates by productUrl
    const uniqueProducts = [...new Map(allProducts.map(p => [p.productUrl, p])).values()];
    console.log(`📊 After removing duplicates: ${uniqueProducts.length}`);

    // Process products
    const processedProducts = uniqueProducts.map((product, index) => {
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
  console.log(`\n🎉 Scraping completed! ${products.length} fairings found.`);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
