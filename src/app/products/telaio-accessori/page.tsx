'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface SubCategory {
  id: string
  name: string
  slug: string
  description: string
  iconType: 'brake' | 'wheel' | 'axle' | 'chain' | 'shield' | 'gear' | 'pedal' | 'steering' | 'disc' | 'fuel' | 'seat' | 'ball' | 'wheel-steering' | 'bar'
  productCount?: number
  gradient: string
  imageUrl: string
}

const subcategories: SubCategory[] = [
  {
    id: 'freni-accessori',
    name: 'Freni e Accessori',
    slug: 'freni-e-accessori',
    description: 'Pastiglie freno, dischi, pinze e componenti frenanti per ogni esigenza',
    iconType: 'brake',
    productCount: 32,
    gradient: 'from-red-500 to-red-600',
    imageUrl: 'https://www.mondokart.com/c/142-category_boxed/freni-e-accessori-mondokart.jpg'
  },
  {
    id: 'cerchi-mozzi',
    name: 'Cerchi, Mozzi e Accessori',
    slug: 'cerchi-mozzi-e-accessori',
    description: 'Cerchi in alluminio, mozzi e componenti per ruote kart',
    iconType: 'wheel',
    gradient: 'from-gray-600 to-gray-700',
    imageUrl: 'https://www.mondokart.com/c/134-category_boxed/cerchi-mondokart.jpg'
  },
  {
    id: 'assali',
    name: 'Assali, Chiavette e Cuscinetti',
    slug: 'assali-chiavette-e-cuscinetti',
    description: 'Assali posteriori, chiavette di fissaggio e cuscinetti di qualità',
    iconType: 'axle',
    gradient: 'from-slate-500 to-slate-600',
    imageUrl: 'https://www.mondokart.com/c/129-category_boxed/assali-chiavette-e-cuscinetti-mondokart.jpg'
  },
  {
    id: 'corone-catene',
    name: 'Corone, Catene e Accessori',
    slug: 'corone-catene-e-accessori',
    description: 'Trasmissione completa: corone, catene, pignoni e accessori',
    iconType: 'chain',
    gradient: 'from-amber-600 to-amber-700',
    imageUrl: 'https://www.mondokart.com/c/136-category_boxed/corone-kz-mini-60-kf-mondokart.jpg'
  },
  {
    id: 'carenature',
    name: 'Carenature, Staffe e Paraurti',
    slug: 'carenature-staffe-e-paraurti',
    description: 'Protezioni, carenature e componenti di sicurezza per il kart',
    iconType: 'shield',
    gradient: 'from-emerald-500 to-emerald-600',
    imageUrl: 'https://www.mondokart.com/c/11-category_boxed/carenature-staffe-e-paraurti-mondokart.jpg'
  },
  {
    id: 'leve-cambio',
    name: 'Leve Cambio e Frizione',
    slug: 'leve-cambio-e-frizione',
    description: 'Leve cambio, frizione e comandi per kart cambio e frizione',
    iconType: 'gear',
    gradient: 'from-indigo-500 to-indigo-600',
    imageUrl: 'https://www.mondokart.com/c/143-category_boxed/leva-del-cambio-mondokart.jpg'
  },
  {
    id: 'pedali',
    name: 'Pedali e Accessori',
    slug: 'pedali-e-accessori',
    description: 'Pedali freno, acceleratore e accessori per il comando del kart',
    iconType: 'pedal',
    gradient: 'from-purple-500 to-purple-600',
    imageUrl: 'https://www.mondokart.com/c/148-category_boxed/pedali-e-accessori-mondokart.jpg'
  },
  {
    id: 'piantone',
    name: 'Piantone e Accessori',
    slug: 'piantone-e-accessori',
    description: 'Piantoni sterzo, snodi e componenti per il sistema di sterzo',
    iconType: 'steering',
    gradient: 'from-cyan-500 to-cyan-600',
    imageUrl: 'https://www.mondokart.com/c/149-category_boxed/piantone-e-accessori-mondokart.jpg'
  },
  {
    id: 'portacorona',
    name: 'Portacorona e Porta Disco',
    slug: 'portacorona-e-porta-disco',
    description: 'Supporti per corone e dischi freno posteriori',
    iconType: 'disc',
    gradient: 'from-orange-500 to-orange-600',
    imageUrl: 'https://www.mondokart.com/c/152-category_boxed/portacorona.jpg'
  },
  {
    id: 'serbatoio',
    name: 'Serbatoio e Tubi Benzina',
    slug: 'serbatoio-e-tubi-benzina',
    description: 'Serbatoi carburante, tubi benzina e accessori alimentazione',
    iconType: 'fuel',
    gradient: 'from-rose-500 to-rose-600',
    imageUrl: 'https://www.mondokart.com/c/157-category_boxed/serbatoio-e-tubi-benzina-mondokart.jpg'
  },
  {
    id: 'sedili',
    name: 'Sedili e Accessori',
    slug: 'sedili-e-accessori',
    description: 'Sedili omologati, imbottiture e accessori per il comfort',
    iconType: 'seat',
    gradient: 'from-blue-500 to-blue-600',
    imageUrl: 'https://www.mondokart.com/c/156-category_boxed/sedili-mondokart.jpg'
  },
  {
    id: 'uniball',
    name: 'Uniball',
    slug: 'uniball',
    description: 'Snodi sferici e uniball per telaio e sterzo',
    iconType: 'ball',
    gradient: 'from-teal-500 to-teal-600',
    imageUrl: 'https://www.mondokart.com/c/162-category_boxed/uniball-mondokart.jpg'
  },
  {
    id: 'volanti',
    name: 'Volanti e Accessori',
    slug: 'volanti-e-accessori',
    description: 'Volanti racing, mozzi e accessori per il sistema di sterzo',
    iconType: 'wheel-steering',
    gradient: 'from-violet-500 to-violet-600',
    imageUrl: 'https://www.mondokart.com/c/163-category_boxed/volanti-e-accessori-mondokart.jpg'
  },
  {
    id: 'barre',
    name: 'Barre Stabilizzatrici',
    slug: 'barra-stabilizzatrici',
    description: 'Barre antirollio e stabilizzatrici per il setup del telaio',
    iconType: 'bar',
    gradient: 'from-lime-500 to-lime-600',
    imageUrl: 'https://www.mondokart.com/c/130-category_boxed/barra-stabilizzatrice-mondokart.jpg'
  },
]

