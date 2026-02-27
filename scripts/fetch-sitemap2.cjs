/**
 * Fetch 404 page URLs to find category list
 */
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'it-IT,it;q=0.9',
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('🏠 Fetching homepage to find nav links...');
  const { status, data } = await fetchUrl('https://www.mondokart.com/it/');
  console.log(`Status: ${status}, Size: ${data.length}`);

  // Save HTML for inspection
  const fs = require('fs');
  fs.writeFileSync('./mondokart-home.html', data);
  console.log('Saved to mondokart-home.html');

  // Extract all hrefs from navigation/menu areas
  // Look for patterns in the HTML
  const hrefPattern = /href="(https?:\/\/www\.mondokart\.com\/it\/[^"?#]+\/)"/g;
  const links = new Set();
  let match;
  while ((match = hrefPattern.exec(data)) !== null) {
    const url = match[1];
    // Only top-level categories (one segment after /it/)
    const path = url.replace('https://www.mondokart.com/it/', '').replace(/\/$/, '');
    if (path && !path.includes('/') && path.length > 2) {
      links.add(url);
    }
  }

  const sortedLinks = [...links].sort();
  console.log(`\nTop-level category URLs found: ${sortedLinks.length}`);
  sortedLinks.forEach(u => {
    const slug = u.replace('https://www.mondokart.com/it/', '').replace('/', '');
    console.log(`  ${slug}`);
  });
}

main().catch(console.error);
