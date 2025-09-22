// Placeholder images for development
// Replace with real images in production

export const placeholderImages = {
  // Hero images
  hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  heroRacing: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  heroTeam: 'https://images.unsplash.com/photo-1582736478423-3a236c1b7b3e?w=1920&h=1080&fit=crop',
  heroEvents: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  heroPoster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',

  // Karts
  kart: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',

  // Team
  driver: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

  // News
  news: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',

  // Events
  event: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',

  // Sponsors
  sponsor: 'https://via.placeholder.com/200x100/e10600/ffffff?text=Sponsor',

  // Default fallbacks
  default: 'https://via.placeholder.com/800x600/f1f5f9/64748b?text=CBK+Racing',
  logo: '/images/logo cbk racing png.png'
}

export function getPlaceholderImage(type: keyof typeof placeholderImages): string {
  return placeholderImages[type] || placeholderImages.default
}