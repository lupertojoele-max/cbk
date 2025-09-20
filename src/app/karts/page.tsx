'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { extractData } from '@/lib/api-utils'
import { Kart } from '@/lib/types'
import { KartFilters } from '@/components/karts/kart-filters'
import { KartCard } from '@/components/karts/kart-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Grid, List, SortAsc, SortDesc } from 'lucide-react'

type SortOption = 'name' | 'year' | 'speed' | 'wins' | 'races'
type SortDirection = 'asc' | 'desc'

export default function KartsPage() {
  const [karts, setKarts] = useState<Kart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<KartFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Load karts data
  useEffect(() => {
    const loadKarts = async () => {
      try {
        setLoading(true)
        const response = await api.karts.list({ per_page: 50 })
        const kartsData = extractData(response)
        setKarts(kartsData)
      } catch (err) {
        console.error('Failed to load karts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load karts')
      } finally {
        setLoading(false)
      }
    }

    loadKarts()
  }, [])

  // Filter and sort karts
  const filteredAndSortedKarts = useMemo(() => {
    let filtered = karts

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(kart => kart.category === filters.category)
    }

    if (filters.condition) {
      filtered = filtered.filter(kart => kart.condition === filters.condition)
    }

    if (filters.availability) {
      if (filters.availability === 'available') {
        filtered = filtered.filter(kart => kart.is_available)
      } else if (filters.availability === 'in-use') {
        filtered = filtered.filter(kart => !kart.is_available)
      }
      // 'all' shows everything
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(kart =>
        kart.name.toLowerCase().includes(searchTerm) ||
        kart.specifications.brand.toLowerCase().includes(searchTerm) ||
        kart.specifications.model.toLowerCase().includes(searchTerm) ||
        kart.specifications.engine_brand.toLowerCase().includes(searchTerm) ||
        (kart.specifications.engine_model?.toLowerCase().includes(searchTerm))
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'year':
          aValue = a.specifications.year_manufactured
          bValue = b.specifications.year_manufactured
          break
        case 'speed':
          aValue = a.specifications.max_speed_kmh
          bValue = b.specifications.max_speed_kmh
          break
        case 'wins':
          aValue = a.performance.wins
          bValue = b.performance.wins
          break
        case 'races':
          aValue = a.performance.total_races
          bValue = b.performance.total_races
          break
        default:
          return 0
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortDirection === 'asc' ? comparison : -comparison
      } else {
        const comparison = aValue - bValue
        return sortDirection === 'asc' ? comparison : -comparison
      }
    })

    return sorted
  }, [karts, filters, sortBy, sortDirection])

  const handleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-racing-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-racing-red" />
              <p className="text-racing-gray-600">Loading our racing fleet...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-racing-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-racing-gray-900 mb-4">Our Racing Fleet</h1>
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-600 mb-4">
                Unable to load our karts at the moment. Please try again later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-racing-red hover:bg-racing-red/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-racing-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-racing-gray-900 mb-4">
              Our Racing Fleet
            </h1>
            <p className="text-xl text-racing-gray-600 max-w-3xl mx-auto">
              Discover our collection of high-performance go-karts, each engineered for speed,
              precision, and racing excellence across different categories and skill levels.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-racing-red">{karts.length}</div>
              <div className="text-sm text-racing-gray-600">Total Karts</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-racing-red">
                {karts.filter(k => k.is_available).length}
              </div>
              <div className="text-sm text-racing-gray-600">Available</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-racing-red">
                {new Set(karts.map(k => k.category)).size}
              </div>
              <div className="text-sm text-racing-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-racing-red">
                {karts.reduce((sum, k) => sum + k.performance.wins, 0)}
              </div>
              <div className="text-sm text-racing-gray-600">Total Wins</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <KartFilters
          onFiltersChange={setFilters}
          totalCount={karts.length}
          filteredCount={filteredAndSortedKarts.length}
        />

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-racing-gray-600">
              {filteredAndSortedKarts.length} kart{filteredAndSortedKarts.length !== 1 ? 's' : ''}
            </span>

            {/* Categories shown */}
            <div className="flex items-center space-x-2">
              {Array.from(new Set(filteredAndSortedKarts.map(k => k.category))).map(category => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-racing-gray-600">Sort by:</span>
              <div className="flex space-x-1">
                {[
                  { key: 'name' as const, label: 'Name' },
                  { key: 'year' as const, label: 'Year' },
                  { key: 'speed' as const, label: 'Speed' },
                  { key: 'wins' as const, label: 'Wins' },
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort(option.key)}
                    className={`flex items-center space-x-1 ${
                      sortBy === option.key ? 'bg-racing-red' : ''
                    }`}
                  >
                    <span>{option.label}</span>
                    {getSortIcon(option.key)}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-racing-gray-300 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-none ${viewMode === 'grid' ? 'bg-racing-red' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-none ${viewMode === 'list' ? 'bg-racing-red' : ''}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Karts Grid/List */}
        {filteredAndSortedKarts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
              <p className="text-racing-gray-600 mb-4">
                No karts match your current filters.
              </p>
              <Button
                onClick={() => setFilters({})}
                className="bg-racing-red hover:bg-racing-red/90"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
          >
            {filteredAndSortedKarts.map((kart, index) => (
              <KartCard
                key={kart.id}
                kart={kart}
                priority={index < 6}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}