/**
 * Batch Scraper - Scrapa più URL e combina in un singolo file output
 * Uso: node scrape-batch.cjs <output-file> <url1> <url2> ...
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = process.argv[2];
const URLS = process.argv.slice(3);

if (!OUTPUT_FILE || URLS.length === 0) {
  console.error('Usage: node scrape-batch.cjs <output-file> <url1> [url2] ...');
  process.exit(1);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim().substring(0, 80);
}

function cleanName(name) {
  return name
    .replace(/,?\s*MONDOKART,?\s*/gi, ' ').replace(/,?\s*mondokart,?\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*go\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*kart,?\s*karting\s*/gi, ' ')
    .replace(/,?\s*karting\s*$/gi, '').replace(/,\s*$/g, '')
    .replace(/\s+,/g, ',').replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ').trim();
}

function extractBrand(name) {
  const bp = [
    { r: /\biame\b/i, b: 'IAME' }, { r: /\btm\s*racing\b|\btm\s*kart\b/i, b: 'TM Racing' },
    { r: /\brotax\b/i, b: 'Rotax' }, { r: /\bvortex\b/i, b: 'Vortex' },
    { r: /\bcomer\b/i, b: 'Comer' }, { r: /\bdellorto\b/i, b: 'Dellorto' },
    { r: /\btillotson\b/i, b: 'Tillotson' }, { r: /\bwalbro\b/i, b: 'Walbro' },
    { r: /\btryton\b/i, b: 'Tryton' }, { r: /\bibea\b/i, b: 'IBEA' },
    { r: /\baim\b|\bmychron\b/i, b: 'AIM' }, { r: /\balfano\b/i, b: 'Alfano' },
    { r: /\bunipro\b/i, b: 'Unipro' }, { r: /\bstarlane\b/i, b: 'Starlane' },
    { r: /\blecont\b/i, b: 'LeCont' }, { r: /\bvega\b/i, b: 'Vega' },
    { r: /\bmaxxis\b/i, b: 'Maxxis' }, { r: /\bkomet\b/i, b: 'Komet' },
    { r: /\bbridgestone\b/i, b: 'Bridgestone' }, { r: /\bdunlop\b/i, b: 'Dunlop' },
    { r: /\bngk\b/i, b: 'NGK' }, { r: /\bbrisk\b/i, b: 'Brisk' },
    { r: /\bdenso\b/i, b: 'Denso' }, { r: /tonykart|tony\s*kart|\botk\b/i, b: 'TonyKart OTK' },
    { r: /birelart|birel\s*art|freeline/i, b: 'Birel ART' }, { r: /\bcrg\b/i, b: 'CRG' },
    { r: /\bintrepid\b/i, b: 'Intrepid' }, { r: /top\s*kart|topkart/i, b: 'Top-Kart' },
    { r: /\bparolin\b/i, b: 'Parolin' }, { r: /kart\s*republic/i, b: 'Kart Republic' },
    { r: /\bkosmic\b/i, b: 'Kosmic' }, { r: /\bpraga\b|\bipk\b/i, b: 'Praga' },
    { r: /\bpcr\b/i, b: 'PCR' }, { r: /\bmaranello\b/i, b: 'Maranello' },
    { r: /\benergy\s*corse\b|\benergy\b/i, b: 'Energy Corse' },
    { r: /\bexprit\b/i, b: 'Exprit' }, { r: /\bsniper\b/i, b: 'Sniper' },
    { r: /\bregina\b/i, b: 'Regina' }, { r: /\bimaf\b/i, b: 'IMAF' },
    { r: /\bgreyhound\b/i, b: 'Greyhound' }, { r: /\bsparco\b/i, b: 'Sparco' },
    { r: /\bomp\b/i, b: 'OMP' }, { r: /\balpinestars\b/i, b: 'Alpinestars' },
    { r: /\bbell\b/i, b: 'Bell' }, { r: /\barai\b/i, b: 'Arai' },
    { r: /\bstilo\b/i, b: 'Stilo' }, { r: /\bbengio\b/i, b: 'Bengio' },
  ];
  for (const { r, b } of bp) { if (r.test(name)) return b; }
  return 'CBK Racing';
}

