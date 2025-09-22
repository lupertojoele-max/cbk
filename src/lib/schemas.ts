import { z } from 'zod'

// Base schemas
const MediaItemSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  thumb: z.string().url().optional(),
  alt: z.string().optional(),
})

const PaginationMetaSchema = z.object({
  total: z.number(),
  per_page: z.number(),
  current_page: z.number(),
  last_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
})

const PaginationLinksSchema = z.object({
  first: z.string().url().nullable(),
  last: z.string().url().nullable(),
  prev: z.string().url().nullable(),
  next: z.string().url().nullable(),
})

// Kart schemas
const KartSpecificationsSchema = z.object({
  brand: z.string(),
  model: z.string(),
  engine_brand: z.string(),
  engine_model: z.string().optional(),
  max_speed_kmh: z.number(),
  weight_kg: z.number(),
  year_manufactured: z.number(),
  chassis_material: z.string().optional(),
  tire_brand: z.string().optional(),
})

const KartPerformanceSchema = z.object({
  total_races: z.number(),
  wins: z.number(),
  podiums: z.number(),
  best_lap_time: z.string(),
  avg_lap_time: z.string(),
  total_distance_km: z.number().optional(),
})

const KartMaintenanceSchema = z.object({
  last_service: z.string(),
  next_service: z.string(),
  service_hours: z.number(),
  condition_notes: z.string().optional(),
})

export const KartSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  number: z.number(),
  category: z.string(),
  condition: z.string(),
  is_available: z.boolean(),
  description: z.string().optional(),
  specifications: KartSpecificationsSchema,
  performance: KartPerformanceSchema,
  maintenance: KartMaintenanceSchema.optional(),
  gallery: z.array(MediaItemSchema),
})

// Driver schemas
const DriverProfileSchema = z.object({
  age: z.number(),
  nationality: z.string(),
  hometown: z.string(),
  years_experience: z.number(),
})

const DriverStatisticsSchema = z.object({
  total_races: z.number(),
  wins: z.number(),
  podiums: z.number(),
  championships: z.number(),
  best_lap_time: z.string(),
})

export const DriverSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  slug: z.string(),
  racing_number: z.number(),
  category: z.string(),
  is_team_member: z.boolean(),
  is_professional: z.boolean(),
  profile: DriverProfileSchema,
  statistics: DriverStatisticsSchema,
  photos: z.array(MediaItemSchema),
})

// Event schemas
const EventScheduleSchema = z.object({
  event_date: z.string(),
  registration_deadline: z.string().optional(),
  is_upcoming: z.boolean(),
  is_past: z.boolean(),
  days_until: z.number().optional(),
})

const EventTrackSchema = z.object({
  name: z.string(),
  location: z.string(),
  length_meters: z.number(),
  surface: z.string(),
})

const EventParticipantsSchema = z.object({
  registered: z.number(),
  max_capacity: z.number(),
  waiting_list: z.number(),
})

export const EventSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  status: z.string(),
  schedule: EventScheduleSchema,
  track: EventTrackSchema,
  participants: EventParticipantsSchema,
  photos: z.array(MediaItemSchema),
})

// Result schemas
const ResultTimingSchema = z.object({
  lap_time: z.number(),
  total_time: z.number(),
  lap_time_formatted: z.string(),
  total_time_formatted: z.string(),
  gap_to_leader: z.string(),
  gap_to_previous: z.string(),
})

const ResultAchievementsSchema = z.object({
  is_podium: z.boolean(),
  is_winner: z.boolean(),
  points: z.number(),
  fastest_lap: z.boolean(),
})

const ResultDriverSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  racing_number: z.number(),
  category: z.string(),
})

export const ResultSchema = z.object({
  id: z.number(),
  position: z.number(),
  position_suffix: z.string(),
  status: z.string(),
  driver: ResultDriverSchema,
  timing: ResultTimingSchema,
  achievements: ResultAchievementsSchema,
})

export const EventResultsSchema = z.object({
  data: z.array(ResultSchema),
  event: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    total_participants: z.number(),
  }),
  meta: z.object({
    total_results: z.number(),
    finished: z.number(),
    dnf: z.number(),
    fastest_lap: z.object({
      driver: z.string(),
      time: z.string(),
      lap: z.number(),
    }).optional(),
  }),
})

// News schemas
const NewsAuthorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

const NewsSEOSchema = z.object({
  meta_title: z.string(),
  meta_description: z.string(),
})

export const NewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  category: z.string(),
  status: z.string(),
  published_at: z.string(),
  is_featured: z.boolean(),
  is_breaking: z.boolean(),
  author: NewsAuthorSchema,
  cover_image: MediaItemSchema,
  content_images: z.array(MediaItemSchema).optional(),
  seo: NewsSEOSchema,
  reading_time: z.number(),
  views: z.number(),
})

// Sponsor schemas
const SponsorBrandingSchema = z.object({
  primary_color: z.string(),
  secondary_color: z.string().optional(),
  logo: MediaItemSchema,
})

const SponsorSocialMediaSchema = z.object({
  website: z.string().url().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
})

export const SponsorSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  industry: z.string(),
  sponsorship_level: z.string(),
  sponsorship_type: z.string(),
  contract_status: z.string(),
  website: z.string().url().optional(),
  description: z.string(),
  branding: SponsorBrandingSchema,
  social_media: SponsorSocialMediaSchema,
})

// API Response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  data: dataSchema,
  meta: PaginationMetaSchema.optional(),
  links: PaginationLinksSchema.optional(),
  filters: z.record(z.string(), z.any()).optional(),
})

export const ApiErrorSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  status: z.number(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
})