const fs = require('fs');
const path = require('path');
const axios = require('axios');

const hubsData = require('./hubs-17mm-data.json');
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function downloadImage(url, filepath) {
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
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
  for (const product of hubsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);
    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${hubsData.length} images\n`);

  const hubsWithDescriptions = hubsData.map(product => {
    let description = '';
    const name = product.name;

    if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `Mozzo anteriore ${name} con cuscinetti da 17mm per TonyKart OTK. Mozzo racing originale o compatibile, cuscinetti di precisione da 17mm, lavorazione CNC di qualità. Compatibile con telai TonyKart, montaggio perfetto, affidabilità racing. Ideale per categorie MINI e OK.`;
    }
    else if (name.includes('CRG')) {
      description = `Mozzo anteriore ${name} con cuscinetti da 17mm per CRG. Mozzo racing professionale per telai CRG, cuscinetti 17mm di precisione, materiale alluminio o magnesio ad alta resistenza. Montaggio specifico CRG, durabilità garantita.`;
    }
    else if (name.includes('Birel')) {
      description = `Mozzo anteriore ${name} con cuscinetti da 17mm per Birel. Mozzo racing compatibile con telai Birel, cuscinetti da 17mm di qualità, lavorazione precisa. Design ottimizzato per telai Birel, resistenza meccanica elevata.`;
    }
    else {
      description = `Mozzo anteriore ${name} con cuscinetti da 17mm. Mozzo racing universale con cuscinetti di precisione da 17mm, materiale alluminio lavorato CNC, compatibilità ampia con telai standard. Affidabilità e durata garantite, ideale per categorie MINI e OK. Montaggio semplice e sicuro.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/mozzi-con-cuscinetti-da-17mm-mondokart/'
    };
  });

  productsData.products = [...productsData.products, ...hubsWithDescriptions];
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', hubsWithDescriptions.length, 'hub 17mm products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
})();
