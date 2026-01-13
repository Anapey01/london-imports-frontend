/**
 * London's Imports - Root Layout
 * Includes Navbar, providers, and global styles
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Lazy load below-the-fold components to reduce initial bundle
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-gray-100" />,
});
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"));

// Google Analytics ID
const GA_MEASUREMENT_ID = "G-VP24TKHC7C";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents invisible text during font loading (improves FCP)
});

export const metadata: Metadata = {
  metadataBase: new URL('https://londonsimports.com'), // Update with actual domain if custom
  title: "Mini Importation Services in Ghana | Buy from China to Accra & Kumasi | London's Imports",
  description: "Ghana's #1 trusted platform for mini-importation. Ship from China (1688, Alibaba, Taobao) to Accra, Kumasi, and Tema. Pay with Momo. Door-to-door delivery, customs clearance included.",
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



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


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
    "telephone": "+233545247009",
    "email": "info@londonsimports.com",
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
      { "@type": "City", "name": "Accra", "containedInPlace": { "@type": "AdministrativeArea", "name": "Greater Accra Region" } },
      { "@type": "City", "name": "Tema" },
      { "@type": "City", "name": "Ashaiman" },
      { "@type": "City", "name": "Madina" },
      { "@type": "City", "name": "East Legon" },
      { "@type": "City", "name": "Spintex" },
      { "@type": "City", "name": "Teshie" },
      { "@type": "City", "name": "Nungua" },
      { "@type": "City", "name": "Lashibi" },
      { "@type": "City", "name": "Kumasi" },
      { "@type": "City", "name": "Takoradi" },
      { "@type": "AdministrativeArea", "name": "Greater Accra Region" },
      { "@type": "Country", "name": "Ghana" }
    ],
    "priceRange": "GHS 50 - GHS 10000",
    "currenciesAccepted": "GHS",
    "paymentAccepted": "Mobile Money, Bank Transfer, Cash",
    "sameAs": [
      "https://wa.me/233545247009",
      "https://www.instagram.com/londonimportsghana",
      "https://www.tiktok.com/@londons_imports1",
      "https://www.snapchat.com/add/londons_imports"
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

  // FAQ Schema for Google's "People Also Ask"
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I buy from China to Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With London's Imports, you can easily buy from China (1688, Alibaba, Taobao) and have it shipped to Ghana. Simply browse our products, place your order, pay with Mobile Money, and we handle shipping, customs clearance, and doorstep delivery to Accra, Tema, Kumasi, and anywhere in Ghana."
        }
      },
      {
        "@type": "Question",
        "name": "What is mini importation in Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mini importation is the process of buying goods in small quantities from overseas suppliers (mainly China) and having them shipped to Ghana. It's popular for electronics, fashion, gadgets, and wholesale goods. London's Imports makes this easy by handling all logistics."
        }
      },
      {
        "@type": "Question",
        "name": "How much does shipping from China to Ghana cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shipping costs vary based on weight, size, and shipping method (air or sea). Air freight from China to Ghana typically costs GHS 50-150 per kg. London's Imports offers transparent pricing with no hidden fees. Use our customs estimator for accurate quotes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I pay with Mobile Money for China imports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! London's Imports accepts MTN Mobile Money, AirtelTigo Money, and Vodafone Cash. You can pay in Ghana Cedis (GHS) for all your orders from China. No need for international cards or foreign currency."
        }
      },
      {
        "@type": "Question",
        "name": "How long does shipping from China to Accra take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Air freight from China to Accra typically takes 7-14 days. Sea freight takes 30-45 days but is more affordable for heavy items. London's Imports provides real-time tracking so you always know where your package is."
        }
      },
      {
        "@type": "Question",
        "name": "Do you handle customs clearance in Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, London's Imports handles all customs duties and clearance at Tema Port and Kotoka International Airport. The price you see includes customs fees - no surprises. We're licensed clearance agents with years of experience."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver to Tema, Ashaiman, and Madina?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer door-to-door delivery across Greater Accra including Tema, Ashaiman, Madina, East Legon, Spintex, Teshie, Nungua, Dansoman, and more. We also deliver to Kumasi, Takoradi, Cape Coast, and all major cities in Ghana."
        }
      }
    ]
  };

  return (
    <html lang="en-GH" suppressHydrationWarning>
      <head>
        {/* Preload LCP image for faster hero rendering */}
        <link
          rel="preload"
          href="/assets/images/newyear-drop.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://london-imports-api.onrender.com" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <Navbar />
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
