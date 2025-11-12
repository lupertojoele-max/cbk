// WSK 2026 Official Calendar Data
// *Pending confirmation by ASN

export interface WSKEvent {
  id: string
  series: 'WSK Official Test' | 'WSK Super Master Series' | 'WSK Euro Series' | 'WSK Final Cup'
  round?: number
  dates: string // Date range as string
  startDate: string // ISO format for sorting
  endDate: string // ISO format
  venue: string
  location: string
  categories: string[]
  raceDays: number
  status: 'confirmed' | 'pending'
}

export const wsk2026Calendar: WSKEvent[] = [
  // WSK Official Collective Test
  {
    id: 'wsk-test-2026-01',
    series: 'WSK Official Test',
    dates: '16-17-18 Gennaio 2026',
    startDate: '2026-01-16',
    endDate: '2026-01-18',
    venue: 'La Conca',
    location: 'Muro Leccese, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 3,
    status: 'pending'
  },

  // WSK SUPER MASTER SERIES (Wednesday/Sunday n.5 race days)
  {
    id: 'wsk-sms-2026-r1',
    series: 'WSK Super Master Series',
    round: 1,
    dates: '21-25 Gennaio 2026',
    startDate: '2026-01-21',
    endDate: '2026-01-25',
    venue: 'La Conca',
    location: 'Muro Leccese, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-sms-2026-r2',
    series: 'WSK Super Master Series',
    round: 2,
    dates: '04-08 Febbraio 2026',
    startDate: '2026-02-04',
    endDate: '2026-02-08',
    venue: 'Sarno',
    location: 'Sarno, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-sms-2026-r3',
    series: 'WSK Super Master Series',
    round: 3,
    dates: '18-22 Febbraio 2026',
    startDate: '2026-02-18',
    endDate: '2026-02-22',
    venue: 'Viterbo',
    location: 'Viterbo, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-sms-2026-r4',
    series: 'WSK Super Master Series',
    round: 4,
    dates: '04-08 Marzo 2026',
    startDate: '2026-03-04',
    endDate: '2026-03-08',
    venue: 'Lonato',
    location: 'Lonato del Garda, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-sms-2026-r5',
    series: 'WSK Super Master Series',
    round: 5,
    dates: '18-22 Marzo 2026',
    startDate: '2026-03-18',
    endDate: '2026-03-22',
    venue: 'Franciacorta',
    location: 'Castrezzato, Italia',
    categories: ['MINI', 'OKNJ', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },

  // WSK EURO SERIES (Wednesday/Saturday n.4 race days)
  {
    id: 'wsk-euro-2026-r1',
    series: 'WSK Euro Series',
    round: 1,
    dates: '11-14 Febbraio 2026',
    startDate: '2026-02-11',
    endDate: '2026-02-14',
    venue: 'Viterbo',
    location: 'Viterbo, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 4,
    status: 'pending'
  },
  {
    id: 'wsk-euro-2026-r2',
    series: 'WSK Euro Series',
    round: 2,
    dates: '15-18 Aprile 2026',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    venue: 'Lonato',
    location: 'Lonato del Garda, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 4,
    status: 'pending'
  },
  {
    id: 'wsk-euro-2026-r3',
    series: 'WSK Euro Series',
    round: 3,
    dates: '08-11 Luglio 2026',
    startDate: '2026-07-08',
    endDate: '2026-07-11',
    venue: 'Cremona',
    location: 'Cremona, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 4,
    status: 'pending'
  },

  // WSK FINAL CUP (Wednesday/Sunday n.5 race days)
  {
    id: 'wsk-final-2026-r1',
    series: 'WSK Final Cup',
    round: 1,
    dates: '26-30 Agosto 2026',
    startDate: '2026-08-26',
    endDate: '2026-08-30',
    venue: 'Franciacorta',
    location: 'Castrezzato, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-final-2026-r2',
    series: 'WSK Final Cup',
    round: 2,
    dates: '21-25 Ottobre 2026',
    startDate: '2026-10-21',
    endDate: '2026-10-25',
    venue: 'Lonato',
    location: 'Lonato del Garda, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  },
  {
    id: 'wsk-final-2026-r3',
    series: 'WSK Final Cup',
    round: 3,
    dates: '25-29 Novembre 2026',
    startDate: '2026-11-25',
    endDate: '2026-11-29',
    venue: 'Viterbo',
    location: 'Viterbo, Italia',
    categories: ['MINI', 'OKNJ', 'OKN', 'OKJ', 'OK', 'KZ2'],
    raceDays: 5,
    status: 'pending'
  }
]

// Helper function to get series color
export function getSeriesColor(series: WSKEvent['series']): string {
  switch (series) {
    case 'WSK Official Test':
      return 'bg-gray-600 text-white'
    case 'WSK Super Master Series':
      return 'bg-racing-red text-white'
    case 'WSK Euro Series':
      return 'bg-blue-600 text-white'
    case 'WSK Final Cup':
      return 'bg-amber-600 text-white'
    default:
      return 'bg-racing-gray-600 text-white'
  }
}

// Helper function to get series badge text
export function getSeriesBadgeText(series: WSKEvent['series'], round?: number): string {
  if (series === 'WSK Official Test') {
    return 'Test Collettivi'
  }
  if (round) {
    return `Round ${round}`
  }
  return series
}
