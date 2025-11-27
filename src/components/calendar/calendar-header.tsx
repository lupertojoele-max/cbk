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
    <section className="relative bg-black text-white pt-32 pb-16 overflow-hidden">
      {/* Red Racing Stripes */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-racing-red via-red-600 to-racing-red" />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-5" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white">Calendario</span>{' '}
            <span className="text-racing-red">2026</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg text-racing-gray-300 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Segui CBK Racing nei principali campionati internazionali: WSK Promotion, ROK Cup Italia e IAME Euro Series.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleDownloadICS}
              className="bg-racing-red text-white hover:bg-red-700 font-bold px-8 py-4 h-14 text-base group shadow-lg uppercase"
            >
              <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Scarica Calendario
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white font-bold px-8 py-4 h-14 text-base backdrop-blur-sm uppercase"
              asChild
            >
              <a href="#upcoming-events">
                <CalendarDays className="w-5 h-5 mr-2" />
                Vedi Programma
              </a>
            </Button>
          </motion.div>

          {/* F1 Style Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-racing-red/20 backdrop-blur-sm rounded border border-racing-red/40 p-4">
              <div className="text-4xl font-black text-racing-red">12</div>
              <div className="text-xs text-racing-gray-400 uppercase font-bold">WSK</div>
            </div>
            <div className="bg-orange-600/20 backdrop-blur-sm rounded border border-orange-600/40 p-4">
              <div className="text-4xl font-black text-orange-600">11</div>
              <div className="text-xs text-racing-gray-400 uppercase font-bold">ROK Cup</div>
            </div>
            <div className="bg-[#1877F2]/20 backdrop-blur-sm rounded border border-[#1877F2]/40 p-4">
              <div className="text-4xl font-black text-[#1877F2]">4</div>
              <div className="text-xs text-racing-gray-400 uppercase font-bold">IAME</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded border border-white/30 p-4">
              <div className="text-4xl font-black text-white">27</div>
              <div className="text-xs text-racing-gray-400 uppercase font-bold">Totali</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}