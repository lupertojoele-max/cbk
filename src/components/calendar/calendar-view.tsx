'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, getMonth, getYear, isAfter, isBefore, addMonths } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, ExternalLink, Clock } from 'lucide-react'
import { getEvents } from '@/lib/api'
import { Event } from '@/lib/types'

interface MonthGroup {
  monthKey: string
  monthName: string
  year: number
  events: Event[]
}

export function CalendarView() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'championships'>('all')

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await getEvents({ per_page: 100 })
        setEvents(response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const monthGroups = useMemo(() => {
    const filtered = events.filter(event => {
      if (selectedFilter === 'upcoming') {
        return event.schedule.is_upcoming
      }
      if (selectedFilter === 'championships') {
        return event.type.toLowerCase().includes('championship')
      }
      return true
    })

    const groups: Record<string, MonthGroup> = {}

    filtered.forEach(event => {
      const date = parseISO(event.schedule.event_date)
      const month = getMonth(date)
      const year = getYear(date)
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`
      const monthName = format(date, 'MMMM yyyy')

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
        parseISO(a.schedule.event_date).getTime() - parseISO(b.schedule.event_date).getTime()
      )
    })

    // Sort months chronologically
    return Object.values(groups).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
  }, [events, selectedFilter])

  const getEventStatusColor = (event: Event) => {
    if (event.schedule.is_upcoming) {
      return 'bg-blue-100 text-blue-800'
    }
    if (event.status === 'completed') {
      return 'bg-green-100 text-green-800'
    }
    if (event.status === 'cancelled') {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-racing-gray-100 text-racing-gray-800'
  }

  const getEventTypeColor = (type: string) => {
    if (type.toLowerCase().includes('championship')) {
      return 'bg-racing-red text-white'
    }
    if (type.toLowerCase().includes('practice')) {
      return 'bg-racing-gray-600 text-white'
    }
    return 'bg-racing-gray-500 text-white'
  }

  if (loading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-6">
            <div className="h-12 bg-racing-gray-200 rounded animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-32 bg-racing-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3" id="upcoming-events">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          className={selectedFilter === 'all' ? 'bg-racing-red hover:bg-racing-red/90' : ''}
        >
          All Events ({events.length})
        </Button>
        <Button
          variant={selectedFilter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('upcoming')}
          className={selectedFilter === 'upcoming' ? 'bg-racing-red hover:bg-racing-red/90' : ''}
        >
          Upcoming ({events.filter(e => e.schedule.is_upcoming).length})
        </Button>
        <Button
          variant={selectedFilter === 'championships' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('championships')}
          className={selectedFilter === 'championships' ? 'bg-racing-red hover:bg-racing-red/90' : ''}
        >
          Championships ({events.filter(e => e.type.toLowerCase().includes('championship')).length})
        </Button>
      </div>

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
              <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-sm border-b border-racing-gray-200 py-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-racing-gray-900 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-racing-red" />
                    {monthGroup.monthName}
                  </h2>
                  <Badge variant="outline" className="text-racing-gray-600">
                    {monthGroup.events.length} event{monthGroup.events.length !== 1 ? 's' : ''}
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
                    className="bg-white rounded-lg shadow-sm border border-racing-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Date Display */}
                        <div className="flex-shrink-0">
                          <div className="bg-racing-red/10 rounded-lg p-4 text-center min-w-[80px]">
                            <div className="text-2xl font-bold text-racing-red">
                              {format(parseISO(event.schedule.event_date), 'd')}
                            </div>
                            <div className="text-xs font-medium text-racing-gray-600 uppercase">
                              {format(parseISO(event.schedule.event_date), 'MMM')}
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-start gap-2">
                            <h3 className="text-xl font-semibold text-racing-gray-900 flex-1">
                              {event.name}
                            </h3>
                            <div className="flex gap-2">
                              <Badge className={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                              <Badge variant="outline" className={getEventStatusColor(event)}>
                                {event.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-racing-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.track.name}, {event.track.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{format(parseISO(event.schedule.event_date), 'HH:mm')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.participants.registered}/{event.participants.max_capacity} participants</span>
                            </div>
                          </div>

                          {event.schedule.days_until !== undefined && event.schedule.is_upcoming && (
                            <div className="text-sm text-racing-red font-medium">
                              {event.schedule.days_until === 0
                                ? 'Today!'
                                : event.schedule.days_until === 1
                                ? 'Tomorrow'
                                : `In ${event.schedule.days_until} days`
                              }
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="outline"
                            className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                            asChild
                          >
                            <a href={`/events/${event.slug}`}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </a>
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
            <Calendar className="w-16 h-16 text-racing-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-racing-gray-600 mb-2">No events found</h3>
            <p className="text-racing-gray-500">
              {selectedFilter !== 'all'
                ? 'Try adjusting your filter to see more events.'
                : 'Check back soon for upcoming racing events!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}