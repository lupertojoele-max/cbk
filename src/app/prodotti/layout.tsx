import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutti i Prodotti Kart | CBK1',
  description: 'Catalogo completo ricambi kart: 6.800+ prodotti tra telai, motori, freni, pneumatici, telemetrie, abbigliamento. OTK, CRG, BirelArt, IAME, Rotax. Spedizione rapida in tutta Italia.',
  keywords: [
    'catalogo kart', 'ricambi kart online', 'accessori karting', 'kart shop italia',
    'OTK ricambi', 'CRG kart', 'IAME ricambi', 'Rotax kart', 'BirelArt'
  ],
  openGraph: {
    title: 'Catalogo Prodotti Kart | CBK1',
    description: '6.800+ ricambi e accessori kart professionali. OTK, CRG, BirelArt, IAME, Rotax. Spedizione in 24h in tutta Italia.',
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalogo Prodotti Kart | CBK1',
    description: '6.800+ ricambi e accessori kart professionali. Spedizione in 24h.',
  },
};

export default function ProdottiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
