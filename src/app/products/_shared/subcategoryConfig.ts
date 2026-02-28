export interface TypeGroup {
  label: string
  test: (nameLower: string) => boolean
}

export interface SubcategoryEntry {
  label: string
  brands?: string[]      // exact p.brand match
  nameKeywords?: string[] // keyword search only in p.name
  keywords?: string[]    // keyword search in name+brand+desc (fallback / for non-motor)
}

export interface SubcategoryConfig {
  pageTitle: string
  categories: string[]
  groups?: TypeGroup[] // optional: groups products by type within the page
  slugMap: Record<string, SubcategoryEntry>
}

// ─── Type groups for all motor-related pages ──────────────────────────────────
const motorGroups: TypeGroup[] = [
  { label: 'Cilindri e Coperchi', test: n => n.includes('cilindro') || (n.includes('coperchio') && n.includes('testa')) },
  { label: 'Pistoni e Spinotti',  test: n => n.includes('pistone') || n.includes('spinotto') },
  { label: 'Alberi Motore e Bielle', test: n => n.includes('albero') || n.includes('semialbero') || n.includes('biella') || n.includes('gabbia') || n.includes('gabbietta') || n.includes('manovella') },
  { label: 'Teste e Cupole',     test: n => n.includes('testa') || n.includes('cupola') || n.includes('camera combustione') || n.includes('prigioniero') },
  { label: 'Valvola di Scarico', test: n => n.includes('valvola scarico') || n.includes('polmone') || n.includes('ghigliottina') || n.includes('membrana valvola') || (n.includes('coperchio') && n.includes('valvola')) || n.includes('corpo valvola') || n.includes('pistone valvola') || n.includes('magnete valvola') },
  { label: 'Cambio e Frizione',  test: n => n.includes('cambio') || n.includes('frizione') || n.includes('ingranaggio') || n.includes('selettore') || n.includes('forchett') || n.includes('levett') || n.includes('marcia') || (n.includes('pignone') && n.includes('prim')) || n.includes('distanziale su pignone') || n.includes('asta fork') || n.includes('piastrina desm') || n.includes('puntale') || n.includes('piatto spingidisco') },
  { label: 'Guarnizioni e Tenute', test: n => n.includes('guarnizione') || n.includes('oring') || n.includes('o-ring') || n.includes('paraolio') || n.includes('seeger') || n.includes('rasamento') || n.includes('anello or') || n.includes('anello ten') },
  { label: 'Marmitta e Scarico', test: n => n.includes('marmitta') || (n.includes('collettore') && n.includes('scarico')) },
  { label: 'Accensione e Avviamento', test: n => n.includes('accensione') || n.includes('bobina') || n.includes('statore') || n.includes('rotore') || n.includes('volano') || n.includes('avviamento') || n.includes('cablaggio') || n.includes('motorino') || n.includes('supporto bobina') },
  { label: 'Kit e Serie',        test: n => n.includes('kit ') || n.includes(' kit') || n.includes('serie guarnizioni') || n.includes('modifica') || n.includes('revisione') },
]

