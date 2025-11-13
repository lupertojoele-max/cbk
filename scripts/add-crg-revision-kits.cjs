const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const crgKitsData = require('./crg-revision-kits-data.json');

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
  for (const product of crgKitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${crgKitsData.length} images\n`);

  // Add detailed descriptions to products
  const crgKitsWithDescriptions = crgKitsData.map(product => {
    let description = '';
    const name = product.name;

    // Kit revisione pinza posteriore 31.9mm V05
    if (name.includes('pinza posteriore 31,9mm V05')) {
      description = 'Kit revisione completo per pinza freno posteriore CRG V05 31,9mm. Include tutte le guarnizioni, O-ring e componenti necessari per la manutenzione completa della pinza posteriore.';
    }
    // Kit revisione pompa freno V05/V04/V09/V10/V11
    else if (name.includes('Pompa Freno V05 V04 V09 V10 V11')) {
      description = 'Kit revisione universale per pompa freno CRG modelli V05, V04, V09, V10 e V11. Contiene tutti i ricambi per il ripristino completo della pompa freno: guarnizioni, O-ring e componenti di tenuta.';
    }
    // Kit revisione pinza posteriore 29.8mm V09/V10
    else if (name.includes('pinza posteriore 29,8mm V09')) {
      description = 'Kit revisione completo per pinza freno posteriore CRG V09 e V10 da 29,8mm. Set completo di guarnizioni e O-ring per la manutenzione professionale della pinza posteriore.';
    }
    // Kit revisione pinza anteriore V05/Ven05
    else if (name.includes('pinza anteriore V05 Ven05')) {
      description = 'Kit revisione per pinza freno anteriore CRG V05 e Ven05. Include tutti i componenti di tenuta necessari per ripristinare l\'efficienza della pinza anteriore.';
    }
    // Kit revisione pompa freni V99 senza recupero
    else if (name.includes('pompa freni V99')) {
      description = 'Kit revisione per pompa freno CRG V99 (senza recupero). Set completo di guarnizioni e O-ring specifici per il modello V99 senza sistema di recupero fluido.';
    }
    else {
      description = `Kit revisione CRG ${name}. Set completo di guarnizioni e componenti per manutenzione impianto frenante. Ricambi originali per massima affidabilità.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-revisione-crg-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...crgKitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', crgKitsWithDescriptions.length, 'CRG revision kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  crgKitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
