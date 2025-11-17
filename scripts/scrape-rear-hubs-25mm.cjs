const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/it/per-babykart-assale-25mm-mondokart/';

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
  console.log('🚀 Starting Rear Hubs 25mm (Baby) scraper...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  console.log('📄 Loading page:', MONDOKART_URL);
  await page.goto(MONDOKART_URL, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  console.log('⏳ Waiting for products to load...\n');
  await page.waitForSelector('.js-product-miniature', { timeout: 30000 });

  let previousCount = 0;
  let unchangedCount = 0;
  let maxScrollAttempts = 40;

  console.log('🔄 Loading all products with infinite scroll...\n');

  for (let i = 0; i < maxScrollAttempts; i++) {
    await autoScroll(page);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const currentCount = await page.evaluate(() => {
      return document.querySelectorAll('.js-product-miniature').length;
    });

    console.log(`Scroll attempt ${i + 1}/${maxScrollAttempts}: Found ${currentCount} products`);

    if (currentCount === previousCount) {
      unchangedCount++;
      if (unchangedCount >= 3) {
        console.log('\n✓ No new products loaded after 3 attempts. All products loaded!\n');
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
          console.log(`Skipping product ${index + 1}: missing name or price`);
          return;
        }

        let price = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
        price = price.replace(/[^\d.,]/g, '').replace(',', '.');

        const imageUrl = imageEl ? (imageEl.dataset.fullSizeImageUrl || imageEl.src) : '';

        let brand = '';
        if (name.toLowerCase().includes('crg')) brand = 'CRG';
        else if (name.toLowerCase().includes('tonykart') || name.toLowerCase().includes('tony kart') || name.toLowerCase().includes('otk')) brand = 'TonyKart OTK';
        else if (name.toLowerCase().includes('birel')) brand = 'Birel';
        else if (name.toLowerCase().includes('intrepid')) brand = 'Intrepid';
        else if (name.toLowerCase().includes('top-kart') || name.toLowerCase().includes('topkart')) brand = 'Top-Kart';
        else if (name.toLowerCase().includes('ipk')) brand = 'IPK';
        else if (name.toLowerCase().includes('parolin')) brand = 'Parolin';
        else if (name.toLowerCase().includes('praga')) brand = 'Praga';
        else brand = 'Mondokart Racing';

        console.log(`Product ${index + 1}: ${name} - ${price}€`);

        results.push({
          id: `mk-mozzo-post-25mm-${index + 1}`,
          name,
          price,
          brand,
          imageUrl,
        });
      } catch (err) {
        console.error('Error extracting product:', err);
      }
    });

    return results;
  });

  console.log(`\n✅ Found ${products.length} rear hub 25mm products\n`);

  const productsWithSlugs = products.map(product => ({
    ...product,
    slug: slugify(product.name),
    imageLocal: `/images/products/${slugify(product.name)}.jpg`
  }));

  const outputPath = path.join(__dirname, 'rear-hubs-25mm-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(productsWithSlugs, null, 2));

  console.log('💾 Data saved to:', outputPath);

  if (productsWithSlugs.length > 0) {
    console.log('\n📊 Summary by Brand:');
    const byBrand = {};
    productsWithSlugs.forEach(p => {
      byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    });
    Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count} products`);
    });
  }

  await browser.close();
  console.log('\n✨ Scraping completed!\n');
})();
