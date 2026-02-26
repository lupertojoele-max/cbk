/**
 * API Carrello CBK1 — Cookie-based (stateless)
 *
 * Il carrello è serializzato in un cookie httpOnly firmato lato client.
 * Nessuno stato server richiesto.
 *
 * GET    /api/cart          → restituisce il carrello corrente
 * POST   /api/cart          → aggiunge/aggiorna un prodotto nel carrello
 * DELETE /api/cart          → svuota il carrello o rimuove un item
 *
 * Body POST: { productId, slug, name, price, quantity, image }
 * Body DELETE: { slug } — se omesso, svuota tutto
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  successResponse,
  errorResponse,
  rateLimitExceededResponse,
  optionsResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'

const CART_COOKIE = 'cbk_cart'
const MAX_ITEMS = 50
const MAX_QTY = 99

interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Cart {
  items: CartItem[]
  updatedAt: string
}

const AddItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  quantity: z.number().int().min(1).max(MAX_QTY).default(1),
  image: z.string().optional(),
})

const RemoveItemSchema = z.object({
  slug: z.string().min(1).optional(),
})

function readCart(request: NextRequest): Cart {
  try {
    const raw = request.cookies.get(CART_COOKIE)?.value
    if (!raw) return { items: [], updatedAt: new Date().toISOString() }
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (!Array.isArray(parsed.items)) return { items: [], updatedAt: new Date().toISOString() }
    return parsed as Cart
  } catch {
    return { items: [], updatedAt: new Date().toISOString() }
  }
}

function writeCart(response: NextResponse, cart: Cart): NextResponse {
  const serialized = encodeURIComponent(JSON.stringify(cart))
  response.cookies.set(CART_COOKIE, serialized, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 giorni
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

function cartSummary(cart: Cart) {
  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cart.items.reduce((s, i) => s + i.price * i.quantity, 0)
  return {
    items: cart.items,
    total_items: totalItems,
    total_price: Math.round(totalPrice * 100) / 100,
    updated_at: cart.updatedAt,
  }
}

export async function OPTIONS() {
  return optionsResponse()
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`cart:${ip}`, { limit: 120, windowMs: 60_000 })
  if (!rl.success) return rateLimitExceededResponse(rl.reset)
  const rlHeaders = addRateLimitHeaders({}, rl)

  const cart = readCart(request)
  return successResponse(cartSummary(cart), null, 200, rlHeaders)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`cart-write:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rl.success) return rateLimitExceededResponse(rl.reset)
  const rlHeaders = addRateLimitHeaders({}, rl)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body JSON non valido', 400, null, rlHeaders)
  }

  const parsed = AddItemSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Dati non validi', 422, parsed.error.flatten().fieldErrors, rlHeaders)
  }

  const cart = readCart(request)

  const existing = cart.items.find((i) => i.slug === parsed.data.slug)
  if (existing) {
    existing.quantity = Math.min(existing.quantity + parsed.data.quantity, MAX_QTY)
  } else {
    if (cart.items.length >= MAX_ITEMS) {
      return errorResponse('Il carrello è pieno (max 50 articoli)', 400, null, rlHeaders)
    }
    cart.items.push({
      productId: parsed.data.productId,
      slug: parsed.data.slug,
      name: parsed.data.name,
      price: parsed.data.price,
      quantity: parsed.data.quantity,
      image: parsed.data.image,
    })
  }
  cart.updatedAt = new Date().toISOString()

  const baseResponse = successResponse(
    cartSummary(cart),
    null,
    200,
    rlHeaders
  ) as NextResponse

  return writeCart(baseResponse, cart)
}

export async function PUT(request: NextRequest) {
  // Aggiorna la quantità di un item specifico
  const ip = getClientIp(request)
  const rl = rateLimit(`cart-write:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rl.success) return rateLimitExceededResponse(rl.reset)
  const rlHeaders = addRateLimitHeaders({}, rl)

  const UpdateSchema = z.object({
    slug: z.string().min(1),
    quantity: z.number().int().min(0).max(MAX_QTY),
  })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body JSON non valido', 400, null, rlHeaders)
  }

  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Dati non validi', 422, parsed.error.flatten().fieldErrors, rlHeaders)
  }

  const cart = readCart(request)
  const idx = cart.items.findIndex((i) => i.slug === parsed.data.slug)

  if (idx === -1) {
    return errorResponse('Prodotto non trovato nel carrello', 404, null, rlHeaders)
  }

  if (parsed.data.quantity === 0) {
    cart.items.splice(idx, 1)
  } else {
    cart.items[idx].quantity = parsed.data.quantity
  }
  cart.updatedAt = new Date().toISOString()

  const baseResponse = successResponse(cartSummary(cart), null, 200, rlHeaders) as NextResponse
  return writeCart(baseResponse, cart)
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`cart-write:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rl.success) return rateLimitExceededResponse(rl.reset)
  const rlHeaders = addRateLimitHeaders({}, rl)

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    // Body opzionale per DELETE
  }

  const parsed = RemoveItemSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Dati non validi', 422, null, rlHeaders)
  }

  const cart = readCart(request)

  if (parsed.data.slug) {
    // Rimuovi item specifico
    const before = cart.items.length
    cart.items = cart.items.filter((i) => i.slug !== parsed.data.slug)
    if (cart.items.length === before) {
      return errorResponse('Prodotto non trovato nel carrello', 404, null, rlHeaders)
    }
  } else {
    // Svuota tutto
    cart.items = []
  }
  cart.updatedAt = new Date().toISOString()

  const baseResponse = successResponse(
    cartSummary(cart),
    null,
    200,
    rlHeaders
  ) as NextResponse
  return writeCart(baseResponse, cart)
}
