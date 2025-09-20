'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="absolute left-4 top-4 z-50 -translate-y-20 bg-racing-red text-white px-4 py-2 rounded-md font-medium focus:translate-y-0 focus:ring-2 focus:ring-racing-red focus:ring-offset-2 focus:outline-none transition-transform duration-200"
      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
    >
      Skip to main content
    </a>
  )
}