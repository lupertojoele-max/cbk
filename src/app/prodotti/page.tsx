'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import productsData from '../../../data/products.json'

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
  const [sortBy, setSortBy] = useState('featured') // featured, price-asc, price-desc, name

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Catalogo Prodotti
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Scopri la nostra gamma completa di prodotti per il karting: pneumatici,
            telemetrie, motori, telai e molto altro.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cerca prodotti per nome, descrizione o brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordina per
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="featured">In Evidenza</option>
                <option value="name">Nome (A-Z)</option>
                <option value="price-asc">Prezzo (Crescente)</option>
                <option value="price-desc">Prezzo (Decrescente)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} prodott{filteredProducts.length === 1 ? 'o' : 'i'}{' '}
            trovat{filteredProducts.length === 1 ? 'o' : 'i'}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Nessun prodotto trovato con i filtri selezionati.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('tutti')
                setSelectedBrand('Tutti')
                setSearchQuery('')
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Resetta Filtri
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
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
        className="block bg-white dark:bg-gray-800 rounded-xl shadow-md
          hover:shadow-2xl transition-shadow duration-300 group border border-gray-200/50 dark:border-gray-700/50"
        style={{ height: '380px', width: '100%', display: 'block', overflow: 'hidden' }}
      >
        {/* Image Container - Fixed Exact Size */}
        <div className="relative bg-white dark:bg-gray-800"
          style={{ height: '180px', minHeight: '180px', maxHeight: '180px', width: '100%', overflow: 'hidden' }}
        >
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
              className="object-contain"
              sizes="180px"
              style={{ padding: '15px' }}
            />
          </div>
        </div>

        {/* Product Info - Fixed Height Sections */}
        <div style={{ height: '200px', minHeight: '200px', maxHeight: '200px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
          {/* Brand and Stock - Fixed Height */}
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

          {/* Name - Fixed Height 2 Lines */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors overflow-hidden"
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

          {/* Price Section - Fixed Height */}
          <div style={{ height: '56px', minHeight: '56px', maxHeight: '56px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid', marginTop: 'auto' }}
            className="border-gray-200 dark:border-gray-700"
          >
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
            <div className="bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-700 transition-colors"
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
