'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  cta: {
    primary: { text: string; href: string }
    secondary?: { text: string; href: string }
  }
  badge?: string
}

interface MegaHeroProps {
  videoSrc?: string
  videoPoster?: string
  slides?: HeroSlide[]
  autoplayInterval?: number
  className?: string
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'championship',
    title: 'Racing Excellence',
    subtitle: 'CBK Racing Championship 2024',
    description: 'Experience the thrill of professional go-kart racing with cutting-edge technology and passionate drivers competing at the highest level.',
    image: '/images/hero-racing.jpg',
    cta: {
      primary: { text: 'View Results', href: '/results' },
      secondary: { text: 'Meet Drivers', href: '/drivers' },
    },
    badge: 'Live Now',
  },
  {
    id: 'events',
    title: 'Upcoming Events',
    subtitle: 'Italian Karting Championship',
    description: 'Join us for the next round of championship racing at iconic circuits across Italy. Witness speed, precision, and determination.',
    image: '/images/hero-events.jpg',
    cta: {
      primary: { text: 'Event Calendar', href: '/events' },
      secondary: { text: 'Buy Tickets', href: '/tickets' },
    },
  },
  {
    id: 'team',
    title: 'Professional Team',
    subtitle: 'World-Class Drivers & Technology',
    description: 'Our team combines years of racing experience with state-of-the-art go-karts and engineering excellence.',
    image: '/images/hero-team.jpg',
    cta: {
      primary: { text: 'Our Fleet', href: '/karts' },
      secondary: { text: 'Team History', href: '/about' },
    },
  },
]

export function MegaHero({
  videoSrc = '/hero.mp4',
  videoPoster = '/images/hero-poster.jpg',
  slides = defaultSlides,
  autoplayInterval = 8000,
  className,
}: MegaHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current
    if (!video || prefersReducedMotion || hasVideoError) return

    const handleCanPlay = () => {
      setIsVideoLoaded(true)
      video.play().catch(() => {
        setHasVideoError(true)
      })
    }

    const handleError = () => {
      setHasVideoError(true)
      setIsVideoLoaded(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [prefersReducedMotion, hasVideoError])

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoplayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, prefersReducedMotion, autoplayInterval, slides.length])

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
    setIsPaused(true)

    // Resume autoplay after 10 seconds
    setTimeout(() => setIsPaused(false), 10000)
  }

  const handleVideoClick = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const showVideo = isVideoLoaded && !prefersReducedMotion && !hasVideoError
  const currentSlideData = slides[currentSlide]

  return (
    <section
      className={cn(
        'relative h-screen min-h-[600px] overflow-hidden',
        'flex items-center justify-center',
        className
      )}
      aria-label="Hero section"
    >
      {/* Video Background */}
      {!prefersReducedMotion && !hasVideoError && (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'transition-opacity duration-1000',
            showVideo ? 'opacity-100' : 'opacity-0'
          )}
          poster={videoPoster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onClick={handleVideoClick}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Image Slider Background */}
      <div className={cn(
        'absolute inset-0',
        showVideo ? 'opacity-0' : 'opacity-100',
        'transition-opacity duration-1000'
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlideData.image})` }}
              role="img"
              aria-label={currentSlideData.title}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={showVideo ? 'video' : currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Badge */}
            {currentSlideData.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-racing-red/90 text-white text-sm px-4 py-2 font-semibold">
                  {currentSlideData.badge}
                </Badge>
              </motion.div>
            )}

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-racing-gray-200 font-medium tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentSlideData.subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold racing-text-shadow leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {showVideo ? 'CBK Racing' : currentSlideData.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-racing-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {showVideo
                ? 'Experience the thrill of professional go-kart racing with cutting-edge technology and passionate drivers'
                : currentSlideData.description
              }
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-racing-red hover:bg-racing-red/90 text-white font-semibold px-8 py-4 h-14 text-lg"
                asChild
              >
                <Link href={currentSlideData.cta.primary.href}>
                  {currentSlideData.cta.primary.text}
                </Link>
              </Button>

              {currentSlideData.cta.secondary && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-racing-gray-900 font-semibold px-8 py-4 h-14 text-lg"
                  asChild
                >
                  <Link href={currentSlideData.cta.secondary.href}>
                    {currentSlideData.cta.secondary.text}
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      {!showVideo && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50',
                  index === currentSlide
                    ? 'bg-racing-red scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!showVideo && !isPaused && !prefersReducedMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <motion.div
            className="h-full bg-racing-red"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: autoplayInterval / 1000,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 text-white z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium tracking-wide">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}