const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const accessoriesData = require('./wheel-accessories-data.json');

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
  for (const product of accessoriesData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${accessoriesData.length} images\n`);

  // Add detailed descriptions to products
  const accessoriesWithDescriptions = accessoriesData.map(product => {
    let description = '';
    const name = product.name;

    // Viti e dadi
    if (name.toLowerCase().includes('vite') || name.toLowerCase().includes('dado')) {
      if (name.toLowerCase().includes('m8')) {
        description = `${name}. Viteria professionale M8 per fissaggio cerchi kart. Materiale acciaio ad alta resistenza, trattamento superficiale anticorrosione. Compatibile con mozzi standard, serraggio sicuro e affidabile. Essenziale per montaggio cerchi racing.`;
      } else if (name.toLowerCase().includes('m10')) {
        description = `${name}. Viteria racing M10 per cerchi magnesio e alluminio. Acciaio temprato ad alta resistenza, precisione dimensionale garantita. Utilizzabile su tutti i telai racing, coppia di serraggio controllata. Qualità professionale.`;
      } else {
        description = `${name}. Viteria racing per fissaggio cerchi kart. Materiale acciaio di qualità, resistenza meccanica elevata, filettatura precisa. Compatibile con cerchi magnesio e alluminio. Set completo per montaggio sicuro.`;
      }
    }
    // Distanziali
    else if (name.toLowerCase().includes('distanziale') || name.toLowerCase().includes('spessore')) {
      description = `${name}. Distanziale di precisione per regolazione carreggiata kart. Materiale alluminio lavorato CNC, spessore calibrato, tolleranze minime. Permette regolazione fine dell'assetto, migliora handling e bilanciamento. Indispensabile per setup racing.`;
    }
    // Valvole
    else if (name.toLowerCase().includes('valvola')) {
      if (name.toLowerCase().includes('gomma')) {
        description = `${name}. Valvola in gomma flessibile per cerchi kart. Tenuta ermetica garantita, resistenza alle alte temperature. Compatibile con tutti i cerchi racing, montaggio rapido e sicuro. Affidabilità anche in condizioni estreme.`;
      } else {
        description = `${name}. Valvola racing per cerchi kart. Tenuta perfetta, resistenza meccanica elevata, compatibilità universale. Materiale di qualità professionale, durata garantita. Ideale per competizioni e allenamenti.`;
      }
    }
    // Tappi cerchio
    else if (name.toLowerCase().includes('tappo')) {
      description = `${name}. Tappo di protezione per foro centrale cerchio. Materiale plastica ad alta resistenza, chiusura ermetica, protezione da polvere e umidità. Mantiene pulito il mozzo, previene infiltrazioni. Universale per cerchi racing.`;
    }
    // Protezioni e coperture
    else if (name.toLowerCase().includes('protezione') || name.toLowerCase().includes('cover')) {
      description = `${name}. Protezione racing per cerchi kart. Materiale resistente agli urti, fissaggio sicuro, protezione ottimale. Previene danneggiamenti durante trasporto e stoccaggio. Indispensabile per preservare cerchi magnesio premium.`;
    }
    // Kit specifici per brand
    else if (name.includes('Birel')) {
      description = `${name} per Birel. Accessorio originale o compatibile per cerchi Birel. Qualità OEM, compatibilità verificata, affidabilità garantita. Specifico per telai e cerchi Birel, installazione perfetta.`;
    }
    else if (name.includes('TonyKart') || name.includes('OTK')) {
      description = `${name} per TonyKart OTK. Componente racing compatibile con cerchi TonyKart. Materiale di qualità, precisione dimensionale, durabilità professionale. Specifico per gamma OTK, installazione rapida.`;
    }
    else if (name.includes('Top-Kart')) {
      description = `${name} per Top-Kart. Accessorio specifico per cerchi Top-Kart. Qualità racing, compatibilità garantita, resistenza meccanica. Adatto a cerchi magnesio e alluminio Top-Kart.`;
    }
    // Generico
    else {
      description = `${name}. Accessorio racing professionale per cerchi kart. Materiale di qualità, lavorazione precisa, compatibilità universale. Essenziale per montaggio e manutenzione cerchi magnesio e alluminio. Affidabilità e durata garantite.`;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: 'cerchi-mozzi-accessori',
      brand: product.brand,
      price: product.price,
      image: product.imageLocal,
      imageLocal: product.imageLocal,
      description,
      inStock: true,
      mondokartUrl: 'https://www.mondokart.com/it/accessori-cerchi-mondokart/'
    };
  });

  // Add to products array
  productsData.products = [...productsData.products, ...accessoriesWithDescriptions];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', accessoriesWithDescriptions.length, 'wheel accessory products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 Products by brand:');

  const byBrand = {};
  accessoriesWithDescriptions.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
  });

  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });
})();
