const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const ridolfiKitsData = require('./ridolfi-revision-kits-data.json');

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
  for (const product of ridolfiKitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${ridolfiKitsData.length} images\n`);

  // Add detailed descriptions to products
  const ridolfiKitsWithDescriptions = ridolfiKitsData.map(product => {
    let description = '';
    const name = product.name;

    // Kit revisione pinza RR K880
    if (name.includes('pinza RR K880')) {
      description = 'Kit revisione per pinza freno Righetti Ridolfi K880. Include guarnizioni e O-ring specifici per questo modello di pinza RR, garantisce tenuta perfetta.';
    }
    // Kit revisione pompa freno RR K225
    else if (name.includes('pompa freno RR K225')) {
      description = 'Kit revisione completo per pompa freno Righetti Ridolfi K225. Set di guarnizioni e componenti di tenuta per manutenzione professionale della pompa K225.';
    }
    // Kit revisione pompa con vaschetta RR KB030
    else if (name.includes('pompa con vaschetta RR KB030')) {
      description = 'Kit revisione per pompa freno con vaschetta Righetti Ridolfi KB030. Include tutti i componenti necessari per ripristinare pompa e vaschetta recupero fluido.';
    }
    // Kit revisione pompa manuale RR KB078
    else if (name.includes('pompa manuale RR KB078')) {
      description = 'Kit revisione per pompa freno manuale Righetti Ridolfi KB078. Set completo di guarnizioni per manutenzione pompa manuale senza recupero.';
    }
    // Kit revisione pinza anteriore MA20 KZ KF MINI
    else if (name.includes('pinza anteriore MA20 KZ KF MINI')) {
      description = 'Kit revisione per pinza freno anteriore MA20 Righetti Ridolfi, compatibile con KZ, KF e MINI. Componenti di tenuta specifici per pinza anteriore MA20.';
    }
    else {
      description = `Kit revisione Righetti Ridolfi ${name}. Set completo di guarnizioni e componenti per manutenzione impianto frenante. Ricambi originali RR per massima affidabilità.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-revisione-righetti-ridolfi-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...ridolfiKitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', ridolfiKitsWithDescriptions.length, 'Righetti Ridolfi revision kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  ridolfiKitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
