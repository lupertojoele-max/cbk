// Conditional import for server-side only
let revalidateTag: ((tag: string) => void) | undefined
try {
  if (typeof window === 'undefined') {
    // Only import on server side
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    revalidateTag = require('next/cache').revalidateTag
  }
} catch {
  // Fallback for build environments
  revalidateTag = undefined
}
import { z } from 'zod'
import {
  ApiResponse,
  ApiError,
  Kart,
  Driver,
  Event,
  EventResultsResponse,
  News,
  Sponsor,
  Season,
  SeasonResults,
  ContactFormData,
  ContactFormResponse,
  GetKartsParams,
  GetDriversParams,
  GetEventsParams,
  GetNewsParams,
  GetSponsorsParams,
  GetResultsParams,
} from './types'
import {
  KartSchema,
  DriverSchema,
  EventSchema,
  EventResultsSchema,
  NewsSchema,
  SponsorSchema,
  ApiResponseSchema,
  ApiErrorSchema,
} from './schemas'
import {
  USE_MOCK_DATA,
  simulateApiDelay,
  mockKartsResponse,
  mockDriversResponse,
  mockEventsResponse,
  mockNewsResponse,
  mockSponsorsResponse,
  mockSeasonsResponse,
  mockSeasonResultsResponse,
  mockKarts,
  mockDrivers,
  mockEvents,
  mockNews,
  mockSponsors,
  mockSeasons,
  mockAllSeasonResults,
  mockSeasonResults2024,
  mockSeasonResults2023,
} from './mock'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_VERSION = 'v1'
const DEFAULT_TIMEOUT = 10000 // 10 seconds

// Custom error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError: Error) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public validationErrors: z.ZodError) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Base fetch wrapper with timeout and error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT,
  schema?: z.ZodSchema<T>
): Promise<T> {
  const url = `${API_BASE_URL}/api/${API_VERSION}${endpoint}`

  // Create timeout controller
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    // Handle HTTP errors
    if (!response.ok) {
      let errorData: ApiError
      try {
        const errorJson = await response.json()
        const parsedError = ApiErrorSchema.parse(errorJson)
        errorData = parsedError
      } catch {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }
      }

      throw new ApiError(
        errorData.message,
        errorData.status,
        response,
        errorData.errors
      )
    }

    // Parse response
    const data = await response.json()

    // Validate with Zod if schema provided
    if (schema) {
      try {
        return schema.parse(data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ValidationError('Response validation failed', error)
        }
        throw error
      }
    }

    return data as T
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError || error instanceof ValidationError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError('Request timeout', error as Error)
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Network connection failed', error)
    }

    throw new NetworkError('Unexpected error occurred', error as Error)
  }
}

// Helper function to build query string
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Revalidation helper
export function revalidateApiCache(tags: string | string[]) {
  if (revalidateTag) {
    const tagArray = Array.isArray(tags) ? tags : [tags]
    tagArray.forEach(tag => revalidateTag!(tag))
  }
}

