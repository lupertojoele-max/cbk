import { getServerSideSitemap } from 'next-sitemap'
import { api } from '@/lib/api'
import { extractData } from '@/lib/api-utils'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    // Fetch all karts
    const response = await api.karts.list({ per_page: 100 })
    const karts = extractData(response)

    const fields = karts.map((kart) => ({
      loc: `${siteUrl}/karts/${kart.slug}`,
      lastmod: new Date(kart.updated_at || kart.created_at).toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.6,
    }))

    return getServerSideSitemap(fields)
  } catch (error) {
    console.error('Error generating karts sitemap:', error)
    return getServerSideSitemap([])
  }
}