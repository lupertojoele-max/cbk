import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractData, getMediaUrl } from '@/lib/api-utils'
import { Kart } from '@/lib/types'
import Link from "next/link"
import Image from "next/image"
import { Zap, Trophy, Settings } from "lucide-react"

export async function KartsGrid() {
  let karts: Kart[] = []
  let error = null

  try {
    const response = await api.karts.list({ per_page: 6 })
    karts = extractData(response)
  } catch (err) {
    console.error('Failed to fetch karts:', err)
    error = err instanceof Error ? err.message : 'Failed to load karts'
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
              Our Racing Fleet
            </h2>
            <div className="bg-racing-gray-50 rounded-lg p-8">
              <p className="text-racing-gray-600">
                Unable to load karts at the moment. Please try again later.
              </p>
              <Button className="mt-4 bg-racing-red hover:bg-racing-red/90" asChild>
                <Link href="/karts">View All Karts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
            Our Racing Fleet
          </h2>
          <p className="text-xl text-racing-gray-600 max-w-2xl mx-auto">
            High-performance go-karts engineered for speed, precision, and racing excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {karts.map((kart) => (
            <Card
              key={kart.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={getMediaUrl(kart.gallery?.[0], '/images/kart-placeholder.jpg')}
                  alt={`${kart.name} go-kart`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    className={
                      kart.is_available
                        ? 'bg-green-500 text-white'
                        : 'bg-racing-gray-500 text-white'
                    }
                  >
                    {kart.is_available ? 'Available' : 'In Use'}
                  </Badge>
                </div>

                {/* Condition Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className="bg-white/90 text-racing-gray-900 border-racing-gray-300"
                  >
                    {kart.condition}
                  </Badge>
                </div>

                {/* Kart Number */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-racing-red text-white font-bold text-lg px-3 py-1 rounded-lg">
                    #{kart.number}
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors">
                      {kart.name}
                    </CardTitle>
                    <CardDescription className="text-racing-gray-600">
                      {kart.category} • {kart.specifications.brand} {kart.specifications.model}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Specifications */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-racing-gray-900">
                        {kart.specifications.max_speed_kmh}
                      </div>
                      <div className="text-racing-gray-500">km/h</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-racing-red" />
                    <div>
                      <div className="font-semibold text-racing-gray-900">
                        {kart.performance.wins}
                      </div>
                      <div className="text-racing-gray-500">wins</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-semibold text-racing-gray-900">
                        {kart.specifications.year_manufactured}
                      </div>
                      <div className="text-racing-gray-500">year</div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="flex justify-between text-sm bg-racing-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <div className="font-semibold text-racing-gray-900">
                      {kart.performance.total_races}
                    </div>
                    <div className="text-racing-gray-500">Races</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-racing-gray-900">
                      {kart.performance.podiums}
                    </div>
                    <div className="text-racing-gray-500">Podiums</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-racing-gray-900">
                      {kart.performance.best_lap_time}s
                    </div>
                    <div className="text-racing-gray-500">Best Lap</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full group-hover:border-racing-red group-hover:text-racing-red transition-colors"
                  asChild
                >
                  <Link href={`/karts/${kart.slug}`}>
                    View Details
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3"
            asChild
          >
            <Link href="/karts">
              View All Karts
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}