/**
 * Scraper per PEDALI e ACCESSORI da mondokart.com
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SUBCATEGORIES = [
  'https://www.mondokart.com/it/pedali-e-viti-mondokart/',
  'https://www.mondokart.com/it/poggiatalloni-poggiapiedi-mondokart/',
  'https://www.mondokart.com/it/prolunghe-e-grip-mondokart/',
];

const ID_PREFIX = 'mk-pedale';
const OUTPUT_FILE = 'pedals-data.json';

function slugify(text) {
  return text.toString().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 80);
}

function cleanName(name) {
  return name
    .replace(/,?\s*MONDOKART,?\s*/gi, ' ').replace(/,?\s*mondokart,?\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*karting\s*$/gi, '').replace(/,\s*$/g, '')
    .replace(/\s{2,}/g, ' ').trim();
}

function extractBrand(name) {
  const brandPatterns = [
    { pattern: /\btonykart|tony\s*kart|otk\b/i, brand: 'TonyKart OTK' },
    { pattern: /\bcrg\b/i, brand: 'CRG' },
    { pattern: /\bbirel\b/i, brand: 'Birel' },
    { pattern: /\bintrepid\b/i, brand: 'Intrepid' },
    { pattern: /\bparolin\b/i, brand: 'Parolin' },
    { pattern: /\btopkart|top.kart\b/i, brand: 'Top-Kart' },
  ];
  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) return brand;
  }
  return 'CBK Racing';
}

async function scrapePage(page, url) {
  const products = [];
  let currentPage = 1;
  while (true) {
    const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`;
    console.log(`  📄 ${pageUrl}`);
    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(async () => {
        for (let i = 0; i < 5; i++) { window.scrollBy(0, 500); await new Promise(r => setTimeout(r, 300)); }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 1000));
      const pageProducts = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.js-product-miniature').forEach(card => {
          try {
            const imageEl = card.querySelector('img');
            const priceEl = card.querySelector('.price');
            const linkEl = card.querySelector('a');
            const name = imageEl ? imageEl.getAttribute('alt') : null;
            if (!name || !priceEl) return;
            let imageUrl = imageEl.getAttribute('data-full-size-image-url') ||
              imageEl.getAttribute('data-src') || imageEl.getAttribute('src') || '';
            imageUrl = imageUrl.replace('square_home_default', 'large_default');
            const IVA = 1.22;
            const regularPriceEl = card.querySelector('.product-prices .regular-price');
            let mainPrice = 0, discountedPrice = null;
            if (regularPriceEl) {
              mainPrice = (parseFloat(regularPriceEl.textContent.trim().replace('€','').replace(',','.')) || 0) * IVA;
              discountedPrice = ((parseFloat(priceEl.textContent.trim().replace('€','').replace(',','.')) || 0) * IVA) || null;
            } else {
              mainPrice = (parseFloat(priceEl.textContent.trim().replace('€','').replace(',','.')) || 0) * IVA;
            }
            if (mainPrice > 0) items.push({ name: name.trim(), price: mainPrice.toFixed(2),
              discountedPrice: discountedPrice ? discountedPrice.toFixed(2) : null,
              imageUrl, productUrl: linkEl ? linkEl.href : '' });
          } catch (e) {}
        });
        return items;
      });
      console.log(`     Found ${pageProducts.length} products`);
      if (pageProducts.length === 0) break;
      products.push(...pageProducts);
      const hasNextPage = await page.evaluate(() =>
        !!document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled)'));
      if (!hasNextPage) break;
      currentPage++;
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) { console.error(`  ❌ ${pageUrl}:`, e.message); break; }
  }
  return products;
}

async function scrapeProducts() {
  console.log('🚀 Starting Pedali scraper...\n');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  let allProducts = [];
  try {
    for (const url of SUBCATEGORIES) {
      console.log(`\n📂 ${url}`);
      const products = await scrapePage(page, url);
      allProducts.push(...products);
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log(`\n✅ Total: ${allProducts.length}`);
    const seen = new Set();
    const unique = allProducts.filter(p => { if (seen.has(p.name)) return false; seen.add(p.name); return true; });
    const processedProducts = unique.map((product, index) => {
      const cleanedName = cleanName(product.name);
      const slug = slugify(cleanedName);
      return { id: `${ID_PREFIX}-${index + 1}`, name: cleanedName, slug,
        brand: extractBrand(product.name), price: product.price,
        discountedPrice: product.discountedPrice, imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`, productUrl: product.productUrl };
    });
    fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), JSON.stringify(processedProducts, null, 2));
    console.log(`💾 Saved: ${processedProducts.length} pedali`);
    await browser.close();
    return processedProducts;
  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

scrapeProducts().then(p => console.log(`\n🎉 Pedali: ${p.length} prodotti`))
  .catch(e => { console.error(e); process.exit(1); });