// Icon component con SVG professionali
function CategoryIcon({ type, className }: { type: string; className?: string }) {
  const iconClass = className || "w-16 h-16"

  switch (type) {
    case 'brake':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="4" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 3v3m0 12v3m9-9h-3M3 12h3" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'wheel':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2l2.8-2.8" strokeWidth="2"/>
        </svg>
      )
    case 'axle':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 12h16M8 8v8m8-8v8" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="8" cy="12" r="2" strokeWidth="2"/>
          <circle cx="16" cy="12" r="2" strokeWidth="2"/>
        </svg>
      )
    case 'chain':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'shield':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'gear':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          <path d="M12 1v6m0 6v10M1 12h6m6 0h10" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'pedal':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="8" width="6" height="12" rx="1" strokeWidth="2"/>
          <rect x="14" y="4" width="6" height="16" rx="1" strokeWidth="2"/>
        </svg>
      )
    case 'steering':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M12 2v4m0 12v4" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'disc':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      )
    case 'fuel':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14H5a2 2 0 0 1-2-2V6z" strokeWidth="2"/>
          <rect x="6" y="8" width="6" height="4" strokeWidth="2"/>
          <path d="M17 8h2a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'seat':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 12h14M5 12a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2M5 12v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'ball':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          <path d="M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20" strokeWidth="2"/>
        </svg>
      )
    case 'wheel-steering':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <path d="M14.5 9.5L12 12m0 0l-2.5 2.5M12 12l2.5 2.5M12 12l-2.5-2.5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'bar':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 12h18M6 8l6 4-6 4M18 8l-6 4 6 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
        </svg>
      )
  }
}

export default function TelaioAccessoriPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Telaio e Accessori
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Esplora le nostre categorie di componenti per telaio kart: dai freni agli assali,
              dalle carenature ai volanti. Tutto quello che serve per il tuo telaio.
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/prodotti" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Prodotti
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold">Telaio e Accessori</span>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/products/telaio-accessori/${subcategory.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden
                  hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-full
                  border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-white dark:bg-gray-800">
                  {/* Background image */}
                  <Image
                    src={subcategory.imageUrl}
                    alt={subcategory.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Subtle dark overlay for contrast only */}
                  <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-5 transition-opacity duration-300" />

                  {/* Product count badge */}
                  {subcategory.productCount && (
                    <div className="absolute top-3 right-3 z-20 bg-white/95 dark:bg-gray-900/95
                      text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg
                      backdrop-blur-sm border border-white/20">
                      {subcategory.productCount} prodotti
                    </div>
                  )}

                  {/* Category icon overlay (smaller, bottom left) */}
                  <div className="absolute bottom-3 left-3 z-10 text-white opacity-80">
                    <CategoryIcon type={subcategory.iconType} className="w-10 h-10" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2
                    group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors
                    line-clamp-1">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {subcategory.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm
                    group-hover:translate-x-2 transition-transform duration-300">
                    <span>Esplora categoria</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800
            rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Non trovi quello che cerchi?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Contattaci per ricevere assistenza nella scelta dei componenti giusti per il tuo kart.
              Il nostro team è a tua disposizione.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600
                  font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contattaci
              </Link>
              <Link
                href="/prodotti"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-800 text-white
                  font-bold rounded-lg hover:bg-blue-900 transition-colors"
              >
                Tutti i Prodotti
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
