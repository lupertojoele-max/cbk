import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Telai Kart Nuovi | OTK, CRG, BirelArt, IPK | CBK1",
  description: "Telai nuovi per kart professionale: OTK TonyKart, CRG, BirelArt, IPK Formula K. Categorie OK, KZ, OKJ, Mini 60cc. Telaio completo o solo scocca.",
  keywords: [
    "telaio kart nuovo",
    "OTK kart",
    "CRG telaio",
    "BirelArt kart",
    "kart professionale nuovo",
  ],
  openGraph: {
    title: "Telai Kart Nuovi | OTK, CRG, BirelArt, IPK | CBK1",
    description: "Telai nuovi per kart professionale: OTK TonyKart, CRG, BirelArt, IPK Formula K. Categorie OK, KZ, OKJ, Mini 60cc. Telaio completo o solo scocca.",
    type: 'website',
    siteName: 'CBK1',
    locale: 'it_IT',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
