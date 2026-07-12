import { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export const metadata: Metadata = {
  title: "WAEC Checker Purchase Successful | London's Imports",
  description: "Check your purchased results checker serial and pin details.",
  robots: "noindex, nofollow", // Prevent indexing of success checkout page
};

export default function CheckerSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-emerald/30 border-t-brand-emerald rounded-full animate-spin" />
          <p className="text-xs text-content-secondary font-bold uppercase tracking-widest">Loading details...</p>
        </div>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
