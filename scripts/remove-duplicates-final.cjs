const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📊 Products before cleanup:', productsData.products.length);

// Remove duplicates by ID (keep first occurrence)
const seen = new Set();
const uniqueProducts = [];

for (const product of productsData.products) {
  if (!seen.has(product.id)) {
    seen.add(product.id);
    uniqueProducts.push(product);
  } else {
    console.log('🗑️  Removing duplicate:', product.id, '-', product.name);
  }
}

productsData.products = uniqueProducts;

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('✅ Products after cleanup:', productsData.products.length);
console.log('🎉 Removed', seen.size - uniqueProducts.length, 'duplicate(s)');
