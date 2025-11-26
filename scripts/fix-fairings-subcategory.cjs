const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'));

// Assegno subcategory in base al nome
let updated = 0;
data.products.forEach(p => {
  if (p.category === 'carenature' && !p.subcategory) {
    const name = p.name.toLowerCase();

    if (name.includes('crg') || name.includes('na2') || name.includes('na3') || name.includes('newage')) {
      p.subcategory = 'crg';
      updated++;
    } else if (name.includes('birel') || name.includes('freeline') || name.includes('birelart')) {
      p.subcategory = 'birel';
      updated++;
    } else if (name.includes('otk') || name.includes('tonykart') || name.includes('tony kart')) {
      p.subcategory = 'tonykart-otk';
      updated++;
    } else if (name.includes('topkart') || name.includes('top kart') || name.includes('top-kart')) {
      p.subcategory = 'topkart';
      updated++;
    } else if (name.includes('parolin') || name.includes('eurostar') || name.includes('dynamica') || name.includes('agile')) {
      p.subcategory = 'parolin';
      updated++;
    } else if (name.includes('frontalino') || name.includes('portanumero') || name.includes('musetto')) {
      p.subcategory = 'frontalino-kg';
      updated++;
    } else if (name.includes('spoiler posteriore') || name.includes('paraurti posteriore')) {
      p.subcategory = 'spoiler-posteriori';
      updated++;
    } else if (name.includes('spoiler anteriore') || name.includes('paraurti anteriore')) {
      p.subcategory = 'spoiler-anteriori';
      updated++;
    } else if (name.includes('carenatura laterale') || name.includes('laterali')) {
      p.subcategory = 'carenature-laterali';
      updated++;
    } else if (name.includes('supporto') || name.includes('staffa') || name.includes('attacco') || name.includes('molla') || name.includes('gommino') || name.includes('perno') || name.includes('spina') || name.includes('kit')) {
      p.subcategory = 'supporti';
      updated++;
    } else {
      p.subcategory = 'accessori';
      updated++;
    }
  }
});

fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(data, null, 2));
console.log('Aggiornati ' + updated + ' prodotti');

// Conta finale
const counts = {};
data.products.filter(p => p.category === 'carenature').forEach(p => {
  const sub = p.subcategory || 'senza';
  counts[sub] = (counts[sub] || 0) + 1;
});
console.log('\nConteggio finale per subcategory:');
Object.entries(counts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));
