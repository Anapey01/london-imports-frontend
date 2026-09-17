'use client';

import React, { useRef } from 'react';

interface BuyVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkerType: 'BECE' | 'WASSCE';
  setCheckerType: (t: 'BECE' | 'WASSCE') => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
  becePrice: number;
  wasscePrice: number;
  stock: { [key: string]: number };
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function BuyVoucherModal({
  isOpen,
  onClose,
  checkerType,
  setCheckerType,
  quantity,
  setQuantity,
  totalPrice,
  becePrice,
  wasscePrice,
  stock,
  onSubmit,
  loading,
  error,
}: BuyVoucherModalProps) {
  const emailRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = emailRef.current?.value?.trim() || '';
    onSubmit(emailValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
      <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-none w-full max-w-lg shadow-2xl relative animate-elite-entrance">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary mb-4 pr-8">
            Purchase Results Checker
          </h3>

          {/* Pricing breakdown info */}
          <div className="border border-slate-200 dark:border-slate-800 mb-4 p-3 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider space-y-1.5">
            <div className="flex justify-between">
              <span>BECE Checker price:</span>
              <span className="font-mono text-brand-emerald">GH₵ {becePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>WASSCE Checker price:</span>
              <span className="font-mono text-brand-emerald">GH₵ {wasscePrice.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
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
                      if (!isNaN(val)) setQuantity(Math.min(200, Math.max(1, val)));
                    }}
                    className="w-full text-center bg-transparent border-0 text-sm font-bold text-slate-900 dark:text-white focus:ring-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(200, q + 1))}
                    disabled={quantity >= 200}
                    className="w-9 h-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 border-l border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="text-md font-bold">+</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  Total Cost
                </label>
                <div className="h-[42px] flex items-center justify-between px-3 border border-slate-200 dark:border-slate-700 rounded-none bg-slate-50 dark:bg-slate-900 font-bold text-brand-emerald text-sm">
                  <span className="font-mono text-sm ml-auto">GH₵ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Email Delivery */}
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1.5">
                Delivery Email Address <span className="text-red-500">*</span>
              </label>
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="Enter email to receive vouchers"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
              <p className="mt-1.5 text-xs text-content-secondary font-normal">
                Vouchers are displayed on screen and sent to this email.
              </p>
            </div>

            {/* Stock status */}
            <div className="text-xs font-medium text-content-secondary">
              Stock status:{' '}
              {stock[checkerType] > 20 ? (
                <span className="text-brand-emerald font-semibold">In stock</span>
              ) : stock[checkerType] > 0 ? (
                <span className="text-orange-500 font-semibold">Low stock ({stock[checkerType]} left)</span>
              ) : stock[checkerType] === 0 ? (
                <span className="text-orange-500 font-semibold">Limited — order now</span>
              ) : (
                <span className="text-brand-emerald font-semibold">Available</span>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-sm tracking-wide hover:bg-brand-emerald transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Make Payment (GH₵ {totalPrice.toFixed(2)})</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
