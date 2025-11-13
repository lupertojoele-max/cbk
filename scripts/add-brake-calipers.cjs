const fs = require('fs');
const path = require('path');

// Load scraped brake calipers data
const brakeCalipersData = require('./brake-calipers-data.json');

// Load existing products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('📦 Adding brake calipers products to catalog...\n');

// Add descriptions for brake calipers products
const brakeCalipersWithDescriptions = brakeCalipersData.map(product => {
  let description = '';
  let brand = product.brand || 'Mondokart Racing';

  const name = product.name;

  // Universal / Generic
  if (name.includes('Pinza freno adattabile 2PN100 SILVER')) {
    description = 'Pinza freno adattabile universale 2PN100 color silver. Compatibile con diversi telai, soluzione economica per sostituzioni.';
  } else if (name.includes('Pinza freno idraulica posteriore 4 pistoncini anodizzata')) {
    description = 'Pinza freno idraulica posteriore professionale con 4 pistoncini anodizzata. Frenata potente e modulabile per KZ e OK.';
  }
  // Top-Kart
  else if (name.includes('Top-Kart D.30')) {
    description = 'Pinza freno posteriore originale Top-Kart diametro 30mm. Qualità OEM per telai Top-Kart racing.';
    brand = 'Top-Kart';
  } else if (name.includes('MECCANICA Top-Kart Mini e Baby 60cc - ORO')) {
    description = 'Pinza freno meccanica Top-Kart per categorie Mini e Baby 60cc, finitura oro. Design specifico per giovani piloti.';
    brand = 'Top-Kart';
  } else if (name.includes('Top-Kart Mini e Baby 60cc') && !name.includes('MECCANICA')) {
    description = 'Pinza freno completa Top-Kart per categorie Mini e Baby 60cc. Dimensionamento ottimale per impianti frenanti ridotti.';
    brand = 'Top-Kart';
  }
  // CRG
  else if (name.includes('Pinza anteriore V04 completa CRG')) {
    description = 'Pinza freno anteriore completa CRG V04. Sistema frenante racing professionale per telai CRG.';
  } else if (name.includes('Pinza V05/UP anteriore completa Nera (ghisa) CRG')) {
    description = 'Pinza freno anteriore CRG V05/UP completa in ghisa nera. Robustezza e affidabilità per prestazioni costanti in gara.';
  } else if (name.includes('Pinza posteriore V04 completa CRG')) {
    description = 'Pinza freno posteriore completa CRG V04. Top di gamma per impianto frenante posteriore KZ racing.';
  } else if (name.includes('Pinza Posteriore CRG Ven05 (V05) V09 V10 V11 NERA')) {
    description = 'Pinza freno posteriore CRG Ven05 (V05) compatibile V09/V10/V11 nera. Multi-compatibilità con telai CRG recenti.';
  } else if (name.includes('Pinza anteriore V10 completa Oro CRG')) {
    description = 'Pinza freno anteriore CRG V10 completa con finitura oro. Design racing premium per telai CRG top level.';
  } else if (name.includes('Pinza V05 V09 V11 V13 anteriore completa ORO CRG')) {
    description = 'Pinza freno anteriore CRG oro compatibile V05/V09/V11/V13. Versatilità e performance su più modelli di telaio.';
  } else if (name.includes('Pinza freno posteriore completa V11 V10 V09 V05 V13 Oro CRG')) {
    description = 'Pinza freno posteriore CRG oro completa multi-modello V05/V09/V10/V11/V13. Massima compatibilità con telai CRG.';
  } else if (name.includes('Pinza Posteriore V05 V09 V10 V11 Nera CRG TOP-KART')) {
    description = 'Pinza freno posteriore nera multi-modello V05/V09/V10/V11 compatibile CRG e Top-Kart. Versatilità massima.';
  } else if (name.includes('Pinza Freno Anteriore V05 - V11 Nera CRG Top-Kart')) {
    description = 'Pinza freno anteriore nera CRG V05-V11 compatibile Top-Kart. Soluzione OEM per telai CRG e Top-Kart.';
  }
  // OTK TonyKart
  else if (name.includes('Pinza Freno Posteriore OTK Tony Kart – BWD')) {
    description = 'Pinza freno posteriore originale OTK TonyKart modello BWD. Sistema frenante professionale per gruppo OTK (TonyKart, Kosmic, EOS, Exprit).';
  } else if (name.includes('Pinza Freno Anteriore OTK Tony Kart – BWZ')) {
    description = 'Pinza freno anteriore originale OTK TonyKart modello BWZ. Top di gamma gruppo OTK per KZ e categorie racing superiori.';
  } else if (name.includes('Pinza Freno TonyKart BSD posteriore KZ - OK OTK TonyKart')) {
    description = 'Pinza freno posteriore OTK TonyKart BSD per KZ e OK. Sistema frenante racing professionale con massima modulazione.';
  } else if (name.includes('Pinza Freno posteriore SA2 (KZ e KF) (BS6)')) {
    description = 'Pinza freno posteriore SA2 (BS6) per categorie KZ e KF. Compatibile con telai OTK TonyKart sistema SA2.';
    brand = 'TonyKart OTK';
  } else if (name.includes('Pinza completa anteriore KZ BSS TonyKart OTK')) {
    description = 'Pinza freno anteriore completa KZ BSS originale OTK TonyKart. Sistema frenante racing per categorie cambio.';
  } else if (name.includes('Pinza freno anteriore SA3 completa (BS7) OTK')) {
    description = 'Pinza freno anteriore SA3 completa (BS7) OTK TonyKart. Sistema frenante per telai SA3 con modulazione ottimale.';
  } else if (name.includes('Pinza Freno Posteriore BSM Neos OTK TonyKart')) {
    description = 'Pinza freno posteriore BSM per categorie Neos OTK TonyKart. Dimensionamento specifico per giovani piloti.';
  } else if (name.includes('Pinza Freno Posteriore BSM Rookie OTK TonyKart')) {
    description = 'Pinza freno posteriore BSM per categorie Rookie OTK TonyKart. Sistema frenante entry-level con affidabilità OTK.';
  }
  // BirelArt
  else if (name.includes('Pinza Completa Posteriore R-I25x2-H5 BirelArt')) {
    description = 'Pinza freno posteriore completa BirelArt R-I25x2-H5. Sistema frenante originale per telai Birel ART.';
  } else if (name.includes('Pinza Completa Posteriore R I38x2 Easykart BirelArt')) {
    description = 'Pinza freno posteriore completa R-I38x2 per Easykart BirelArt. Specifico per categoria Easykart con impianto dedicato.';
  } else if (name.includes('Pinza Posteriore Completa RR-l132x2 BirelArt')) {
    description = 'Pinza freno posteriore completa RR-l132x2 BirelArt. Top di gamma per telai Birel ART racing ad alte prestazioni.';
  } else if (name.includes('Pinza Completa Posteriore Banana CX-I28 BirelArt')) {
    description = 'Pinza freno posteriore completa "Banana" CX-I28 BirelArt. Design caratteristico per massima potenza frenante.';
  } else if (name.includes('Pinza Posteriore Completa RR-l125x4-H16/A BirelArt')) {
    description = 'Pinza freno posteriore completa RR-l125x4-H16/A BirelArt. Sistema frenante professionale con 4 pistoncini.';
  } else if (name.includes('Pinza Freno Anteriore RR-I25x2-H12 KZ BirelArt')) {
    description = 'Pinza freno anteriore RR-I25x2-H12 per KZ BirelArt. Sistema frenante anteriore racing per categorie cambio.';
  } else if (name.includes('Pinza Freno CX-I24 - H5/A HQ BirelArt Nero')) {
    description = 'Pinza freno CX-I24 H5/A High Quality BirelArt nero. Qualità superiore per prestazioni racing top level.';
  } else if (name.includes('Pinza Freno I32x2 H8 Birel')) {
    description = 'Pinza freno I32x2 H8 originale Birel. Sistema frenante OEM per telai Birel con affidabilità comprovata.';
  }
  // Intrepid
  else if (name.includes('Pinza Freno Anteriore R1K Intrepid KZ')) {
    description = 'Pinza freno anteriore R1K Intrepid per KZ. Sistema frenante racing per categorie cambio con modulazione precisa.';
  } else if (name.includes('Pinza posteriore R1K R2K Intrepid (dal 2015 in poi)')) {
    description = 'Pinza freno posteriore R1K/R2K Intrepid per telai dal 2015 in poi. Compatibilità multi-modello con prestazioni elevate.';
  } else if (name.includes('Pinza posteriore Intrepid R1 R2')) {
    description = 'Pinza freno posteriore Intrepid R1/R2. Sistema frenante originale per telai Intrepid racing.';
  } else if (name.includes('Pinza freno anteriore KZ Intrepid R2')) {
    description = 'Pinza freno anteriore KZ Intrepid R2. Frenata potente e modulabile per categorie cambio.';
  }
  // PCR
  else if (name.includes('Pinza freno anteriore KZ (dal 2015) PCR')) {
    description = 'Pinza freno anteriore KZ per telai PCR dal 2015. Sistema frenante aggiornato per Intrepid PCR recenti.';
    brand = 'Intrepid';
  } else if (name.includes('Pinza freno posteriore KZ (2006 - 2014) PCR')) {
    description = 'Pinza freno posteriore KZ per telai PCR 2006-2014. Ricambio originale per modelli PCR precedenti.';
    brand = 'Intrepid';
  } else if (name.includes('Pinza freno posteriore KZ (dal 2015) PCR')) {
    description = 'Pinza freno posteriore KZ per telai PCR dal 2015. Sistema frenante racing per Intrepid PCR moderni.';
    brand = 'Intrepid';
  }
  // IPK / Praga / Formula K
  else if (name.includes('Pinza Freno Anteriore IPK - Praga - Formula K - OK1 - STR V2 V3 - VERIONE "R" - NEW')) {
    description = 'Pinza freno anteriore IPK/Praga/Formula K OK1 STR V2/V3 versione "R" NEW. Ultima evoluzione con performance migliorate.';
  } else if (name.includes('Pinza Freno Anteriore IPK - Praga - Formula K - OK1 - STR V2 V3')) {
    description = 'Pinza freno anteriore IPK/Praga/Formula K OK1 STR V2/V3. Compatibilità multi-brand gruppo IPK.';
  } else if (name.includes('Pinza Freno Posteriore IPK - Praga - Formula K - OK1 - RBS V2')) {
    description = 'Pinza freno posteriore IPK/Praga/Formula K OK1 RBS V2. Sistema frenante racing per gruppo IPK.';
  }
  // Righetti Ridolfi (Accessories)
  else if (name.includes('Staffa in acciaio per pinze RighettiRidolfi per telai Easykart')) {
    description = 'Staffa in acciaio per fissaggio pinze Righetti Ridolfi su telai Easykart. Accessorio specifico per montaggio pinze.';
  } else if (name.includes('Staffa in acciaio per pinze RighettiRidolfi')) {
    description = 'Staffa in acciaio universale per fissaggio pinze Righetti Ridolfi. Supporto resistente per montaggio stabile.';
  } else if (name.includes('Spessore 2mm Pinza Posteriore 2PN100 Righetti Ridolfi')) {
    description = 'Spessore da 2mm per pinza posteriore 2PN100 Righetti Ridolfi. Regolazione precisa allineamento pinza freno.';
  } else if (name.includes('Spessore 1mm Pinza Posteriore 2PN100 Righetti Ridolfi')) {
    description = 'Spessore da 1mm per pinza posteriore 2PN100 Righetti Ridolfi. Regolazione fine posizionamento pinza.';
  }
  // Fallback
  else {
    description = `Pinza freno ${brand} di qualità racing. Costruzione robusta per massime prestazioni e affidabilità in pista.`;
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
    mondokartUrl: 'https://www.mondokart.com/it/pinze-freno-mondokart/'
  };
});

// Remove previous 16 brake calipers (if any) and add new 45
const productsWithoutOldCalipers = productsData.products.filter(p => !p.id.startsWith('mk-pinze-freno-'));
productsData.products = [...productsWithoutOldCalipers, ...brakeCalipersWithDescriptions];

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('='.repeat(60));
console.log(`✅ Added ${brakeCalipersWithDescriptions.length} brake caliper products!`);
console.log('='.repeat(60));
console.log('\nProducts added by brand:');

const byBrand = {};
brakeCalipersWithDescriptions.forEach(product => {
  byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
});

Object.keys(byBrand).sort().forEach(brand => {
  console.log(`  ${brand}: ${byBrand[brand]} products`);
});

console.log('\nTotal products in catalog:', productsData.products.length);
