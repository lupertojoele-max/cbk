'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-racing-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-racing-red/10 p-4 rounded-full">
                <AlertTriangle className="w-8 h-8 text-racing-red" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-racing-gray-900 mb-4">
              Oops! Something went wrong
            </h2>

            <p className="text-racing-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected error. Our team has been notified and is working to fix this issue.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-racing-gray-700 hover:text-racing-red transition-colors">
                  Show Error Details
                </summary>
                <div className="mt-3 p-3 bg-racing-gray-50 rounded-md text-xs font-mono text-racing-gray-800 whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="bg-racing-red hover:bg-racing-red/90 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                variant="outline"
                className="border-racing-gray-300 text-racing-gray-700 hover:bg-racing-gray-50"
                asChild
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// API Error Boundary - specialized for API call failures
interface ApiErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
  retryText?: string
}

export function ApiErrorBoundary({
  children,
  onRetry,
  retryText = "Retry Request"
}: ApiErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-racing-gray-200">
          <div className="bg-racing-orange/10 p-3 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-racing-orange" />
          </div>

          <h3 className="text-lg font-semibold text-racing-gray-900 mb-2">
            Failed to Load Data
          </h3>

          <p className="text-racing-gray-600 mb-4 max-w-sm">
            We couldn't retrieve the latest information. Please check your connection and try again.
          </p>

          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              className="bg-racing-red hover:bg-racing-red/90 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          )}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Page Error Boundary - for full page errors
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to analytics/monitoring service
        console.error('Page Error:', error, errorInfo)

        // In production, send to error tracking service like Sentry
        if (process.env.NODE_ENV === 'production') {
          // window.Sentry?.captureException(error, { contexts: { errorInfo } })
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component Error Boundary - for individual components
export function ComponentErrorBoundary({
  children,
  componentName = 'Component'
}: {
  children: ReactNode
  componentName?: string
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-racing-gray-50 border border-racing-gray-200 rounded-lg">
          <div className="flex items-center text-racing-gray-600">
            <AlertTriangle className="w-5 h-5 mr-2 text-racing-orange" />
            <span className="text-sm">
              {componentName} temporarily unavailable
            </span>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary