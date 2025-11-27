const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the scraped data
const wheelsData = require('./otk-wheels-data.json');

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

// IVA 22%
function addIVA(price) {
  const numPrice = parseFloat(price);
  return (numPrice * 1.22).toFixed(2);
}

(async () => {
  console.log('📥 Downloading OTK wheels images...\n');

  let successCount = 0;
  for (const product of wheelsData) {
    const filename = path.basename(product.imageLocal);
    const filepath = path.join(imagesDir, filename);

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️ Skipping (exists): ${product.name}`);
      successCount++;
      continue;
    }

    console.log(`Downloading: ${product.name}`);
    await downloadImage(product.imageUrl, filepath);
    successCount++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${wheelsData.length} images\n`);

  // Add detailed descriptions to products
  const wheelsWithDescriptions = wheelsData.map(product => {
    const name = product.name;

    // Generic OTK wheel description
    let description = `Cerchio OTK ${name}. Cerchio racing originale TonyKart OTK in lega di alta qualità. Progettato per telai TonyKart, Kosmic, FA Kart, Exprit e tutti i telai del gruppo OTK. Massima precisione costruttiva, bilanciamento perfetto, resistenza agli urti. Ideale per competizioni karting di alto livello.`;

    // More specific descriptions based on product name
    if (name.toLowerCase().includes('anteriore') || name.toLowerCase().includes('front')) {
      description = `Cerchio anteriore OTK ${name}. Cerchio racing anteriore originale TonyKart OTK. Lega di magnesio/alluminio ad alte prestazioni, peso ottimizzato per massima reattività sterzo. Compatibile con tutti i telai del gruppo OTK: TonyKart, Kosmic, FA Kart, Exprit.`;
    } else if (name.toLowerCase().includes('posteriore') || name.toLowerCase().includes('rear')) {
      description = `Cerchio posteriore OTK ${name}. Cerchio racing posteriore originale TonyKart OTK. Progettato per massima trazione e stabilità in curva. Lega di alta qualità, resistenza estrema. Compatibile con telai TonyKart, Kosmic, FA Kart, Exprit.`;
    } else if (name.toLowerCase().includes('set') || name.toLowerCase().includes('kit')) {
      description = `Set cerchi OTK ${name}. Kit completo cerchi racing originali TonyKart OTK. Include cerchi anteriori e posteriori. Lega di alta qualità, bilanciamento perfetto, compatibilità garantita con tutti i telai del gruppo OTK.`;
    } else if (name.toLowerCase().includes('rain') || name.toLowerCase().includes('pioggia')) {
      description = `Cerchio OTK ${name} per condizioni di pioggia. Cerchio racing specifico per bagnato, originale TonyKart OTK. Design ottimizzato per evacuazione acqua, grip massimo su asfalto bagnato. Per telai TonyKart, Kosmic, FA Kart, Exprit.`;
    }

    // Calculate price with IVA
    const priceWithIVA = addIVA(product.price);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: 'cerchi-mozzi-accessori',
      subcategory: 'cerchi-otk',
      brand: 'TonyKart OTK',
      price: priceWithIVA,
      originalPrice: product.originalPrice ? addIVA(product.originalPrice) : null,
      image: product.imageLocal,
      imageLocal: product.imageLocal,
      description,
      inStock: true,
      mondokartUrl: 'https://www.mondokart.com/it/cerchi-otk-mondokart/'
    };
  });

  // Check for existing products to avoid duplicates
  const existingNames = new Set(productsData.products.map(p => p.name.toLowerCase()));
  const newProducts = wheelsWithDescriptions.filter(p => !existingNames.has(p.name.toLowerCase()));

  if (newProducts.length === 0) {
    console.log('⚠️ All products already exist in catalog. No new products added.');
    return;
  }

  // Add to products array
  productsData.products = [...productsData.products, ...newProducts];

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

  console.log('='.repeat(60));
  console.log('✅ Added', newProducts.length, 'OTK wheel products!');
  console.log('='.repeat(60));
  console.log('Total products in catalog:', productsData.products.length);
  console.log('\n📦 New products added:');

  newProducts.slice(0, 10).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} - €${p.price}`);
  });

  if (newProducts.length > 10) {
    console.log(`  ... and ${newProducts.length - 10} more`);
  }
})();
