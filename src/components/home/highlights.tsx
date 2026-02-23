import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Calendar, Wrench } from "lucide-react"

interface HighlightCard {
  id: string
  title: string
  description: string
  badge: { text: string; className: string }
  cta: { text: string; href: string }
  icon: React.ReactNode
  iconBg: string
  accentBg: string
  stats?: { label: string; value: string }
}

const highlightCards: HighlightCard[] = [
  {
    id: 'championship',
    title: 'Vittoria Campionato',
    description: 'CBK Racing conquista un\'altra vittoria di campionato con una prestazione eccezionale sul circuito di Monza.',
    badge: { text: 'Ultime News', className: 'bg-racing-red text-white' },
    cta: { text: 'Leggi di Più', href: '/news' },
    icon: <Trophy className="w-6 h-6 text-white" />,
    iconBg: 'bg-racing-red',
    accentBg: 'bg-racing-red',
    stats: { label: 'Posizione', value: '1°' }
  },
  {
    id: 'upcoming-event',
    title: 'Campionato Italiano Karting',
    description: 'Unisciti a noi per il prossimo round del Campionato Italiano sui circuiti più iconici d\'Italia.',
    badge: { text: 'Prossimo Evento', className: 'bg-blue-600 text-white' },
    cta: { text: 'Vedi Calendario', href: '/calendar' },
    icon: <Calendar className="w-6 h-6 text-white" />,
    iconBg: 'bg-blue-600',
    accentBg: 'bg-blue-600',
    stats: { label: 'Giorni Mancanti', value: '12' }
  },
  {
    id: 'technology',
    title: 'Nuova Tecnologia Kart',
    description: 'Scopri la nostra ultima tecnologia di gara ad alte prestazioni e le innovazioni ingegneristiche.',
    badge: { text: 'Aggiornamento Team', className: 'bg-emerald-600 text-white' },
    cta: { text: 'Esplora Flotta', href: '/karts' },
    icon: <Wrench className="w-6 h-6 text-white" />,
    iconBg: 'bg-emerald-600',
    accentBg: 'bg-emerald-600',
    stats: { label: 'Nuovi Kart', value: '3' }
  }
]

export function Highlights() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 mb-4">
            Ultime da CBK Racing
          </h2>
          <p className="text-lg text-racing-gray-600 max-w-2xl mx-auto">
            Rimani aggiornato con le nostre ultime gare, successi e sviluppi del team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {highlightCards.map((card) => (
            <Card
              key={card.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-racing-gray-200 overflow-hidden"
            >
              {/* Colored accent stripe */}
              <div className={`h-1.5 w-full ${card.accentBg}`} />

              <CardHeader className="space-y-4 pt-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  {card.stats && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-racing-gray-900">
                        {card.stats.value}
                      </div>
                      <div className="text-xs font-semibold text-racing-gray-500 uppercase tracking-widest mt-1">
                        {card.stats.label}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Badge className={`mb-3 text-xs font-semibold ${card.badge.className}`}>
                    {card.badge.text}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-racing-gray-900 group-hover:text-racing-red transition-colors leading-snug">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-racing-gray-600 leading-relaxed mt-2 text-sm">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full border-racing-gray-300 text-racing-gray-700 group-hover:border-racing-red group-hover:text-racing-red transition-colors font-medium"
                  asChild
                >
                  <Link href={card.cta.href}>
                    {card.cta.text}
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}