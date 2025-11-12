// ROK Cup 2026 Official Calendar Data
// *Pending confirmation by ASN

export interface ROKEvent {
  id: string
  series: 'ROK Winter Trophy' | 'ROK Cup Italia' | 'ROK Cup Superfinal' | 'ROK Cup Festival'
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

export const rok2026Calendar: ROKEvent[] = [
  // ROK WINTER TROPHY
  {
    id: 'rok-winter-2026',
    series: 'ROK Winter Trophy',
    dates: '21-22 Febbraio 2026',
    startDate: '2026-02-21',
    endDate: '2026-02-22',
    venue: 'South Garda Karting',
    location: 'Lonato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },

  // ROK CUP ITALIA 2026 (8 rounds)
  {
    id: 'rok-italia-2026-r1',
    series: 'ROK Cup Italia',
    round: 1,
    dates: '21-22 Marzo 2026',
    startDate: '2026-03-21',
    endDate: '2026-03-22',
    venue: 'Cremona Circuit',
    location: 'San Martino del Lago (CR), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r2',
    series: 'ROK Cup Italia',
    round: 2,
    dates: '11-12 Aprile 2026',
    startDate: '2026-04-11',
    endDate: '2026-04-12',
    venue: 'Leopard Circuit',
    location: 'Viterbo (VT), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r3',
    series: 'ROK Cup Italia',
    round: 3,
    dates: '2-3 Maggio 2026',
    startDate: '2026-05-02',
    endDate: '2026-05-03',
    venue: 'Franciacorta Karting Track',
    location: 'Castrezzato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r4',
    series: 'ROK Cup Italia',
    round: 4,
    dates: '23-24 Maggio 2026',
    startDate: '2026-05-23',
    endDate: '2026-05-24',
    venue: 'South Garda Karting',
    location: 'Lonato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r5',
    series: 'ROK Cup Italia',
    round: 5,
    dates: '13-14 Giugno 2026',
    startDate: '2026-06-13',
    endDate: '2026-06-14',
    venue: 'Pista Azzurra',
    location: 'Jesolo (VE), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r6',
    series: 'ROK Cup Italia',
    round: 6,
    dates: '11-12 Luglio 2026',
    startDate: '2026-07-11',
    endDate: '2026-07-12',
    venue: '7 Laghi Kart',
    location: 'Castelletto di Branduzzo (PV), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r7',
    series: 'ROK Cup Italia',
    round: 7,
    dates: '1-2 Agosto 2026',
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    venue: 'Franciacorta Karting Track',
    location: 'Castrezzato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },
  {
    id: 'rok-italia-2026-r8',
    series: 'ROK Cup Italia',
    round: 8,
    dates: '12-13 Settembre 2026',
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    venue: 'South Garda Karting',
    location: 'Lonato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  },

  // ROK CUP SUPERFINAL
  {
    id: 'rok-superfinal-2026',
    series: 'ROK Cup Superfinal',
    dates: '13-17 Ottobre 2026',
    startDate: '2026-10-13',
    endDate: '2026-10-17',
    venue: 'South Garda Karting',
    location: 'Lonato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK', 'SHIFTER ROK'],
    raceDays: 5,
    status: 'pending'
  },

  // ROK CUP FESTIVAL
  {
    id: 'rok-festival-2026',
    series: 'ROK Cup Festival',
    dates: '28-29 Novembre 2026',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    venue: 'Franciacorta Karting Track',
    location: 'Castrezzato (BS), Italia',
    categories: ['MINI ROK', 'JUNIOR ROK', 'SENIOR ROK', 'EXPERT ROK', 'SUPER ROK'],
    raceDays: 2,
    status: 'pending'
  }
]

// Helper function to get series color
export function getROKSeriesColor(series: ROKEvent['series']): string {
  switch (series) {
    case 'ROK Winter Trophy':
      return 'bg-sky-600 text-white'
    case 'ROK Cup Italia':
      return 'bg-orange-600 text-white'
    case 'ROK Cup Superfinal':
      return 'bg-purple-600 text-white'
    case 'ROK Cup Festival':
      return 'bg-green-600 text-white'
    default:
      return 'bg-racing-gray-600 text-white'
  }
}

// Helper function to get series badge text
export function getROKSeriesBadgeText(series: ROKEvent['series'], round?: number): string {
  if (series === 'ROK Winter Trophy') {
    return 'Winter Trophy'
  }
  if (series === 'ROK Cup Superfinal') {
    return 'Superfinal'
  }
  if (series === 'ROK Cup Festival') {
    return 'Festival'
  }
  if (round) {
    return `Round ${round}`
  }
  return series
}
