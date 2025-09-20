// Utility functions for working with API responses and data

import { ApiResponse, PaginationMeta } from './types'

/**
 * Extract data from API response safely
 */
export function extractData<T>(response: ApiResponse<T>): T {
  return response.data
}

/**
 * Extract pagination metadata from API response
 */
export function extractPagination(response: ApiResponse<any>): PaginationMeta | null {
  return response.meta || null
}

/**
 * Check if there are more pages available
 */
export function hasNextPage(response: ApiResponse<any>): boolean {
  if (!response.meta) return false
  return response.meta.current_page < response.meta.last_page
}

/**
 * Check if there are previous pages available
 */
export function hasPreviousPage(response: ApiResponse<any>): boolean {
  if (!response.meta) return false
  return response.meta.current_page > 1
}

/**
 * Get total number of items across all pages
 */
export function getTotalItems(response: ApiResponse<any>): number {
  return response.meta?.total || 0
}

/**
 * Get current page number
 */
export function getCurrentPage(response: ApiResponse<any>): number {
  return response.meta?.current_page || 1
}

/**
 * Get total number of pages
 */
export function getTotalPages(response: ApiResponse<any>): number {
  return response.meta?.last_page || 1
}

/**
 * Calculate pagination range for UI components
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const range: number[] = []
  const half = Math.floor(maxVisible / 2)

  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + maxVisible - 1)

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
}

/**
 * Format racing times consistently
 */
export function formatRacingTime(timeInSeconds: number): string {
  if (timeInSeconds < 60) {
    return `${timeInSeconds.toFixed(3)}s`
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
}

/**
 * Format lap time from seconds to MM:SS.mmm format
 */
export function formatLapTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
  }
  return `${seconds.toFixed(3)}s`
}

/**
 * Calculate gap between times
 */
export function calculateTimeGap(leaderTime: number, currentTime: number): string {
  const gap = currentTime - leaderTime

  if (gap <= 0) {
    return '0.000'
  }

  return `+${gap.toFixed(3)}`
}

/**
 * Get position suffix (1st, 2nd, 3rd, etc.)
 */
export function getPositionSuffix(position: number): string {
  const lastDigit = position % 10
  const lastTwoDigits = position % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th'
  }

  switch (lastDigit) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/**
 * Format position with suffix
 */
export function formatPosition(position: number): string {
  return `${position}${getPositionSuffix(position)}`
}

/**
 * Check if a driver finished on the podium
 */
export function isPodiumFinish(position: number): boolean {
  return position >= 1 && position <= 3
}

/**
 * Check if a driver won the race
 */
export function isWinner(position: number): boolean {
  return position === 1
}

/**
 * Format date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date and time for display
 */
export function formatEventDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Calculate days until event
 */
export function getDaysUntilEvent(eventDate: string): number {
  const now = new Date()
  const event = new Date(eventDate)
  const diffTime = event.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Check if event is upcoming
 */
export function isUpcomingEvent(eventDate: string): boolean {
  return getDaysUntilEvent(eventDate) > 0
}

/**
 * Check if event is live (today)
 */
export function isLiveEvent(eventDate: string): boolean {
  return getDaysUntilEvent(eventDate) === 0
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min read'
  }
  return `${Math.round(minutes)} min read`
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Generate SEO-friendly URL slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get media URL with fallback
 */
export function getMediaUrl(mediaItem?: { url: string } | null, fallback?: string): string {
  return mediaItem?.url || fallback || '/images/placeholder.jpg'
}

/**
 * Get thumbnail URL with fallback
 */
export function getThumbnailUrl(mediaItem?: { thumb?: string; url: string } | null, fallback?: string): string {
  return mediaItem?.thumb || mediaItem?.url || fallback || '/images/placeholder-thumb.jpg'
}

export default {
  extractData,
  extractPagination,
  hasNextPage,
  hasPreviousPage,
  getTotalItems,
  getCurrentPage,
  getTotalPages,
  getPaginationRange,
  formatRacingTime,
  formatLapTime,
  calculateTimeGap,
  getPositionSuffix,
  formatPosition,
  isPodiumFinish,
  isWinner,
  formatEventDate,
  formatEventDateTime,
  getDaysUntilEvent,
  isUpcomingEvent,
  isLiveEvent,
  formatReadingTime,
  formatNumber,
  truncateText,
  slugify,
  getMediaUrl,
  getThumbnailUrl,
}