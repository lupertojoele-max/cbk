const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const wheelsData = require('./magnesium-wheel-sets-data.json');

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

    // Set cerchi magnesio specifici per brand
    if (name.includes('CRG')) {
      description = `Set completo 4 cerchi in magnesio ${name}. Cerchi racing professionali in lega di magnesio ad alta resistenza per kart CRG. Il set include 2 cerchi anteriori e 2 cerchi posteriori. Leggerezza estrema e rigidità ottimale per massime prestazioni in pista.`;
    }
    else if (name.includes('Douglas')) {
      description = `Set completo 4 cerchi in magnesio Douglas ${name}. I cerchi Douglas rappresentano l'eccellenza nel mondo del karting. Lega di magnesio di altissima qualità, lavorazione CNC di precisione. Massima affidabilità e durata anche nelle condizioni più estreme.`;
    }
    else if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `Set completo 4 cerchi in magnesio ${name} per TonyKart OTK. Cerchi racing originali o compatibili con telai TonyKart. Materiale magnesio ad alte prestazioni, bilanciamento perfetto, massima resistenza agli urti. Set completo anteriori + posteriori.`;
    }
    else if (name.includes('Birel')) {
      description = `Set completo 4 cerchi in magnesio ${name} per Birel. Cerchi racing professionali specifici per telai Birel. Lega di magnesio racing, design ottimizzato per aerodinamica e raffreddamento freni. Prestazioni ai massimi livelli.`;
    }
    else if (name.includes('Intrepid')) {
      description = `Set completo 4 cerchi in magnesio ${name} per Intrepid. Cerchi racing compatibili con telai Intrepid/IPK. Magnesio di alta qualità, leggerezza eccezionale, rigidità strutturale ottimale. Il set include cerchi anteriori e posteriori.`;
    }
    else {
      description = `Set completo 4 cerchi in magnesio ${name}. Set racing professionale composto da 2 cerchi anteriori e 2 cerchi posteriori in lega di magnesio ad alte prestazioni. Peso ridotto, massima rigidità, resistenza agli urti. Ideale per competizioni karting di alto livello.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/set-cerchi-magnesio-4pz/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...wheelsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', wheelsWithDescriptions.length, 'magnesium wheel set products!');
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