// KARTS API
export async function getKarts(params: GetKartsParams = {}): Promise<ApiResponse<Kart[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { per_page = 50, page = 1 } = params
    const startIndex = (page - 1) * per_page
    const endIndex = startIndex + per_page
    const paginatedKarts = mockKarts.slice(startIndex, endIndex)

    return {
      ...mockKartsResponse,
      data: paginatedKarts,
      meta: {
        ...mockKartsResponse.meta!,
        per_page,
        current_page: page,
        from: startIndex + 1,
        to: Math.min(endIndex, mockKarts.length)
      }
    }
  }

  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(KartSchema))

  try {
    return await apiRequest(
      `/karts${queryString}`,
      {
        next: {
          tags: ['karts'],
          revalidate: 300 // 5 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    // Fallback to mock data on network error
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for karts')
      await simulateApiDelay()
      const { per_page = 50, page = 1 } = params
      const startIndex = (page - 1) * per_page
      const endIndex = startIndex + per_page
      const paginatedKarts = mockKarts.slice(startIndex, endIndex)

      return {
        ...mockKartsResponse,
        data: paginatedKarts,
        meta: {
          ...mockKartsResponse.meta!,
          per_page,
          current_page: page,
          from: startIndex + 1,
          to: Math.min(endIndex, mockKarts.length)
        }
      }
    }
    throw error
  }
}

export async function getKart(slug: string): Promise<ApiResponse<Kart>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const kart = mockKarts.find(k => k.slug === slug)
    if (!kart) {
      throw new ApiError('Kart not found', 404)
    }
    return { data: kart }
  }

  const schema = ApiResponseSchema(KartSchema)

  try {
    return await apiRequest(
      `/karts/${encodeURIComponent(slug)}`,
      {
        next: {
          tags: ['karts', `kart:${slug}`],
          revalidate: 600 // 10 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    // Fallback to mock data on network error
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for kart')
      await simulateApiDelay()
      const kart = mockKarts.find(k => k.slug === slug)
      if (!kart) {
        throw new ApiError('Kart not found', 404)
      }
      return { data: kart }
    }
    throw error
  }
}

// DRIVERS API
export async function getDrivers(params: GetDriversParams = {}): Promise<ApiResponse<Driver[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { per_page = 50, page = 1, team_only } = params
    let filteredDrivers = mockDrivers

    if (team_only) {
      filteredDrivers = mockDrivers.filter(d => d.is_team_member)
    }

    const startIndex = (page - 1) * per_page
    const endIndex = startIndex + per_page
    const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

    return {
      ...mockDriversResponse,
      data: paginatedDrivers,
      meta: {
        ...mockDriversResponse.meta!,
        total: filteredDrivers.length,
        per_page,
        current_page: page,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredDrivers.length)
      }
    }
  }

  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(DriverSchema))

  try {
    return await apiRequest(
      `/drivers${queryString}`,
      {
        next: {
          tags: ['drivers'],
          revalidate: 300 // 5 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for drivers')
      await simulateApiDelay()
      const { per_page = 50, page = 1, team_only } = params
      let filteredDrivers = mockDrivers

      if (team_only) {
        filteredDrivers = mockDrivers.filter(d => d.is_team_member)
      }

      const startIndex = (page - 1) * per_page
      const endIndex = startIndex + per_page
      const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

      return {
        ...mockDriversResponse,
        data: paginatedDrivers,
        meta: {
          ...mockDriversResponse.meta!,
          total: filteredDrivers.length,
          per_page,
          current_page: page,
          from: startIndex + 1,
          to: Math.min(endIndex, filteredDrivers.length)
        }
      }
    }
    throw error
  }
}

export async function getDriver(slug: string): Promise<ApiResponse<Driver>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const driver = mockDrivers.find(d => d.slug === slug)
    if (!driver) {
      throw new ApiError('Driver not found', 404)
    }
    return { data: driver }
  }

  const schema = ApiResponseSchema(DriverSchema)

  try {
    return await apiRequest(
      `/drivers/${encodeURIComponent(slug)}`,
      {
        next: {
          tags: ['drivers', `driver:${slug}`],
          revalidate: 600 // 10 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for driver')
      await simulateApiDelay()
      const driver = mockDrivers.find(d => d.slug === slug)
      if (!driver) {
        throw new ApiError('Driver not found', 404)
      }
      return { data: driver }
    }
    throw error
  }
}

// EVENTS API
export async function getEvents(params: GetEventsParams = {}): Promise<ApiResponse<Event[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { per_page = 50, page = 1, upcoming, year, type } = params
    let filteredEvents = mockEvents

    if (upcoming) {
      filteredEvents = mockEvents.filter(e => e.schedule.is_upcoming)
    }
    if (year) {
      filteredEvents = filteredEvents.filter(e =>
        new Date(e.schedule.event_date).getFullYear() === year
      )
    }
    if (type) {
      filteredEvents = filteredEvents.filter(e =>
        e.type.toLowerCase().includes(type.toLowerCase())
      )
    }

    const startIndex = (page - 1) * per_page
    const endIndex = startIndex + per_page
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return {
      ...mockEventsResponse,
      data: paginatedEvents,
      meta: {
        ...mockEventsResponse.meta!,
        total: filteredEvents.length,
        per_page,
        current_page: page,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredEvents.length)
      }
    }
  }

  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(EventSchema))

  try {
    return await apiRequest(
      `/events${queryString}`,
      {
        next: {
          tags: ['events'],
          revalidate: 180 // 3 minutes (events change frequently)
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for events')
      await simulateApiDelay()
      const { per_page = 50, page = 1, upcoming, year, type } = params
      let filteredEvents = mockEvents

      if (upcoming) {
        filteredEvents = mockEvents.filter(e => e.schedule.is_upcoming)
      }
      if (year) {
        filteredEvents = filteredEvents.filter(e =>
          new Date(e.schedule.event_date).getFullYear() === year
        )
      }
      if (type) {
        filteredEvents = filteredEvents.filter(e =>
          e.type.toLowerCase().includes(type.toLowerCase())
        )
      }

      const startIndex = (page - 1) * per_page
      const endIndex = startIndex + per_page
      const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

      return {
        ...mockEventsResponse,
        data: paginatedEvents,
        meta: {
          ...mockEventsResponse.meta!,
          total: filteredEvents.length,
          per_page,
          current_page: page,
          from: startIndex + 1,
          to: Math.min(endIndex, filteredEvents.length)
        }
      }
    }
    throw error
  }
}

export async function getEvent(slug: string): Promise<ApiResponse<Event>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const event = mockEvents.find(e => e.slug === slug)
    if (!event) {
      throw new ApiError('Event not found', 404)
    }
    return { data: event }
  }

  const schema = ApiResponseSchema(EventSchema)

  try {
    return await apiRequest(
      `/events/${encodeURIComponent(slug)}`,
      {
        next: {
          tags: ['events', `event:${slug}`],
          revalidate: 300 // 5 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for event')
      await simulateApiDelay()
      const event = mockEvents.find(e => e.slug === slug)
      if (!event) {
        throw new ApiError('Event not found', 404)
      }
      return { data: event }
    }
    throw error
  }
}

export async function getEventResults(slug: string): Promise<EventResultsResponse> {
  return apiRequest(
    `/events/${encodeURIComponent(slug)}/results`,
    {
      next: {
        tags: ['results', `results:${slug}`],
        revalidate: 60 // 1 minute (results are live data)
      }
    },
    DEFAULT_TIMEOUT,
    EventResultsSchema
  )
}

// NEWS API
export async function getNews(params: GetNewsParams = {}): Promise<ApiResponse<News[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { per_page = 50, page = 1, category, featured } = params
    let filteredNews = mockNews

    if (category) {
      filteredNews = mockNews.filter(n =>
        n.category.toLowerCase().includes(category.toLowerCase())
      )
    }
    if (featured) {
      filteredNews = filteredNews.filter(n => n.is_featured)
    }

    const startIndex = (page - 1) * per_page
    const endIndex = startIndex + per_page
    const paginatedNews = filteredNews.slice(startIndex, endIndex)

    return {
      ...mockNewsResponse,
      data: paginatedNews,
      meta: {
        ...mockNewsResponse.meta!,
        total: filteredNews.length,
        per_page,
        current_page: page,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredNews.length)
      }
    }
  }

  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(NewsSchema))

  try {
    return await apiRequest(
      `/news${queryString}`,
      {
        next: {
          tags: ['news'],
          revalidate: 300 // 5 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for news')
      await simulateApiDelay()
      const { per_page = 50, page = 1, category, featured } = params
      let filteredNews = mockNews

      if (category) {
        filteredNews = mockNews.filter(n =>
          n.category.toLowerCase().includes(category.toLowerCase())
        )
      }
      if (featured) {
        filteredNews = filteredNews.filter(n => n.is_featured)
      }

      const startIndex = (page - 1) * per_page
      const endIndex = startIndex + per_page
      const paginatedNews = filteredNews.slice(startIndex, endIndex)

      return {
        ...mockNewsResponse,
        data: paginatedNews,
        meta: {
          ...mockNewsResponse.meta!,
          total: filteredNews.length,
          per_page,
          current_page: page,
          from: startIndex + 1,
          to: Math.min(endIndex, filteredNews.length)
        }
      }
    }
    throw error
  }
}

export async function getNewsItem(slug: string): Promise<ApiResponse<News>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const newsItem = mockNews.find(n => n.slug === slug)
    if (!newsItem) {
      throw new ApiError('News item not found', 404)
    }
    return { data: newsItem }
  }

  const schema = ApiResponseSchema(NewsSchema)

  try {
    return await apiRequest(
      `/news/${encodeURIComponent(slug)}`,
      {
        next: {
          tags: ['news', `news:${slug}`],
          revalidate: 600 // 10 minutes
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for news item')
      await simulateApiDelay()
      const newsItem = mockNews.find(n => n.slug === slug)
      if (!newsItem) {
        throw new ApiError('News item not found', 404)
      }
      return { data: newsItem }
    }
    throw error
  }
}

// SPONSORS API
export async function getSponsors(params: GetSponsorsParams = {}): Promise<ApiResponse<Sponsor[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { level, active_only } = params
    let filteredSponsors = mockSponsors

    if (level) {
      filteredSponsors = mockSponsors.filter(s =>
        s.sponsorship_level.toLowerCase() === level.toLowerCase()
      )
    }
    if (active_only) {
      filteredSponsors = filteredSponsors.filter(s =>
        s.contract_status.toLowerCase() === 'active'
      )
    }

    return {
      ...mockSponsorsResponse,
      data: filteredSponsors,
      meta: {
        ...mockSponsorsResponse.meta!,
        total: filteredSponsors.length
      }
    }
  }

  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(SponsorSchema))

  try {
    return await apiRequest(
      `/sponsors${queryString}`,
      {
        next: {
          tags: ['sponsors'],
          revalidate: 3600 // 1 hour (sponsors change infrequently)
        }
      },
      DEFAULT_TIMEOUT,
      schema
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for sponsors')
      await simulateApiDelay()
      const { level, active_only } = params
      let filteredSponsors = mockSponsors

      if (level) {
        filteredSponsors = mockSponsors.filter(s =>
          s.sponsorship_level.toLowerCase() === level.toLowerCase()
        )
      }
      if (active_only) {
        filteredSponsors = filteredSponsors.filter(s =>
          s.contract_status.toLowerCase() === 'active'
        )
      }

      return {
        ...mockSponsorsResponse,
        data: filteredSponsors,
        meta: {
          ...mockSponsorsResponse.meta!,
          total: filteredSponsors.length
        }
      }
    }
    throw error
  }
}

