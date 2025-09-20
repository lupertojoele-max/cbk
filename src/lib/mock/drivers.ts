import { Driver, ApiResponse } from '../types'

export const mockDrivers: Driver[] = [
  {
    id: 1,
    full_name: 'Marco Rossini',
    slug: 'marco-rossini',
    racing_number: 7,
    category: 'Senior',
    is_team_member: true,
    is_professional: true,
    profile: {
      age: 28,
      nationality: 'Italian',
      hometown: 'Milan, Italy',
      years_experience: 12
    },
    statistics: {
      total_races: 145,
      wins: 42,
      podiums: 78,
      championships: 3,
      best_lap_time: '40.125'
    },
    photos: [
      {
        id: 1,
        url: '/images/drivers/marco-rossini-1.jpg',
        thumb: '/images/drivers/thumbs/marco-rossini-1.jpg',
        alt: 'Marco Rossini portrait'
      }
    ]
  },
  {
    id: 2,
    full_name: 'Sofia Ferrari',
    slug: 'sofia-ferrari',
    racing_number: 12,
    category: 'Senior',
    is_team_member: true,
    is_professional: true,
    profile: {
      age: 25,
      nationality: 'Italian',
      hometown: 'Bologna, Italy',
      years_experience: 8
    },
    statistics: {
      total_races: 98,
      wins: 28,
      podiums: 65,
      championships: 2,
      best_lap_time: '40.789'
    },
    photos: [
      {
        id: 2,
        url: '/images/drivers/sofia-ferrari-1.jpg',
        thumb: '/images/drivers/thumbs/sofia-ferrari-1.jpg',
        alt: 'Sofia Ferrari portrait'
      }
    ]
  },
  {
    id: 3,
    full_name: 'Alessandro Bianchi',
    slug: 'alessandro-bianchi',
    racing_number: 3,
    category: 'Junior',
    is_team_member: true,
    is_professional: false,
    profile: {
      age: 16,
      nationality: 'Italian',
      hometown: 'Rome, Italy',
      years_experience: 3
    },
    statistics: {
      total_races: 32,
      wins: 18,
      podiums: 28,
      championships: 1,
      best_lap_time: '45.234'
    },
    photos: [
      {
        id: 3,
        url: '/images/drivers/alessandro-bianchi-1.jpg',
        thumb: '/images/drivers/thumbs/alessandro-bianchi-1.jpg',
        alt: 'Alessandro Bianchi portrait'
      }
    ]
  },
  {
    id: 4,
    full_name: 'Giulia Conti',
    slug: 'giulia-conti',
    racing_number: 21,
    category: 'Senior',
    is_team_member: true,
    is_professional: true,
    profile: {
      age: 30,
      nationality: 'Italian',
      hometown: 'Turin, Italy',
      years_experience: 15
    },
    statistics: {
      total_races: 178,
      wins: 35,
      podiums: 92,
      championships: 2,
      best_lap_time: '41.987'
    },
    photos: [
      {
        id: 4,
        url: '/images/drivers/giulia-conti-1.jpg',
        thumb: '/images/drivers/thumbs/giulia-conti-1.jpg',
        alt: 'Giulia Conti portrait'
      }
    ]
  },
  {
    id: 5,
    full_name: 'Matteo Ricci',
    slug: 'matteo-ricci',
    racing_number: 44,
    category: 'Senior',
    is_team_member: true,
    is_professional: true,
    profile: {
      age: 26,
      nationality: 'Italian',
      hometown: 'Naples, Italy',
      years_experience: 10
    },
    statistics: {
      total_races: 112,
      wins: 38,
      podiums: 76,
      championships: 4,
      best_lap_time: '40.125'
    },
    photos: [
      {
        id: 5,
        url: '/images/drivers/matteo-ricci-1.jpg',
        thumb: '/images/drivers/thumbs/matteo-ricci-1.jpg',
        alt: 'Matteo Ricci portrait'
      }
    ]
  },
  {
    id: 6,
    full_name: 'Elena Santoro',
    slug: 'elena-santoro',
    racing_number: 88,
    category: 'Masters',
    is_team_member: true,
    is_professional: true,
    profile: {
      age: 35,
      nationality: 'Italian',
      hometown: 'Florence, Italy',
      years_experience: 18
    },
    statistics: {
      total_races: 203,
      wins: 45,
      podiums: 125,
      championships: 5,
      best_lap_time: '42.156'
    },
    photos: [
      {
        id: 6,
        url: '/images/drivers/elena-santoro-1.jpg',
        thumb: '/images/drivers/thumbs/elena-santoro-1.jpg',
        alt: 'Elena Santoro portrait'
      }
    ]
  }
]

export const mockDriversResponse: ApiResponse<Driver[]> = {
  data: mockDrivers,
  meta: {
    total: mockDrivers.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockDrivers.length
  }
}