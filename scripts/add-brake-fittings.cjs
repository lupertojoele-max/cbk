const fs = require('fs');
const path = require('path');

// Load scraped brake fittings data
const brakeFittingsData = require('./brake-fittings-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake fittings products to catalog...\n');

// Add descriptions for brake fittings products
const brakeFittingsWithDescriptions = brakeFittingsData.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';
  const name = product.name;

  // Straight fittings
  if (name.includes('Raccordo DRITTO Tubo Freno')) {
    description = 'Raccordo dritto per tubo freno universale. Connessione lineare per collegamento diretto tubi freno senza angolazioni.';
  }
  // L-shaped fittings
  else if (name.includes('Raccordo tubo freno a L')) {
    description = 'Raccordo a L (90°) per tubo freno. Ideale per cambi di direzione e per evitare piegature eccessive dei tubi flessibili.';
  }
  // T-shaped (3-way) fittings
  else if (name.includes('Raccordo tubo freno a " T "(Tre Vie)') || name.includes('Raccordo tubo freno a "T"')) {
    description = 'Raccordo a T tre vie per tubo freno. Permette di suddividere il circuito frenante in più direzioni per impianti complessi.';
  } else if (name.includes('Raccordo TRE vie - 6mm RAPIDO')) {
    description = 'Raccordo rapido a tre vie 6mm. Sistema quick-connect per collegamenti veloci senza attrezzi, ideale per manutenzione rapida.';
  }
  // 2-way fittings
  else if (name.includes('Raccordo a 2 vie + 1/8-6mm RAPIDO')) {
    description = 'Raccordo rapido a 2 vie 1/8" - 6mm. Sistema quick-connect per connessioni veloci e smontaggio facilitato durante setup.';
  }
  // Tube clamps and holders
  else if (name.includes('Fascetta Fissaggio tubo 8mm')) {
    description = 'Fascetta di fissaggio per tubo freno da 8mm. Mantiene i tubi in posizione sicura evitando sfregamenti e danni durante la guida.';
  } else if (name.includes('Fermo per tubazione freno da 6mm')) {
    description = 'Fermo per tubazione freno da 6mm. Blocca e mantiene in posizione i tubi freno per evitare movimenti e vibrazioni.';
  }
  // Eye fittings
  else if (name.includes('Raccordo occhiello tubo freno M10') && !name.includes('DOPPIO')) {
    description = 'Raccordo occhiello M10 per tubo freno. Terminale con occhiello per fissaggio meccanico su pompe e pinze freno.';
    if (name.includes('CRG')) {
      brand = 'CRG';
    }
  } else if (name.includes('Raccordo occhiello tubo freno 1/8" DOPPIO')) {
    description = 'Raccordo occhiello doppio 1/8" per tubo freno. Connettore a doppio occhiello per collegamenti rigidi tra componenti frenanti.';
  }
  // Combined fittings
  else if (name.includes('Raccordo combinato completo CRG')) {
    description = 'Raccordo combinato completo CRG. Sistema di connessione multi-funzione originale CRG per impianti frenanti racing.';
    brand = 'CRG';
  }
  // Washers
  else if (name.includes('Rondella Rame 10,5-14x2 raccordo freno')) {
    description = 'Rondella in rame 10.5-14x2mm per raccordi freno. Guarnizione di tenuta per connessioni idrauliche a prova di perdite.';
  }
  // Fallback
  else {
    description = `Raccordo per impianto frenante ${brand}. Componente di qualità per collegamenti sicuri e affidabili nel sistema frenante.`;
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
    mondokartUrl: 'https://www.mondokart.com/it/raccordi-freno-e-ferma-tubi-mondokart/'
  };
});

// Add new brake fittings products to catalog
productsData.products = [...productsData.products, ...brakeFittingsWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakeFittingsWithDescriptions.length} brake fitting products!`);
console.log('='.repeat(60));
console.log('\nProducts added by brand:');

const byBrand = {};
brakeFittingsWithDescriptions.forEach(product => {
  byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
});

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`  ${brand}: ${byBrand[brand]} products`);
});

console.log('\nTotal products in catalog:', productsData.products.length);
