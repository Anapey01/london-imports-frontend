import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/providers/Providers";
import PWAUpdater from "@/components/PWAUpdater";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/config/site";

import ReloadPrompt from '@/components/pwa/ReloadPrompt';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WebVitalsReporter from '@/components/analytics/WebVitalsReporter';
import { Suspense } from "react";
import SkipToContent from "@/components/SkipToContent";
import { GoogleTagManager } from '@next/third-parties/google';
import { 
  OrganizationSchema, 
  WebsiteSchema, 
  FaqSchema, 
  BreadcrumbSchema 
} from "@/components/seo/JsonLd";


// Lazy load below-the-fold components to reduce initial bundle
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-primary-surface dark:bg-slate-950 animate-pulse" />,
});
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"));

// Google Analytics ID
const GA_MEASUREMENT_ID = "G-VP24TKHC7C";


const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-source-serif",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
});

export const metadata: Metadata = {
  title: "Ghana's #1 Mini Importation Service | Buy from China to Accra & Kumasi | London's Imports Ghana",
  description: "London's Imports is Ghana's premier sourcing house and logistics protocol for mini-importation. We bridge the gap between China’s factory floors (1688, Alibaba) and your doorstep in Accra, Kumasi, and Tema. Secure, transparent, and built for the sophisticated Ghanaian importer.",
  keywords: [
    // Primary - Ghana Geographic Focus
    "Mini Importation Ghana", "Buy from China to Ghana", "Shipping from China to Accra",
    "Import goods to Kumasi", "China to Tema shipping", "Ghana importation services",
    // Location-Specific - Greater Accra
    "Buy from China to Tema", "Buy from China to Madina", "Buy from China to Ashaiman",
    "Ship to East Legon from China", "China shipping to Spintex", "Import to Teshie",
    "Ship from China to Nungua", "China to Lashibi delivery", "Buy from China to Dansoman",
    "Mini importation Tema", "Mini importation Madina", "Mini importation Ashaiman",
    "Mini importation East Legon", "Mini importation Spintex", "Import goods to Tema",
    // Other Regions
    "Buy from China to Kumasi", "Ship to Takoradi from China", "Mini importation Kumasi",
    "Import to Cape Coast", "China shipping to Koforidua", "Buy from China to Sunyani",
    // Secondary - Service Keywords  
    "Buy from 1688 to Ghana", "China to Ghana consolidation", "Air freight Guangzhou to Accra",
    "Ghana Customs duty for electronics", "Door to door shipping Ghana", "Clearance agents Tema Port",
    // Transactional
    "How to pay 1688 with Momo", "Buy from Alibaba ship to Ghana", "Pre-order from China Ghana",
    "Order from Taobao to Ghana", "1688 agent Ghana", "Alibaba shipping Ghana",
    // Long-tail
    "How to import phones from China to Ghana", "Best mini importation company Ghana",
    "Cheap shipping from China to Accra", "Importation service near me Ghana",
    // Brand
    "London's Imports Ghana", "Londons Imports"
  ],
  openGraph: {
    title: "London's Imports Ghana - #1 China to Accra Shipping",
    description: "Ghana's trusted platform for importing goods from China. We handle shipping, customs, and doorstep delivery in Accra, Kumasi, Tema. Pay in Cedis via Momo.",
    url: 'https://londonsimports.com',
    siteName: "London's Imports Ghana",
    images: [
      {
        url: 'https://londonsimports.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "London's Imports Ghana - China to Accra Shipping",
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  metadataBase: new URL('https://londonsimports.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-GH': 'https://londonsimports.com',
      'x-default': 'https://londonsimports.com',
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ghana's #1 Mini Importation Service | London's Imports Ghana",
    description: "Ghana's premier sourcing house and logistics protocol for mini-importation. Secure, transparent, and built for the sophisticated Ghanaian importer.",
    site: '@londonsimports',
    creator: '@londonsimports',
    images: ['https://londonsimports.com/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en-GH" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href={new URL(siteConfig.apiUrl).origin} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <OrganizationSchema />
        <WebsiteSchema />
        <FaqSchema />
        <BreadcrumbSchema />
      </head>
      <body className={`${sourceSerif.variable} ${montserrat.variable} font-sans bg-stationery min-h-screen shadow-inner transition-colors duration-300`} suppressHydrationWarning>
        <SkipToContent />
        {/* Google Analytics - Unified via Next Third Parties */}
        <GoogleTagManager gtmId={GA_MEASUREMENT_ID} />

        <Suspense fallback={null}>
          <GoogleAnalytics />
          <WebVitalsReporter />
        </Suspense>

        <Providers>
          <PWAUpdater />
          <Navbar />
          <main id="main-content" className="pb-20 md:pb-0 outline-none">{children}</main>
          <Footer />
          <MobileBottomNav />
          <ReloadPrompt />
        </Providers>
        <Analytics />

      </body>
    </html>
  );
}
