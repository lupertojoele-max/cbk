import { Sponsor, ApiResponse } from '../types'

export const mockSponsors: Sponsor[] = [
  {
    id: 1,
    name: 'TechSpeed Motors',
    slug: 'techspeed-motors',
    industry: 'Automotive',
    sponsorship_level: 'Platinum',
    sponsorship_type: 'Title Sponsor',
    contract_status: 'Active',
    website: 'https://techspeedmotors.com',
    description: 'Leading provider of high-performance automotive components and racing technology solutions.',
    branding: {
      primary_color: '#1e3a8a',
      secondary_color: '#3b82f6',
      logo: {
        id: 1,
        url: '/images/sponsors/techspeed-motors-logo.png',
        thumb: '/images/sponsors/thumbs/techspeed-motors-logo.png',
        alt: 'TechSpeed Motors logo'
      }
    },
    social_media: {
      website: 'https://techspeedmotors.com',
      linkedin: 'https://linkedin.com/company/techspeed-motors',
      instagram: 'https://instagram.com/techspeedmotors',
      facebook: 'https://facebook.com/techspeedmotors'
    }
  },
  {
    id: 2,
    name: 'RaceGear Pro',
    slug: 'racegear-pro',
    industry: 'Sporting Goods',
    sponsorship_level: 'Gold',
    sponsorship_type: 'Equipment Sponsor',
    contract_status: 'Active',
    website: 'https://racegearpro.com',
    description: 'Premium racing apparel and safety equipment for professional motorsport athletes.',
    branding: {
      primary_color: '#dc2626',
      secondary_color: '#ef4444',
      logo: {
        id: 2,
        url: '/images/sponsors/racegear-pro-logo.png',
        thumb: '/images/sponsors/thumbs/racegear-pro-logo.png',
        alt: 'RaceGear Pro logo'
      }
    },
    social_media: {
      website: 'https://racegearpro.com',
      instagram: 'https://instagram.com/racegearpro',
      facebook: 'https://facebook.com/racegearpro'
    }
  },
  {
    id: 3,
    name: 'Velocity Fuels',
    slug: 'velocity-fuels',
    industry: 'Energy',
    sponsorship_level: 'Gold',
    sponsorship_type: 'Fuel Sponsor',
    contract_status: 'Active',
    website: 'https://velocityfuels.com',
    description: 'High-performance racing fuels and lubricants designed for competitive motorsport.',
    branding: {
      primary_color: '#059669',
      secondary_color: '#10b981',
      logo: {
        id: 3,
        url: '/images/sponsors/velocity-fuels-logo.png',
        thumb: '/images/sponsors/thumbs/velocity-fuels-logo.png',
        alt: 'Velocity Fuels logo'
      }
    },
    social_media: {
      website: 'https://velocityfuels.com',
      linkedin: 'https://linkedin.com/company/velocity-fuels'
    }
  },
  {
    id: 4,
    name: 'Precision Tires',
    slug: 'precision-tires',
    industry: 'Automotive',
    sponsorship_level: 'Silver',
    sponsorship_type: 'Technical Sponsor',
    contract_status: 'Active',
    website: 'https://precisiontires.com',
    description: 'Advanced tire technology and compounds for optimal grip and performance in all racing conditions.',
    branding: {
      primary_color: '#7c3aed',
      secondary_color: '#8b5cf6',
      logo: {
        id: 4,
        url: '/images/sponsors/precision-tires-logo.png',
        thumb: '/images/sponsors/thumbs/precision-tires-logo.png',
        alt: 'Precision Tires logo'
      }
    },
    social_media: {
      website: 'https://precisiontires.com',
      instagram: 'https://instagram.com/precisiontires'
    }
  },
  {
    id: 5,
    name: 'AeroMax Components',
    slug: 'aeromax-components',
    industry: 'Manufacturing',
    sponsorship_level: 'Silver',
    sponsorship_type: 'Technical Sponsor',
    contract_status: 'Active',
    website: 'https://aeromaxcomponents.com',
    description: 'Aerodynamic components and chassis modifications for enhanced racing performance.',
    branding: {
      primary_color: '#ea580c',
      secondary_color: '#fb923c',
      logo: {
        id: 5,
        url: '/images/sponsors/aeromax-components-logo.png',
        thumb: '/images/sponsors/thumbs/aeromax-components-logo.png',
        alt: 'AeroMax Components logo'
      }
    },
    social_media: {
      website: 'https://aeromaxcomponents.com',
      linkedin: 'https://linkedin.com/company/aeromax-components'
    }
  },
  {
    id: 6,
    name: 'Digital Speed Analytics',
    slug: 'digital-speed-analytics',
    industry: 'Technology',
    sponsorship_level: 'Bronze',
    sponsorship_type: 'Data Sponsor',
    contract_status: 'Active',
    website: 'https://digitalspeedanalytics.com',
    description: 'Advanced telemetry and data analysis solutions for professional racing teams.',
    branding: {
      primary_color: '#0891b2',
      secondary_color: '#06b6d4',
      logo: {
        id: 6,
        url: '/images/sponsors/digital-speed-analytics-logo.png',
        thumb: '/images/sponsors/thumbs/digital-speed-analytics-logo.png',
        alt: 'Digital Speed Analytics logo'
      }
    },
    social_media: {
      website: 'https://digitalspeedanalytics.com',
      linkedin: 'https://linkedin.com/company/digital-speed-analytics',
      instagram: 'https://instagram.com/digitalspeedanalytics'
    }
  },
  {
    id: 7,
    name: 'MaxPerformance Nutrition',
    slug: 'maxperformance-nutrition',
    industry: 'Health & Wellness',
    sponsorship_level: 'Bronze',
    sponsorship_type: 'Wellness Sponsor',
    contract_status: 'Active',
    website: 'https://maxperformancenutrition.com',
    description: 'Sports nutrition and wellness products designed for peak athletic performance.',
    branding: {
      primary_color: '#65a30d',
      secondary_color: '#84cc16',
      logo: {
        id: 7,
        url: '/images/sponsors/maxperformance-nutrition-logo.png',
        thumb: '/images/sponsors/thumbs/maxperformance-nutrition-logo.png',
        alt: 'MaxPerformance Nutrition logo'
      }
    },
    social_media: {
      website: 'https://maxperformancenutrition.com',
      instagram: 'https://instagram.com/maxperformancenutrition',
      facebook: 'https://facebook.com/maxperformancenutrition'
    }
  },
  {
    id: 8,
    name: 'Elite Transport Solutions',
    slug: 'elite-transport-solutions',
    industry: 'Logistics',
    sponsorship_level: 'Bronze',
    sponsorship_type: 'Logistics Sponsor',
    contract_status: 'Active',
    website: 'https://elitetransportsolutions.com',
    description: 'Professional transportation and logistics services for racing teams and equipment.',
    branding: {
      primary_color: '#374151',
      secondary_color: '#6b7280',
      logo: {
        id: 8,
        url: '/images/sponsors/elite-transport-solutions-logo.png',
        thumb: '/images/sponsors/thumbs/elite-transport-solutions-logo.png',
        alt: 'Elite Transport Solutions logo'
      }
    },
    social_media: {
      website: 'https://elitetransportsolutions.com',
      linkedin: 'https://linkedin.com/company/elite-transport-solutions'
    }
  }
]

export const mockSponsorsResponse: ApiResponse<Sponsor[]> = {
  data: mockSponsors,
  meta: {
    total: mockSponsors.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockSponsors.length
  }
}