/**
 * Aggiunge i 3 tubi freno mancanti a products.json
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url, method: 'GET', responseType: 'arraybuffer', timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    fs.writeFileSync(path.join(imagesDir, filename), response.data);
    return true;
  } catch { return false; }
}

async function main() {
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const existingSlugs = new Set(productsData.products.map(p => p.slug));

  const bhData = JSON.parse(fs.readFileSync(path.join(__dirname, 'brake-hoses-data.json'), 'utf8'));
  const newItems = bhData.filter(p => p.slug && !existingSlugs.has(p.slug));

  console.log(`Found ${newItems.length} new brake hoses to add`);

  for (const item of newItems) {
    const filename = `${item.slug}.jpg`;
    if (!fs.existsSync(path.join(imagesDir, filename)) && item.imageUrl) {
      await downloadImage(item.imageUrl, filename);
    }
    productsData.products.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: 'freni-accessori',
      brand: item.brand || 'CBK Racing',
      price: item.price,
      image: item.imageUrl || '',
      imageLocal: item.imageLocal,
      description: `${item.name} - Tubo freno per kart`,
      inStock: true,
      specifications: {},
      mondokartUrl: item.productUrl || '',
    });
    console.log(`  + ${item.name}`);
  }

  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
  console.log(`Total products: ${productsData.products.length}`);
}

main().then(() => console.log('Done!')).catch(console.error);
