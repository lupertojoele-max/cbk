import { getServerSideSitemap } from 'next-sitemap'
import { api } from '@/lib/api'
import { extractData } from '@/lib/api-utils'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    // Fetch all drivers
    const response = await api.drivers.list({ per_page: 100 })
    const drivers = extractData(response)

    const fields = drivers.map((driver) => ({
      loc: `${siteUrl}/team/${driver.slug}`,
      lastmod: new Date(driver.updated_at || driver.created_at).toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.6,
    }))

    return getServerSideSitemap(fields)
  } catch (error) {
    console.error('Error generating drivers sitemap:', error)
    return getServerSideSitemap([])
  }
}