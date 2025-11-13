const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = 'https://www.mondokart.com/it/pompe-freno-mondokart/';
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

async function scrapeProducts() {
  console.log('🚀 Starting Puppeteer scraper for brake pumps...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`📄 Loading page: ${MONDOKART_URL}`);
    await page.goto(MONDOKART_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('⏳ Waiting for page to fully load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take screenshot for debugging
    await page.screenshot({ path: 'mondokart-brake-pumps.png', fullPage: false });
    console.log('📸 Screenshot saved as mondokart-brake-pumps.png');

    // Save HTML for debugging
    const html = await page.content();
    fs.writeFileSync('mondokart-brake-pumps.html', html);
    console.log('💾 Saved full HTML to mondokart-brake-pumps.html');

    // Extract products with names, images, prices, and descriptions
    const products = await page.evaluate(() => {
      const items = [];

      // Use correct MondoKart selector
      const productContainers = document.querySelectorAll('.js-product-miniature');

      console.log('Found containers:', productContainers.length);

      productContainers.forEach((container, index) => {
        try {
          // Get product name from title attribute of link
          const linkEl = container.querySelector('a[title]');
          if (!linkEl) return;
          const name = linkEl.getAttribute('title').trim();

          // Get image URL
          const img = container.querySelector('img.img-responsive');
          if (!img) return;
          let imageUrl = img.src || '';

          if (!imageUrl || imageUrl.includes('logo') || imageUrl.includes('icon')) {
            return;
          }

          // Clean up image URL
          if (imageUrl.includes('?')) {
            imageUrl = imageUrl.split('?')[0];
          }

          // Get price from .price span
          let price = '';
          const priceEl = container.querySelector('.product-price-and-shipping .price');
          if (priceEl) {
            price = priceEl.textContent.trim().replace(/[^\d,\.]/g, '').replace(',', '.');
          }

          // Check for discount badge
          let hasDiscount = false;
          const discountBadge = container.querySelector('.label-flags .sconto, .label-flags [class*="sconto"]');
          if (discountBadge) {
            hasDiscount = true;
          }

          // Get brand from alt text or name
          let brand = '';
          const imgAlt = img.getAttribute('alt') || '';
          if (imgAlt.includes('CRG')) brand = 'CRG';
          else if (imgAlt.includes('TonyKart') || imgAlt.includes('OTK')) brand = 'TonyKart OTK';
          else if (imgAlt.includes('Birel')) brand = 'Birel';
          else if (imgAlt.includes('Intrepid')) brand = 'Intrepid';
          else if (imgAlt.includes('MONDOKART')) brand = 'Mondokart Racing';
          else if (imgAlt.includes('Righetti')) brand = 'Righetti Ridolfi';

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

    console.log(`\n✓ Found ${products.length} products\n`);

    // Save complete product data to JSON
    const productsData = products.map((product, idx) => {
      const slug = slugify(product.name);
      return {
        id: `mk-pompe-freno-${idx + 1}`,
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
      path.join(__dirname, 'brake-pumps-data.json'),
      JSON.stringify(productsData, null, 2)
    );
    console.log('💾 Saved product data to brake-pumps-data.json\n');

    // Download images
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      const slug = slugify(product.name);
      const filename = `${slug}.jpg`;

      console.log(`[${product.index + 1}/${products.length}] ${product.name}`);
      console.log(`  Price: €${product.price}${product.originalPrice ? ` (was €${product.originalPrice})` : ''}`);
      console.log(`  Brand: ${product.brand || 'N/A'}`);
      console.log(`  Image URL: ${product.imageUrl}`);

      const success = await downloadImage(product.imageUrl, filename);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      // Small delay to avoid rate limiting
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
  } finally {
    await browser.close();
  }
}

scrapeProducts();
