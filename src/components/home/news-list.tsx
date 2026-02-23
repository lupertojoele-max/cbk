import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractData, formatEventDate, formatReadingTime, getMediaUrl } from '@/lib/api-utils'
import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, User, ArrowRight, MapPin, Calendar } from "lucide-react"

// News statiche sulle prossime gare (usate quando non ci sono articoli dall'API)
const upcomingRaceNews = [
  {
    id: 'wsk-r4-lonato-2026',
    title: 'WSK Super Master Series – Round 4: a Lonato si decide la stagione',
    excerpt: 'Il team CBK1 è pronto per il quarto atto della WSK Super Master Series sul mitico South Garda Karting di Lonato del Garda. Con tutte le categorie in pista — da MINI a KZ2 — cinque giorni di fuoco attendono i nostri piloti.',
    category: 'Prossima Gara',
    date: '4–8 Marzo 2026',
    location: 'South Garda Karting, Lonato del Garda (BS)',
    series: 'WSK Super Master Series',
    seriesColor: 'bg-racing-red',
    image: '/images/events/italian-championship-1.jpg',
    href: '/calendar',
  },
  {
    id: 'iame-euro-r1-zuera-2026',
    title: 'IAME Euro Series: il debutto stagionale è a Zuera',
    excerpt: 'Si apre il sipario sull\'IAME Euro Series 2026. Il kartodromo di Zuera ospita il primo round europeo: CBK1 porta in pista X30 Junior e Senior con l\'obiettivo di partire con il piede giusto.',
    category: 'Prossima Gara',
    date: '11–14 Marzo 2026',
    location: 'Karting Zuera, Zaragoza (Spagna)',
    series: 'IAME Euro Series',
    seriesColor: 'bg-purple-600',
    image: '/images/karts/red-rocket-1.jpg',
    href: '/calendar',
  },
  {
    id: 'rok-italia-r1-cremona-2026',
    title: 'ROK Cup Italia Round 1: sfida aperta a Cremona',
    excerpt: 'Parte il campionato ROK Cup Italia 2026 dal Cremona Circuit. CBK1 schiera i propri piloti nelle categorie Junior e Senior ROK, puntando subito al podio nel primo round di una lunga stagione.',
    category: 'Prossima Gara',
    date: '21–22 Marzo 2026',
    location: 'Cremona Circuit, San Martino del Lago (CR)',
    series: 'ROK Cup Italia',
    seriesColor: 'bg-orange-600',
    image: '/images/karts/blue-blur-1.jpg',
    href: '/calendar',
  },
]

export async function NewsList() {
  let articles: any[] = []

  try {
    const response = await api.news.list({ per_page: 3 })
    articles = extractData(response)
  } catch (err) {
    console.error('Failed to fetch news:', err)
  }

  // Se non ci sono articoli dall'API, mostriamo le news sulle prossime gare
  if (articles.length === 0) {
    const [featured, ...others] = upcomingRaceNews
    return (
      <section className="py-16 bg-racing-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
              Prossime Gare
            </h2>
            <p className="text-xl text-racing-gray-600 max-w-2xl mx-auto">
              Segui il team CBK1 nei prossimi appuntamenti di campionato
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured race news */}
            <div className="lg:col-span-2">
              <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`${featured.seriesColor} text-white`}>
                      {featured.series}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90 text-racing-gray-900">
                      {featured.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-tight">
                    <Link href={featured.href} className="hover:underline">
                      {featured.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-racing-gray-600 text-base leading-relaxed">
                    {featured.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-racing-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-racing-red" />
                      <span>{featured.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-racing-red" />
                      <span>{featured.location}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full group-hover:bg-racing-red group-hover:text-white transition-colors"
                    variant="outline"
                    asChild
                  >
                    <Link href={featured.href}>
                      Vedi Calendario Completo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Other race news */}
            <div className="space-y-6">
              {others.map((news) => (
                <Card key={news.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="flex">
                    <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-l-lg">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {news.series}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-racing-gray-900 group-hover:text-racing-red transition-colors text-sm leading-tight mb-2 line-clamp-2">
                        <Link href={news.href} className="hover:underline">
                          {news.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-racing-gray-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{news.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-racing-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{news.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button className="w-full bg-racing-red hover:bg-racing-red/90 text-white" asChild>
                <Link href="/calendar">
                  Calendario Completo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const [featuredArticle, ...otherArticles] = articles

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
            Ultime News
          </h2>
          <p className="text-lg text-racing-gray-600 max-w-2xl mx-auto">
            Rimani aggiornato con le ultime notizie di gara, risultati e aggiornamenti del team
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <Card className="group hover:shadow-2xl transition-all duration-300 h-full overflow-hidden border border-racing-gray-200">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={getMediaUrl(featuredArticle.cover_image, '/images/news-placeholder.jpg')}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Article Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {featuredArticle.is_breaking && (
                    <Badge className="bg-red-500 text-white animate-pulse font-semibold">
                      Ultima Ora
                    </Badge>
                  )}
                  {featuredArticle.is_featured && (
                    <Badge className="bg-racing-red text-white font-semibold">
                      In Evidenza
                    </Badge>
                  )}
                  <Badge className="bg-white text-racing-gray-900 font-semibold border border-racing-gray-200">
                    {featuredArticle.category}
                  </Badge>
                </div>

                {/* Reading Time */}
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white border-0 font-medium">
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
                <CardDescription className="text-racing-gray-600 text-base leading-relaxed mt-1">
                  {featuredArticle.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-racing-gray-600 mb-4 border-t border-racing-gray-100 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-racing-gray-400" />
                      <span>{featuredArticle.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-racing-gray-400" />
                      <span>{featuredArticle.views.toLocaleString()} visualizzazioni</span>
                    </div>
                  </div>
                  <div className="text-racing-gray-500 text-xs">
                    {formatEventDate(featuredArticle.published_at)}
                  </div>
                </div>

                <Button
                  className="w-full border-racing-gray-300 text-racing-gray-700 group-hover:bg-racing-red group-hover:text-white group-hover:border-racing-red transition-colors font-medium"
                  variant="outline"
                  asChild
                >
                  <Link href={`/news/${featuredArticle.slug}`}>
                    Leggi Articolo Completo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Articles */}
          <div className="space-y-4">
            {otherArticles.map((article) => (
              <Card
                key={article.id}
                className="group hover:shadow-lg transition-all duration-300 border border-racing-gray-200 overflow-hidden"
              >
                <div className="flex">
                  <div className="w-28 h-28 relative flex-shrink-0 overflow-hidden">
                    <Image
                      src={getMediaUrl(article.cover_image, '/images/news-placeholder.jpg')}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="112px"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={`text-xs font-semibold ${
                          article.is_featured
                            ? 'bg-racing-red text-white'
                            : 'bg-racing-gray-100 text-racing-gray-700 border border-racing-gray-300'
                        }`}
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-racing-gray-500 font-medium">
                        {formatReadingTime(article.reading_time)}
                      </span>
                    </div>

                    <h3 className="font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors text-sm leading-tight mb-2 line-clamp-2">
                      <Link href={`/news/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </h3>

                    <div className="flex items-center justify-between text-xs text-racing-gray-600 mt-auto border-t border-racing-gray-100 pt-2">
                      <span className="font-medium">{article.author.name}</span>
                      <span>{new Date(article.published_at).toLocaleDateString('it-IT')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* View All News Button */}
            <Button
              className="w-full bg-racing-red hover:bg-racing-red/90 text-white font-semibold"
              asChild
            >
              <Link href="/news">
                Vedi Tutte le News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}