async function scrapeUrl(page, url, prefix) {
  const products = [];
  let pageNum = 1;
  while (true) {
    const pageUrl = pageNum === 1 ? url : `${url}?page=${pageNum}`;
    console.log(`  📄 ${pageUrl}`);
    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 2500));
      await page.evaluate(async () => {
        for (let i = 0; i < 6; i++) { window.scrollBy(0, 400); await new Promise(r => setTimeout(r, 150)); }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 800));
    } catch(e) {
      console.log(`  ⚠️ Timeout: ${e.message.substring(0,50)}`);
      break;
    }

    const found = await page.evaluate(() => {
      const items = [];
      const IVA = 1.22;
      document.querySelectorAll('.js-product-miniature').forEach(card => {
        try {
          const imgEl = card.querySelector('img');
          const priceEl = card.querySelector('.price');
          const linkEl = card.querySelector('a');
          const name = imgEl ? imgEl.getAttribute('alt') : null;
          if (!name || !priceEl) return;
          let imageUrl = (imgEl.getAttribute('data-full-size-image-url') ||
            imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || '')
            .replace('square_home_default', 'large_default');
          const regPriceEl = card.querySelector('.product-prices .regular-price');
          let price = 0, disc = null;
          if (regPriceEl) {
            price = (parseFloat(regPriceEl.textContent.replace('€','').replace(',','.').trim()) || 0) * IVA;
            disc = ((parseFloat(priceEl.textContent.replace('€','').replace(',','.').trim()) || 0) * IVA) || null;
          } else {
            price = (parseFloat(priceEl.textContent.replace('€','').replace(',','.').trim()) || 0) * IVA;
          }
          items.push({ name: name.trim(), price: price.toFixed(2),
            discountedPrice: disc ? disc.toFixed(2) : null, imageUrl, productUrl: linkEl ? linkEl.href : '' });
        } catch(e) {}
      });
      return items;
    });

    console.log(`     → ${found.length} prodotti`);
    if (found.length === 0) break;
    products.push(...found);

    const hasNext = await page.evaluate(() => {
      return !!document.querySelector('.pagination .next:not(.disabled) a, a[rel="next"]:not(.disabled)');
    });
    if (!hasNext) break;
    pageNum++;
    await new Promise(r => setTimeout(r, 1200));
  }
  return products;
}

async function main() {
  console.log(`🚀 Batch scraper: ${URLS.length} URL → ${OUTPUT_FILE}\n`);

  const browser = await puppeteer.launch({
    headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  const allRaw = [];
  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i];
    console.log(`\n[${i+1}/${URLS.length}] ${url}`);
    try {
      const found = await scrapeUrl(page, url, '');
      allRaw.push(...found);
      console.log(`  ✅ ${found.length} prodotti da questa URL`);
    } catch(e) {
      console.log(`  ❌ Errore: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();

  // Deduplicate by name
  const seen = new Set();
  const unique = allRaw.filter(p => {
    const key = p.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });

  const prefix = OUTPUT_FILE.replace('-data.json','').replace(/[^a-z0-9]/g,'-');
  const processed = unique.map((p, i) => {
    const clean = cleanName(p.name);
    const slug = slugify(clean);
    return {
      id: `${prefix}-${i+1}`, name: clean, slug,
      brand: extractBrand(p.name), price: p.price,
      discountedPrice: p.discountedPrice,
      imageUrl: p.imageUrl, imageLocal: `/images/products/${slug}.jpg`,
      productUrl: p.productUrl
    };
  });

  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), JSON.stringify(processed, null, 2));
  console.log(`\n✅ Totale unici: ${processed.length}`);
  console.log(`💾 Salvato: ${OUTPUT_FILE}`);
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