// SPECIAL ENDPOINTS
export async function getCalendarIcs(): Promise<string> {
  return apiRequest(
    `/calendar.ics`,
    {
      next: {
        tags: ['calendar'],
        revalidate: 3600 // 1 hour
      }
    },
    DEFAULT_TIMEOUT
  )
}

export async function getSitemap(): Promise<string> {
  return apiRequest(
    `/sitemap.xml`,
    {
      next: {
        tags: ['sitemap'],
        revalidate: 86400 // 24 hours
      }
    },
    DEFAULT_TIMEOUT
  )
}

export interface HealthCheckResponse {
  status: string
  timestamp: string
  version: string
  environment: string
  database: {
    status: string
    response_time: string
  }
  cache: {
    status: string
    driver: string
  }
  statistics: {
    total_drivers: number
    total_karts: number
    total_events: number
    upcoming_events: number
    published_articles: number
    active_sponsors: number
  }
}

export async function getHealthCheck(): Promise<HealthCheckResponse> {
  return apiRequest(
    `/health`,
    {
      next: {
        tags: ['health'],
        revalidate: 60 // 1 minute
      }
    },
    5000 // Shorter timeout for health checks
  )
}

// RESULTS AND SEASONS API
export async function getSeasons(): Promise<ApiResponse<Season[]>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    return mockSeasonsResponse
  }

  try {
    return await apiRequest(
      `/seasons`,
      {
        next: {
          tags: ['seasons'],
          revalidate: 3600 // 1 hour
        }
      },
      DEFAULT_TIMEOUT
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for seasons')
      await simulateApiDelay()
      return mockSeasonsResponse
    }
    throw error
  }
}

