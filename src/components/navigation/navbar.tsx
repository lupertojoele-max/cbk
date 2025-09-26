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
                  src={isScrolled ? "/images/cbk-logo-black.png" : "/images/cbk-logo.png"}
                  alt="CBK Racing Logo"
                  width={160}
                  height={64}
                  priority
                  className="h-16 w-auto object-contain transition-opacity duration-300"
                  style={{ width: 'auto', height: 'auto' }}
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
                                    'transition-colors hover:bg-[#1877F2]',
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
                          <div className="group/telaio relative">
                            <NavigationMenuLink asChild>
                              <div className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">
                                    Telaio e Accessori
                                  </div>
                                  <svg className="w-4 h-4 transition-transform group-hover/telaio:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                  Telai, ammortizzatori e componenti strutturali
                                </p>
                              </div>
                            </NavigationMenuLink>
                            <div className="absolute left-full top-0 ml-2 w-64 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover/telaio:opacity-100 group-hover/telaio:visible transition-all duration-200 z-50">
                              <div className="p-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-racing-gray-300 dark:scrollbar-thumb-racing-gray-600 scrollbar-track-transparent">
                                <div className="space-y-2">
                                  <Link href="/products/telaio-accessori/freni-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Freni e Accessori</Link>
                                  <Link href="/products/telaio-accessori/cerchi-mozzi-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Cerchi, Mozzi e Accessori</Link>
                                  <Link href="/products/telaio-accessori/assali-chiavette-e-cuscinetti" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Assali chiavette e cuscinetti</Link>
                                  <Link href="/products/telaio-accessori/corone-catene-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Corone, Catene e accessori</Link>
                                  <Link href="/products/telaio-accessori/carenature-staffe-e-paraurti" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carenature, staffe e paraurti</Link>
                                  <Link href="/products/telaio-accessori/leve-cambio-e-frizione" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Leve cambio e frizione</Link>
                                  <Link href="/products/telaio-accessori/pedali-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Pedali e accessori</Link>
                                  <Link href="/products/telaio-accessori/piantone-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Piantone e Accessori</Link>
                                  <Link href="/products/telaio-accessori/portacorona-e-porta-disco" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Portacorona e Porta disco</Link>
                                  <Link href="/products/telaio-accessori/serbatoio-e-tubi-benzina" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Serbatoio e Tubi Benzina</Link>
                                  <Link href="/products/telaio-accessori/sedili-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Sedili e accessori</Link>
                                  <Link href="/products/telaio-accessori/uniball" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Uniball</Link>
                                  <Link href="/products/telaio-accessori/volanti-e-accessori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Volanti e accessori</Link>
                                  <Link href="/products/telaio-accessori/barra-stabilizzatrici" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Barra stabilizzatrici</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="group/motore relative">
                            <NavigationMenuLink asChild>
                              <div className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">
                                    Motore e Accessori
                                  </div>
                                  <svg className="w-4 h-4 transition-transform group-hover/motore:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                  Componenti motore e ricambi per prestazioni
                                </p>
                              </div>
                            </NavigationMenuLink>
                            <div className="absolute left-full top-0 ml-2 w-64 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover/motore:opacity-100 group-hover/motore:visible transition-all duration-200 z-50">
                              <div className="p-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-racing-gray-300 dark:scrollbar-thumb-racing-gray-600 scrollbar-track-transparent">
                                <div className="space-y-2">
                                  <Link href="/products/motore-accessori/ricambi-generici-motore" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Ricambi Generici Motore</Link>
                                  <Link href="/products/motore-accessori/iame" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">IAME</Link>
                                  <Link href="/products/motore-accessori/tm-racing" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">TM RACING</Link>
                                  <Link href="/products/motore-accessori/bmb-bluebird" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">BMB / BLUEBIRD</Link>
                                  <Link href="/products/motore-accessori/rotax" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">ROTAX</Link>
                                  <Link href="/products/motore-accessori/vortex" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">VORTEX</Link>
                                  <Link href="/products/motore-accessori/comer" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">COMER</Link>
                                  <Link href="/products/motore-accessori/lke-lenzo" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">LKE (LENZO)</Link>
                                  <Link href="/products/motore-accessori/maxter" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">MAXTER</Link>
                                  <Link href="/products/motore-accessori/modena-engines" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">MODENA ENGINES</Link>
                                  <Link href="/products/motore-accessori/wtp-60" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">WTP 60</Link>
                                  <Link href="/products/motore-accessori/pavesi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">PAVESI</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="group/carburatori relative">
                            <NavigationMenuLink asChild>
                              <div className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">
                                    Carburatori
                                  </div>
                                  <svg className="w-4 h-4 transition-transform group-hover/carburatori:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                  Carburatori e sistemi di alimentazione
                                </p>
                              </div>
                            </NavigationMenuLink>
                            <div className="absolute left-full top-0 ml-2 w-64 bg-white dark:bg-racing-gray-800 border dark:border-racing-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover/carburatori:opacity-100 group-hover/carburatori:visible transition-all duration-200 z-50">
                              <div className="p-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-racing-gray-300 dark:scrollbar-thumb-racing-gray-600 scrollbar-track-transparent">
                                <div className="space-y-2">
                                  <Link href="/products/carburatori/attrezzatura-carburatori" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Attrezzatura Carburatori</Link>
                                  <Link href="/products/carburatori/dellorto-ricambi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carburatori Dellorto e ricambi</Link>
                                  <Link href="/products/carburatori/ibea-ricambi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carburatori IBEA e ricambi</Link>
                                  <Link href="/products/carburatori/tillotson-ricambi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carburatori Tillotson e ricambi</Link>
                                  <Link href="/products/carburatori/tryton-ricambi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carburatori Tryton e ricambi</Link>
                                  <Link href="/products/carburatori/walbro-ricambi" className="block px-3 py-2 text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 hover:bg-[#1877F2] hover:text-white rounded transition-colors">Carburatori WALBRO e ricambi</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/radiatori-accessori"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Radiatori e Accessori</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Sistemi di raffreddamento e componenti
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/cuscinetti-paraoli-molle"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Cuscinetti Paraoli Molle</div>
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
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Pneumatici / Gomme</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Pneumatici per tutte le condizioni di gara
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/telemetrie-crono"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Telemetrie & Crono</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Sistemi di telemetria e cronometraggio
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/motori-nuovi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Motori Nuovi</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Motori nuovi per ogni categoria
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/telai-nuovi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Telai Nuovi</div>
                              <p className="line-clamp-2 text-xs text-racing-gray-600 dark:text-racing-gray-400">
                                Telai completi per competizione
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/products/kart-completi"
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[#1877F2] focus:bg-[#1877F2] dark:text-racing-gray-100 group"
                            >
                              <div className="text-sm font-medium text-racing-gray-900 dark:text-racing-gray-100 group-hover:text-[#1877F2] dark:group-hover:text-[#3b82f6]">Kart Completi</div>
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