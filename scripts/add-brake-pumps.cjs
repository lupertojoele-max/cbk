const fs = require('fs');
const path = require('path');

// Load scraped brake pumps data
const brakePumpsData = require('./brake-pumps-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake pumps products to catalog...\n');

// Add descriptions for brake pumps products
const brakePumpsWithDescriptions = brakePumpsData.map(product => {
  let description = '';

  if (product.name.includes('Pompa freno completa anodizzata universale')) {
    description = 'Pompa freno completa anodizzata universale con finitura di alta qualità. Costruzione robusta per prestazioni affidabili in ogni condizione di gara.';
  } else if (product.name.includes('Pompa freno Anodizzata con VASCHETTA TRASPARENTE')) {
    description = 'Pompa freno anodizzata con vaschetta trasparente per monitoraggio visivo del livello olio. Ideale per setup racing con facile controllo liquido freni.';
  } else if (product.name.includes('Parapolvere per pompa freno') && product.name.includes('STONDATO')) {
    description = 'Parapolvere stondato per pompa freno. Design compatto per protezione efficace del pistone da polvere e detriti.';
  } else if (product.name.includes('Parapolvere per pompa freno')) {
    description = 'Parapolvere di ricambio per pompa freno. Protegge il pistone della pompa da polvere, sporco e umidità, garantendo lunga durata.';
  } else if (product.name.includes('Copripolvere pompa freni CRG')) {
    description = 'Copripolvere originale CRG per pompa freno. Qualità OEM per protezione ottimale del sistema frenante.';
  } else if (product.name.includes('Pompa freno (singola) oro con recupero CRG')) {
    description = 'Pompa freno singola CRG con finitura oro e sistema di recupero integrato. Top di gamma per prestazioni racing di alto livello.';
  } else if (product.name.includes('Pompa Freno OTK Tonykart BWD')) {
    description = 'Pompa freno OTK TonyKart modello BWD per applicazioni racing professionali. Precisione di frenata e modulazione eccellente.';
  } else if (product.name.includes('monopezzo BSS SA2 SA3')) {
    description = 'Pompa freno monopezzo OTK TonyKart modelli BSS, SA2, SA3 completa. Design integrato per massima rigidità e feeling diretto.';
  } else if (product.name.includes('BSM2 Mini Neos')) {
    description = 'Pompa freno OTK TonyKart BSM2 specifica per categorie Mini e Neos. Dimensionata per giovani piloti con massimo controllo.';
  } else if (product.name.includes('Monopezzo BSZ')) {
    description = 'Pompa freno monopezzo OTK TonyKart BSZ completa. Costruzione racing con corpo unico per eliminare flessioni e migliorare la risposta.';
  } else if (product.name.includes('19/B LD BirelArt')) {
    description = 'Pompa freno originale BirelArt modello 19/B LD nero. Compatibile con telai Birel ART, qualità costruttiva superiore.';
  } else if (product.name.includes('22SR LDI BirelArt')) {
    description = 'Pompa freno completa BirelArt 22SR LDI nero. Modello top di gamma con sistema LDI (Long Distance) per massima modulazione.';
  } else if (product.name.includes('IPK - Praga - Formula K - Intrepid')) {
    description = 'Pompa freno compatibile con telai IPK, Praga, Formula K e Intrepid. Soluzione OEM per ricambi originali su questi chassis.';
  } else if (product.name.includes('Top-Kart mini 60cc')) {
    description = 'Pompa freno Top-Kart FR-20 specifica per categoria mini 60cc. Dimensionamento ottimale per impianti frenanti ridotti.';
  } else if (product.name.includes('PCR con recupero (dal 2015)')) {
    description = 'Pompa freno PCR con recupero per telai dal 2015 in poi. Include vaschetta recupero liquido freni per conformità regolamentare.';
  } else if (product.name.includes('PCR con recupero (fino al 2014)')) {
    description = 'Pompa freno PCR con recupero per telai fino al 2014. Ricambio originale per modelli PCR precedenti con sistema di recupero integrato.';
  } else {
    description = `Pompa freno ${product.brand || 'universale'} di qualità racing. Costruzione robusta per massime prestazioni e affidabilità in pista.`;
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: 'freni-accessori',
    brand: product.brand || 'Mondokart Racing',
    price: product.price,
    image: product.imageLocal,
    imageLocal: product.imageLocal,
    description,
    inStock: true,
    mondokartUrl: 'https://www.mondokart.com/it/pompe-freno-mondokart/'
  };
});

// Add new brake pumps products to catalog
productsData.products = [...productsData.products, ...brakePumpsWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakePumpsWithDescriptions.length} brake pumps products!`);
console.log('='.repeat(60));
console.log('\nProducts added:');
brakePumpsWithDescriptions.forEach(product => {
  console.log(`  - ${product.name} (€${product.price})`);
});
console.log('\nTotal products in catalog:', productsData.products.length);
