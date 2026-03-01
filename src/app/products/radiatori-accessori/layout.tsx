import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Radiatori e Raffreddamento Kart | CBK1",
  description: "Radiatori acqua per kart: IAME, TM, Rotax. Pompe acqua, tubi, raccordi e accessori raffreddamento. Compatibilita verificata con tutti i motori kart.",
  keywords: [
    "radiatore kart",
    "raffreddamento kart",
    "pompa acqua kart",
    "radiatore IAME",
    "sistema raffreddamento karting",
  ],
  openGraph: {
    title: "Radiatori e Raffreddamento Kart | CBK1",
    description: "Radiatori acqua per kart: IAME, TM, Rotax. Pompe acqua, tubi, raccordi e accessori raffreddamento. Compatibilita verificata con tutti i motori kart.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
