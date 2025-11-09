'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import productsData from '../../../../data/products.json'

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

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  // Find product by slug
  const product = (productsData.products as Product[]).find((p) => p.slug === slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Prodotto Non Trovato
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Il prodotto che stai cercando non esiste o è stato rimosso.
            </p>
            <Link
              href="/prodotti"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                hover:bg-blue-700 transition-colors"
            >
              Torna al Catalogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hasDiscount =
    product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
          parseFloat(product.originalPrice!)) *
          100
      )
    : 0

  // Get related products from same category
  const relatedProducts = (productsData.products as Product[])
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  // Mock images array (in real implementation, you'd have multiple product images)
  const images = [product.imageLocal || product.image]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/prodotti" className="hover:text-blue-600 dark:hover:text-blue-400">
            Prodotti
          </Link>
          <span>/</span>
          <Link
            href={`/prodotti?category=${product.category}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.featured && (
                  <div className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded">
                    IN EVIDENZA
                  </div>
                )}
                {hasDiscount && (
                  <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                    -{discountPercentage}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded">
                    ESAURITO
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-4">
                <div className="relative h-96 md:h-[500px]">
                  <Image
                    src={images[selectedImage] || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              {/* Image Thumbnails (if multiple images) */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <Image
                        src={img || '/images/placeholder-product.jpg'}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand */}
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
              {product.brand}
            </p>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {hasDiscount && (
                <p className="text-xl text-gray-500 dark:text-gray-400 line-through mb-1">
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponibile
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Esaurito
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Descrizione
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & CTA */}
            {product.inStock && (
              <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantità
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-medium text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contact CTA */}
                <Link
                  href="/contatti"
                  className="block w-full py-3 px-6 text-center bg-blue-600 text-white font-bold rounded-lg
                    hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Richiedi Preventivo
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                  Contattaci per prezzi speciali e disponibilità
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                <strong>Categoria:</strong>{' '}
                <span className="capitalize">{product.category}</span>
              </p>
              <p>
                <strong>Codice Prodotto:</strong> {product.id}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Specifiche Tecniche
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Prodotti Correlati
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/prodotti/${relatedProduct.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={
                        relatedProduct.imageLocal ||
                        relatedProduct.image ||
                        '/images/placeholder-product.jpg'
                      }
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                      {relatedProduct.brand}
                    </p>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      €{parseFloat(relatedProduct.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
