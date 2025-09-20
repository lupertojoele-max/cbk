'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { extractData } from '@/lib/api-utils'
import { Driver } from '@/lib/types'
import { DriverCard } from '@/components/team/driver-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy, Users, Star, Target } from 'lucide-react'

export default function TeamPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true)
        const response = await api.drivers.list({ per_page: 50 })
        const driversData = extractData(response)
        setDrivers(driversData)
      } catch (err) {
        console.error('Failed to load drivers:', err)
        setError(err instanceof Error ? err.message : 'Failed to load drivers')
      } finally {
        setLoading(false)
      }
    }

    loadDrivers()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-racing-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-racing-red" />
              <p className="text-racing-gray-600">Loading our racing team...</p>
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
            <h1 className="text-3xl font-bold text-racing-gray-900 mb-4">Our Racing Team</h1>
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-600 mb-4">
                Unable to load our team at the moment. Please try again later.
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

  // Calculate team statistics
  const teamStats = {
    totalDrivers: drivers.length,
    professionals: drivers.filter(d => d.is_professional).length,
    teamMembers: drivers.filter(d => d.is_team_member).length,
    totalWins: drivers.reduce((sum, d) => sum + d.statistics.wins, 0),
    totalPodiums: drivers.reduce((sum, d) => sum + d.statistics.podiums, 0),
    totalChampionships: drivers.reduce((sum, d) => sum + d.statistics.championships, 0),
  }

  // Group drivers by category for better organization
  const driversByCategory = drivers.reduce((acc, driver) => {
    if (!acc[driver.category]) {
      acc[driver.category] = []
    }
    acc[driver.category].push(driver)
    return acc
  }, {} as Record<string, Driver[]>)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-racing-gray-50 pt-24"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div variants={headerVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-racing-gray-900 mb-6">
            Our Racing Team
          </h1>
          <p className="text-xl text-racing-gray-600 max-w-4xl mx-auto mb-8">
            Meet the talented drivers who represent CBK Racing across various categories.
            From seasoned professionals to rising stars, our team combines experience,
            skill, and passion for competitive karting.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(driversByCategory).map(category => (
              <Badge key={category} variant="outline" className="text-sm">
                {category} ({driversByCategory[category].length})
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Team Statistics */}
        <motion.div variants={statsVariants} className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Users className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.totalDrivers}</div>
              <div className="text-sm text-racing-gray-600">Total Drivers</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Star className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.professionals}</div>
              <div className="text-sm text-racing-gray-600">Professionals</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Target className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.teamMembers}</div>
              <div className="text-sm text-racing-gray-600">Team Members</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Trophy className="w-8 h-8 text-racing-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.totalWins}</div>
              <div className="text-sm text-racing-gray-600">Total Wins</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.totalPodiums}</div>
              <div className="text-sm text-racing-gray-600">Podiums</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="text-3xl font-bold text-racing-gray-900">{teamStats.totalChampionships}</div>
              <div className="text-sm text-racing-gray-600">Championships</div>
            </div>
          </div>
        </motion.div>

        {/* Drivers by Category */}
        {Object.entries(driversByCategory).map(([category, categoryDrivers], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-racing-gray-900 mb-4">
                {category} Category
              </h2>
              <div className="w-24 h-1 bg-racing-red rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryDrivers.map((driver, index) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  index={index + categoryIndex * 3}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 py-16 bg-racing-gray-900 rounded-2xl text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Racing Team</h2>
          <p className="text-xl text-racing-gray-300 mb-8 max-w-2xl mx-auto">
            Are you passionate about karting? We're always looking for talented drivers
            to join our competitive racing team across all categories.
          </p>
          <Button
            size="lg"
            className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-4 text-lg"
          >
            Contact Us
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}