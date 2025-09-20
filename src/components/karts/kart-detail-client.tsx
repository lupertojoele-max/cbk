'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lightbox } from '@/components/ui/lightbox'
import { Kart } from '@/lib/types'
import { getMediaUrl } from '@/lib/api-utils'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Gallery,
  FileText,
  Download,
  Share2,
  Calendar,
  Zap,
  Trophy,
  Settings,
  Eye,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Gauge,
  Weight,
  Cog,
  Award,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface LightboxImage {
  id: number
  url: string
  thumb?: string
  alt?: string
  caption?: string
}

interface SpecificationItem {
  label: string
  value: string
}

interface SpecificationCategory {
  category: string
  items: SpecificationItem[]
}

interface DownloadItem {
  id: number
  name: string
  description: string
  type: string
  size: string
  icon: string
  url: string
}

interface KartDetailClientProps {
  kart: Kart
  lightboxImages: LightboxImage[]
  specificationsData: SpecificationCategory[]
  downloads: DownloadItem[]
}

export function KartDetailClient({
  kart,
  lightboxImages,
  specificationsData,
  downloads,
}: KartDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${kart.name} - CBK Racing`,
          text: `Check out the ${kart.name}, a ${kart.category} category go-kart from CBK Racing`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    }
  }

  const conditionColor = {
    'Excellent': 'bg-green-500',
    'Good': 'bg-blue-500',
    'Fair': 'bg-yellow-500',
    'Maintenance': 'bg-orange-500',
  }[kart.condition] || 'bg-gray-500'

  const winRate = kart.performance.total_races > 0
    ? Math.round((kart.performance.wins / kart.performance.total_races) * 100)
    : 0

  const podiumRate = kart.performance.total_races > 0
    ? Math.round((kart.performance.podiums / kart.performance.total_races) * 100)
    : 0

  return (
    <div className="min-h-screen bg-racing-gray-50 pt-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-racing-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-racing-gray-600">
            <Link href="/" className="hover:text-racing-red transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/karts" className="hover:text-racing-red transition-colors">
              Karts
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-racing-gray-900 font-medium">{kart.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-6 border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
          asChild
        >
          <Link href="/karts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-racing-red text-white font-bold text-2xl px-4 py-2 rounded-lg">
                  #{kart.number}
                </div>
                <div className="flex space-x-2">
                  <Badge
                    className={cn('text-white', kart.is_available ? 'bg-green-500' : 'bg-red-500')}
                  >
                    {kart.is_available ? 'Available' : 'In Use'}
                  </Badge>
                  <Badge className={cn('text-white', conditionColor)}>
                    {kart.condition}
                  </Badge>
                  <Badge variant="outline" className="border-racing-red text-racing-red">
                    {kart.category}
                  </Badge>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-racing-gray-900 mb-4">
                {kart.name}
              </h1>

              <div className="flex items-center space-x-6 text-racing-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Cog className="w-5 h-5" />
                  <span className="font-medium">
                    {kart.specifications.brand} {kart.specifications.model}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{kart.specifications.year_manufactured}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5" />
                  <span>{kart.specifications.max_speed_kmh} km/h</span>
                </div>
              </div>

              {kart.description && (
                <p className="text-lg text-racing-gray-600 leading-relaxed">
                  {kart.description}
                </p>
              )}
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-racing-red">
                        {kart.performance.wins}
                      </div>
                      <div className="text-sm text-racing-gray-600">Wins</div>
                      <div className="text-xs text-racing-gray-500">
                        {winRate}% win rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-racing-red">
                        {kart.performance.podiums}
                      </div>
                      <div className="text-sm text-racing-gray-600">Podiums</div>
                      <div className="text-xs text-racing-gray-500">
                        {podiumRate}% podium rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-racing-red">
                        {kart.performance.total_races}
                      </div>
                      <div className="text-sm text-racing-gray-600">Total Races</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-racing-red">
                        {kart.performance.best_lap_time}s
                      </div>
                      <div className="text-sm text-racing-gray-600">Best Lap</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full mt-4 bg-racing-red hover:bg-racing-red/90"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Kart
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <Gallery className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Specs</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Downloads</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Gallery Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Gallery className="w-5 h-5 text-racing-red" />
                    <span>Gallery Preview</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('gallery')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {lightboxImages.slice(0, 4).map((image, index) => (
                    <motion.div
                      key={image.id}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={image.thumb || image.url}
                        alt={image.alt || ''}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Specifications */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-racing-red" />
                    <span>Key Specifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-racing-gray-900">
                        {kart.specifications.max_speed_kmh}
                      </div>
                      <div className="text-sm text-racing-gray-600">km/h</div>
                    </div>
                    <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                      <Weight className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-racing-gray-900">
                        {kart.specifications.weight_kg}
                      </div>
                      <div className="text-sm text-racing-gray-600">kg</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-racing-gray-600">Engine:</span>
                      <span className="font-medium">
                        {kart.specifications.engine_brand}
                        {kart.specifications.engine_model && ` ${kart.specifications.engine_model}`}
                      </span>
                    </div>
                    {kart.specifications.chassis_material && (
                      <div className="flex justify-between">
                        <span className="text-racing-gray-600">Chassis:</span>
                        <span className="font-medium">{kart.specifications.chassis_material}</span>
                      </div>
                    )}
                    {kart.specifications.tire_brand && (
                      <div className="flex justify-between">
                        <span className="text-racing-gray-600">Tires:</span>
                        <span className="font-medium">{kart.specifications.tire_brand}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-racing-red" />
                    <span>Performance History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                      <Trophy className="w-6 h-6 text-racing-red mx-auto mb-2" />
                      <div className="text-2xl font-bold text-racing-gray-900">
                        {kart.performance.wins}
                      </div>
                      <div className="text-sm text-racing-gray-600">Wins</div>
                    </div>
                    <div className="text-center p-4 bg-racing-gray-50 rounded-lg">
                      <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-racing-gray-900">
                        {kart.performance.podiums}
                      </div>
                      <div className="text-sm text-racing-gray-600">Podiums</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-racing-gray-600">Best Lap Time:</span>
                      <span className="font-medium font-mono">{kart.performance.best_lap_time}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-racing-gray-600">Average Lap Time:</span>
                      <span className="font-medium font-mono">{kart.performance.avg_lap_time}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-racing-gray-600">Win Rate:</span>
                      <span className="font-medium">{winRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-racing-gray-600">Podium Rate:</span>
                      <span className="font-medium">{podiumRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance Status */}
            {kart.maintenance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-racing-red" />
                    <span>Maintenance Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-racing-gray-600">Last Service</div>
                      <div className="font-medium">
                        {new Date(kart.maintenance.last_service).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-racing-gray-600">Next Service</div>
                      <div className="font-medium">
                        {new Date(kart.maintenance.next_service).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-racing-gray-600">Service Hours</div>
                      <div className="font-medium">{kart.maintenance.service_hours}h</div>
                    </div>
                  </div>
                  {kart.maintenance.condition_notes && (
                    <div className="mt-4 p-4 bg-racing-gray-50 rounded-lg">
                      <div className="text-sm text-racing-gray-600 mb-2">Notes</div>
                      <div className="text-racing-gray-900">{kart.maintenance.condition_notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gallery className="w-5 h-5 text-racing-red" />
                  <span>Image Gallery</span>
                  <Badge variant="outline">
                    {lightboxImages.length} image{lightboxImages.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Click any image to view in full size with zoom and navigation controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lightboxImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={image.thumb || image.url}
                        alt={image.alt || ''}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-racing-red" />
                  <span>Detailed Specifications</span>
                </CardTitle>
                <CardDescription>
                  Complete technical specifications and performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {specificationsData.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-xl font-semibold text-racing-gray-900 mb-4 flex items-center space-x-2">
                        <div className="w-1 h-6 bg-racing-red rounded-full" />
                        <span>{category.category}</span>
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <tbody className="divide-y divide-racing-gray-200">
                            {category.items.map((item, itemIndex) => (
                              <tr key={itemIndex} className="group hover:bg-racing-gray-50">
                                <td className="py-3 pr-8 text-racing-gray-600 font-medium">
                                  {item.label}
                                </td>
                                <td className="py-3 text-racing-gray-900 font-semibold">
                                  {item.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-racing-red" />
                  <span>Downloads & Resources</span>
                </CardTitle>
                <CardDescription>
                  Technical documents, manuals, and media resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {downloads.map((download) => (
                    <motion.div
                      key={download.id}
                      className="border border-racing-gray-200 rounded-lg p-4 hover:border-racing-red hover:shadow-md transition-all duration-200 group"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{download.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-racing-gray-900 group-hover:text-racing-red transition-colors">
                            {download.name}
                          </h4>
                          <p className="text-sm text-racing-gray-600 mb-3">
                            {download.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-racing-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {download.type}
                              </Badge>
                              <span>{download.size}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                              disabled={download.url === '#'}
                            >
                              {download.url === '#' ? (
                                'Coming Soon'
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-500 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Need Additional Resources?
                      </h4>
                      <p className="text-blue-800 text-sm">
                        Contact our technical team for specific documentation, setup guides, or custom configurations for this kart.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={`${kart.name} Gallery`}
        showThumbnails={true}
        showControls={true}
        allowDownload={false}
        allowShare={true}
      />
    </div>
  )
}