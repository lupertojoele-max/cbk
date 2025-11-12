'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, getMonth, getYear } from 'date-fns'
import { it } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, ExternalLink, Clock, Trophy, Flag } from 'lucide-react'
import { wsk2026Calendar, getSeriesColor, getSeriesBadgeText, type WSKEvent } from '@/data/wsk-2026-calendar'
import Image from 'next/image'

interface MonthGroup {
  monthKey: string
  monthName: string
  year: number
  events: WSKEvent[]
}

export function CalendarView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sms' | 'euro' | 'final'>('all')

  const monthGroups = useMemo(() => {
    const filtered = wsk2026Calendar.filter(event => {
      if (selectedFilter === 'sms') {
        return event.series === 'WSK Super Master Series'
      }
      if (selectedFilter === 'euro') {
        return event.series === 'WSK Euro Series'
      }
      if (selectedFilter === 'final') {
        return event.series === 'WSK Final Cup'
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
  }, [selectedFilter])

  const seriesStats = useMemo(() => {
    return {
      sms: wsk2026Calendar.filter(e => e.series === 'WSK Super Master Series').length,
      euro: wsk2026Calendar.filter(e => e.series === 'WSK Euro Series').length,
      final: wsk2026Calendar.filter(e => e.series === 'WSK Final Cup').length,
      test: wsk2026Calendar.filter(e => e.series === 'WSK Official Test').length,
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3" id="upcoming-events">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          className={selectedFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Tutti gli Eventi ({wsk2026Calendar.length})
        </Button>
        <Button
          variant={selectedFilter === 'sms' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('sms')}
          className={selectedFilter === 'sms' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Super Master Series ({seriesStats.sms})
        </Button>
        <Button
          variant={selectedFilter === 'euro' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('euro')}
          className={selectedFilter === 'euro' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Euro Series ({seriesStats.euro})
        </Button>
        <Button
          variant={selectedFilter === 'final' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('final')}
          className={selectedFilter === 'final' ? 'bg-amber-600 hover:bg-amber-700' : ''}
        >
          Final Cup ({seriesStats.final})
        </Button>
      </div>

      {/* Series Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              src="https://www.wskarting.it/assets/img/loghi/wsk_promotion.png"
              alt="WSK Promotion Logo"
              width={80}
              height={80}
              className="w-20 h-auto"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-racing-gray-900 dark:text-white mb-2">
              Calendario WSK 2026
            </h3>
            <p className="text-racing-gray-700 dark:text-racing-gray-300 mb-4">
              Segui CBK Racing nei principali campionati WSK 2026. Calendario completo con tutte le gare,
              test collettivi e categorie (MINI, OKNJ, OKN, OKJ, OK, KZ2).
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-racing-gray-600 dark:text-racing-gray-400" />
                <span className="font-semibold text-racing-gray-900 dark:text-white">
                  {wsk2026Calendar.length} Eventi Totali
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-racing-gray-600 dark:text-racing-gray-400" />
                <span className="text-racing-gray-700 dark:text-racing-gray-300">
                  Circuiti: La Conca, Sarno, Viterbo, Lonato, Franciacorta, Cremona
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-racing-gray-500 dark:text-racing-gray-500 italic">
              * Pending confirmation by ASN
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
              {/* Sticky Month Header */}
              <div className="sticky top-20 z-10 bg-white/95 dark:bg-racing-gray-900/95 backdrop-blur-sm border-b border-racing-gray-200 dark:border-racing-gray-700 py-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-racing-gray-900 dark:text-white flex items-center gap-3 capitalize">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    {monthGroup.monthName}
                  </h2>
                  <Badge variant="outline" className="text-racing-gray-600 dark:text-racing-gray-400">
                    {monthGroup.events.length} event{monthGroup.events.length !== 1 ? 'i' : 'o'}
                  </Badge>
                </div>
              </div>

              {/* Events for this month */}
              <div className="space-y-4">
                {monthGroup.events.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: eventIndex * 0.05 }}
                    className="bg-white dark:bg-racing-gray-800 rounded-lg shadow-sm border border-racing-gray-200 dark:border-racing-gray-700 hover:shadow-md transition-all duration-200 hover:border-blue-600/50"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Date Display */}
                        <div className="flex-shrink-0">
                          <div className="bg-blue-600/10 dark:bg-blue-600/20 rounded-lg p-4 text-center min-w-[100px]">
                            <div className="text-2xl font-bold text-blue-600">
                              {format(parseISO(event.startDate), 'd')}-{format(parseISO(event.endDate), 'd')}
                            </div>
                            <div className="text-xs font-medium text-racing-gray-600 dark:text-racing-gray-400 uppercase">
                              {format(parseISO(event.startDate), 'MMM yyyy', { locale: it })}
                            </div>
                            <div className="text-xs text-racing-gray-500 dark:text-racing-gray-500 mt-1">
                              {event.raceDays} giorni
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-start gap-2">
                            <h3 className="text-xl font-semibold text-racing-gray-900 dark:text-white flex-1">
                              {event.series}
                              {event.round && ` - Round ${event.round}`}
                            </h3>
                            <div className="flex gap-2">
                              <Badge className={getSeriesColor(event.series)}>
                                {getSeriesBadgeText(event.series, event.round)}
                              </Badge>
                              {event.status === 'pending' && (
                                <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-700">
                                  Da Confermare
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-racing-gray-600 dark:text-racing-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="font-medium">{event.venue}</span>
                              <span className="text-racing-gray-500">• {event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.dates}</span>
                            </div>
                          </div>

                          {/* Categories */}
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-medium text-racing-gray-500 dark:text-racing-gray-500">
                              Categorie:
                            </span>
                            {event.categories.map((category) => (
                              <Badge
                                key={category}
                                variant="outline"
                                className="text-xs bg-racing-gray-50 dark:bg-racing-gray-700 border-racing-gray-300 dark:border-racing-gray-600"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>

                          {/* Additional Info */}
                          <div className="text-xs text-racing-gray-500 dark:text-racing-gray-500 pt-2 border-t border-racing-gray-100 dark:border-racing-gray-700">
                            {event.series.includes('Euro') ? (
                              <span>📅 Mer/Sab • 4 giorni di gara</span>
                            ) : event.series.includes('Test') ? (
                              <span>🔧 Test collettivi ufficiali</span>
                            ) : (
                              <span>📅 Mer/Dom • 5 giorni di gara</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full lg:w-auto"
                            disabled
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Info Evento
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
    </div>
  )
}
