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
import { ThemeToggleCompact } from '@/components/ui/theme-toggle'
import styles from './navbar.module.css'
import { wsk2026Calendar } from '@/data/wsk-2026-calendar'
import { rok2026Calendar } from '@/data/rok-2026-calendar'
import { iame2026Calendar } from '@/data/iame-2026-calendar'

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

// Function to get next upcoming race
function getNextRace() {
  const allEvents = [
    ...wsk2026Calendar.map(event => ({ ...event, eventType: 'WSK' as const })),
    ...rok2026Calendar.map(event => ({ ...event, eventType: 'ROK' as const })),
    ...iame2026Calendar.map(event => ({ ...event, eventType: 'IAME' as const })),
  ]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return allEvents
    .filter(event => new Date(event.startDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
}

const megaMenuData: Record<string, MegaMenuData> = {
  racing: {
    sections: [
      {
        title: 'Eventi',
        items: [
          {
            title: 'Prossime Gare',
            href: '/events',
            description: 'Visualizza tutti gli eventi di gara e i campionati programmati',
          },
          {
            title: 'Risultati Gare',
            href: '/results',
            description: 'Ultimi risultati delle gare e classifiche dei campionati',
          },
          {
            title: 'Campionato',
            href: '/championship',
            description: 'Classifiche e punteggi della stagione corrente',
          },
        ],
      },
      {
        title: 'Club',
        items: [
          {
            title: 'I Nostri Piloti',
            href: '/drivers',
            description: 'Conosci il nostro team di piloti professionisti',
          },
          {
            title: 'Scuola Kart',
            href: '/scuola-kart',
            description: 'Corsi di guida e formazione per piloti di ogni livello',
          },
          {
            title: 'Noleggio Kart',
            href: '/karts',
            description: 'Noleggia i nostri kart ad alte prestazioni per gare e allenamenti',
          },
          {
            title: 'Team Tecnico',
            href: '/technical',
            description: 'Dietro le quinte con i nostri ingegneri',
          },
          {
            title: 'Storia del Team',
            href: '/history',
            description: 'Il nostro percorso nel motorsport',
          },
        ],
      },
    ],
  },
}

// Generate featured content dynamically based on next race
function getFeaturedContent() {
  const nextRace = getNextRace()

  if (!nextRace) {
    return {
      title: 'Prossima Gara: Da Definire',
      description: 'Controlla il calendario per gli eventi futuri',
      href: '/calendar',
    }
  }

  const seriesName = nextRace.eventType === 'WSK'
    ? nextRace.series
    : nextRace.eventType === 'ROK'
    ? nextRace.series
    : nextRace.series

  return {
    title: `Prossima Gara: ${seriesName}`,
    description: `Unisciti a noi a ${nextRace.venue} per il prossimo round del campionato`,
    href: '/calendar',
  }
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Check if we're on a product or calendar page (always show scrolled navbar)
  const isProductPage = pathname.startsWith('/prodotti') || pathname.startsWith('/products')
  const isCalendarPage = pathname.startsWith('/calendar') || pathname.startsWith('/calendario')

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      // Always show scrolled state on product and calendar pages
      if (isProductPage || isCalendarPage) {
        setIsScrolled(true)
      } else {
        setIsScrolled(window.scrollY > 50)
      }
    }

    // Set initial scroll state
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isProductPage, isCalendarPage])

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen &&
          searchContainerRef.current &&
          !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isSearchOpen])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setActiveDropdown(null)
      setFocusedItem(null)
      setIsSearchOpen(false)
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
              <div className="relative group-hover:scale-105 transition-transform h-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mounted && isScrolled ? "/images/cbk-logo-black.png" : "/images/cbk-logo.png"}
                  alt="CBK Racing Logo"
                  className="h-full w-auto object-contain transition-opacity duration-300"
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
                        ? 'text-racing-gray-900 dark:text-white hover:text-white hover:bg-[#0d5dbf]'
                        : 'text-white hover:text-white hover:bg-white/10',
                      isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts')
                        ? 'bg-[#1877F2]/10 text-[#1877F2]'
                        : ''
                    )}
                    onFocus={() => setFocusedItem('racing')}
                  >
                    Club
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
                                    'transition-colors hover:bg-[#0d5dbf]',
                                    'focus:bg-[#1877F2]',
                                    'dark:text-racing-gray-100',
                                    'group relative'
                                  )}
                                  onFocus={() => setFocusedItem(item.href)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium leading-none text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">
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

                      {/* Featured Section - Dynamic Next Race */}
                      {(() => {
                        const featured = getFeaturedContent()
                        return (
                          <div className="bg-racing-gray-50 dark:bg-racing-gray-700 rounded-lg p-4 space-y-3">
                            <Badge className="bg-[#1877F2] text-white">In Evidenza</Badge>
                            <NavigationMenuLink asChild>
                              <Link
                                href={featured.href}
                                className="block space-y-2 no-underline outline-none hover:opacity-80 focus:opacity-80 transition-opacity"
                              >
                                <div className="text-sm font-semibold text-racing-gray-900 dark:text-white">
                                  {featured.title}
                                </div>
                                <p className="text-xs text-racing-gray-600 dark:text-racing-gray-400 leading-relaxed">
                                  {featured.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        )
                      })()}
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
                        ? 'text-racing-gray-900 dark:text-white hover:text-white hover:bg-[#0d5dbf]'
                        : 'text-white hover:text-white hover:bg-white/10',
                      isActivePath('/products') ? 'bg-[#1877F2]/10 text-[#1877F2]' : ''
                    )}
                    onFocus={() => setFocusedItem('products')}
                  >
                    Prodotti
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActivePath('/products') ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div
                      className={`grid gap-6 p-6 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700 transition-all duration-300 mx-auto ${
                        activeSubmenu ? 'w-[900px] grid-cols-3' : 'w-[600px] grid-cols-2'
                      }`}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      {/* Column 1 - Left Items */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-[#1877F2] dark:text-[#3b82f6] uppercase tracking-wide">
                          Componenti Kart
                        </h4>
                        <div className="space-y-2">
                          <div
                            className="group/telaio relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('telaio')
                              setSelectedMenuItem('telaio')
                            }}
                          >
                            <Link
                              href="/products/telaio-accessori"
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group cursor-pointer ${
                                selectedMenuItem === 'telaio'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'telaio' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'telaio'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Telaio e Accessori
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'telaio' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'telaio' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'telaio' ? '#ffffff' : '#6b7280'
                                }}>
                                  Telai, ammortizzatori e componenti strutturali
                                </div>
                            </Link>
                          </div>
                          <div
                            className="group/motore relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('motore')
                              setSelectedMenuItem('motore')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'motore'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'motore' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'motore'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Motore e Accessori
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'motore' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'motore' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'motore' ? '#ffffff' : '#6b7280'
                                }}>
                                  Componenti motore e ricambi per prestazioni
                                </div>
                              </div>
                          </div>
                          <div
                            className="group/carburatori relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('carburatori')
                              setSelectedMenuItem('carburatori')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'carburatori'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'carburatori' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'carburatori'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Carburatori
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'carburatori' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'carburatori' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'carburatori' ? '#ffffff' : '#6b7280'
                                }}>
                                  Carburatori e sistemi di alimentazione
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/radiatori relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('radiatori')
                              setSelectedMenuItem('radiatori')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'radiatori'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'radiatori' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'radiatori'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Radiatori e Accessori
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'radiatori' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'radiatori' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'radiatori' ? '#ffffff' : '#6b7280'
                                }}>
                                  Sistemi di raffreddamento e componenti
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/cuscinetti relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('cuscinetti')
                              setSelectedMenuItem('cuscinetti')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'cuscinetti'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'cuscinetti' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'cuscinetti'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Cuscinetti Paraoli Molle
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'cuscinetti' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'cuscinetti' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'cuscinetti' ? '#ffffff' : '#6b7280'
                                }}>
                                  Componenti meccanici e sospensioni
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2 - Central Submenu */}
                      {activeSubmenu && (
                        <div className="space-y-3 bg-[#1877F2] p-4 rounded-lg">
                          {/* Telaio Submenu */}
                          {activeSubmenu === 'telaio' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Sottocategorie
                              </h4>
                              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
                                <Link href="/products/telaio-accessori/freni-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Freni e Accessori</Link>
                                <Link href="/products/telaio-accessori/cerchi-mozzi-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Cerchi, Mozzi e Accessori</Link>
                                <Link href="/products/telaio-accessori/assali-chiavette-e-cuscinetti" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Assali chiavette e cuscinetti</Link>
                                <Link href="/products/telaio-accessori/corone-catene-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Corone, Catene e accessori</Link>
                                <Link href="/products/telaio-accessori/carenature-staffe-e-paraurti" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carenature, staffe e paraurti</Link>
                                <Link href="/products/telaio-accessori/leve-cambio-e-frizione" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Leve cambio e frizione</Link>
                                <Link href="/products/telaio-accessori/pedali-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pedali e accessori</Link>
                                <Link href="/products/telaio-accessori/piantone-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Piantone e Accessori</Link>
                                <Link href="/products/telaio-accessori/portacorona-e-porta-disco" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Portacorona e Porta disco</Link>
                                <Link href="/products/telaio-accessori/serbatoio-e-tubi-benzina" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Serbatoio e Tubi Benzina</Link>
                                <Link href="/products/telaio-accessori/sedili-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Sedili e accessori</Link>
                                <Link href="/products/telaio-accessori/uniball" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Uniball</Link>
                                <Link href="/products/telaio-accessori/volanti-e-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Volanti e accessori</Link>
                                <Link href="/products/telaio-accessori/barra-stabilizzatrici" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Barra stabilizzatrici</Link>
                              </div>
                            </div>
                          )}

                          {/* Cuscinetti Submenu */}
                          {activeSubmenu === 'cuscinetti' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Cuscinetti Paraoli Molle
                              </h4>
                              <div className="space-y-2">
                                <Link href="/products/cuscinetti-paraoli-molle/molle" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Molle</Link>
                                <Link href="/products/cuscinetti-paraoli-molle/cuscinetti-telaio" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Cuscinetti Telaio</Link>
                                <Link href="/products/cuscinetti-paraoli-molle/cuscinetti-motore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Cuscinetti Motore</Link>
                                <Link href="/products/cuscinetti-paraoli-molle/snodi-sferici-uniball" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Snodi Sferici, Uniball</Link>
                                <Link href="/products/cuscinetti-paraoli-molle/paraoli-anelli-tenuta" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Paraoli, Anelli Tenuta</Link>
                                <Link href="/products/cuscinetti-paraoli-molle/gabbie-a-rulli" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Gabbie a Rulli</Link>
                              </div>
                            </div>
                          )}

                          {/* Motore Submenu */}
                          {activeSubmenu === 'motore' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Motore e Accessori
                              </h4>
                              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
                                <Link href="/products/motore-accessori/ricambi-generici-motore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Ricambi Generici Motore</Link>
                                <Link href="/products/motore-accessori/iame" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">IAME</Link>
                                <Link href="/products/motore-accessori/tm-racing" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">TM RACING</Link>
                                <Link href="/products/motore-accessori/bmb-bluebird" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">BMB / BLUEBIRD</Link>
                                <Link href="/products/motore-accessori/rotax" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">ROTAX</Link>
                                <Link href="/products/motore-accessori/vortex" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">VORTEX</Link>
                                <Link href="/products/motore-accessori/comer" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">COMER</Link>
                                <Link href="/products/motore-accessori/lke-lenzo" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">LKE (LENZO)</Link>
                                <Link href="/products/motore-accessori/maxter" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">MAXTER</Link>
                                <Link href="/products/motore-accessori/modena-engines" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">MODENA ENGINES</Link>
                                <Link href="/products/motore-accessori/wtp-60" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">WTP 60</Link>
                                <Link href="/products/motore-accessori/pavesi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">PAVESI</Link>
                              </div>
                            </div>
                          )}

                          {/* Carburatori Submenu */}
                          {activeSubmenu === 'carburatori' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Carburatori
                              </h4>
                              <div className="space-y-2">
                                <Link href="/products/carburatori/attrezzatura-carburatori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Attrezzatura Carburatori</Link>
                                <Link href="/products/carburatori/dellorto-ricambi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carburatori Dellorto e ricambi</Link>
                                <Link href="/products/carburatori/ibea-ricambi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carburatori IBEA e ricambi</Link>
                                <Link href="/products/carburatori/tillotson-ricambi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carburatori Tillotson e ricambi</Link>
                                <Link href="/products/carburatori/tryton-ricambi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carburatori Tryton e ricambi</Link>
                                <Link href="/products/carburatori/walbro-ricambi" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Carburatori WALBRO e ricambi</Link>
                              </div>
                            </div>
                          )}

                          {/* Radiatori Submenu */}
                          {activeSubmenu === 'radiatori' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Radiatori e Accessori
                              </h4>
                              <div className="space-y-2">
                                <Link href="/products/radiatori-accessori/radiatori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Radiatori</Link>
                                <Link href="/products/radiatori-accessori/staffe-attacchi-radiatore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Staffe & Attacchi Radiatore</Link>
                                <Link href="/products/radiatori-accessori/tubi-radiatore-acqua" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Tubi Radiatore Acqua</Link>
                                <Link href="/products/radiatori-accessori/pompa-acqua-accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pompa acqua & Accessori</Link>
                                <Link href="/products/radiatori-accessori/accessori-per-radiatore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Accessori per Radiatore</Link>
                                <Link href="/products/radiatori-accessori/tendine-radiatore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Tendine Radiatore</Link>
                              </div>
                            </div>
                          )}

                          {/* Pneumatici Submenu */}
                          {activeSubmenu === 'pneumatici' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Pneumatici / Gomme
                              </h4>
                              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
                                <Link href="/products/pneumatici-gomme/lecont" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici LeCont</Link>
                                <Link href="/products/pneumatici-gomme/vega" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Vega</Link>
                                <Link href="/products/pneumatici-gomme/maxxis" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Maxxis</Link>
                                <Link href="/products/pneumatici-gomme/mg" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici MG</Link>
                                <Link href="/products/pneumatici-gomme/komet" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Komet</Link>
                                <Link href="/products/pneumatici-gomme/easykart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Easykart</Link>
                                <Link href="/products/pneumatici-gomme/bridgestone" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Bridgestone</Link>
                                <Link href="/products/pneumatici-gomme/dunlop" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Pneumatici Dunlop</Link>
                                <Link href="/products/pneumatici-gomme/accessori" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Accessori pneumatici</Link>
                                <Link href="/products/pneumatici-gomme/attrezzatura" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Attrezzatura pneumatici</Link>
                              </div>
                            </div>
                          )}

                          {/* Telemetrie Submenu */}
                          {activeSubmenu === 'telemetrie' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Telemetrie & Crono
                              </h4>
                              <div className="space-y-2">
                                <Link href="/products/telemetrie-crono/aim-mychron" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">AIM MyChron</Link>
                                <Link href="/products/telemetrie-crono/alfano" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Alfano</Link>
                                <Link href="/products/telemetrie-crono/unipro" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Unipro</Link>
                                <Link href="/products/telemetrie-crono/starlane" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Starlane</Link>
                                <Link href="/products/telemetrie-crono/contagiri-rpm-contaore" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Contagiri RPM - Contaore</Link>
                                <Link href="/products/telemetrie-crono/cronometri" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Cronometri</Link>
                                <Link href="/products/telemetrie-crono/termometri-acqua" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Termometri acqua</Link>
                              </div>
                            </div>
                          )}

                          {/* Motori Nuovi Submenu */}
                          {activeSubmenu === 'motori-nuovi' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Motori Nuovi
                              </h4>
                              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
                                <Link href="/products/motori-nuovi/tm-racing" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori TM Racing</Link>
                                <Link href="/products/motori-nuovi/iame" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Iame</Link>
                                <Link href="/products/motori-nuovi/vortex" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Vortex</Link>
                                <Link href="/products/motori-nuovi/bmb" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori BMB</Link>
                                <Link href="/products/motori-nuovi/modena-engines" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Modena Engines</Link>
                                <Link href="/products/motori-nuovi/rotax" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Rotax</Link>
                                <Link href="/products/motori-nuovi/comer" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Comer</Link>
                                <Link href="/products/motori-nuovi/lke" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori LKE</Link>
                                <Link href="/products/motori-nuovi/briggs-stratton" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Motori Briggs & Stratton</Link>
                              </div>
                            </div>
                          )}

                          {/* Telai Nuovi Submenu */}
                          {activeSubmenu === 'telai-nuovi' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Telai Nuovi
                              </h4>
                              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
                                <Link href="/products/telai-nuovi/crg" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai CRG</Link>
                                <Link href="/products/telai-nuovi/birelart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai BirelArt</Link>
                                <Link href="/products/telai-nuovi/top-kart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Top-Kart</Link>
                                <Link href="/products/telai-nuovi/formula-k" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Formula K</Link>
                                <Link href="/products/telai-nuovi/praga" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Praga</Link>
                                <Link href="/products/telai-nuovi/kart-republic-kr" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Kart Republic KR</Link>
                                <Link href="/products/telai-nuovi/tony-kart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Tony Kart</Link>
                                <Link href="/products/telai-nuovi/parolin" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Parolin</Link>
                                <Link href="/products/telai-nuovi/kosmic" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Kosmic</Link>
                                <Link href="/products/telai-nuovi/maranello" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Maranello</Link>
                                <Link href="/products/telai-nuovi/ckr" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai CKR</Link>
                                <Link href="/products/telai-nuovi/intrepid" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Telai Intrepid</Link>
                              </div>
                            </div>
                          )}

                          {/* Kart Completi Submenu */}
                          {activeSubmenu === 'kart-completi' && (
                            <div>
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                                Kart Completi
                              </h4>
                              <div className="space-y-2">
                                <Link href="/products/kart-completi/crg" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi CRG</Link>
                                <Link href="/products/kart-completi/tony-kart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi Tony Kart</Link>
                                <Link href="/products/kart-completi/birelart-kgp" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi BirelArt & KGP</Link>
                                <Link href="/products/kart-completi/top-kart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi Top-Kart</Link>
                                <Link href="/products/kart-completi/kart-republic-kr" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi Kart Republic KR</Link>
                                <Link href="/products/kart-completi/easykart" className="block px-3 py-2 text-xs font-medium text-white hover:bg-[#0d5dbf] rounded transition-colors">Kart completi Easykart</Link>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Column 3 - Right Items */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-[#1877F2] dark:text-[#3b82f6] uppercase tracking-wide">
                          Equipaggiamento
                        </h4>
                        <div className="space-y-2">
                          <div
                            className="group/pneumatici relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('pneumatici')
                              setSelectedMenuItem('pneumatici')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'pneumatici'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'pneumatici' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'pneumatici'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Pneumatici / Gomme
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'pneumatici' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'pneumatici' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'pneumatici' ? '#ffffff' : '#6b7280'
                                }}>
                                  Pneumatici per tutte le condizioni di gara
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/telemetrie relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('telemetrie')
                              setSelectedMenuItem('telemetrie')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'telemetrie'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'telemetrie' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'telemetrie'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Telemetrie & Crono
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'telemetrie' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'telemetrie' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'telemetrie' ? '#ffffff' : '#6b7280'
                                }}>
                                  Sistemi di telemetria e cronometraggio
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/motori-nuovi relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('motori-nuovi')
                              setSelectedMenuItem('motori-nuovi')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'motori-nuovi'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'motori-nuovi' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'motori-nuovi'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Motori Nuovi
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'motori-nuovi' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'motori-nuovi' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'motori-nuovi' ? '#ffffff' : '#6b7280'
                                }}>
                                  Motori nuovi per ogni categoria
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/telai-nuovi relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('telai-nuovi')
                              setSelectedMenuItem('telai-nuovi')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'telai-nuovi'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'telai-nuovi' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'telai-nuovi'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Telai Nuovi
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'telai-nuovi' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'telai-nuovi' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'telai-nuovi' ? '#ffffff' : '#6b7280'
                                }}>
                                  Telai completi per competizione
                                </div>
                            </div>
                          </div>
                          <div
                            className="group/kart-completi relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('kart-completi')
                              setSelectedMenuItem('kart-completi')
                            }}
                            onMouseLeave={() => {
                              setSelectedMenuItem(null)
                            }}
                          >
                            <div
                              className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors group ${
                                selectedMenuItem === 'kart-completi'
                                  ? 'text-white'
                                  : 'hover:bg-[#0d5dbf] focus:bg-[#1877F2] dark:text-racing-gray-100'
                              }`}
                              style={selectedMenuItem === 'kart-completi' ? {backgroundColor: '#1877F2', color: 'white'} : {}}
                            >
                                <div className="flex items-center justify-between">
                                  <div className={`text-sm font-medium transition-colors ${
                                    selectedMenuItem === 'kart-completi'
                                      ? 'text-white'
                                      : 'text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-white dark:group-hover:text-white'
                                  }`}>
                                    Kart Completi
                                  </div>
                                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === 'kart-completi' ? 'rotate-180' : ''} ${
                                    selectedMenuItem === 'kart-completi' ? 'text-white' : ''
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: selectedMenuItem === 'kart-completi' ? '#ffffff' : '#6b7280'
                                }}>
                                  Kart pronti per la pista
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* View All Products Button - Spanning full width */}
                      <div className={activeSubmenu ? 'col-span-3' : 'col-span-2'}>
                        <Link
                          href="/prodotti"
                          className="mt-4 block w-full py-3 px-6 text-center bg-[#1877F2] text-white font-bold rounded-lg
                            hover:bg-[#0d5dbf] transition-colors shadow-md hover:shadow-lg"
                        >
                          Vedi Tutti i Prodotti →
                        </Link>
                      </div>

                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Simple Navigation Items */}
                {[
                  { title: 'Calendario', href: '/calendar' },
                  { title: 'Risultati', href: '/results' },
                  { title: 'News', href: '/news' },
                  { title: 'Sponsor', href: '/sponsors' },
                  { title: 'Chi Siamo', href: '/about' },
                ].map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative inline-flex h-12 w-max items-center justify-center rounded-lg px-4 py-2 text-base font-medium',
                        'transition-all duration-200 hover:bg-[#0d5dbf]',
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
              className="hidden md:flex bg-[#1877F2] hover:bg-[#0d5dbf]/90 text-white font-semibold px-6 py-3 h-12"
              asChild
            >
              <Link href="/contact">Contattaci</Link>
            </Button>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                'flex items-center justify-center h-12 w-12 rounded-lg',
                'transition-transform duration-200',
                'hover:scale-110',
                isScrolled
                  ? 'text-racing-gray-900 dark:text-white'
                  : 'text-white',
                isSearchOpen && 'scale-110'
              )}
              aria-label="Apri ricerca"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

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

      {/* Search Dropdown */}
      <motion.div
        ref={searchContainerRef}
        initial={false}
        animate={{
          height: isSearchOpen ? 'auto' : 0,
          opacity: isSearchOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        {isSearchOpen && (
          <div className="bg-transparent">
            <div className="container mx-auto px-4 py-1">
              <div className="relative max-w-2xl mx-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca prodotti, categorie, marchi..."
                  className={cn(
                    'w-full h-12 pl-12 pr-12 rounded-lg border-2 border-[#1877F2]',
                    'focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent',
                    'transition-colors text-base',
                    'bg-white dark:bg-slate-800 text-racing-gray-900 dark:text-white',
                    'placeholder:text-racing-gray-500 dark:placeholder:text-slate-400'
                  )}
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-racing-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  aria-label="Chiudi ricerca"
                >
                  <svg
                    className="h-5 w-5 text-racing-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search suggestions/results can go here */}
              {searchQuery && (
                <div className="max-w-2xl mx-auto mt-4">
                  <p className="text-sm text-racing-gray-600 dark:text-slate-400">
                    Premi Enter per cercare "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.nav>
  )
}