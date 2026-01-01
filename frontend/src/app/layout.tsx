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
  title: "London's Imports - Pre-order Platform",
  description: "Reserve before stock arrives. Pay securely. Receive on schedule. Ghana's trusted pre-order platform for China goods.",
  keywords: ["China to Ghana pre-order", "London's Imports", "Buy from China in Ghana", "Cheap electronics Ghana", "Online shopping Ghana", "Pre-order fashion Ghana"],
  openGraph: {
    title: "London's Imports - Premium Pre-orders",
    description: "Direct from China to your doorstep in Ghana. Reserve now, pay later.",
    url: 'https://london-import-frontend.vercel.app',
    siteName: "London's Imports",
    images: [
      {
        url: '/og-image.jpg', // Must be in public folder
        width: 1200,
        height: 630,
        alt: "London's Imports Hero",
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
