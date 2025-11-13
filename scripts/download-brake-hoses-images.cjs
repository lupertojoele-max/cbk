const axios = require('axios');
const fs = require('fs');
const path = require('path');

const products = [
  {
    name: "tubo-freno-universale-8mm-inox-pvc",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-universale-8mm-inox-pvc.jpg"
  },
  {
    name: "tubo-freno-anteriore-tris-occhiello-v06-crg",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-anteriore-freno-volante-tris-occhiello-v06-crg.jpg"
  },
  {
    name: "tubo-freno-720mm-occhiello-crg",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-720mm-occhiello-crg.jpg"
  },
  {
    name: "tubo-freno-anteriore-tris-570-350-570-kz-v05-v11-crg",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-anteriore-tris-570-350-570-kz-v05-v11-crg.jpg"
  },
  {
    name: "tubo-freno-otk-tonykart-bwd",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-otk-tonykart-bwd.jpg"
  },
  {
    name: "kit-anteriore-tubi-freno-kz-bss-otk-tonykart",
    url: "https://www.mondokart.com/c/86-home_default/kit-anteriore-tubi-freno-kz-bss-otk-tonykart.jpg"
  },
  {
    name: "kit-posteriore-tubi-freno-kz-bsd-otk-tonykart",
    url: "https://www.mondokart.com/c/86-home_default/kit-posteriore-tubi-freno-kz-bsd-otk-tonykart.jpg"
  },
  {
    name: "kit-tubi-freno-posteriore-sa2-bwd-otk-tonykart",
    url: "https://www.mondokart.com/c/86-home_default/kit-tubi-freno-posteriore-sa2-bwd-otk-tonykart.jpg"
  },
  {
    name: "kit-tubi-freno-anteriore-sa3-otk-tonykart",
    url: "https://www.mondokart.com/c/86-home_default/kit-tubi-freno-anteriore-sa3-otk-tonykart.jpg"
  },
  {
    name: "tubo-freno-completo-510-175-245-birelart",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-completo-510-175-245-birelart.jpg"
  },
  {
    name: "tubi-freno-kit-pcr-kz-anteriore-dal-2015",
    url: "https://www.mondokart.com/c/86-home_default/tubi-freno-kit-pcr-kz-anteriore-dal-2015.jpg"
  },
  {
    name: "tubo-freno-635mm-occhiello-mini-crg",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-635mm-occhiello-mini-crg.jpg"
  },
  {
    name: "tubo-freno-anteriore-kz-ipk-str-v2-v3",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-anteriore-kz-ipk-str-v2-v3.jpg"
  },
  {
    name: "tubo-freno-posteriore-kz-ipk-rbs-v2-v3",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-posteriore-kz-ipk-rbs-v2-v3.jpg"
  },
  {
    name: "tubo-freno-mini-ipk-mkb-v1",
    url: "https://www.mondokart.com/c/86-home_default/tubo-freno-mini-ipk-mkb-v1.jpg"
  },
  {
    name: "kit-tubi-freno-posteriore-bsm4-mini-otk-tonykart",
    url: "https://www.mondokart.com/c/86-home_default/kit-tubi-freno-posteriore-bsm4-mini-otk-tonykart.jpg"
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(product) {
  try {
    const response = await axios({
      url: product.url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const outputPath = path.join(outputDir, `${product.name}.jpg`);
    fs.writeFileSync(outputPath, response.data);
    console.log(`✓ Downloaded: ${product.name}.jpg`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${product.name}:`, error.message);
    return false;
  }
}

async function downloadAll() {
  console.log('Starting download of 16 brake hose product images...\n');

  let successCount = 0;
  let failCount = 0;

  for (const product of products) {
    const success = await downloadImage(product);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✓ Download complete!`);
  console.log(`  Success: ${successCount}/${products.length}`);
  console.log(`  Failed: ${failCount}/${products.length}`);
}

downloadAll();
