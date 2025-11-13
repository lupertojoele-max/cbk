const fs = require('fs');
const path = require('path');

// Load scraped brake discs data
const brakeDiscsData = require('./brake-discs-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake discs products to catalog...\n');

// Add descriptions for brake discs products
const brakeDiscsWithDescriptions = brakeDiscsData.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';
  const name = product.name;

  // Generic / Universal Discs
  if (name.includes('Disco Freno 210x8mm (Acciaio)')) {
    description = 'Disco freno in acciaio 210x8mm universale. Soluzione economica per sostituzioni su diversi telai, resistente e affidabile.';
  } else if (name.includes('autoventilato posteriore 210x12mm (Ghisa)')) {
    description = 'Disco freno posteriore autoventilato 210x12mm in ghisa. Dissipazione termica ottimale per frenate intense e ripetute.';
  } else if (name.includes('anteriore autoventilato forato Destro 160x12mm')) {
    description = 'Disco freno anteriore autoventilato forato destro 160x12mm in ghisa. Design forato per massima ventilazione e riduzione peso.';
  } else if (name.includes('anteriore autoventilato forato Sinistro 160x12mm')) {
    description = 'Disco freno anteriore autoventilato forato sinistro 160x12mm in ghisa. Frenata potente con dissipazione termica superiore.';
  } else if (name.includes('FISSO AUTOVENTILATO 210 x 12mm con fori (Ghisa) - SOTTILE')) {
    description = 'Disco freno fisso autoventilato 210x12mm con fori in ghisa sottile. Leggerezza e prestazioni racing con ventilazione ottimizzata.';
  }
  // CRG Discs
  else if (name.includes('Posteriore 195mm CRG V05 (Ven05) Ghisa - 195 - GRANDE')) {
    description = 'Disco freno posteriore CRG V05/Ven05 195mm grande in ghisa. Dimensione maggiorata per massima potenza frenante su telai CRG.';
  } else if (name.includes('Anteriore CRG V05 (Ven05) V10 Ghisa')) {
    description = 'Disco freno anteriore CRG V05/Ven05/V10 in ghisa. Compatibilità multi-modello con prestazioni racing professionali.';
  } else if (name.includes('New Age 190mmCRG')) {
    description = 'Disco freno CRG New Age 190mm. Sistema frenante racing per telai CRG serie New Age con bilanciamento ottimale.';
  } else if (name.includes('V04 anteriore CRG')) {
    description = 'Disco freno anteriore CRG V04. Ricambio originale per telai CRG V04 con qualità OEM e massima affidabilità.';
  } else if (name.includes('ANTERIORE CRG V11 V13 KZ')) {
    description = 'Disco freno anteriore CRG V11/V13 per KZ. Sistema frenante top di gamma per categorie cambio con modulazione precisa.';
  } else if (name.includes('Posteriore CRG V11 V13 KZ (STANDARD 192mm)')) {
    description = 'Disco freno posteriore CRG V11/V13 KZ standard 192mm. Dimensione regolamentare per massime prestazioni racing.';
  } else if (name.includes('anteriore V06 V10 CRG')) {
    description = 'Disco freno anteriore CRG V06/V10. Compatibile con telai CRG V06 e V10 con qualità costruttiva superiore.';
  } else if (name.includes('Posteriore 189mm CRG V09 / V10 / V05 - PICCOLO')) {
    description = 'Disco freno posteriore CRG 189mm piccolo per V05/V09/V10. Dimensione ridotta per setup specifici e regolazioni frenata.';
  } else if (name.includes('New Age 180mm CRG')) {
    description = 'Disco freno CRG New Age 180mm. Dimensione standard per telai CRG New Age con prestazioni bilanciate.';
  } else if (name.includes('Posteriore - 180 mm - CRG V13 (RIDOTTO)')) {
    description = 'Disco freno posteriore CRG V13 180mm ridotto. Dimensione diminuita per setup racing con minor peso e frenata modulabile.';
  } else if (name.includes('Posteriore 180mm UP V11 V13 Optional CRG')) {
    description = 'Disco freno posteriore CRG UP V11/V13 180mm optional. Alternativa ridotta per setup personalizzati e regolazioni avanzate.';
  }
  // OTK TonyKart Discs
  else if (name.includes('Posteriore 206 x 16 mm - MAGGIORATO - OTK TonyKart')) {
    description = 'Disco freno posteriore OTK TonyKart 206x16mm maggiorato. Dimensione massima per potenza frenante superiore su KZ racing.';
  } else if (name.includes('Posteriore 180 x 13 mm - STANDARD - OTK TonyKart')) {
    description = 'Disco freno posteriore OTK TonyKart 180x13mm standard. Dimensione regolamentare per categorie OK e KZ con prestazioni ottimali.';
  } else if (name.includes('posteriore Mini Margherita OTK TonyKart')) {
    description = 'Disco freno posteriore Mini Margherita OTK TonyKart. Design specifico per categorie Mini con peso contenuto e frenata efficace.';
  } else if (name.includes('anteriore autoventilante KZ BSS Destro OTK TonyKart')) {
    description = 'Disco freno anteriore autoventilato KZ BSS destro OTK TonyKart. Sistema frenante racing per categorie cambio con dissipazione termica avanzata.';
  } else if (name.includes('anteriore autoventilante KZ BSS Sinistro OTK TonyKart')) {
    description = 'Disco freno anteriore autoventilato KZ BSS sinistro OTK TonyKart. Prestazioni racing con ventilazione ottimizzata per KZ.';
  } else if (name.includes('Posteriore FISSO Mini 160x10 OTK TonyKart')) {
    description = 'Disco freno posteriore fisso Mini 160x10mm OTK TonyKart. Dimensionamento specifico per categorie giovani piloti.';
  } else if (name.includes('Posteriore 206 x 16 mm Tipo OTK TonyKart - NON OMOLOGATO')) {
    description = 'Disco freno posteriore 206x16mm tipo OTK TonyKart non omologato. Soluzione aftermarket economica per allenamenti e test.';
  } else if (name.includes('Posteriore BWD - OTK Tony Kart 180x13 mm')) {
    description = 'Disco freno posteriore OTK TonyKart BWD 180x13mm. Ricambio originale per sistema frenante BWD con qualità OEM.';
  }
  // Margherita (Daisy) Discs
  else if (name.includes('POSTERIORE Autoventilato MARGHERITA 195x18mm FLOTTANTE')) {
    description = 'Disco freno posteriore autoventilato Margherita 195x18mm flottante. Design a margherita per dissipazione termica massima e peso ridotto.';
  } else if (name.includes('ANTERIORE Autoventilato MARGHERITA 150x14mm FLOTTANTE')) {
    description = 'Disco freno anteriore autoventilato Margherita 150x14mm flottante. Sistema flottante per compensazione termica e frenata costante.';
  }
  // Intrepid / IPK Discs
  else if (name.includes('posteriore IPK - Intrepid R1 R2 R1K R2K')) {
    description = 'Disco freno posteriore IPK Intrepid R1/R2/R1K/R2K. Compatibilità multi-modello con telai Intrepid racing di generazioni diverse.';
    brand = 'Intrepid';
  } else if (name.includes('Anteriore IPK - Praga - Formula K - OK1 - STR V2 V3')) {
    description = 'Disco freno anteriore IPK/Praga/Formula K OK1 STR V2/V3. Ricambio originale multi-brand gruppo IPK con massima versatilità.';
    brand = 'IPK';
  } else if (name.includes('Posteriore 187mm IPK - Praga - Formula K - OK1 - RBS V2')) {
    description = 'Disco freno posteriore 187mm IPK/Praga/Formula K OK1 RBS V2. Dimensione specifica per telai gruppo IPK con prestazioni racing.';
    brand = 'IPK';
  } else if (name.includes('Posteriore 195mm IPK - Praga - Formula K - OK1 - RBS V2 V3')) {
    description = 'Disco freno posteriore 195mm IPK/Praga/Formula K OK1 RBS V2/V3. Dimensione maggiorata per massima potenza frenante gruppo IPK.';
    brand = 'IPK';
  } else if (name.includes('Posteriore Meccanico BABY IPK - Praga - Formula K - OK1')) {
    description = 'Disco freno posteriore meccanico BABY per IPK/Praga/Formula K. Specifico per categorie baby con freno meccanico a pedale.';
    brand = 'IPK';
  }
  // PCR Discs
  else if (name.includes('originale posteriore PCR') && !name.includes('dal 2015')) {
    description = 'Disco freno posteriore originale PCR fino al 2014. Ricambio OEM per telai PCR precedenti con qualità costruttiva superiore.';
    brand = 'Intrepid';
  } else if (name.includes('originale posteriore PCR') && name.includes('dal 2015')) {
    description = 'Disco freno posteriore originale PCR dal 2015. Ricambio aggiornato per telai PCR recenti con prestazioni migliorate.';
    brand = 'Intrepid';
  } else if (name.includes('anteriore PCR KF')) {
    description = 'Disco freno anteriore PCR KF. Sistema frenante specifico per categorie KF su telai PCR con modulazione ottimale.';
    brand = 'Intrepid';
  } else if (name.includes('anteriore PCR KZ')) {
    description = 'Disco freno anteriore PCR KZ. Potenza frenante massima per categorie cambio su telai PCR racing.';
    brand = 'Intrepid';
  }
  // Top-Kart Discs
  else if (name.includes('Top-Kart Mini 180mm') && !name.includes('CADET')) {
    description = 'Disco freno Top-Kart Mini 180mm. Dimensionamento specifico per categorie Mini con peso e potenza bilanciati.';
    brand = 'Top-Kart';
  } else if (name.includes('TopKart Mini 180mm CADET')) {
    description = 'Disco freno TopKart Mini 180mm per CADET. Design ottimizzato per giovani piloti categorie Cadet con sicurezza massima.';
    brand = 'Top-Kart';
  } else if (name.includes('Autoventilato 200mm OK KF KZ Bullet EVO Top-Kart')) {
    description = 'Disco freno autoventilato TopKart Bullet EVO 200mm per OK/KF/KZ. Top di gamma con dissipazione termica racing e prestazioni elevate.';
    brand = 'Top-Kart';
  } else if (name.includes('Autoventilato FLOTTANTE 200mm OK KF KZ TopKart')) {
    description = 'Disco freno autoventilato flottante TopKart 200mm per OK/KF/KZ. Sistema flottante con compensazione termica per frenata costante.';
    brand = 'Top-Kart';
  } else if (name.includes('Autoventilato FLOTTANTE 160mm TopKart')) {
    description = 'Disco freno autoventilato flottante TopKart 160mm. Design racing con sistema flottante per prestazioni professionali.';
    brand = 'Top-Kart';
  } else if (name.includes('Anteriore 140mm KF TopKart')) {
    description = 'Disco freno anteriore TopKart 140mm per KF. Dimensione compatta per categorie KF con modulazione precisa.';
    brand = 'Top-Kart';
  } else if (name.includes('Top-Kart Kid Kart 50cc 165mm')) {
    description = 'Disco freno Top-Kart Kid Kart 165mm per 50cc. Specifico per le più piccole categorie con sicurezza e affidabilità massime.';
    brand = 'Top-Kart';
  }
  // BirelArt Discs
  else if (name.includes('POSTERIORE Birel 80x180x16 KF KZ OK BirelArt')) {
    description = 'Disco freno posteriore BirelArt 80x180x16mm per KF/KZ/OK. Ricambio originale per telai Birel ART con qualità OEM.';
    brand = 'Birel';
  } else if (name.includes('anteriore fisso 80x150x12G KZ BirelArt')) {
    description = 'Disco freno anteriore fisso BirelArt 80x150x12G per KZ. Sistema frenante racing per categorie cambio con massima rigidità.';
    brand = 'Birel';
  } else if (name.includes('posteriore fisso W 66x180x8 RI38 BirelArt')) {
    description = 'Disco freno posteriore fisso BirelArt W 66x180x8 RI38. Ricambio per telai Birel con specifiche tecniche precise.';
    brand = 'Birel';
  } else if (name.includes('posteriore fisso 80x166x5 RI25 BirelArt')) {
    description = 'Disco freno posteriore fisso BirelArt 80x166x5 RI25. Dimensione compatta per setup racing specifici Birel ART.';
    brand = 'Birel';
  } else if (name.includes('anteriore 80x150x5 CXI24 BirelArt')) {
    description = 'Disco freno anteriore BirelArt 80x150x5 CXI24. Ricambio originale per sistema frenante anteriore telai Birel.';
    brand = 'Birel';
  } else if (name.includes('Posteriore Fisso BIG 80x200x6 INOX CXI28 (BANANA) BirelArt')) {
    description = 'Disco freno posteriore BirelArt BIG 80x200x6 INOX "BANANA" CXI28. Design caratteristico banana in acciaio inox per massima resistenza.';
    brand = 'Birel';
  } else if (name.includes('posteriore fisso W 66x180x4A BirelArt')) {
    description = 'Disco freno posteriore fisso BirelArt W 66x180x4A. Ricambio leggero per telai Birel ART con prestazioni racing.';
    brand = 'Birel';
  }
  // Generic Brake Discs
  else if (name.includes('200x8mm (Acciaio)')) {
    description = 'Disco freno in acciaio 200x8mm universale. Soluzione economica e resistente per diverse applicazioni karting.';
  }
  // Fallback
  else {
    description = `Disco freno ${brand} di qualità racing. Costruzione robusta per massime prestazioni e affidabilità in pista con dissipazione termica ottimale.`;
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: 'freni-accessori',
    brand,
    price: product.price,
    image: product.imageLocal,
    imageLocal: product.imageLocal,
    description,
    inStock: true,
    mondokartUrl: 'https://www.mondokart.com/it/dischi-freno-generici-mondokart/'
  };
});

// Add new brake discs products to catalog
productsData.products = [...productsData.products, ...brakeDiscsWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakeDiscsWithDescriptions.length} brake disc products!`);
console.log('='.repeat(60));
console.log('\nProducts added by brand:');

const byBrand = {};
brakeDiscsWithDescriptions.forEach(product => {
  byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
});

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`  ${brand}: ${byBrand[brand]} products`);
});

console.log('\nTotal products in catalog:', productsData.products.length);
