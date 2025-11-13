const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const tonykartKitsData = require('./tonykart-revision-kits-data.json');

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
  for (const product of tonykartKitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${tonykartKitsData.length} images\n`);

  // Add detailed descriptions to products
  const tonykartKitsWithDescriptions = tonykartKitsData.map(product => {
    let description = '';
    const name = product.name;

    // Kit revisione pompa OTK TonyKart BSS/BS5/SA2/SA3
    if (name.includes('Pompa OTK TonyKart BSS BS5 SA2 SA3')) {
      description = 'Kit revisione completo per pompa freno OTK TonyKart modelli BSS, BS5, SA2 e SA3. Include tutte le guarnizioni, O-ring e componenti necessari per il ripristino completo della pompa freno.';
    }
    // Kit revisione pinza posteriore BSD/SA2/BWD
    else if (name.includes('Pinza Freno posteriore per BSD / SA2 / BWD')) {
      description = 'Kit revisione completo per pinza freno posteriore OTK modelli BSD, SA2 e BWD. Set completo di guarnizioni e O-ring per manutenzione professionale della pinza posteriore.';
    }
    // Kit revisione pinza anteriore BSS
    else if (name.includes('Pinza Freno anteriore BSS OTK')) {
      description = 'Kit revisione completo per pinza freno anteriore OTK modello BSS. Include tutti i componenti di tenuta necessari per ripristinare l\'efficienza massima della pinza anteriore BSS.';
    }
    // Kit revisione pinza anteriore BS5
    else if (name.includes('Pinza Freno anteriore BS5 OTK')) {
      description = 'Kit revisione completo per pinza freno anteriore OTK modello BS5. Set di guarnizioni e O-ring specifici per la pinza anteriore BS5, garantisce tenuta perfetta.';
    }
    // Kit revisione pinza BSM/BSM2
    else if (name.includes('Pinza Freno BSM BSM2 OTK')) {
      description = 'Kit revisione per pinza freno OTK modelli BSM e BSM2. Include guarnizioni e componenti di tenuta per la manutenzione completa delle pinze BSM/BSM2.';
    }
    else {
      description = `Kit revisione TonyKart OTK ${name}. Set completo di guarnizioni e componenti per manutenzione impianto frenante. Ricambi originali OTK per massima affidabilità.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-revisione-tonykart-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...tonykartKitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', tonykartKitsWithDescriptions.length, 'TonyKart revision kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  tonykartKitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
