const fs = require('fs');
const path = require('path');

// Load scraped data with correct prices
const scrapedData = require('./brake-hoses-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Updating brake hose products with correct prices...\n');

// Update prices for existing brake hose products
let updatedCount = 0;

productsData.products = productsData.products.map(product => {
  // Check if this is a brake hose product
  if (product.id.startsWith('mk-tubi-freno-')) {
    const scrapedProduct = scrapedData.find(p => p.id === product.id);

    if (scrapedProduct) {
      console.log(`✓ Updating ${product.id}`);
      console.log(`  Price: ${product.price} → ${scrapedProduct.price}`);
      console.log(`  Brand: ${product.brand || 'N/A'} → ${scrapedProduct.brand || product.brand}`);
      console.log(`  Image: ${product.imageLocal} → ${scrapedProduct.imageLocal}`);
      console.log('');

      updatedCount++;

      return {
        ...product,
        price: scrapedProduct.price,
        brand: scrapedProduct.brand || product.brand,
        image: scrapedProduct.imageLocal,
        imageLocal: scrapedProduct.imageLocal
      };
    }
  }

  return product;
});

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Updated ${updatedCount} brake hose products with correct prices!`);
console.log('='.repeat(60));
