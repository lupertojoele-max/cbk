import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
  'CRG':           { stripe: 'bg-racing-red',  text: 'text-racing-red',  hoverText: 'hover:text-racing-red',  groupHoverText: 'group-hover:text-racing-red',  bg: 'bg-racing-red',  bgHover: 'hover:bg-racing-red-dark',  featured: 'bg-racing-red'  },
  'Tony Kart':     { stripe: 'bg-racing-blue', text: 'text-racing-blue', hoverText: 'hover:text-racing-blue', groupHoverText: 'group-hover:text-racing-blue', bg: 'bg-racing-blue', bgHover: 'hover:bg-racing-blue-dark', featured: 'bg-racing-blue' },
  'BirelArt':      { stripe: 'bg-racing-red',  text: 'text-racing-red',  hoverText: 'hover:text-racing-red',  groupHoverText: 'group-hover:text-racing-red',  bg: 'bg-racing-red',  bgHover: 'hover:bg-racing-red-dark',  featured: 'bg-racing-red'  },
  'Top-Kart':      { stripe: 'bg-gray-600',    text: 'text-gray-600',    hoverText: 'hover:text-gray-600',    groupHoverText: 'group-hover:text-gray-600',    bg: 'bg-gray-600',    bgHover: 'hover:bg-gray-700',    featured: 'bg-gray-600'    },
  'Kart Republic': { stripe: 'bg-gray-700',    text: 'text-gray-700',    hoverText: 'hover:text-gray-700',    groupHoverText: 'group-hover:text-gray-700',    bg: 'bg-gray-700',    bgHover: 'hover:bg-gray-800',    featured: 'bg-gray-700'    },
  'Praga':         { stripe: 'bg-gray-600',    text: 'text-gray-600',    hoverText: 'hover:text-gray-600',    groupHoverText: 'group-hover:text-gray-600',    bg: 'bg-gray-600',    bgHover: 'hover:bg-gray-700',    featured: 'bg-gray-600'    },
  'Parolin':       { stripe: 'bg-gray-500',    text: 'text-gray-500',    hoverText: 'hover:text-gray-500',    groupHoverText: 'group-hover:text-gray-500',    bg: 'bg-gray-500',    bgHover: 'hover:bg-gray-600',    featured: 'bg-gray-500'    },
  'Kosmic':        { stripe: 'bg-racing-blue', text: 'text-racing-blue', hoverText: 'hover:text-racing-blue', groupHoverText: 'group-hover:text-racing-blue', bg: 'bg-racing-blue', bgHover: 'hover:bg-racing-blue-dark', featured: 'bg-racing-blue' },
  'Intrepid':      { stripe: 'bg-gray-700',    text: 'text-gray-700',    hoverText: 'hover:text-gray-700',    groupHoverText: 'group-hover:text-gray-700',    bg: 'bg-gray-700',    bgHover: 'hover:bg-gray-800',    featured: 'bg-gray-700'    },
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
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                {/* Image — fixed height, no background */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${theme.stripe} z-10`} />
                  <Image
                    src={product.imageLocal}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${theme.text}`}>
                    {brandName} · {product.subcategory}
                  </p>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">
                    {cleanName(product.name)}
                  </h3>

                  <div className="flex-1" />

                  <div className="text-xl font-black text-gray-900 dark:text-white mt-3 mb-3">
                    {formatPrice(product.price)}
                  </div>

                  <Link
                    href={product.mondokartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 w-full ${theme.stripe} hover:opacity-90 text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-lg transition-opacity duration-200`}
                  >
                    Acquista
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
