import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SubcategoryConfig } from './subcategoryConfig'

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
  inStock: boolean
  mondokartUrl?: string
}

interface Props {
  allProducts: Product[]
  slug: string
  config: SubcategoryConfig
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(num)
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPct = hasDiscount
    ? Math.round(
        ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
          parseFloat(product.originalPrice!)) *
          100
      )
    : 0
  const imgSrc = product.imageLocal || product.image || '/images/placeholder-product.jpg'

  return (
    <Link
      href={`/prodotti/${product.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md
        hover:-translate-y-1 transition-all duration-300 border border-gray-200
        dark:border-gray-700 hover:border-racing-red overflow-hidden"
    >
      <div className="relative h-44 bg-white dark:bg-gray-900 overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10 bg-racing-red text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPct}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
            <span className="bg-gray-900/90 text-white px-3 py-1.5 rounded-lg font-bold text-xs">
              ESAURITO
            </span>
          </div>
        )}
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <p className="text-xs text-racing-red font-bold uppercase tracking-wide mb-1 truncate">
          {product.brand}
        </p>
        <h3
          className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2
          group-hover:text-racing-red transition-colors mb-3 leading-5"
          style={{ height: '40px' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice!)}</p>
            )}
            <p className="text-lg font-black text-racing-red">{formatPrice(product.price)}</p>
          </div>
          <div className="w-8 h-8 bg-racing-red rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default function ProductFilterPage({ allProducts, slug, config }: Props) {
  const entry = config.slugMap[slug]
  if (!entry) notFound()

  const { brands, nameKeywords, keywords } = entry
  const hasAnyFilter = (brands && brands.length > 0) || (nameKeywords && nameKeywords.length > 0) || (keywords && keywords.length > 0)

  const filtered = allProducts.filter((p) => {
    if (!config.categories.includes(p.category)) return false

    // No filter specified → show all from category
    if (!hasAnyFilter) return true

    // 1. Exact brand match
    if (brands?.length && brands.includes(p.brand)) return true

    // 2. Name-only keyword match (for compatible parts under different brand)
    if (nameKeywords?.length) {
      const nameLower = p.name.toLowerCase()
      if (nameKeywords.some((kw) => nameLower.includes(kw.toLowerCase()))) return true
    }

    // 3. Full-text fallback (name + brand + desc)
    if (keywords?.length) {
      const haystack = `${p.name} ${p.brand} ${p.description ?? ''}`.toLowerCase()
      if (keywords.some((kw) => haystack.includes(kw.toLowerCase()))) return true
    }

    return false
  })

  // ── Grouped layout ──────────────────────────────────────────────────────────
  const renderGrouped = () => {
    const groups = config.groups!
    const assignedIds = new Set<string>()

    const sections: { label: string; products: Product[] }[] = groups
      .map((group) => {
        const groupProducts = filtered.filter((p) => {
          if (assignedIds.has(p.id)) return false
          return group.test(p.name.toLowerCase())
        })
        groupProducts.forEach((p) => assignedIds.add(p.id))
        return { label: group.label, products: groupProducts }
      })
      .filter((s) => s.products.length > 0)

    const others = filtered.filter((p) => !assignedIds.has(p.id))

    return (
      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-racing-red" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide">
                {section.label}
              </h2>
              <span className="text-sm text-gray-400 font-medium">({section.products.length})</span>
            </div>
            <ProductGrid products={section.products} />
          </div>
        ))}
        {others.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-gray-400" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide">
                Altri Ricambi
              </h2>
              <span className="text-sm text-gray-400 font-medium">({others.length})</span>
            </div>
            <ProductGrid products={others} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/prodotti" className="hover:text-racing-red transition-colors">
            Prodotti
          </Link>
          <span>/</span>
          <span className="text-gray-400">{config.pageTitle}</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{entry.label}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-14 rounded-full bg-racing-red" />
          <div>
            <p className="text-xs text-racing-red font-bold uppercase tracking-widest mb-1">
              {config.pageTitle}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {entry.label}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {filtered.length} prodott{filtered.length === 1 ? 'o' : 'i'}{' '}
              trovat{filtered.length === 1 ? 'o' : 'i'}
              {config.groups && filtered.length > 0 && ' • organizzati per categoria'}
            </p>
          </div>
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-xl text-gray-900 dark:text-white font-bold mb-4">
              Nessun prodotto trovato in questa categoria.
            </p>
            <Link
              href="/prodotti"
              className="inline-block px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Vedi tutti i prodotti
            </Link>
          </div>
        ) : config.groups ? (
          renderGrouped()
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  )
}
