'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Trophy,
  Download,
  ChevronUp,
  ChevronDown,
  Calendar,
  BarChart3,
  Award,
  Target,
  Zap
} from 'lucide-react'
import { getSeasons, getSeasonResults } from '@/lib/api'
import { Season, SeasonResults, ChampionshipStanding } from '@/lib/types'

type SortField = 'position' | 'total_points' | 'wins' | 'podiums' | 'best_finish'
type SortDirection = 'asc' | 'desc'

export function ResultsView() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(2024)
  const [seasonResults, setSeasonResults] = useState<SeasonResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('position')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Fetch seasons on mount
  useEffect(() => {
    async function fetchSeasons() {
      try {
        const response = await getSeasons()
        setSeasons(response.data)
      } catch (error) {
        console.error('Failed to fetch seasons:', error)
      }
    }
    fetchSeasons()
  }, [])

  // Fetch season results when selected season changes
  useEffect(() => {
    async function fetchSeasonResults() {
      setLoading(true)
      try {
        const response = await getSeasonResults({ season_year: selectedSeason })
        setSeasonResults(response.data)
      } catch (error) {
        console.error('Failed to fetch season results:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSeasonResults()
  }, [selectedSeason])

  // Sort standings
  const sortedStandings = useMemo(() => {
    if (!seasonResults?.standings) return []

    return [...seasonResults.standings].sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortField) {
        case 'position':
          aValue = a.position
          bValue = b.position
          break
        case 'total_points':
          aValue = a.total_points
          bValue = b.total_points
          break
        case 'wins':
          aValue = a.wins
          bValue = b.wins
          break
        case 'podiums':
          aValue = a.podiums
          bValue = b.podiums
          break
        case 'best_finish':
          aValue = a.best_finish
          bValue = b.best_finish
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [seasonResults?.standings, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'position' || field === 'best_finish' ? 'asc' : 'desc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const exportToCSV = () => {
    if (!seasonResults?.standings) return

    const headers = ['Position', 'Driver', 'Racing Number', 'Nationality', 'Points', 'Wins', 'Podiums', 'Best Finish', 'Races Completed']
    const csvContent = [
      headers.join(','),
      ...sortedStandings.map(standing =>
        [
          standing.position,
          `"${standing.driver.full_name}"`,
          standing.driver.racing_number,
          `"${standing.driver.nationality}"`,
          standing.total_points,
          standing.wins,
          standing.podiums,
          standing.best_finish,
          standing.races_completed
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `cbk-racing-standings-${selectedSeason}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-600'
      case 2: return 'text-gray-500'
      case 3: return 'text-amber-600'
      default: return 'text-racing-gray-700'
    }
  }

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1: return 'bg-yellow-100 text-yellow-800'
      case 2: return 'bg-gray-100 text-gray-800'
      case 3: return 'bg-amber-100 text-amber-800'
      default: return 'bg-racing-gray-100 text-racing-gray-800'
    }
  }

  if (loading && !seasonResults) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8" id="standings">
      {/* Season Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-racing-gray-900 mb-1">Championship Season</h2>
              <p className="text-racing-gray-600">Select a season to view results and standings</p>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="px-4 py-2 border border-racing-gray-300 rounded-lg bg-white text-racing-gray-900 focus:ring-2 focus:ring-racing-red focus:border-transparent"
              >
                {seasons.map(season => (
                  <option key={season.id} value={season.year}>
                    {season.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={exportToCSV}
                className="bg-racing-red hover:bg-racing-red/90 text-white"
                disabled={!seasonResults?.standings?.length}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {seasonResults && (
        <>
          {/* Season Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="statistics">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-racing-gray-600 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Championship Leader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-racing-gray-900">
                  {seasonResults.statistics.most_wins_driver}
                </div>
                <p className="text-sm text-racing-gray-600">
                  {seasonResults.standings[0]?.total_points || 0} points
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-racing-gray-600 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Different Winners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-racing-gray-900">
                  {seasonResults.statistics.different_winners}
                </div>
                <p className="text-sm text-racing-gray-600">
                  Out of {seasonResults.season.completed_rounds} races
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-racing-gray-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Fastest Lap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-racing-gray-900">
                  {seasonResults.statistics.fastest_lap_record.time}s
                </div>
                <p className="text-sm text-racing-gray-600">
                  {seasonResults.statistics.fastest_lap_record.driver}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Championship Standings Table */}
          <Card>
            <CardHeader className="border-b border-racing-gray-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-racing-gray-900">
                  Championship Standings
                </CardTitle>
                <Badge variant="outline" className="text-racing-gray-600">
                  {seasonResults.standings.length} drivers
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-racing-gray-50">
                    <tr>
                      <th
                        className="text-left p-4 cursor-pointer hover:bg-racing-gray-100 transition-colors"
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1">
                          Position
                          {getSortIcon('position')}
                        </div>
                      </th>
                      <th className="text-left p-4">Driver</th>
                      <th className="text-center p-4">#</th>
                      <th className="text-center p-4">Nationality</th>
                      <th
                        className="text-center p-4 cursor-pointer hover:bg-racing-gray-100 transition-colors"
                        onClick={() => handleSort('total_points')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Points
                          {getSortIcon('total_points')}
                        </div>
                      </th>
                      <th
                        className="text-center p-4 cursor-pointer hover:bg-racing-gray-100 transition-colors"
                        onClick={() => handleSort('wins')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Wins
                          {getSortIcon('wins')}
                        </div>
                      </th>
                      <th
                        className="text-center p-4 cursor-pointer hover:bg-racing-gray-100 transition-colors"
                        onClick={() => handleSort('podiums')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Podiums
                          {getSortIcon('podiums')}
                        </div>
                      </th>
                      <th
                        className="text-center p-4 cursor-pointer hover:bg-racing-gray-100 transition-colors"
                        onClick={() => handleSort('best_finish')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Best Finish
                          {getSortIcon('best_finish')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {sortedStandings.map((standing, index) => (
                        <motion.tr
                          key={standing.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          className="border-b border-racing-gray-100 hover:bg-racing-gray-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <Badge className={getPositionBadge(standing.position)}>
                              {standing.position}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-racing-gray-900">
                              {standing.driver.full_name}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono text-sm bg-racing-gray-100 px-2 py-1 rounded">
                              {standing.driver.racing_number}
                            </span>
                          </td>
                          <td className="p-4 text-center text-sm text-racing-gray-600">
                            {standing.driver.nationality}
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-lg text-racing-gray-900">
                              {standing.total_points}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-racing-red">
                              {standing.wins}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-racing-gray-700">
                              {standing.podiums}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge className={getPositionBadge(standing.best_finish)}>
                              {standing.best_finish}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Races */}
          {seasonResults.recent_races.length > 0 && (
            <Card>
              <CardHeader className="border-b border-racing-gray-200">
                <CardTitle className="text-xl font-semibold text-racing-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Race Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {seasonResults.recent_races.slice(0, 5).map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-racing-gray-50 rounded-lg hover:bg-racing-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={getPositionBadge(result.position)}>
                          P{result.position}
                        </Badge>
                        <div>
                          <div className="font-medium text-racing-gray-900">
                            {result.driver.full_name}
                          </div>
                          <div className="text-sm text-racing-gray-600">
                            {result.event_name} • {new Date(result.event_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-racing-gray-900">
                          {result.points_earned} pts
                        </div>
                        <div className="text-sm text-racing-gray-600">
                          {result.fastest_lap && '🏁 Fastest Lap'}
                          {result.pole_position && '🥇 Pole Position'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}