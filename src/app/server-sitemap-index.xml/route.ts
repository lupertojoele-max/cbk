import { getServerSideSitemapIndex } from 'next-sitemap'
import { api } from '@/lib/api'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Generate sitemap URLs for dynamic routes
  const sitemaps = [
    `${siteUrl}/server-sitemap-karts.xml`,
    `${siteUrl}/server-sitemap-drivers.xml`,
    `${siteUrl}/server-sitemap-news.xml`,
  ]

  return getServerSideSitemapIndex(sitemaps)
}