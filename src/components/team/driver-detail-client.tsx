'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Driver } from '@/lib/types'
import { getMediaUrl } from '@/lib/api-utils'
import { Lightbox } from '@/components/ui/lightbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Trophy,
  MapPin,
  Calendar,
  Flag,
  Star,
  Target,
  TrendingUp,
  Award,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  ArrowLeft,
  ExternalLink,
  Clock,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxImage {
  id: number
  url: string
  thumb?: string
  alt?: string
  caption?: string
}

interface AggregatedStats {
  totalRaces: number
  wins: number
  podiums: number
  championships: number
  bestLapTime: string
  winRate: string
  podiumRate: string
  averagePosition: string
}

interface BioSection {
  title: string
  content: string
}

interface SocialLink {
  platform: string
  url: string
  handle: string
}

interface DriverDetailClientProps {
  driver: Driver
  lightboxImages: LightboxImage[]
  aggregatedStats: AggregatedStats
  achievements: string[]
  socialLinks: SocialLink[]
  bioSections: BioSection[]
}

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  website: Globe,
}

export function DriverDetailClient({
  driver,
  lightboxImages,
  aggregatedStats,
  achievements,
  socialLinks,
  bioSections,
}: DriverDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-racing-gray-50 pt-24"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button variant="ghost" asChild className="text-racing-gray-600 hover:text-racing-red">
            <Link href="/team">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Driver Photo */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image
                  src={getMediaUrl(driver.photos?.[0], '/images/driver-placeholder.jpg')}
                  alt={`${driver.full_name} - CBK Racing driver`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />

                {/* Racing Number Overlay */}
                <div className="absolute top-4 left-4">
                  <div className="bg-racing-red text-white font-bold text-3xl px-6 py-3 rounded-lg shadow-lg">
                    #{driver.racing_number}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {driver.is_team_member && (
                    <Badge className="bg-blue-500 text-white">Team Member</Badge>
                  )}
                  {driver.is_professional && (
                    <Badge className="bg-racing-red text-white">Professional</Badge>
                  )}
                  <Badge variant="outline" className="bg-white/90 text-racing-gray-900">
                    {driver.category}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Driver Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-racing-gray-900 mb-4">
                  {driver.full_name}
                </h1>
                <p className="text-xl text-racing-gray-600 mb-6">
                  Professional Karting Driver • {driver.category} Category
                </p>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <Trophy className="w-6 h-6 text-racing-red mx-auto mb-2" />
                    <div className="text-2xl font-bold text-racing-gray-900">{aggregatedStats.wins}</div>
                    <div className="text-sm text-racing-gray-600">Wins</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <Star className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-racing-gray-900">{aggregatedStats.podiums}</div>
                    <div className="text-sm text-racing-gray-600">Podiums</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-racing-gray-900">{aggregatedStats.championships}</div>
                    <div className="text-sm text-racing-gray-600">Championships</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <Flag className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-racing-gray-900">{aggregatedStats.totalRaces}</div>
                    <div className="text-sm text-racing-gray-600">Races</div>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <MapPin className="w-5 h-5 text-racing-red" />
                      <span>{driver.profile.nationality}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <Calendar className="w-5 h-5 text-racing-red" />
                      <span>{driver.profile.age} years old</span>
                    </div>
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <Flag className="w-5 h-5 text-racing-red" />
                      <span>{driver.profile.hometown}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <Star className="w-5 h-5 text-racing-red" />
                      <span>{driver.profile.years_experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <Clock className="w-5 h-5 text-racing-red" />
                      <span>Best: {aggregatedStats.bestLapTime}s</span>
                    </div>
                    <div className="flex items-center space-x-3 text-racing-gray-700">
                      <TrendingUp className="w-5 h-5 text-racing-red" />
                      <span>{aggregatedStats.winRate}% win rate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = socialIcons[social.platform as keyof typeof socialIcons]
                  if (!IconComponent) return null

                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-racing-gray-100 text-racing-gray-600 hover:bg-racing-red hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Follow on ${social.platform}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="bio" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bio">Biography</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            {/* Biography Tab */}
            <TabsContent value="bio" className="space-y-6">
              {bioSections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-racing-gray-900">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-racing-gray-700 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-racing-red" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-racing-gray-600">Win Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-racing-gray-200 rounded-full h-2">
                          <div
                            className="bg-racing-red h-2 rounded-full"
                            style={{ width: `${Math.min(100, parseFloat(aggregatedStats.winRate))}%` }}
                          />
                        </div>
                        <span className="font-semibold">{aggregatedStats.winRate}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-racing-gray-600">Podium Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-racing-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, parseFloat(aggregatedStats.podiumRate))}%` }}
                          />
                        </div>
                        <span className="font-semibold">{aggregatedStats.podiumRate}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-racing-gray-600">Average Position</span>
                      <span className="font-semibold">{aggregatedStats.averagePosition}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-racing-gray-600">Best Lap Time</span>
                      <span className="font-semibold font-mono">{aggregatedStats.bestLapTime}s</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Career Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-racing-red" />
                      <span>Career Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-racing-gray-900">{aggregatedStats.totalRaces}</div>
                        <div className="text-sm text-racing-gray-600">Total Races</div>
                      </div>
                      <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-racing-red">{aggregatedStats.wins}</div>
                        <div className="text-sm text-racing-gray-600">Victories</div>
                      </div>
                      <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{aggregatedStats.podiums}</div>
                        <div className="text-sm text-racing-gray-600">Podiums</div>
                      </div>
                      <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">{aggregatedStats.championships}</div>
                        <div className="text-sm text-racing-gray-600">Titles</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-racing-red" />
                    <span>Career Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-4 bg-racing-gray-50 rounded-lg"
                        >
                          <Trophy className="w-5 h-5 text-racing-red flex-shrink-0" />
                          <span className="text-racing-gray-900">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-racing-gray-600 text-center py-8">
                      Career achievements are being updated. Check back soon for the latest accomplishments.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  {lightboxImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {lightboxImages.map((image, index) => (
                        <motion.button
                          key={image.id}
                          onClick={() => openLightbox(index)}
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image
                            src={image.thumb || image.url}
                            alt={image.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-racing-gray-600 text-center py-8">
                      Gallery photos are being updated. Check back soon for more images.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={`${driver.full_name} - Gallery`}
        showThumbnails={true}
        showControls={true}
        allowDownload={false}
        allowShare={true}
      />
    </motion.div>
  )
}