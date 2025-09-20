import { Suspense } from 'react'
import { Metadata } from 'next'
import { ApiStatusDashboard } from '@/components/debug/api-status-dashboard'
import { DataLoading } from '@/components/ui/loading'

export const metadata: Metadata = {
  title: 'API Status Dashboard | CBK Racing',
  description: 'Monitor API health, performance, and connectivity status for CBK Racing backend services.',
  robots: { index: false, follow: false }, // Hidden from search engines
}

export default function ApiStatusPage() {
  // Only available in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-racing-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-racing-gray-900 mb-4">
            Page Not Available
          </h1>
          <p className="text-racing-gray-600">
            The API status dashboard is only available in development mode.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-racing-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-racing-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-racing-gray-900 mb-2">
            🔧 API Status Dashboard
          </h1>
          <p className="text-racing-gray-600">
            Monitor backend connectivity, performance, and health status
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<DataLoading text="Loading API status..." />}>
          <ApiStatusDashboard />
        </Suspense>
      </main>
    </div>
  )
}