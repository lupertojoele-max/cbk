// Server-side revalidation utilities for CBK Racing API
// Used in server actions and API routes

import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Revalidate specific API cache tags
 */
export function revalidateApiData(tags: string | string[]) {
  const tagArray = Array.isArray(tags) ? tags : [tags]
  tagArray.forEach(tag => {
    console.log(`Revalidating cache tag: ${tag}`)
    revalidateTag(tag)
  })
}

/**
 * Revalidate all kart-related data
 */
export function revalidateKarts() {
  revalidateApiData(['karts'])
  revalidatePath('/karts')
}

/**
 * Revalidate specific kart data
 */
export function revalidateKart(slug: string) {
  revalidateApiData(['karts', `kart:${slug}`])
  revalidatePath(`/karts/${slug}`)
}

/**
 * Revalidate all driver-related data
 */
export function revalidateDrivers() {
  revalidateApiData(['drivers'])
  revalidatePath('/drivers')
}

/**
 * Revalidate specific driver data
 */
export function revalidateDriver(slug: string) {
  revalidateApiData(['drivers', `driver:${slug}`])
  revalidatePath(`/drivers/${slug}`)
}

/**
 * Revalidate all event-related data
 */
export function revalidateEvents() {
  revalidateApiData(['events'])
  revalidatePath('/events')
}

/**
 * Revalidate specific event data
 */
export function revalidateEvent(slug: string) {
  revalidateApiData(['events', `event:${slug}`])
  revalidatePath(`/events/${slug}`)
}

/**
 * Revalidate event results
 */
export function revalidateEventResults(slug: string) {
  revalidateApiData(['results', `results:${slug}`])
  revalidatePath(`/events/${slug}/results`)
}

/**
 * Revalidate all news-related data
 */
export function revalidateNews() {
  revalidateApiData(['news'])
  revalidatePath('/news')
}

/**
 * Revalidate specific news article
 */
export function revalidateNewsItem(slug: string) {
  revalidateApiData(['news', `news:${slug}`])
  revalidatePath(`/news/${slug}`)
}

/**
 * Revalidate all sponsor-related data
 */
export function revalidateSponsors() {
  revalidateApiData(['sponsors'])
  revalidatePath('/sponsors')
}

/**
 * Revalidate calendar data
 */
export function revalidateCalendar() {
  revalidateApiData(['calendar'])
  revalidatePath('/calendar')
}

/**
 * Revalidate sitemap data
 */
export function revalidateSitemap() {
  revalidateApiData(['sitemap'])
}

/**
 * Revalidate health check data
 */
export function revalidateHealth() {
  revalidateApiData(['health'])
}

/**
 * Revalidate all API data (use sparingly)
 */
export function revalidateAll() {
  revalidateApiData([
    'karts',
    'drivers',
    'events',
    'results',
    'news',
    'sponsors',
    'calendar',
    'sitemap',
    'health'
  ])

  // Revalidate key paths
  revalidatePath('/')
  revalidatePath('/karts')
  revalidatePath('/drivers')
  revalidatePath('/events')
  revalidatePath('/news')
  revalidatePath('/sponsors')
}

/**
 * Revalidation presets for common scenarios
 */
export const revalidatePresets = {
  // When a new race result is added
  newRaceResult: (eventSlug: string) => {
    revalidateEventResults(eventSlug)
    revalidateEvent(eventSlug)
    revalidateEvents() // Update event list
    revalidateDrivers() // Update driver statistics
    revalidatePath('/') // Update homepage stats
  },

  // When news is published
  newsPublished: (slug: string) => {
    revalidateNewsItem(slug)
    revalidateNews()
    revalidatePath('/') // Update homepage
  },

  // When event is updated
  eventUpdated: (slug: string) => {
    revalidateEvent(slug)
    revalidateEvents()
    revalidateCalendar()
    revalidatePath('/')
  },

  // When kart information is updated
  kartUpdated: (slug: string) => {
    revalidateKart(slug)
    revalidateKarts()
  },

  // When driver information is updated
  driverUpdated: (slug: string) => {
    revalidateDriver(slug)
    revalidateDrivers()
    revalidatePath('/')
  },

  // When sponsor information is updated
  sponsorUpdated: () => {
    revalidateSponsors()
    revalidatePath('/') // Sponsors might appear on homepage
  },
}

export default {
  revalidateApiData,
  revalidateKarts,
  revalidateKart,
  revalidateDrivers,
  revalidateDriver,
  revalidateEvents,
  revalidateEvent,
  revalidateEventResults,
  revalidateNews,
  revalidateNewsItem,
  revalidateSponsors,
  revalidateCalendar,
  revalidateSitemap,
  revalidateHealth,
  revalidateAll,
  presets: revalidatePresets,
}