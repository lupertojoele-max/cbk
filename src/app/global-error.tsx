'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical errors
    console.error('Global Error:', error)

    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // window.Sentry?.captureException(error, { level: 'fatal' })
    }
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-racing-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Critical Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-racing-red/20 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-racing-red" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold mb-4">
            Critical System Error
          </h1>

          <p className="text-racing-gray-300 text-lg mb-8 leading-relaxed">
            We encountered a critical error that prevented the application from loading properly.
            This issue has been reported to our engineering team.
          </p>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left">
              <summary className="cursor-pointer text-sm font-medium text-racing-gray-400 hover:text-racing-red transition-colors mb-4">
                🚨 Critical Error Details
              </summary>
              <div className="p-4 bg-racing-gray-800 rounded-md text-xs font-mono text-racing-gray-200 whitespace-pre-wrap overflow-auto max-h-40 border border-racing-gray-700">
                <strong className="text-racing-red">Error:</strong> {error.message}
                {error.digest && (
                  <>
                    <br />
                    <strong className="text-racing-red">Digest:</strong> {error.digest}
                  </>
                )}
                {error.stack && (
                  <>
                    <br />
                    <strong className="text-racing-red">Stack Trace:</strong>
                    <br />
                    {error.stack}
                  </>
                )}
              </div>
            </details>
          )}

          {/* Recovery Actions */}
          <div className="space-y-4">
            <Button
              onClick={reset}
              className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3 text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Restart Application
            </Button>

            <div className="text-sm text-racing-gray-400">
              <p>
                If this problem continues, please refresh the page or contact our support team.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-racing-gray-700">
            <p className="text-sm text-racing-gray-500">
              CBK Racing - We&apos;ll be back on track soon! 🏎️
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}