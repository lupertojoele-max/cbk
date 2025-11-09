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
    <Link
      href={`/prodotti/${product.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden
        hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {product.featured && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            IN EVIDENZA
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
              ESAURITO
            </span>
          </div>
        )}
        <Image
          src={product.imageLocal || product.image || '/images/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                €{parseFloat(product.originalPrice!).toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              €{parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          {/* Stock Status */}
          {product.inStock ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
              Disponibile
            </span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Esaurito
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
