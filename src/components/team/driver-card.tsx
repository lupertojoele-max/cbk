'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Driver } from '@/lib/types'
import { getMediaUrl } from '@/lib/api-utils'
import { cn } from '@/lib/utils'
import {
  Trophy,
  MapPin,
  Calendar,
  Flag,
  Star,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  ArrowRight,
} from 'lucide-react'

interface DriverCardProps {
  driver: Driver
  index: number
}

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  website: Globe,
}

export function DriverCard({ driver, index }: DriverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock social media data - in real app this would come from API
  const socialLinks = [
    { platform: 'instagram', url: '#', handle: '@driver_insta' },
    { platform: 'twitter', url: '#', handle: '@driver_twitter' },
  ]

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  }

  const imageVariants = {
    rest: {
      scale: 1,
      filter: 'grayscale(0%)',
    },
    hover: {
      scale: 1.1,
      filter: 'grayscale(0%)',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  const overlayVariants = {
    rest: {
      opacity: 0,
      y: 20,
    },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
        {/* Driver Photo */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.div
            variants={imageVariants}
            initial="rest"
            whileHover="hover"
            className="relative w-full h-full"
          >
            <Image
              src={getMediaUrl(driver.photos?.[0], '/images/driver-placeholder.jpg')}
              alt={`${driver.full_name} - CBK Racing driver`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          {/* Racing Number */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-racing-red text-white font-bold text-2xl px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
              #{driver.racing_number}
            </div>
          </motion.div>

          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {driver.is_team_member && (
              <Badge className="bg-blue-500 text-white shadow-lg">
                Team Member
              </Badge>
            )}
            {driver.is_professional && (
              <Badge className="bg-racing-red text-white shadow-lg">
                Professional
              </Badge>
            )}
            <Badge variant="outline" className="bg-white/90 text-racing-gray-900 shadow-lg">
              {driver.category}
            </Badge>
          </div>

          {/* Hover Overlay with Quick Stats */}
          <motion.div
            variants={overlayVariants}
            initial="rest"
            animate={isHovered ? 'hover' : 'rest'}
            className="absolute inset-0 bg-racing-red/90 flex items-center justify-center"
          >
            <div className="text-center text-white p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold">{driver.statistics.wins}</div>
                  <div className="text-sm opacity-90">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{driver.statistics.podiums}</div>
                  <div className="text-sm opacity-90">Podiums</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{driver.statistics.championships}</div>
                  <div className="text-sm opacity-90">Titles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{driver.statistics.total_races}</div>
                  <div className="text-sm opacity-90">Races</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-racing-red"
                asChild
              >
                <Link href={`/team/${driver.slug}`}>
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Driver Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.div
              animate={{
                y: isHovered ? -20 : 0,
                opacity: isHovered ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">{driver.full_name}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{driver.profile.nationality}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{driver.profile.age} years old</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flag className="w-4 h-4" />
                  <span>{driver.profile.hometown}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>{driver.profile.years_experience} years experience</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors">
                <Link href={`/team/${driver.slug}`} className="hover:underline">
                  {driver.full_name}
                </Link>
              </h4>
              <p className="text-racing-gray-600">
                {driver.profile.nationality} • {driver.category}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-racing-red">#{driver.racing_number}</div>
            </div>
          </div>

          {/* Performance Highlights */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-racing-gray-50 rounded-lg">
              <Trophy className="w-5 h-5 text-racing-red mx-auto mb-1" />
              <div className="font-bold text-racing-gray-900">{driver.statistics.wins}</div>
              <div className="text-xs text-racing-gray-600">Wins</div>
            </div>
            <div className="text-center p-3 bg-racing-gray-50 rounded-lg">
              <Star className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="font-bold text-racing-gray-900">{driver.statistics.podiums}</div>
              <div className="text-xs text-racing-gray-600">Podiums</div>
            </div>
            <div className="text-center p-3 bg-racing-gray-50 rounded-lg">
              <Flag className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-racing-gray-900">{driver.statistics.championships}</div>
              <div className="text-xs text-racing-gray-600">Titles</div>
            </div>
          </div>

          {/* Best Lap Time */}
          <div className="bg-racing-red/10 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-racing-gray-600">Best Lap Time</span>
              <span className="font-mono font-bold text-racing-red">{driver.statistics.best_lap_time}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => {
                const IconComponent = socialIcons[social.platform as keyof typeof socialIcons]
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-racing-gray-100 text-racing-gray-600 hover:bg-racing-red hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Follow on ${social.platform}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </motion.a>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="group-hover:border-racing-red group-hover:text-racing-red transition-colors"
              asChild
            >
              <Link href={`/team/${driver.slug}`}>
                View Profile
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Experience Indicator */}
          <div className="mt-4 pt-4 border-t border-racing-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-racing-gray-600">Experience</span>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.min(5, Math.floor(driver.profile.years_experience / 3))
                          ? 'text-yellow-400 fill-current'
                          : 'text-racing-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-racing-gray-900 font-medium">
                  {driver.profile.years_experience} years
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}