const fs = require('fs');
const path = require('path');
const axios = require('axios');

const hubTypes = [
  { file: 'hubs-kz-40mm-data.json', url: 'https://www.mondokart.com/it/mozzi-per-kz-campana-40mm-mondokart/', desc: 'Mozzo anteriore KZ con campana 40mm' },
  { file: 'rear-hubs-25mm-data.json', url: 'https://www.mondokart.com/it/per-babykart-assale-25mm-mondokart/', desc: 'Mozzo posteriore per assale 25mm Baby' },
  { file: 'rear-hubs-30mm-data.json', url: 'https://www.mondokart.com/it/per-minikart-assale-30mm-mondokart/', desc: 'Mozzo posteriore per assale 30mm MINI' },
  { file: 'rear-hubs-40mm-data.json', url: 'https://www.mondokart.com/it/per-kf-kz-assale-40mm-mondokart/', desc: 'Mozzo posteriore per assale 40mm KF/KZ' },
  { file: 'rear-hubs-50mm-data.json', url: 'https://www.mondokart.com/it/per-kf-kz-assale-50mm-mondokart/', desc: 'Mozzo posteriore per assale 50mm KF/KZ' },
  { file: 'hub-accessories-data.json', url: 'https://www.mondokart.com/it/accessori-per-mozzi-ruota-mondokart/', desc: 'Accessorio per mozzi' }
];

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
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
    console.error(`Failed: ${error.message}`);
  }
}

(async () => {
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  for (const hubType of hubTypes) {
    const hubsData = require(`./${hubType.file}`);
    console.log(`\n📦 Processing ${hubType.file} (${hubsData.length} products)...`);
    
    for (const product of hubsData) {
      const filename = path.basename(product.imageLocal);
      const filepath = path.join(imagesDir, filename);
      await downloadImage(product.imageUrl, filepath);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const withDesc = hubsData.map(p => ({
      id: p.id, name: p.name, slug: p.slug, category: 'cerchi-mozzi-accessori',
      brand: p.brand, price: p.price, image: p.imageLocal, imageLocal: p.imageLocal,
      description: `${hubType.desc} ${p.name}. Componente racing professionale di alta qualità, materiale resistente, compatibilità verificata. Affidabilità e durata garantite per uso intensivo in pista.`,
      inStock: true, mondokartUrl: hubType.url
    }));
    
    productsData.products = [...productsData.products, ...withDesc];
    console.log(`✅ Added ${withDesc.length} products`);
  }
  
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
  console.log(`\n🎉 ALL HUBS ADDED! Total catalog: ${productsData.products.length} products`);
})();
