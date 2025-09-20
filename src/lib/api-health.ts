import { api, ApiError, NetworkError } from './api'

export interface ApiHealthStatus {
  isHealthy: boolean
  latency: number
  errors: string[]
  timestamp: Date
  details?: {
    status: string
    version?: string
    environment?: string
    database?: { status: string; response_time: string }
    cache?: { status: string; driver: string }
    statistics?: {
      total_drivers: number
      total_karts: number
      total_events: number
      upcoming_events: number
      published_articles: number
      active_sponsors: number
    }
  }
}

class ApiHealthChecker {
  private lastCheck: Date | null = null
  private cachedStatus: ApiHealthStatus | null = null
  private readonly CACHE_DURATION = 30000 // 30 seconds

  async checkHealth(): Promise<ApiHealthStatus> {
    const now = new Date()

    // Return cached result if recent
    if (this.cachedStatus && this.lastCheck) {
      const elapsed = now.getTime() - this.lastCheck.getTime()
      if (elapsed < this.CACHE_DURATION) {
        return this.cachedStatus
      }
    }

    const startTime = performance.now()
    const errors: string[] = []

    try {
      const healthData = await api.health()
      const endTime = performance.now()
      const latency = Math.round(endTime - startTime)

      const status: ApiHealthStatus = {
        isHealthy: healthData.status === 'healthy' || healthData.status === 'ok',
        latency,
        errors: [],
        timestamp: now,
        details: healthData
      }

      // Cache successful result
      this.cachedStatus = status
      this.lastCheck = now

      return status

    } catch (error) {
      const endTime = performance.now()
      const latency = Math.round(endTime - startTime)

      if (error instanceof ApiError) {
        errors.push(`API Error: ${error.message} (${error.status})`)
      } else if (error instanceof NetworkError) {
        errors.push(`Network Error: ${error.message}`)
      } else {
        errors.push(`Unknown Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      const status: ApiHealthStatus = {
        isHealthy: false,
        latency,
        errors,
        timestamp: now
      }

      // Don't cache failed results
      return status
    }
  }

  async checkBasicConnectivity(): Promise<{ canConnect: boolean; latency: number; error?: string }> {
    const startTime = performance.now()

    try {
      // Try a simple API call
      await api.karts.list({ per_page: 1 })
      const endTime = performance.now()

      return {
        canConnect: true,
        latency: Math.round(endTime - startTime)
      }
    } catch (error) {
      const endTime = performance.now()

      return {
        canConnect: false,
        latency: Math.round(endTime - startTime),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  clearCache(): void {
    this.cachedStatus = null
    this.lastCheck = null
  }
}

// Singleton instance
export const apiHealthChecker = new ApiHealthChecker()

// Hook for React components
export function useApiHealth() {
  const [status, setStatus] = useState<ApiHealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkHealth = useCallback(async () => {
    setIsLoading(true)
    try {
      const health = await apiHealthChecker.checkHealth()
      setStatus(health)
    } catch (error) {
      console.error('Health check failed:', error)
      setStatus({
        isHealthy: false,
        latency: 0,
        errors: ['Health check failed'],
        timestamp: new Date()
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return { status, isLoading, checkHealth }
}

// Performance monitoring
export class ApiPerformanceMonitor {
  private metrics: Array<{
    endpoint: string
    method: string
    duration: number
    status: 'success' | 'error'
    timestamp: Date
  }> = []

  private readonly MAX_METRICS = 100

  recordMetric(
    endpoint: string,
    method: string,
    duration: number,
    status: 'success' | 'error'
  ): void {
    this.metrics.push({
      endpoint,
      method,
      duration,
      status,
      timestamp: new Date()
    })

    // Keep only last N metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }
  }

  getAverageLatency(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? this.metrics.filter(m => m.endpoint.includes(endpoint))
      : this.metrics

    if (relevantMetrics.length === 0) return 0

    const total = relevantMetrics.reduce((sum, metric) => sum + metric.duration, 0)
    return Math.round(total / relevantMetrics.length)
  }

  getSuccessRate(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? this.metrics.filter(m => m.endpoint.includes(endpoint))
      : this.metrics

    if (relevantMetrics.length === 0) return 0

    const successful = relevantMetrics.filter(m => m.status === 'success').length
    return Math.round((successful / relevantMetrics.length) * 100)
  }

  getSlowEndpoints(threshold = 1000): Array<{ endpoint: string; avgLatency: number }> {
    const endpointGroups = new Map<string, number[]>()

    this.metrics.forEach(metric => {
      if (!endpointGroups.has(metric.endpoint)) {
        endpointGroups.set(metric.endpoint, [])
      }
      endpointGroups.get(metric.endpoint)!.push(metric.duration)
    })

    return Array.from(endpointGroups.entries())
      .map(([endpoint, durations]) => ({
        endpoint,
        avgLatency: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      }))
      .filter(item => item.avgLatency > threshold)
      .sort((a, b) => b.avgLatency - a.avgLatency)
  }

  clearMetrics(): void {
    this.metrics = []
  }
}

export const apiPerformanceMonitor = new ApiPerformanceMonitor()

// Helper function to wrap API calls with monitoring
export async function monitoredApiCall<T>(
  apiCall: () => Promise<T>,
  endpoint: string,
  method = 'GET'
): Promise<T> {
  const startTime = performance.now()

  try {
    const result = await apiCall()
    const duration = performance.now() - startTime

    apiPerformanceMonitor.recordMetric(endpoint, method, duration, 'success')

    return result
  } catch (error) {
    const duration = performance.now() - startTime

    apiPerformanceMonitor.recordMetric(endpoint, method, duration, 'error')

    throw error
  }
}

// Import useState, useEffect, useCallback for the hook
import { useState, useEffect, useCallback } from 'react'