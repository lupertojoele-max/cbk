// CBK Racing API Types
// Matches Laravel backend API responses

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number | null
  to: number | null
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  links?: PaginationLinks
  filters?: Record<string, any>
}

export interface ApiError {
  message: string
  error?: string
  status: number
  errors?: Record<string, string[]>
}

// Kart Types
export interface KartSpecifications {
  brand: string
  model: string
  engine_brand: string
  engine_model?: string
  max_speed_kmh: number
  weight_kg: number
  year_manufactured: number
  chassis_material?: string
  tire_brand?: string
}

export interface KartPerformance {
  total_races: number
  wins: number
  podiums: number
  best_lap_time: string
  avg_lap_time: string
  total_distance_km?: number
}

export interface KartMaintenance {
  last_service: string
  next_service: string
  service_hours: number
  condition_notes?: string
}

export interface MediaItem {
  id: number
  url: string
  thumb?: string
  alt?: string
}

export interface Kart {
  id: number
  name: string
  slug: string
  number: number
  category: string
  condition: string
  is_available: boolean
  description?: string
  specifications: KartSpecifications
  performance: KartPerformance
  maintenance?: KartMaintenance
  gallery: MediaItem[]
}

// Driver Types
export interface DriverProfile {
  age: number
  nationality: string
  hometown: string
  years_experience: number
}

export interface DriverStatistics {
  total_races: number
  wins: number
  podiums: number
  championships: number
  best_lap_time: string
}

export interface Driver {
  id: number
  full_name: string
  slug: string
  racing_number: number
  category: string
  is_team_member: boolean
  is_professional: boolean
  profile: DriverProfile
  statistics: DriverStatistics
  photos: MediaItem[]
}

// Event Types
export interface EventSchedule {
  event_date: string
  registration_deadline?: string
  is_upcoming: boolean
  is_past: boolean
  days_until?: number
}

export interface EventTrack {
  name: string
  location: string
  length_meters: number
  surface: string
}

export interface EventParticipants {
  registered: number
  max_capacity: number
  waiting_list: number
}

export interface Event {
  id: number
  name: string
  slug: string
  type: string
  status: string
  schedule: EventSchedule
  track: EventTrack
  participants: EventParticipants
  photos: MediaItem[]
}

// Result Types
export interface ResultTiming {
  lap_time: number
  total_time: number
  lap_time_formatted: string
  total_time_formatted: string
  gap_to_leader: string
  gap_to_previous: string
}

export interface ResultAchievements {
  is_podium: boolean
  is_winner: boolean
  points: number
  fastest_lap: boolean
}

export interface ResultDriver {
  id: number
  full_name: string
  racing_number: number
  category: string
}

export interface Result {
  id: number
  position: number
  position_suffix: string
  status: string
  driver: ResultDriver
  timing: ResultTiming
  achievements: ResultAchievements
}

export interface EventResultsResponse {
  data: Result[]
  event: {
    id: number
    name: string
    slug: string
    total_participants: number
  }
  meta: {
    total_results: number
    finished: number
    dnf: number
    fastest_lap?: {
      driver: string
      time: string
      lap: number
    }
  }
}

// News Types
export interface NewsAuthor {
  name: string
  email: string
}

export interface NewsSEO {
  meta_title: string
  meta_description: string
}

export interface News {
  id: number
  title: string
  slug: string
  excerpt: string
  content?: string
  category: string
  status: string
  published_at: string
  is_featured: boolean
  is_breaking: boolean
  author: NewsAuthor
  cover_image: MediaItem
  content_images?: MediaItem[]
  seo: NewsSEO
  reading_time: number
  views: number
}

// Sponsor Types
export interface SponsorBranding {
  primary_color: string
  secondary_color?: string
  logo: MediaItem
}

export interface SponsorSocialMedia {
  website?: string
  linkedin?: string
  instagram?: string
  facebook?: string
}

export interface Sponsor {
  id: number
  name: string
  slug: string
  industry: string
  sponsorship_level: string
  sponsorship_type: string
  contract_status: string
  website?: string
  description: string
  branding: SponsorBranding
  social_media: SponsorSocialMedia
}

// API Endpoint Parameter Types
export interface GetKartsParams {
  page?: number
  category?: string
  per_page?: number
}

export interface GetDriversParams {
  page?: number
  team_only?: boolean
  category?: string
  per_page?: number
}

export interface GetEventsParams {
  page?: number
  upcoming?: boolean
  year?: number
  type?: string
  per_page?: number
}

export interface GetNewsParams {
  page?: number
  category?: string
  featured?: boolean
  per_page?: number
}

export interface GetSponsorsParams {
  level?: string
  active_only?: boolean
}

// Season and Championship Types
export interface Season {
  id: number
  year: number
  name: string
  status: 'active' | 'completed' | 'upcoming'
  start_date: string
  end_date: string
  total_rounds: number
  completed_rounds: number
}

export interface ChampionshipStanding {
  id: number
  position: number
  driver: {
    id: number
    full_name: string
    racing_number: number
    nationality: string
  }
  season_id: number
  total_points: number
  wins: number
  podiums: number
  best_finish: number
  races_completed: number
  total_races: number
  points_behind_leader?: number
  points_ahead_next?: number
}

export interface RaceResult {
  id: number
  event_id: number
  event_name: string
  event_date: string
  driver: {
    id: number
    full_name: string
    racing_number: number
    nationality: string
  }
  position: number
  points_earned: number
  fastest_lap: boolean
  pole_position: boolean
  lap_time_best: string
  lap_time_average: string
  status: 'finished' | 'dnf' | 'dns' | 'disqualified'
  gap_to_winner: string
  laps_completed: number
  total_laps: number
}

export interface SeasonResults {
  season: Season
  standings: ChampionshipStanding[]
  recent_races: RaceResult[]
  statistics: {
    total_drivers: number
    different_winners: number
    closest_championship_gap: number
    most_wins_driver: string
    most_poles_driver: string
    fastest_lap_record: {
      driver: string
      time: string
      event: string
    }
  }
}

export interface GetResultsParams {
  season_year?: number
  driver_id?: number
  event_id?: number
  page?: number
  per_page?: number
}