// ─── Configs ──────────────────────────────────────────────────────────────────
export const subcategoryConfigs: Record<string, SubcategoryConfig> = {
  'motore-accessori': {
    pageTitle: 'Motore e Accessori',
    categories: ['motore-ricambi', 'ricambi-motore'],
    groups: motorGroups,
    slugMap: {
      // no brands/keywords = show ALL products from categories
      'ricambi-generici-motore': { label: 'Ricambi Generici Motore' },
      // brand exact + name keyword for broader match
      'iame':           { label: 'IAME',           brands: ['IAME'],       nameKeywords: ['iame', 'screamer', 'reedster', 'waterswift', 'leopard', 'x30 ', 'x30-', 's125'] },
      'tm-racing':      { label: 'TM Racing',      brands: ['TM Racing'],  nameKeywords: ['tm k', 'tm kz', 'tm r', ' tm '] },
      'bmb-bluebird':   { label: 'BMB / Bluebird', brands: [],             nameKeywords: ['bmb', 'bluebird', 'bullet'] },
      'rotax':          { label: 'Rotax',           brands: ['Rotax'],      nameKeywords: ['rotax', 'dd2', 'max evo'] },
      'vortex':         { label: 'Vortex',          brands: ['Vortex'],     nameKeywords: ['vortex', 'rvz', 'rkz', 'rvs', 'rvx', 'dds', 'rok '] },
      'comer':          { label: 'Comer',           brands: ['Comer'],      nameKeywords: ['comer', 'c50', 'w60', 'c60'] },
      'lke-lenzo-':     { label: 'LKE (Lenzo)',     brands: [],             nameKeywords: ['lke', 'lenzo'] },
      'maxter':         { label: 'Maxter',          brands: [],             nameKeywords: ['maxter', 'mxs'] },
      'modena-engines': { label: 'Modena Engines',  brands: [],             nameKeywords: ['modena', 'kk1', 'mkz'] },
      'wtp-60':         { label: 'WTP 60',          brands: [],             nameKeywords: ['wtp', 'wtp60', 'bluebird 50'] },
      'pavesi':         { label: 'Pavesi',          brands: [],             nameKeywords: ['pavesi'] },
    },
  },

  'carburatori': {
    pageTitle: 'Carburatori',
    categories: ['carburatori'],
    slugMap: {
      'attrezzatura-carburatori': { label: 'Attrezzatura Carburatori', keywords: ['attrezzatura'] },
      'dellorto-e-ricambi':       { label: "Dellorto e Ricambi",       brands: ['Dellorto'], nameKeywords: ['dellorto', "dell'orto"] },
      'ibea-e-ricambi':           { label: 'IBEA e Ricambi',           brands: ['IBEA'],     nameKeywords: ['ibea'] },
      'tillotson-e-ricambi':      { label: 'Tillotson e Ricambi',      brands: ['Tillotson'],nameKeywords: ['tillotson'] },
      'tryton-e-ricambi':         { label: 'Tryton e Ricambi',         brands: ['Tryton'],   nameKeywords: ['tryton'] },
      'walbro-e-ricambi':         { label: 'WALBRO e Ricambi',         brands: [],           nameKeywords: ['walbro'] },
    },
  },

  'radiatori-accessori': {
    pageTitle: 'Radiatori e Accessori',
    categories: ['radiatori-accessori'],
    slugMap: {
      'radiatori':      { label: 'Radiatori',        keywords: ['radiatore', 'radiator'] },
      'staffe-attacchi':{ label: 'Staffe & Attacchi', keywords: ['staffa', 'attacco', 'supporto'] },
      'tubi-radiatore': { label: 'Tubi Radiatore',   keywords: ['tubo', 'manicotto', 'raccordo'] },
      'pompa-acqua':    { label: 'Pompa Acqua',      keywords: ['pompa'] },
      'accessori':      { label: 'Accessori' },
      'tendine':        { label: 'Tendine',           keywords: ['tendina', 'tendine'] },
    },
  },

  'pneumatici-gomme': {
    pageTitle: 'Pneumatici e Gomme',
    categories: ['pneumatici'],
    slugMap: {
      'lecont':      { label: 'LeCont',      brands: ['LeCont'],      nameKeywords: ['lecont', 'le cont'] },
      'vega':        { label: 'Vega',        brands: [],              nameKeywords: ['vega'] },
      'maxxis':      { label: 'Maxxis',      brands: [],              nameKeywords: ['maxxis'] },
      'mg':          { label: 'MG',          brands: [],              nameKeywords: ['mg tyre', 'mg tire', ' mg '] },
      'komet':       { label: 'Komet',       brands: [],              nameKeywords: ['komet'] },
      'easykart':    { label: 'Easykart',    brands: [],              nameKeywords: ['easykart', 'easy kart'] },
      'bridgestone': { label: 'Bridgestone', brands: ['Bridgestone'], nameKeywords: ['bridgestone'] },
      'dunlop':      { label: 'Dunlop',      brands: [],              nameKeywords: ['dunlop'] },
      'accessori':   { label: 'Accessori',   keywords: ['copertina', 'camera', 'fissaggio'] },
      'attrezzatura':{ label: 'Attrezzatura',keywords: ['attrezzatura', 'macchina'] },
    },
  },

  'telemetrie-crono': {
    pageTitle: 'Telemetrie e Cronometri',
    categories: ['telemetrie'],
    slugMap: {
      'aim-mychron':  { label: 'AIM MyChron',  brands: ['AIM'],     nameKeywords: ['aim', 'mychron', 'mycron'] },
      'alfano':       { label: 'Alfano',        brands: ['Alfano'],  nameKeywords: ['alfano'] },
      'unipro':       { label: 'Unipro',        brands: ['Unipro'],  nameKeywords: ['unipro'] },
      'starlane':     { label: 'Starlane',      brands: ['Starlane'],nameKeywords: ['starlane'] },
      'contagiri-rpm':{ label: 'Contagiri RPM', keywords: ['contagiri', 'rpm', 'tachometro'] },
      'cronometri':   { label: 'Cronometri',    keywords: ['cronometro', 'timer', 'lap'] },
      'termometri':   { label: 'Termometri',    keywords: ['termometro', 'temperatura'] },
    },
  },

  'motori-nuovi': {
    pageTitle: 'Motori Nuovi',
    categories: ['motori-nuovi'],
    groups: motorGroups,
    slugMap: {
      'tm-racing':      { label: 'TM Racing',      brands: ['TM Racing'], nameKeywords: ['tm '] },
      'iame':           { label: 'IAME',            brands: ['IAME'],      nameKeywords: ['iame'] },
      'vortex':         { label: 'Vortex',          brands: ['Vortex'],    nameKeywords: ['vortex'] },
      'bmb':            { label: 'BMB',             brands: [],            nameKeywords: ['bmb', 'bluebird'] },
      'modena-engines': { label: 'Modena Engines',  brands: [],            nameKeywords: ['modena'] },
      'rotax':          { label: 'Rotax',           brands: ['Rotax'],     nameKeywords: ['rotax'] },
      'comer':          { label: 'Comer',           brands: ['Comer'],     nameKeywords: ['comer'] },
      'lke':            { label: 'LKE',             brands: [],            nameKeywords: ['lke'] },
      'briggs-stratton':{ label: 'Briggs & Stratton',brands: [],           nameKeywords: ['briggs'] },
    },
  },

  'kart-completi': {
    pageTitle: 'Kart Completi',
    categories: ['kart-completi'],
    slugMap: {
      'crg':          { label: 'CRG',           brands: ['CRG'],             nameKeywords: ['crg'] },
      'tony-kart':    { label: 'Tony Kart',     brands: ['TonyKart OTK'],    nameKeywords: ['tony kart', 'tonykart', 'otk'] },
      'birelart-kgp': { label: 'BirelArt & KGP',brands: ['Birel ART'],       nameKeywords: ['birel', 'kgp'] },
      'top-kart':     { label: 'Top-Kart',      brands: [],                  nameKeywords: ['top kart', 'top-kart'] },
      'kart-republic':{ label: 'Kart Republic', brands: ['Kart Republic'],   nameKeywords: ['kart republic'] },
      'easykart':     { label: 'Easykart',      brands: [],                  nameKeywords: ['easykart'] },
    },
  },

  'cuscinetti-paraoli-molle': {
    pageTitle: 'Cuscinetti, Paraoli e Molle',
    categories: ['molle-cuscinetti'],
    slugMap: {
      'molle':                  { label: 'Molle',               keywords: ['molla', 'molle', 'spring'] },
      'cuscinetti-telaio':      { label: 'Cuscinetti Telaio',   keywords: ['cuscinetto', 'bearing'] },
      'cuscinetti-motore':      { label: 'Cuscinetti Motore',   keywords: ['cuscinetto motore'] },
      'snodi-sferici--uniball': { label: 'Snodi Sferici, Uniball', keywords: ['uniball', 'snodo', 'sferico'] },
      'paraoli--anelli-tenuta': { label: 'Paraoli, Anelli Tenuta', keywords: ['paraolio', 'o-ring', 'tenuta'] },
      'gabbie-a-rulli':         { label: 'Gabbie a Rulli',      keywords: ['gabbia', 'rullo'] },
    },
  },
}
