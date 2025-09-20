import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { api } from '@/lib/api'
import { extractData, getMediaUrl, formatEventDate } from '@/lib/api-utils'
import { KartDetailClient } from '@/components/karts/kart-detail-client'

interface KartDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: KartDetailPageProps): Promise<Metadata> {
  try {
    const response = await api.karts.get(params.slug)
    const kart = extractData(response)

    if (!kart) {
      return {
        title: 'Kart Not Found',
        description: 'The kart you are looking for could not be found.',
      }
    }

    const imageUrl = kart.featured_image?.url || kart.gallery[0]?.url || '/images/karts/default-kart.jpg'
    const description = `${kart.name} - ${kart.specifications.brand} ${kart.specifications.model} from CBK Racing fleet. Max speed: ${kart.specifications.max_speed_kmh} km/h, Weight: ${kart.specifications.weight_kg} kg.`

    return {
      title: `${kart.name} - ${kart.specifications.brand} ${kart.specifications.model}`,
      description,
      keywords: [
        kart.name,
        kart.specifications.brand,
        kart.specifications.model,
        'go-kart',
        'racing kart',
        'CBK Racing',
        'motorsport',
        `${kart.specifications.max_speed_kmh}kmh`,
        kart.specifications.engine_brand
      ],
      openGraph: {
        title: `${kart.name} - CBK Racing`,
        description,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${kart.name} - ${kart.specifications.brand} racing kart`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${kart.name} - CBK Racing`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/karts/${params.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Kart Not Found',
      description: 'The kart you are looking for could not be found.',
    }
  }
}

export default async function KartDetailPage({ params }: KartDetailPageProps) {
  let kart
  let error = null

  try {
    const response = await api.karts.get(params.slug)
    kart = extractData(response)
  } catch (err) {
    console.error('Failed to fetch kart:', err)
    if (err instanceof Error && err.message.includes('404')) {
      notFound()
    }
    error = err instanceof Error ? err.message : 'Failed to load kart details'
  }

  if (error || !kart) {
    return (
      <div className="min-h-screen bg-racing-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-racing-gray-900 mb-4">
              Kart Not Found
            </h1>
            <p className="text-racing-gray-600 mb-8">
              {error || 'The kart you are looking for could not be found.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Transform gallery images for lightbox
  const lightboxImages = kart.gallery.map((image, index) => ({
    id: image.id || index,
    url: image.url,
    thumb: image.thumb || image.url,
    alt: image.alt || `${kart.name} - Image ${index + 1}`,
    caption: `${kart.name} - Professional go-kart from CBK Racing fleet`,
  }))

  // Transform specifications for table display
  const specificationsData = [
    {
      category: 'General',
      items: [
        { label: 'Brand', value: kart.specifications.brand },
        { label: 'Model', value: kart.specifications.model },
        { label: 'Category', value: kart.category },
        { label: 'Kart Number', value: `#${kart.number}` },
        { label: 'Year Manufactured', value: kart.specifications.year_manufactured.toString() },
        { label: 'Condition', value: kart.condition },
        { label: 'Availability', value: kart.is_available ? 'Available' : 'In Use' },
      ]
    },
    {
      category: 'Engine & Performance',
      items: [
        { label: 'Engine Brand', value: kart.specifications.engine_brand },
        ...(kart.specifications.engine_model ? [{ label: 'Engine Model', value: kart.specifications.engine_model }] : []),
        { label: 'Max Speed', value: `${kart.specifications.max_speed_kmh} km/h` },
        { label: 'Weight', value: `${kart.specifications.weight_kg} kg` },
        ...(kart.specifications.chassis_material ? [{ label: 'Chassis Material', value: kart.specifications.chassis_material }] : []),
        ...(kart.specifications.tire_brand ? [{ label: 'Tire Brand', value: kart.specifications.tire_brand }] : []),
      ]
    },
    {
      category: 'Racing Statistics',
      items: [
        { label: 'Total Races', value: kart.performance.total_races.toString() },
        { label: 'Wins', value: kart.performance.wins.toString() },
        { label: 'Podium Finishes', value: kart.performance.podiums.toString() },
        { label: 'Best Lap Time', value: `${kart.performance.best_lap_time}s` },
        { label: 'Average Lap Time', value: `${kart.performance.avg_lap_time}s` },
        ...(kart.performance.total_distance_km ? [{ label: 'Total Distance', value: `${kart.performance.total_distance_km} km` }] : []),
      ]
    },
    ...(kart.maintenance ? [{
      category: 'Maintenance',
      items: [
        { label: 'Last Service', value: formatEventDate(kart.maintenance.last_service) },
        { label: 'Next Service', value: formatEventDate(kart.maintenance.next_service) },
        { label: 'Service Hours', value: `${kart.maintenance.service_hours}h` },
        ...(kart.maintenance.condition_notes ? [{ label: 'Notes', value: kart.maintenance.condition_notes }] : []),
      ]
    }] : [])
  ]

  // Download placeholders
  const downloads = [
    {
      id: 1,
      name: 'Technical Specifications',
      description: 'Detailed technical specifications and performance data',
      type: 'PDF',
      size: '2.4 MB',
      icon: '📄',
      url: '#', // Placeholder
    },
    {
      id: 2,
      name: 'Setup Guide',
      description: 'Kart setup and tuning recommendations',
      type: 'PDF',
      size: '1.8 MB',
      icon: '🔧',
      url: '#', // Placeholder
    },
    {
      id: 3,
      name: 'Maintenance Manual',
      description: 'Complete maintenance procedures and schedules',
      type: 'PDF',
      size: '3.2 MB',
      icon: '📋',
      url: '#', // Placeholder
    },
    {
      id: 4,
      name: 'High-Resolution Images',
      description: 'Professional photos for media and marketing',
      type: 'ZIP',
      size: '15.6 MB',
      icon: '📸',
      url: '#', // Placeholder
    },
  ]

  return (
    <KartDetailClient
      kart={kart}
      lightboxImages={lightboxImages}
      specificationsData={specificationsData}
      downloads={downloads}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: KartDetailPageProps) {
  try {
    const response = await api.karts.get(params.slug)
    const kart = extractData(response)

    return {
      title: `${kart.name} - ${kart.specifications.brand} ${kart.specifications.model} | CBK Racing`,
      description: `Discover the ${kart.name}, a ${kart.category} category go-kart from our professional racing fleet. ${kart.specifications.brand} ${kart.specifications.model} with ${kart.specifications.max_speed_kmh} km/h top speed.`,
      keywords: [
        kart.name,
        kart.specifications.brand,
        kart.specifications.model,
        kart.category,
        'go-kart',
        'racing',
        'CBK Racing',
        'karting',
        'motorsport'
      ],
      openGraph: {
        title: `${kart.name} - Professional Go-Kart`,
        description: `${kart.specifications.brand} ${kart.specifications.model} - ${kart.category} category racing kart`,
        images: kart.gallery.length > 0 ? [
          {
            url: kart.gallery[0].url,
            width: 1200,
            height: 630,
            alt: `${kart.name} go-kart`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${kart.name} - CBK Racing`,
        description: `${kart.specifications.brand} ${kart.specifications.model} racing kart`,
        images: kart.gallery.length > 0 ? [kart.gallery[0].url] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Kart Details | CBK Racing',
      description: 'Explore our professional go-kart racing fleet at CBK Racing.',
    }
  }
}