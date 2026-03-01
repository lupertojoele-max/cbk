import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Accessori Telaio Kart | Barre, Fascette, Eccentrici | CBK1",
  description: "Accessori telaio per kart: barre anteriori, barre stabilizzatrici, fascette, eccentrici, fuselli, piantoni sterzo. Compatibili con OTK, CRG, BirelArt.",
  keywords: [
    "accessori telaio kart",
    "barra anteriore kart",
    "fusello kart",
    "piantone sterzo kart",
    "setup kart",
  ],
  openGraph: {
    title: "Accessori Telaio Kart | Barre, Fascette, Eccentrici | CBK1",
    description: "Accessori telaio per kart: barre anteriori, barre stabilizzatrici, fascette, eccentrici, fuselli, piantoni sterzo. Compatibili con OTK, CRG, BirelArt.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
