import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Carburatori Kart | OEM e Aftermarket | CBK1",
  description: "Carburatori originali e aftermarket per kart: Tillotson, Dell'Orto, Mikuni. Compatibili con IAME, Rotax, TM Racing. Disponibilita immediata, spedizione in 24h.",
  keywords: [
    "carburatore kart",
    "carburatore IAME",
    "carburatore Rotax",
    "Tillotson kart",
    "carburatore karting",
  ],
  openGraph: {
    title: "Carburatori Kart | OEM e Aftermarket | CBK1",
    description: "Carburatori originali e aftermarket per kart: Tillotson, Dell'Orto, Mikuni. Compatibili con IAME, Rotax, TM Racing. Disponibilita immediata, spedizione in 24h.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
