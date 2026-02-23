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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-gradient-to-b from-black/30 to-transparent'
      )}
      animate={{
        height: isScrolled ? '70px' : '80px',
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
                      'group h-10 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full bg-transparent',
                      'focus:outline-none',
                      'data-[state=open]:bg-[#1877F2] data-[state=open]:text-white',
                      isScrolled
                        ? 'text-gray-800 dark:text-gray-200 hover:bg-[#1877F2] hover:text-white'
                        : 'text-white hover:bg-[#1877F2]/80 hover:text-white',
                      isActivePath('/events') || isActivePath('/drivers') || isActivePath('/karts')
                        ? 'font-semibold'
                        : ''
                    )}
                    onFocus={() => setFocusedItem('racing')}
                  >
                    Club
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[700px] grid-cols-3 gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-800">
                      {/* Menu Sections */}
                      {megaMenuData.racing.sections.map((section) => (
                        <div key={section.title} className="space-y-3">
                          <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3">
                            {section.title}
                          </h4>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <NavigationMenuLink key={item.href} asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'block select-none rounded-xl p-3 no-underline outline-none',
                                    'transition-all duration-200',
                                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                                    'group'
                                  )}
                                  onFocus={() => setFocusedItem(item.href)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
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
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">In Evidenza</span>
                            <NavigationMenuLink asChild>
                              <Link
                                href={featured.href}
                                className="block mt-2 no-underline outline-none hover:opacity-90 transition-opacity"
                              >
                                <div className="text-sm font-semibold">
                                  {featured.title}
                                </div>
                                <p className="mt-1 text-xs opacity-90 leading-relaxed">
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
                      'group h-10 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full bg-transparent',
                      'focus:outline-none',
                      'data-[state=open]:bg-[#1877F2] data-[state=open]:text-white',
                      isScrolled
                        ? 'text-gray-800 dark:text-gray-200 hover:bg-[#1877F2] hover:text-white'
                        : 'text-white hover:bg-[#1877F2]/80 hover:text-white',
                      isActivePath('/products') ? 'font-semibold' : ''
                    )}
                    onFocus={() => setFocusedItem('products')}
                  >
                    Prodotti
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div
                      className={`grid gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-800 transition-all duration-300 ${
                        activeSubmenu ? 'w-[850px] grid-cols-3' : 'w-[550px] grid-cols-2'
                      }`}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      {/* Column 1 - Left Items */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
                          Componenti Kart
                        </h4>
                        <div className="space-y-1">
                          {[
                            { key: 'telaio', title: 'Telaio e Accessori', href: '/products/telaio-accessori' },
                            { key: 'motore', title: 'Motore e Accessori', href: null },
                            { key: 'carburatori', title: 'Carburatori', href: null },
                            { key: 'radiatori', title: 'Radiatori', href: null },
                            { key: 'cuscinetti', title: 'Cuscinetti e Molle', href: null },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="group relative"
                              onMouseEnter={() => {
                                setActiveSubmenu(item.key)
                                setSelectedMenuItem(item.key)
                              }}
                            >
                              {item.href ? (
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
                                    activeSubmenu === item.key
                                      ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                                  )}
                                >
                                  <span className="text-sm font-medium">{item.title}</span>
                                  <svg className={cn('w-4 h-4 transition-transform', activeSubmenu === item.key && 'rotate-90')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              ) : (
                                <div
                                  className={cn(
                                    'flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
                                    activeSubmenu === item.key
                                      ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                                  )}
                                >
                                  <span className="text-sm font-medium">{item.title}</span>
                                  <svg className={cn('w-4 h-4 transition-transform', activeSubmenu === item.key && 'rotate-90')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2 - Central Submenu */}
                      {activeSubmenu && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          {/* Telaio Submenu */}
                          {activeSubmenu === 'telaio' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sottocategorie</h4>
                              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                {['Freni e Accessori', 'Cerchi, Mozzi e Accessori', 'Assali chiavette e cuscinetti', 'Corone, Catene e accessori', 'Carenature, staffe e paraurti', 'Leve cambio e frizione', 'Pedali e accessori', 'Piantone e Accessori', 'Portacorona e Porta disco', 'Serbatoio e Tubi Benzina', 'Sedili e accessori', 'Uniball', 'Volanti e accessori', 'Barra stabilizzatrici'].map((item) => (
                                  <Link key={item} href={`/products/telaio-accessori/${item.toLowerCase().replace(/[,\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cuscinetti Submenu */}
                          {activeSubmenu === 'cuscinetti' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cuscinetti e Molle</h4>
                              <div className="space-y-0.5">
                                {['Molle', 'Cuscinetti Telaio', 'Cuscinetti Motore', 'Snodi Sferici, Uniball', 'Paraoli, Anelli Tenuta', 'Gabbie a Rulli'].map((item) => (
                                  <Link key={item} href={`/products/cuscinetti-paraoli-molle/${item.toLowerCase().replace(/[,\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Motore Submenu */}
                          {activeSubmenu === 'motore' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Motore e Accessori</h4>
                              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                {['Ricambi Generici Motore', 'IAME', 'TM RACING', 'BMB / BLUEBIRD', 'ROTAX', 'VORTEX', 'COMER', 'LKE (LENZO)', 'MAXTER', 'MODENA ENGINES', 'WTP 60', 'PAVESI'].map((item) => (
                                  <Link key={item} href={`/products/motore-accessori/${item.toLowerCase().replace(/[\/\s()]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Carburatori Submenu */}
                          {activeSubmenu === 'carburatori' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Carburatori</h4>
                              <div className="space-y-0.5">
                                {['Attrezzatura Carburatori', 'Dellorto e ricambi', 'IBEA e ricambi', 'Tillotson e ricambi', 'Tryton e ricambi', 'WALBRO e ricambi'].map((item) => (
                                  <Link key={item} href={`/products/carburatori/${item.toLowerCase().replace(/[\/\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Radiatori Submenu */}
                          {activeSubmenu === 'radiatori' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Radiatori e Accessori</h4>
                              <div className="space-y-0.5">
                                {['Radiatori', 'Staffe & Attacchi', 'Tubi Radiatore', 'Pompa acqua', 'Accessori', 'Tendine'].map((item) => (
                                  <Link key={item} href={`/products/radiatori-accessori/${item.toLowerCase().replace(/[&\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pneumatici Submenu */}
                          {activeSubmenu === 'pneumatici' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pneumatici / Gomme</h4>
                              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                {['LeCont', 'Vega', 'Maxxis', 'MG', 'Komet', 'Easykart', 'Bridgestone', 'Dunlop', 'Accessori', 'Attrezzatura'].map((item) => (
                                  <Link key={item} href={`/products/pneumatici-gomme/${item.toLowerCase()}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Telemetrie Submenu */}
                          {activeSubmenu === 'telemetrie' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Telemetrie & Crono</h4>
                              <div className="space-y-0.5">
                                {['AIM MyChron', 'Alfano', 'Unipro', 'Starlane', 'Contagiri RPM', 'Cronometri', 'Termometri'].map((item) => (
                                  <Link key={item} href={`/products/telemetrie-crono/${item.toLowerCase().replace(/\s+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Motori Nuovi Submenu */}
                          {activeSubmenu === 'motori-nuovi' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Motori Nuovi</h4>
                              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                {['TM Racing', 'Iame', 'Vortex', 'BMB', 'Modena Engines', 'Rotax', 'Comer', 'LKE', 'Briggs & Stratton'].map((item) => (
                                  <Link key={item} href={`/products/motori-nuovi/${item.toLowerCase().replace(/[&\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Telai Nuovi Submenu */}
                          {activeSubmenu === 'telai-nuovi' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Telai Nuovi</h4>
                              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                {['CRG', 'BirelArt', 'Top-Kart', 'Formula K', 'Praga', 'Kart Republic', 'Tony Kart', 'Parolin', 'Kosmic', 'Maranello', 'CKR', 'Intrepid'].map((item) => (
                                  <Link key={item} href={`/products/telai-nuovi/${item.toLowerCase().replace(/\s+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Kart Completi Submenu */}
                          {activeSubmenu === 'kart-completi' && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kart Completi</h4>
                              <div className="space-y-0.5">
                                {['CRG', 'Tony Kart', 'BirelArt & KGP', 'Top-Kart', 'Kart Republic', 'Easykart'].map((item) => (
                                  <Link key={item} href={`/products/kart-completi/${item.toLowerCase().replace(/[&\s]+/g, '-')}`} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors">{item}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Column 3 - Right Items */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
                          Equipaggiamento
                        </h4>
                        <div className="space-y-1">
                          {[
                            { key: 'pneumatici', title: 'Pneumatici / Gomme' },
                            { key: 'telemetrie', title: 'Telemetrie & Crono' },
                            { key: 'motori-nuovi', title: 'Motori Nuovi' },
                            { key: 'telai-nuovi', title: 'Telai Nuovi' },
                            { key: 'kart-completi', title: 'Kart Completi' },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="group relative"
                              onMouseEnter={() => {
                                setActiveSubmenu(item.key)
                                setSelectedMenuItem(item.key)
                              }}
                            >
                              <div
                                className={cn(
                                  'flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
                                  activeSubmenu === item.key
                                    ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                                )}
                              >
                                <span className="text-sm font-medium">{item.title}</span>
                                <svg className={cn('w-4 h-4 transition-transform', activeSubmenu === item.key && 'rotate-90')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View All Products Button - Spanning full width */}
                      <div className={activeSubmenu ? 'col-span-3' : 'col-span-2'}>
                        <Link
                          href="/prodotti"
                          className="mt-2 block w-full py-3 px-6 text-center bg-blue-600 text-white font-semibold rounded-xl
                            hover:bg-blue-700 transition-all duration-200"
                        >
                          Vedi Tutti i Prodotti
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
                  { title: 'Chi Siamo', href: '/about' },
                ].map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium',
                        'transition-all duration-300',
                        'focus:outline-none',
                        isScrolled
                          ? 'text-gray-800 dark:text-gray-200 hover:bg-[#1877F2] hover:text-white'
                          : 'text-white hover:bg-[#1877F2]/80 hover:text-white',
                        isActivePath(item.href) ? 'font-semibold' : ''
                      )}
                      onFocus={() => setFocusedItem(item.href)}
                      onBlur={() => setFocusedItem(null)}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-3">
            <Link
              href="/contact"
              className={cn(
                'hidden md:flex items-center justify-center px-5 py-2 text-sm font-medium rounded-full transition-all duration-300',
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700'
                  : 'bg-white text-gray-900 hover:bg-white/90'
              )}
            >
              Contattaci
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                'flex items-center justify-center h-10 w-10 rounded-full',
                'transition-all duration-300',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                isScrolled
                  ? 'text-gray-700 dark:text-gray-200'
                  : 'text-white hover:bg-white/10',
                isSearchOpen && 'bg-gray-100 dark:bg-gray-800'
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