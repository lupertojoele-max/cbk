// Server-side revalidation utilities for CBK Racing API
// Used in server actions and API routes

import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Revalidate specific API cache tags
 */
export async function revalidateApiData(tags: string | string[]) {
  const tagArray = Array.isArray(tags) ? tags : [tags]
  for (const tag of tagArray) {
    console.log(`Revalidating cache tag: ${tag}`)
    await revalidateTag(tag)
  }
}

/**
 * Revalidate all kart-related data
 */
export async function revalidateKarts() {
  await revalidateApiData(['karts'])
  revalidatePath('/karts')
}

/**
 * Revalidate specific kart data
 */
export async function revalidateKart(slug: string) {
  await revalidateApiData(['karts', `kart:${slug}`])
  revalidatePath(`/karts/${slug}`)
}

/**
 * Revalidate all driver-related data
 */
export async function revalidateDrivers() {
  await revalidateApiData(['drivers'])
  revalidatePath('/drivers')
}

/**
 * Revalidate specific driver data
 */
export async function revalidateDriver(slug: string) {
  await revalidateApiData(['drivers', `driver:${slug}`])
  revalidatePath(`/drivers/${slug}`)
}

/**
 * Revalidate all event-related data
 */
export async function revalidateEvents() {
  await revalidateApiData(['events'])
  revalidatePath('/events')
}

/**
 * Revalidate specific event data
 */
export async function revalidateEvent(slug: string) {
  await revalidateApiData(['events', `event:${slug}`])
  revalidatePath(`/events/${slug}`)
}

/**
 * Revalidate event results
 */
export async function revalidateEventResults(slug: string) {
  await revalidateApiData(['results', `results:${slug}`])
  revalidatePath(`/events/${slug}/results`)
}

/**
 * Revalidate all news-related data
 */
export async function revalidateNews() {
  await revalidateApiData(['news'])
  revalidatePath('/news')
}

/**
 * Revalidate specific news article
 */
export async function revalidateNewsItem(slug: string) {
  await revalidateApiData(['news', `news:${slug}`])
  revalidatePath(`/news/${slug}`)
}

/**
 * Revalidate all sponsor-related data
 */
export async function revalidateSponsors() {
  await revalidateApiData(['sponsors'])
  revalidatePath('/sponsors')
}

/**
 * Revalidate calendar data
 */
export async function revalidateCalendar() {
  await revalidateApiData(['calendar'])
  revalidatePath('/calendar')
}

/**
 * Revalidate sitemap data
 */
export async function revalidateSitemap() {
  await revalidateApiData(['sitemap'])
}

/**
 * Revalidate health check data
 */
export async function revalidateHealth() {
  await revalidateApiData(['health'])
}

/**
 * Revalidate all API data (use sparingly)
 */
export async function revalidateAll() {
  await revalidateApiData([
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
  newRaceResult: async (eventSlug: string) => {
    await revalidateEventResults(eventSlug)
    await revalidateEvent(eventSlug)
    await revalidateEvents() // Update event list
    await revalidateDrivers() // Update driver statistics
    revalidatePath('/') // Update homepage stats
  },

  // When news is published
  newsPublished: async (slug: string) => {
    await revalidateNewsItem(slug)
    await revalidateNews()
    revalidatePath('/') // Update homepage
  },

  // When event is updated
  eventUpdated: async (slug: string) => {
    await revalidateEvent(slug)
    await revalidateEvents()
    await revalidateCalendar()
    revalidatePath('/')
  },

  // When kart information is updated
  kartUpdated: async (slug: string) => {
    await revalidateKart(slug)
    await revalidateKarts()
  },

  // When driver information is updated
  driverUpdated: async (slug: string) => {
    await revalidateDriver(slug)
    await revalidateDrivers()
    revalidatePath('/')
  },

  // When sponsor information is updated
  sponsorUpdated: async () => {
    await revalidateSponsors()
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