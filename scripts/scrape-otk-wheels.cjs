const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MONDOKART_URLS = [
  'https://www.mondokart.com/it/cerchi-otk-mondokart/',
  'https://www.mondokart.com/it/cerchi-otk-mondokart/?page=2'
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

(async () => {
  console.log('🚀 Starting OTK Wheels scraper...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  let allProducts = [];

  for (const url of MONDOKART_URLS) {
    console.log('📄 Loading page:', url);
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('⏳ Waiting for products to load...\n');

    try {
      await page.waitForSelector('.js-product-miniature', { timeout: 30000 });
    } catch (e) {
      console.log('⚠️ No products found on this page, skipping...');
      continue;
    }

    // Scroll to load all products
    let previousCount = 0;
    let unchangedCount = 0;
    let maxScrollAttempts = 20;

    console.log('🔄 Loading all products with infinite scroll...\n');

    for (let i = 0; i < maxScrollAttempts; i++) {
      await autoScroll(page);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('.js-product-miniature').length;
      });

      console.log(`Scroll attempt ${i + 1}/${maxScrollAttempts}: Found ${currentCount} products`);

      if (currentCount === previousCount) {
        unchangedCount++;
        if (unchangedCount >= 3) {
          console.log('\n✓ No new products loaded. All products loaded!\n');
          break;
        }
      } else {
        unchangedCount = 0;
      }

      previousCount = currentCount;
    }

    console.log('🔍 Extracting product data...\n');

    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('.js-product-miniature');
      const results = [];

      productCards.forEach((card, index) => {
        try {
          const imageEl = card.querySelector('.product-thumbnail img') ||
                         card.querySelector('img[loading="lazy"]') ||
                         card.querySelector('img');

          let name = '';
          if (imageEl && imageEl.alt) {
            name = imageEl.alt.trim();
          }

          if (!name || name === 'Offerta') {
            const nameEl = card.querySelector('.product-title a') ||
                          card.querySelector('h3 a') ||
                          card.querySelector('.product-name a');
            if (nameEl) {
              name = nameEl.textContent.trim();
            }
          }

          if (!name) {
            const linkEl = card.querySelector('a[href*="/it/"]');
            if (linkEl && linkEl.href) {
              const urlParts = linkEl.href.split('/');
              const slug = urlParts[urlParts.length - 1].replace('.html', '');
              name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          }

          const priceEl = card.querySelector('.product-prices .price') ||
                         card.querySelector('.product-price .price') ||
                         card.querySelector('.price') ||
                         card.querySelector('[itemprop="price"]');

          if (!name || !priceEl) {
            return;
          }

          let price = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
          price = price.replace(/[^\d.,]/g, '').replace(',', '.');

          const imageUrl = imageEl ? (imageEl.dataset.fullSizeImageUrl || imageEl.src) : '';

          // Check for discount
          const oldPriceEl = card.querySelector('.product-prices .regular-price') ||
                            card.querySelector('.old-price');
          let originalPrice = null;
          if (oldPriceEl) {
            originalPrice = oldPriceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
            originalPrice = originalPrice.replace(/[^\d.,]/g, '').replace(',', '.');
          }

          results.push({
            name,
            price,
            originalPrice,
            brand: 'TonyKart OTK',
            imageUrl,
          });
        } catch (err) {
          console.error('Error extracting product:', err);
        }
      });

      return results;
    });

    console.log(`✅ Found ${products.length} products on this page\n`);
    allProducts = allProducts.concat(products);
  }

  // Remove duplicates based on name
  const uniqueProducts = [];
  const seenNames = new Set();
  for (const product of allProducts) {
    if (!seenNames.has(product.name)) {
      seenNames.add(product.name);
      uniqueProducts.push(product);
    }
  }

  console.log(`\n✅ Total unique OTK wheel products: ${uniqueProducts.length}\n`);

  // Add IDs, slugs, and local image paths
  const productsWithMeta = uniqueProducts.map((product, index) => ({
    id: `mk-cerchi-otk-${index + 1}`,
    ...product,
    slug: slugify(product.name),
    imageLocal: `/images/products/${slugify(product.name)}.jpg`
  }));

  // Save to JSON
  const outputPath = path.join(__dirname, 'otk-wheels-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(productsWithMeta, null, 2));

  console.log('💾 Data saved to:', outputPath);

  if (productsWithMeta.length > 0) {
    console.log('\n📊 Sample products:');
    productsWithMeta.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - €${p.price}`);
    });
  }

  await browser.close();
  console.log('\n✨ Scraping completed!\n');
})();
