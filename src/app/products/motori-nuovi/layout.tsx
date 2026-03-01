import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Motori Nuovi per Kart | IAME, TM, Rotax | CBK1",
  description: "Motori nuovi per kart: IAME X30 125cc, TM KZ10, Rotax Max, WTP 60cc. Tutti i propulsori per le categorie CIK-FIA. Garanzia ufficiale.",
  keywords: [
    "motore kart nuovo",
    "IAME X30",
    "TM KZ10",
    "Rotax Max",
    "motore karting",
  ],
  openGraph: {
    title: "Motori Nuovi per Kart | IAME, TM, Rotax | CBK1",
    description: "Motori nuovi per kart: IAME X30 125cc, TM KZ10, Rotax Max, WTP 60cc. Tutti i propulsori per le categorie CIK-FIA. Garanzia ufficiale.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
