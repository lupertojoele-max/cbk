const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🖼️  Starting image download for axles, bearings and keys...\n');

// Read the data files
const axlesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'axles-data.json'), 'utf8'));
const bearingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bearings-data.json'), 'utf8'));
const keysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys-data.json'), 'utf8'));

// Combine all products
const allProducts = [...axlesData, ...bearingsData, ...keysData];

console.log(`📊 Total products to download: ${allProducts.length}`);
console.log(`  - Axles: ${axlesData.length}`);
console.log(`  - Bearings: ${bearingsData.length}`);
console.log(`  - Keys: ${keysData.length}\n`);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Created images directory\n');
}

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

async function downloadAllImages() {
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    const filename = `${product.slug}.jpg`;
    const filepath = path.join(imagesDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  [${i + 1}/${allProducts.length}] Skipped (exists): ${filename}`);
      skippedCount++;
      continue;
    }

    console.log(`⬇️  [${i + 1}/${allProducts.length}] Downloading: ${product.name}`);

    const success = await downloadImage(product.imageUrl, filename);

    if (success) {
      successCount++;
      console.log(`✅ [${i + 1}/${allProducts.length}] Success: ${filename}\n`);
    } else {
      failCount++;
      console.log(`❌ [${i + 1}/${allProducts.length}] Failed: ${filename}\n`);
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Download Summary:');
  console.log(`  ✅ Successfully downloaded: ${successCount}`);
  console.log(`  ⏭️  Skipped (already exist): ${skippedCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📦 Total: ${allProducts.length}\n`);
}

downloadAllImages().then(() => {
  console.log('✨ Image download completed!\n');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
