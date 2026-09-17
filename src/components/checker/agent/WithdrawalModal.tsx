'use client';

import React from 'react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  payoutAmount: string;
  setPayoutAmount: (v: string) => void;
  payoutNetwork: string;
  setPayoutNetwork: (v: string) => void;
  payoutNumber: string;
  setPayoutNumber: (v: string) => void;
  handlePayoutSubmit: (e: React.FormEvent) => void;
  payoutLoading: boolean;
  payoutError: string | null;
  payoutSuccess: boolean;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  walletBalance,
  payoutAmount,
  setPayoutAmount,
  payoutNetwork,
  setPayoutNetwork,
  payoutNumber,
  setPayoutNumber,
  handlePayoutSubmit,
  payoutLoading,
  payoutError,
  payoutSuccess
}: WithdrawalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
      <div className="bg-surface border border-slate-200 rounded-none w-full max-w-md shadow-2xl relative animate-elite-entrance">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary mb-4">
            Withdraw Reseller Earnings
          </h3>

          <div className="mb-4 bg-slate-50 border border-slate-200 p-3 text-xs font-semibold uppercase tracking-wider text-content-secondary flex justify-between">
            <span>Available Balance:</span>
            <span className="font-mono text-brand-emerald font-bold">GH₵ {walletBalance.toFixed(2)}</span>
          </div>

          <form onSubmit={handlePayoutSubmit} className="space-y-4">
            {/* Payout amount */}
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1.5">
                Amount to Withdraw (GH₵) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1.00"
                max={walletBalance}
                required
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Minimum GH₵ 1.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
              />
              <p className="mt-1 text-[10px] text-content-secondary uppercase font-semibold">
                Must be at least GH₵ 1.00
              </p>
            </div>

            {/* Mobile Money Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  MoMo Network <span className="text-red-500">*</span>
                </label>
                <select
                  value={payoutNetwork}
                  onChange={(e) => setPayoutNetwork(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-medium focus:outline-none"
                >
                  <option value="MTN">MTN</option>
                  <option value="TELECEL">Telecel</option>
                  <option value="AT">AirtelTigo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  Recipient Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  placeholder="e.g. 0545142658"
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {payoutSuccess && (
              <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold rounded-none text-xs uppercase tracking-wide">
                Withdrawal request submitted successfully!
              </div>
            )}

            {payoutError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                {payoutError}
              </div>
            )}

            <button
              type="submit"
              disabled={payoutLoading || walletBalance < 1}
              className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {payoutLoading ? 'Submitting request...' : 'Confirm Withdrawal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
