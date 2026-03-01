import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kart Completi Nuovi | OTK, CRG, BirelArt | CBK1",
  description: "Kart completi pronti per la pista: OTK, CRG, BirelArt, IPK con motore IAME, TM Racing o Rotax. Configurabili su misura per piloti adulti e bambini.",
  keywords: [
    "kart completo nuovo",
    "kart racing",
    "kart professionale",
    "go kart nuovo",
    "kart con motore",
  ],
  openGraph: {
    title: "Kart Completi Nuovi | OTK, CRG, BirelArt | CBK1",
    description: "Kart completi pronti per la pista: OTK, CRG, BirelArt, IPK con motore IAME, TM Racing o Rotax. Configurabili su misura per piloti adulti e bambini.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
