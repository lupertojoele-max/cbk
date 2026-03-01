import productsData from '../../../../data/products.json'
import type { Metadata } from 'next'
import { ProductDetailClient } from './product-detail-client'

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

const allProducts = (productsData as unknown as { products: Product[] }).products

// Dynamic rendering for all product pages (6789 products - too many to prerender on Windows)
export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = allProducts.find((p) => p.slug === slug)

  if (!product) {
    return {
      title: 'Prodotto Non Trovato | CBK1',
      description: 'Il prodotto ricercato non e disponibile nel catalogo CBK1.',
    }
  }

  const rawDesc = (product.description || '').trim()
  const shortDescription = rawDesc.length > 0
    ? rawDesc.slice(0, 140) + '...'
    : (product.brand + ' - ' + product.category + ' - Disponibile su CBK1')

  const imageUrl = product.imageLocal || product.image || '/images/seo/og-default.jpg'

  return {
    title: product.name + ' | CBK1',
    description: shortDescription + ' | ' + product.brand + ' | CBK1 Karting',
    openGraph: {
      title: product.name + ' | CBK1',
      description: shortDescription,
      type: 'website',
      siteName: 'CBK1',
      locale: 'it_IT',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name + ' | CBK1',
      description: shortDescription,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = allProducts.find((p) => p.slug === slug) || null

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description || product.name).trim().slice(0, 500),
    image: product.imageLocal || product.image,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://cbk1.it') + '/prodotti/' + product.slug,
      priceCurrency: 'EUR',
      price: parseFloat(product.price).toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'CBK1 - CBK Racing',
      },
    },
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient product={product} />
    </>
  )
}
