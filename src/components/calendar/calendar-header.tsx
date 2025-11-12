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
    <section className="relative bg-gradient-to-br from-racing-gray-900 via-racing-gray-800 to-racing-red/20 text-white py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-racing-red/90 text-white text-sm px-4 py-2 font-semibold mb-6">
              Calendario Gare 2026
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 racing-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Calendario Gare WSK 2026
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-racing-gray-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Segui CBK Racing in tutti gli eventi WSK 2026: Super Master Series, Euro Series e Final Cup.
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
              className="bg-racing-red hover:bg-racing-red/90 text-white font-semibold px-8 py-4 h-14 text-lg group"
              disabled
            >
              <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Aggiungi al Calendario
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-racing-gray-900 font-semibold px-8 py-4 h-14 text-lg"
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
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-racing-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">5</div>
              <div className="text-sm text-racing-gray-300">Round Super Master</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">3</div>
              <div className="text-sm text-racing-gray-300">Round Euro Series</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">3</div>
              <div className="text-sm text-racing-gray-300">Round Final Cup</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">12</div>
              <div className="text-sm text-racing-gray-300">Eventi Totali</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}