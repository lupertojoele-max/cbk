import { api } from '@/lib/api'
import { extractData, getMediaUrl } from '@/lib/api-utils'
import { SponsorStrip } from './sponsor-strip'

export async function SponsorStripAPI() {
  let sponsors = []
  let error = null

  try {
    const response = await api.sponsors.list({ active_only: true })
    const apiSponsors = extractData(response)

    // Transform API sponsors to match SponsorStrip expected format
    sponsors = apiSponsors.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      logo: getMediaUrl(sponsor.branding.logo, '/sponsors/placeholder-logo.png'),
      website: sponsor.website,
      tier: sponsor.sponsorship_level.toLowerCase() as 'title' | 'primary' | 'official' | 'technical'
    }))
  } catch (err) {
    console.error('Failed to fetch sponsors:', err)
    error = err instanceof Error ? err.message : 'Failed to load sponsors'

    // Fallback to default sponsors if API fails
    sponsors = [
      {
        id: 1,
        name: 'Racing Dynamics',
        logo: '/sponsors/racing-dynamics.png',
        website: 'https://racingdynamics.com',
        tier: 'title' as const,
      },
      {
        id: 2,
        name: 'Speed Tech',
        logo: '/sponsors/speed-tech.png',
        website: 'https://speedtech.com',
        tier: 'primary' as const,
      },
      {
        id: 3,
        name: 'Power Systems',
        logo: '/sponsors/power-systems.png',
        website: 'https://powersystems.com',
        tier: 'official' as const,
      },
      {
        id: 4,
        name: 'Elite Performance',
        logo: '/sponsors/elite-performance.png',
        website: 'https://eliteperformance.com',
        tier: 'technical' as const,
      },
      {
        id: 5,
        name: 'Precision Racing',
        logo: '/sponsors/precision-racing.png',
        tier: 'official' as const,
      },
      {
        id: 6,
        name: 'Formula Components',
        logo: '/sponsors/formula-components.png',
        website: 'https://formulacomponents.com',
        tier: 'technical' as const,
      },
      {
        id: 7,
        name: 'Racing Fuel Co',
        logo: '/sponsors/racing-fuel.png',
        tier: 'primary' as const,
      },
      {
        id: 8,
        name: 'High Octane',
        logo: '/sponsors/high-octane.png',
        website: 'https://highoctane.com',
        tier: 'official' as const,
      },
    ]
  }

  return (
    <SponsorStrip
      sponsors={sponsors}
      showTitle={true}
      pauseOnHover={true}
      speed={30}
      direction="left"
    />
  )
}