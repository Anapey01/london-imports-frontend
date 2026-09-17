'use client';

import React from 'react';

interface PricingManagerTabProps {
  becePriceInput: string;
  setBecePriceInput: (v: string) => void;
  wasscePriceInput: string;
  setWasscePriceInput: (v: string) => void;
  becePrice: number;
  setBecePrice: (v: number) => void;
  wasscePrice: number;
  setWasscePrice: (v: number) => void;
  handlePricingSave: (e: React.FormEvent) => void;
  pricingLoading: boolean;
  pricingSuccess: boolean;
  pricingError: string | null;
}

export default function PricingManagerTab({
  becePriceInput,
  setBecePriceInput,
  wasscePriceInput,
  setWasscePriceInput,
  becePrice,
  setBecePrice,
  wasscePrice,
  setWasscePrice,
  handlePricingSave,
  pricingLoading,
  pricingSuccess,
  pricingError
}: PricingManagerTabProps) {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-content-primary">
          Price Customization
        </h3>
        <p className="text-content-secondary text-xs leading-relaxed font-normal">
          Configure your selling price for each results checker. The margin profit represents your commission per item sold (Selling Price minus locked Base Price).
        </p>
      </div>

      <form onSubmit={handlePricingSave} className="space-y-5">
        {/* BECE Override */}
        <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-content-secondary">
            <span>BECE Checker Pricing</span>
            <span className="text-brand-emerald font-black">Base price: GH₵ 16.50</span>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Selling Price (GH₵)
              </label>
              <input
                type="number"
                step="0.01"
                min="16.50"
                value={becePriceInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setBecePriceInput(val);
                  const parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                    setBecePrice(parsed);
                  }
                }}
                className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
              />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-content-secondary mb-1">
                Your Profit Margin
              </span>
              <div className="font-mono text-sm font-bold text-brand-emerald h-[38px] flex items-center">
                + GH₵ {(becePrice - 16.50).toFixed(2)} / sale
              </div>
            </div>
          </div>
        </div>

        {/* WASSCE Override */}
        <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-content-secondary">
            <span>WASSCE / SSCE Pricing</span>
            <span className="text-brand-emerald font-black">Base price: GH₵ 16.50</span>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Selling Price (GH₵)
              </label>
              <input
                type="number"
                step="0.01"
                min="16.50"
                value={wasscePriceInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setWasscePriceInput(val);
                  const parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                    setWasscePrice(parsed);
                  }
                }}
                className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
              />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-content-secondary mb-1">
                Your Profit Margin
              </span>
              <div className="font-mono text-sm font-bold text-brand-emerald h-[38px] flex items-center">
                + GH₵ {(wasscePrice - 16.50).toFixed(2)} / sale
              </div>
            </div>
          </div>
        </div>

        {pricingSuccess && (
          <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold rounded-none text-xs uppercase tracking-wide">
            Selling prices saved successfully!
          </div>
        )}

        {pricingError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
            {pricingError}
          </div>
        )}

        <button
          type="submit"
          disabled={pricingLoading}
          className="bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald transition-colors"
        >
          {pricingLoading ? 'Saving changes...' : 'Save Selling Prices'}
        </button>
      </form>
    </div>
  );
}
