'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { getNews } from '@/lib/api'
import { News, ApiResponse } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

interface NewsGridProps {
  page: number
  category?: string
}

const categories = [
  'All',
  'Race Results',
  'Team News',
  'Driver News',
  'Technical',
  'Championships'
]

export function NewsGrid({ page, category }: NewsGridProps) {
  const [news, setNews] = useState<News[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category || 'All')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const params: any = {
          page,
          per_page: 9
        }

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory
        }

        const response = await getNews(params)
        setNews(response.data)
        setTotalPages(response.meta?.last_page || 1)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [page, selectedCategory])

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    const params = new URLSearchParams(searchParams.toString())

    if (newCategory === 'All') {
      params.delete('category')
    } else {
      params.set('category', newCategory)
    }
    params.delete('page') // Reset to first page when changing category

    router.push(`/news?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/news?${params.toString()}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadingTime = (minutes: number) => {
    return `${minutes} min read`
  }

  const getImageUrl = (coverImage: any) => {
    return coverImage?.url || '/images/news-placeholder.jpg'
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8" id="latest-news">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(cat)}
            className={`
              ${selectedCategory === cat
                ? 'bg-racing-red hover:bg-racing-red/90 text-white'
                : 'hover:bg-racing-red/10 hover:text-racing-red'
              }
            `}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${page}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {news.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={getImageUrl(article.cover_image)}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Article Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {article.is_breaking && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        Breaking
                      </Badge>
                    )}
                    {article.is_featured && (
                      <Badge className="bg-racing-red text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Reading Time */}
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatReadingTime(article.reading_time)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-racing-red border-racing-red">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-racing-gray-500">
                      {formatDate(article.published_at)}
                    </span>
                  </div>

                  <CardTitle className="text-xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-tight line-clamp-2">
                    <Link href={`/news/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </CardTitle>

                  <CardDescription className="text-racing-gray-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center justify-between text-sm text-racing-gray-500 mb-4 pt-4 border-t border-racing-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{article.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full group-hover:bg-racing-red group-hover:text-white transition-colors"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/news/${article.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {news.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-racing-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-racing-gray-600 mb-2">No articles found</h3>
          <p className="text-racing-gray-500">
            {selectedCategory !== 'All'
              ? `No articles found in "${selectedCategory}" category.`
              : 'No articles available at the moment.'
            }
          </p>
          {selectedCategory !== 'All' && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => handleCategoryChange('All')}
            >
              View All Articles
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (page <= 3) {
              pageNum = i + 1
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = page - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 p-0 ${
                  page === pageNum
                    ? 'bg-racing-red hover:bg-racing-red/90'
                    : 'hover:bg-racing-red/10 hover:text-racing-red'
                }`}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
}