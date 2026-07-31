import { Metadata } from 'next';
import { Suspense } from 'react';
import AgentStoreClient from './AgentStoreClient';

type Props = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: "WAEC Results Checker Center | London's Imports",
  description: "Buy WASSCE & BECE results checkers instantly in Ghana. Fast, secure payment via mobile money or card. Retrieve your pins anytime.",
};

export default async function AgentStorePage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-emerald/30 border-t-brand-emerald rounded-full animate-spin" />
          <p className="text-xs text-content-secondary font-bold uppercase tracking-widest">Loading Storefront...</p>
        </div>
      </div>
    }>
      <AgentStoreClient slug={slug} />
    </Suspense>
  );
}
