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
  const product = ((productsData as unknown as { products: Product[] }).products).find((p) => p.slug === slug)

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
  const relatedProducts = ((productsData as unknown as { products: Product[] }).products)
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  // Mock images array (in real implementation, you'd have multiple product images)
  const images = [product.imageLocal || product.image]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs - Mix Style */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-racing-red transition-colors font-medium">
            Home
          </Link>
          <span>/</span>
          <Link href="/prodotti" className="hover:text-racing-red transition-colors font-medium">
            Prodotti
          </Link>
          <span>/</span>
          <Link
            href={`/prodotti?category=${product.category}`}
            className="hover:text-racing-red transition-colors capitalize font-medium"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-bold">{product.name}</span>
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
              {/* Badges - Mix Style */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.featured && (
                  <div className="bg-racing-red text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
                    IN EVIDENZA
                  </div>
                )}
                {hasDiscount && (
                  <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
                    -{discountPercentage}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
                    ESAURITO
                  </div>
                )}
              </div>

              {/* Main Image - Clean */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-4 group/image cursor-zoom-in hover:shadow-2xl transition-shadow duration-500">
                <div className="relative h-96 md:h-[500px]">
                  <Image
                    src={images[selectedImage] || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover/image:scale-105 transition-transform duration-700 ease-out"
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
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === idx
                          ? 'border-racing-red ring-2 ring-racing-red ring-offset-2 scale-105'
                          : 'border-gray-300 dark:border-gray-600 hover:border-racing-red'
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
            {/* Brand - Red Accent */}
            <p className="text-sm text-racing-red font-bold mb-2 uppercase tracking-wide">
              {product.brand}
            </p>

            {/* Product Name - Bold */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Price - Red Bold */}
            <div className="mb-6">
              {hasDiscount && (
                <p className="text-xl text-gray-500 dark:text-gray-400 line-through mb-1">
                  €{parseFloat(product.originalPrice!).toFixed(2)}
                </p>
              )}
              <p className="text-4xl font-black text-racing-red">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            {/* Stock Status - Mix */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <svg
                    className="w-5 h-5 mr-2"
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

            {/* Description - Clean */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Descrizione
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & CTA - Mix Style */}
            {product.inStock && (
              <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-racing-red">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Quantità
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-racing-red transition-all duration-300 active:scale-95"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-medium text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-racing-red transition-all duration-300 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contact CTA - Red Button */}
                <Link
                  href="/contatti"
                  className="block w-full py-3 px-6 text-center bg-racing-red text-white font-bold rounded-lg
                    hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Richiedi Preventivo
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                  Contattaci per prezzi speciali e disponibilità
                </p>
              </div>
            )}

            {/* Additional Info - Mix */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                <strong className="text-gray-900 dark:text-white">Categoria:</strong>{' '}
                <span className="capitalize">{product.category}</span>
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Codice Prodotto:</strong> {product.id}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Specifications Section - Mix Style */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
              Specifiche <span className="text-racing-red">Tecniche</span>
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-racing-red shadow-md overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-[1.01] transition-all duration-300"
                    >
                      <td className="px-6 py-4 font-bold text-racing-red w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{value}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products - Mix Style */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
              Prodotti <span className="text-racing-red">Correlati</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedHasDiscount = relatedProduct.originalPrice && parseFloat(relatedProduct.originalPrice) > parseFloat(relatedProduct.price)
                const relatedDiscountPercentage = relatedHasDiscount
                  ? Math.round(((parseFloat(relatedProduct.originalPrice!) - parseFloat(relatedProduct.price)) / parseFloat(relatedProduct.originalPrice!)) * 100)
                  : 0

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/prodotti/${relatedProduct.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-md
                      hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out group border border-gray-200 dark:border-gray-700 hover:border-racing-red"
                  >
                    <div className="relative h-48 bg-white dark:bg-gray-800">
                      {relatedProduct.featured && (
                        <div className="absolute top-2 left-2 z-10 bg-racing-red text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                          IN EVIDENZA
                        </div>
                      )}
                      {relatedHasDiscount && (
                        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                          -{relatedDiscountPercentage}%
                        </div>
                      )}
                      <Image
                        src={
                          relatedProduct.imageLocal ||
                          relatedProduct.image ||
                          '/images/placeholder-product.jpg'
                        }
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-racing-red font-bold mb-1 uppercase tracking-wide">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-racing-red transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          {relatedHasDiscount && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                              €{parseFloat(relatedProduct.originalPrice!).toFixed(2)}
                            </p>
                          )}
                          <p className="text-lg font-black text-racing-red">
                            €{parseFloat(relatedProduct.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-racing-red rounded-full flex items-center justify-center shadow-md group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 w-8 h-8">
                          <svg className="text-white w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
