import { Suspense } from 'react'
import { Metadata } from 'next'
import { NewsGrid } from '@/components/news/news-grid'
import { NewsHeader } from '@/components/news/news-header'
import { NewsSkeleton } from '@/components/news/news-skeleton'

export const metadata: Metadata = {
  title: 'Latest Racing News & Updates | CBK Racing',
  description: 'Stay updated with the latest CBK Racing news, race results, driver updates, and team announcements. Your source for motorsport journalism.',
  keywords: ['racing news', 'CBK Racing news', 'motorsport updates', 'racing articles'],
}

interface NewsPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
  }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const category = params.category

  return (
    <div className="min-h-screen bg-racing-gray-50">
      {/* Header */}
      <NewsHeader />

      {/* News Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsGrid page={page} category={category} />
        </Suspense>
      </main>
    </div>
  )
}