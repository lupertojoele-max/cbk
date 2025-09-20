import { Suspense } from 'react'
import { Metadata } from 'next'
import { ResultsView } from '@/components/results/results-view'
import { ResultsHeader } from '@/components/results/results-header'
import { ResultsSkeleton } from '@/components/results/results-skeleton'

export const metadata: Metadata = {
  title: 'Championship Results & Standings | CBK Racing',
  description: 'View championship standings, race results, and season statistics for CBK Racing. Export data and track driver performance across multiple seasons.',
  keywords: ['championship standings', 'race results', 'CBK Racing standings', 'motorsport results'],
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-racing-gray-50">
      {/* Header */}
      <ResultsHeader />

      {/* Results Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ResultsSkeleton />}>
          <ResultsView />
        </Suspense>
      </main>
    </div>
  )
}