import { revalidateTag } from 'next/cache'
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
  GetKartsParams,
  GetDriversParams,
  GetEventsParams,
  GetNewsParams,
  GetSponsorsParams,
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
function buildQueryString(params: Record<string, any>): string {
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
  const tagArray = Array.isArray(tags) ? tags : [tags]
  tagArray.forEach(tag => revalidateTag(tag))
}

// KARTS API
export async function getKarts(params: GetKartsParams = {}): Promise<ApiResponse<Kart[]>> {
  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(KartSchema))

  return apiRequest(
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
}

export async function getKart(slug: string): Promise<ApiResponse<Kart>> {
  const schema = ApiResponseSchema(KartSchema)

  return apiRequest(
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
}

// DRIVERS API
export async function getDrivers(params: GetDriversParams = {}): Promise<ApiResponse<Driver[]>> {
  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(DriverSchema))

  return apiRequest(
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
}

export async function getDriver(slug: string): Promise<ApiResponse<Driver>> {
  const schema = ApiResponseSchema(DriverSchema)

  return apiRequest(
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
}

// EVENTS API
export async function getEvents(params: GetEventsParams = {}): Promise<ApiResponse<Event[]>> {
  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(EventSchema))

  return apiRequest(
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
}

export async function getEvent(slug: string): Promise<ApiResponse<Event>> {
  const schema = ApiResponseSchema(EventSchema)

  return apiRequest(
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
  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(NewsSchema))

  return apiRequest(
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
}

export async function getNewsItem(slug: string): Promise<ApiResponse<News>> {
  const schema = ApiResponseSchema(NewsSchema)

  return apiRequest(
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
}

// SPONSORS API
export async function getSponsors(params: GetSponsorsParams = {}): Promise<ApiResponse<Sponsor[]>> {
  const queryString = buildQueryString(params)
  const schema = ApiResponseSchema(z.array(SponsorSchema))

  return apiRequest(
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

  // Special
  calendar: getCalendarIcs,
  sitemap: getSitemap,
  health: getHealthCheck,

  // Cache management
  revalidate: revalidateApiCache,
}

export default api