// Mock data exports for development without backend
export { mockKarts, mockKartsResponse } from './karts'
export { mockDrivers, mockDriversResponse } from './drivers'
export { mockEvents, mockEventsResponse } from './events'
export { mockNews, mockNewsResponse } from './news'
export { mockSponsors, mockSponsorsResponse } from './sponsors'
export {
  mockSeasons,
  mockStandings2024,
  mockStandings2023,
  mockRecentRaces2024,
  mockSeasonResults2024,
  mockSeasonResults2023,
  mockAllSeasonResults,
  mockSeasonsResponse,
  mockSeasonResultsResponse
} from './results'

// Environment flag to control mock usage
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms))