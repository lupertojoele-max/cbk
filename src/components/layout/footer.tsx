import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-racing-gray-900 dark:bg-racing-gray-100 text-white dark:text-racing-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/images/cbk-logo.png"
                alt="CBK Racing Logo"
                width={60}
                height={24}
                className="h-6 w-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-racing-gray-300 dark:text-racing-gray-600 text-sm leading-relaxed">
              Professional go-kart racing team competing in national and international championships.
              Experience the thrill of motorsport with cutting-edge technology and passionate drivers.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-racing-red text-racing-red">
                Est. 2020
              </Badge>
              <Badge variant="outline" className="border-racing-gray-400 text-racing-gray-300">
                Pro Team
              </Badge>
            </div>
          </div>

          {/* Racing Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-racing-red dark:text-racing-red-light">Racing</h3>
            <div className="space-y-2">
              <Link
                href="/events"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Upcoming Events
              </Link>
              <Link
                href="/results"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Race Results
              </Link>
              <Link
                href="/championship"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Championship Standings
              </Link>
              <Link
                href="/calendar"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Racing Calendar
              </Link>
              <Link
                href="/live-timing"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Live Timing
              </Link>
            </div>
          </div>

          {/* Team Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-racing-red dark:text-racing-red-light">Our Team</h3>
            <div className="space-y-2">
              <Link
                href="/drivers"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Professional Drivers
              </Link>
              <Link
                href="/karts"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Racing Fleet
              </Link>
              <Link
                href="/technical"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Technical Team
              </Link>
              <Link
                href="/history"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Team History
              </Link>
              <Link
                href="/achievements"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Achievements
              </Link>
            </div>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-racing-red dark:text-racing-red-light">Connect</h3>
            <div className="space-y-2">
              <Link
                href="/news"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Latest News
              </Link>
              <Link
                href="/media"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Media Gallery
              </Link>
              <Link
                href="/sponsors"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Our Sponsors
              </Link>
              <Link
                href="/contact"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/join"
                className="block text-racing-gray-300 dark:text-racing-gray-600 hover:text-racing-red dark:hover:text-racing-red-light transition-colors text-sm"
              >
                Join Our Team
              </Link>
            </div>

            {/* Social Media */}
            <div className="pt-2">
              <p className="text-sm font-medium text-racing-gray-400 dark:text-racing-gray-500 mb-2">Follow Us</p>
              <div className="flex space-x-3">
                <Link
                  href="https://instagram.com/cbkracing"
                  className="text-racing-gray-400 dark:text-racing-gray-500 hover:text-racing-red dark:hover:text-racing-red-light transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987s11.987-5.366 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </Link>
                <Link
                  href="https://facebook.com/cbkracing"
                  className="text-racing-gray-400 dark:text-racing-gray-500 hover:text-racing-red dark:hover:text-racing-red-light transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
                <Link
                  href="https://twitter.com/cbkracing"
                  className="text-racing-gray-400 dark:text-racing-gray-500 hover:text-racing-red dark:hover:text-racing-red-light transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
                <Link
                  href="https://youtube.com/cbkracing"
                  className="text-racing-gray-400 dark:text-racing-gray-500 hover:text-racing-red dark:hover:text-racing-red-light transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-racing-gray-800 dark:border-racing-gray-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-racing-gray-400 dark:text-racing-gray-500">
              <p>&copy; {currentYear} CBK Racing. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="hover:text-racing-red dark:hover:text-racing-red-light transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-racing-red dark:hover:text-racing-red-light transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-racing-red dark:hover:text-racing-red-light transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-racing-gray-400 dark:text-racing-gray-500">
              <span>Made with</span>
              <span className="text-racing-red dark:text-racing-red-light">❤️</span>
              <span>for motorsport</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}