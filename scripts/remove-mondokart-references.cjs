const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('🔍 Analyzing products for "mondokart" references...\n');

let nameChanges = 0;
let descriptionChanges = 0;
let brandChanges = 0;

// Function to remove "mondokart" from text (case-insensitive, with or without spaces/hyphens)
function removeMondokart(text) {
  if (!text) return text;

  // Remove various forms of "mondokart" with surrounding spaces/punctuation
  const patterns = [
    /\bmondokart\s+racing\b/gi,
    /\bmondokart\s+kart\b/gi,
    /\bmondokart\s+go\s+kart\b/gi,
    /\bmondokart\s+karting\b/gi,
    /\bmondokart\b/gi,
  ];

  let result = text;
  patterns.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  // Clean up multiple spaces and trim
  result = result.replace(/\s+/g, ' ').trim();

  // Clean up double hyphens or spaces before hyphens/commas
  result = result.replace(/\s+-\s+/g, ' - ');
  result = result.replace(/\s+,/g, ',');

  // Remove double commas and clean up comma spacing
  result = result.replace(/,\s*,+/g, ',');
  result = result.replace(/,\s+/g, ', ');

  // Remove leading/trailing commas and fix spacing
  result = result.replace(/^,\s*/, '').replace(/\s*,\s*$/, '');

  // Clean up "kart, go kart" -> "kart go kart" (redundant text)
  result = result.replace(/,\s*kart,?\s*go\s*(kart)?/gi, '');
  result = result.replace(/,\s*karting/gi, '');
  result = result.replace(/,\s*ricambi\s*kart/gi, '');
  result = result.replace(/,\s*motore\s*kart/gi, '');

  return result.trim();
}

productsData.products = productsData.products.map(product => {
  const originalName = product.name;
  const originalDescription = product.description;
  const originalBrand = product.brand;

  // Clean name
  product.name = removeMondokart(product.name);
  if (product.name !== originalName) {
    console.log(`📝 NAME: "${originalName}" → "${product.name}"`);
    nameChanges++;
  }

  // Clean description
  product.description = removeMondokart(product.description);
  if (product.description !== originalDescription) {
    descriptionChanges++;
  }

  // Clean brand (replace "Mondokart Racing" with "Racing")
  if (product.brand && product.brand.toLowerCase().includes('mondokart')) {
    product.brand = product.brand.replace(/mondokart\s+racing/gi, 'Racing').replace(/mondokart/gi, 'Varie');
    product.brand = product.brand.trim();
    if (product.brand !== originalBrand) {
      console.log(`🏷️  BRAND: "${originalBrand}" → "${product.brand}"`);
      brandChanges++;
    }
  }

  return product;
});

// Save updated data
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ CLEANUP COMPLETE!');
console.log('='.repeat(60));
console.log(`📝 Product names cleaned: ${nameChanges}`);
console.log(`📄 Product descriptions cleaned: ${descriptionChanges}`);
console.log(`🏷️  Product brands cleaned: ${brandChanges}`);
console.log(`📦 Total products processed: ${productsData.products.length}`);
console.log('='.repeat(60));
