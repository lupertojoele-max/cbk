const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const ductsData = require('./cooling-ducts-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Download images
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
}

(async () => {
  console.log('📥 Downloading product images...\n');

  let successCount = 0;
  for (const product of ductsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${ductsData.length} images\n`);

  // Add detailed descriptions to products
  const ductsWithDescriptions = ductsData.map(product => {
    let description = '';
    const name = product.name;

    // Convogliatore aria KG per pinza freno
    if (name.includes('Convogliatore aria KG per pinza freno')) {
      description = 'Convogliatore aria KG per raffreddamento pinza freno. Sistema di canalizzazione aria dedicato per abbassare la temperatura della pinza freno durante l\'uso intensivo. Migliora durata pastiglie e prestazioni frenanti.';
    }
    // Kit viti fissaggio OTK TonyKart
    else if (name.includes('Kit viti fissaggio per convogliatore freni OTK')) {
      description = 'Kit viti fissaggio per convogliatore freni OTK TonyKart. Set completo di viti e bulloneria per montaggio sicuro convogliatore raffreddamento su kart TonyKart OTK.';
    }
    // Convogliatore raffreddamento carter MINI
    else if (name.includes('Convogliatore raffreddamento KG carter MINI')) {
      description = 'Convogliatore raffreddamento KG per carter MINI. Sistema di raffreddamento dedicato per carter motore categoria MINI, ottimizza temperatura operativa e prestazioni.';
    }
    // Cover pioggia GreyHound
    else if (name.includes('Cover Pioggia per Pinza Freno - GreyHound')) {
      description = 'Cover pioggia per pinza freno GreyHound. Protezione impermeabile per pinza freno in condizioni di pioggia, previene infiltrazioni d\'acqua e mantiene efficienza frenata su bagnato.';
    }
    else {
      description = `Convogliatore raffreddamento ${name}. Sistema di raffreddamento per componenti kart. Migliora durata e prestazioni mantenendo temperature operative ottimali.`;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: 'freni-accessori',
      brand: product.brand,
      price: product.price,
      image: product.imageLocal,
      imageLocal: product.imageLocal,
      description,
      inStock: true,
      mondokartUrl: 'https://www.mondokart.com/it/convogliatori-raffreddamento-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...ductsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', ductsWithDescriptions.length, 'cooling duct products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Products by brand:');

  const byBrand = {};
  ductsWithDescriptions.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
  });

  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
})();
