import { NextResponse } from 'next/server'
import { RateLimitResult } from './rate-limit'

/**
 * Risposta JSON standard per tutte le API CBK1.
 * Formato: { data, meta, message }
 */

// Headers CORS per Next.js frontend
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3007',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
}

export function addRateLimitHeaders(
  headers: Record<string, string>,
  rl: RateLimitResult
): Record<string, string> {
  return {
    ...headers,
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(rl.reset),
  }
}

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return NextResponse.json(
    { data, meta: meta ?? null, message: 'OK' },
    {
      status,
      headers: { ...CORS_HEADERS, ...extraHeaders },
    }
  )
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: unknown,
  extraHeaders: Record<string, string> = {}
) {
  return NextResponse.json(
    { data: null, meta: null, message, errors: errors ?? null },
    {
      status,
      headers: { ...CORS_HEADERS, ...extraHeaders },
    }
  )
}

export function rateLimitExceededResponse(reset: number) {
  return NextResponse.json(
    { data: null, meta: null, message: 'Troppe richieste. Riprova più tardi.' },
    {
      status: 429,
      headers: {
        ...CORS_HEADERS,
        'Retry-After': String(reset - Math.floor(Date.now() / 1000)),
      },
    }
  )
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}
