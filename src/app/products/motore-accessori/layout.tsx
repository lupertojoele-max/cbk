import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Motori e Accessori Kart | IAME, TM, Rotax | CBK1",
  description: "Ricambi motore per kart professionale: IAME X30, TM KZ, Rotax Max, WTP 60. Pistoni, bielle, cilindri, accensione. Componenti OEM e racing.",
  keywords: [
    "motore kart",
    "ricambi IAME",
    "ricambi TM Racing",
    "ricambi Rotax",
    "motore karting",
  ],
  openGraph: {
    title: "Motori e Accessori Kart | IAME, TM, Rotax | CBK1",
    description: "Ricambi motore per kart professionale: IAME X30, TM KZ, Rotax Max, WTP 60. Pistoni, bielle, cilindri, accensione. Componenti OEM e racing.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
