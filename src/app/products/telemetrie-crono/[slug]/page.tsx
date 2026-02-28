import { notFound } from 'next/navigation'
import productsData from '../../../../../data/products.json'
import ProductFilterPage from '../../_shared/ProductFilterPage'
import { subcategoryConfigs } from '../../_shared/subcategoryConfig'

type Product = {
  id: string; name: string; slug: string; category: string; brand: string
  price: string; originalPrice?: string; image: string; imageLocal?: string
  description: string; inStock: boolean; mondokartUrl?: string
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const config = subcategoryConfigs['telemetrie-crono']
  if (!config.slugMap[slug]) notFound()
  const allProducts = (productsData as unknown as { products: Product[] }).products
  return <ProductFilterPage allProducts={allProducts} slug={slug} config={config} />
}
