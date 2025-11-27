'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import productsData from '../../../data/products.json'

const PRODUCTS_PER_PAGE = 24

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

const categories = [
  { id: 'tutti', label: 'Tutti i Prodotti' },
  { id: 'freni-accessori', label: 'Freni e Accessori' },
  { id: 'cerchi-mozzi-accessori', label: 'Cerchi Mozzi e Accessori' },
  { id: 'assali-cuscinetti-chiavette', label: 'Assali Cuscinetti e Chiavette' },
  { id: 'corone-catene', label: 'Corone, Catene e Accessori' },
  { id: 'carenature', label: 'Carenature, Staffe e Paraurti' },
  { id: 'pneumatici', label: 'Pneumatici' },
  { id: 'telemetrie', label: 'Telemetrie' },
  { id: 'motori', label: 'Motori' },
  { id: 'telai', label: 'Telai' },
  { id: 'abbigliamento', label: 'Abbigliamento' },
  { id: 'accessori', label: 'Accessori' },
]

const brands = [
  'Tutti',
  'LeCont',
  'Vega',
  'Maxxis',
  'MG',
  'Komet',
  'AIM',
  'Alfano',
  'CRG',
  'Tony Kart',
  'Birel',
  'IAME',
  'ROK',
  'Rotax',
  'Alpinestars',
  'Sparco',
  'OMP',
  'Tillotson',
  'Racing',
  'Varie',
]

export default function ProdottiPage() {
  const [selectedCategory, setSelectedCategory] = useState('tutti')
  const [selectedBrand, setSelectedBrand] = useState('Tutti')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)

  const products = productsData.products as Product[]

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
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Reset page when filters change
  const handleFilterChange = useCallback((setter: (val: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }, [])

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-racing-red focus:border-racing-red focus:scale-[1.02]
                transition-all duration-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Tabs - Clean with Red Active */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(setSelectedCategory, cat.id)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-racing-red text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => handleFilterChange(setSelectedBrand, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-racing-red focus:border-racing-red transition-all duration-200 dark:bg-gray-700 dark:text-white cursor-pointer"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Ordina per
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
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
              onClick={() => {
                setSelectedCategory('tutti')
                setSelectedBrand('Tutti')
                setSearchQuery('')
                setCurrentPage(1)
              }}
              className="mt-4 px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md"
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
                {paginatedProducts.map((product, index) => (
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
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white"
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-racing-red hover:text-white"
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

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0

  return (
    <div style={{ height: '380px', width: '100%', overflow: 'hidden' }}>
      <Link
        href={`/prodotti/${product.slug}`}
        className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm
          hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-racing-red"
        style={{ height: '380px', width: '100%', display: 'block', overflow: 'hidden' }}
      >
        {/* Image Container - Fixed Exact Size */}
        <div className="relative bg-white dark:bg-gray-800"
          style={{ height: '180px', minHeight: '180px', maxHeight: '180px', width: '100%', overflow: 'hidden' }}
        >
          {product.featured && (
            <div className="absolute top-2 left-2 z-10 bg-racing-red text-white text-xs font-bold px-3 py-1 rounded">
              IN EVIDENZA
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
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
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '15px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
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

        {/* Product Info - Fixed Height Sections */}
        <div style={{ height: '200px', minHeight: '200px', maxHeight: '200px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
          {/* Brand and Stock - Fixed Height */}
          <div style={{ height: '20px', minHeight: '20px', maxHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p className="text-xs text-racing-red font-bold uppercase tracking-wide truncate" style={{ flex: 1 }}>
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

          {/* Name - Fixed Height 2 Lines */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-racing-red transition-colors overflow-hidden"
            style={{ height: '40px', minHeight: '40px', maxHeight: '40px', fontSize: '13px', lineHeight: '20px', marginBottom: '8px' }}
          >
            {product.name}
          </h3>

          {/* Description - Fixed Height 2 Lines */}
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 overflow-hidden"
            style={{ height: '32px', minHeight: '32px', maxHeight: '32px', lineHeight: '16px', marginBottom: '8px' }}
          >
            {product.description}
          </p>

          {/* Price Section - Fixed Height - Mix Style */}
          <div style={{ height: '56px', minHeight: '56px', maxHeight: '56px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid', marginTop: 'auto' }}
            className="border-gray-200 dark:border-gray-700"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {hasDiscount && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-through" style={{ marginBottom: '2px' }}>
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-xl font-black text-racing-red">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <div className="bg-racing-red rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors duration-200"
              style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', flexShrink: 0 }}
            >
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
