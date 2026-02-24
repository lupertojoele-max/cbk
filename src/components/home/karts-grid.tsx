import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { KartsCarousel, KartProduct } from './karts-carousel'
import productsData from '../../../data/products.json'

function getChassisProducts(): KartProduct[] {
  const products = (productsData as { products: Record<string, unknown>[] }).products
  return products
    .filter((p) => p.category === 'telai-nuovi')
    .map((p) => ({
      id:           String(p.id ?? ''),
      name:         String(p.name ?? ''),
      slug:         String(p.slug ?? ''),
      brand:        String(p.brand ?? ''),
      subcategory:  String(p.subcategory ?? ''),
      price:        String(p.price ?? '0'),
      image:        String(p.imageLocal ?? p.image ?? ''),
      description:  String(p.description ?? ''),
      mondokartUrl: String(p.mondokartUrl ?? '/prodotti'),
    }))
}

export function KartsGrid() {
  const products = getChassisProducts()

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1877F2] mb-2 block">
              Catalogo Prodotti
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Telai Nuovi 2026
            </h2>
            <p className="text-racing-gray-300 mt-2 max-w-xl">
              I migliori telai da competizione disponibili nel nostro shop. Qualità racing per ogni categoria.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#1877F2] hover:bg-[#1565C0] text-white px-8 shrink-0"
            asChild
          >
            <Link href="/prodotti">
              Tutti i Prodotti
            </Link>
          </Button>
        </div>

        {/* Carousel */}
        {products.length > 0 ? (
          <KartsCarousel products={products} />
        ) : (
          <div className="text-center py-16">
            <p className="text-racing-gray-400">Nessun prodotto disponibile al momento.</p>
          </div>
        )}
      </div>
    </section>
  )
}
