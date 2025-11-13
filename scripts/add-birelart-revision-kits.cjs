const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const birelartKitsData = require('./birelart-revision-kits-data.json');

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
  for (const product of birelartKitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${birelartKitsData.length} images\n`);

  // Add detailed descriptions to products
  const birelartKitsWithDescriptions = birelartKitsData.map(product => {
    let description = '';
    const name = product.name;

    // Kit revisione pinza CX-I24 "Banana Anteriore"
    if (name.includes('CX-I24') && name.includes('Banana Anteriore')) {
      description = 'Kit revisione completo per pinza freno anteriore BirelArt CX-I24 "Banana". Include tutte le guarnizioni e O-ring necessari per il ripristino della pinza anteriore tipo banana.';
    }
    // Kit revisione pinza posteriore CX-I28 "Banana"
    else if (name.includes('CX-I28') && name.includes('Banana')) {
      description = 'Kit revisione completo per pinza freno posteriore BirelArt CX-I28 "Banana". Set completo di guarnizioni per manutenzione pinza posteriore tipo banana.';
    }
    // Kit revisione pinze RR-l25x4 x2
    else if (name.includes('RR-l25x4 x2')) {
      description = 'Kit revisione per pinze freno BirelArt RR-l25x4 x2. Set di guarnizioni e O-ring per doppia pinza, ideale per manutenzione completa impianto frenante.';
    }
    // Kit revisione pinza RR-I32X2 FL01
    else if (name.includes('RR-I32X2 FL01')) {
      description = 'Kit revisione per pinza freno BirelArt RR-I32X2 FL01. Include componenti di tenuta specifici per questo modello di pinza BirelArt.';
    }
    // Kit revisione pinza Easykart (primo tipo) B-I32x2
    else if (name.includes('Easykart (primo tipo)')) {
      description = 'Kit revisione per pinza freno Easykart primo tipo BirelArt B-I32x2. Set completo di guarnizioni specifiche per modelli Easykart prima generazione.';
    }
    // Kit revisione pompa freno con recupero 22SR
    else if (name.includes('Pompa Freno con Recupero 22SR')) {
      description = 'Kit revisione per pompa freno BirelArt 22SR con sistema di recupero. Include tutte le guarnizioni e O-ring per pompa con recupero fluido integrato.';
    }
    // Kit revisione pompa freno 19/B
    else if (name.includes('Pompa Freno Birelart 19/B')) {
      description = 'Kit revisione per pompa freno BirelArt modello 19/B. Set completo di guarnizioni e componenti di tenuta per manutenzione pompa 19/B.';
    }
    // Kit revisione I38x2 pinza Easykart
    else if (name.includes('I38x2 Pinza Freno BirelArt Easykart')) {
      description = 'Kit revisione I38x2 per pinza freno BirelArt Easykart. Componenti di tenuta essenziali per manutenzione pinze Easykart modelli recenti.';
    }
    else {
      description = `Kit revisione BirelArt ${name}. Set completo di guarnizioni e componenti per manutenzione impianto frenante. Ricambi originali BirelArt per massima affidabilità.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-revisione-birelart-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...birelartKitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', birelartKitsWithDescriptions.length, 'BirelArt revision kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  birelartKitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
