import { getServerSideSitemap } from 'next-sitemap'
import { api } from '@/lib/api'
import { extractData } from '@/lib/api-utils'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    // Fetch all news articles
    const response = await api.news.list({ per_page: 100 })
    const newsItems = extractData(response)

    const fields = newsItems.map((news) => ({
      loc: `${siteUrl}/news/${news.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.7,
    }))

    return getServerSideSitemap(fields)
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    return getServerSideSitemap([])
  }
}