/**
 * add-officina.cjs
 * Aggiunge i servizi officina Mondokart a products.json
 * Categorie: lavorazioni-motore, lavorazioni-telaio
 * Prezzi con IVA (x 1.22) come da convenzione del progetto
 */

const fs = require('fs')
const path = require('path')

const productsPath = path.join(__dirname, '..', 'data', 'products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

// Helper slug
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Prezzo con IVA, arrotondato a 2 decimali
function ivа(p) {
  return (Math.round(p * 1.22 * 100) / 100).toFixed(2)
}

// ID base progressivo
const existingIds = productsData.products.map(p => parseInt(p.id)).filter(n => !isNaN(n))
let nextId = Math.max(...existingIds) + 1

function makeProduct({ name, priceEx, category, subcategory, description, mondokartUrl }) {
  const id = String(nextId++)
  const slug = toSlug(name) + '-officina'
  return {
    id,
    name,
    slug,
    category,
    subcategory,
    brand: 'Mondokart',
    price: ivа(priceEx),
    image: '',
    imageLocal: '',
    description,
    inStock: true,
    mondokartUrl,
  }
}

// ── LAVORAZIONI MOTORE ────────────────────────────────────────────────────────
const lavorazioniMotore = [
  {
    name: 'Lappatura Cilindro',
    priceEx: 32.38,
    description: 'Lavorazione professionale di lappatura del cilindro per ripristino della corretta geometria e finitura superficiale interna. Essenziale per massimizzare la tenuta e le prestazioni del motore.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/lappatura-cilindro.html',
  },
  {
    name: 'Apertura, Chiusura, Equilibratura Albero Motore',
    priceEx: 36.89,
    description: 'Servizio completo di apertura, chiusura e equilibratura dell\'albero motore. Operazione fondamentale per garantire la corretta rotazione e bilanciatura del gruppo motore.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/apertura-chiusura-equilibratura-albero-motore.html',
  },
  {
    name: 'Alleggerimento Pistone Racing',
    priceEx: 36.89,
    description: 'Lavorazione di alleggerimento del pistone per applicazioni racing. Riduzione del peso della parte oscillante per migliorare la risposta del motore e ridurre le sollecitazioni interne.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/alleggerimento-pistone-racing.html',
  },
  {
    name: 'Lucidatura Testa',
    priceEx: 16.39,
    description: 'Lucidatura professionale della testa motore per ottimizzare il flusso dei gas e migliorare l\'efficienza della combustione. Operazione tipica nella preparazione racing.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/lucidatura-testa.html',
  },
  {
    name: 'Revisione e Regolazione Carburatore a Membrana',
    priceEx: 20.49,
    description: 'Revisione completa e regolazione del carburatore a membrana (Tillotson, Walbro). Controllo e sostituzione membrane, aghi, valvole e guarnizioni. Taratura ottimale per le condizioni di utilizzo.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-e-regolazione-carburatore-a-membrana.html',
  },
  {
    name: 'Revisione e Regolazione Carburatore a Vaschetta',
    priceEx: 20.49,
    description: 'Revisione completa e regolazione del carburatore a vaschetta (Dell\'Orto). Pulizia, controllo galleggiante, sostituzione guarnizioni e taratura per ottimizzare l\'erogazione.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-e-regolazione-carburatore-a-vaschetta.html',
  },
  {
    name: 'Revisione SOPRA Motore — senza Lappatura',
    priceEx: 49.18,
    description: 'Revisione della parte superiore del motore (testa, pistone, cilindro) senza lappatura. Include controllo usura, sostituzione o valutazione componenti e rimontaggio. Compatibile con tutti i motori kart.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-sopra-tutti-no-lappatura.html',
  },
  {
    name: 'Revisione SOPRA Motore — con Lappatura',
    priceEx: 77.87,
    description: 'Revisione completa della parte superiore del motore con lappatura del cilindro inclusa. La lappatura garantisce il perfetto accoppiamento cilindro-pistone per prestazioni ottimali.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-sopra-tutti-si-con-lappatura.html',
  },
  {
    name: 'Revisione Completa Motore KZ 125cc',
    priceEx: 131.15,
    description: 'Revisione completa del motore KZ 125cc a cambio. Smontaggio totale, controllo e sostituzione dei componenti usurati, lappatura cilindro, rimontaggio e regolazione. Garanzia di massime prestazioni in gara.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-kz-125cc-completa.html',
  },
  {
    name: 'Revisione Completa Motore Monomarcia KF — OK — 100cc — 125cc',
    priceEx: 114.75,
    description: 'Revisione completa del motore monomarcia per categorie KF, OK, 100cc e 125cc. Include smontaggio, controllo componenti, lappatura e rimontaggio con verifica funzionale finale.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-monomarcia-completa-kf-ok-100cc-.html',
  },
  {
    name: 'Revisione Completa Motore 60cc Mini Baby',
    priceEx: 106.56,
    description: 'Revisione completa del motore 60cc per categorie Mini e Baby. Servizio specifico per i motori delle categorie giovanili con la stessa cura e precisione dei motori senior.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-motore-mondokart/revisione-60cc-mini-baby-completa.html',
  },
  {
    name: 'Manodopera Officina (tariffa oraria)',
    priceEx: 8.20,
    description: 'Tariffa oraria di manodopera officina Mondokart. Fatturata a frazioni di 12 minuti (50€/ora + IVA). Per lavorazioni su misura non incluse nei pacchetti standard.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/manodopera-costo-orario-50.html',
  },
]

// ── LAVORAZIONI TELAIO ────────────────────────────────────────────────────────
const lavorazioniTelaio = [
  {
    name: 'Montaggio Gomme',
    priceEx: 8.20,
    description: 'Servizio di montaggio gomme su cerchi. Operazione professionale con attrezzatura dedicata per evitare danni ai cerchi in magnesio o alluminio.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/montaggio-gomme.html',
  },
  {
    name: 'Smontaggio e Montaggio Gomme',
    priceEx: 16.39,
    description: 'Servizio completo di smontaggio della gomma usata e montaggio di quella nuova. Include pulizia del cerchio e verifica dell\'integrità prima del montaggio.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/smontaggio-e-montaggio-gomme.html',
  },
  {
    name: 'Assetto Completo e Controllo Generale del Telaio',
    priceEx: 73.77,
    description: 'Assetto completo del kart con controllo generale del telaio. Include verifica e regolazione di camber, caster, convergenza, altezza da terra, posizione sedile e tutti i parametri geometrici fondamentali.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/assetto-completo-e-controllo-generale-del-telaio.html',
  },
  {
    name: 'Regolazione Convergenza Campanatura Incidenza',
    priceEx: 40.98,
    description: 'Regolazione professionale dei parametri di convergenza, campanatura e incidenza (caster). Fondamentale per ottimizzare il comportamento del kart in inserimento curva e stabilità in rettilineo.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/convergenza-campanatura-incidenza.html',
  },
  {
    name: 'Raddrizzamento Telaio su Banco di Riscontro',
    priceEx: 40.98,
    description: 'Raddrizzamento del telaio kart su banco di riscontro professionale dopo incidente o contatto. Ripristino delle geometrie originali per garantire comportamento dinamico corretto.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/raddrizzamento-telaio-su-banco-di-riscontro.html',
  },
  {
    name: 'Montaggio Sedile su Misura',
    priceEx: 40.98,
    description: 'Montaggio del sedile kart su misura per il pilota. Il posizionamento corretto del sedile è determinante per il trasferimento dei pesi e il comportamento del kart in curva.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/montaggio-sedile-su-misura.html',
  },
  {
    name: 'Cambio Assale',
    priceEx: 65.57,
    description: 'Servizio completo di sostituzione dell\'assale posteriore. Include smontaggio dell\'assale vecchio, installazione di quello nuovo, regolazione e verifica dell\'allineamento.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/cambio-assale.html',
  },
  {
    name: 'Spurgo Freni',
    priceEx: 24.59,
    description: 'Spurgo professionale del circuito frenante con sostituzione del liquido freni. Elimina le bolle d\'aria per un feeling di frenata diretto e progressivo. Operazione consigliata a inizio stagione.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/spurgo-freni.html',
  },
  {
    name: 'Pulizia Completa del Kart',
    priceEx: 49.18,
    description: 'Pulizia completa e professionale del kart: telaio, motore, carene, ruote e tutti i componenti accessibili. Il kart torna come appena uscito dal box, pronto per la prossima sessione.',
    mondokartUrl: 'https://www.mondokart.com/it/officina-mondokart-mondokart/lavorazioni-telaio-mondokart/pulizia-completa-del-kart.html',
  },
]

// Costruzione prodotti finali
const motoreProducts = lavorazioniMotore.map(s =>
  makeProduct({ ...s, category: 'lavorazioni-motore', subcategory: 'Revisioni Motore' })
)
const telaioProducts = lavorazioniTelaio.map(s =>
  makeProduct({ ...s, category: 'lavorazioni-telaio', subcategory: 'Lavorazioni Telaio' })
)

const newProducts = [...motoreProducts, ...telaioProducts]

// Controllo duplicati per slug
const existingSlugs = new Set(productsData.products.map(p => p.slug))
const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug))
const skipped = newProducts.length - toAdd.length

productsData.products = [...productsData.products, ...toAdd]
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2))

console.log('='.repeat(60))
console.log(`✅ Officina: aggiunti ${toAdd.length} servizi a products.json`)
if (skipped > 0) console.log(`⚠️  ${skipped} già presenti (slug duplicati)`)
console.log('='.repeat(60))
console.log('\nLavorazioni Motore:')
motoreProducts.forEach(p => console.log(`  - ${p.name} (€${p.price})`))
console.log('\nLavorazioni Telaio:')
telaioProducts.forEach(p => console.log(`  - ${p.name} (€${p.price})`))
console.log(`\nTotale prodotti in catalogo: ${productsData.products.length}`)
