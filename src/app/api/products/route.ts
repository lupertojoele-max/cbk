/**
 * GET /api/products
 *
 * Parametri query:
 *  - categoria: string       (es. freni-accessori)
 *  - brand: string           (es. CRG)
 *  - min_price: number
 *  - max_price: number
 *  - search: string          (full-text su name + description)
 *  - in_stock: boolean       (default: non filtrato)
 *  - sort: price_asc | price_desc | name_asc | name_desc | newest
 *  - page: number            (default: 1)
 *  - per_page: number        (default: 24, max: 100)
 *
 * Risposta: { data: Product[], meta: { total, page, per_page, last_page, brands, categories }, message }
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import productsData from '../../../../data/products.json'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  successResponse,
  errorResponse,
  rateLimitExceededResponse,
  optionsResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'

// Zod schema per validare i query param
const QuerySchema = z.object({
  categoria: z.string().optional(),
  brand: z.string().optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  search: z.string().max(100).optional(),
  in_stock: z
    .string()
    .optional()
    .transform((v) => {
      if (v === 'true') return true
      if (v === 'false') return false
      return undefined
    }),
  sort: z
    .enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest'])
    .optional()
    .default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(24),
})

// Carica e normalizza i prodotti una sola volta (module-level cache)
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

const allProducts: Product[] = (
  (productsData as { products?: Product[] }).products ?? (productsData as Product[])
).map((p) => ({
  ...p,
  inStock: p.inStock ?? true,
}))

export async function OPTIONS() {
  return optionsResponse()
}

export async function GET(request: NextRequest) {
  // Rate limiting: 60 req/min per IP
  const ip = getClientIp(request)
  const rl = rateLimit(`products:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rl.success) {
    return rateLimitExceededResponse(rl.reset)
  }
  const rlHeaders = addRateLimitHeaders({}, rl)

  // Parsing e validazione query params
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = QuerySchema.safeParse(searchParams)
  if (!parsed.success) {
    return errorResponse(
      'Parametri non validi',
      422,
      parsed.error.flatten().fieldErrors,
      rlHeaders
    )
  }

  const { categoria, brand, min_price, max_price, search, in_stock, sort, page, per_page } =
    parsed.data

  // --- Filtraggio ---
  let filtered = allProducts

  if (categoria && categoria !== 'tutti') {
    filtered = filtered.filter((p) => p.category === categoria)
  }

  if (brand && brand.toLowerCase() !== 'tutti') {
    const brandLower = brand.toLowerCase()
    filtered = filtered.filter((p) => p.brand?.toLowerCase() === brandLower)
  }

  if (min_price !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) >= min_price)
  }

  if (max_price !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) <= max_price)
  }

  if (in_stock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === in_stock)
  }

  // --- Ricerca full-text ---
  if (search && search.trim().length > 0) {
    const terms = search
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1)

    filtered = filtered.filter((p) => {
      const haystack = `${p.name} ${p.description} ${p.brand} ${p.category}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
  }

  // --- Ordinamento ---
  const sorted = [...filtered]
  switch (sort) {
    case 'price_asc':
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      break
    case 'price_desc':
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      break
    case 'name_asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'newest':
    default:
      // I prodotti sono già in ordine di inserimento
      break
  }

  // --- Paginazione ---
  const total = sorted.length
  const lastPage = Math.ceil(total / per_page)
  const offset = (page - 1) * per_page
  const paginated = sorted.slice(offset, offset + per_page)

  // --- Meta: brands e categorie disponibili nel set filtrato ---
  const availableBrands = [...new Set(filtered.map((p) => p.brand).filter(Boolean))].sort()
  const availableCategories = [...new Set(filtered.map((p) => p.category).filter(Boolean))].sort()

  return successResponse(
    paginated,
    {
      total,
      page,
      per_page,
      last_page: lastPage,
      from: offset + 1,
      to: Math.min(offset + per_page, total),
      available_brands: availableBrands,
      available_categories: availableCategories,
    },
    200,
    rlHeaders
  )
}
