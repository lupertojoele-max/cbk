'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Flag, Trophy } from "lucide-react"
import { wsk2026Calendar, WSKEvent } from '@/data/wsk-2026-calendar'
import { rok2026Calendar, ROKEvent } from '@/data/rok-2026-calendar'
import { iame2026Calendar, IAMEEvent } from '@/data/iame-2026-calendar'

// Union type for all event types
type CalendarEvent = (WSKEvent | ROKEvent | IAMEEvent) & { eventType: 'WSK' | 'ROK' | 'IAME' }

// Championship logos mapping
const championshipLogos: Record<string, string> = {
  'WSK': '/images/championships/wsk-logo.png',
  'ROK': '/images/championships/rok-logo.png',
  'IAME': '/images/championships/iame-logo.png',
}

// Championship colors
const championshipColors: Record<string, { bg: string; text: string; accent: string }> = {
  'WSK': { bg: 'bg-red-600', text: 'text-red-600', accent: 'from-red-600/20' },
  'ROK': { bg: 'bg-orange-600', text: 'text-orange-600', accent: 'from-orange-600/20' },
  'IAME': { bg: 'bg-purple-600', text: 'text-purple-600', accent: 'from-purple-600/20' },
}

// Get all events from all calendars
function getAllEvents(): CalendarEvent[] {
  return [
    ...wsk2026Calendar.map(event => ({ ...event, eventType: 'WSK' as const })),
    ...rok2026Calendar.map(event => ({ ...event, eventType: 'ROK' as const })),
    ...iame2026Calendar.map(event => ({ ...event, eventType: 'IAME' as const })),
  ]
}

