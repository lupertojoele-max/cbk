import { News, ApiResponse } from '../types'

export const mockNews: News[] = [
  {
    id: 1,
    title: 'CBK Racing Wins Italian Championship Round 5',
    slug: 'cbk-racing-wins-italian-championship-round-5',
    excerpt: 'Marco Rossini delivers an outstanding performance to secure victory in the fifth round of the Italian Karting Championship.',
    content: 'In a thrilling display of speed and precision, CBK Racing\'s Marco Rossini dominated the fifth round of the Italian Karting Championship...',
    category: 'Race Results',
    status: 'published',
    published_at: '2024-01-28T10:30:00Z',
    is_featured: true,
    is_breaking: false,
    author: {
      name: 'CBK Racing Team',
      email: 'media@cbkracing.com'
    },
    cover_image: {
      id: 1,
      url: '/images/news/championship-win-1.jpg',
      thumb: '/images/news/thumbs/championship-win-1.jpg',
      alt: 'Marco Rossini celebrating victory'
    },
    seo: {
      meta_title: 'CBK Racing Championship Victory - Italian Round 5',
      meta_description: 'Marco Rossini secures victory in Italian Karting Championship Round 5 with exceptional performance.'
    },
    reading_time: 3,
    views: 1247
  },
  {
    id: 2,
    title: 'New Partnership with Premium Motorsport Sponsors',
    slug: 'new-partnership-premium-motorsport-sponsors',
    excerpt: 'CBK Racing announces exciting new sponsorship deals that will enhance our competitive capabilities for the 2024 season.',
    content: 'We are thrilled to announce several new partnerships that will significantly boost our racing capabilities...',
    category: 'Team News',
    status: 'published',
    published_at: '2024-01-25T14:15:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'CBK Racing Team',
      email: 'media@cbkracing.com'
    },
    cover_image: {
      id: 2,
      url: '/images/news/sponsorship-announcement-1.jpg',
      thumb: '/images/news/thumbs/sponsorship-announcement-1.jpg',
      alt: 'New sponsorship announcement'
    },
    seo: {
      meta_title: 'CBK Racing Announces New Sponsorship Partnerships',
      meta_description: 'CBK Racing secures new premium sponsorship deals for enhanced 2024 season performance.'
    },
    reading_time: 2,
    views: 892
  },
  {
    id: 3,
    title: 'Sofia Ferrari Joins Professional Racing Division',
    slug: 'sofia-ferrari-joins-professional-racing-division',
    excerpt: 'Rising star Sofia Ferrari officially joins CBK Racing\'s professional division after impressive junior career achievements.',
    content: 'After years of exceptional performance in junior categories, Sofia Ferrari has earned her place in our professional racing division...',
    category: 'Driver News',
    status: 'published',
    published_at: '2024-01-22T09:45:00Z',
    is_featured: true,
    is_breaking: false,
    author: {
      name: 'CBK Racing Team',
      email: 'media@cbkracing.com'
    },
    cover_image: {
      id: 3,
      url: '/images/news/sofia-ferrari-announcement-1.jpg',
      thumb: '/images/news/thumbs/sofia-ferrari-announcement-1.jpg',
      alt: 'Sofia Ferrari in CBK Racing gear'
    },
    seo: {
      meta_title: 'Sofia Ferrari Promoted to Professional Racing Division',
      meta_description: 'Sofia Ferrari joins CBK Racing professional team after outstanding junior career performance.'
    },
    reading_time: 4,
    views: 2156
  },
  {
    id: 4,
    title: 'Technical Innovation: New Engine Performance Upgrades',
    slug: 'technical-innovation-new-engine-performance-upgrades',
    excerpt: 'Our technical team unveils cutting-edge engine modifications that deliver improved performance and reliability.',
    content: 'The CBK Racing technical department has been working tirelessly on engine performance improvements...',
    category: 'Technical',
    status: 'published',
    published_at: '2024-01-20T16:20:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'Technical Team',
      email: 'tech@cbkracing.com'
    },
    cover_image: {
      id: 4,
      url: '/images/news/engine-upgrades-1.jpg',
      thumb: '/images/news/thumbs/engine-upgrades-1.jpg',
      alt: 'Engine performance upgrades'
    },
    seo: {
      meta_title: 'CBK Racing Engine Performance Upgrades',
      meta_description: 'Technical innovations deliver improved engine performance and reliability for CBK Racing karts.'
    },
    reading_time: 5,
    views: 743
  },
  {
    id: 5,
    title: 'Upcoming European Championship Preparations',
    slug: 'upcoming-european-championship-preparations',
    excerpt: 'CBK Racing intensifies training and preparation efforts for the upcoming European Karting Championships.',
    content: 'As the European Karting Championships approach, our team is ramping up preparation efforts...',
    category: 'Championships',
    status: 'published',
    published_at: '2024-01-18T11:30:00Z',
    is_featured: false,
    is_breaking: false,
    author: {
      name: 'CBK Racing Team',
      email: 'media@cbkracing.com'
    },
    cover_image: {
      id: 5,
      url: '/images/news/european-championship-prep-1.jpg',
      thumb: '/images/news/thumbs/european-championship-prep-1.jpg',
      alt: 'Team preparing for European Championships'
    },
    seo: {
      meta_title: 'CBK Racing European Championship Preparation',
      meta_description: 'CBK Racing team intensifies training for upcoming European Karting Championships.'
    },
    reading_time: 3,
    views: 1089
  }
]

export const mockNewsResponse: ApiResponse<News[]> = {
  data: mockNews,
  meta: {
    total: mockNews.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockNews.length
  }
}