/**
 * Scraper per accessori vari TELAIO mancanti:
 * - Zavorre (pesi zavorra)
 * - Serbatoio e tubi benzina
 * - Viti e bulloni
 * - Barra stabilizzatrice
 * - Staffe e supporti
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { url: 'https://www.mondokart.com/it/zavorre-mondokart/', output: 'zavorre-data.json', prefix: 'mk-zavorra', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/serbatoio-e-tubi-benzina-mondokart/', output: 'serbatoio-data.json', prefix: 'mk-serbatoio', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/viti-e-bulloni-mondokart/', output: 'viti-bulloni-data.json', prefix: 'mk-vite', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/barra-stabilizzatrice-mondokart/', output: 'barra-stab-data.json', prefix: 'mk-barra', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/staffe-e-supporti-mondokart/', output: 'staffe-data.json', prefix: 'mk-staffa', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/fuselli-boccole-mondokart/', output: 'fuselli-data.json', prefix: 'mk-fusello', cat: 'accessori-telaio' },
  { url: 'https://www.mondokart.com/it/piantone-e-accessori-mondokart/', output: 'piantone-data.json', prefix: 'mk-piantone', cat: 'accessori-telaio' },
];

function slugify(text) {
  return text.toString().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 80);
}

function cleanName(name) {
  return name
    .replace(/,?\s*MONDOKART,?\s*/gi, ' ').replace(/,?\s*mondokart,?\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*karting\s*/gi, ' ')
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
    { pattern: /\bkosmic\b/i, brand: 'Kosmic' },
    { pattern: /\bkart\s*republic|kr\b/i, brand: 'Kart Republic' },
  ];
  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) return brand;
  }
  return 'CBK Racing';
}

async function scrapeCategory(page, url) {
  const products = [];
  let currentPage = 1;
  while (true) {
    const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`;
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

      if (pageProducts.length === 0) break;
      products.push(...pageProducts);
      const hasNextPage = await page.evaluate(() =>
        !!document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled)'));
      if (!hasNextPage) break;
      currentPage++;
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) { console.error(`  ❌ Error: ${e.message}`); break; }
  }
  return products;
}

async function main() {
  console.log('🚀 Starting misc accessories scraper...\n');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  const allResults = {};

  try {
    for (const config of CATEGORIES) {
      console.log(`\n📂 ${config.url}`);
      const raw = await scrapeCategory(page, config.url);
      const processedProducts = raw.map((product, index) => {
        const cleanedName = cleanName(product.name);
        const slug = slugify(cleanedName);
        return { id: `${config.prefix}-${index + 1}`, name: cleanedName, slug,
          brand: extractBrand(product.name), category: config.cat,
          price: product.price, discountedPrice: product.discountedPrice,
          imageUrl: product.imageUrl, imageLocal: `/images/products/${slug}.jpg`,
          productUrl: product.productUrl };
      });
      console.log(`   → ${processedProducts.length} products`);
      fs.writeFileSync(path.join(__dirname, config.output), JSON.stringify(processedProducts, null, 2));
      allResults[config.output] = processedProducts.length;
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n📊 Summary:');
    Object.entries(allResults).forEach(([f, n]) => console.log(`   ${f}: ${n}`));
    await browser.close();
  } catch (e) {
    console.error('❌ Fatal:', e);
    await browser.close();
    process.exit(1);
  }
}

main().then(() => console.log('\n🎉 Done!'));
