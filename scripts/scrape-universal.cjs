/**
 * Universal Scraper - Accetta URL e output file come argomenti
 * Uso: node scrape-universal.cjs <URL> <output-file>
 * Es:  node scrape-universal.cjs https://www.mondokart.com/it/pneumatici-gomme-mondokart/ pneumatici-data.json
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MONDOKART_URL = process.argv[2];
const OUTPUT_FILE = process.argv[3];

if (!MONDOKART_URL || !OUTPUT_FILE) {
  console.error('Usage: node scrape-universal.cjs <URL> <output-file>');
  process.exit(1);
}

const ID_PREFIX = OUTPUT_FILE.replace('-data.json', '').replace(/[^a-z0-9]/g, '-');

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
  const brandPatterns = [
    { pattern: /\biame\b/i, brand: 'IAME' },
    { pattern: /\btm\s*racing\b|\btm\s*kart\b|\b\btm\b/i, brand: 'TM Racing' },
    { pattern: /\brotax\b/i, brand: 'Rotax' },
    { pattern: /\bvortex\b/i, brand: 'Vortex' },
    { pattern: /\bcomer\b/i, brand: 'Comer' },
    { pattern: /\bdellorto\b/i, brand: 'Dellorto' },
    { pattern: /\btillotson\b/i, brand: 'Tillotson' },
    { pattern: /\bwalbro\b/i, brand: 'Walbro' },
    { pattern: /\btryton\b/i, brand: 'Tryton' },
    { pattern: /\bibea\b/i, brand: 'IBEA' },
    { pattern: /\baim\b|\bmychron\b/i, brand: 'AIM' },
    { pattern: /\balfano\b/i, brand: 'Alfano' },
    { pattern: /\bunipro\b/i, brand: 'Unipro' },
    { pattern: /\bstarlane\b/i, brand: 'Starlane' },
    { pattern: /\blecont\b/i, brand: 'LeCont' },
    { pattern: /\bvega\b/i, brand: 'Vega' },
    { pattern: /\bmaxxis\b/i, brand: 'Maxxis' },
    { pattern: /\b\bmg\b.*gom|\bgomme\b.*\bmg\b/i, brand: 'MG Tires' },
    { pattern: /\bkomet\b/i, brand: 'Komet' },
    { pattern: /\bbridgestone\b/i, brand: 'Bridgestone' },
    { pattern: /\bdunlop\b/i, brand: 'Dunlop' },
    { pattern: /\beasykart\b/i, brand: 'Easykart' },
    { pattern: /\bngk\b/i, brand: 'NGK' },
    { pattern: /\bbrisk\b/i, brand: 'Brisk' },
    { pattern: /\bdenso\b/i, brand: 'Denso' },
    { pattern: /tonykart|tony\s*kart|otk/i, brand: 'TonyKart OTK' },
    { pattern: /birel|freeline/i, brand: 'Birel ART' },
    { pattern: /\bcrg\b/i, brand: 'CRG' },
    { pattern: /\bintrepid\b/i, brand: 'Intrepid' },
    { pattern: /\bwildkart\b/i, brand: 'WildKart' },
    { pattern: /top\s*kart|topkart/i, brand: 'Top-Kart' },
    { pattern: /\bparolin\b/i, brand: 'Parolin' },
    { pattern: /kart\s*republic|\bkr\b/i, brand: 'Kart Republic' },
    { pattern: /\bkosmic\b/i, brand: 'Kosmic' },
    { pattern: /\bpraga\b|\bipk\b/i, brand: 'Praga' },
    { pattern: /\bpcr\b/i, brand: 'PCR' },
    { pattern: /\bmaranello\b/i, brand: 'Maranello' },
    { pattern: /\benergy\b/i, brand: 'Energy Corse' },
    { pattern: /\bexprit\b/i, brand: 'Exprit' },
    { pattern: /\bsniper\b/i, brand: 'Sniper' },
    { pattern: /\bregina\b/i, brand: 'Regina' },
    { pattern: /\bimaf\b/i, brand: 'IMAF' },
    { pattern: /\bgreyhound\b/i, brand: 'Greyhound' },
    { pattern: /\bsparco\b/i, brand: 'Sparco' },
    { pattern: /\bomp\b/i, brand: 'OMP' },
    { pattern: /\balpinestars\b/i, brand: 'Alpinestars' },
    { pattern: /\bbell\b/i, brand: 'Bell' },
    { pattern: /\barai\b/i, brand: 'Arai' },
    { pattern: /\bstilo\b/i, brand: 'Stilo' },
    { pattern: /\bschuberth\b/i, brand: 'Schuberth' },
    { pattern: /\bzamp\b/i, brand: 'Zamp' },
    { pattern: /\bbengio\b/i, brand: 'Bengio' },
  ];
  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) return brand;
  }
  return 'CBK Racing';
}

async function scrapeProducts() {
  console.log(`🚀 Scraping: ${MONDOKART_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  let allProducts = [];
  let currentPage = 1;

  try {
    while (true) {
      const url = currentPage === 1 ? MONDOKART_URL : `${MONDOKART_URL}?page=${currentPage}`;
      console.log(`📄 Pagina ${currentPage}: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 3000));

      // Scroll to load lazy images
      await page.evaluate(async () => {
        for (let i = 0; i < 8; i++) {
          window.scrollBy(0, 400);
          await new Promise(r => setTimeout(r, 200));
        }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 1000));

      const products = await page.evaluate(() => {
        const items = [];
        const IVA = 1.22;
        document.querySelectorAll('.js-product-miniature').forEach(card => {
          try {
            const imageEl = card.querySelector('img');
            const priceEl = card.querySelector('.price');
            const linkEl = card.querySelector('a');
            const name = imageEl ? imageEl.getAttribute('alt') : null;

            if (!name || !priceEl) return;

            let imageUrl = '';
            if (imageEl) {
              imageUrl = imageEl.getAttribute('data-full-size-image-url') ||
                         imageEl.getAttribute('data-src') ||
                         imageEl.getAttribute('src') || '';
              imageUrl = imageUrl.replace('square_home_default', 'large_default');
            }

            const productUrl = linkEl ? linkEl.href : '';
            const regularPriceEl = card.querySelector('.product-prices .regular-price');
            let mainPrice = 0, discountedPrice = null;

            if (regularPriceEl) {
              const regText = regularPriceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              mainPrice = (parseFloat(regText) || 0) * IVA;
              const saleText = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              discountedPrice = ((parseFloat(saleText) || 0) * IVA) || null;
            } else {
              const priceText = priceEl.textContent.trim().replace('€', '').replace(',', '.').trim();
              mainPrice = (parseFloat(priceText) || 0) * IVA;
            }

            items.push({ name: name.trim(), price: mainPrice.toFixed(2),
              discountedPrice: discountedPrice ? discountedPrice.toFixed(2) : null,
              imageUrl, productUrl });
          } catch(e) {}
        });
        return items;
      });

      console.log(`   Trovati ${products.length} prodotti`);
      if (products.length === 0) break;

      allProducts = allProducts.concat(products);

      const hasNextPage = await page.evaluate(() => {
        const next = document.querySelector('.pagination .next:not(.disabled) a, a.next:not(.disabled), .pagination-summary + * .page-list a[rel="next"]');
        if (next) return true;
        // Also check if current page number < total pages
        const active = document.querySelector('.pagination .current, .page-item.active .page-link');
        const total = document.querySelector('.pagination .js-search-link:last-of-type, .page-item:last-child .page-link');
        if (active && total) {
          const cur = parseInt(active.textContent.trim());
          const tot = parseInt(total.textContent.trim());
          return !isNaN(cur) && !isNaN(tot) && cur < tot;
        }
        return false;
      });

      if (!hasNextPage) break;
      currentPage++;
      await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n✅ Totale: ${allProducts.length} prodotti\n`);

    const processedProducts = allProducts.map((product, index) => {
      const cleanedName = cleanName(product.name);
      const slug = slugify(cleanedName);
      return {
        id: `${ID_PREFIX}-${index + 1}`,
        name: cleanedName,
        slug,
        brand: extractBrand(product.name),
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        imageLocal: `/images/products/${slug}.jpg`,
        productUrl: product.productUrl
      };
    });

    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`💾 Salvato in: ${outputPath}`);

    await browser.close();
    return processedProducts;
  } catch (error) {
    console.error('❌ Errore:', error.message);
    await browser.close();
    throw error;
  }
}

scrapeProducts().then(p => console.log(`\n🎉 Completato: ${p.length} prodotti`))
  .catch(e => { console.error('💥', e.message); process.exit(1); });
