'use client';

import React from 'react';
import { useCheckerPurchase } from '../hooks/useCheckerPurchase';

interface BuyCheckerModalProps {
  hook: ReturnType<typeof useCheckerPurchase>;
}

export default function BuyCheckerModal({ hook }: BuyCheckerModalProps) {
  const {
    openModal,
    checkerType,
    setCheckerType,
    quantity,
    setQuantity,
    updateQuantity,
    emailRef,
    totalPrice,
    loading,
    error,
    showPricingTiers,
    setShowPricingTiers,
    stock,
    stockLoading,
    handleBuySubmit
  } = hook;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
      <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-none w-full max-w-lg shadow-2xl relative">
        <button
          onClick={() => openModal(null)}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary mb-4 pr-8">
            WAEC Results Checker
          </h3>

          {/* Collapsible Pricing ledger block */}
          <div className="border border-slate-200 dark:border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => setShowPricingTiers(!showPricingTiers)}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-[10px] font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <span>Volume Pricing Tiers</span>
              <span className="font-mono text-[10px] text-brand-emerald font-bold whitespace-nowrap ml-2">
                {showPricingTiers ? 'Collapse [−]' : 'Expand [+]'}
              </span>
            </button>
            {showPricingTiers && (
              <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <span>1 to 9 Checkers</span>
                  <span className="text-right font-mono font-bold text-slate-900 dark:text-white">GH₵ 17.00 each</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <span>10 to 29 Checkers</span>
                  <span className="text-right font-mono font-bold text-slate-900 dark:text-white">GH₵ 16.50 each</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <span>30 to 99 Checkers</span>
                  <span className="text-right font-mono font-bold text-slate-900 dark:text-white">GH₵ 16.00 each</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <span>100 or more Checkers</span>
                  <span className="text-right font-mono font-bold text-slate-900 dark:text-white">GH₵ 15.50 each</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleBuySubmit} className="space-y-3">
            {/* Select Type */}
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1.5">
                Select Checker Type <span className="text-red-500">*</span>
              </label>
              <select
                value={checkerType}
                onChange={(e) => setCheckerType(e.target.value as 'BECE' | 'WASSCE')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-none px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              >
                <option value="WASSCE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">WASSCE, SSCE, ABCE</option>
                <option value="BECE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">BECE (School & Private)</option>
              </select>
            </div>

            {/* Quantity & Total Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-none bg-slate-50 dark:bg-slate-900 h-[42px]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 border-r border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="text-md font-bold">−</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) updateQuantity(val);
                    }}
                    className="w-full text-center bg-transparent border-0 font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(q => Math.min(200, q + 1))}
                    disabled={quantity >= 200}
                    className="w-9 h-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 border-l border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="text-md font-bold">+</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  Total Amount
                </label>
                <div className="h-[42px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center px-4">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    GH₵ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="your.email@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-none px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
              <p className="text-[10px] text-content-secondary mt-1">
                Your checker pins & serials will be sent to this email address.
              </p>
            </div>

            {/* Stock Notification Badge */}
            <div className="flex items-center gap-2 py-1">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-content-secondary">
                {stockLoading
                  ? 'Checking live stock availability...'
                  : (stock[checkerType] !== undefined && stock[checkerType] >= 0)
                    ? stock[checkerType] > 0
                      ? `${stock[checkerType]} units available in real-time stock`
                      : 'Temporarily out of stock'
                    : 'Stock verification active'}
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-none">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (!stockLoading && stock[checkerType] === 0)}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing...' : 'Proceed to Pay with Momo'}
              </button>
              <p className="text-[9px] text-content-secondary text-center leading-tight pt-2">
                Independent voucher retailer. Not affiliated with WAEC. Check results at{' '}
                <a href="https://ghana.waecdirect.org" target="_blank" rel="noopener noreferrer" className="underline font-bold text-brand-emerald">
                  ghana.waecdirect.org
                </a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
