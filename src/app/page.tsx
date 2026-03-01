import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { MegaHero } from "@/components/hero/mega-hero"
import { Highlights } from "@/components/home/highlights"
import { KartsGrid } from "@/components/home/karts-grid"
import { NextRace } from "@/components/home/next-race"
import { NewsList } from "@/components/home/news-list"
import { SponsorStripAPI } from "@/components/sponsors/sponsor-strip-api"
import { RacingStagger, RacingStaggerItem, RacingFadeIn } from "@/components/animations"
import Link from "next/link"
import { NewsletterForm } from '@/components/home/newsletter-form'

// Loading components for Suspense boundaries
function KartsGridSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-racing-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-racing-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-racing-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-10 bg-racing-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NextRaceSkeleton() {
  return (
    <section className="py-16 bg-racing-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-racing-gray-700 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-racing-gray-700 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8">
            <div className="h-64 bg-racing-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

function NewsListSkeleton() {
  return (
    <section className="py-16 bg-racing-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-racing-gray-200 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-racing-gray-200 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-video bg-racing-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-8 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-20 bg-racing-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SponsorStripSkeleton() {
  return (
    <section className="py-8 md:py-12 bg-white border-y border-racing-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="h-8 bg-racing-gray-200 rounded w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-racing-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="flex space-x-8 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-16 md:w-40 md:h-20 bg-racing-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <MegaHero />

      {/* Quick Stats */}
      <section className="py-12 bg-zinc-900 border-b-2 border-racing-red/40">
        <div className="container mx-auto px-4">
          <RacingStagger staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">6.800+</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Prodotti a Catalogo</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">24h</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Spedizione Express</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">50+</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Brand Partner</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">10+</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Anni nel Karting</div>
            </RacingStaggerItem>
          </RacingStagger>
        </div>
      </section>

      {/* Highlights Section */}
      <Highlights />
      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">

          {/* Testimonials */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Cosa Dicono i Nostri <span className="text-racing-red">Piloti</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              La fiducia dei professionisti del karting italiano e il nostro miglior riconoscimento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-racing-red">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center text-white font-black text-lg mr-4">M</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Marco Ferretti</p>
                  <p className="text-sm text-racing-red font-medium">Pilota OK — Team Nordika Racing</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                &ldquo;Trovo sempre quello che cerco. Dall'assale ai fuselli, dal carburatore alle pastiglie freno — il catalogo CBK1 copre tutto. E la spedizione arriva sempre il giorno dopo.&rdquo;
              </p>
              <div className="mt-4 text-racing-red">
                <span className="text-xl">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-racing-red">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center text-white font-black text-lg mr-4">A</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Alessandro Moretti</p>
                  <p className="text-sm text-racing-red font-medium">Team Manager — Scuderia Milanese Kart</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                &ldquo;Gestiamo un parco kart di 8 vetture in categoria KZ e OK. CBK1 e l'unico fornitore con cui riusciamo a tenere il magazzino box sempre rifornito. Assistenza tecnica impeccabile.&rdquo;
              </p>
              <div className="mt-4 text-racing-red">
                <span className="text-xl">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-racing-red">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center text-white font-black text-lg mr-4">S</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Sofia Brambilla</p>
                  <p className="text-sm text-racing-red font-medium">Pilota KZ Ladies — Campionessa Regionale</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                &ldquo;Prima di ogni weekend di gara verifico il setup con il team CBK1. Sanno esattamente quale assetto serve su ogni tracciato. Indispensabili per chiunque voglia fare sul serio.&rdquo;
              </p>
              <div className="mt-4 text-racing-red">
                <span className="text-xl">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
            </div>
          </div>

          {/* Brand Logos */}
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
              Brand Partner Ufficiali
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {["OTK / TonyKart", "CRG", "BirelArt", "IAME", "TM Racing", "Rotax", "Vega", "LeCont", "Maxxis", "Alpinestars"].map((brand) => (
                <span key={brand} className="text-sm md:text-base font-black text-gray-400 dark:text-gray-500 hover:text-racing-red dark:hover:text-racing-red transition-colors duration-200 cursor-default uppercase tracking-wide">
                  {brand}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Karts Grid */}
      <Suspense fallback={<KartsGridSkeleton />}>
        <KartsGrid />
      </Suspense>

      {/* Next Race */}
      <Suspense fallback={<NextRaceSkeleton />}>
        <NextRace />
      </Suspense>

      {/* News List */}
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList />
      </Suspense>

      {/* Sponsor Strip */}
      <Suspense fallback={<SponsorStripSkeleton />}>
        <SponsorStripAPI />
      </Suspense>


      {/* Newsletter / Community Section */}
      <section className="py-16 bg-zinc-900 border-t border-racing-red/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-racing-red/10 border border-racing-red/30 rounded-full px-4 py-1 text-sm text-racing-red font-bold uppercase tracking-widest mb-6">
              CBK Community
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Resta Aggiornato sui Nuovi Prodotti
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Iscriviti alla newsletter CBK1: novita di catalogo, offerte esclusive, guide tecniche
              per migliorare il tuo setup in pista. La community dei piloti seri inizia qui.
            </p>
            <NewsletterForm />
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-black text-racing-red mb-1">6.800+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Prodotti in Catalogo</div>
              </div>
              <div>
                <div className="text-2xl font-black text-racing-red mb-1">24h</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Spedizione Express</div>
              </div>
              <div>
                <div className="text-2xl font-black text-racing-red mb-1">10+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Anni nel Karting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <RacingFadeIn delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Il Tuo Setup Perfetto Inizia Qui
            </h2>
          </RacingFadeIn>
          <RacingFadeIn delay={0.4}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Hai bisogno di assistenza tecnica per scegliere il ricambio giusto? Il team CBK1 è a tua disposizione per guidarti nel setup perfetto del tuo kart.
            </p>
          </RacingFadeIn>
          <RacingFadeIn delay={0.6}>
            <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3 racing-lift">
              <Link href="/contatti">Contatta il Team Tecnico</Link>
            </Button>
          </RacingFadeIn>
        </div>
      </section>
    </div>
  )
}