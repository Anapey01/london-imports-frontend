'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Instagram, 
  Smartphone, 
  Star,
  ExternalLink,
  Ghost,
  ChevronRight,
  Facebook
} from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Editorial "Link-in-Bio" Content with Micro-Analytics
 * Wrapped in Suspense to satisfy Next.js static generation requirements 
 * when using useSearchParams().
 */
function LinksContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'direct'; // Capture source (tiktok, ig, etc)

  // GA4 Micro-Analytics Trigger
  const trackInteraction = (label: string) => {
    const gtag = (window as typeof window & { gtag?: (event: string, action: string, params: Record<string, unknown>) => void }).gtag;
    if (typeof window !== 'undefined' && gtag) {
      gtag('event', 'social_hub_click', {
        'event_category': 'Conversion Funnel',
        'event_label': label,
        'source_platform': ref,
        'page_location': window.location.href
      });
    }
  };

  const primaryLinks = [
    {
      title: "Shop the Pre-order Catalog",
      description: "Curated imports from China to Ghana",
      href: "/products",
      icon: ShoppingBag,
      priority: true
    },
    {
      title: "Request a Custom Quote",
      description: "Our concierge team finds any product for you",
      href: `https://wa.me/${siteConfig.concierge.replace(/\s+/g, '')}`,
      icon: Search,
      priority: true
    }
  ];

  const secondaryLinks = [
    {
      title: "Track My Order",
      href: "/track",
      icon: Truck
    },
    {
      title: "Read the Importation Blog",
      href: "/blog",
      icon: Smartphone
    },
    {
      title: "Our Trustpilot Reviews",
      href: siteConfig.socials.trustpilot,
      icon: Star
    }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: siteConfig.socials.instagram, handle: '@londons_imports' },
    { name: 'TikTok', icon: Smartphone, href: siteConfig.socials.tiktok, handle: '@londons_imports1' },
    { name: 'Snapchat', icon: Ghost, href: siteConfig.socials.snapchat, handle: 'londons_imports' },
    { name: 'Facebook', icon: Facebook, href: siteConfig.socials.facebook, handle: 'Naa Atswei London' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-pink-100 selection:text-pink-900">
      <div className="max-w-xl mx-auto px-6 py-16 md:py-24">
        
        {/* Editorial Header */}
        <header className="flex flex-col items-center text-center mb-16 animate-fade-in">
          <div className="relative w-24 h-24 mb-8 group p-1 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="London's Imports"
              width={96}
              height={96}
              className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-2 italic">
            London&apos;s Imports
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-4">
            Curated Sourcing & Logistics
          </p>
          <div className="h-px w-12 bg-gray-200 mt-2" />
        </header>

        {/* Primary High-Conversion Calls */}
        <section className="space-y-4 mb-12">
          {primaryLinks.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href}
              onClick={() => trackInteraction(link.title)}
              className="group block relative p-1 transition-all duration-300"
            >
              <div className="relative border border-gray-100 bg-white p-6 rounded-xl hover:border-pink-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-pink-300" strokeWidth={1.5} />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-pink-50 transition-colors">
                    <link.icon className="w-5 h-5 text-gray-400 group-hover:text-pink-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                      {link.title}
                    </h2>
                    <p className="text-sm text-gray-400 font-sans tracking-tight">
                       {link.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Refined Secondary Links */}
        <section className="grid grid-cols-1 gap-3 mb-16">
          {secondaryLinks.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href}
              onClick={() => trackInteraction(link.title)}
              className="flex items-center justify-between p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <link.icon className="w-4 h-4 text-gray-300 group-hover:text-gray-900" strokeWidth={1.5} />
                <span className="font-sans text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {link.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
            </Link>
          ))}
        </section>

        {/* Social Presence - Editorialized */}
        <section className="mb-16">
          <div className="flex flex-col gap-4">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackInteraction(`Social: ${social.name}`)}
                className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-pink-50 transition-colors">
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-pink-500" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300 font-bold leading-none mb-1">
                    {social.name}
                  </div>
                  <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                    {social.handle}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Editorial Footer */}
        <footer className="text-center">
          <Link 
            href="/"
            onClick={() => trackInteraction('Back to Site')}
            className="inline-flex items-center gap-2 group opacity-40 hover:opacity-100 transition-opacity"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500">
              Back to londonsimports.com
            </span>
          </Link>
        </footer>

      </div>
    </div>
  );
}

export default function LinksPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
           <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
    }>
      <LinksContent />
    </Suspense>
  );
}
