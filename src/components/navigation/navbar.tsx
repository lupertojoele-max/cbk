'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  description?: string
  badge?: string
  isExternal?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface MegaMenuData {
  sections: NavSection[]
  featured?: {
    title: string
    description: string
    href: string
    image?: string
  }
}

const megaMenuData: Record<string, MegaMenuData> = {
  racing: {
    sections: [
      {
        title: 'Events',
        items: [
          {
            title: 'Upcoming Races',
            href: '/events',
            description: 'View all scheduled racing events and championships',
          },
          {
            title: 'Race Results',
            href: '/results',
            description: 'Latest race results and championship standings',
          },
          {
            title: 'Live Timing',
            href: '/live',
            description: 'Real-time race timing and positions',
            badge: 'Live',
          },
          {
            title: 'Championship',
            href: '/championship',
            description: 'Current season standings and points',
          },
        ],
      },
      {
        title: 'Team',
        items: [
          {
            title: 'Our Drivers',
            href: '/drivers',
            description: 'Meet our professional racing team',
          },
          {
            title: 'Racing Fleet',
            href: '/karts',
            description: 'Explore our high-performance go-kart collection',
          },
          {
            title: 'Technical Team',
            href: '/technical',
            description: 'Behind the scenes with our engineers',
          },
          {
            title: 'Team History',
            href: '/history',
            description: 'Our journey in motorsport',
          },
        ],
      },
    ],
    featured: {
      title: 'Next Race: Italian Championship',
      description: 'Join us at Monza for the next round of championship racing',
      href: '/events/italian-championship-round-6',
    },
  },
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setActiveDropdown(null)
      setFocusedItem(null)
    }
  }, [])

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleDropdownToggle = (menuKey: string) => {
    setActiveDropdown(activeDropdown === menuKey ? null : menuKey)
  }

  return (
    <motion.nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-racing-gray-200'
          : 'bg-transparent border-transparent'
      )}
      animate={{
        height: isScrolled ? '72px' : '88px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onKeyDown={handleKeyDown}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div
            animate={{
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2 rounded-lg p-1"
              onFocus={() => setFocusedItem('logo')}
              onBlur={() => setFocusedItem(null)}
            >
              <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">CBK</span>
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  'font-bold text-xl transition-colors leading-tight',
                  isScrolled ? 'text-racing-gray-900' : 'text-white racing-text-shadow'
                )}>
                  CBK Racing
                </span>
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  isScrolled ? 'text-racing-gray-500' : 'text-racing-gray-200'
                )}>
                  Professional Team
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {/* Racing Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'group h-12 px-4 py-2 text-base font-medium transition-all duration-200 rounded-lg',
                      'focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2',
                      'data-[state=open]:bg-racing-red/10',
                      isScrolled
                        ? 'text-racing-gray-900 hover:text-racing-red hover:bg-racing-red/5'
                        : 'text-white hover:text-racing-red hover:bg-white/10',
                      isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts')
                        ? 'bg-racing-red/10 text-racing-red'
                        : ''
                    )}
                    onFocus={() => setFocusedItem('racing')}
                  >
                    Racing
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-racing-red"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts') ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[800px] grid-cols-3 gap-6 p-6">
                      {/* Menu Sections */}
                      {megaMenuData.racing.sections.map((section) => (
                        <div key={section.title} className="space-y-3">
                          <h4 className="text-sm font-semibold text-racing-red uppercase tracking-wide">
                            {section.title}
                          </h4>
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none',
                                    'transition-colors hover:bg-racing-red/5 hover:text-racing-red',
                                    'focus:bg-racing-red/10 focus:text-racing-red',
                                    'group relative'
                                  )}
                                  onFocus={() => setFocusedItem(item.href)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium leading-none">
                                      {item.title}
                                    </div>
                                    {item.badge && (
                                      <Badge
                                        className="ml-2 bg-racing-red text-white text-xs"
                                        variant="default"
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Featured Section */}
                      {megaMenuData.racing.featured && (
                        <div className="bg-racing-gray-50 rounded-lg p-4 space-y-3">
                          <Badge className="bg-racing-red text-white">Featured</Badge>
                          <NavigationMenuLink asChild>
                            <Link
                              href={megaMenuData.racing.featured.href}
                              className="block space-y-2 no-underline outline-none hover:opacity-80 focus:opacity-80 transition-opacity"
                            >
                              <div className="text-sm font-semibold text-racing-gray-900">
                                {megaMenuData.racing.featured.title}
                              </div>
                              <p className="text-xs text-racing-gray-600 leading-relaxed">
                                {megaMenuData.racing.featured.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Simple Navigation Items */}
                {[
                  { title: 'Calendar', href: '/calendar' },
                  { title: 'Results', href: '/results' },
                  { title: 'News', href: '/news' },
                  { title: 'Sponsors', href: '/sponsors' },
                  { title: 'About', href: '/about' },
                ].map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative inline-flex h-12 w-max items-center justify-center rounded-lg px-4 py-2 text-base font-medium',
                        'transition-all duration-200 hover:bg-racing-red/5',
                        'focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2',
                        isScrolled
                          ? 'text-racing-gray-900 hover:text-racing-red'
                          : 'text-white hover:text-racing-red',
                        isActivePath(item.href) ? 'text-racing-red' : ''
                      )}
                      onFocus={() => setFocusedItem(item.href)}
                      onBlur={() => setFocusedItem(null)}
                    >
                      {item.title}
                      <motion.div
                        className="absolute bottom-2 left-4 right-4 h-0.5 bg-racing-red"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActivePath(item.href) ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              size="lg"
              className="hidden md:flex bg-racing-red hover:bg-racing-red/90 text-white font-semibold px-6 py-3 h-12"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'lg:hidden h-12 w-12',
                isScrolled ? 'text-racing-gray-900' : 'text-white'
              )}
              aria-label="Open mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}