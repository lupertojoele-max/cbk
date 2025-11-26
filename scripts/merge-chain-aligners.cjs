const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔧 Merging chain aligners products...\n');

// Read chain aligners data
const alignersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'chain-aligners-data.json'), 'utf8'));

// Read current products
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`📊 Current products count: ${productsData.products.length}`);
console.log(`📊 Chain aligners to add: ${alignersData.length}`);

// Get existing slugs to avoid duplicates
const existingSlugs = new Set(productsData.products.map(p => p.slug));

// Filter out duplicates
const newProducts = alignersData.filter(p => !existingSlugs.has(p.slug));
console.log(`📊 After removing duplicates: ${newProducts.length} new products\n`);

// Images directory
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, response.data);
    return true;
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error.message);
    return false;
  }
}

async function processProducts() {
  const productsToAdd = [];

  for (let i = 0; i < newProducts.length; i++) {
    const item = newProducts[i];
    const filename = `${item.slug}.jpg`;
    const filepath = path.join(imagesDir, filename);

    // Download image if not exists
    if (!fs.existsSync(filepath)) {
      console.log(`⬇️  [${i + 1}/${newProducts.length}] Downloading: ${item.name.substring(0, 50)}...`);
      await downloadImage(item.imageUrl, filename);
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⏭️  [${i + 1}/${newProducts.length}] Image exists: ${filename}`);
    }

    // Create product object
    // price = prezzo normale/originale
    // discountedPrice = prezzo scontato (solo se c'è uno sconto reale)
    const product = {
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: 'corone-catene',
      brand: item.brand,
      price: item.price,
      discountedPrice: item.discountedPrice || null,
      image: item.imageUrl,
      imageLocal: item.imageLocal,
      description: `${item.name} - Allineatore per catena kart`,
      inStock: true,
      specifications: {}
    };

    productsToAdd.push(product);
  }

  // Add new products to existing products
  productsData.products.push(...productsToAdd);

  // Save updated products
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log(`\n✅ Added ${productsToAdd.length} new chain aligner products`);
  console.log(`📊 Total products now: ${productsData.products.length}`);
}

processProducts().then(() => {
  console.log('\n🎉 Merge completed!');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
