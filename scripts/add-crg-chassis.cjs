const fs = require('fs');
const path = require('path');

const chassisData = require('./crg-chassis-data.json');
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding CRG chassis to catalog...\n');

function getDescription(name, category) {
  const cat = category || 'Senior';
  if (/road rebel gold/i.test(name)) {
    return `Telaio CRG Road Rebel Gold 2026. Il top di gamma CRG disponibile nelle categorie KZ e OK. Struttura in cromo-molibdeno 30mm, finitura Gold esclusiva. Telaio da gara scelto dai professionisti nei campionati mondiali.`;
  }
  if (/kt5/i.test(name)) {
    return `Telaio CRG KT5 2026. Evoluzione del plurivittorioso Road Rebel, ottimizzato per le categorie OK e OK-Junior. Tubo da 30mm, telaio posteriore intercambiabile, setup racing professionale.`;
  }
  if (/kt2/i.test(name)) {
    return `Telaio CRG KT2 2026. Versione entry-level per piloti in crescita. Ideale per categorie OK e OK-Junior, struttura robusta e reattiva per imparare le basi del racing.`;
  }
  if (/kt4/i.test(name)) {
    return `Telaio CRG KT4 2026. Telaio intermedio con caratteristiche racing avanzate per categorie OK e OK-Junior. Equilibrio perfetto tra guidabilità e performance.`;
  }
  if (/dd2/i.test(name)) {
    return `Telaio CRG DD2 2026. Versione specifica per il motore Rotax DD2 (cambio). Geometrie ottimizzate per massimizzare le performance con motori bicilindrico.`;
  }
  if (/mini/i.test(name) && /black mirror/i.test(name)) {
    return `Telaio CRG New Mini Black Mirror 2026. Costruito appositamente per la categoria Mini (Rok 60 Junior). Peso contenuto, maneggevolezza ottimale per i giovani piloti.`;
  }
  return `Telaio CRG 2026 categoria ${cat}. Costruzione professionale in cromo-molibdeno 30mm. Scelto dai migliori team nei campionati internazionali WSK e CIK-FIA.`;
}

const chassisWithDescriptions = chassisData.map(product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  category: 'telai-nuovi',
  subcategory: product.category,
  brand: 'CRG',
  price: product.price,
  image: product.imageLocal,
  imageLocal: product.imageLocal,
  description: getDescription(product.name, product.category),
  inStock: true,
  mondokartUrl: product.mondokartUrl || 'https://www.mondokart.com/en/chassis-crg-mondokart/',
  featured: true
}));

// Remove previous CRG chassis and add new
const withoutOldCrg = productsData.products.filter(p => !p.id.startsWith('mk-telaio-crg-'));
productsData.products = [...withoutOldCrg, ...chassisWithDescriptions];

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${chassisWithDescriptions.length} CRG chassis products!`);
console.log('='.repeat(60));
chassisWithDescriptions.forEach(p => {
  console.log(`  [${p.subcategory}] ${p.name} — €${p.price}`);
});
console.log('\nTotal products in catalog:', productsData.products.length);