// Get next upcoming event
function getNextEvent(): CalendarEvent | null {
  const allEvents = getAllEvents()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find events that haven't ended yet (include ongoing events)
  const upcomingEvents = allEvents
    .filter(event => new Date(event.endDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return upcomingEvents[0] || null
}

// Calculate days until event
function getDaysUntil(startDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(startDate)
  eventDate.setHours(0, 0, 0, 0)
  const diffTime = eventDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Check if event is happening today
function isEventToday(startDate: string, endDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  return today >= start && today <= end
}

export function NextRace() {
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null)
  const [daysUntil, setDaysUntil] = useState<number>(0)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  // Update event data
  const updateEventData = () => {
    const event = getNextEvent()
    setNextEvent(event)

    if (event) {
      const days = getDaysUntil(event.startDate)
      setDaysUntil(days)
      setIsLive(isEventToday(event.startDate, event.endDate))
    }
  }

  useEffect(() => {
    setMounted(true)
    updateEventData()

    // Check every minute for event updates (handles midnight refresh)
    const interval = setInterval(updateEventData, 60000)

    return () => clearInterval(interval)
  }, [])

  // Don't render until mounted (avoid hydration issues)
  if (!mounted) {
    return (
      <section className="py-16 bg-racing-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prossima Gara</h2>
            <div className="bg-racing-gray-800 rounded-lg p-8 max-w-2xl mx-auto animate-pulse">
              <div className="h-64 bg-racing-gray-700 rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!nextEvent) {
    return (
      <section className="py-16 bg-racing-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prossima Gara</h2>
            <div className="bg-racing-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-300 mb-4">
                Nessuna gara in programma al momento.
              </p>
              <Button className="bg-racing-red hover:bg-racing-red/90" asChild>
                <Link href="/calendar">Vedi Calendario Completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const colors = championshipColors[nextEvent.eventType]
  const isToday = daysUntil === 0 || isLive
  const isTomorrow = daysUntil === 1

  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-500 ${
      isLive
        ? 'bg-gradient-to-br from-racing-gray-900 via-red-950 to-racing-gray-900'
        : 'bg-racing-gray-900'
    } text-white`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.accent} to-transparent`} />
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${colors.bg}/10 rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${colors.bg}/10 rounded-full blur-3xl`} />
      </div>

      {/* Live Indicator Animation */}
      {isLive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className={`mb-4 text-sm px-4 py-2 ${
            isLive
              ? 'bg-red-600 text-white animate-pulse'
              : isToday
                ? 'bg-green-600 text-white'
                : isTomorrow
                  ? 'bg-yellow-600 text-white'
                  : `${colors.bg} text-white`
          }`}>
            {isLive ? '🔴 LIVE - Gara in Corso!' : isToday ? '🏁 Gara Oggi!' : isTomorrow ? '⏰ Gara Domani!' : 'Prossima Gara'}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prossima Gara
          </h2>
          <p className="text-xl text-racing-gray-300 max-w-2xl mx-auto">
            {isLive
              ? 'Segui il nostro team in pista!'
              : 'Non perdere il nostro prossimo evento di gara'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className={`bg-white text-racing-gray-900 border-0 shadow-2xl overflow-hidden ${
            isLive ? 'ring-4 ring-red-500 ring-opacity-50' : ''
          }`}>
            <div className="md:flex">
              {/* Championship Logo Section */}
              <div className={`md:w-1/2 relative aspect-video md:aspect-auto min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center`}>
                {/* Championship Logo */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={championshipLogos[nextEvent.eventType]}
                    alt={`${nextEvent.eventType} Logo`}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${
                    isLive
                      ? 'bg-red-500 text-white animate-pulse'
                      : nextEvent.status === 'confirmed'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                  }`}>
                    {isLive ? '🔴 LIVE' : nextEvent.status === 'confirmed' ? 'Confermato' : 'In Attesa'}
                  </Badge>
                </div>

                {/* Event Type Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${colors.bg} text-white font-bold`}>
                    {nextEvent.eventType}
                  </Badge>
                </div>

                {/* Series Name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className={`${colors.bg} text-white px-4 py-2 rounded-lg text-center font-bold`}>
                    {nextEvent.series}
                    {'round' in nextEvent && nextEvent.round && ` - Round ${nextEvent.round}`}
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="md:w-1/2 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-racing-gray-900 leading-tight">
                    {nextEvent.venue}
                  </CardTitle>
                  <CardDescription className="text-lg text-racing-gray-600">
                    {nextEvent.dates}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  {/* Countdown */}
                  <div className={`rounded-lg p-6 text-center ${
                    isLive
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-100'
                  }`}>
                    <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                      isLive ? 'text-red-600' : colors.text
                    }`}>
                      {isLive ? 'IN CORSO' : isToday ? 'OGGI' : isTomorrow ? 'DOMANI' : daysUntil}
                    </div>
                    <div className="text-racing-gray-600 font-medium">
                      {isLive
                        ? 'Segui la gara!'
                        : isToday || isTomorrow
                          ? 'Giorno di Gara'
                          : daysUntil === 1
                            ? 'Giorno Rimanente'
                            : 'Giorni Rimanenti'}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                      <div>
                        <div className="font-semibold">{nextEvent.venue}</div>
                        <div className="text-sm text-racing-gray-600">{nextEvent.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                      <div>
                        <div className="font-semibold">Date</div>
                        <div className="text-sm text-racing-gray-600">
                          {nextEvent.dates} • {nextEvent.raceDays} giorni di gara
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Trophy className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                      <div>
                        <div className="font-semibold">Categorie</div>
                        <div className="text-sm text-racing-gray-600">
                          {nextEvent.categories.slice(0, 4).join(', ')}
                          {nextEvent.categories.length > 4 && ` +${nextEvent.categories.length - 4}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Flag className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                      <div>
                        <div className="font-semibold">Campionato</div>
                        <div className="text-sm text-racing-gray-600">
                          {nextEvent.series}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      className={`flex-1 ${colors.bg} hover:opacity-90 text-white`}
                      asChild
                    >
                      <Link href="/calendar">
                        Vedi Calendario Completo
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 border-2 ${colors.text} border-current hover:bg-gray-100`}
                      asChild
                    >
                      <Link href="/calendar">
                        Tutti gli Eventi
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