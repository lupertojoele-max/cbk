const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const intrepidKitsData = require('./intrepid-revision-kits-data.json');

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
  for (const product of intrepidKitsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${intrepidKitsData.length} images\n`);

  // Add detailed descriptions to products
  const intrepidKitsWithDescriptions = intrepidKitsData.map(product => {
    let description = '';
    const name = product.name;

    // Kit revisione pinza posteriore Intrepid R1/R2
    if (name.includes('pinza posteriore Intrepid R1')) {
      description = 'Kit revisione completo per pinza freno posteriore Intrepid modelli R1 e R2. Include tutte le guarnizioni, O-ring e componenti di tenuta necessari per il ripristino completo della pinza posteriore.';
    }
    // Kit revisione pompa freno IPK/Intrepid/Formula K/Praga
    else if (name.includes('IPK - Pompa Freno Intrepid')) {
      description = 'Kit revisione universale per pompa freno compatibile con Intrepid, IPK, Formula K e Praga. Set completo di guarnizioni e O-ring per manutenzione professionale della pompa freno.';
    }
    else {
      description = `Kit revisione Intrepid ${name}. Set completo di guarnizioni e componenti per manutenzione impianto frenante. Ricambi di qualità per massima affidabilità.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/kit-revisione-intrepid-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...intrepidKitsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', intrepidKitsWithDescriptions.length, 'Intrepid revision kit products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Added products:');
  intrepidKitsWithDescriptions.forEach(p => {
    console.log(`  • ${p.name} - €${p.price}`);
  });
})();
