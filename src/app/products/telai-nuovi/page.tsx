import Image from 'next/image'
import Link from 'next/link'
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


const BRAND_STRIPE: Record<string, string> = {
  'CRG':           'bg-racing-red',
  'Tony Kart':     'bg-racing-blue',
  'BirelArt':      'bg-racing-red',
  'Top-Kart':      'bg-gray-600',
  'Kart Republic': 'bg-gray-700',
  'Praga':         'bg-gray-600',
  'Parolin':       'bg-gray-500',
  'Kosmic':        'bg-racing-blue',
  'Intrepid':      'bg-gray-700',
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
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                      {/* Image — fixed height, no background */}
                      <div className="relative h-48 flex-shrink-0 overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${stripeColor} z-10`} />
                        <Image
                          src={product.imageLocal || product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-4">
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${
                          stripeColor === 'bg-racing-red' ? 'text-racing-red' :
                          stripeColor === 'bg-racing-blue' ? 'text-racing-blue' :
                          'text-gray-500'
                        }`}>{brand} · {product.subcategory}</p>

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
                          className={`flex items-center justify-center gap-1.5 w-full ${stripeColor} hover:opacity-90 text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-lg transition-opacity duration-200`}
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
