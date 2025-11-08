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
    default: "CBK Racing - Professional Go-Kart Racing Team",
    template: "%s | CBK Racing"
  },
  description: "Professional go-kart racing team competing in national and international championships. Experience the thrill of motorsport with cutting-edge technology and passionate drivers.",
  keywords: ["go-kart racing", "motorsport", "racing team", "championships", "CBK Racing", "karting", "professional racing", "motorsport team"],
  authors: [{ name: "CBK Racing Team" }],
  creator: "CBK Racing Team",
  publisher: "CBK Racing",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'it-IT': '/it-IT',
    },
  },
  openGraph: {
    title: "CBK Racing - Professional Go-Kart Racing Team",
    description: "Professional go-kart racing team competing in national and international championships. Experience the thrill of motorsport with cutting-edge technology and passionate drivers.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "CBK Racing",
    locale: "en_US",
    images: [
      {
        url: "/images/seo/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "CBK Racing - Professional Go-Kart Racing Team",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBK Racing - Professional Go-Kart Racing Team",
    description: "Professional go-kart racing team competing in national and international championships",
    creator: "@cbkracing",
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
    <html lang="en">
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