import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Telemetrie e Crono per Kart | AIM, Alfano | CBK1",
  description: "Sistemi telemetria per kart: AIM MyChron, Alfano Pro. GPS lap timer, sensori dati, analisi assetto in pista. Strumenti per piloti professionisti.",
  keywords: [
    "telemetria kart",
    "AIM MyChron",
    "Alfano Pro",
    "lap timer kart",
    "telemetria karting",
  ],
  openGraph: {
    title: "Telemetrie e Crono per Kart | AIM, Alfano | CBK1",
    description: "Sistemi telemetria per kart: AIM MyChron, Alfano Pro. GPS lap timer, sensori dati, analisi assetto in pista. Strumenti per piloti professionisti.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
