'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner, DataLoading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  Globe,
  Database,
  TrendingUp,
  Activity
} from 'lucide-react'
import { api, ApiError, NetworkError } from '@/lib/api'
import { apiHealthChecker, apiPerformanceMonitor, type ApiHealthStatus } from '@/lib/api-health'

interface EndpointTest {
  name: string
  endpoint: string
  method: string
  test: () => Promise<any>
  status: 'pending' | 'success' | 'error'
  latency?: number
  error?: string
}

export function ApiStatusDashboard() {
  const [health, setHealth] = useState<ApiHealthStatus | null>(null)
  const [isHealthLoading, setIsHealthLoading] = useState(true)
  const [endpoints, setEndpoints] = useState<EndpointTest[]>([
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET',
      test: () => api.health(),
      status: 'pending'
    },
    {
      name: 'Karts List',
      endpoint: '/karts',
      method: 'GET',
      test: () => api.karts.list({ per_page: 1 }),
      status: 'pending'
    },
    {
      name: 'Drivers List',
      endpoint: '/drivers',
      method: 'GET',
      test: () => api.drivers.list({ per_page: 1 }),
      status: 'pending'
    },
    {
      name: 'Events List',
      endpoint: '/events',
      method: 'GET',
      test: () => api.events.list({ per_page: 1 }),
      status: 'pending'
    },
    {
      name: 'News List',
      endpoint: '/news',
      method: 'GET',
      test: () => api.news.list({ per_page: 1 }),
      status: 'pending'
    },
    {
      name: 'Sponsors List',
      endpoint: '/sponsors',
      method: 'GET',
      test: () => api.sponsors.list(),
      status: 'pending'
    },
    {
      name: 'Seasons List',
      endpoint: '/seasons',
      method: 'GET',
      test: () => api.results.seasons(),
      status: 'pending'
    }
  ])

  const [isTestingEndpoints, setIsTestingEndpoints] = useState(false)

  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    setIsHealthLoading(true)
    try {
      const healthStatus = await apiHealthChecker.checkHealth()
      setHealth(healthStatus)
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsHealthLoading(false)
    }
  }

  const testEndpoints = async () => {
    setIsTestingEndpoints(true)

    const updatedEndpoints = [...endpoints]

    for (let i = 0; i < updatedEndpoints.length; i++) {
      const endpoint = updatedEndpoints[i]
      endpoint.status = 'pending'
      setEndpoints([...updatedEndpoints])

      const startTime = performance.now()

      try {
        await endpoint.test()
        const endTime = performance.now()
        endpoint.status = 'success'
        endpoint.latency = Math.round(endTime - startTime)
        endpoint.error = undefined
      } catch (error) {
        const endTime = performance.now()
        endpoint.status = 'error'
        endpoint.latency = Math.round(endTime - startTime)

        if (error instanceof ApiError) {
          endpoint.error = `${error.message} (${error.status})`
        } else if (error instanceof NetworkError) {
          endpoint.error = error.message
        } else {
          endpoint.error = error instanceof Error ? error.message : 'Unknown error'
        }
      }

      setEndpoints([...updatedEndpoints])
    }

    setIsTestingEndpoints(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-racing-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending': return <LoadingSpinner size="sm" />
      default: return <AlertTriangle className="w-5 h-5 text-racing-gray-400" />
    }
  }

  const successfulEndpoints = endpoints.filter(e => e.status === 'success').length
  const failedEndpoints = endpoints.filter(e => e.status === 'error').length

  return (
    <div className="space-y-8">
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-racing-gray-900">API Health</h2>
            <Button
              onClick={checkHealth}
              disabled={isHealthLoading}
              size="sm"
              variant="outline"
            >
              {isHealthLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>

          {isHealthLoading ? (
            <DataLoading compact text="Checking..." />
          ) : (
            <>
              <div className="flex items-center mb-3">
                {health?.isHealthy ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-2" />
                )}
                <span className="font-medium">
                  {health?.isHealthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>

              {health && (
                <div className="space-y-2 text-sm text-racing-gray-600">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-mono">{health.latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Check:</span>
                    <span className="font-mono">
                      {health.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {health.errors.length > 0 && (
                    <div className="text-red-600 text-xs">
                      {health.errors.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-racing-blue mr-2" />
            <h2 className="text-lg font-semibold text-racing-gray-900">Performance</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-racing-gray-600">Avg Latency:</span>
              <Badge variant="outline" className="font-mono">
                {apiPerformanceMonitor.getAverageLatency()}ms
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-racing-gray-600">Success Rate:</span>
              <Badge variant="outline" className="font-mono">
                {apiPerformanceMonitor.getSuccessRate()}%
              </Badge>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-racing-gold mr-2" />
            <h2 className="text-lg font-semibold text-racing-gray-900">System Info</h2>
          </div>

          {health?.details ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Environment:</span>
                <Badge variant="outline">
                  {health.details.environment || 'Unknown'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Version:</span>
                <Badge variant="outline">
                  {health.details.version || 'Unknown'}
                </Badge>
              </div>
              {health.details.database && (
                <div className="flex justify-between">
                  <span className="text-racing-gray-600">Database:</span>
                  <Badge variant="outline">
                    {health.details.database.status}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-racing-gray-500">
              No system information available
            </div>
          )}
        </div>
      </div>

      {/* Endpoint Testing */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-racing-red mr-2" />
            <h2 className="text-lg font-semibold text-racing-gray-900">Endpoint Tests</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-racing-gray-600">
              {successfulEndpoints}/{endpoints.length} endpoints working
            </div>
            <Button
              onClick={testEndpoints}
              disabled={isTestingEndpoints}
              className="bg-racing-red hover:bg-racing-red/90 text-white"
            >
              {isTestingEndpoints ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Test All Endpoints
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="border border-racing-gray-200 rounded-lg p-4 hover:border-racing-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-racing-gray-900">
                  {endpoint.name}
                </h3>
                {getStatusIcon(endpoint.status)}
              </div>

              <div className="text-sm text-racing-gray-500 mb-2">
                <span className="font-mono bg-racing-gray-100 px-2 py-1 rounded text-xs">
                  {endpoint.method}
                </span>
                <span className="ml-2">{endpoint.endpoint}</span>
              </div>

              {endpoint.latency !== undefined && (
                <div className="flex justify-between text-xs">
                  <span className="text-racing-gray-600">Latency:</span>
                  <span className={`font-mono ${getStatusColor(endpoint.status)}`}>
                    {endpoint.latency}ms
                  </span>
                </div>
              )}

              {endpoint.error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  {endpoint.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-racing-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-racing-gray-900">Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-racing-gray-900 mb-3">Environment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-racing-gray-600">API URL:</span>
                <span className="font-mono text-racing-gray-900 bg-racing-gray-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Environment:</span>
                <Badge variant="outline">
                  {process.env.NODE_ENV}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Mock Data:</span>
                <Badge variant={process.env.NODE_ENV === 'development' ? 'default' : 'outline'}>
                  {process.env.NODE_ENV === 'development' ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-racing-gray-900 mb-3">Status Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Successful Tests:</span>
                <Badge className="bg-green-100 text-green-800">
                  {successfulEndpoints}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Failed Tests:</span>
                <Badge className="bg-red-100 text-red-800">
                  {failedEndpoints}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-racing-gray-600">Overall Status:</span>
                <Badge className={
                  failedEndpoints === 0
                    ? 'bg-green-100 text-green-800'
                    : successfulEndpoints > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }>
                  {failedEndpoints === 0
                    ? 'All Systems Operational'
                    : successfulEndpoints > 0
                    ? 'Partial Outage'
                    : 'Major Outage'
                  }
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}