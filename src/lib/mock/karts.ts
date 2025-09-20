import { Kart, ApiResponse } from '../types'

export const mockKarts: Kart[] = [
  {
    id: 1,
    name: 'Thunder Bolt',
    slug: 'thunder-bolt',
    number: 7,
    category: 'Senior',
    condition: 'Excellent',
    is_available: true,
    description: 'High-performance kart with exceptional handling and speed capabilities. Perfect for competitive racing.',
    specifications: {
      brand: 'CRG',
      model: 'Road Rebel',
      engine_brand: 'IAME',
      engine_model: 'X30',
      max_speed_kmh: 95,
      weight_kg: 180,
      year_manufactured: 2023,
      chassis_material: 'Steel',
      tire_brand: 'Bridgestone'
    },
    performance: {
      total_races: 24,
      wins: 8,
      podiums: 15,
      best_lap_time: '42.354',
      avg_lap_time: '43.120',
      total_distance_km: 1250
    },
    maintenance: {
      last_service: '2024-01-15',
      next_service: '2024-02-15',
      service_hours: 45,
      condition_notes: 'Engine recently tuned, brakes at 80%'
    },
    gallery: [
      {
        id: 1,
        url: '/images/karts/thunder-bolt-1.jpg',
        thumb: '/images/karts/thumbs/thunder-bolt-1.jpg',
        alt: 'Thunder Bolt kart front view'
      },
      {
        id: 2,
        url: '/images/karts/thunder-bolt-2.jpg',
        thumb: '/images/karts/thumbs/thunder-bolt-2.jpg',
        alt: 'Thunder Bolt kart side view'
      }
    ]
  },
  {
    id: 2,
    name: 'Lightning Strike',
    slug: 'lightning-strike',
    number: 12,
    category: 'Senior',
    condition: 'Good',
    is_available: false,
    description: 'Agile and responsive kart designed for precision racing and optimal cornering performance.',
    specifications: {
      brand: 'Tony Kart',
      model: 'Racer 401R',
      engine_brand: 'IAME',
      engine_model: 'X30',
      max_speed_kmh: 92,
      weight_kg: 175,
      year_manufactured: 2022,
      chassis_material: 'Steel',
      tire_brand: 'Vega'
    },
    performance: {
      total_races: 32,
      wins: 5,
      podiums: 18,
      best_lap_time: '42.789',
      avg_lap_time: '43.450',
      total_distance_km: 1680
    },
    maintenance: {
      last_service: '2024-01-10',
      next_service: '2024-02-10',
      service_hours: 52,
      condition_notes: 'Due for tire replacement'
    },
    gallery: [
      {
        id: 3,
        url: '/images/karts/lightning-strike-1.jpg',
        thumb: '/images/karts/thumbs/lightning-strike-1.jpg',
        alt: 'Lightning Strike kart front view'
      }
    ]
  },
  {
    id: 3,
    name: 'Speed Demon',
    slug: 'speed-demon',
    number: 3,
    category: 'Junior',
    condition: 'Excellent',
    is_available: true,
    description: 'Perfect junior kart for developing drivers with safety features and controlled performance.',
    specifications: {
      brand: 'Birel ART',
      model: 'RY30-S8',
      engine_brand: 'IAME',
      engine_model: 'Mini Swift',
      max_speed_kmh: 75,
      weight_kg: 145,
      year_manufactured: 2023,
      chassis_material: 'Steel',
      tire_brand: 'Bridgestone'
    },
    performance: {
      total_races: 18,
      wins: 12,
      podiums: 16,
      best_lap_time: '45.234',
      avg_lap_time: '46.120',
      total_distance_km: 890
    },
    maintenance: {
      last_service: '2024-01-20',
      next_service: '2024-02-20',
      service_hours: 28,
      condition_notes: 'Recently overhauled, excellent condition'
    },
    gallery: [
      {
        id: 4,
        url: '/images/karts/speed-demon-1.jpg',
        thumb: '/images/karts/thumbs/speed-demon-1.jpg',
        alt: 'Speed Demon kart front view'
      }
    ]
  },
  {
    id: 4,
    name: 'Red Rocket',
    slug: 'red-rocket',
    number: 21,
    category: 'Senior',
    condition: 'Good',
    is_available: true,
    description: 'Reliable and fast kart with proven track record in championship racing.',
    specifications: {
      brand: 'Kosmic',
      model: 'Mercury S',
      engine_brand: 'Vortex',
      engine_model: 'ROK GP',
      max_speed_kmh: 98,
      weight_kg: 185,
      year_manufactured: 2021,
      chassis_material: 'Steel',
      tire_brand: 'Vega'
    },
    performance: {
      total_races: 45,
      wins: 15,
      podiums: 28,
      best_lap_time: '41.987',
      avg_lap_time: '42.890',
      total_distance_km: 2340
    },
    maintenance: {
      last_service: '2024-01-05',
      next_service: '2024-02-05',
      service_hours: 68,
      condition_notes: 'Clutch recently replaced'
    },
    gallery: [
      {
        id: 5,
        url: '/images/karts/red-rocket-1.jpg',
        thumb: '/images/karts/thumbs/red-rocket-1.jpg',
        alt: 'Red Rocket kart front view'
      }
    ]
  },
  {
    id: 5,
    name: 'Blue Blur',
    slug: 'blue-blur',
    number: 44,
    category: 'Senior',
    condition: 'Excellent',
    is_available: true,
    description: 'State-of-the-art racing kart with cutting-edge aerodynamics and engine performance.',
    specifications: {
      brand: 'CRG',
      model: 'Heroes',
      engine_brand: 'TM',
      engine_model: 'KZ10C',
      max_speed_kmh: 105,
      weight_kg: 195,
      year_manufactured: 2024,
      chassis_material: 'Steel',
      tire_brand: 'Bridgestone'
    },
    performance: {
      total_races: 8,
      wins: 6,
      podiums: 8,
      best_lap_time: '40.125',
      avg_lap_time: '40.890',
      total_distance_km: 420
    },
    maintenance: {
      last_service: '2024-01-25',
      next_service: '2024-02-25',
      service_hours: 12,
      condition_notes: 'Brand new, just broken in'
    },
    gallery: [
      {
        id: 6,
        url: '/images/karts/blue-blur-1.jpg',
        thumb: '/images/karts/thumbs/blue-blur-1.jpg',
        alt: 'Blue Blur kart front view'
      }
    ]
  },
  {
    id: 6,
    name: 'Green Machine',
    slug: 'green-machine',
    number: 88,
    category: 'Masters',
    condition: 'Good',
    is_available: false,
    description: 'Veteran kart with years of racing experience, perfect for experienced drivers.',
    specifications: {
      brand: 'Exprit',
      model: 'Noesis R',
      engine_brand: 'IAME',
      engine_model: 'X30',
      max_speed_kmh: 93,
      weight_kg: 178,
      year_manufactured: 2020,
      chassis_material: 'Steel',
      tire_brand: 'Vega'
    },
    performance: {
      total_races: 67,
      wins: 22,
      podiums: 41,
      best_lap_time: '42.156',
      avg_lap_time: '43.200',
      total_distance_km: 3450
    },
    maintenance: {
      last_service: '2024-01-12',
      next_service: '2024-02-12',
      service_hours: 85,
      condition_notes: 'Scheduled for engine rebuild'
    },
    gallery: [
      {
        id: 7,
        url: '/images/karts/green-machine-1.jpg',
        thumb: '/images/karts/thumbs/green-machine-1.jpg',
        alt: 'Green Machine kart front view'
      }
    ]
  }
]

export const mockKartsResponse: ApiResponse<Kart[]> = {
  data: mockKarts,
  meta: {
    total: mockKarts.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockKarts.length
  }
}