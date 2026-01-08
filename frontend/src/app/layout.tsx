/**
 * London's Imports - Root Layout
 * Includes Navbar, providers, and global styles
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://londonsimports.com'), // Update with actual domain if custom
  title: "Mini Importation Services in Ghana | Buy from China to Accra & Kumasi | London's Imports",
  description: "Ghana's #1 trusted platform for mini-importation. Ship from China (1688, Alibaba, Taobao) to Accra, Kumasi, and Tema. Pay with Momo. Door-to-door delivery, customs clearance included.",
  keywords: [
    // Primary - Ghana Geographic Focus
    "Mini Importation Ghana", "Buy from China to Ghana", "Shipping from China to Accra",
    "Import goods to Kumasi", "China to Tema shipping", "Ghana importation services",
    // Secondary - Service Keywords  
    "Buy from 1688 to Ghana", "China to Ghana consolidation", "Air freight Guangzhou to Accra",
    "Ghana Customs duty for electronics", "Door to door shipping Ghana", "Clearance agents Tema Port",
    // Transactional
    "How to pay 1688 with Momo", "Buy from Alibaba ship to Ghana", "Pre-order from China Ghana",
    // Brand
    "London's Imports Ghana"
  ],
  openGraph: {
    title: "Mini Importation Ghana - Ship from China to Accra & Kumasi",
    description: "Ghana's trusted platform for importing goods from China. We handle shipping, customs, and doorstep delivery in Accra, Kumasi, Tema. Pay in Cedis via Momo.",
    url: 'https://londonsimports.com',
    siteName: "London's Imports",
    /* images: [
      {
        url: '/og-image.jpg', // Must be in public folder
        width: 1200,
        height: 630,
        alt: "London's Imports Ghana - China to Accra Shipping",
      },
    ], */
    locale: 'en_GH',
    type: 'website',
  },
  alternates: {
    canonical: 'https://londonsimports.com',
    languages: {
      'en-GH': 'https://londonsimports.com',
      'x-default': 'https://londonsimports.com',
    },
  },
};

import { getCategories } from "@/lib/fetchers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": "https://londonsimports.com/#business",
    "name": "London's Imports Ghana",
    "alternateName": "London's Imports - Mini Importation Ghana",
    "url": "https://londonsimports.com",
    "description": "Ghana's #1 mini-importation platform. Ship goods from China to Accra, Kumasi, and Tema with door-to-door delivery. Trusted by 10,000+ Ghanaians.",
    "logo": "https://londonsimports.com/logo.png",
    "image": "https://londonsimports.com/og-image.jpg",
    "telephone": "+233541096372",
    "email": "support@londonsimports.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "GM-1739 Felchris Estate 2, Danfa",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra",
      "postalCode": "GM-1739",
      "addressCountry": "GH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 5.6771,
      "longitude": -0.2113
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Accra", "containedInPlace": { "@type": "Country", "name": "Ghana" } },
      { "@type": "City", "name": "Kumasi" },
      { "@type": "City", "name": "Tema" },
      { "@type": "City", "name": "Takoradi" },
      { "@type": "Country", "name": "Ghana" }
    ],
    "priceRange": "GHS 50 - GHS 10000",
    "currenciesAccepted": "GHS",
    "paymentAccepted": "Mobile Money, Bank Transfer, Cash",
    "sameAs": [
      "https://wa.me/233541096372"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Mini Importation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "China to Ghana Shipping",
            "description": "Door-to-door shipping from China to Accra, Kumasi, Tema"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Customs Clearance",
            "description": "We handle all Ghana customs duties and clearance"
          }
        }
      ]
    }
  };

  return (
    <html lang="en-GH" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <Navbar initialCategories={categories} />
              <main className="pb-20 md:pb-0">{children}</main>
              <Footer />
              <MobileBottomNav />
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
