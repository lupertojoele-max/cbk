import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { MegaHero } from "@/components/hero/mega-hero"
import { Highlights } from "@/components/home/highlights"
import { KartsGrid } from "@/components/home/karts-grid"
import { NextRace } from "@/components/home/next-race"
import { NewsList } from "@/components/home/news-list"
import { SponsorStripAPI } from "@/components/sponsors/sponsor-strip-api"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2">15+</div>
              <div className="text-racing-gray-600">Wins This Season</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2">6</div>
              <div className="text-racing-gray-600">Professional Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2">10</div>
              <div className="text-racing-gray-600">Racing Karts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-racing-red mb-2">3</div>
              <div className="text-racing-gray-600">Championships</div>
            </div>
          </div>
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
      <section className="py-16 bg-racing-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Racing Excellence?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to learn more about our team, sponsorship opportunities, or upcoming events
          </p>
          <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}