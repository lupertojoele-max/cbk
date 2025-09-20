import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { api } from '@/lib/api'
import { extractData, getMediaUrl, formatEventDate } from '@/lib/api-utils'
import { DriverDetailClient } from '@/components/team/driver-detail-client'

interface DriverDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: DriverDetailPageProps): Promise<Metadata> {
  try {
    const response = await api.drivers.get(params.slug)
    const driver = extractData(response)

    if (!driver) {
      return {
        title: 'Driver Not Found',
        description: 'The driver you are looking for could not be found.',
      }
    }

    const imageUrl = driver.profile_image?.url || '/images/team/default-driver.jpg'
    const description = `${driver.name} - Professional ${driver.role} at CBK Racing. Age: ${driver.age}, Experience: ${driver.experience_years} years. ${driver.bio}`

    return {
      title: `${driver.name} - ${driver.role}`,
      description,
      keywords: [
        driver.name,
        driver.role,
        'CBK Racing',
        'professional driver',
        'go-kart racing',
        'motorsport',
        'racing team',
        driver.nationality
      ],
      openGraph: {
        title: `${driver.name} - CBK Racing ${driver.role}`,
        description,
        type: 'profile',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${driver.name} - Professional ${driver.role} at CBK Racing`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${driver.name} - CBK Racing`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/team/${params.slug}`,
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
  let driver
  let error = null

  try {
    const response = await api.drivers.get(params.slug)
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
    averagePosition: driver.statistics.total_races > 0
      ? (driver.statistics.average_position || 0).toFixed(1)
      : 'N/A',
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
      content: driver.profile.bio || `${driver.full_name} is a dedicated karting professional from ${driver.profile.hometown}, ${driver.profile.nationality}. With ${driver.profile.years_experience} years of experience in competitive karting, they have established themselves as a formidable competitor in the ${driver.category} category.`,
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

// Generate metadata for SEO
export async function generateMetadata({ params }: DriverDetailPageProps) {
  try {
    const response = await api.drivers.get(params.slug)
    const driver = extractData(response)

    return {
      title: `${driver.full_name} - Professional Karting Driver | CBK Racing`,
      description: `Meet ${driver.full_name}, a ${driver.category} category karting driver from ${driver.profile.nationality}. With ${driver.statistics.wins} wins and ${driver.statistics.podiums} podiums, they're a key member of the CBK Racing team.`,
      keywords: [
        driver.full_name,
        driver.category,
        'karting driver',
        'professional racing',
        'CBK Racing',
        driver.profile.nationality,
        'motorsport',
        'go-kart racing'
      ],
      openGraph: {
        title: `${driver.full_name} - CBK Racing Driver`,
        description: `Professional karting driver in ${driver.category} category with ${driver.statistics.wins} wins`,
        images: driver.photos.length > 0 ? [
          {
            url: getMediaUrl(driver.photos[0]),
            width: 1200,
            height: 630,
            alt: `${driver.full_name} - CBK Racing driver`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${driver.full_name} - CBK Racing`,
        description: `Professional karting driver - ${driver.category} category`,
        images: driver.photos.length > 0 ? [getMediaUrl(driver.photos[0])] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Driver Profile | CBK Racing',
      description: 'Meet our professional karting drivers at CBK Racing.',
    }
  }
}