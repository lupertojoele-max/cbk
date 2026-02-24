const fs = require('fs');
const path = require('path');

const chassisData = require('./birelart-chassis-data.json');
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding BirelArt chassis to catalog...\n');

function getDescription(name, category) {
  const cat = category || 'Senior';
  if (/charles leclerc|cl birelart/i.test(name) && /kz/i.test(name)) {
    return `Telaio Charles Leclerc Kart CL BirelArt 2026 – edizione speciale KZ/Shifter. La scelta del campione di Formula 1 Charles Leclerc. Telaio 30mm con geometrie da gara per i più veloci della categoria KZ.`;
  }
  if (/charles leclerc|cl birelart/i.test(name)) {
    return `Telaio Charles Leclerc Kart CL BirelArt 2026 – edizione speciale OK/OKJ. Il telaio firmato dal campione di F1 Charles Leclerc. Struttura 30mm Direct Drive per categorie OK e OK-Junior, livello professionale.`;
  }
  if (/ry 30-s19.*kz|ry 30.*sh.*kz/i.test(name)) {
    return `Telaio BirelArt RY 30-S19 KZ 2026. Top di gamma 30mm per la categoria KZ Shifter. Geometrie da gara, setup professionale scelto dai migliori team nei campionati CIK-FIA e WSK Shifter.`;
  }
  if (/ry 32-s19.*kz|ry 32.*sh.*kz/i.test(name)) {
    return `Telaio BirelArt RY 32-S19 KZ 2026. Versione 32mm per la categoria KZ Shifter. Maggiore flessibilità posteriore per piste tecniche, struttura racing con setup ottimizzato per i motori con cambio.`;
  }
  if (/ry 30-s19.*ok|ry 30.*dd/i.test(name)) {
    return `Telaio BirelArt RY 30-S19 DD 2026 per OK e OK-Junior. Struttura 30mm Direct Drive, leggero e preciso. Scelto dai team factory nei campionati internazionali per la categoria OK e OKJ.`;
  }
  if (/ry 32-s19.*ok|ry 32.*dd/i.test(name)) {
    return `Telaio BirelArt RY 32-S19 DD 2026 per OK e OK-Junior. Versione 32mm più flessibile per garantire grip ottimale su tutte le piste. Telaio da competizione internazionale per categorie OK e OKJ.`;
  }
  if (/mini/i.test(name)) {
    return `Telaio BirelArt Mini C28 2026. Costruito per la categoria Mini (Rok 60 Junior). Tubo da 28mm ultra-leggero, handling preciso e bilanciato per i giovani piloti che si avvicinano al karting agonistico.`;
  }
  if (/am29/i.test(name)) {
    return `Telaio BirelArt AM29 2026. Struttura 29mm polivalente per le categorie OK-Junior e Junior. Bilanciamento ottimale tra leggerezza e rigidità, ideale per la crescita agonistica dei giovani piloti.`;
  }
  return `Telaio BirelArt 2026 categoria ${cat}. Costruzione professionale italiana, scelto dai migliori team nei campionati mondiali WSK, CIK-FIA e Europei di Karting.`;
}

const chassisWithDescriptions = chassisData.map(product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  category: 'telai-nuovi',
  subcategory: product.category,
  brand: 'BirelArt',
  price: product.price,
  image: product.imageLocal,
  imageLocal: product.imageLocal,
  description: getDescription(product.name, product.category),
  inStock: true,
  mondokartUrl: product.mondokartUrl || 'https://www.mondokart.com/en/chassis-birelart-mondokart-karting/',
  featured: true
}));

// Remove previous BirelArt chassis and add new
const withoutOldBirelArt = productsData.products.filter(p => !p.id.startsWith('mk-telaio-birelart-'));
productsData.products = [...withoutOldBirelArt, ...chassisWithDescriptions];

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${chassisWithDescriptions.length} BirelArt chassis products!`);
console.log('='.repeat(60));
chassisWithDescriptions.forEach(p => {
  console.log(`  [${p.subcategory}] ${p.name} — €${p.price}`);
});
console.log('\nTotal products in catalog:', productsData.products.length);
