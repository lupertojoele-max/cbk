const fs = require('fs');
const path = require('path');

// Load scraped brake distributors data
const brakeDistributorsData = require('./brake-distributors-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake distributors products to catalog...\n');

// Add descriptions for brake distributors products
const brakeDistributorsWithDescriptions = brakeDistributorsData.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';
  const name = product.name;

  // Generic / Universal
  if (name.includes('Ripartitore di frenata anodizzato a scatti universale')) {
    description = 'Ripartitore di frenata anodizzato universale con regolazione a scatti. Sistema di bilanciamento professionale con posizionamento preciso e ripetibile.';
  } else if (name.includes('Ripartitore di frenata KZ') && !name.includes('OTK') && !name.includes('CRG') && !name.includes('BirelArt') && !name.includes('IPK') && !name.includes('AP-RACE')) {
    description = 'Ripartitore di frenata per categorie KZ. Sistema di bilanciamento economico per regolare la distribuzione della forza frenante tra anteriore e posteriore.';
  } else if (name.includes('Pomolo regolatore per tirante freno anodizzato')) {
    description = 'Pomolo regolatore anodizzato per tirante freno. Accessorio per regolazione fine della tensione tirante freno con finitura racing.';
  }
  // OTK TonyKart
  else if (name.includes('Ripartitore di frenata KZ OTK TonyKart')) {
    description = 'Ripartitore di frenata KZ originale OTK TonyKart. Sistema di bilanciamento racing per telai OTK con qualità OEM e massima precisione.';
    brand = 'TonyKart OTK';
  }
  // CRG
  else if (name.includes('Ripartitore frenata 125cc KZ CRG') && !name.includes('posizionatore')) {
    description = 'Ripartitore di frenata CRG per 125cc KZ. Sistema di bilanciamento originale CRG per categorie cambio con regolazione ottimale.';
    brand = 'CRG';
  } else if (name.includes('Ripartitore Frenata KZ CRG con posizionatore GOLD a scatto')) {
    description = 'Ripartitore di frenata KZ CRG con posizionatore GOLD a scatto. Top di gamma con regolazione a scatti per setup preciso e ripetibile.';
    brand = 'CRG';
  }
  // BirelArt
  else if (name.includes('Ripartitore di Frenata BirelArt - RR')) {
    description = 'Ripartitore di frenata BirelArt RR. Sistema di bilanciamento originale per telai Birel ART con qualità costruttiva superiore.';
    brand = 'Birel';
  } else if (name.includes('Assieme Ripartitore Frenata KZ BirelArt - NEW')) {
    description = 'Assieme completo ripartitore di frenata KZ BirelArt NEW. Kit racing completo per telai Birel ART categorie cambio con ultima evoluzione.';
    brand = 'Birel';
  }
  // IPK / Praga / Formula K
  else if (name.includes('Ripartitore di frenata IPK - Praga - Formula K - OK1')) {
    description = 'Ripartitore di frenata IPK/Praga/Formula K OK1. Sistema di bilanciamento multi-brand gruppo IPK con compatibilità estesa.';
    brand = 'IPK';
  }
  // AP-RACE (Parolin / Top-Kart)
  else if (name.includes('Ripartitore di frenata KZ AP-RACE 01 Parolin - Top-Kart')) {
    description = 'Ripartitore di frenata KZ AP-RACE 01 per Parolin e Top-Kart. Sistema di bilanciamento racing compatibile con telai Parolin e Top-Kart.';
    brand = 'Top-Kart';
  }
  // Fallback
  else {
    description = `Ripartitore di frenata ${brand} di qualità racing. Sistema di bilanciamento per regolare la distribuzione della forza frenante tra anteriore e posteriore.`;
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
    mondokartUrl: 'https://www.mondokart.com/it/ripartitori-di-frenata-mondokart/'
  };
});

// Add new brake distributors products to catalog
productsData.products = [...productsData.products, ...brakeDistributorsWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakeDistributorsWithDescriptions.length} brake distributor products!`);
console.log('='.repeat(60));
console.log('\nProducts added by brand:');

const byBrand = {};
brakeDistributorsWithDescriptions.forEach(product => {
  byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
});

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`  ${brand}: ${byBrand[brand]} products`);
});

console.log('\nTotal products in catalog:', productsData.products.length);
