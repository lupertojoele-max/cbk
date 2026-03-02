import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  brand: string
  price: string
  originalPrice?: string
  image: string
  imageLocal?: string
  description?: string
  inStock: boolean
  featured?: boolean
}

interface ProductCardProps {
  product: Product
  sizes?: string
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(num)
}

export function ProductCard({ product, sizes }: ProductCardProps) {
  const hasDiscount =
    product.originalPrice &&
    parseFloat(product.originalPrice) > parseFloat(product.price)
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
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-racing-red/30"
    >
      {/* Image — fixed height, no background */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden">
        {/* thin red line top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-racing-red z-10" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-racing-red text-white text-xs font-black px-2 py-0.5 rounded">
              Top
            </span>
          )}
          {hasDiscount && (
            <span className="bg-racing-red text-white text-xs font-black px-2 py-0.5 rounded">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Esaurito</span>
          </div>
        )}

        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
          sizes={sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
          loading="lazy"
        />
      </div>

      {/* Content — flex column, price+button always at bottom */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        <p className="text-xs font-bold text-racing-red uppercase tracking-widest mb-1.5">
          {product.brand}
        </p>

        {/* Name — fixed 2-line min height so cards align */}
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-racing-red transition-colors duration-200">
          {product.name}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3 mb-3">
          <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-sm line-through leading-none">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="w-full bg-racing-red group-hover:bg-racing-red-dark text-white text-xs font-black uppercase tracking-widest py-2.5 text-center rounded-lg transition-colors duration-200">
          Vedi Prodotto
        </div>
      </div>
    </Link>
  )
}
