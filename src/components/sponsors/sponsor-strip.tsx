'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Sponsor {
  id: number
  name: string
  logo: string
  website?: string
  tier: 'title' | 'primary' | 'official' | 'technical'
}

interface SponsorStripProps {
  sponsors?: Sponsor[]
  speed?: number
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
  className?: string
  showTitle?: boolean
}

const defaultSponsors: Sponsor[] = [
  {
    id: 1,
    name: 'Racing Dynamics',
    logo: '/sponsors/racing-dynamics.png',
    website: 'https://racingdynamics.com',
    tier: 'title',
  },
  {
    id: 2,
    name: 'Speed Tech',
    logo: '/sponsors/speed-tech.png',
    website: 'https://speedtech.com',
    tier: 'primary',
  },
  {
    id: 3,
    name: 'Power Systems',
    logo: '/sponsors/power-systems.png',
    website: 'https://powersystems.com',
    tier: 'official',
  },
  {
    id: 4,
    name: 'Elite Performance',
    logo: '/sponsors/elite-performance.png',
    website: 'https://eliteperformance.com',
    tier: 'technical',
  },
  {
    id: 5,
    name: 'Precision Racing',
    logo: '/sponsors/precision-racing.png',
    tier: 'official',
  },
  {
    id: 6,
    name: 'Formula Components',
    logo: '/sponsors/formula-components.png',
    website: 'https://formulacomponents.com',
    tier: 'technical',
  },
  {
    id: 7,
    name: 'Racing Fuel Co',
    logo: '/sponsors/racing-fuel.png',
    tier: 'primary',
  },
  {
    id: 8,
    name: 'High Octane',
    logo: '/sponsors/high-octane.png',
    website: 'https://highoctane.com',
    tier: 'official',
  },
]

export function SponsorStrip({
  sponsors = defaultSponsors,
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
  className,
  showTitle = true,
}: SponsorStripProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

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

  // Duplicate sponsors for seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors]

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setIsPaused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (!isFocused) {
      setIsPaused(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      ;(event.target as HTMLElement).blur()
    }
  }

  const shouldAnimate = !prefersReducedMotion && !isPaused

  const animationDuration = sponsors.length * speed
  const animationDirection = direction === 'left' ? -100 : 100

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-white border-y border-racing-gray-200',
        'py-8 md:py-12',
        className
      )}
      aria-label="Our sponsors"
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-racing-gray-900 mb-2">
              Our Partners
            </h2>
            <p className="text-racing-gray-600 max-w-2xl mx-auto">
              Proud to be supported by industry-leading partners who share our passion for racing excellence
            </p>
          </div>
        )}

        {/* Marquee Container */}
        <div
          ref={stripRef}
          className="relative w-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          aria-live="polite"
          aria-label={isPaused ? 'Sponsor carousel paused' : 'Sponsor carousel scrolling'}
        >
          <motion.div
            className="flex space-x-8 md:space-x-12"
            animate={
              shouldAnimate
                ? {
                    x: [`0%`, `${animationDirection}%`],
                  }
                : undefined
            }
            transition={
              shouldAnimate
                ? {
                    duration: animationDuration,
                    ease: 'linear',
                    repeat: Infinity,
                  }
                : undefined
            }
            style={{
              width: `${duplicatedSponsors.length * 200}px`, // Approximate width
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <SponsorItem
                key={`${sponsor.id}-${index}`}
                sponsor={sponsor}
                onFocus={handleFocus}
                onBlur={handleBlur}
                isPaused={isPaused}
              />
            ))}
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Controls for accessibility */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2',
              'border border-racing-gray-300',
              isPaused
                ? 'bg-racing-red text-white'
                : 'bg-white text-racing-gray-700 hover:bg-racing-gray-50'
            )}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume sponsor carousel' : 'Pause sponsor carousel'}
          >
            {isPaused ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="ml-2">{isPaused ? 'Play' : 'Pause'}</span>
          </button>

          <Link
            href="/sponsors"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2',
              'bg-racing-red text-white hover:bg-racing-red/90'
            )}
          >
            View All Partners
          </Link>
        </div>
      </div>
    </section>
  )
}

interface SponsorItemProps {
  sponsor: Sponsor
  onFocus: () => void
  onBlur: () => void
  isPaused: boolean
}

function SponsorItem({ sponsor, onFocus, onBlur, isPaused }: SponsorItemProps) {
  const content = (
    <div
      className={cn(
        'flex-shrink-0 flex items-center justify-center',
        'w-32 h-16 md:w-40 md:h-20',
        'bg-white rounded-lg border border-racing-gray-200',
        'transition-all duration-300',
        'hover:border-racing-red hover:shadow-lg hover:scale-105',
        'focus-within:border-racing-red focus-within:shadow-lg focus-within:scale-105',
        'group relative overflow-hidden'
      )}
    >
      <Image
        src={sponsor.logo}
        alt={`${sponsor.name} logo`}
        width={120}
        height={60}
        className="object-contain max-w-full max-h-full p-2 transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          // Fallback to text logo
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <span class="text-racing-gray-600 font-semibold text-xs text-center px-2 leading-tight">
                ${sponsor.name}
              </span>
            `
          }
        }}
      />

      {/* Tier indicator */}
      {sponsor.tier === 'title' && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-racing-red rounded-full" />
        </div>
      )}
    </div>
  )

  if (sponsor.website) {
    return (
      <Link
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="focus:outline-none"
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={`Visit ${sponsor.name} website`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      tabIndex={0}
      className="focus:outline-none"
      onFocus={onFocus}
      onBlur={onBlur}
      role="button"
      aria-label={`${sponsor.name} sponsor`}
    >
      {content}
    </div>
  )
}