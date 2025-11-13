const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const kitsData = require('./complete-brake-kits-data.json');

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
  for (const product of kitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${kitsData.length} images\n`);

  // Add detailed descriptions to products
  const kitsWithDescriptions = kitsData.map(product => {
    let description = '';
    const name = product.name;

    // Gruppo freno anteriore MA20 WP KZ RR
    if (name.includes('Gruppo freno anteriore MA20 WP KZ')) {
      description = 'Gruppo freno anteriore completo MA20 WP per KZ Righetti Ridolfi. Kit comprensivo di pinza anteriore, disco, pastiglie, pompa freno e tutti gli accessori necessari per installazione completa impianto frenante anteriore categoria KZ. Sistema professionale ad alte prestazioni.';
    }
    // Gruppo freno posteriore MA20 WP KZ/KF
    else if (name.includes('Gruppo freno posteriore MA20 WP KZ - KF')) {
      description = 'Gruppo freno posteriore completo MA20 WP per KZ e KF. Kit completo comprensivo di pinza posteriore, disco, pastiglie e tutti i componenti necessari per impianto frenante posteriore. Compatibile con categorie KZ e KF, sistema affidabile e performante.';
    }
    else {
      description = `Kit impianto frenante completo ${name}. Sistema completo con tutti i componenti necessari per l'installazione. Soluzione chiavi in mano per massima affidabilità e prestazioni.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-completi-impianto-frenante-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...kitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', kitsWithDescriptions.length, 'complete brake kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  kitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
