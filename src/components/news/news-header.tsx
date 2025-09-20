'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Rss, Search } from 'lucide-react'

export function NewsHeader() {
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
              Racing Journalism
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 racing-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Latest News
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-racing-gray-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay updated with the latest racing news, results, team updates, and behind-the-scenes stories
            from the world of CBK Racing.
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
              <a href="#latest-news">
                <Newspaper className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Browse Articles
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-racing-gray-900 font-semibold px-8 py-4 h-14 text-lg"
              asChild
            >
              <a href="/rss" target="_blank">
                <Rss className="w-5 h-5 mr-2" />
                RSS Feed
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
              <div className="text-3xl font-bold text-racing-red">50+</div>
              <div className="text-sm text-racing-gray-300">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">5</div>
              <div className="text-sm text-racing-gray-300">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">1.2K</div>
              <div className="text-sm text-racing-gray-300">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-racing-red">24/7</div>
              <div className="text-sm text-racing-gray-300">Coverage</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}