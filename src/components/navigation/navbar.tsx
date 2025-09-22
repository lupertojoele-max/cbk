'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import { ThemeToggleCompact } from '@/components/ui/theme-toggle'

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
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-racing-gray-200 dark:border-slate-700'
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
              className="flex items-center group focus:outline-none rounded-lg p-1"
              onFocus={() => setFocusedItem('logo')}
              onBlur={() => setFocusedItem(null)}
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo cbk racing png.png"
                  alt="CBK Racing Logo"
                  width={200}
                  height={80}
                  priority
                  className="h-20 w-auto object-contain"
                />
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
                      'group h-12 px-4 py-2 text-base font-medium transition-all duration-200 rounded-lg bg-transparent',
                      'focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2',
                      'aria-expanded:bg-[#1877F2] aria-expanded:text-white data-[state=open]:!bg-[#1877F2] data-[state=open]:!text-white',
                      isScrolled
                        ? 'text-racing-gray-900 dark:text-white hover:text-white hover:bg-[#1877F2]'
                        : 'text-white hover:text-white hover:bg-white/10',
                      isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts')
                        ? 'bg-[#1877F2]/10 text-[#1877F2]'
                        : ''
                    )}
                    onFocus={() => setFocusedItem('racing')}
                  >
                    Racing
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2]"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts') ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[800px] grid-cols-3 gap-6 p-6 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700">
                      {/* Menu Sections */}
                      {megaMenuData.racing.sections.map((section) => (
                        <div key={section.title} className="space-y-3">
                          <h4 className="text-sm font-semibold text-[#1877F2] dark:text-[#3b82f6] uppercase tracking-wide">
                            {section.title}
                          </h4>
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none',
                                    'transition-colors hover:bg-[#1877F2] hover:text-white',
                                    'focus:bg-[#1877F2] focus:text-white',
                                    'dark:text-racing-gray-100 dark:hover:text-white',
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
                                        className="ml-2 bg-[#1877F2] text-white text-xs"
                                        variant="default"
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="line-clamp-2 text-xs leading-snug text-racing-gray-600 dark:text-racing-gray-400">
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
                        <div className="bg-racing-gray-50 dark:bg-racing-gray-700 rounded-lg p-4 space-y-3">
                          <Badge className="bg-[#1877F2] text-white">Featured</Badge>
                          <NavigationMenuLink asChild>
                            <Link
                              href={megaMenuData.racing.featured.href}
                              className="block space-y-2 no-underline outline-none hover:opacity-80 focus:opacity-80 transition-opacity"
                            >
                              <div className="text-sm font-semibold text-racing-gray-900 dark:text-white">
                                {megaMenuData.racing.featured.title}
                              </div>
                              <p className="text-xs text-racing-gray-600 dark:text-racing-gray-400 leading-relaxed">
                                {megaMenuData.racing.featured.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Products Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'group h-12 px-4 py-2 text-base font-medium transition-all duration-200 rounded-lg bg-transparent',
                      'focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2',
                      'aria-expanded:bg-[#1877F2] aria-expanded:text-white data-[state=open]:!bg-[#1877F2] data-[state=open]:!text-white',
                      isScrolled
                        ? 'text-racing-gray-900 dark:text-white hover:text-white hover:bg-[#1877F2]'
                        : 'text-white hover:text-white hover:bg-white/10',
                      isActivePath('/products') ? 'bg-[#1877F2]/10 text-[#1877F2]' : ''
                    )}
                    onFocus={() => setFocusedItem('products')}
                  >
                    Products
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActivePath('/products') ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-6 p-6 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-[#1877F2] dark:text-[#3b82f6] uppercase tracking-wide">
                          Componenti Kart
                        </h4>
                        <div className="space-y-2">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/telaio-accessori"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Telaio e Accessori</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Telai, ammortizzatori e componenti strutturali
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/motore-accessori"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Motore e Accessori</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Componenti motore e ricambi per prestazioni
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/carburatori"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Carburatori</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Carburatori e sistemi di alimentazione
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/radiatori-accessori"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Radiatori e Accessori</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Sistemi di raffreddamento e componenti
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/cuscinetti-paraoli-molle"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Cuscinetti Paraoli Molle</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Componenti meccanici e sospensioni
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-[#1877F2] dark:text-[#3b82f6] uppercase tracking-wide">
                          Equipaggiamento
                        </h4>
                        <div className="space-y-2">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/pneumatici-gomme"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Pneumatici / Gomme</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Pneumatici per tutte le condizioni di gara
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/telemetrie-crono"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Telemetrie & Crono</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Sistemi di telemetria e cronometraggio
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/motori-nuovi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Motori Nuovi</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Motori nuovi per ogni categoria
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/telai-nuovi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Telai Nuovi</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Telai completi per competizione
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/kart-completi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] hover:text-white focus:bg-[#1877F2] focus:text-white dark:text-racing-gray-100 dark:hover:text-white"
                            >
                              <div className="text-sm font-medium">Kart Completi</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Kart pronti per la pista
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
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
                        'transition-all duration-200 hover:bg-[#1877F2]',
                        'focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2',
                        isScrolled
                          ? 'text-racing-gray-900 dark:text-white hover:text-white'
                          : 'text-white hover:text-white',
                        isActivePath(item.href) ? 'text-[#1877F2]' : ''
                      )}
                      onFocus={() => setFocusedItem(item.href)}
                      onBlur={() => setFocusedItem(null)}
                    >
                      {item.title}
                      <motion.div
                        className="absolute bottom-2 left-4 right-4 h-0.5 bg-[#1877F2]"
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
              className="hidden md:flex bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-semibold px-6 py-3 h-12"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggleCompact isScrolled={isScrolled} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'lg:hidden h-12 w-12',
                isScrolled ? 'text-racing-gray-900 dark:text-white' : 'text-white'
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