'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react'

export function ContactHeader() {
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
              Get In Touch
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 racing-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Contact CBK Racing
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-racing-gray-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have questions about our racing team? Want to get involved or learn more about CBK Racing?
            We&apos;d love to hear from you.
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
              className="bg-racing-red hover:bg-racing-red/90 text-white font-semibold px-8 py-4 h-14 text-lg group"
              asChild
            >
              <a href="#contact-form">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Send Message
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-racing-gray-900 font-semibold px-8 py-4 h-14 text-lg"
              asChild
            >
              <a href="mailto:info@cbkracing.com">
                <Mail className="w-5 h-5 mr-2" />
                Direct Email
              </a>
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-racing-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <Mail className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-lg font-semibold">Email</div>
              <div className="text-sm text-racing-gray-300">info@cbkracing.com</div>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-lg font-semibold">Phone</div>
              <div className="text-sm text-racing-gray-300">+1 (555) 123-KART</div>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-lg font-semibold">Location</div>
              <div className="text-sm text-racing-gray-300">Racing Complex, USA</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}