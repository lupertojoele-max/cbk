const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Removing duplicate products...\n');
console.log('Total products before:', productsData.products.length);

// IDs to remove (duplicates from minuteria that already exist in tiranti-freno)
const idsToRemove = [
  'mk-minuteria-forcelle-1',  // Clips CORTA 6x12mm zincata
  'mk-minuteria-forcelle-2',  // Clips LUNGA 6x24mm zincata
  'mk-minuteria-forcelle-4',  // Forcella CORTA M6 acciaio 12mm
  'mk-minuteria-forcelle-5',  // Forcella LUNGA M6 acciaio 24mm
  'mk-minuteria-forcelle-6',  // Forcella CORTA 12mm M6 - COMPLETA
  'mk-minuteria-forcelle-7'   // Forcella LUNGA M6 24mm - COMPLETA
];

console.log('\nRemoving the following duplicate IDs:');
idsToRemove.forEach(id => {
  const product = productsData.products.find(p => p.id === id);
  if (product) {
    console.log('  -', id, ':', product.name);
  }
});

// Filter out duplicates
const originalLength = productsData.products.length;
productsData.products = productsData.products.filter(p => !idsToRemove.includes(p.id));
const removedCount = originalLength - productsData.products.length;

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ Removed', removedCount, 'duplicate products!');
console.log('='.repeat(60));
console.log('Total products after:', productsData.products.length);
console.log('\nRemaining minuteria products (non-duplicates):');
const remainingMinuteria = productsData.products.filter(p => p.id.startsWith('mk-minuteria-forcelle'));
remainingMinuteria.forEach(p => console.log('  -', p.name));
