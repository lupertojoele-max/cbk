import { notFound } from 'next/navigation'
import productsData from '../../../../../data/products.json'
import SubcategoryPageClient from './SubcategoryPageClient'

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

// Mapping slug to category in products.json
const slugToCategoryMap: Record<string, string> = {
  'freni-e-accessori': 'freni-accessori',
  'cerchi-mozzi-e-accessori': 'cerchi-mozzi',
  'assali-chiavette-e-cuscinetti': 'assali',
  'corone-catene-e-accessori': 'corone-catene',
  'carenature-staffe-e-paraurti': 'carenature',
  'leve-cambio-e-frizione': 'leve-cambio',
  'pedali-e-accessori': 'pedali',
  'piantone-e-accessori': 'piantone',
  'portacorona-e-porta-disco': 'portacorona',
  'serbatoio-e-tubi-benzina': 'serbatoio',
  'sedili-e-accessori': 'sedili',
  'uniball': 'uniball',
  'volanti-e-accessori': 'volanti',
  'barra-stabilizzatrici': 'barre',
}

const categoryNames: Record<string, string> = {
  'freni-e-accessori': 'Freni e Accessori',
  'cerchi-mozzi-e-accessori': 'Cerchi, Mozzi e Accessori',
  'assali-chiavette-e-cuscinetti': 'Assali, Chiavette e Cuscinetti',
  'corone-catene-e-accessori': 'Corone, Catene e Accessori',
  'carenature-staffe-e-paraurti': 'Carenature, Staffe e Paraurti',
  'leve-cambio-e-frizione': 'Leve Cambio e Frizione',
  'pedali-e-accessori': 'Pedali e Accessori',
  'piantone-e-accessori': 'Piantone e Accessori',
  'portacorona-e-porta-disco': 'Portacorona e Porta Disco',
  'serbatoio-e-tubi-benzina': 'Serbatoio e Tubi Benzina',
  'sedili-e-accessori': 'Sedili e Accessori',
  'uniball': 'Uniball',
  'volanti-e-accessori': 'Volanti e Accessori',
  'barra-stabilizzatrici': 'Barre Stabilizzatrici',
}

const brands = [
  'Tutti',
  'CRG',
  'TonyKart OTK',
  'Birel',
  'Intrepid',
  'Mondokart Racing',
  'WildKart',
  'Varie',
]

export default async function SubcategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Get category ID from slug
  const categoryId = slugToCategoryMap[slug]
  const categoryName = categoryNames[slug]

  // If category not found, show 404
  if (!categoryId || !categoryName) {
    notFound()
  }

  const products = productsData.products as Product[]
  const allCategoryProducts = products.filter((p) => p.category === categoryId)

  // Pass data to client component
  return (
    <SubcategoryPageClient
      categoryName={categoryName}
      slug={slug}
      allCategoryProducts={allCategoryProducts}
      brands={brands}
    />
  )
}
