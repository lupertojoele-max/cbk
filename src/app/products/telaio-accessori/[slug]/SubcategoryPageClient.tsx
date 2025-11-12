'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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

interface SubcategoryPageClientProps {
  categoryName: string
  slug: string
  allCategoryProducts: Product[]
  brands: string[]
}

export default function SubcategoryPageClient({
  categoryName,
  slug,
  allCategoryProducts,
  brands,
}: SubcategoryPageClientProps) {
  const [selectedBrand, setSelectedBrand] = useState('Tutti')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Calculate statistics
  const stats = useMemo(() => {
    const inStock = allCategoryProducts.filter((p) => p.inStock).length
    const onDiscount = allCategoryProducts.filter(
      (p) => p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.price)
    ).length
    const avgPrice =
      allCategoryProducts.reduce((sum, p) => sum + parseFloat(p.price), 0) /
      allCategoryProducts.length

    return {
      total: allCategoryProducts.length,
      inStock,
      onDiscount,
      avgPrice: avgPrice.toFixed(2),
    }
  }, [allCategoryProducts])

  // Filter products by category
  const categoryProducts = useMemo(() => {
    let filtered = allCategoryProducts

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
  }, [allCategoryProducts, selectedBrand, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-8 text-sm"
        >
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href="/prodotti"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            Prodotti
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href="/products/telaio-accessori"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            Telaio e Accessori
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-semibold">{categoryName}</span>
        </motion.div>

        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12"
        >
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 min-w-[100px]"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Prodotti</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 min-w-[100px]"
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.inStock}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Disponibili</div>
              </motion.div>
              {stats.onDiscount > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-md p-4 min-w-[100px]"
                >
                  <div className="text-2xl font-bold">{stats.onDiscount}</div>
                  <div className="text-xs opacity-90">In Offerta</div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cerca per nome, descrizione o brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  text-gray-900 dark:text-white font-medium"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
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
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  text-gray-900 dark:text-white font-medium"
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
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count with Animation */}
          <motion.div
            layout
            className="mt-6 flex items-center justify-between text-sm font-medium"
          >
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
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rimuovi filtri
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {categoryProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
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
            </motion.div>
          ) : (
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {categoryProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} viewMode={viewMode} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProductCard({
  product,
  index,
  viewMode,
}: {
  product: Product
  index: number
  viewMode: 'grid' | 'list'
}) {
  const hasDiscount =
    product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
          parseFloat(product.originalPrice!)) *
          100
      )
    : 0

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.01, y: -2 }}
      >
        <Link
          href={`/prodotti/${product.slug}`}
          className="flex gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden
            hover:shadow-2xl transition-all duration-300 group border border-gray-200/50 dark:border-gray-700/50 p-4"
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
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="200px"
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
              <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                Dettagli →
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/prodotti/${product.slug}`}
        className="block bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden
          hover:shadow-2xl transition-all duration-300 group border border-gray-200/50 dark:border-gray-700/50 h-full"
      >
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {product.featured && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg"
            >
              IN EVIDENZA
            </motion.div>
          )}
          {hasDiscount && (
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg"
            >
              -{discountPercentage}%
            </motion.div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-900/90 text-white px-6 py-3 rounded-xl font-bold shadow-2xl">
                ESAURITO
              </span>
            </div>
          )}
          <Image
            src={product.imageLocal || product.image || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Brand */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              {product.brand}
            </p>
            {product.inStock ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                Disponibile
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded">
                Esaurito
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {hasDiscount && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
