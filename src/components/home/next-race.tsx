import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractData, formatEventDate, getDaysUntilEvent, getMediaUrl } from '@/lib/api-utils'
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users, Clock, Flag } from "lucide-react"

export async function NextRace() {
  let upcomingEvent = null
  let error = null

  try {
    const response = await api.events.list({ upcoming: true, per_page: 1 })
    const events = extractData(response)
    upcomingEvent = events[0] || null
  } catch (err) {
    console.error('Failed to fetch upcoming events:', err)
    error = err instanceof Error ? err.message : 'Failed to load upcoming events'
  }

  if (error || !upcomingEvent) {
    return (
      <section className="py-16 bg-racing-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Next Race
            </h2>
            <div className="bg-racing-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-300 mb-4">
                {error ? 'Unable to load upcoming events.' : 'No upcoming races scheduled at the moment.'}
              </p>
              <Button className="bg-racing-red hover:bg-racing-red/90" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const daysUntil = getDaysUntilEvent(upcomingEvent.schedule.event_date)
  const isToday = daysUntil === 0
  const isTomorrow = daysUntil === 1

  return (
    <section className="py-16 bg-racing-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-racing-red/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-racing-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-racing-red/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-racing-red text-white text-sm px-4 py-2">
            {isToday ? 'Racing Today!' : isTomorrow ? 'Racing Tomorrow!' : 'Upcoming Race'}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Next Race
          </h2>
          <p className="text-xl text-racing-gray-300 max-w-2xl mx-auto">
            Don't miss our next thrilling race event
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white text-racing-gray-900 border-0 shadow-2xl overflow-hidden">
            <div className="md:flex">
              {/* Event Image */}
              <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                <Image
                  src={getMediaUrl(upcomingEvent.photos?.[0], '/images/event-placeholder.jpg')}
                  alt={upcomingEvent.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={
                      upcomingEvent.status === 'Live'
                        ? 'bg-red-500 text-white animate-pulse'
                        : upcomingEvent.status === 'Scheduled'
                        ? 'bg-green-500 text-white'
                        : 'bg-racing-gray-500 text-white'
                    }
                  >
                    {upcomingEvent.status}
                  </Badge>
                </div>

                {/* Event Type */}
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 text-racing-gray-900">
                    {upcomingEvent.type}
                  </Badge>
                </div>
              </div>

              {/* Event Details */}
              <div className="md:w-1/2 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-racing-gray-900 leading-tight">
                    {upcomingEvent.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-racing-gray-600">
                    {formatEventDate(upcomingEvent.schedule.event_date)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  {/* Countdown */}
                  <div className="bg-racing-red/10 rounded-lg p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold text-racing-red mb-2">
                      {isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : daysUntil}
                    </div>
                    <div className="text-racing-gray-600 font-medium">
                      {isToday || isTomorrow ? 'Race Day' : daysUntil === 1 ? 'Day Remaining' : 'Days Remaining'}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-racing-red flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{upcomingEvent.track.name}</div>
                        <div className="text-sm text-racing-gray-600">{upcomingEvent.track.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Flag className="w-5 h-5 text-racing-red flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Track Length</div>
                        <div className="text-sm text-racing-gray-600">
                          {upcomingEvent.track.length_meters}m • {upcomingEvent.track.surface}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-racing-red flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Participants</div>
                        <div className="text-sm text-racing-gray-600">
                          {upcomingEvent.participants.registered}/{upcomingEvent.participants.max_capacity} registered
                          {upcomingEvent.participants.waiting_list > 0 && (
                            <span className="ml-2 text-orange-600">
                              • {upcomingEvent.participants.waiting_list} waiting
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {upcomingEvent.schedule.registration_deadline && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-racing-red flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Registration Deadline</div>
                          <div className="text-sm text-racing-gray-600">
                            {formatEventDate(upcomingEvent.schedule.registration_deadline)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      className="flex-1 bg-racing-red hover:bg-racing-red/90 text-white"
                      asChild
                    >
                      <Link href={`/events/${upcomingEvent.slug}`}>
                        View Event Details
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                      asChild
                    >
                      <Link href="/events">
                        All Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}