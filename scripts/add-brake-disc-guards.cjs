const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const guardsData = require('./brake-disc-guards-data.json');

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
  for (const product of guardsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${guardsData.length} images\n`);

  // Add detailed descriptions to products
  const guardsWithDescriptions = guardsData.map(product => {
    let description = '';
    const name = product.name;

    // KIT completo protezione disco posteriore OTK TonyKart
    if (name.includes('KIT Completo Protezione disco freno posteriore OTK')) {
      description = 'Kit completo protezione disco freno posteriore OTK TonyKart. Include staffa protezione e tutti i componenti di fissaggio. Protegge il disco da urti, detriti e danni durante la guida. Sistema robusto e affidabile.';
    }
    // Protezione disco Topkart
    else if (name.includes('Protezione Disco Freno Topkart')) {
      description = 'Protezione disco freno per Topkart. Paracolpi specifico per disco freno, protegge da impatti laterali e danni accidentali. Materiale resistente, montaggio semplice e sicuro.';
    }
    else {
      description = `Protezione disco freno ${name}. Componente protettivo essenziale per salvaguardare il disco freno da urti, detriti e danneggiamenti. Prolunga la vita del disco e mantiene prestazioni frenanti ottimali.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/protezioni-disco-freno-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...guardsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', guardsWithDescriptions.length, 'brake disc guard products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  guardsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
