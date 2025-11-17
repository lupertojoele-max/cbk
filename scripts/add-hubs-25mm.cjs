const fs = require('fs');
const path = require('path');
const axios = require('axios');

const hubsData = require('./hubs-25mm-data.json');
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
  console.log('📥 Downloading 25mm hub images...\n');
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
    const name = product.name;
    let description = `Mozzo anteriore ${name} con cuscinetti da 25mm. Mozzo racing professionale con cuscinetti di precisione da 25mm, materiale alluminio o magnesio ad alta resistenza. Compatibile con telai racing standard, lavorazione CNC di qualità, affidabilità e durata garantite.`;
    
    return {
      id: product.id, name: product.name, slug: product.slug,
      category: 'cerchi-mozzi-accessori', brand: product.brand, price: product.price,
      image: product.imageLocal, imageLocal: product.imageLocal, description, inStock: true,
      mondokartUrl: 'https://www.mondokart.com/it/mozzi-con-cuscinetti-da-25mm-mondokart/'
    };
  });

  productsData.products = [...productsData.products, ...hubsWithDescriptions];
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
  console.log('✅ Added', hubsWithDescriptions.length, 'hub 25mm products! Total:', productsData.products.length);
})();
