/**
 * Scraper per sub-categorie telaio accessori
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  // Fuselli sub-categories
  { url: 'https://www.mondokart.com/it/fuselli-completi-mondokart/', prefix: 'mk-fusello' },
  { url: 'https://www.mondokart.com/it/boccole-eccentriche-mondokart/', prefix: 'mk-boccola' },
  { url: 'https://www.mondokart.com/it/viti-per-fusello-mondokart/', prefix: 'mk-vite-fusello' },
  { url: 'https://www.mondokart.com/it/distanziali-per-fusello-mondokart/', prefix: 'mk-dist-fusello' },
  // Viti e Bulloni sub-categories
  { url: 'https://www.mondokart.com/it/viti-mondokart/', prefix: 'mk-vite' },
  { url: 'https://www.mondokart.com/it/dadi-mondokart/', prefix: 'mk-dado' },
  { url: 'https://www.mondokart.com/it/grani-mondokart/', prefix: 'mk-grano' },
  // Piantone sub-categories
  { url: 'https://www.mondokart.com/it/piantoni-sterzo-mondokart/', prefix: 'mk-piantone' },
  { url: 'https://www.mondokart.com/it/supporti-piantone-mondokart/', prefix: 'mk-supp-piantone' },
  // Serbatoio sub-categories
  { url: 'https://www.mondokart.com/it/serbatoi-e-tappi-mondokart/', prefix: 'mk-serbatoio' },
  { url: 'https://www.mondokart.com/it/tubi-benzina-e-raccordi-mondokart/', prefix: 'mk-tubo-benzina' },
];

const OUTPUT_FILE = 'misc-accessories2-data.json';

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
  ];
  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) return brand;
  }
  return 'CBK Racing';
}

async function scrapeUrl(page, url) {
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
  console.log('🚀 Starting misc accessories 2 scraper...\n');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  let allProducts = [];
  let idx = 0;

  try {
    for (const config of CATEGORIES) {
      console.log(`📂 ${config.url}`);
      const raw = await scrapeUrl(page, config.url);
      const processed = raw.map(p => {
        const cleanedName = cleanName(p.name);
        const slug = slugify(cleanedName);
        return { id: `${config.prefix}-${++idx}`, name: cleanedName, slug,
          brand: extractBrand(p.name), price: p.price, discountedPrice: p.discountedPrice,
          imageUrl: p.imageUrl, imageLocal: `/images/products/${slug}.jpg`,
          productUrl: p.productUrl };
      });
      console.log(`   → ${processed.length} products`);
      allProducts.push(...processed);
      await new Promise(r => setTimeout(r, 2000));
    }

    // Deduplicate by slug
    const seen = new Set();
    const unique = allProducts.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });

    fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), JSON.stringify(unique, null, 2));
    console.log(`\n✅ Total unique: ${unique.length} (from ${allProducts.length})`);
    console.log(`💾 Saved to ${OUTPUT_FILE}`);
    await browser.close();
  } catch (e) {
    console.error('❌ Fatal:', e);
    await browser.close();
    process.exit(1);
  }
}

main().then(() => console.log('\n🎉 Done!'));
