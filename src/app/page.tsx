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
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">15+</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Vittorie Stagione</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">6</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Piloti Professionisti</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">10</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Kart da Gara</div>
            </RacingStaggerItem>
            <RacingStaggerItem className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2 racing-number">3</div>
              <div className="text-racing-gray-300 text-sm uppercase tracking-widest">Campionati</div>
            </RacingStaggerItem>
          </RacingStagger>
        </div>
      </section>

      {/* Highlights Section */}
      <Highlights />

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

      {/* CTA Section */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <RacingFadeIn delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto a Vivere l'Eccellenza delle Corse?
            </h2>
          </RacingFadeIn>
          <RacingFadeIn delay={0.4}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contattaci per saperne di più sul nostro team, opportunità di sponsorizzazione o eventi futuri
            </p>
          </RacingFadeIn>
          <RacingFadeIn delay={0.6}>
            <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3 racing-lift">
              <Link href="/contact">Contattaci</Link>
            </Button>
          </RacingFadeIn>
        </div>
      </section>
    </div>
  )
}