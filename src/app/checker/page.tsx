import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckerClient from './CheckerClient';
import { getAgentPricing } from '@/lib/fetchers';

export const revalidate = 300; // Cache at Vercel Edge for 5 minutes (stale-while-revalidate)

export const metadata: Metadata = {
  title: "WAEC Results Checker Center | London's Imports",
  description: "Buy WASSCE & BECE results checkers instantly in Ghana. Fast, secure payment via mobile money (MTN, Telecel, AT) or card. Retrieve your pins anytime.",
  openGraph: {
    title: "WAEC WASSCE & BECE Results Checker Portal",
    description: "Instant delivery of WAEC Results Checker serials and pins. Pay securely in Cedis via Mobile Money and get your code on-screen and in your email.",
    url: 'https://londonsimports.com/checker',
    siteName: "London's Imports",
    locale: 'en_GH',
    type: 'website',
  },
};

async function CheckerContent() {
  const initialPricingData = await getAgentPricing();
  return <CheckerClient initialPricingData={initialPricingData} />;
}

export default function CheckerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs text-content-secondary font-bold uppercase tracking-widest">Loading Checker Center...</p>
        </div>
      </div>
    }>
      <CheckerContent />
    </Suspense>
  );
}
