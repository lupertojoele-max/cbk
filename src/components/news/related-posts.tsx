'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { News } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, TrendingUp } from 'lucide-react'

interface RelatedPostsProps {
  posts: News[]
  currentCategory: string
}

export function RelatedPosts({ posts, currentCategory }: RelatedPostsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatReadingTime = (minutes: number) => {
    return `${minutes} min`
  }

  const getImageUrl = (coverImage: any) => {
    return coverImage?.url || '/images/news-placeholder.jpg'
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-racing-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-racing-red" />
              <Badge variant="outline" className="text-racing-red border-racing-red">
                {currentCategory}
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
              Related Articles
            </h2>
            <p className="text-xl text-racing-gray-600 max-w-2xl mx-auto">
              Continue reading more stories from the {currentCategory.toLowerCase()} category
            </p>
          </motion.div>

          {/* Related Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={getImageUrl(post.cover_image)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Article Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.is_breaking && (
                        <Badge className="bg-red-500 text-white text-xs">
                          Breaking
                        </Badge>
                      )}
                      {post.is_featured && (
                        <Badge className="bg-racing-red text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Reading Time */}
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatReadingTime(post.reading_time)}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-racing-red border-racing-red text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-racing-gray-500">
                        {formatDate(post.published_at)}
                      </span>
                    </div>

                    <CardTitle className="text-lg font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-tight line-clamp-2">
                      <Link href={`/news/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>

                    <CardDescription className="text-racing-gray-600 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-racing-gray-500 mb-4">
                      <span>{post.author.name}</span>
                      <span>{post.views.toLocaleString()} views</span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full group-hover:bg-racing-red group-hover:text-white transition-colors"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/news/${post.slug}`}>
                        Read Article
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View More Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-racing-red hover:bg-racing-red/90 text-white px-8"
              asChild
            >
              <Link href={`/news?category=${encodeURIComponent(currentCategory)}`}>
                View More {currentCategory} Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}