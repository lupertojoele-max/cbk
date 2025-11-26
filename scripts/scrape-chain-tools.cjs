const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/it/estrattori-smagliatori-mondokart/';

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
    { pattern: /regina/i, brand: 'Regina' },
    { pattern: /did/i, brand: 'DID' },
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return 'CBK Racing';
}

async function scrapeProducts() {
  console.log('🚀 Starting Mondokart Chain Tools scraper...\n');

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
              let price = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              price = parseFloat(price) || 0;

              let imageUrl = '';
              if (imageEl) {
                imageUrl = imageEl.getAttribute('data-full-size-image-url') ||
                          imageEl.getAttribute('data-src') ||
                          imageEl.getAttribute('src') || '';
                imageUrl = imageUrl.replace('square_home_default', 'large_default');
              }

              const productUrl = linkEl ? linkEl.href : '';

              let originalPrice = null;
              const regularPriceEl = card.querySelector('.product-prices .regular-price');
              if (regularPriceEl) {
                let regPrice = regularPriceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
                originalPrice = parseFloat(regPrice) || null;
              }

              items.push({
                name: name.trim(),
                price: price.toFixed(2),
                originalPrice: originalPrice ? originalPrice.toFixed(2) : null,
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
        id: `mk-estrattore-${index + 1}`,
        name: cleanedName,
        slug: slug,
        brand: brand,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`,
        productUrl: product.productUrl
      };
    });

    // Save data
    const outputPath = path.join(__dirname, 'chain-tools-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);

    // Print summary
    console.log('\n📊 Products:');
    processedProducts.forEach(p => {
      console.log(`   - ${p.name.substring(0, 55)}... (${p.brand}) €${p.price}`);
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

    await browser.close();
    return processedProducts;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

scrapeProducts().then(products => {
  console.log(`\n🎉 Scraping completed! ${products.length} chain tools found.`);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
