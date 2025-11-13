const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const bleedScrewsData = require('./bleed-screws-data.json');

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
  for (const product of bleedScrewsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${bleedScrewsData.length} images\n`);

  // Add detailed descriptions to products
  const bleedScrewsWithDescriptions = bleedScrewsData.map(product => {
    let description = '';
    const name = product.name;

    // Vite spurgo M6 standard
    if (name.includes('Vite Spurgo M6') && name.includes('passo 1 std')) {
      description = 'Vite spurgo freno M6 passo 1 standard. Vite per spurgo aria impianto frenante, filettatura M6 passo 1mm, lunghezza standard.';
    }
    // Parapolvere per viti spurgo
    else if (name.includes('Parapolvere per viti spurgo')) {
      description = 'Parapolvere protettivo per viti spurgo freno. Cappuccio in gomma per protezione viti spurgo da polvere, sporco e umidità.';
    }
    // Tappo OTK TonyKart
    else if (name.includes('Tappo Ø 7 x 1 mm') && name.includes('OTK TonyKart')) {
      description = 'Tappo spurgo Ø 7x1mm con passaggio per pinza OTK TonyKart. Tappo originale con foro passante per spurgo aria pinza freno.';
    }
    // Spurgo M10 CRG V05/V04
    else if (name.includes('Spurgo M10 V05 - V04 CRG')) {
      description = 'Vite spurgo M10 per pinza CRG V05 e V04, passo 1mm. Vite spurgo specifica per pinze freno CRG V05 e V04.';
    }
    // Tappo M10 universale
    else if (name.includes('Tappo M10 freno')) {
      description = 'Tappo M10 universale per pompa freno. Tappo filettato M10 compatibile con tutti gli impianti frenanti kart, chiusura sicura.';
    }
    // Raccordo combinato CRG
    else if (name.includes('Raccordo combinato completo CRG')) {
      description = 'Raccordo combinato completo CRG. Raccordo multifunzione per impianto frenante CRG, include spurgo e connessioni integrate.';
    }
    // Vite spurgo BirelArt
    else if (name.includes('Vite spurgo pinza freno G 1/8 BirelArt')) {
      description = 'Vite spurgo pinza freno G 1/8 per BirelArt. Vite spurgo specifica con filettatura gas G 1/8 per pinze freno BirelArt.';
    }
    // Sfiato IPK/Praga/Formula K
    else if (name.includes('Sfiato M10x1') && name.includes('IPK')) {
      description = 'Sfiato M10x1 posteriore/anteriore per IPK, Praga e Formula K. Vite sfiato aria compatibile con pinze freno IPK, Praga e Formula K.';
    }
    // Vite spurgo M8
    else if (name.includes('Vite Spurgo M8 Pinza Freno')) {
      description = 'Vite spurgo M8 per pinza freno. Vite spurgo aria con filettatura M8, compatibile con diverse pinze freno kart.';
    }
    // Vite spurgo M6 corto Top-Kart
    else if (name.includes('Vite Spurgo M6 CORTO') && name.includes('Top-Kart')) {
      description = 'Vite spurgo M6 corta passo 1 per Top-Kart. Vite spurgo aria versione corta specifica per pinze Top-Kart, filettatura M6.';
    }
    else {
      description = `Vite spurgo freno ${name}. Componente essenziale per spurgo aria dall'impianto frenante. Ricambio di qualità per manutenzione professionale.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/viti-spurgo-freno-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...bleedScrewsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', bleedScrewsWithDescriptions.length, 'bleed screw products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Products by brand:');

  const byBrand = {};
  bleedScrewsWithDescriptions.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
  });

  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
})();
