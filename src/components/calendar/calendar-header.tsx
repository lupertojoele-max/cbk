'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Download } from 'lucide-react'

export function CalendarHeader() {
  const handleDownloadICS = () => {
    // Direct link to backend ICS endpoint
    window.open('/api/v1/calendar.ics', '_blank')
  }

  return (
    <section className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white pt-32 pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 racing-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Calendario Gare 2026
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Segui CBK Racing nei principali campionati 2026: WSK Promotion e ROK Cup Italia.
            Non perdere un solo momento emozionante in pista.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleDownloadICS}
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4 h-14 text-lg group shadow-lg"
            >
              <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Aggiungi al Calendario
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/80 bg-transparent text-white hover:bg-white/10 font-semibold px-8 py-4 h-14 text-lg backdrop-blur-sm"
              asChild
            >
              <a href="#upcoming-events">
                <CalendarDays className="w-5 h-5 mr-2" />
                Vedi Programma
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-sm text-white/80">Eventi WSK</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">11</div>
              <div className="text-sm text-white/80">Eventi ROK Cup</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-sm text-white/80">Circuiti Italiani</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">23</div>
              <div className="text-sm text-white/80">Eventi Totali</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}