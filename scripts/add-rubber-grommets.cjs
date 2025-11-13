const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const grommetsData = require('./rubber-grommets-data.json');

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
  for (const product of grommetsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${grommetsData.length} images\n`);

  // Add detailed descriptions to products
  const grommetsWithDescriptions = grommetsData.map(product => {
    let description = '';
    const name = product.name;

    // Gommini Akron standard
    if (name.includes('Gommino Akron') && !name.includes('tazza')) {
      const size = name.match(/[\d,]+mm/)?.[0] || '';
      description = `Gommino Akron ${size} esterno. Gommino passacavo in gomma di alta qualità per protezione cavi e tubi nel kart. Dimensione esterna ${size}.`;
    }
    // Gommini Akron a tazza
    else if (name.includes('Gommino Akron') && name.includes('tazza')) {
      const size = name.match(/[\d,]+\s*mm/)?.[0] || '';
      description = `Gommino Akron a tazza ${size}. Gommino passacavo a tazza in gomma per protezione e isolamento cavi. Forma a tazza per migliore tenuta.`;
    }
    // Gommini per telai specifici
    else if (name.includes('CRG')) {
      description = `Gommino passacavo specifico per telaio CRG. Componente originale per protezione cavi e tubi sul kart CRG, garantisce perfetta aderenza.`;
    }
    else if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `Gommino passacavo specifico per telaio TonyKart OTK. Ricambio originale per protezione cavi su kart TonyKart, perfetto fit garantito.`;
    }
    else if (name.includes('Birel')) {
      description = `Gommino passacavo specifico per telaio Birel. Componente originale Birel per protezione cavi e tubi, qualità e durata garantite.`;
    }
    else if (name.includes('IPK')) {
      description = `Gommino passacavo specifico per telaio IPK. Ricambio originale IPK per protezione cavi, massima compatibilità con telai IPK.`;
    }
    else if (name.includes('Intrepid')) {
      description = `Gommino passacavo specifico per telaio Intrepid. Componente originale per protezione cavi su kart Intrepid, perfetto adattamento.`;
    }
    // Gommini generici
    else {
      description = `Gommino passacavo in gomma per kart. Componente essenziale per protezione e isolamento di cavi e tubi sul telaio. Resistente e durevole.`;
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
      mondokartUrl: 'https://www.mondokart.com/it/gommini-singoli-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...grommetsWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', grommetsWithDescriptions.length, 'rubber grommet products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Products by brand:');

  const byBrand = {};
  grommetsWithDescriptions.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
  });

  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
})();
