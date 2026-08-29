'use client';

import React from 'react';
import Link from 'next/link';
import { useCheckerPurchase } from './hooks/useCheckerPurchase';
import BuyCheckerModal from './components/BuyCheckerModal';
import RetrieveVouchersModal from './components/RetrieveVouchersModal';

export default function CheckerClient({ initialPricingData }: { initialPricingData?: any }) {
  const hook = useCheckerPurchase(initialPricingData);
  const { activeModal, openModal } = hook;

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-content-primary mb-3 tracking-tight">
            WAEC Results Checker Center
          </h1>
          <p className="max-w-md mx-auto text-content-secondary font-normal text-xs sm:text-sm leading-relaxed">
            Instant online purchase of WASSCE and BECE results checkers. Pay securely via Mobile Money & get your codes immediately.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Buy */}
          <div className="bg-surface border border-border-standard rounded-none p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-content-primary">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 border border-border-standard text-content-secondary flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h2 className="text-md font-black text-content-primary mb-3 uppercase tracking-widest">
                Buy Results Checker
              </h2>
              <p className="text-content-secondary text-xs leading-relaxed mb-8 uppercase tracking-wider max-w-xs">
                Pay securely with Mobile Money. Receive Pin Codes instantly on-screen and via Email.
              </p>
            </div>
            <button
              onClick={() => openModal('buy')}
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 cursor-pointer"
            >
              Click Here to Buy
            </button>
          </div>

          {/* Card 2: Retrieve */}
          <div className="bg-surface border border-border-standard rounded-none p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-content-primary">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 border border-border-standard text-content-secondary flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <h2 className="text-md font-black text-content-primary mb-3 uppercase tracking-widest">
                Retrieve History
              </h2>
              <p className="text-content-secondary text-xs leading-relaxed mb-8 uppercase tracking-wider max-w-xs">
                Look up previously purchased pins using the email address specified during your checkout.
              </p>
            </div>
            <button
              onClick={() => openModal('retrieve')}
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 cursor-pointer"
            >
              Click Here to Retrieve
            </button>
          </div>

          {/* Card 3: Be an Agent */}
          <div className="bg-surface border border-border-standard rounded-none p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-content-primary">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 border border-border-standard text-content-secondary flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h2 className="text-md font-black text-content-primary mb-3 uppercase tracking-widest">
                Be an Agent
              </h2>
              <p className="text-content-secondary text-xs leading-relaxed mb-8 uppercase tracking-wider max-w-xs">
                Earn commissions by reselling results checkers at wholesale rates. Manage custom prices and payouts.
              </p>
            </div>
            <Link
              href="/checker/agent/about"
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 text-center"
            >
              Click Here to Join
            </Link>
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center mt-12 text-[10px] text-content-secondary uppercase tracking-widest space-y-2">
          <p>© {new Date().getFullYear()} London&apos;s Imports Ghana. All rights reserved.</p>
          <p>
            For support, contact us at{' '}
            <a href="mailto:gabriel.anapey@raredevs.tech" className="underline font-black hover:text-brand-emerald transition-colors">
              gabriel.anapey@raredevs.tech
            </a>
            {' '}&bull;{' '}
            <a href="tel:0545142658" className="underline font-black hover:text-brand-emerald transition-colors">
              0545142658
            </a>
          </p>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'buy' && <BuyCheckerModal hook={hook} />}
      {activeModal === 'retrieve' && <RetrieveVouchersModal hook={hook} />}
    </div>
  );
}
