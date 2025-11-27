'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const PRODUCTS_PER_PAGE = 24

interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory?: string
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

interface SubcategoryPageClientProps {
  categoryName: string
  slug: string
  allCategoryProducts: Product[]
  brands: string[]
}

// Brake subcategories for freni-e-accessori
const brakeSubcategories = [
  'Tutti',
  'Pastiglie Freno',
  'Tubi Freno',
  'Tiranti Freno',
  'Pompe Freno',
  'Pinze Freno',
  'Dischi Freno Generici',
  'Ripartitori di Frenata',
  'Raccordi Freno e Ferma-tubi',
  'Minuteria, Forcelle, Molle',
  'Kit Revisione',
  'Gommini Singoli',
  'Viti Spurgo Freno',
  'Kit completi impianto frenante',
  'Convogliatori - Raffreddamento',
  'Protezioni disco freno',
]

// Wheel/hub subcategories for cerchi-mozzi-e-accessori
const wheelSubcategories = [
  'Tutti',
  'Set Cerchi Magnesio',
  'Set Cerchi Alluminio',
  'Cerchi Anteriori Magnesio',
  'Cerchi Posteriori Magnesio',
  'Cerchi Anteriori Alluminio',
  'Cerchi Posteriori Alluminio',
  'Accessori Cerchi',
  'Mozzi Anteriori',
  'Mozzi Posteriori',
  'Accessori Mozzi',
]

// Fairings subcategories for carenature-staffe-e-paraurti
const fairingsSubcategories = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'crg', label: 'Carenature CRG' },
  { id: 'birel', label: 'Carenature Birel Freeline BirelArt' },
  { id: 'tonykart-otk', label: 'Carenature Tony Kart - OTK' },
  { id: 'topkart', label: 'Carenature Top-Kart' },
  { id: 'parolin', label: 'Carenature Parolin' },
  { id: 'frontalino-kg', label: 'Frontalino portanumero KG' },
  { id: 'spoiler-anteriori', label: 'Spoiler anteriori KG' },
  { id: 'spoiler-posteriori', label: 'Spoiler posteriori' },
  { id: 'carenature-laterali', label: 'Carenature laterali KG' },
  { id: 'supporti', label: 'Supporti carenature' },
  { id: 'accessori', label: 'Accessori carenature' },
]

