import { Suspense } from 'react'
import { Metadata } from 'next'
import { CalendarView } from '@/components/calendar/calendar-view'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { CalendarSkeleton } from '@/components/calendar/calendar-skeleton'

export const metadata: Metadata = {
  title: 'Racing Calendar | CBK Racing',
  description: 'View all upcoming CBK Racing events, championships, and race schedules. Add events to your personal calendar with our ICS export.',
  keywords: ['racing calendar', 'CBK Racing events', 'championship schedule', 'motorsport calendar'],
}

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-racing-gray-50">
      {/* Header */}
      <CalendarHeader />

      {/* Calendar Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarView />
        </Suspense>
      </main>
    </div>
  )
}