export async function getSeasonResults(params: GetResultsParams = {}): Promise<ApiResponse<SeasonResults>> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await simulateApiDelay()
    const { season_year = 2024 } = params

    if (season_year === 2024) {
      return mockSeasonResultsResponse
    } else if (season_year === 2023) {
      return { data: mockSeasonResults2023 }
    } else {
      // Return empty results for other years
      return {
        data: {
          season: mockSeasons.find(s => s.year === season_year) || mockSeasons[0],
          standings: [],
          recent_races: [],
          statistics: {
            total_drivers: 0,
            different_winners: 0,
            closest_championship_gap: 0,
            most_wins_driver: 'N/A',
            most_poles_driver: 'N/A',
            fastest_lap_record: {
              driver: 'N/A',
              time: 'N/A',
              event: 'N/A'
            }
          }
        }
      }
    }
  }

  const queryString = buildQueryString(params)

  try {
    return await apiRequest(
      `/results${queryString}`,
      {
        next: {
          tags: ['results'],
          revalidate: 300 // 5 minutes
        }
      },
      DEFAULT_TIMEOUT
    )
  } catch (error) {
    if (error instanceof NetworkError) {
      console.warn('API unavailable, using mock data for season results')
      await simulateApiDelay()
      const { season_year = 2024 } = params

      if (season_year === 2024) {
        return mockSeasonResultsResponse
      } else if (season_year === 2023) {
        return { data: mockSeasonResults2023 }
      } else {
        return {
          data: {
            season: mockSeasons.find(s => s.year === season_year) || mockSeasons[0],
            standings: [],
            recent_races: [],
            statistics: {
              total_drivers: 0,
              different_winners: 0,
              closest_championship_gap: 0,
              most_wins_driver: 'N/A',
              most_poles_driver: 'N/A',
              fastest_lap_record: {
                driver: 'N/A',
                time: 'N/A',
                event: 'N/A'
              }
            }
          }
        }
      }
    }
    throw error
  }
}

// CONTACT FORM API
export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/contact`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 429) {
        throw new ApiError('Too many requests. Please wait a moment before trying again.', 429, response)
      } else if (response.status === 422 && errorData.errors) {
        // Laravel validation errors
        throw new ApiError('Validation failed', 422, response, errorData.errors)
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Network connection failed. Please check your internet connection and try again.', error)
    }

    throw new NetworkError('Unexpected error occurred while sending your message.', error as Error)
  }
}

// Utility functions for client-side usage
export const api = {
  // Karts
  karts: {
    list: getKarts,
    get: getKart,
  },

  // Drivers
  drivers: {
    list: getDrivers,
    get: getDriver,
  },

  // Events
  events: {
    list: getEvents,
    get: getEvent,
    results: getEventResults,
  },

  // News
  news: {
    list: getNews,
    get: getNewsItem,
  },

  // Sponsors
  sponsors: {
    list: getSponsors,
  },

  // Results
  results: {
    seasons: getSeasons,
    seasonResults: getSeasonResults,
  },

  // Special
  calendar: getCalendarIcs,
  sitemap: getSitemap,
  health: getHealthCheck,

  // Contact
  contact: {
    submit: submitContactForm,
  },

  // Cache management
  revalidate: revalidateApiCache,
}

export default api