import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CBK Racing - Professional Go-Kart Racing Team",
  description: "Professional go-kart racing team competing in national and international championships. Experience the thrill of motorsport with cutting-edge technology and passionate drivers.",
  keywords: ["go-kart racing", "motorsport", "racing team", "championships", "CBK Racing"],
  authors: [{ name: "CBK Racing Team" }],
  openGraph: {
    title: "CBK Racing - Professional Go-Kart Racing Team",
    description: "Professional go-kart racing team competing in national and international championships",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "CBK Racing",
  },
  twitter: {
    card: "summary_large_image",
    title: "CBK Racing - Professional Go-Kart Racing Team",
    description: "Professional go-kart racing team competing in national and international championships",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Header />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}