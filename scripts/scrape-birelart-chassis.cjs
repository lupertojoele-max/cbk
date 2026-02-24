const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/en/chassis-birelart-mondokart-karting/';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

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
  console.log('🚀 Starting scraper for BirelArt chassis...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`📄 Loading: ${MONDOKART_URL}`);
    await page.goto(MONDOKART_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    let previousCount = 0;
    let unchangedCount = 0;
    const maxScrollAttempts = 20;

    console.log('🔽 Auto-scrolling to load all products...\n');

    for (let i = 0; i < maxScrollAttempts; i++) {
      await autoScroll(page);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('.js-product-miniature').length;
      });

      console.log(`Scroll ${i + 1}: Found ${currentCount} products`);

      if (currentCount === previousCount) {
        unchangedCount++;
        if (unchangedCount >= 3) {
          console.log('\n✓ All products loaded!\n');
          break;
        }
      } else {
        unchangedCount = 0;
      }
      previousCount = currentCount;
    }

    await page.screenshot({ path: 'mondokart-birelart-chassis.png', fullPage: false });
    console.log('📸 Screenshot saved\n');

    const products = await page.evaluate(() => {
      const items = [];
      const productContainers = document.querySelectorAll('.js-product-miniature');

      productContainers.forEach((container) => {
        try {
          const linkEl = container.querySelector('a[title]');
          if (!linkEl) return;
          const name = linkEl.getAttribute('title').trim();
          const productUrl = linkEl.getAttribute('href') || '';

          const img = container.querySelector('img.img-responsive');
          if (!img) return;
          let imageUrl = img.src || img.getAttribute('data-src') || '';

          if (!imageUrl || imageUrl.includes('logo') || imageUrl.includes('icon')) return;
          if (imageUrl.includes('?')) imageUrl = imageUrl.split('?')[0];

          let price = '';
          const priceEl = container.querySelector('.product-price-and-shipping .price');
          if (priceEl) {
            // English format: "€3,999.99" → remove non-digits/dots → "3999.99"
            price = priceEl.textContent.trim().replace(/[^\d\.]/g, '').replace(/\.(?=\d{3}\.|\d{3}$)/g, '');
          }

          if (imageUrl && name && price) {
            items.push({ name, imageUrl, price, productUrl });
          }
        } catch (err) {
          console.error('Error extracting product:', err);
        }
      });

      return items;
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ TOTAL: Found ${products.length} BirelArt chassis products`);
    console.log('='.repeat(60));

    function extractCategory(name) {
      if (/mini/i.test(name)) return 'Mini';
      if (/baby/i.test(name)) return 'Baby';
      if (/kz/i.test(name)) return 'KZ';
      if (/okj|ok-j|ok junior/i.test(name)) return 'OK-Junior';
      if (/ok/i.test(name)) return 'OK';
      if (/dd2/i.test(name)) return 'KZ';
      return 'Senior';
    }

    const productsData = products.map((product, idx) => {
      const slug = slugify(product.name);
      return {
        id: `mk-telaio-birelart-${idx + 1}`,
        name: product.name,
        slug,
        brand: 'BirelArt',
        category: extractCategory(product.name),
        price: product.price,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`,
        productUrl: product.productUrl,
        mondokartUrl: product.productUrl || 'https://www.mondokart.com/en/chassis-birelart-mondokart-karting/'
      };
    });

    fs.writeFileSync(
      path.join(__dirname, 'birelart-chassis-data.json'),
      JSON.stringify(productsData, null, 2)
    );
    console.log('\n💾 Saved to birelart-chassis-data.json\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const slug = slugify(product.name);
      const filename = `${slug}.jpg`;

      console.log(`[${i + 1}/${products.length}] ${product.name}`);
      console.log(`  Price: €${product.price}`);
      console.log(`  Image: ${product.imageUrl}`);

      const success = await downloadImage(product.imageUrl, filename);
      if (success) successCount++;
      else failCount++;

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Success: ${successCount}/${products.length}`);
    console.log(`✗ Failed:  ${failCount}/${products.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

scrapeProducts();
