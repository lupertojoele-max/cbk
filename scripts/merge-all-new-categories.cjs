/**
 * Merge di tutte le nuove categorie in products.json
 * Categorie: abbigliamento-caschi, sedili, volanti-accessori, adesivi, pedali-accessori
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure images dir exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// New categories to import
const categoriesToImport = [
  {
    file: 'helmets-data.json',
    category: 'abbigliamento-caschi',
    description: (name) => `${name} - Casco da karting di alta qualità`,
  },
  {
    file: 'suits-data.json',
    category: 'abbigliamento-caschi',
    description: (name) => `${name} - Abbigliamento professionale per karting`,
  },
  {
    file: 'seats-data.json',
    category: 'sedili',
    description: (name) => `${name} - Sedile da kart per prestazioni e comfort`,
  },
  {
    file: 'steering-wheels-data.json',
    category: 'volanti-accessori',
    description: (name) => `${name} - Volante e accessori per kart`,
  },
  {
    file: 'stickers-data.json',
    category: 'adesivi',
    description: (name) => `${name} - Adesivi e decalcomanie per kart`,
  },
  {
    file: 'pedals-data.json',
    category: 'pedali-accessori',
    description: (name) => `${name} - Pedali e accessori per kart`,
  },
];

async function downloadImage(url, filename) {
  try {
    if (!url || url.includes('no_picture') || url.includes('logo')) return false;
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, response.data);
    return true;
  } catch (error) {
    return false;
  }
}

async function processCategory(config, existingSlugs, currentMaxId) {
  const filePath = path.join(__dirname, config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${config.file}`);
    return [];
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const newProducts = data.filter(p => !existingSlugs.has(p.slug));

  console.log(`\n📂 ${config.category} (${config.file})`);
  console.log(`   Total: ${data.length}, New (no duplicates): ${newProducts.length}`);

  const productsToAdd = [];
  let downloaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < newProducts.length; i++) {
    const item = newProducts[i];
    if (!item.slug || !item.name || !item.price) continue;

    const filename = `${item.slug}.jpg`;
    const filepath = path.join(imagesDir, filename);

    if (!fs.existsSync(filepath) && item.imageUrl) {
      process.stdout.write(`  ⬇️  [${i + 1}/${newProducts.length}] ${item.name.substring(0, 40)}...\r`);
      const ok = await downloadImage(item.imageUrl, filename);
      if (ok) downloaded++;
      else failed++;
      await new Promise(r => setTimeout(r, 300));
    } else {
      skipped++;
    }

    const product = {
      id: item.id || `mk-${config.category}-${currentMaxId + i + 1}`,
      name: item.name,
      slug: item.slug,
      category: config.category,
      brand: item.brand || 'CBK Racing',
      price: item.price,
      originalPrice: item.discountedPrice ? item.price : undefined,
      discountedPrice: item.discountedPrice || undefined,
      image: item.imageUrl || '',
      imageLocal: item.imageLocal || `/images/products/${item.slug}.jpg`,
      description: config.description(item.name),
      inStock: true,
      specifications: {},
      mondokartUrl: item.productUrl || '',
    };

    // Remove undefined fields
    Object.keys(product).forEach(k => product[k] === undefined && delete product[k]);

    productsToAdd.push(product);
    existingSlugs.add(item.slug);
  }

  console.log(`\n   ✓ Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`   ✓ Added: ${productsToAdd.length} products`);

  return productsToAdd;
}

async function main() {
  console.log('🔧 Merging all new categories into products.json...\n');

  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`📊 Current products count: ${productsData.products.length}`);

  const existingSlugs = new Set(productsData.products.map(p => p.slug));
  let currentMaxId = productsData.products.length;

  let totalAdded = 0;

  for (const config of categoriesToImport) {
    const newProds = await processCategory(config, existingSlugs, currentMaxId);
    productsData.products.push(...newProds);
    totalAdded += newProds.length;
    currentMaxId += newProds.length;

    // Save after each category to preserve progress
    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
    console.log(`   💾 Saved (total: ${productsData.products.length})`);

    await new Promise(r => setTimeout(r, 1000));
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Total products added: ${totalAdded}`);
  console.log(`✅ Total products now: ${productsData.products.length}`);

  // Category breakdown
  const cats = {};
  productsData.products.forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + 1;
  });
  console.log('\n📊 Products by category:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
    console.log(`   ${c}: ${n}`);
  });
  console.log('='.repeat(60));
}

main().then(() => {
  console.log('\n🎉 Merge completato!');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
