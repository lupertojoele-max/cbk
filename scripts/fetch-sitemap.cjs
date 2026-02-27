/**
 * Fetch sitemap via HTTPS and extract all category URLs
 */
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9',
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      // Handle redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  // Try various sitemap URLs
  const sitemapUrls = [
    'https://www.mondokart.com/sitemap.xml',
    'https://www.mondokart.com/1_index_sitemap.xml',
    'https://www.mondokart.com/it/sitemap',
  ];

  for (const url of sitemapUrls) {
    console.log(`\n🔍 Fetching: ${url}`);
    try {
      const { status, data } = await fetchUrl(url);
      console.log(`   Status: ${status}, Size: ${data.length} bytes`);
      console.log('   Preview:', data.substring(0, 300));

      // Extract category URLs
      const matches = data.match(/https?:\/\/www\.mondokart\.com\/it\/[^<\s"']+/g) || [];
      const categories = [...new Set(matches)]
        .filter(u => u.endsWith('/') && !u.includes('?') && !u.includes('#'))
        .filter(u => {
          const parts = u.replace('https://www.mondokart.com/it/', '').split('/').filter(Boolean);
          return parts.length === 1; // Only top-level categories
        })
        .sort();

      console.log(`\n   Categorie trovate: ${categories.length}`);
      categories.forEach(u => console.log('   ', u));

      if (data.length > 100) break; // Found something useful
    } catch(e) {
      console.log('   Errore:', e.message);
    }
  }

  // Also try fetching the homepage to get nav links
  console.log('\n\n🏠 Fetching homepage...');
  try {
    const { status, data } = await fetchUrl('https://www.mondokart.com/it/');
    console.log(`   Status: ${status}, Size: ${data.length} bytes`);

    // Extract all /it/ links
    const hrefMatches = data.match(/href="[^"]*\/it\/[^"]*"/g) || [];
    const links = [...new Set(hrefMatches.map(h => h.replace('href="', '').replace('"', '')))]
      .filter(h => h.endsWith('/') && !h.includes('?') && !h.includes('#') && !h.includes('.html'))
      .sort();

    console.log(`\n   Link /it/ trovati: ${links.length}`);
    links.forEach(l => console.log('  ', l));
  } catch(e) {
    console.log('   Errore:', e.message);
  }
}

main().catch(console.error);
