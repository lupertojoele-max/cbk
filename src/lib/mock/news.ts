import { News, ApiResponse } from '../types'

export const mockNews: News[] = [
  {
    id: 1,
    title: 'WSK Super Master Series – Round 4: a Lonato si decide la stagione',
    slug: 'wsk-super-master-series-round-4-lonato-2026',
    excerpt: 'Il team CBK1 è pronto per il quarto atto della WSK Super Master Series sul mitico South Garda Karting di Lonato del Garda. Con tutte le categorie in pista — da MINI a KZ2 — cinque giorni di fuoco attendono i nostri piloti.',
    content: 'Il circuito di South Garda Karting a Lonato del Garda ospita il Round 4 della WSK Super Master Series dal 4 all\'8 marzo 2026. Cinque giornate intense con le categorie MINI, OKNJ, OKJ, OK e KZ2 in pista. Il team CBK1 si presenta all\'appuntamento con ambizioni da podio dopo una prima parte di stagione promettente. La preparazione tecnica è stata curata nei minimi dettagli e i piloti sono pronti ad affrontare le sfide del tracciato gardesano.',
    category: 'Prossima Gara',
    status: 'published',
    published_at: '2026-02-23T09:00:00Z',
    is_featured: true,
    is_breaking: false,
    author: {
      name: 'Team CBK1',
      email: 'info@cbk1.it'
    },
    cover_image: {
      id: 1,
      url: '/images/events/italian-championship-1.jpg',
      thumb: '/images/events/italian-championship-1.jpg',
      alt: 'WSK Super Master Series Round 4 Lonato del Garda'
    },
    seo: {
      meta_title: 'WSK Super Master Series Round 4 – Lonato del Garda | CBK1',
      meta_description: 'Il team CBK1 al via del Round 4 WSK Super Master Series a Lonato del Garda, 4-8 marzo 2026.'
    },
    reading_time: 3,
    views: 412
  },
  {
    id: 2,
    title: 'IAME Euro Series 2026: debutto stagionale a Zuera',
    slug: 'iame-euro-series-round-1-zuera-2026',
    excerpt: 'Si apre il sipario sull\'IAME Euro Series 2026. Il kartodromo di Zuera ospita il primo round europeo: CBK1 scende in pista con le categorie X30 Junior e Senior con l\'obiettivo di partire con il piede giusto.',
    content: 'L\'IAME Euro Series 2026 prende il via dall\'11 al 14 marzo a Zuera, in Spagna, presso il Karting Zuera di Zaragoza. Il team CBK1 porta in pista i propri portacolori nelle categorie X30 Junior e X30 Senior. Il tracciato spagnolo, tecnico e selettivo, metterà alla prova preparazione e talento. La serie conta su quattro round europei e rappresenta una delle principali vetrine per i giovani piloti.',
    category: 'Prossima Gara',
    status: 'published',
    published_at: '2026-02-22T10:00:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'Team CBK1',
      email: 'info@cbk1.it'
    },
    cover_image: {
      id: 2,
      url: '/images/karts/red-rocket-1.jpg',
      thumb: '/images/karts/red-rocket-1.jpg',
      alt: 'IAME Euro Series Round 1 Zuera Spagna'
    },
    seo: {
      meta_title: 'IAME Euro Series Round 1 – Zuera 2026 | CBK1',
      meta_description: 'CBK1 al via dell\'IAME Euro Series 2026: primo round a Zuera (Spagna), 11-14 marzo.'
    },
    reading_time: 2,
    views: 289
  },
  {
    id: 3,
    title: 'ROK Cup Italia Round 1: si parte da Cremona',
    slug: 'rok-cup-italia-round-1-cremona-2026',
    excerpt: 'Parte il campionato ROK Cup Italia 2026 dal Cremona Circuit. CBK1 schiera i propri piloti nelle categorie Junior e Senior ROK puntando subito al podio nel primo round di una lunga stagione.',
    content: 'Il Cremona Circuit di San Martino del Lago dà il via alla ROK Cup Italia 2026 il 21 e 22 marzo. Otto round attendono piloti e team in una stagione che si preannuncia ricca di emozioni. CBK1 sarà presente con una formazione competitiva nelle categorie MINI ROK, Junior ROK e Senior ROK. La ROK Cup Italia è storicamente uno dei campionati nazionali più competitivi e seguiti della scena karting italiana.',
    category: 'Prossima Gara',
    status: 'published',
    published_at: '2026-02-21T11:00:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'Team CBK1',
      email: 'info@cbk1.it'
    },
    cover_image: {
      id: 3,
      url: '/images/karts/blue-blur-1.jpg',
      thumb: '/images/karts/blue-blur-1.jpg',
      alt: 'ROK Cup Italia Round 1 Cremona Circuit'
    },
    seo: {
      meta_title: 'ROK Cup Italia Round 1 – Cremona 2026 | CBK1',
      meta_description: 'CBK1 al via della ROK Cup Italia 2026: primo round al Cremona Circuit, 21-22 marzo.'
    },
    reading_time: 2,
    views: 198
  },
  {
    id: 4,
    title: 'WSK Super Master Series Round 5: Franciacorta chiude la prima fase',
    slug: 'wsk-super-master-series-round-5-franciacorta-2026',
    excerpt: 'Il Franciacorta Karting Track di Castrezzato ospita il quinto e ultimo round della prima fase WSK Super Master Series. Un appuntamento cruciale per le classifiche di campionato.',
    content: 'Dal 18 al 22 marzo il Franciacorta Karting Track di Castrezzato ospita il Round 5 della WSK Super Master Series. Cinque giorni di gara che chiudono la prima parte del campionato e definiranno gli equilibri in classifica per tutte le categorie coinvolte: MINI, OKNJ, OKJ, OK e KZ2. CBK1 è chiamato a una prestazione di alto livello su un circuito che conosce bene.',
    category: 'Prossima Gara',
    status: 'published',
    published_at: '2026-02-20T09:30:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'Team CBK1',
      email: 'info@cbk1.it'
    },
    cover_image: {
      id: 4,
      url: '/images/karts/green-machine-1.jpg',
      thumb: '/images/karts/green-machine-1.jpg',
      alt: 'WSK Super Master Series Round 5 Franciacorta'
    },
    seo: {
      meta_title: 'WSK Super Master Series Round 5 – Franciacorta 2026 | CBK1',
      meta_description: 'Round 5 WSK Super Master Series al Franciacorta Karting Track, 18-22 marzo 2026.'
    },
    reading_time: 2,
    views: 156
  },
  {
    id: 5,
    title: 'IAME Euro Series Round 2: si gareggia in casa al Franciacorta',
    slug: 'iame-euro-series-round-2-franciacorta-2026',
    excerpt: 'Il secondo round dell\'IAME Euro Series 2026 si disputa in Italia, al Franciacorta Karting Track di Castrezzato. Un\'occasione speciale per CBK1 che corre davanti al pubblico di casa.',
    content: 'Dal 15 al 18 aprile 2026 il Franciacorta Karting Track ospita il secondo round dell\'IAME Euro Series. Una gara in terra italiana che rappresenta un\'opportunità speciale per il team CBK1, che potrà contare sul supporto dei propri tifosi. Le categorie X30 Mini, Junior e Senior si sfideranno sul tracciato lombardo in un round che si preannuncia spettacolare.',
    category: 'Calendario',
    status: 'published',
    published_at: '2026-02-19T14:00:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'Team CBK1',
      email: 'info@cbk1.it'
    },
    cover_image: {
      id: 5,
      url: '/images/karts/lightning-strike-1.jpg',
      thumb: '/images/karts/lightning-strike-1.jpg',
      alt: 'IAME Euro Series Round 2 Franciacorta'
    },
    seo: {
      meta_title: 'IAME Euro Series Round 2 – Franciacorta 2026 | CBK1',
      meta_description: 'IAME Euro Series Round 2 al Franciacorta Karting Track, 15-18 aprile 2026.'
    },
    reading_time: 2,
    views: 134
  }
]

export const mockNewsResponse: ApiResponse<News[]> = {
  data: mockNews,
  meta: {
    total: mockNews.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockNews.length
  }
}
