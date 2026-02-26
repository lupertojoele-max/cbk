/**
 * Merge degli accessori telaio in products.json
 * Categoria: accessori-telaio
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const FILES = [
  { file: 'zavorre-data.json', cat: 'accessori-telaio', desc: (n) => `${n} - Zavorra per kart` },
  { file: 'barra-stab-data.json', cat: 'accessori-telaio', desc: (n) => `${n} - Barra stabilizzatrice per kart` },
  { file: 'staffe-data.json', cat: 'accessori-telaio', desc: (n) => `${n} - Staffa e supporto per kart` },
  { file: 'misc-accessories2-data.json', cat: 'accessori-telaio', desc: (n) => `${n} - Accessorio telaio per kart` },
];

async function downloadImage(url, filename) {
  try {
    if (!url || url.includes('no_picture')) return false;
    const response = await axios({
      url, method: 'GET', responseType: 'arraybuffer', timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    fs.writeFileSync(path.join(imagesDir, filename), response.data);
    return true;
  } catch { return false; }
}

async function main() {
  console.log('🔧 Merging accessori-telaio into products.json...\n');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`📊 Current: ${productsData.products.length}`);

  const existingSlugs = new Set(productsData.products.map(p => p.slug));
  let totalAdded = 0;

  for (const config of FILES) {
    const filePath = path.join(__dirname, config.file);
    if (!fs.existsSync(filePath)) { console.log(`⚠️  Missing: ${config.file}`); continue; }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newItems = data.filter(p => !existingSlugs.has(p.slug));
    console.log(`\n📂 ${config.file}: ${data.length} total, ${newItems.length} new`);

    let downloaded = 0, failed = 0;
    const toAdd = [];

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (!item.slug || !item.name || !item.price) continue;

      const filename = `${item.slug}.jpg`;
      if (!fs.existsSync(path.join(imagesDir, filename)) && item.imageUrl) {
        process.stdout.write(`  ⬇️  [${i+1}/${newItems.length}] ${item.name.substring(0,40)}...\r`);
        const ok = await downloadImage(item.imageUrl, filename);
        if (ok) downloaded++; else failed++;
        await new Promise(r => setTimeout(r, 300));
      }

      const product = {
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: config.cat,
        brand: item.brand || 'CBK Racing',
        price: item.price,
        image: item.imageUrl || '',
        imageLocal: item.imageLocal || `/images/products/${item.slug}.jpg`,
        description: config.desc(item.name),
        inStock: true,
        specifications: {},
        mondokartUrl: item.productUrl || '',
      };
      if (item.discountedPrice) product.discountedPrice = item.discountedPrice;
      toAdd.push(product);
      existingSlugs.add(item.slug);
    }

    productsData.products.push(...toAdd);
    totalAdded += toAdd.length;
    console.log(`\n   ✓ Downloaded: ${downloaded}, Failed: ${failed}, Added: ${toAdd.length}`);

    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Total added: ${totalAdded}`);
  console.log(`✅ Total products: ${productsData.products.length}`);
  const cats = {};
  productsData.products.forEach(p => { cats[p.category] = (cats[p.category]||0)+1; });
  Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([c,n]) => console.log(`   ${c}: ${n}`));
}

main().then(() => console.log('\n🎉 Done!')).catch(e => { console.error(e); process.exit(1); });
