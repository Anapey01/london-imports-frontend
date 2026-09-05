import { Metadata } from 'next';
import { Suspense } from 'react';
import AgentStoreClient from './AgentStoreClient';
import { getAgentPricing } from '@/lib/fetchers';

// ISR: Revalidate agent storefronts every 24 hours to preserve Vercel free tier and enable edge caching
export const revalidate = 86400;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getAgentPricing(slug);
    const storeName = data?.store_name || "Results Checker Center";
    return {
      title: `${storeName} - WAEC Results Checker Center | London's Imports`,
      description: `Buy WASSCE & BECE results checkers instantly in Ghana via ${storeName}. Fast, secure payment via mobile money (MTN, Telecel, AT) or card. Retrieve your pins anytime.`,
      openGraph: {
        title: `${storeName} - WAEC WASSCE & BECE Results Checker Portal`,
        description: `Instant delivery of WAEC Results Checker serials and pins. Pay securely in Cedis via Mobile Money and get your code instantly.`,
        url: `https://londonsimports.com/checker/s/${slug}`,
        siteName: "London's Imports",
        locale: 'en_GH',
        type: 'website',
      },
    };
  } catch (e) {
    return {
      title: "WAEC Results Checker Center | London's Imports",
      description: "Buy WASSCE & BECE results checkers instantly in Ghana. Fast, secure payment via mobile money or card. Retrieve your pins anytime.",
    };
  }
}

async function AgentStoreContent({ slug }: { slug: string }) {
  const initialPricingData = await getAgentPricing(slug);
  return <AgentStoreClient slug={slug} initialPricingData={initialPricingData} />;
}

export default async function AgentStorePage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs text-content-secondary font-bold uppercase tracking-widest">Loading Storefront...</p>
        </div>
      </div>
    }>
      <AgentStoreContent slug={slug} />
    </Suspense>
  );
}
