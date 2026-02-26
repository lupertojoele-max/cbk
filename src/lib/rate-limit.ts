/**
 * In-memory rate limiter per le API pubbliche di CBK1.
 * Tiene traccia delle richieste per IP usando una sliding window.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store in-memory (si resetta ad ogni cold-start del server)
const store = new Map<string, RateLimitEntry>()

// Pulizia periodica delle entry scadute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 60_000) // ogni minuto
}

export interface RateLimitConfig {
  /** Massimo numero di richieste nel window */
  limit: number
  /** Durata del window in millisecondi */
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // timestamp epoch seconds
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60_000 }
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    // Prima richiesta o window scaduta: crea nuova entry
    store.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.ceil((now + config.windowMs) / 1000),
    }
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.ceil(entry.resetAt / 1000),
    }
  }

  entry.count++
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: Math.ceil(entry.resetAt / 1000),
  }
}

/**
 * Estrae l'IP del client dalla request Next.js.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
