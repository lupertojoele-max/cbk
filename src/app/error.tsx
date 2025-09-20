'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to the console in development
    console.error('App Error:', error)

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, or custom analytics
      // window.Sentry?.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-racing-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-racing-red/10 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-racing-red" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-racing-gray-900 mb-4">
          Something went wrong!
        </h1>

        <p className="text-racing-gray-600 mb-6 leading-relaxed">
          We encountered an unexpected error while loading this page.
          Our racing team has been notified and is working to fix the issue.
        </p>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-racing-gray-700 hover:text-racing-red transition-colors mb-2">
              🔧 Developer Information
            </summary>
            <div className="p-4 bg-racing-gray-50 rounded-md text-xs font-mono text-racing-gray-800 whitespace-pre-wrap overflow-auto max-h-40 border">
              <strong>Error:</strong> {error.message}
              {error.digest && (
                <>
                  <br />
                  <strong>Digest:</strong> {error.digest}
                </>
              )}
              {error.stack && (
                <>
                  <br />
                  <strong>Stack:</strong>
                  <br />
                  {error.stack}
                </>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-racing-red hover:bg-racing-red/90 text-white px-6 py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            className="border-racing-gray-300 text-racing-gray-700 hover:bg-racing-gray-50 px-6 py-3"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-racing-gray-200">
          <p className="text-sm text-racing-gray-500">
            If this problem persists, please{' '}
            <Link
              href="/contact"
              className="text-racing-red hover:text-racing-red/80 underline"
            >
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}