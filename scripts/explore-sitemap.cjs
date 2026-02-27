/**
 * Esplora mondokart.com sitemap XML reale
 */
const puppeteer = require('puppeteer');

async function exploreSitemap() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  // Prova sitemap XML diretto
  console.log('🗺️ Scaricando sitemap XML...');
  await page.goto('https://www.mondokart.com/sitemap.xml', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const sitemapContent = await page.evaluate(() => document.body.innerText);

  // Cerca links a sub-sitemap
  const sitemapLinks = sitemapContent.match(/https:\/\/www\.mondokart\.com\/[^<\s]+\.xml/g) || [];
  console.log('Sub-sitemaps trovati:', sitemapLinks.length);
  sitemapLinks.forEach(l => console.log(' ', l));

  // Cerca URL categoria /it/
  const categoryUrls = sitemapContent.match(/https:\/\/www\.mondokart\.com\/it\/[a-z0-9-]+\//g) || [];
  const uniqueCategories = [...new Set(categoryUrls)].sort();
  console.log(`\n📋 Categorie uniche trovate (${uniqueCategories.length}):`);
  uniqueCategories.forEach(u => console.log(' ', u));

  // Prova anche sitemap delle categorie
  if (sitemapLinks.length > 0) {
    for (const sitemapUrl of sitemapLinks.slice(0, 5)) {
      console.log(`\n📄 Leggendo: ${sitemapUrl}`);
      try {
        await page.goto(sitemapUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1000));
        const content = await page.evaluate(() => document.body.innerText);
        const urls = content.match(/https:\/\/www\.mondokart\.com\/it\/[a-z0-9-]+\//g) || [];
        const unique = [...new Set(urls)];
        console.log(`  Trovate ${unique.length} categorie`);
        unique.forEach(u => console.log('   ', u));
      } catch(e) {
        console.log('  Errore:', e.message);
      }
    }
  }

  await browser.close();
}

exploreSitemap().catch(console.error);
