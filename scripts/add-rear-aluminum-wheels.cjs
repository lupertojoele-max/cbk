const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const wheelsData = require('./rear-aluminum-wheels-data.json');

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

    // Cerchi posteriori alluminio specifici per brand
    if (name.includes('CRG')) {
      description = `Cerchio posteriore in alluminio ${name}. Cerchio racing in lega di alluminio ad alta resistenza per kart CRG. Ottimo rapporto qualità/prezzo, resistenza eccellente, ideale per allenamenti e gare. Compatibile con telai CRG.`;
    }
    else if (name.includes('Top-Kart') || name.includes('TopKart')) {
      description = `Cerchio posteriore in alluminio ${name} per Top-Kart. Cerchio racing professionale specifico per telai Top-Kart. Lega di alluminio di qualità, robustezza e affidabilità. Perfetto per uso intensivo in pista.`;
    }
    else if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `Cerchio posteriore in alluminio ${name} per TonyKart OTK. Cerchio racing originale o compatibile con telai TonyKart. Materiale alluminio ad alte prestazioni, resistenza agli urti e trazione ottimale.`;
    }
    else if (name.includes('Birel')) {
      description = `Cerchio posteriore in alluminio ${name} per Birel. Cerchio racing compatibile con telai Birel. Lega di alluminio racing, design ottimizzato per trazione e stabilità. Venduto singolarmente.`;
    }
    else if (name.includes('Douglas')) {
      description = `Cerchio posteriore in alluminio Douglas ${name}. Cerchio di qualità Douglas in lega di alluminio. Affidabilità e resistenza per uso racing e allenamenti. Compatibilità verificata.`;
    }
    else if (name.includes('MINI') || name.includes('Mini') || name.includes('mini')) {
      description = `Cerchio posteriore in alluminio ${name} per categoria MINI. Cerchio racing specifico per kart categoria MINI. Lega di alluminio leggera e resistente, dimensioni ottimizzate per giovani piloti. Trazione e sicurezza garantite.`;
    }
    else {
      description = `Cerchio posteriore in alluminio ${name}. Cerchio racing professionale in lega di alluminio ad alte prestazioni. Ottimo rapporto peso/resistenza, durata eccezionale, prezzo competitivo. Ideale per competizioni karting di tutti i livelli. Venduto singolarmente.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/cerchi-posteriori-alluminio-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...wheelsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', wheelsWithDescriptions.length, 'rear aluminum wheel products!');
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

  console.log('\n🎉 WHEELS SECTION COMPLETED! 🎉');
  console.log('All 6 wheel categories have been successfully added to the catalog.');
})();
