'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { News } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Eye, User, Calendar, Share2, BookOpen } from 'lucide-react'

interface NewsPostProps {
  article: News
}

export function NewsPost({ article }: NewsPostProps) {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/news" className="flex items-center gap-2 text-racing-gray-600 hover:text-racing-red">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={getImageUrl(article.cover_image)}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />

        {/* Overlay with article info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Article Badges */}
              <div className="flex gap-2 mb-4">
                {article.is_breaking && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    Breaking News
                  </Badge>
                )}
                {article.is_featured && (
                  <Badge className="bg-racing-red text-white">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {article.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight racing-text-shadow">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-200 mb-6 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatReadingTime(article.reading_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg prose-racing max-w-none"
              >
                {/* Article Content */}
                <div className="text-racing-gray-800 leading-relaxed">
                  {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : (
                    <div className="space-y-6">
                      <p>
                        This is the main content of the article. In a real implementation,
                        this would contain the full article content rendered from markdown
                        or HTML stored in the database.
                      </p>
                      <p>
                        {article.excerpt} The content would include detailed information
                        about the racing topic, quotes from drivers or team members,
                        technical details, and comprehensive coverage of the story.
                      </p>
                      <p>
                        For now, this is placeholder content to demonstrate the layout
                        and styling of the article page. The actual content would be
                        much more detailed and informative.
                      </p>
                    </div>
                  )}
                </div>

                {/* Article Tags/Categories at bottom */}
                <div className="pt-8 mt-8 border-t border-racing-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-racing-gray-500" />
                      <span className="text-sm text-racing-gray-600">Category:</span>
                      <Badge variant="outline" className="text-racing-red border-racing-red">
                        {article.category}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="sticky top-8 space-y-6"
              >
                {/* Author Info */}
                <div className="bg-racing-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-racing-gray-900 mb-3">About the Author</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-racing-gray-900">{article.author.name}</div>
                        <div className="text-sm text-racing-gray-600">Sports Journalist</div>
                      </div>
                    </div>
                    <p className="text-sm text-racing-gray-600">
                      Experienced motorsport journalist covering CBK Racing and the karting world.
                    </p>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="bg-white border border-racing-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-racing-gray-900 mb-4">Article Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-racing-gray-600">Published</span>
                      <span className="text-sm font-medium">{formatDate(article.published_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-racing-gray-600">Reading Time</span>
                      <span className="text-sm font-medium">{formatReadingTime(article.reading_time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-racing-gray-600">Views</span>
                      <span className="text-sm font-medium">{article.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-racing-gray-600">Category</span>
                      <span className="text-sm font-medium">{article.category}</span>
                    </div>
                  </div>
                </div>

                {/* Share Options */}
                <div className="bg-white border border-racing-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-racing-gray-900 mb-4">Share This Article</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Article
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/news">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to News
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}