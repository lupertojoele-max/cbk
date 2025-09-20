'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/api-utils'
import { Kart } from '@/lib/types'
import { Zap, Trophy, Settings, Eye, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KartCardProps {
  kart: Kart
  priority?: boolean
}

export function KartCard({ kart, priority = false }: KartCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const conditionColor = {
    'Excellent': 'bg-green-500',
    'Good': 'bg-blue-500',
    'Fair': 'bg-yellow-500',
    'Maintenance': 'bg-orange-500',
  }[kart.condition] || 'bg-gray-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white">
        {/* Image Container with Parallax Effect */}
        <div className="relative aspect-video overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -8 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={getMediaUrl(kart.gallery?.[0], '/images/kart-placeholder.jpg')}
              alt={`${kart.name} go-kart`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge
              className={cn(
                'text-white border-0 shadow-lg',
                kart.is_available ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {kart.is_available ? 'Available' : 'In Use'}
            </Badge>

            <Badge
              className={cn('text-white border-0 shadow-lg', conditionColor)}
            >
              {kart.condition}
            </Badge>
          </div>

          {/* Kart Number */}
          <motion.div
            className="absolute top-3 right-3"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-racing-red text-white font-bold text-xl px-4 py-2 rounded-lg shadow-lg">
              #{kart.number}
            </div>
          </motion.div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-white/90 text-racing-gray-900 border-racing-gray-300 shadow-lg">
              {kart.category}
            </Badge>
          </div>

          {/* Quick View Button */}
          <motion.div
            className="absolute bottom-3 right-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              size="sm"
              className="bg-white text-racing-gray-900 hover:bg-racing-red hover:text-white shadow-lg"
              asChild
            >
              <Link href={`/karts/${kart.slug}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Card Content */}
        <motion.div
          animate={{
            y: isHovered ? -4 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-tight">
                  <Link href={`/karts/${kart.slug}`} className="hover:underline">
                    {kart.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-racing-gray-600 mt-1">
                  {kart.specifications.brand} {kart.specifications.model}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Key Specifications */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <motion.div
                className="flex items-center space-x-2 p-2 rounded-lg bg-racing-gray-50 group-hover:bg-yellow-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.specifications.max_speed_kmh}
                  </div>
                  <div className="text-racing-gray-500 text-xs">km/h</div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 p-2 rounded-lg bg-racing-gray-50 group-hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Trophy className="w-4 h-4 text-racing-red flex-shrink-0" />
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.performance.wins}
                  </div>
                  <div className="text-racing-gray-500 text-xs">wins</div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 p-2 rounded-lg bg-racing-gray-50 group-hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Settings className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.specifications.year_manufactured}
                  </div>
                  <div className="text-racing-gray-500 text-xs">year</div>
                </div>
              </motion.div>
            </div>

            {/* Performance Summary */}
            <div className="bg-racing-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.performance.total_races}
                  </div>
                  <div className="text-racing-gray-500 text-xs">Races</div>
                </div>
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.performance.podiums}
                  </div>
                  <div className="text-racing-gray-500 text-xs">Podiums</div>
                </div>
                <div>
                  <div className="font-semibold text-racing-gray-900">
                    {kart.performance.best_lap_time}s
                  </div>
                  <div className="text-racing-gray-500 text-xs">Best Lap</div>
                </div>
              </div>
            </div>

            {/* Engine & Maintenance Info */}
            <div className="space-y-2 text-sm text-racing-gray-600">
              <div className="flex items-center justify-between">
                <span>Engine:</span>
                <span className="font-medium">
                  {kart.specifications.engine_brand}
                  {kart.specifications.engine_model && ` ${kart.specifications.engine_model}`}
                </span>
              </div>

              {kart.maintenance?.next_service && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Next Service:
                  </span>
                  <span className="font-medium">
                    {new Date(kart.maintenance.next_service).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full group-hover:bg-racing-red group-hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                variant="outline"
                asChild
              >
                <Link href={`/karts/${kart.slug}`}>
                  View Full Details
                  <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{
                      x: isHovered ? 4 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  )
}