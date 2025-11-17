// IAME Euro Series 2026 Official Calendar Data
// Official European series, recognised by IAME S.p.A.

export interface IAMEEvent {
  id: string
  series: 'IAME Euro Series'
  round: number
  dates: string // Date range as string
  startDate: string // ISO format for sorting
  endDate: string // ISO format
  venue: string
  location: string
  categories: string[]
  raceDays: number
  status: 'confirmed' | 'pending'
}

export const iame2026Calendar: IAMEEvent[] = [
  // IAME EURO SERIES 2026 (4 rounds)
  {
    id: 'iame-euro-2026-r1',
    series: 'IAME Euro Series',
    round: 1,
    dates: '11-14 Marzo 2026',
    startDate: '2026-03-11',
    endDate: '2026-03-14',
    venue: 'Karting Zuera',
    location: 'Zuera (Zaragoza), Spagna',
    categories: ['X30 MINI', 'X30 JUNIOR', 'X30 SENIOR'],
    raceDays: 4,
    status: 'confirmed'
  },
  {
    id: 'iame-euro-2026-r2',
    series: 'IAME Euro Series',
    round: 2,
    dates: '15-18 Aprile 2026',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    venue: 'Franciacorta Karting Track',
    location: 'Castrezzato (BS), Italia',
    categories: ['X30 MINI', 'X30 JUNIOR', 'X30 SENIOR'],
    raceDays: 4,
    status: 'confirmed'
  },
  {
    id: 'iame-euro-2026-r3',
    series: 'IAME Euro Series',
    round: 3,
    dates: '24-27 Giugno 2026',
    startDate: '2026-06-24',
    endDate: '2026-06-27',
    venue: 'Prokart Raceland',
    location: 'Wackersdorf, Germania',
    categories: ['X30 MINI', 'X30 JUNIOR', 'X30 SENIOR'],
    raceDays: 4,
    status: 'confirmed'
  },
  {
    id: 'iame-euro-2026-r4',
    series: 'IAME Euro Series',
    round: 4,
    dates: '26-29 Agosto 2026',
    startDate: '2026-08-26',
    endDate: '2026-08-29',
    venue: 'Karting Genk',
    location: 'Genk, Belgio',
    categories: ['X30 MINI', 'X30 JUNIOR', 'X30 SENIOR'],
    raceDays: 4,
    status: 'confirmed'
  }
]

// Helper function to get series color
export function getIAMESeriesColor(series: string): string {
  return 'bg-purple-600 hover:bg-purple-700 text-white'
}

// Helper function to get badge text
export function getIAMESeriesBadgeText(series: string, round?: number): string {
  if (round) {
    return `Round ${round}`
  }
  return 'IAME Euro'
}
