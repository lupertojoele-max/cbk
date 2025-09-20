'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Filter, X, Search } from 'lucide-react'

export interface KartFilters {
  category?: string
  condition?: string
  availability?: string
  search?: string
}

interface KartFiltersProps {
  onFiltersChange: (filters: KartFilters) => void
  totalCount: number
  filteredCount: number
}

const CATEGORY_OPTIONS = [
  { value: 'Senior', label: 'Senior', description: 'High-performance senior category' },
  { value: 'Junior', label: 'Junior', description: 'Junior category racing' },
  { value: 'Cadet', label: 'Cadet', description: 'Beginner-friendly cadet class' },
  { value: 'Masters', label: 'Masters', description: 'Masters category racing' },
]

const CONDITION_OPTIONS = [
  { value: 'Excellent', label: 'Excellent', color: 'bg-green-500' },
  { value: 'Good', label: 'Good', color: 'bg-blue-500' },
  { value: 'Fair', label: 'Fair', color: 'bg-yellow-500' },
  { value: 'Maintenance', label: 'Maintenance', color: 'bg-orange-500' },
]

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available', description: 'Ready for racing' },
  { value: 'in-use', label: 'In Use', description: 'Currently in use' },
  { value: 'all', label: 'All Karts', description: 'Show all karts' },
]

export function KartFilters({ onFiltersChange, totalCount, filteredCount }: KartFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<KartFilters>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Initialize filters from URL
  useEffect(() => {
    const initialFilters: KartFilters = {
      category: searchParams.get('category') || undefined,
      condition: searchParams.get('condition') || undefined,
      availability: searchParams.get('availability') || undefined,
      search: searchParams.get('search') || undefined,
    }

    setFilters(initialFilters)
    setSearchValue(initialFilters.search || '')
    onFiltersChange(initialFilters)
  }, [searchParams, onFiltersChange])

  // Update URL when filters change
  const updateURL = (newFilters: KartFilters) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(newUrl, { scroll: false })
  }

  const handleFilterChange = (key: keyof KartFilters, value: string | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value === filters[key] ? undefined : value,
    }

    setFilters(newFilters)
    updateURL(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = {
      ...filters,
      search: searchValue.trim() || undefined,
    }

    setFilters(newFilters)
    updateURL(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const emptyFilters: KartFilters = {}
    setFilters(emptyFilters)
    setSearchValue('')
    updateURL(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const hasFilters = activeFilterCount > 0

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-racing-red" />
            <CardTitle className="text-xl">Filter Karts</CardTitle>
            {hasFilters && (
              <Badge variant="outline" className="border-racing-red text-racing-red">
                {activeFilterCount} active
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-racing-gray-600">
              Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} karts
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn(
        'space-y-6',
        'lg:block',
        isExpanded ? 'block' : 'hidden lg:block'
      )}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-racing-gray-400" />
              <input
                type="text"
                placeholder="Search karts by name, model, or engine..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-racing-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
              />
            </div>
            <Button type="submit" className="bg-racing-red hover:bg-racing-red/90">
              Search
            </Button>
          </div>
        </form>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-racing-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('category', option.value)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all duration-200',
                    'hover:border-racing-red hover:bg-racing-red/5',
                    filters.category === option.value
                      ? 'border-racing-red bg-racing-red/10 text-racing-red'
                      : 'border-racing-gray-200 text-racing-gray-700'
                  )}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-racing-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <h4 className="font-semibold text-racing-gray-900 mb-3">Condition</h4>
            <div className="space-y-2">
              {CONDITION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('condition', option.value)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3',
                    'hover:border-racing-red hover:bg-racing-red/5',
                    filters.condition === option.value
                      ? 'border-racing-red bg-racing-red/10'
                      : 'border-racing-gray-200'
                  )}
                >
                  <div className={cn('w-3 h-3 rounded-full', option.color)} />
                  <span className={cn(
                    'font-medium',
                    filters.condition === option.value ? 'text-racing-red' : 'text-racing-gray-700'
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h4 className="font-semibold text-racing-gray-900 mb-3">Availability</h4>
            <div className="space-y-2">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('availability', option.value)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all duration-200',
                    'hover:border-racing-red hover:bg-racing-red/5',
                    filters.availability === option.value
                      ? 'border-racing-red bg-racing-red/10 text-racing-red'
                      : 'border-racing-gray-200 text-racing-gray-700'
                  )}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-racing-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters & Clear */}
          <div>
            <h4 className="font-semibold text-racing-gray-900 mb-3">Active Filters</h4>
            <div className="space-y-3">
              {hasFilters ? (
                <>
                  <div className="space-y-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value || value === 'all') return null

                      return (
                        <Badge
                          key={key}
                          variant="outline"
                          className="border-racing-red text-racing-red flex items-center justify-between w-full"
                        >
                          <span className="truncate">
                            {key}: {value}
                          </span>
                          <button
                            onClick={() => handleFilterChange(key as keyof KartFilters, undefined)}
                            className="ml-2 hover:bg-racing-red hover:text-white rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                  >
                    Clear All Filters
                  </Button>
                </>
              ) : (
                <p className="text-sm text-racing-gray-500">No active filters</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}