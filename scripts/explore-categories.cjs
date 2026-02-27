/**
 * Esplora mondokart.com e stampa tutte le categorie del menu
 */
const puppeteer = require('puppeteer');

async function exploreCategories() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('🔍 Visitando mondokart.com/it/ ...\n');
  await page.goto('https://www.mondokart.com/it/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Estrai tutti i link del menu
  const links = await page.evaluate(() => {
    const allLinks = [];
    // Prova vari selettori per il menu
    const selectors = [
      '.menu a', '#menu a', 'nav a', '.nav a',
      '.top-menu a', '.category-menu a',
      '.main-menu a', '#main-menu a',
      'ul.menu a', '.menu-nav a',
      'a[href*="/it/"]'
    ];

    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      if (els.length > 0) {
        els.forEach(el => {
          const href = el.getAttribute('href') || '';
          const text = el.textContent.trim();
          if (href.includes('/it/') && !href.includes('?') && text.length > 0 && text.length < 60) {
            allLinks.push({ text, href });
          }
        });
        if (allLinks.length > 0) break;
      }
    }

    // Se non trovato, prova tutti i link della pagina
    if (allLinks.length === 0) {
      document.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href') || '';
        const text = el.textContent.trim();
        if (href.includes('/it/') && text.length > 2 && text.length < 60) {
          allLinks.push({ text, href });
        }
      });
    }

    // Deduplica
    const seen = new Set();
    return allLinks.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  });

  console.log(`📋 Trovati ${links.length} link:\n`);
  links.forEach(l => console.log(`  ${l.text.padEnd(40)} -> ${l.href}`));

  // Prova anche a visitare la sitemap
  console.log('\n\n🗺️ Controllo sitemap...');
  try {
    await page.goto('https://www.mondokart.com/it/sitemap.xml', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const content = await page.content();
    const urls = content.match(/https:\/\/www\.mondokart\.com\/it\/[^<"]+/g) || [];
    const categories = [...new Set(urls.filter(u => !u.includes('?') && !u.includes('.jpg') && !u.includes('.png')))];
    console.log(`\n📍 URL da sitemap (${categories.length}):`);
    categories.slice(0, 50).forEach(u => console.log(' ', u));
  } catch(e) {
    console.log('Sitemap non disponibile:', e.message);
  }

  await browser.close();
}

exploreCategories().catch(console.error);
