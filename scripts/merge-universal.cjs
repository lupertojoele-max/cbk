/**
 * Universal Merge - Aggiunge prodotti da un data file a products.json
 * Uso: node merge-universal.cjs <data-file> <category> <description>
 * Es:  node merge-universal.cjs pneumatici-data.json pneumatici "Pneumatici per kart"
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DATA_FILE = process.argv[2];
const CATEGORY = process.argv[3];
const DESCRIPTION = process.argv[4] || 'Prodotto per kart racing';

if (!DATA_FILE || !CATEGORY) {
  console.error('Usage: node merge-universal.cjs <data-file> <category> [description]');
  process.exit(1);
}

const scrapedData = JSON.parse(fs.readFileSync(path.join(__dirname, DATA_FILE), 'utf8'));
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

console.log(`📦 Merge categoria: ${CATEGORY}`);
console.log(`📊 Prodotti esistenti: ${productsData.products.length}`);
console.log(`📊 Prodotti da aggiungere: ${scrapedData.length}`);

const existingSlugs = new Set(productsData.products.map(p => p.slug));
const newProducts = scrapedData.filter(p => !existingSlugs.has(p.slug));
console.log(`📊 Nuovi (no dups): ${newProducts.length}\n`);

async function downloadImage(url, filename) {
  try {
    if (!url || url.length < 10) return false;
    const response = await axios({
      url, method: 'GET', responseType: 'arraybuffer', timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    fs.writeFileSync(path.join(imagesDir, filename), response.data);
    return true;
  } catch (error) {
    // console.error(`❌ ${filename}: ${error.message}`);
    return false;
  }
}

async function processProducts() {
  const productsToAdd = [];
  let downloaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < newProducts.length; i++) {
    const item = newProducts[i];
    const filename = `${item.slug}.jpg`;
    const filepath = path.join(imagesDir, filename);

    if (!fs.existsSync(filepath)) {
      const ok = await downloadImage(item.imageUrl, filename);
      if (ok) { downloaded++; }
      else { failed++; }
      await new Promise(r => setTimeout(r, 300));
    } else {
      skipped++;
    }

    if ((i + 1) % 10 === 0 || i === newProducts.length - 1) {
      console.log(`  [${i + 1}/${newProducts.length}] ⬇️ ${downloaded} scaricate, ⏭️ ${skipped} esistenti, ❌ ${failed} fallite`);
    }

    productsToAdd.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: CATEGORY,
      brand: item.brand,
      price: item.price,
      discountedPrice: item.discountedPrice || null,
      image: item.imageUrl,
      imageLocal: item.imageLocal,
      description: `${item.name} - ${DESCRIPTION}`,
      inStock: true,
      specifications: {}
    });
  }

  productsData.products.push(...productsToAdd);
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log(`\n✅ Aggiunti ${productsToAdd.length} prodotti`);
  console.log(`📊 Totale ora: ${productsData.products.length}`);
  return productsToAdd.length;
}

processProducts().then(n => console.log(`\n🎉 Merge completato! ${n} prodotti aggiunti.`))
  .catch(e => { console.error('💥', e); process.exit(1); });
