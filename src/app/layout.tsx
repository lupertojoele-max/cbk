import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/a11y/skip-to-content";
import { ThemeProviderWrapper } from "@/components/providers/theme-provider-wrapper";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ChatBot } from "@/components/chat/chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CBK1 | Ricambi e Accessori Kart Professionali",
    template: "%s | CBK1"
  },
  description: "Ricambi kart originali, accessori karting e attrezzatura professionale. OTK, CRG, BirelArt, IAME, Rotax. Spedizione rapida in tutta Italia. CBK Racing.",
  keywords: [
    "ricambi kart",
    "accessori karting",
    "kart professionale",
    "ricambi go kart",
    "accessori kart italia",
    "CBK Racing",
    "CBK1",
    "telaio kart",
    "motore kart ricambi",
    "pneumatici kart",
    "telemetria kart",
    "freni kart",
    "abbigliamento karting",
    "karting professionale",
    "OTK ricambi",
    "CRG kart",
    "BirelArt",
    "IAME ricambi",
    "Rotax kart"
  ],
  authors: [{ name: "CBK1 - CBK Racing" }],
  creator: "CBK1",
  publisher: "CBK Racing",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CBK1 | Ricambi e Accessori Kart Professionali",
    description: "Ricambi kart originali, accessori karting e attrezzatura professionale. OTK, CRG, BirelArt, IAME, Rotax. Spedizione rapida in tutta Italia.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "CBK1",
    locale: "it_IT",
    images: [
      {
        url: "/images/seo/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "CBK1 - Ricambi e Accessori Kart Professionali",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBK1 | Ricambi e Accessori Kart Professionali",
    description: "Ricambi kart originali, accessori karting e attrezzatura professionale. OTK, CRG, BirelArt, IAME, Rotax. Spedizione rapida in tutta Italia.",
    creator: "@cbk1racing",
    images: ["/images/seo/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  category: 'sports',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProviderWrapper>
          <SkipToContent />
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <InstallPrompt />
          <ChatBot />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}