const fs = require('fs');
const path = require('path');

// Load scraped brake rods data
const brakeRodsData = require('./brake-rods-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake rods products to catalog...\n');

// Add descriptions for brake rods products
const brakeRodsWithDescriptions = brakeRodsData.map(product => {
  let description = '';

  if (product.name.includes('Tirante asta freno')) {
    description = 'Tirante asta freno universale M6 per impianti frenanti kart. Filettatura standard M6, compatibile con la maggior parte dei sistemi.';
  } else if (product.name.includes('Forcella LUNGA') && product.name.includes('24mm')) {
    description = 'Forcella lunga M6 da 24mm completa di fermo per tirante freno. Adatta per applicazioni che richiedono maggiore escursione.';
  } else if (product.name.includes('Forcella CORTA') && product.name.includes('12mm') && product.name.includes('COMPLETA')) {
    description = 'Forcella corta M6 da 12mm completa di fermo per tirante freno. Soluzione compatta per spazi ridotti.';
  } else if (product.name.includes('Clips CORTA')) {
    description = 'Clips di sicurezza corta 6x12mm zincata per fissaggio tiranti freno. Previene lo sgancio accidentale.';
  } else if (product.name.includes('Clips LUNGA')) {
    description = 'Clips di sicurezza lunga 6x24mm zincata per fissaggio tiranti freno. Maggiore tenuta e sicurezza.';
  } else if (product.name.includes('Forcella CORTA') && product.name.includes('acciaio')) {
    description = 'Forcella corta M6 in acciaio da 12mm per tirante freno. Maggiore resistenza e durata rispetto alle versioni standard.';
  } else if (product.name.includes('Forcella LUNGA') && product.name.includes('acciaio')) {
    description = 'Forcella lunga M6 in acciaio da 24mm per tirante freno. Costruzione rinforzata per applicazioni racing.';
  } else if (product.name.includes('Asta freno tirante CRG')) {
    description = 'Asta tirante freno originale CRG. Qualità OEM, progettata specificamente per telai CRG.';
  } else if (product.name.includes('comando pompa dritta')) {
    description = 'Asta tirante freno OTK TonyKart per comando pompa dritta. Collegamento diretto tra pedale e pompa freno.';
  } else if (product.name.includes('comando pompa curva')) {
    description = 'Asta tirante freno OTK TonyKart per comando pompa curva. Design ergonomico per migliore modulazione della frenata.';
  } else if (product.name.includes('Prolunga tirante')) {
    description = 'Prolunga per tirante freno M6 o cavo di sicurezza da 30mm. Permette regolazioni precise della lunghezza del sistema frenante.';
  } else if (product.name.includes('Cavo in acciaio di sicurezza')) {
    description = 'Cavo di sicurezza in acciaio per impianto frenante con terminali M6. Obbligo normativo per categorie KZ e racing.';
  } else if (product.name.includes('Cavo Sicurezza Freno 46cm Doppio KZ')) {
    description = 'Cavo di sicurezza freno originale CRG da 46cm doppio per categorie KZ. Conforme regolamento tecnico sportivo.';
  } else if (product.name.includes('Dado Conico')) {
    description = 'Dado conico 6x22 per fissaggio tirante freno M6 o cavo di sicurezza. Bloccaggio sicuro e anti-allentamento.';
  } else {
    description = `Componente per tirante freno ${product.brand || 'universale'} di qualità racing. Compatibile con impianti frenanti kart.`;
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
    mondokartUrl: 'https://www.mondokart.com/it/tiranti-freno-mondokart/'
  };
});

// Add new brake rods products to catalog
productsData.products = [...productsData.products, ...brakeRodsWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakeRodsWithDescriptions.length} brake rods products!`);
console.log('='.repeat(60));
console.log('\nProducts added:');
brakeRodsWithDescriptions.forEach(product => {
  console.log(`  - ${product.name} (€${product.price})`);
});
console.log('\nTotal products in catalog:', productsData.products.length);
