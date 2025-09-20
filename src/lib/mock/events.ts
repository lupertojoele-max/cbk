import { Event, ApiResponse } from '../types'

export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Italian Championship Round 6',
    slug: 'italian-championship-round-6',
    type: 'Championship',
    status: 'upcoming',
    schedule: {
      event_date: '2024-02-15T14:00:00Z',
      registration_deadline: '2024-02-10T23:59:59Z',
      is_upcoming: true,
      is_past: false,
      days_until: 8
    },
    track: {
      name: 'Autodromo Nazionale Monza',
      location: 'Monza, Italy',
      length_meters: 1200,
      surface: 'Asphalt'
    },
    participants: {
      registered: 45,
      max_capacity: 60,
      waiting_list: 2
    },
    photos: [
      {
        id: 1,
        url: '/images/events/italian-championship-1.jpg',
        thumb: '/images/events/thumbs/italian-championship-1.jpg',
        alt: 'Italian Championship at Monza'
      }
    ]
  },
  {
    id: 2,
    name: 'Winter Practice Session',
    slug: 'winter-practice-session',
    type: 'Practice',
    status: 'upcoming',
    schedule: {
      event_date: '2024-02-08T10:00:00Z',
      registration_deadline: '2024-02-06T18:00:00Z',
      is_upcoming: true,
      is_past: false,
      days_until: 1
    },
    track: {
      name: 'CBK Training Circuit',
      location: 'Milan, Italy',
      length_meters: 980,
      surface: 'Asphalt'
    },
    participants: {
      registered: 24,
      max_capacity: 30,
      waiting_list: 0
    },
    photos: [
      {
        id: 2,
        url: '/images/events/winter-practice-1.jpg',
        thumb: '/images/events/thumbs/winter-practice-1.jpg',
        alt: 'Winter practice session'
      }
    ]
  },
  {
    id: 3,
    name: 'European Karting Championships',
    slug: 'european-karting-championships',
    type: 'Championship',
    status: 'upcoming',
    schedule: {
      event_date: '2024-03-02T13:30:00Z',
      registration_deadline: '2024-02-25T23:59:59Z',
      is_upcoming: true,
      is_past: false,
      days_until: 25
    },
    track: {
      name: 'Circuit de Essay',
      location: 'Essay, France',
      length_meters: 1382,
      surface: 'Asphalt'
    },
    participants: {
      registered: 78,
      max_capacity: 100,
      waiting_list: 12
    },
    photos: [
      {
        id: 3,
        url: '/images/events/european-championship-1.jpg',
        thumb: '/images/events/thumbs/european-championship-1.jpg',
        alt: 'European Karting Championships'
      }
    ]
  },
  {
    id: 4,
    name: 'CBK Team Time Trials',
    slug: 'cbk-team-time-trials',
    type: 'Time Trial',
    status: 'completed',
    schedule: {
      event_date: '2024-01-20T15:00:00Z',
      registration_deadline: '2024-01-15T23:59:59Z',
      is_upcoming: false,
      is_past: true
    },
    track: {
      name: 'CBK Training Circuit',
      location: 'Milan, Italy',
      length_meters: 980,
      surface: 'Asphalt'
    },
    participants: {
      registered: 18,
      max_capacity: 20,
      waiting_list: 0
    },
    photos: [
      {
        id: 4,
        url: '/images/events/time-trials-1.jpg',
        thumb: '/images/events/thumbs/time-trials-1.jpg',
        alt: 'CBK Team Time Trials'
      }
    ]
  },
  {
    id: 5,
    name: 'Spring Endurance Race',
    slug: 'spring-endurance-race',
    type: 'Endurance',
    status: 'upcoming',
    schedule: {
      event_date: '2024-03-22T09:00:00Z',
      registration_deadline: '2024-03-15T23:59:59Z',
      is_upcoming: true,
      is_past: false,
      days_until: 45
    },
    track: {
      name: 'Pista Azzurra',
      location: 'Jesolo, Italy',
      length_meters: 1450,
      surface: 'Asphalt'
    },
    participants: {
      registered: 32,
      max_capacity: 40,
      waiting_list: 5
    },
    photos: [
      {
        id: 5,
        url: '/images/events/spring-endurance-1.jpg',
        thumb: '/images/events/thumbs/spring-endurance-1.jpg',
        alt: 'Spring Endurance Race'
      }
    ]
  },
  {
    id: 6,
    name: 'Junior Development Cup',
    slug: 'junior-development-cup',
    type: 'Junior Championship',
    status: 'upcoming',
    schedule: {
      event_date: '2024-04-10T14:00:00Z',
      registration_deadline: '2024-04-05T23:59:59Z',
      is_upcoming: true,
      is_past: false,
      days_until: 64
    },
    track: {
      name: 'Kartodromo Franciacorta',
      location: 'Castrezzato, Italy',
      length_meters: 1200,
      surface: 'Asphalt'
    },
    participants: {
      registered: 28,
      max_capacity: 35,
      waiting_list: 1
    },
    photos: [
      {
        id: 6,
        url: '/images/events/junior-development-1.jpg',
        thumb: '/images/events/thumbs/junior-development-1.jpg',
        alt: 'Junior Development Cup'
      }
    ]
  }
]

export const mockEventsResponse: ApiResponse<Event[]> = {
  data: mockEvents,
  meta: {
    total: mockEvents.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockEvents.length
  }
}