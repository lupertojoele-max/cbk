import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { api } from '@/lib/api'
import { extractData, getMediaUrl, formatEventDate } from '@/lib/api-utils'
import { DriverDetailClient } from '@/components/team/driver-detail-client'

interface DriverDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: DriverDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const response = await api.drivers.get(slug)
    const driver = extractData(response)

    if (!driver) {
      return {
        title: 'Driver Not Found',
        description: 'The driver you are looking for could not be found.',
      }
    }

    const imageUrl = driver.photos[0]?.url || '/images/team/default-driver.jpg'
    const description = `${driver.full_name} - Professional ${driver.category} driver at CBK Racing. From ${driver.profile.nationality}, Age: ${driver.profile.age}, Experience: ${driver.profile.years_experience} years.`

    return {
      title: `${driver.full_name} - ${driver.category} Driver`,
      description,
      keywords: [
        driver.full_name,
        driver.category,
        'CBK Racing',
        'professional driver',
        'go-kart racing',
        'motorsport',
        'racing team',
        driver.profile.nationality
      ],
      openGraph: {
        title: `${driver.full_name} - CBK Racing ${driver.category}`,
        description,
        type: 'profile',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${driver.full_name} - Professional ${driver.category} at CBK Racing`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${driver.full_name} - CBK Racing`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/team/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Driver Not Found',
      description: 'The driver you are looking for could not be found.',
    }
  }
}

export default async function DriverDetailPage({ params }: DriverDetailPageProps) {
  const { slug } = await params
  let driver
  let error = null

  try {
    const response = await api.drivers.get(slug)
    driver = extractData(response)
  } catch (err) {
    console.error('Failed to fetch driver:', err)
    if (err instanceof Error && err.message.includes('404')) {
      notFound()
    }
    error = err instanceof Error ? err.message : 'Failed to load driver details'
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-racing-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-racing-gray-900 mb-4">
              Driver Not Found
            </h1>
            <p className="text-racing-gray-600 mb-8">
              {error || 'The driver you are looking for could not be found.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Transform gallery images for lightbox
  const lightboxImages = driver.photos.map((photo, index) => ({
    id: photo.id || index,
    url: getMediaUrl(photo),
    thumb: getMediaUrl(photo, '/images/thumb-placeholder.jpg'),
    alt: `${driver.full_name} - Photo ${index + 1}`,
    caption: `${driver.full_name} - Professional karting driver at CBK Racing`,
  }))

  // Aggregate statistics from race results if available
  const aggregatedStats = {
    totalRaces: driver.statistics.total_races,
    wins: driver.statistics.wins,
    podiums: driver.statistics.podiums,
    championships: driver.statistics.championships,
    bestLapTime: driver.statistics.best_lap_time,
    winRate: driver.statistics.total_races > 0
      ? ((driver.statistics.wins / driver.statistics.total_races) * 100).toFixed(1)
      : '0.0',
    podiumRate: driver.statistics.total_races > 0
      ? ((driver.statistics.podiums / driver.statistics.total_races) * 100).toFixed(1)
      : '0.0',
    averagePosition: 'N/A',
  }

  // Career highlights and achievements
  const achievements = [
    ...(driver.statistics.championships > 0 ? [
      `${driver.statistics.championships} Championship${driver.statistics.championships > 1 ? 's' : ''}`
    ] : []),
    ...(driver.statistics.wins > 0 ? [
      `${driver.statistics.wins} Race Win${driver.statistics.wins > 1 ? 's' : ''}`
    ] : []),
    ...(driver.statistics.podiums > 0 ? [
      `${driver.statistics.podiums} Podium Finish${driver.statistics.podiums > 1 ? 'es' : ''}`
    ] : []),
    ...(driver.profile.years_experience > 5 ? [
      `${driver.profile.years_experience} Years Experience`
    ] : []),
  ]

  // Social media links - mock data for now
  const socialLinks = [
    { platform: 'instagram', url: '#', handle: '@driver_insta' },
    { platform: 'twitter', url: '#', handle: '@driver_twitter' },
    { platform: 'facebook', url: '#', handle: 'Driver Facebook' },
    { platform: 'website', url: '#', handle: 'Personal Website' },
  ]

  // Bio sections
  const bioSections = [
    {
      title: 'Background',
      content: `${driver.full_name} is a dedicated karting professional from ${driver.profile.hometown}, ${driver.profile.nationality}. With ${driver.profile.years_experience} years of experience in competitive karting, they have established themselves as a formidable competitor in the ${driver.category} category.`,
    },
    {
      title: 'Racing Career',
      content: `Starting their karting journey at a young age, ${driver.full_name} has competed in numerous championships and races. Their dedication to the sport and continuous improvement has led to ${driver.statistics.wins} race victories and ${driver.statistics.podiums} podium finishes throughout their career.`,
    },
    {
      title: 'Philosophy',
      content: 'Racing is not just about speed - it\'s about precision, strategy, and mental fortitude. Every race is an opportunity to learn, improve, and push the boundaries of what\'s possible on the track.',
    },
  ]

  return (
    <DriverDetailClient
      driver={driver}
      lightboxImages={lightboxImages}
      aggregatedStats={aggregatedStats}
      achievements={achievements}
      socialLinks={socialLinks}
      bioSections={bioSections}
    />
  )
}

