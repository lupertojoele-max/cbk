/**
 * GET /api/products/:slug
 *
 * Restituisce il prodotto con il dato slug.
 * Risposta: { data: Product, meta: { related: Product[] }, message }
 */

import { NextRequest } from 'next/server'
import productsData from '../../../../../data/products.json'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  successResponse,
  errorResponse,
  rateLimitExceededResponse,
  optionsResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  brand: string
  price: string
  originalPrice?: string
  image: string
  imageLocal?: string
  description: string
  specifications?: Record<string, string>
  inStock: boolean
  mondokartUrl?: string
  featured?: boolean
}

const allProducts: Product[] = (productsData as unknown as { products: Product[] }).products.map((p) => ({ ...p, inStock: p.inStock ?? true }))

export async function OPTIONS() {
  return optionsResponse()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(request)
  const rl = rateLimit(`product-detail:${ip}`, { limit: 120, windowMs: 60_000 })
  if (!rl.success) {
    return rateLimitExceededResponse(rl.reset)
  }
  const rlHeaders = addRateLimitHeaders({}, rl)

  const { slug } = await params

  if (!slug || typeof slug !== 'string') {
    return errorResponse('Slug non valido', 400, null, rlHeaders)
  }

  const product = allProducts.find((p) => p.slug === slug)

  if (!product) {
    return errorResponse('Prodotto non trovato', 404, null, rlHeaders)
  }

  // Prodotti correlati: stessa categoria, escluso il corrente (max 8)
  const related = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 8)

  return successResponse(product, { related }, 200, rlHeaders)
}
