const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing category for axles, bearings and keys...\n');

// Read current products
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📊 Total products before fix:', productsData.products.length);

// Remove products with IDs starting with mk-assale, mk-cuscinetto, mk-chiavetta
const filteredProducts = productsData.products.filter(p => {
  return !p.id.startsWith('mk-assale-') &&
         !p.id.startsWith('mk-cuscinetto-') &&
         !p.id.startsWith('mk-chiavetta-');
});

console.log('📊 Products after removing axles/bearings/keys:', filteredProducts.length);
console.log('📊 Removed:', productsData.products.length - filteredProducts.length, 'products\n');

// Read new data
const axlesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'axles-data.json'), 'utf8'));
const bearingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bearings-data.json'), 'utf8'));
const keysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys-data.json'), 'utf8'));

// Transform data with CORRECT category
const axlesProducts = axlesData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'assali-cuscinetti-chiavette',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Assale ${item.name} - Prodotto di alta qualità per karting professionale`,
  inStock: true,
  specifications: {}
}));

const bearingsProducts = bearingsData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'assali-cuscinetti-chiavette',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Cuscinetto per assale ${item.name} - Cuscinetto di precisione per karting`,
  inStock: true,
  specifications: {}
}));

const keysProducts = keysData.map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: 'assali-cuscinetti-chiavette',
  brand: item.brand,
  price: item.price,
  image: item.imageUrl,
  imageLocal: item.imageLocal,
  description: `Chiavetta per assale ${item.name} - Componente essenziale per il montaggio`,
  inStock: true,
  specifications: {}
}));

// Merge all products with correct category
const allNewProducts = [...axlesProducts, ...bearingsProducts, ...keysProducts];
const updatedProducts = {
  products: [...filteredProducts, ...allNewProducts]
};

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log('✅ Category fix completed!');
console.log('📊 Total products now:', updatedProducts.products.length);
console.log('📊 Re-added with correct category:', allNewProducts.length, 'products\n');

console.log('📦 Breakdown (all in category "assali-cuscinetti-chiavette"):');
console.log('  - Axles:', axlesProducts.length);
console.log('  - Bearings:', bearingsProducts.length);
console.log('  - Keys:', keysProducts.length);
console.log('\n💾 Updated file saved to:', productsPath);
