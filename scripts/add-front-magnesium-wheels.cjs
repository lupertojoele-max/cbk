const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const wheelsData = require('./front-magnesium-wheels-data.json');

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
  for (const product of wheelsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${wheelsData.length} images\n`);

  // Add detailed descriptions to products
  const wheelsWithDescriptions = wheelsData.map(product => {
    let description = '';
    const name = product.name;

    // Cerchi anteriori magnesio specifici per brand
    if (name.includes('CRG')) {
      description = `Cerchio anteriore in magnesio ${name}. Cerchio racing professionale in lega di magnesio ad alta resistenza per kart CRG. Leggerezza estrema e rigidità ottimale per massime prestazioni in pista. Compatibile con telai CRG.`;
    }
    else if (name.includes('Douglas')) {
      description = `Cerchio anteriore in magnesio Douglas ${name}. I cerchi Douglas rappresentano l'eccellenza nel mondo del karting. Lega di magnesio di altissima qualità, lavorazione CNC di precisione. Massima affidabilità e durata anche nelle condizioni più estreme.`;
    }
    else if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `Cerchio anteriore in magnesio ${name} per TonyKart OTK. Cerchio racing originale o compatibile con telai TonyKart. Materiale magnesio ad alte prestazioni, bilanciamento perfetto, massima resistenza agli urti.`;
    }
    else if (name.includes('Birel')) {
      description = `Cerchio anteriore in magnesio ${name} per Birel. Cerchio racing professionale specifico per telai Birel. Lega di magnesio racing, design ottimizzato per aerodinamica e raffreddamento freni. Prestazioni ai massimi livelli.`;
    }
    else if (name.includes('MINI') || name.includes('Mini') || name.includes('mini')) {
      description = `Cerchio anteriore in magnesio ${name} per categoria MINI. Cerchio racing specifico per kart categoria MINI. Magnesio di alta qualità, leggerezza eccezionale per giovani piloti. Dimensioni ottimizzate per massima maneggevolezza.`;
    }
    else {
      description = `Cerchio anteriore in magnesio ${name}. Cerchio racing professionale in lega di magnesio ad alte prestazioni. Peso ridotto, massima rigidità, resistenza agli urti. Ideale per competizioni karting di alto livello. Venduto singolarmente.`;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: 'cerchi-mozzi-accessori',
      brand: product.brand,
      price: product.price,
      image: product.imageLocal,
      imageLocal: product.imageLocal,
      description,
      inStock: true,
      mondokartUrl: 'https://www.mondokart.com/it/cerchi-anteriori-magnesio-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...wheelsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', wheelsWithDescriptions.length, 'front magnesium wheel products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Products by brand:');

  const byBrand = {};
  wheelsWithDescriptions.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
  });

  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
})();
