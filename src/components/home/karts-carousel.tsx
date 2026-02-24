'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface KartProduct {
  id: string
  name: string
  slug: string
  brand: string
  subcategory: string
  price: string
  image: string
  description: string
  mondokartUrl: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'Mini':       'bg-green-600 text-white',
  'Baby':       'bg-emerald-600 text-white',
  'OK-Junior':  'bg-blue-600 text-white',
  'Junior':     'bg-blue-600 text-white',
  'OK':         'bg-purple-600 text-white',
  'Senior':     'bg-purple-600 text-white',
  'KZ':         'bg-red-600 text-white',
  'Shifter':    'bg-red-600 text-white',
}

const BRAND_COLORS: Record<string, string> = {
  'CRG':          'bg-orange-500',
  'Tony Kart':    'bg-blue-700',
  'TonyKart':     'bg-blue-700',
  'BirelArt':     'bg-red-600',
  'Top-Kart':     'bg-green-700',
  'Kart Republic':'bg-purple-700',
  'Praga':        'bg-yellow-600',
  'Parolin':      'bg-teal-600',
  'Kosmic':       'bg-gray-600',
  'Intrepid':     'bg-slate-700',
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(num)
}

function cleanProductName(name: string): string {
  // Remove "Chassis BRAND " prefix and trailing "!"  and year
  return name
    .replace(/^Chassis\s+/i, '')
    .replace(/\s*\d{4}!?\s*$/, '')
    .replace(/!$/, '')
    .trim()
}

const CARD_WIDTH = 296 // px including gap

export function KartsCarousel({ products }: { products: KartProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScrollability()
    el.addEventListener('scroll', checkScrollability, { passive: true })
    return () => el.removeEventListener('scroll', checkScrollability)
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === 'left' ? -CARD_WIDTH * 2 : CARD_WIDTH * 2,
      behavior: 'smooth',
    })
  }

  if (products.length === 0) return null

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
            w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center
            hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scorri a sinistra"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
            w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center
            hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scorri a destra"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => {
          const brandColor = BRAND_COLORS[product.brand] || 'bg-gray-700'
          const catColor = CATEGORY_COLORS[product.subcategory] || 'bg-gray-600 text-white'
          const cleanName = cleanProductName(product.name)

          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-[272px] bg-white rounded-2xl overflow-hidden shadow-lg
                hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Brand stripe */}
              <div className={`h-1.5 w-full ${brandColor}`} />

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="272px"
                />
                {/* Brand badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${brandColor}`}>
                    {product.brand}
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs font-semibold ${catColor}`}>
                    {product.subcategory}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#1877F2] transition-colors">
                    {cleanName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    href={product.mondokartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold
                      text-[#1877F2] hover:text-[#1565C0] transition-colors"
                  >
                    Scopri
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
