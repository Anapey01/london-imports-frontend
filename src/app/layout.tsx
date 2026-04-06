/**
 * London's Imports - Root Layout
 * Includes Navbar, providers, and global styles
 */
import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Montserrat } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/providers/Providers";
import { Toaster } from 'react-hot-toast';
import PWAUpdater from "@/components/PWAUpdater";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/config/site";

import ReloadPrompt from '@/components/pwa/ReloadPrompt';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WebVitalsReporter from '@/components/analytics/WebVitalsReporter';
import { Suspense } from "react";
import SkipToContent from "@/components/SkipToContent";


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


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://londonsimports.com/#organization",
    "name": "London's Imports Ghana",
    "legalName": "London's Imports Ghana Limited",
    "alternateName": ["Mini Importation Ghana", "Londons Imports GH"],
    "url": "https://londonsimports.com",
    "description": "Ghana's leading mini-importation logistics and sourcing platform. Shop from China (1688, Alibaba, Taobao) directly to Accra, Kumasi, and Tema. Independent Ghanaian entity with local doorstep delivery.",
    "logo": "https://londonsimports.com/logo.jpg",
    "image": "https://londonsimports.com/og-image.jpg",
    "telephone": [`+${siteConfig.whatsapp}`, `+${siteConfig.concierge}`],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": `+${siteConfig.whatsapp}`,
        "contactType": "customer support",
        "areaServed": "GH",
        "availableLanguage": "en"
      },
      {
        "@type": "ContactPoint",
        "telephone": `+${siteConfig.concierge}`,
        "contactType": "concierge and order tracking",
        "areaServed": "GH",
        "availableLanguage": "en"
      }
    ],
    "email": "info@londonsimports.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "danfa road nearTwinkle angle school, Danfa",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra",
      "postalCode": "GM-1739",
      "addressCountry": "GH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 5.7821, // Updated for Danfa, Accra more precisely
      "longitude": -0.1517
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
    "priceRange": "GH₵₵",
    "currenciesAccepted": "GHS",
    "paymentAccepted": "Mobile Money (Momo), MTN MoMo, Vodafone Cash, AirtelTigo Money, Bank Transfer",
    "sameAs": [
      "https://instagram.com/londonsimports",
      "https://tiktok.com/@londonsimports",
      "https://snapchat.com/add/londonsimports",
      "https://x.com/londonsimports",
      siteConfig.socials.whatsapp,
      siteConfig.socials.concierge,
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
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sourcing Agent",
            "description": "Find suppliers on 1688 and Alibaba for Ghana businesses"
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "London's Imports",
    "url": "https://londonsimports.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://londonsimports.com/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const globalBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://londonsimports.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://londonsimports.com/products" },
      { "@type": "ListItem", "position": 3, "name": "How it Works", "item": "https://londonsimports.com/how-it-works" },
      { "@type": "ListItem", "position": 4, "name": "Sourcing Hub", "item": "https://londonsimports.com/blog" }
    ]
  };

  return (
    <html lang="en-GH" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href={new URL(siteConfig.apiUrl).origin} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Global Organization Schema */}
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Sitelink Search Schema */}
        <script
          id="search-box-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* FAQ Schema for People Also Ask */}
        <script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Global Breadcrumb Schema */}
        <script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalBreadcrumbSchema) }}
        />
      </head>
      <body className={`${sourceSerif.variable} ${montserrat.variable} font-sans bg-stationery min-h-screen shadow-inner transition-colors duration-300`} suppressHydrationWarning>
        <SkipToContent />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `}
        </Script>

        <Suspense fallback={null}>
          <GoogleAnalytics />
          <WebVitalsReporter />
        </Suspense>

        <Providers>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#020617',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.4)',
              },
            }}
          />
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
