'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, getMonth, getYear } from 'date-fns'
import { it } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, ExternalLink, Clock, Trophy, Flag } from 'lucide-react'
import { wsk2026Calendar, getSeriesColor, getSeriesBadgeText, type WSKEvent } from '@/data/wsk-2026-calendar'
import { rok2026Calendar, getROKSeriesColor, getROKSeriesBadgeText, type ROKEvent } from '@/data/rok-2026-calendar'
import { iame2026Calendar, getIAMESeriesColor, getIAMESeriesBadgeText, type IAMEEvent } from '@/data/iame-2026-calendar'
import { EventRegistrationModal } from './event-registration-modal'
import Image from 'next/image'

type CalendarEvent = (WSKEvent | ROKEvent | IAMEEvent) & {
  eventType: 'WSK' | 'ROK' | 'IAME'
}

interface MonthGroup {
  monthKey: string
  monthName: string
  year: number
  events: CalendarEvent[]
}

export function CalendarView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'wsk' | 'rok' | 'iame' | 'sms' | 'euro' | 'final' | 'rok-italia' | 'rok-special'>('all')
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Merge all calendars
  const allEvents: CalendarEvent[] = useMemo(() => {
    const wskEvents = wsk2026Calendar.map(event => ({ ...event, eventType: 'WSK' as const }))
    const rokEvents = rok2026Calendar.map(event => ({ ...event, eventType: 'ROK' as const }))
    const iameEvents = iame2026Calendar.map(event => ({ ...event, eventType: 'IAME' as const }))
    return [...wskEvents, ...rokEvents, ...iameEvents]
  }, [])

  const monthGroups = useMemo(() => {
    const filtered = allEvents.filter(event => {
      // Filter by championship type
      if (selectedFilter === 'wsk') {
        return event.eventType === 'WSK'
      }
      if (selectedFilter === 'rok') {
        return event.eventType === 'ROK'
      }
      if (selectedFilter === 'iame') {
        return event.eventType === 'IAME'
      }

      // WSK-specific filters
      if (selectedFilter === 'sms') {
        return event.eventType === 'WSK' && event.series === 'WSK Super Master Series'
      }
      if (selectedFilter === 'euro') {
        return event.eventType === 'WSK' && event.series === 'WSK Euro Series'
      }
      if (selectedFilter === 'final') {
        return event.eventType === 'WSK' && event.series === 'WSK Final Cup'
      }

      // ROK-specific filters
      if (selectedFilter === 'rok-italia') {
        return event.eventType === 'ROK' && event.series === 'ROK Cup Italia'
      }
      if (selectedFilter === 'rok-special') {
        return event.eventType === 'ROK' && (event.series === 'ROK Winter Trophy' || event.series === 'ROK Cup Superfinal' || event.series === 'ROK Cup Festival')
      }

      return true
    })

    const groups: Record<string, MonthGroup> = {}

    filtered.forEach(event => {
      const date = parseISO(event.startDate)
      const month = getMonth(date)
      const year = getYear(date)
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`
      const monthName = format(date, 'MMMM yyyy', { locale: it })

      if (!groups[monthKey]) {
        groups[monthKey] = {
          monthKey,
          monthName,
          year,
          events: [],
        }
      }

      groups[monthKey].events.push(event)
    })

    // Sort events within each month by date
    Object.values(groups).forEach(group => {
      group.events.sort((a, b) =>
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
      )
    })

    // Sort months chronologically
    return Object.values(groups).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
  }, [selectedFilter, allEvents])

  const seriesStats = useMemo(() => {
    return {
      total: allEvents.length,
      wsk: wsk2026Calendar.length,
      rok: rok2026Calendar.length,
      iame: iame2026Calendar.length,
      sms: wsk2026Calendar.filter(e => e.series === 'WSK Super Master Series').length,
      euro: wsk2026Calendar.filter(e => e.series === 'WSK Euro Series').length,
      final: wsk2026Calendar.filter(e => e.series === 'WSK Final Cup').length,
      rokItalia: rok2026Calendar.filter(e => e.series === 'ROK Cup Italia').length,
      rokSpecial: rok2026Calendar.filter(e => e.series === 'ROK Winter Trophy' || e.series === 'ROK Cup Superfinal' || e.series === 'ROK Cup Festival').length,
    }
  }, [allEvents])

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="space-y-4" id="upcoming-events">
        {/* Main Championship Filters */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Tutti gli Eventi ({seriesStats.total})
          </Button>
          <Button
            variant={selectedFilter === 'wsk' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('wsk')}
            className={selectedFilter === 'wsk' ? 'bg-racing-red hover:bg-racing-red/90' : ''}
          >
            WSK Promotion ({seriesStats.wsk})
          </Button>
          <Button
            variant={selectedFilter === 'rok' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('rok')}
            className={selectedFilter === 'rok' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            ROK Cup ({seriesStats.rok})
          </Button>
          <Button
            variant={selectedFilter === 'iame' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('iame')}
            className={selectedFilter === 'iame' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            IAME Euro Series ({seriesStats.iame})
          </Button>
        </div>

        {/* WSK Series Filters */}
        <div className="flex flex-wrap gap-3">
          <span className="text-sm text-racing-gray-600 dark:text-racing-gray-400 flex items-center">
            WSK:
          </span>
          <Button
            variant={selectedFilter === 'sms' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('sms')}
            className={selectedFilter === 'sms' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            size="sm"
          >
            Super Master ({seriesStats.sms})
          </Button>
          <Button
            variant={selectedFilter === 'euro' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('euro')}
            className={selectedFilter === 'euro' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            size="sm"
          >
            Euro Series ({seriesStats.euro})
          </Button>
          <Button
            variant={selectedFilter === 'final' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('final')}
            className={selectedFilter === 'final' ? 'bg-amber-600 hover:bg-amber-700' : ''}
            size="sm"
          >
            Final Cup ({seriesStats.final})
          </Button>
        </div>

        {/* ROK Cup Filters */}
        <div className="flex flex-wrap gap-3">
          <span className="text-sm text-racing-gray-600 dark:text-racing-gray-400 flex items-center">
            ROK:
          </span>
          <Button
            variant={selectedFilter === 'rok-italia' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('rok-italia')}
            className={selectedFilter === 'rok-italia' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            size="sm"
          >
            ROK Cup Italia ({seriesStats.rokItalia})
          </Button>
          <Button
            variant={selectedFilter === 'rok-special' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('rok-special')}
            className={selectedFilter === 'rok-special' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            size="sm"
          >
            Eventi Speciali ({seriesStats.rokSpecial})
          </Button>
        </div>
      </div>

      {/* F1 Style Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-racing-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-racing-gray-200 dark:border-racing-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Title and Stats */}
          <div className="p-8 bg-white dark:bg-racing-gray-900">
            <h2 className="text-4xl font-black text-racing-gray-900 dark:text-white mb-2 uppercase tracking-tight">
              Calendario 2026
            </h2>
            <p className="text-racing-gray-600 dark:text-racing-gray-300 mb-6 text-sm">
              Segui CBK Racing nei principali campionati internazionali
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-racing-gray-100 dark:bg-racing-gray-800 rounded p-3 border-2 border-racing-gray-300 dark:border-racing-gray-600">
                <div className="text-2xl font-black text-racing-gray-900 dark:text-white">{seriesStats.total}</div>
                <div className="text-xs text-racing-gray-600 dark:text-racing-gray-400 uppercase font-bold">Eventi</div>
              </div>
              <div className="bg-racing-red/10 dark:bg-racing-red/20 rounded p-3 border-2 border-racing-red/50 dark:border-racing-red/40">
                <div className="text-2xl font-black text-racing-red">{seriesStats.wsk}</div>
                <div className="text-xs text-racing-gray-600 dark:text-racing-gray-400 uppercase font-bold">WSK</div>
              </div>
              <div className="bg-orange-600/10 dark:bg-orange-600/20 rounded p-3 border-2 border-orange-600/50 dark:border-orange-600/40">
                <div className="text-2xl font-black text-orange-600">{seriesStats.rok}</div>
                <div className="text-xs text-racing-gray-600 dark:text-racing-gray-400 uppercase font-bold">ROK</div>
              </div>
            </div>

            <div className="text-xs text-racing-gray-500 dark:text-racing-gray-500 italic">
              * Pending confirmation by ASN
            </div>
          </div>

          {/* Right Side - Championship Logos */}
          <div className="bg-racing-gray-50 dark:bg-racing-gray-800 p-8 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <Image
                  src="https://www.wskarting.it/assets/img/loghi/wsk_promotion.png"
                  alt="WSK Promotion"
                  width={100}
                  height={100}
                  className="w-24 h-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://italy.rokcup.com/assets/images/logo_rok.png"
                  alt="ROK Cup"
                  width={100}
                  height={100}
                  className="w-24 h-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/iame-euro-series-logo.png"
                  alt="IAME Euro Series"
                  width={120}
                  height={80}
                  className="w-28 h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendar Timeline */}
      <div className="space-y-12">
        <AnimatePresence>
          {monthGroups.map((monthGroup, index) => (
            <motion.div
              key={monthGroup.monthKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-6"
            >
              {/* F1 Style Month Header */}
              <div className="bg-black py-2 px-4 rounded">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  {monthGroup.monthName}
                </h2>
              </div>

              {/* F1 Style Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {monthGroup.events.map((event, eventIndex) => {
                  const bgColor = event.eventType === 'WSK'
                    ? 'bg-racing-red'
                    : event.eventType === 'ROK'
                    ? 'bg-orange-600'
                    : 'bg-[#1877F2]'

                  const borderColor = event.eventType === 'WSK'
                    ? 'border-racing-red'
                    : event.eventType === 'ROK'
                    ? 'border-orange-600'
                    : 'border-[#1877F2]'

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: eventIndex * 0.03 }}
                      className="group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <div className={`bg-white dark:bg-racing-gray-800 rounded-lg overflow-hidden border-2 ${borderColor} shadow-md hover:shadow-2xl transition-all duration-300`}>
                        {/* Top Color Bar */}
                        <div className={`h-1.5 ${bgColor}`} />

                        <div className="p-4">
                          {/* Round Number & Date Row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${bgColor} text-white px-3 py-1 rounded font-black text-base`}>
                              {event.round ? `R${event.round}` : event.eventType}
                            </div>
                            <div className="text-right">
                              <div className="text-base font-black text-racing-gray-900 dark:text-white uppercase">
                                {format(parseISO(event.startDate), 'd')}-{format(parseISO(event.endDate), 'd')} {format(parseISO(event.startDate), 'MMM', { locale: it }).toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Event Title with Logo */}
                          <div className="flex items-center gap-2 mb-2">
                            {event.eventType === 'WSK' && (
                              <Image
                                src="https://www.wskarting.it/assets/img/loghi/wsk_promotion.png"
                                alt="WSK"
                                width={48}
                                height={48}
                                className="w-10 h-10 object-contain flex-shrink-0"
                              />
                            )}
                            {event.eventType === 'ROK' && (
                              <Image
                                src="https://italy.rokcup.com/assets/images/logo_rok.png"
                                alt="ROK"
                                width={48}
                                height={48}
                                className="w-10 h-10 object-contain flex-shrink-0"
                              />
                            )}
                            {event.eventType === 'IAME' && (
                              <Image
                                src="/images/iame-euro-series-logo.png"
                                alt="IAME"
                                width={48}
                                height={48}
                                className="w-12 h-10 object-contain flex-shrink-0"
                              />
                            )}
                            <h3 className="font-black text-sm text-racing-gray-900 dark:text-white uppercase leading-tight">
                              {event.series}
                            </h3>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-xs text-racing-gray-600 dark:text-racing-gray-400 mb-3">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-semibold">{event.venue}</span>
                            <span className="text-racing-gray-400">•</span>
                            <span>{event.location}</span>
                          </div>

                          {/* Categories - Compact */}
                          <div className="flex flex-wrap gap-1.5">
                            {event.categories.slice(0, 3).map((category) => (
                              <span
                                key={category}
                                className="text-[10px] font-bold bg-racing-gray-100 dark:bg-racing-gray-700 text-racing-gray-700 dark:text-racing-gray-300 px-2 py-0.5 rounded uppercase"
                              >
                                {category}
                              </span>
                            ))}
                            {event.categories.length > 3 && (
                              <span className="text-[10px] font-bold text-racing-gray-500">
                                +{event.categories.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className={`${bgColor} px-4 py-2 flex items-center justify-between`}>
                          <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                            {event.eventType}
                          </Badge>
                          <Button
                            size="sm"
                            className="bg-white text-racing-gray-900 hover:bg-racing-gray-100 font-bold text-xs px-3 py-1"
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsRegistrationModalOpen(true)
                            }}
                          >
                            ISCRIVITI
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {monthGroups.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-racing-gray-300 dark:text-racing-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-racing-gray-600 dark:text-racing-gray-400 mb-2">
              Nessun evento trovato
            </h3>
            <p className="text-racing-gray-500 dark:text-racing-gray-500">
              {selectedFilter !== 'all'
                ? 'Prova a modificare il filtro per vedere più eventi.'
                : 'Controlla più tardi per i prossimi eventi di gara!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Event Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          event={{
            series: selectedEvent.series,
            round: selectedEvent.round,
            dates: selectedEvent.dates,
            venue: selectedEvent.venue,
            location: selectedEvent.location,
          }}
        />
      )}
    </div>
  )
}
