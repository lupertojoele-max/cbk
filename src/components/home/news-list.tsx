import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractData, formatEventDate, formatReadingTime, getMediaUrl } from '@/lib/api-utils'
import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, User, ArrowRight } from "lucide-react"

export async function NewsList() {
  let articles: any[] = []
  let error = null

  try {
    const response = await api.news.list({ per_page: 3 })
    articles = extractData(response)
  } catch (err) {
    console.error('Failed to fetch news:', err)
    error = err instanceof Error ? err.message : 'Failed to load news articles'
  }

  if (error) {
    return (
      <section className="py-16 bg-racing-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
              Latest News
            </h2>
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-600 mb-4">
                Unable to load news articles at the moment.
              </p>
              <Button className="bg-racing-red hover:bg-racing-red/90" asChild>
                <Link href="/news">View All News</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="py-16 bg-racing-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
              Latest News
            </h2>
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-racing-gray-600 mb-4">
                No news articles available at the moment.
              </p>
              <Button className="bg-racing-red hover:bg-racing-red/90" asChild>
                <Link href="/news">Visit News Section</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const [featuredArticle, ...otherArticles] = articles

  return (
    <section className="py-16 bg-racing-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
            Latest News
          </h2>
          <p className="text-xl text-racing-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest racing news, results, and team updates
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={getMediaUrl(featuredArticle.cover_image, '/images/news-placeholder.jpg')}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />

                {/* Article Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {featuredArticle.is_breaking && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      Breaking
                    </Badge>
                  )}
                  {featuredArticle.is_featured && (
                    <Badge className="bg-racing-red text-white">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/90 text-racing-gray-900">
                    {featuredArticle.category}
                  </Badge>
                </div>

                {/* Reading Time */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatReadingTime(featuredArticle.reading_time)}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-tight">
                  <Link href={`/news/${featuredArticle.slug}`} className="hover:underline">
                    {featuredArticle.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-racing-gray-600 text-base leading-relaxed">
                  {featuredArticle.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-racing-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{featuredArticle.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div>
                    {formatEventDate(featuredArticle.published_at)}
                  </div>
                </div>

                <Button
                  className="w-full group-hover:bg-racing-red group-hover:text-white transition-colors"
                  variant="outline"
                  asChild
                >
                  <Link href={`/news/${featuredArticle.slug}`}>
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Articles */}
          <div className="space-y-6">
            {otherArticles.map((article) => (
              <Card
                key={article.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex">
                  <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-l-lg">
                    <Image
                      src={getMediaUrl(article.cover_image, '/images/news-placeholder.jpg')}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          color: article.is_featured ? '#e10600' : undefined,
                          borderColor: article.is_featured ? '#e10600' : undefined
                        }}
                      >
                        {article.category}
                      </Badge>
                      <div className="text-xs text-racing-gray-500">
                        {formatReadingTime(article.reading_time)}
                      </div>
                    </div>

                    <h3 className="font-semibold text-racing-gray-900 group-hover:text-racing-red transition-colors text-sm leading-tight mb-2 line-clamp-2">
                      <Link href={`/news/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-racing-gray-600 line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-racing-gray-500">
                      <span>{article.author.name}</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* View All News Button */}
            <Button
              className="w-full bg-racing-red hover:bg-racing-red/90 text-white"
              asChild
            >
              <Link href="/news">
                View All News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}