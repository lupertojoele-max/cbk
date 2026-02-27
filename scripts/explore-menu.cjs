/**
 * Naviga mondokart.com e cattura il menu completo con hover/click
 */
const puppeteer = require('puppeteer');

async function exploreMenu() {
  const browser = await puppeteer.launch({
    headless: false, // visibile per debug
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('🔍 Visitando mondokart.com/it/ ...\n');
  await page.goto('https://www.mondokart.com/it/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));

  // Estrai TUTTI i link dalla pagina
  const links = await page.evaluate(() => {
    const allLinks = [];
    document.querySelectorAll('a').forEach(el => {
      const href = el.getAttribute('href') || '';
      const text = el.textContent.trim();
      if (href.includes('mondokart.com/it/') || href.startsWith('/it/')) {
        allLinks.push({ text, href });
      }
    });
    // Deduplica per href
    const seen = new Set();
    return allLinks.filter(l => {
      const key = l.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

  console.log(`📋 Trovati ${links.length} link sulla homepage:\n`);
  links.forEach(l => {
    if (l.text.length > 0 && l.text.length < 80) {
      console.log(`  "${l.text.substring(0,45).padEnd(45)}" -> ${l.href}`);
    }
  });

  // Cerca pattern categorie
  const categoryLinks = links.filter(l =>
    l.href.includes('/it/') &&
    !l.href.includes('?') &&
    !l.href.includes('#') &&
    !l.href.includes('.html') &&
    l.href.endsWith('/')
  );

  console.log(`\n📂 Link categoria (${categoryLinks.length}):`);
  categoryLinks.forEach(l => console.log(`  ${l.text.substring(0,40).padEnd(40)} -> ${l.href}`));

  // Prova a estrarre il DOM del menu
  const menuHTML = await page.evaluate(() => {
    const menu = document.querySelector('#menu, .menu, nav, .navigation, .top-nav, .categories');
    return menu ? menu.innerHTML.substring(0, 5000) : 'Menu non trovato';
  });
  console.log('\n\n📄 Menu HTML (primi 2000 chars):\n', menuHTML.substring(0, 2000));

  await browser.close();
}

exploreMenu().catch(console.error);
