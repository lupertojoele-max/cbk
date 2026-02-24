import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import productsData from '../../../../../data/products.json'

interface ChassisProduct {
  id: string
  name: string
  brand: string
  subcategory: string
  price: string
  imageLocal: string
  description: string
  mondokartUrl: string
  featured?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Mini':      'bg-green-100 text-green-800',
  'Baby':      'bg-emerald-100 text-emerald-800',
  'OK-Junior': 'bg-blue-100 text-blue-800',
  'Junior':    'bg-blue-100 text-blue-800',
  'OK':        'bg-purple-100 text-purple-800',
  'Senior':    'bg-purple-100 text-purple-800',
  'KZ':        'bg-red-100 text-red-800',
}

interface BrandTheme {
  stripe: string         // stripe bar color
  text: string           // text color class
  hoverText: string      // hover:text-* (must be static for Tailwind JIT scanning)
  groupHoverText: string // group-hover:text-* (must be static for Tailwind JIT scanning)
  bg: string             // button/badge bg
  bgHover: string        // button hover bg
  featured: string       // "IN EVIDENZA" badge bg
}

const BRAND_THEME: Record<string, BrandTheme> = {
  'CRG':           { stripe: 'bg-orange-500', text: 'text-orange-500', hoverText: 'hover:text-orange-500', groupHoverText: 'group-hover:text-orange-500', bg: 'bg-orange-500', bgHover: 'hover:bg-orange-600', featured: 'bg-orange-500' },
  'Tony Kart':     { stripe: 'bg-blue-700',   text: 'text-blue-700',   hoverText: 'hover:text-blue-700',   groupHoverText: 'group-hover:text-blue-700',   bg: 'bg-blue-700',   bgHover: 'hover:bg-blue-800',   featured: 'bg-blue-700'   },
  'BirelArt':      { stripe: 'bg-red-600',    text: 'text-red-600',    hoverText: 'hover:text-red-600',    groupHoverText: 'group-hover:text-red-600',    bg: 'bg-red-600',    bgHover: 'hover:bg-red-700',    featured: 'bg-red-600'    },
  'Top-Kart':      { stripe: 'bg-green-700',  text: 'text-green-700',  hoverText: 'hover:text-green-700',  groupHoverText: 'group-hover:text-green-700',  bg: 'bg-green-700',  bgHover: 'hover:bg-green-800',  featured: 'bg-green-700'  },
  'Kart Republic': { stripe: 'bg-purple-700', text: 'text-purple-700', hoverText: 'hover:text-purple-700', groupHoverText: 'group-hover:text-purple-700', bg: 'bg-purple-700', bgHover: 'hover:bg-purple-800', featured: 'bg-purple-700' },
  'Praga':         { stripe: 'bg-yellow-500', text: 'text-yellow-600', hoverText: 'hover:text-yellow-600', groupHoverText: 'group-hover:text-yellow-600', bg: 'bg-yellow-500', bgHover: 'hover:bg-yellow-600', featured: 'bg-yellow-500' },
  'Parolin':       { stripe: 'bg-teal-600',   text: 'text-teal-600',   hoverText: 'hover:text-teal-600',   groupHoverText: 'group-hover:text-teal-600',   bg: 'bg-teal-600',   bgHover: 'hover:bg-teal-700',   featured: 'bg-teal-600'   },
  'Kosmic':        { stripe: 'bg-gray-600',   text: 'text-gray-600',   hoverText: 'hover:text-gray-600',   groupHoverText: 'group-hover:text-gray-600',   bg: 'bg-gray-600',   bgHover: 'hover:bg-gray-700',   featured: 'bg-gray-600'   },
  'Intrepid':      { stripe: 'bg-slate-700',  text: 'text-slate-700',  hoverText: 'hover:text-slate-700',  groupHoverText: 'group-hover:text-slate-700',  bg: 'bg-slate-700',  bgHover: 'hover:bg-slate-800',  featured: 'bg-slate-700'  },
}

const DEFAULT_THEME: BrandTheme = {
  stripe: 'bg-gray-700', text: 'text-gray-700', hoverText: 'hover:text-gray-700',
  groupHoverText: 'group-hover:text-gray-700', bg: 'bg-gray-700', bgHover: 'hover:bg-gray-800', featured: 'bg-gray-700',
}

