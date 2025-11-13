const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('=== CHECKING FOR DUPLICATES ===\n');

// Filter minuteria products
const minuteria = productsData.products.filter(p =>
  p.id.startsWith('mk-minuteria-forcelle') ||
  p.name.toLowerCase().includes('forcella') ||
  p.name.toLowerCase().includes('clips') ||
  p.name.toLowerCase().includes('molla') ||
  p.name.toLowerCase().includes('perno')
);

console.log('Total minuteria/forcelle/molle products found:', minuteria.length);
console.log('');

// Group by name
const byName = {};
minuteria.forEach(p => {
  const key = p.name.toLowerCase().trim();
  if (!byName[key]) byName[key] = [];
  byName[key].push(p);
});

// Find duplicates
const duplicates = Object.entries(byName).filter(([name, prods]) => prods.length > 1);

if (duplicates.length > 0) {
  console.log('=== DUPLICATES FOUND BY NAME ===\n');
  duplicates.forEach(([name, prods]) => {
    console.log('Name:', name);
    console.log('Count:', prods.length);
    prods.forEach(p => {
      console.log('  - ID:', p.id, '| Price:', p.price, '€');
    });
    console.log('');
  });

  console.log('Total duplicate groups:', duplicates.length);
  console.log('Total duplicate products:', duplicates.reduce((sum, [_, prods]) => sum + prods.length, 0));
} else {
  console.log('No duplicates found by name');
}

console.log('\n=== ALL MINUTERIA PRODUCTS ===\n');
minuteria.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => {
  console.log(p.id.padEnd(35), '|', p.price.padStart(6), '€ |', p.name);
});
