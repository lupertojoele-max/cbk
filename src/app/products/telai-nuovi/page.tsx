import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import productsData from '../../../../data/products.json'

interface ChassisProduct {
  id: string
  name: string
  slug: string
  brand: string
  subcategory: string
  price: string
  image: string
  imageLocal: string
  description: string
  mondokartUrl: string
  featured?: boolean
  inStock?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Mini':       'bg-green-100 text-green-800',
  'Baby':       'bg-emerald-100 text-emerald-800',
  'OK-Junior':  'bg-blue-100 text-blue-800',
  'Junior':     'bg-blue-100 text-blue-800',
  'OK':         'bg-purple-100 text-purple-800',
  'Senior':     'bg-purple-100 text-purple-800',
  'KZ':         'bg-red-100 text-red-800',
}

const BRAND_STRIPE: Record<string, string> = {
  'CRG':           'bg-orange-500',
  'Tony Kart':     'bg-blue-700',
  'BirelArt':      'bg-red-600',
  'Top-Kart':      'bg-green-700',
  'Kart Republic': 'bg-purple-700',
  'Praga':         'bg-yellow-500',
  'Parolin':       'bg-teal-600',
  'Kosmic':        'bg-gray-600',
  'Intrepid':      'bg-slate-700',
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(num)
}

function cleanName(name: string): string {
  return name
    .replace(/^Chassis\s+/i, '')
    .replace(/\s*\d{4}!?\s*$/, '')
    .replace(/!$/, '')
    .trim()
}

export default function TelaiNuoviPage() {
  const allProducts = (productsData as { products: Record<string, unknown>[] }).products
  const chassis = allProducts
    .filter((p) => p.category === 'telai-nuovi')
    .map((p) => ({
      id:           String(p.id ?? ''),
      name:         String(p.name ?? ''),
      slug:         String(p.slug ?? ''),
      brand:        String(p.brand ?? ''),
      subcategory:  String(p.subcategory ?? ''),
      price:        String(p.price ?? '0'),
      image:        String(p.image ?? ''),
      imageLocal:   String(p.imageLocal ?? p.image ?? ''),
      description:  String(p.description ?? ''),
      mondokartUrl: String(p.mondokartUrl ?? ''),
      featured:     Boolean(p.featured),
      inStock:      Boolean(p.inStock ?? true),
    })) as ChassisProduct[]

  // Group by brand
  const brands = Array.from(new Set(chassis.map((p) => p.brand))).sort()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/prodotti" className="hover:text-racing-red transition-colors">Prodotti</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Telai Nuovi</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">
            Telai <span className="text-racing-red">Nuovi</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            I migliori telai da competizione delle marche più prestigiose del karting mondiale.
            Disponibili nelle principali categorie: Mini, Junior, OK, KZ.
          </p>
          <div className="mt-4 text-sm font-semibold text-racing-red">
            {chassis.length} telai disponibili
          </div>
        </div>

        {/* Products by brand */}
        {brands.map((brand) => {
          const brandProducts = chassis.filter((p) => p.brand === brand)
          const stripeColor = BRAND_STRIPE[brand] || 'bg-gray-700'

          return (
            <div key={brand} className="mb-14">
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-1 h-8 rounded-full ${stripeColor}`} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{brand}</h2>
                <span className="text-sm text-gray-500">({brandProducts.length} modelli)</span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {brandProducts.map((product) => {
                  const catColor = CATEGORY_COLORS[product.subcategory] || 'bg-gray-100 text-gray-800'

                  return (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm
                        hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group
                        border border-gray-200 dark:border-gray-700"
                    >
                      {/* Brand stripe */}
                      <div className={`h-1.5 ${stripeColor}`} />

                      {/* Image */}
                      <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        <Image
                          src={product.imageLocal || product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {product.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-racing-red text-white text-xs font-bold px-2 py-1 rounded">
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

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-racing-red mb-1">
                          {brand}
                        </p>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight
                          group-hover:text-racing-red transition-colors line-clamp-2 mb-2">
                          {cleanName(product.name)}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xl font-black text-racing-red">
                            {formatPrice(product.price)}
                          </span>
                          <Link
                            href={product.mondokartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                              bg-racing-red text-white text-xs font-bold
                              hover:bg-red-700 transition-colors"
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
          )
        })}

        {chassis.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nessun telaio disponibile al momento.</p>
            <Link href="/prodotti" className="mt-4 inline-block text-racing-red font-semibold hover:underline">
              ← Torna ai Prodotti
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
