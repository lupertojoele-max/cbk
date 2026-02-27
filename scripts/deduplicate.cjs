const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'products.json');
const raw = fs.readFileSync(filePath, 'utf-8');
const { products } = JSON.parse(raw);

console.log('Prodotti prima:', products.length);

// Step 1: deduplica per slug — tieni quello con più dati
const seenSlugs = new Map();
products.forEach(p => {
  if (!seenSlugs.has(p.slug)) {
    seenSlugs.set(p.slug, p);
  } else {
    const existing = seenSlugs.get(p.slug);
    const score = (p) => (p.imageLocal ? 2 : 0) + (p.description ? p.description.length / 100 : 0);
    if (score(p) > score(existing)) {
      seenSlugs.set(p.slug, p);
    }
  }
});

// Step 2: deduplica per nome normalizzato
const seenNames = new Map();
const deduped = [];

for (const p of seenSlugs.values()) {
  const normalizedName = p.name.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!seenNames.has(normalizedName)) {
    seenNames.set(normalizedName, true);
    deduped.push(p);
  }
}

console.log('Prodotti dopo:', deduped.length);
console.log('Rimossi:', products.length - deduped.length);

fs.writeFileSync(filePath, JSON.stringify({ products: deduped }, null, 2));
console.log('\nSalvato data/products.json');

// Riepilogo
const cats = {};
deduped.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
console.log('\nCategorie (' + Object.keys(cats).length + '):');
Object.entries(cats).sort().forEach(([c, n]) => console.log('  ' + c + ': ' + n));
