'use client'

import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Show a placeholder while not mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 px-0 relative overflow-hidden bg-transparent"
        disabled
      >
        <Sun className="h-5 w-5 text-white/50" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-10 w-10 px-0 relative overflow-hidden bg-transparent hover:bg-white/10 focus:bg-white/10 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className="flex items-center justify-center"
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-white" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-racing-red to-racing-gold opacity-0 hover:opacity-20 transition-opacity duration-200"
        animate={{
          background: theme === 'dark'
            ? 'linear-gradient(45deg, #ff2719, #fbbf24)'
            : 'linear-gradient(45deg, #e10600, #ffd700)'
        }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  )
}

export function ThemeToggleCompact({ isScrolled }: { isScrolled?: boolean }) {
  const { theme, toggleTheme, mounted } = useTheme()

  // Show a placeholder while not mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="inline-flex items-center justify-center h-8 w-8 rounded-md">
        <Sun className={`h-4 w-4 ${isScrolled ? 'text-racing-gray-500' : 'text-white/50'}`} />
      </div>
    )
  }

  const iconColor = isScrolled
    ? 'text-racing-gray-900 dark:text-white'
    : 'text-white'

  const hoverBg = isScrolled
    ? 'hover:bg-racing-gray-100 dark:hover:bg-racing-gray-800 focus:bg-racing-gray-100 dark:focus:bg-racing-gray-800'
    : 'hover:bg-white/10 focus:bg-white/10'

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${hoverBg} transition-colors duration-200 group`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {theme === 'light' ? (
          <Sun className={`h-4 w-4 ${iconColor} group-hover:text-racing-gold transition-colors duration-200`} />
        ) : (
          <Moon className={`h-4 w-4 ${iconColor} group-hover:text-racing-blue-light transition-colors duration-200`} />
        )}
      </motion.div>
    </button>
  )
}