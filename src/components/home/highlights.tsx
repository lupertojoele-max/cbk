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
    title: 'Catalogo Kart Completo',
    description: 'CBK Racing conquista un\'altra vittoria di campionato con una prestazione eccezionale sul circuito di Monza.',
    badge: { text: 'Catalogo Completo', className: 'bg-racing-red text-white' },
    cta: { text: 'Sfoglia i Prodotti', href: '/prodotti' },
    icon: <Trophy className="w-6 h-6 text-white" />,
    iconBg: 'bg-racing-red',
    accentBg: 'bg-racing-red',
    stats: { label: 'Prodotti', value: '6.800+' }
  },
  {
    id: 'upcoming-event',
    title: 'Spedizione in 24/48 Ore',
    description: 'Unisciti a noi per il prossimo round del Campionato Italiano sui circuiti più iconici d\'Italia.',
    badge: { text: 'Spedizione Rapida', className: 'bg-blue-600 text-white' },
    cta: { text: 'Scopri Come Funziona', href: '/contatti' },
    icon: <Calendar className="w-6 h-6 text-white" />,
    iconBg: 'bg-blue-600',
    accentBg: 'bg-blue-600',
    stats: { label: 'Ore Consegna', value: '24h' }
  },
  {
    id: 'technology',
    title: 'Assistenza Tecnica Specializzata',
    description: 'Non sai quale ricambio scegliere? Il nostro team tecnico ti supporta nella selezione del componente giusto per il tuo setup.',
    badge: { text: 'Supporto Tecnico', className: 'bg-emerald-600 text-white' },
    cta: { text: 'Contatta il Team', href: '/contatti' },
    icon: <Wrench className="w-6 h-6 text-white" />,
    iconBg: 'bg-emerald-600',
    accentBg: 'bg-emerald-600',
    stats: { label: 'Brand Partner', value: '50+' }
  }
]

export function Highlights() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-racing-gray-900 dark:text-white mb-4">
            Perche Scegliere CBK1
          </h2>
          <p className="text-lg text-racing-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Il catalogo piu completo del karting italiano. Componenti OEM, spedizione rapida, assistenza tecnica dedicata.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {highlightCards.map((card) => (
            <Card
              key={card.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-racing-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
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
                      <div className="text-3xl font-bold text-racing-gray-900 dark:text-white">
                        {card.stats.value}
                      </div>
                      <div className="text-xs font-semibold text-racing-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
                        {card.stats.label}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Badge className={`mb-3 text-xs font-semibold ${card.badge.className}`}>
                    {card.badge.text}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-racing-gray-900 dark:text-white group-hover:text-racing-red transition-colors leading-snug">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-racing-gray-600 dark:text-gray-400 leading-relaxed mt-2 text-sm">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full border-racing-gray-300 dark:border-gray-600 text-racing-gray-700 dark:text-gray-200 group-hover:border-racing-red group-hover:text-racing-red transition-colors font-medium active:scale-[0.98]"
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