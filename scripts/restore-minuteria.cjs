const fs = require('fs');
const path = require('path');

// Load the original scraped data
const hardwareData = require('./hardware-forks-springs-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Restoring removed minuteria products...\n');
console.log('Total products before:', productsData.products.length);

// Products that were removed (IDs 1, 2, 4, 5, 6, 7)
const toRestore = hardwareData.filter(p =>
  ['mk-minuteria-forcelle-1', 'mk-minuteria-forcelle-2', 'mk-minuteria-forcelle-4',
   'mk-minuteria-forcelle-5', 'mk-minuteria-forcelle-6', 'mk-minuteria-forcelle-7'].includes(p.id)
);

console.log('\nRestoring the following products:');
toRestore.forEach(product => {
  console.log('  -', product.id, ':', product.name, '-', product.price, '€');
});

// Add descriptions for the restored products
const restoredWithDescriptions = toRestore.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';
  const name = product.name;

  // Clips
  if (name.includes('Clips CORTA 6x12mm zincata')) {
    description = 'Clip corta 6x12mm zincata. Molla di ritenzione per fissaggio sicuro di perni e tiranti freno con lunghezza ridotta.';
  } else if (name.includes('Clips LUNGA 6x24mm zincata')) {
    description = 'Clip lunga 6x24mm zincata. Molla di ritenzione allungata per maggiore tenuta su perni e tiranti freno.';
  }
  // Forks (short)
  else if (name.includes('Forcella CORTA M6 acciaio 12mm tirante freno')) {
    description = 'Forcella corta M6 in acciaio 12mm per tirante freno. Terminale a forcella con lunghezza ridotta per collegamenti compatti.';
  } else if (name.includes('Forcella CORTA 12mm M6 - COMPLETA di fermo')) {
    description = 'Forcella corta M6 12mm completa di fermo. Kit comprensivo di forcella e clip di sicurezza per montaggio rapido.';
  }
  // Forks (long)
  else if (name.includes('Forcella LUNGA M6 acciaio 24mm tirante freno')) {
    description = 'Forcella lunga M6 in acciaio 24mm per tirante freno. Terminale a forcella allungato per maggiore escursione e flessibilità.';
  } else if (name.includes('Forcella LUNGA M6 24mm - COMPLETA di fermo')) {
    description = 'Forcella lunga M6 24mm completa di fermo. Kit comprensivo di forcella e clip per installazione immediata.';
  }
  else {
    description = `Componente di minuteria ${brand} per impianto frenante. Ricambio di qualità per assemblaggio e manutenzione sistema freno.`;
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: 'freni-accessori',
    brand,
    price: product.price,
    image: product.imageLocal,
    imageLocal: product.imageLocal,
    description,
    inStock: true,
    mondokartUrl: 'https://www.mondokart.com/it/minuteria-forcelle-molle-mondokart/'
  };
});

// Add restored products back
productsData.products = [...productsData.products, ...restoredWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ Restored', restoredWithDescriptions.length, 'products!');
console.log('='.repeat(60));
console.log('Total products after:', productsData.products.length);

// Count minuteria products
const minuteriaCount = productsData.products.filter(p => p.id.startsWith('mk-minuteria-forcelle')).length;
console.log('\nTotal mk-minuteria-forcelle products:', minuteriaCount);