export default function SubcategoryPageClient({
  categoryName,
  slug,
  allCategoryProducts,
  brands,
}: SubcategoryPageClientProps) {
  const [selectedBrand, setSelectedBrand] = useState('Tutti')
  const [selectedSubcategory, setSelectedSubcategory] = useState(slug === 'carenature-staffe-e-paraurti' ? 'tutti' : 'Tutti')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const isBrakeCategory = slug === 'freni-e-accessori'
  const isWheelCategory = slug === 'cerchi-mozzi-e-accessori'
  const isFairingsCategory = slug === 'carenature-staffe-e-paraurti'

  // Calculate statistics
  const stats = useMemo(() => {
    const inStock = allCategoryProducts.filter((p) => p.inStock).length
    const onDiscount = allCategoryProducts.filter(
      (p) => p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.price)
    ).length

    return {
      total: allCategoryProducts.length,
      inStock,
      onDiscount,
    }
  }, [allCategoryProducts])

  // Filter products
  const categoryProducts = useMemo(() => {
    let filtered = allCategoryProducts

    // Filter by subcategory (for brake products)
    if (isBrakeCategory && selectedSubcategory !== 'Tutti') {
      filtered = filtered.filter((p) => {
        const name = p.name.toLowerCase()
        const desc = p.description.toLowerCase()

        switch (selectedSubcategory) {
          case 'Pastiglie Freno':
            return name.includes('pastigl') || desc.includes('pastigl')
          case 'Tubi Freno':
            return (name.includes('tubo') || name.includes('tubi')) && !name.includes('tirante')
          case 'Tiranti Freno':
            return name.includes('tirante') || name.includes('asta') || name.includes('forcella') || name.includes('clips') || name.includes('cavo')
          case 'Pompe Freno':
            return name.includes('pompa')
          case 'Pinze Freno':
            return name.includes('pinza')
          case 'Dischi Freno Generici':
            return name.includes('disco')
          case 'Ripartitori di Frenata':
            return name.includes('ripartitor')
          case 'Raccordi Freno e Ferma-tubi':
            return name.includes('raccord') || name.includes('ferma')
          case 'Minuteria, Forcelle, Molle':
            return name.includes('forcella') || name.includes('molla') || name.includes('clips') || name.includes('dado')
          case 'Kit Revisione':
            return name.includes('revisione') || (name.includes('kit') && desc.includes('revisione'))
          case 'Gommini Singoli':
            return name.includes('gommino') || name.includes('gommini')
          case 'Viti Spurgo Freno':
            return name.includes('spurgo') || name.includes('vite')
          case 'Kit completi impianto frenante':
            return name.includes('kit') && (name.includes('completo') || name.includes('impianto'))
          case 'Convogliatori - Raffreddamento':
            return name.includes('convogliator') || name.includes('raffreddamento')
          case 'Protezioni disco freno':
            return name.includes('protezion')
          default:
            return true
        }
      })
    }

    // Filter by subcategory (for wheel/hub products)
    if (isWheelCategory && selectedSubcategory !== 'Tutti') {
      filtered = filtered.filter((p) => {
        const id = p.id.toLowerCase()

        switch (selectedSubcategory) {
          case 'Set Cerchi Magnesio':
            return id.includes('mk-set-cerchi-mg')
          case 'Set Cerchi Alluminio':
            return id.includes('mk-set-cerchi-al')
          case 'Cerchi Anteriori Magnesio':
            return id.includes('mk-cerchio-ant-mg')
          case 'Cerchi Posteriori Magnesio':
            return id.includes('mk-cerchio-post-mg')
          case 'Cerchi Anteriori Alluminio':
            return id.includes('mk-cerchio-ant-al')
          case 'Cerchi Posteriori Alluminio':
            return id.includes('mk-cerchio-post-al')
          case 'Accessori Cerchi':
            return id.includes('mk-acc-cerchi')
          case 'Mozzi Anteriori':
            return id.includes('mk-mozzo-17mm') || id.includes('mk-mozzo-25mm') || id.includes('mk-mozzo-kz-40mm')
          case 'Mozzi Posteriori':
            return id.includes('mk-mozzo-post')
          case 'Accessori Mozzi':
            return id.includes('mk-acc-mozzi')
          default:
            return true
        }
      })
    }

    // Filter by subcategory (for fairings)
    if (isFairingsCategory && selectedSubcategory !== 'tutti') {
      filtered = filtered.filter((p) => p.subcategory === selectedSubcategory)
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
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [allCategoryProducts, selectedBrand, selectedSubcategory, searchQuery, sortBy, isBrakeCategory, isWheelCategory, isFairingsCategory])

  // Pagination
  const totalPages = Math.ceil(categoryProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return categoryProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [categoryProducts, currentPage])

  // Reset page when filters change
  const handleFilterChange = useCallback((setter: (val: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/prodotti" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            Prodotti
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/products/telaio-accessori" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            Telaio e Accessori
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-semibold">{categoryName}</span>
        </div>

        {/* Header with Stats */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {categoryName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                Scopri la nostra selezione premium di componenti per {categoryName.toLowerCase()}.
                Qualità professionale per il tuo kart.
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Prodotti</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.inStock}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Disponibili</div>
              </div>
              {stats.onDiscount > 0 && (
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-md p-4 min-w-[100px]">
                  <div className="text-2xl font-bold">{stats.onDiscount}</div>
                  <div className="text-xs opacity-90">In Offerta</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cerca per nome, descrizione o brand..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Subcategory Filter */}
            {(isBrakeCategory || isWheelCategory || isFairingsCategory) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sottocategoria
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => handleFilterChange(setSelectedSubcategory, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white cursor-pointer"
                >
                  {isFairingsCategory
                    ? fairingsSubcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>{subcat.label}</option>
                      ))
                    : (isBrakeCategory ? brakeSubcategories : wheelSubcategories).map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))
                  }
                </select>
              </div>
            )}

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => handleFilterChange(setSelectedBrand, e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ordina per
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
              >
                <option value="featured">In Evidenza</option>
                <option value="name">Nome (A-Z)</option>
                <option value="price-asc">Prezzo (Crescente)</option>
                <option value="price-desc">Prezzo (Decrescente)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Visualizzazione
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between text-sm font-medium">
            <div className="text-gray-600 dark:text-gray-400">
              {categoryProducts.length} prodott{categoryProducts.length === 1 ? 'o' : 'i'}{' '}
              {searchQuery || selectedBrand !== 'Tutti' ? 'filtrat' : 'trovat'}
              {categoryProducts.length === 1 ? 'o' : 'i'}
            </div>
            {(searchQuery || selectedBrand !== 'Tutti') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedBrand('Tutti')
                  setCurrentPage(1)
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rimuovi filtri
              </button>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Nessun prodotto trovato
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Prova a modificare i filtri di ricerca o torna alla pagina principale delle categorie.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedBrand('Tutti')
                  setCurrentPage(1)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                Resetta Filtri
              </button>
              <Link
                href="/products/telaio-accessori"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Tutte le Categorie
              </Link>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}
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
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white"
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white"
                >
                  Succ →
                </button>
              </div>
            )}

            <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              Pagina {currentPage} di {totalPages} • {categoryProducts.length} prodotti totali
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <Link
        href={`/prodotti/${product.slug}`}
        className="flex gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 group border border-gray-200/50 dark:border-gray-700/50 p-4"
      >
        {/* Image */}
        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
          {product.featured && (
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              IN EVIDENZA
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              -{discountPercentage}%
            </div>
          )}
          <Image
            src={product.imageLocal || product.image || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="200px"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wide">
                  {product.brand}
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </div>
              {product.inStock ? (
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg">
                  Disponibile
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg">
                  Esaurito
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              {hasDiscount && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold group-hover:bg-blue-700 transition-colors shadow-lg">
              Dettagli →
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div style={{ height: '380px', width: '100%', overflow: 'hidden' }}>
      <Link
        href={`/prodotti/${product.slug}`}
        className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group border border-gray-200 dark:border-gray-700"
        style={{ height: '380px', width: '100%', display: 'block', overflow: 'hidden' }}
      >
        {/* Image Container */}
        <div className="relative bg-white dark:bg-gray-800" style={{ height: '180px', minHeight: '180px', maxHeight: '180px', width: '100%', overflow: 'hidden' }}>
          {product.featured && (
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              EVIDENZA
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              -{discountPercentage}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-900/90 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-2xl">
                ESAURITO
              </span>
            </div>
          )}
          <div style={{ position: 'relative', width: '100%', height: '100%', padding: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={product.imageLocal || product.image || '/images/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              style={{ padding: '15px' }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div style={{ height: '200px', minHeight: '200px', maxHeight: '200px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
          {/* Brand and Stock */}
          <div style={{ height: '20px', minHeight: '20px', maxHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide truncate" style={{ flex: 1 }}>
              {product.brand}
            </p>
            {product.inStock ? (
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded" style={{ flexShrink: 0, marginLeft: '8px' }}>
                Stock
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded" style={{ flexShrink: 0, marginLeft: '8px' }}>
                Out
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors overflow-hidden" style={{ height: '40px', minHeight: '40px', maxHeight: '40px', fontSize: '13px', lineHeight: '20px', marginBottom: '8px' }}>
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 overflow-hidden" style={{ height: '32px', minHeight: '32px', maxHeight: '32px', lineHeight: '16px', marginBottom: '8px' }}>
            {product.description}
          </p>

          {/* Price Section */}
          <div style={{ height: '56px', minHeight: '56px', maxHeight: '56px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid', marginTop: 'auto' }} className="border-gray-200 dark:border-gray-700">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {hasDiscount && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-through" style={{ marginBottom: '2px' }}>
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200" style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', flexShrink: 0 }}>
              <svg className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
