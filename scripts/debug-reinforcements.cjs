const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.mondokart.com/it/rinforzi-boccole-per-assale-mondokart/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const products = await page.evaluate(() => {
    const items = [];
    const productCards = document.querySelectorAll('.js-product-miniature');

    productCards.forEach((card, idx) => {
      // Try multiple selectors for name
      const nameEl = card.querySelector('.product-title a') ||
                     card.querySelector('h3 a') ||
                     card.querySelector('.h3 a') ||
                     card.querySelector('a.product-name') ||
                     card.querySelector('[itemprop="name"]') ||
                     card.querySelector('.product-title');

      // Also check for title attribute on thumbnail
      const thumbnailLink = card.querySelector('.thumbnail a, a.thumbnail, .product-thumbnail a');
      const titleFromLink = thumbnailLink ? thumbnailLink.getAttribute('title') : null;

      // Try getting name from image alt
      const imageEl = card.querySelector('img');
      const altText = imageEl ? imageEl.getAttribute('alt') : null;

      const priceEl = card.querySelector('.price');

      items.push({
        idx,
        nameFromSelector: nameEl ? nameEl.textContent.trim() : 'N/A',
        nameFromLinkTitle: titleFromLink || 'N/A',
        nameFromAlt: altText || 'N/A',
        price: priceEl ? priceEl.textContent.trim() : 'N/A',
        imageSrc: imageEl ? (imageEl.getAttribute('data-full-size-image-url') || imageEl.src) : 'N/A'
      });
    });

    return items;
  });

  console.log('Products found:', products.length);
  products.forEach(p => console.log(JSON.stringify(p)));

  await browser.close();
})();
