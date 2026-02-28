export interface SubcategoryEntry {
  label: string
  keywords: string[] // empty = show all products from categories
}

export interface SubcategoryConfig {
  pageTitle: string
  categories: string[]
  slugMap: Record<string, SubcategoryEntry>
}

export const subcategoryConfigs: Record<string, SubcategoryConfig> = {
  'motore-accessori': {
    pageTitle: 'Motore e Accessori',
    categories: ['motore-ricambi', 'ricambi-motore'],
    slugMap: {
      'ricambi-generici-motore': { label: 'Ricambi Generici Motore', keywords: [] },
      'iame':             { label: 'IAME',            keywords: ['iame'] },
      'tm-racing':        { label: 'TM Racing',       keywords: ['tm racing', 'tm-racing'] },
      'bmb-bluebird':     { label: 'BMB / Bluebird',  keywords: ['bmb', 'bluebird', 'bullet'] },
      'rotax':            { label: 'Rotax',            keywords: ['rotax'] },
      'vortex':           { label: 'Vortex',           keywords: ['vortex', 'dds'] },
      'comer':            { label: 'Comer',            keywords: ['comer', 'c50', 'w60'] },
      'lke-lenzo-':       { label: 'LKE (Lenzo)',      keywords: ['lke', 'lenzo'] },
      'maxter':           { label: 'Maxter',           keywords: ['maxter', 'mxs'] },
      'modena-engines':   { label: 'Modena Engines',   keywords: ['modena'] },
      'wtp-60':           { label: 'WTP 60',           keywords: ['wtp', 'wtp60'] },
      'pavesi':           { label: 'Pavesi',           keywords: ['pavesi'] },
    },
  },

  'carburatori': {
    pageTitle: 'Carburatori',
    categories: ['carburatori'],
    slugMap: {
      'attrezzatura-carburatori': { label: 'Attrezzatura Carburatori', keywords: ['attrezzatura'] },
      'dellorto-e-ricambi':       { label: "Dellorto e Ricambi",       keywords: ['dellorto', "dell'orto"] },
      'ibea-e-ricambi':           { label: 'IBEA e Ricambi',           keywords: ['ibea'] },
      'tillotson-e-ricambi':      { label: 'Tillotson e Ricambi',      keywords: ['tillotson'] },
      'tryton-e-ricambi':         { label: 'Tryton e Ricambi',         keywords: ['tryton'] },
      'walbro-e-ricambi':         { label: 'WALBRO e Ricambi',         keywords: ['walbro'] },
    },
  },

  'radiatori-accessori': {
    pageTitle: 'Radiatori e Accessori',
    categories: ['radiatori-accessori'],
    slugMap: {
      'radiatori':      { label: 'Radiatori',       keywords: ['radiatore', 'radiator'] },
      'staffe-attacchi':{ label: 'Staffe & Attacchi',keywords: ['staffa', 'attacco', 'supporto'] },
      'tubi-radiatore': { label: 'Tubi Radiatore',  keywords: ['tubo', 'manicotto', 'raccordo'] },
      'pompa-acqua':    { label: 'Pompa Acqua',     keywords: ['pompa'] },
      'accessori':      { label: 'Accessori',       keywords: [] },
      'tendine':        { label: 'Tendine',         keywords: ['tendina', 'tendine'] },
    },
  },

  'pneumatici-gomme': {
    pageTitle: 'Pneumatici e Gomme',
    categories: ['pneumatici'],
    slugMap: {
      'lecont':      { label: 'LeCont',      keywords: ['lecont', 'le cont'] },
      'vega':        { label: 'Vega',        keywords: ['vega'] },
      'maxxis':      { label: 'Maxxis',      keywords: ['maxxis'] },
      'mg':          { label: 'MG',          keywords: ['mg tyre', 'mg tire', ' mg '] },
      'komet':       { label: 'Komet',       keywords: ['komet'] },
      'easykart':    { label: 'Easykart',    keywords: ['easykart', 'easy kart'] },
      'bridgestone': { label: 'Bridgestone', keywords: ['bridgestone'] },
      'dunlop':      { label: 'Dunlop',      keywords: ['dunlop'] },
      'accessori':   { label: 'Accessori',   keywords: ['copertina', 'camera', 'fissaggio'] },
      'attrezzatura':{ label: 'Attrezzatura',keywords: ['attrezzatura', 'macchina'] },
    },
  },

  'telemetrie-crono': {
    pageTitle: 'Telemetrie e Cronometri',
    categories: ['telemetrie'],
    slugMap: {
      'aim-mychron':  { label: 'AIM MyChron',  keywords: ['aim', 'mychron', 'mycron'] },
      'alfano':       { label: 'Alfano',        keywords: ['alfano'] },
      'unipro':       { label: 'Unipro',        keywords: ['unipro'] },
      'starlane':     { label: 'Starlane',      keywords: ['starlane'] },
      'contagiri-rpm':{ label: 'Contagiri RPM', keywords: ['contagiri', 'rpm', 'tachometro'] },
      'cronometri':   { label: 'Cronometri',    keywords: ['cronometro', 'timer', 'lap'] },
      'termometri':   { label: 'Termometri',    keywords: ['termometro', 'temperatura'] },
    },
  },

  'motori-nuovi': {
    pageTitle: 'Motori Nuovi',
    categories: ['motori-nuovi'],
    slugMap: {
      'tm-racing':      { label: 'TM Racing',      keywords: ['tm'] },
      'iame':           { label: 'IAME',            keywords: ['iame'] },
      'vortex':         { label: 'Vortex',          keywords: ['vortex'] },
      'bmb':            { label: 'BMB',             keywords: ['bmb', 'bluebird'] },
      'modena-engines': { label: 'Modena Engines',  keywords: ['modena'] },
      'rotax':          { label: 'Rotax',           keywords: ['rotax'] },
      'comer':          { label: 'Comer',           keywords: ['comer'] },
      'lke':            { label: 'LKE',             keywords: ['lke'] },
      'briggs-stratton':{ label: 'Briggs & Stratton',keywords: ['briggs'] },
    },
  },

  'kart-completi': {
    pageTitle: 'Kart Completi',
    categories: ['kart-completi'],
    slugMap: {
      'crg':          { label: 'CRG',          keywords: ['crg'] },
      'tony-kart':    { label: 'Tony Kart',    keywords: ['tony kart', 'tonykart', 'otk'] },
      'birelart-kgp': { label: 'BirelArt & KGP', keywords: ['birel', 'kgp'] },
      'top-kart':     { label: 'Top-Kart',     keywords: ['top kart', 'top-kart'] },
      'kart-republic':{ label: 'Kart Republic', keywords: ['kart republic'] },
      'easykart':     { label: 'Easykart',     keywords: ['easykart'] },
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
