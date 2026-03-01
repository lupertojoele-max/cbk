import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pneumatici Kart | Vega, LeCont, Maxxis, MG | CBK1",
  description: "Pneumatici da gara per kart: Vega XH, LeCont, Maxxis, MG Yellow, Komet. Per tutte le categorie OK, KZ, OKJ, Mini. Gomme slick, pioggia e asciutto.",
  keywords: [
    "pneumatici kart",
    "gomme kart",
    "Vega kart",
    "LeCont kart",
    "Maxxis kart",
    "gomme karting",
  ],
  openGraph: {
    title: "Pneumatici Kart | Vega, LeCont, Maxxis, MG | CBK1",
    description: "Pneumatici da gara per kart: Vega XH, LeCont, Maxxis, MG Yellow, Komet. Per tutte le categorie OK, KZ, OKJ, Mini. Gomme slick, pioggia e asciutto.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