// Normalize brand slug → brand name
function slugToBrand(slug: string): string {
  const map: Record<string, string> = {
    'crg':           'CRG',
    'tony-kart':     'Tony Kart',
    'tonykart':      'Tony Kart',
    'birelart':      'BirelArt',
    'birel-art':     'BirelArt',
    'top-kart':      'Top-Kart',
    'kart-republic': 'Kart Republic',
    'praga':         'Praga',
    'parolin':       'Parolin',
    'kosmic':        'Kosmic',
    'maranello':     'Maranello',
    'ckr':           'CKR',
    'intrepid':      'Intrepid',
    'formula-k':     'Formula K',
    'lke':           'LKE',
  }
  return map[slug.toLowerCase()] ?? slug
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(num)
}

function cleanName(name: string): string {
  return name
    .replace(/^Chassis\s+/i, '')
    .replace(/\s*\d{4}!?\s*$/, '')
    .replace(/!$/, '')
    .trim()
}

export async function generateStaticParams() {
  const allProducts = (productsData as { products: Record<string, unknown>[] }).products
  const brands = Array.from(new Set(
    allProducts
      .filter((p) => p.category === 'telai-nuovi')
      .map((p) => String(p.brand ?? '').toLowerCase().replace(/\s+/g, '-'))
  ))
  return brands.map((brand) => ({ brand }))
}

export default async function TelaiNuoviBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {
  const { brand: brandSlug } = await params
  const brandName = slugToBrand(brandSlug)

  const allProducts = (productsData as { products: Record<string, unknown>[] }).products
  const products = allProducts
    .filter((p) => p.category === 'telai-nuovi' && String(p.brand ?? '') === brandName)
    .map((p) => ({
      id:           String(p.id ?? ''),
      name:         String(p.name ?? ''),
      brand:        String(p.brand ?? ''),
      subcategory:  String(p.subcategory ?? ''),
      price:        String(p.price ?? '0'),
      imageLocal:   String(p.imageLocal ?? p.image ?? ''),
      description:  String(p.description ?? ''),
      mondokartUrl: String(p.mondokartUrl ?? ''),
      featured:     Boolean(p.featured),
    })) as ChassisProduct[]

  if (products.length === 0) {
    notFound()
  }

  const theme = BRAND_THEME[brandName] ?? DEFAULT_THEME

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/prodotti" className={`${theme.hoverText} transition-colors`}>Prodotti</Link>
          <span>/</span>
          <Link href="/products/telai-nuovi" className={`${theme.hoverText} transition-colors`}>Telai Nuovi</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{brandName}</span>
        </nav>

        {/* Back link */}
        <Link
          href="/products/telai-nuovi"
          className={`inline-flex items-center gap-2 text-sm text-gray-500 ${theme.hoverText} transition-colors mb-6`}
        >
          <ArrowLeft className="w-4 h-4" />
          Tutti i Telai
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className={`w-2 h-12 rounded-full ${theme.stripe}`} />
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Telai <span className={theme.text}>{brandName}</span>
            </h1>
            <p className="text-gray-500 mt-1">
              {products.length} model{products.length === 1 ? 'lo' : 'li'} disponibil{products.length === 1 ? 'e' : 'i'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const catColor = CATEGORY_COLORS[product.subcategory] || 'bg-gray-100 text-gray-800'

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group
                  border border-gray-200 dark:border-gray-700"
              >
                <div className={`h-1.5 ${theme.stripe}`} />

                <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
                  <Image
                    src={product.imageLocal}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.featured && (
                    <div className="absolute top-3 left-3">
                      <span className={`${theme.featured} text-white text-xs font-bold px-2 py-1 rounded`}>
                        IN EVIDENZA
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-xs font-semibold ${catColor}`}>
                      {product.subcategory}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <p className={`text-xs font-bold uppercase tracking-wide ${theme.text} mb-1`}>
                    {brandName}
                  </p>
                  <h3 className={`font-bold text-gray-900 dark:text-white text-sm leading-tight
                    ${theme.groupHoverText} transition-colors line-clamp-2 mb-2`}>
                    {cleanName(product.name)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`text-xl font-black ${theme.text}`}>
                      {formatPrice(product.price)}
                    </span>
                    <Link
                      href={product.mondokartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        ${theme.bg} ${theme.bgHover} text-white text-xs font-bold transition-colors`}
                    >
                      Acquista
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
