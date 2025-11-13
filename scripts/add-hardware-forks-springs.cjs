const fs = require('fs');
const path = require('path');

// Load scraped hardware, forks and springs data
const hardwareData = require('./hardware-forks-springs-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding hardware, forks and springs products to catalog...\n');

// Add descriptions for hardware, forks and springs products
const hardwareWithDescriptions = hardwareData.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';
  const name = product.name;

  // Clips
  if (name.includes('Clips CORTA 6x12mm zincata')) {
    description = 'Clip corta 6x12mm zincata. Molla di ritenzione per fissaggio sicuro di perni e tiranti freno con lunghezza ridotta.';
  } else if (name.includes('Clips LUNGA 6x24mm zincata')) {
    description = 'Clip lunga 6x24mm zincata. Molla di ritenzione allungata per maggiore tenuta su perni e tiranti freno.';
  } else if (name.includes('Clip Sicurezza per perno M6')) {
    description = 'Clip di sicurezza per perno M6. Elemento di sicurezza per prevenire lo svitamento accidentale di perni filettati.';
  }
  // Pins
  else if (name.includes('Perno 6mm per forcelle')) {
    description = 'Perno da 6mm per forcelle freno. Asse di collegamento per forcelle tiranti freno con diametro standard 6mm.';
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
  // Springs - return springs for brake pads
  else if (name.includes('Molla tirante freno 60mm M6 (interno 7mm) tipo Birel')) {
    description = 'Molla per tirante freno 60mm M6 tipo Birel con diametro interno 7mm. Molla di ritorno per mantenere tensione tirante freno.';
    brand = 'Birel';
  } else if (name.includes('Molla ritorno pastiglia freno 8x25mm BSM - BS2 OTK TonyKart')) {
    description = 'Molla ritorno pastiglia freno 8x25mm per BSM/BS2 OTK TonyKart. Assicura il distacco automatico pastiglie dal disco.';
    brand = 'TonyKart OTK';
  } else if (name.includes('Molla ritorno pastiglia freno 7x20')) {
    description = 'Molla ritorno pastiglia freno 7x20mm universale. Mantiene le pastiglie distanti dal disco quando non si frena.';
  }
  // Screws and bolts
  else if (name.includes('Vite speciale ritorno pastiglia M6 (tubetti 8x25)')) {
    description = 'Vite speciale M6 per ritorno pastiglia con tubetti 8x25mm. Componente per sistema di distacco automatico pastiglie.';
  } else if (name.includes('Vite M6-D8 L.12,2mm per Disco Freno Posteriore FLOTTANTE')) {
    description = 'Vite M6-D8 lunghezza 12.2mm per disco freno posteriore flottante. Bulloneria specifica per fissaggio dischi flottanti.';
    brand = 'Mondokart Racing';
  }
  // Fallback
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

// Add new hardware products to catalog
productsData.products = [...productsData.products, ...hardwareWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${hardwareWithDescriptions.length} hardware, forks and springs products!`);
console.log('='.repeat(60));
console.log('\nProducts added by brand:');

const byBrand = {};
hardwareWithDescriptions.forEach(product => {
  byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
});

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`  ${brand}: ${byBrand[brand]} products`);
});

console.log('\nTotal products in catalog:', productsData.products.length);
