const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/it/raccordi-freno-e-ferma-tubi-mondokart/';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, response.data);
    console.log(`  ✓ Downloaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to download ${filename}:`, error.message);
    return false;
  }
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

async function scrapeProducts() {
  console.log('🚀 Starting Puppeteer scraper for brake fittings (with infinite scroll)...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`📄 Loading page: ${MONDOKART_URL}`);
    await page.goto(MONDOKART_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('⏳ Waiting for initial page load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get initial count
    let previousCount = 0;
    let unchangedCount = 0;
    let maxScrollAttempts = 30; // Safety limit

    console.log('🔽 Starting auto-scroll to load all products...\n');

    for (let i = 0; i < maxScrollAttempts; i++) {
      // Scroll down
      await autoScroll(page);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Count products
      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('.js-product-miniature').length;
      });

      console.log(`Scroll ${i + 1}: Found ${currentCount} products`);

      // Check if count changed
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

    // Take screenshot
    await page.screenshot({ path: 'mondokart-brake-fittings-full.png', fullPage: false });
    console.log('📸 Screenshot saved\n');

    // Extract all products
    const products = await page.evaluate(() => {
      const items = [];
      const productContainers = document.querySelectorAll('.js-product-miniature');

      console.log('Total product containers found:', productContainers.length);

      productContainers.forEach((container, index) => {
        try {
          const linkEl = container.querySelector('a[title]');
          if (!linkEl) return;
          const name = linkEl.getAttribute('title').trim();

          const img = container.querySelector('img.img-responsive');
          if (!img) return;
          let imageUrl = img.src || '';

          if (!imageUrl || imageUrl.includes('logo') || imageUrl.includes('icon')) {
            return;
          }

          if (imageUrl.includes('?')) {
            imageUrl = imageUrl.split('?')[0];
          }

          let price = '';
          const priceEl = container.querySelector('.product-price-and-shipping .price');
          if (priceEl) {
            price = priceEl.textContent.trim().replace(/[^\d,\.]/g, '').replace(',', '.');
          }

          let hasDiscount = false;
          const discountBadge = container.querySelector('.label-flags .sconto, .label-flags [class*="sconto"]');
          if (discountBadge) {
            hasDiscount = true;
          }

          let brand = '';
          const imgAlt = img.getAttribute('alt') || '';
          if (imgAlt.includes('CRG')) brand = 'CRG';
          else if (imgAlt.includes('TonyKart') || imgAlt.includes('OTK')) brand = 'TonyKart OTK';
          else if (imgAlt.includes('Birel')) brand = 'Birel';
          else if (imgAlt.includes('Intrepid')) brand = 'Intrepid';
          else if (imgAlt.includes('MONDOKART')) brand = 'Mondokart Racing';
          else if (imgAlt.includes('Righetti')) brand = 'Righetti Ridolfi';
          else if (imgAlt.includes('IPK')) brand = 'IPK';
          else if (imgAlt.includes('Top') || imgAlt.includes('TOP')) brand = 'Top-Kart';

          if (imageUrl && name && price) {
            items.push({
              name,
              imageUrl,
              price,
              hasDiscount,
              brand: brand || '',
              index
            });
          }
        } catch (err) {
          console.error('Error extracting product:', err);
        }
      });

      return items;
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ TOTAL: Found ${products.length} brake fitting products`);
    console.log('='.repeat(60));

    // Save complete product data to JSON
    const productsData = products.map((product, idx) => {
      const slug = slugify(product.name);
      return {
        id: `mk-raccordi-freno-${idx + 1}`,
        name: product.name,
        slug,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        description: product.description,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`
      };
    });

    fs.writeFileSync(
      path.join(__dirname, 'brake-fittings-data.json'),
      JSON.stringify(productsData, null, 2)
    );
    console.log('\n💾 Saved product data to brake-fittings-data.json\n');

    // Download images
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const slug = slugify(product.name);
      const filename = `${slug}.jpg`;

      console.log(`[${i + 1}/${products.length}] ${product.name}`);
      console.log(`  Price: €${product.price}`);
      console.log(`  Brand: ${product.brand || 'N/A'}`);
      console.log(`  Image URL: ${product.imageUrl}`);

      const success = await downloadImage(product.imageUrl, filename);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Success: ${successCount}/${products.length}`);
    console.log(`✗ Failed: ${failCount}/${products.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

scrapeProducts();
