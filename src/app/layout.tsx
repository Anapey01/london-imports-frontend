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
  metadataBase: new URL('https://london-import-frontend.vercel.app'), // Update with actual domain if custom
  title: "London's Imports - Premier Mini-Importation & Consolidation",
  description: "The trusted bridge for shipping from China to Ghana. Buy from 1688/Alibaba, pay with Momo, and get door-to-door delivery. Experts in air freight and customs clearance.",
  keywords: [
    "Shipping from China to Ghana", "Buy from 1688 to Ghana", "China to Ghana consolidation", // Primary
    "Ghana Customs duty for electronics", "Air freight rates Guangzhou to Accra", "Door to door shipping Ghana", // Secondary
    "How to pay 1688 with Momo", "Clearance agents in Tema Port", "Buy from Alibaba ship to Ghana", // Transactional
    "Mini-Importation Ghana", "London's Imports"
  ],
  openGraph: {
    title: "London's Imports - China to Ghana Consolidation",
    description: "Start your mini-importation business today. We handle shipping, customs, and delivery from Guangzhou to Accra. Pay in Cedis.",
    url: 'https://london-import-frontend.vercel.app',
    siteName: "London's Imports",
    images: [
      {
        url: '/og-image.jpg', // Must be in public folder
        width: 1200,
        height: 630,
        alt: "London's Imports - China to Ghana Shipping",
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "London's Imports",
    "url": "https://london-import-frontend.vercel.app",
    "description": "Pre-order platform for authentic goods from China to Ghana.",
    "logo": "https://london-import-frontend.vercel.app/logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Accra",
      "addressCountry": "GH"
    },
    // Add "potentialAction" for Search Action if needed
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
