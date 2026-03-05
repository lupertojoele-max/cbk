'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import productsData from '../../../data/products.json'
import { ProductCard } from '@/components/products/product-card'

const PRODUCTS_PER_PAGE = 48

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

const CATEGORY_GROUPS = [
  {
    group: 'Kart',
    items: [
      { id: 'telai-nuovi',   label: 'Telai Nuovi' },
      { id: 'kart-completi', label: 'Kart Completi' },
    ],
  },
  {
    group: 'Motore',
    items: [
      { id: 'motori-nuovi',          label: 'Motori Nuovi' },
      { id: 'ricambi-motore',        label: 'Ricambi Motore' },
      { id: 'motore-ricambi',        label: 'Motore e Accessori' },
      { id: 'carburatori',           label: 'Carburatori' },
      { id: 'candele-accensione',    label: 'Candele' },
      { id: 'filtri-aria',           label: 'Filtri Aria' },
      { id: 'accensione-elettrica',  label: 'Accensione ed Elettrica' },
      { id: 'radiatori-accessori',   label: 'Radiatori e Accessori' },
      { id: 'scarichi-silenziatori', label: 'Scarichi e Silenziatori' },
      { id: 'lubrificanti',          label: 'Lubrificanti e Oli' },
    ],
  },
  {
    group: 'Freni e Ruote',
    items: [
      { id: 'freni-accessori',             label: 'Freni e Accessori' },
      { id: 'cerchi-mozzi-accessori',      label: 'Cerchi Mozzi e Accessori' },
      { id: 'assali-cuscinetti-chiavette', label: 'Assali Cuscinetti e Chiavette' },
      { id: 'corone-catene',               label: 'Corone, Catene e Accessori' },
      { id: 'portacorona-portadisco',      label: 'Portacorona e Portadisco' },
      { id: 'pneumatici',                  label: 'Pneumatici e Gomme' },
    ],
  },
  {
    group: 'Telaio e Carrozzeria',
    items: [
      { id: 'carenature',       label: 'Carenature, Staffe e Paraurti' },
      { id: 'accessori-telaio', label: 'Accessori Telaio' },
      { id: 'molle-cuscinetti', label: 'Molle e Cuscinetti' },
      { id: 'sedili',           label: 'Sedili' },
      { id: 'pedali-accessori', label: 'Pedali e Accessori' },
      { id: 'volanti-accessori',label: 'Volanti e Accessori' },
    ],
  },
  {
    group: 'Strumentazione',
    items: [
      { id: 'telemetrie', label: 'Telemetrie e Crono' },
    ],
  },
  {
    group: 'Pilota',
    items: [
      { id: 'abbigliamento-caschi', label: 'Abbigliamento e Caschi' },
      { id: 'accessori-caschi',     label: 'Accessori Caschi' },
    ],
  },
  {
    group: 'Officina',
    items: [
      { id: 'lavorazioni-motore', label: 'Lavorazioni Motore' },
      { id: 'lavorazioni-telaio', label: 'Lavorazioni Telaio' },
    ],
  },
  {
    group: 'Altro',
    items: [
      { id: 'adesivi',       label: 'Adesivi' },
      { id: 'attrezzatura',  label: 'Attrezzatura Officina' },
      { id: 'accessori-kart',label: 'Accessori Kart' },
    ],
  },
]

function ProdottiPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read filters from URL params
  const selectedCategory = searchParams.get('categoria') || 'tutti'
  const selectedBrand = searchParams.get('brand') || 'Tutti'
  const searchQuery = searchParams.get('q') || ''
  const sortBy = searchParams.get('ordine') || 'featured'
  const currentPage = parseInt(searchParams.get('pagina') || '1', 10)
  const minPriceParam = searchParams.get('prezzoMin')
  const maxPriceParam = searchParams.get('prezzoMax')
  const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined
  const soloDisponibili = searchParams.get('disponibili') === 'true'

  // Local state for price inputs (applied on blur/enter)
  const [localMinPrice, setLocalMinPrice] = useState(minPriceParam || '')
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam || '')

  const updateURL = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'tutti' || value === 'Tutti' || value === 'featured' || value === '1') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const qs = params.toString()
    router.push(qs ? '/prodotti?' + qs : '/prodotti', { scroll: false })
  }, [searchParams, router])

  const handleCategoryChange = useCallback((cat: string) => {
    updateURL({ categoria: cat, pagina: null })
  }, [updateURL])

  const handleBrandChange = useCallback((brand: string) => {
    updateURL({ brand, pagina: null })
  }, [updateURL])

  const handleSearchChange = useCallback((q: string) => {
    updateURL({ q, pagina: null })
  }, [updateURL])

  const handleSortChange = useCallback((ordine: string) => {
    updateURL({ ordine, pagina: null })
  }, [updateURL])

  const handlePageChange = useCallback((pagina: number) => {
    updateURL({ pagina: String(pagina) })
  }, [updateURL])

  const handleDisponibiliChange = useCallback((checked: boolean) => {
    updateURL({ disponibili: checked ? 'true' : null, pagina: null })
  }, [updateURL])

  const handlePriceApply = useCallback(() => {
    updateURL({
      prezzoMin: localMinPrice || null,
      prezzoMax: localMaxPrice || null,
      pagina: null
    })
  }, [localMinPrice, localMaxPrice, updateURL])

  const handleResetFilters = useCallback(() => {
    setLocalMinPrice('')
    setLocalMaxPrice('')
    router.push('/prodotti', { scroll: false })
  }, [router])

  const products = (productsData as unknown as { products: Product[] }).products

  // Dynamic brands from data
  const allBrands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean))
    return ['Tutti', ...Array.from(set).sort()]
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'tutti') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by brand
    if (selectedBrand !== 'Tutti') {
      filtered = filtered.filter((p) => p.brand === selectedBrand)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      )
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => parseFloat(p.price) >= minPrice)
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => parseFloat(p.price) <= maxPrice)
    }

    // Filter solo disponibili
    if (soloDisponibili) {
      filtered = filtered.filter((p) => p.inStock)
    }

        // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price)
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
        default:
          // Featured first, then by name
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy, minPrice, maxPrice, soloDisponibili])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mix Style */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
            Catalogo <span className="text-racing-red">Prodotti</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Scopri la nostra gamma completa di prodotti per il karting: pneumatici,
            telemetrie, motori, telai e molto altro.
          </p>
        </div>

        {/* Filters Section - Clean with Red Accents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border-l-4 border-racing-red">
          {/* Red Racing Stripe Top - subtle */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-racing-red opacity-30" />

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cerca prodotti per nome, descrizione o brand..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-racing-red focus:border-racing-red focus:scale-[1.02]
                transition-all duration-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters row — categoria + brand + ordina */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white cursor-pointer"
              >
                <option value="tutti">Tutti i Prodotti</option>
                {CATEGORY_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.items.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white cursor-pointer"
              >
                {allBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Ordina per
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white cursor-pointer"
              >
                <option value="featured">In Evidenza</option>
                <option value="name">Nome (A-Z)</option>
                <option value="price-asc">Prezzo (Crescente)</option>
                <option value="price-desc">Prezzo (Decrescente)</option>
              </select>
            </div>
          </div>

          {/* Prezzo e Disponibilita */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Prezzo min (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Prezzo max (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="9999"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={soloDisponibili}
                  onChange={(e) => handleDisponibiliChange(e.target.checked)}
                  className="w-5 h-5 accent-racing-red rounded cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-racing-red transition-colors">
                  Solo disponibili
                </span>
              </label>
            </div>
          </div>

                    {/* Results Count */}
          <div className="mt-4 text-sm font-bold text-gray-600 dark:text-gray-400">
            <span className="text-racing-red font-black">{filteredProducts.length}</span> prodott{filteredProducts.length === 1 ? 'o' : 'i'}{' '}
            trovat{filteredProducts.length === 1 ? 'o' : 'i'}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-racing-red">
            <p className="text-xl text-gray-900 dark:text-white font-bold mb-6">
              Nessun prodotto trovato con i filtri selezionati.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2"
            >
              Resetta Filtri
            </button>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.03,
                    delayChildren: 0.05
                  }
                }
              }}
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24
                        }
                      }
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-racing-red"
                >
                  ← Prec
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-racing-red text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-racing-red"
                >
                  Succ →
                </button>
              </div>
            )}

            <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              Pagina {currentPage} di {totalPages} • {filteredProducts.length} prodotti totali
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ProdottiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-racing-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Caricamento catalogo...</p>
        </div>
      </div>
    }>
      <ProdottiPageInner />
    </Suspense>
  )
}

