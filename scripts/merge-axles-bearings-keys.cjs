const fs = require('fs');
const path = require('path');

console.log('🔄 Merging axles, bearings and keys data into products.json...\n');

// Read existing products
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Read new data
const axlesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'axles-data.json'), 'utf8'));
const bearingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bearings-data.json'), 'utf8'));
const keysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys-data.json'), 'utf8'));

console.log('📊 Current products:', productsData.products.length);
console.log('📊 Axles to add:', axlesData.length);
console.log('📊 Bearings to add:', bearingsData.length);
console.log('📊 Keys to add:', keysData.length);

// Transform axles data to full product format
const axlesProducts = axlesData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'cerchi-mozzi-accessori',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Assale ${item.name} - Prodotto di alta qualità per karting professionale`,
  inStock: true,
  specifications: {}
}));

// Transform bearings data to full product format
const bearingsProducts = bearingsData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'cerchi-mozzi-accessori',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Cuscinetto per assale ${item.name} - Cuscinetto di precisione per karting`,
  inStock: true,
  specifications: {}
}));

// Transform keys data to full product format
const keysProducts = keysData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'cerchi-mozzi-accessori',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Chiavetta per assale ${item.name} - Componente essenziale per il montaggio`,
  inStock: true,
  specifications: {}
}));

// Merge all products
const allNewProducts = [...axlesProducts, ...bearingsProducts, ...keysProducts];
const updatedProducts = {
  products: [...productsData.products, ...allNewProducts]
};

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log('\n✅ Merge completed!');
console.log('📊 Total products now:', updatedProducts.products.length);
console.log('📊 Added:', allNewProducts.length, 'new products\n');

console.log('📦 Breakdown:');
console.log('  - Axles:', axlesProducts.length);
console.log('  - Bearings:', bearingsProducts.length);
console.log('  - Keys:', keysProducts.length);
console.log('\n💾 Updated file saved to:', productsPath);
