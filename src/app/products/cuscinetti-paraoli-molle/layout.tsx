import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cuscinetti, Paraoli e Molle Kart | CBK1",
  description: "Cuscinetti, paraoli e molle per kart: SKF, FAG. Cuscinetti assale, ruota, fusello. Paraoli motore. Molle ammortizzatori. Ricambi originali per tutti i brand.",
  keywords: [
    "cuscinetti kart",
    "paraoli kart",
    "molle kart",
    "SKF kart",
    "cuscinetti assale kart",
  ],
  openGraph: {
    title: "Cuscinetti, Paraoli e Molle Kart | CBK1",
    description: "Cuscinetti, paraoli e molle per kart: SKF, FAG. Cuscinetti assale, ruota, fusello. Paraoli motore. Molle ammortizzatori. Ricambi originali per tutti i brand.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
