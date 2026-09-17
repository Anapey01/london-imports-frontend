'use client';

import React from 'react';

interface StorefrontLinkTabProps {
  storeLink: string;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export default function StorefrontLinkTab({
  storeLink,
  copiedLink,
  onCopyLink
}: StorefrontLinkTabProps) {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-content-primary">
          Your Shareable Link
        </h3>
        <p className="text-content-secondary text-xs leading-relaxed font-normal">
          Customers who visit this link will buy WASSCE & BECE checkers at your custom prices. Your reseller profile is automatically linked to verify transactions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-xs text-content-primary select-all break-all flex items-center">
          {storeLink}
        </div>
        <button
          onClick={onCopyLink}
          className="bg-content-primary text-surface px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald transition-colors shrink-0"
        >
          {copiedLink ? 'Copied ✓' : 'Copy Link'}
        </button>
      </div>

      <div className="flex gap-4 pt-2">
        <a
          href={`https://api.whatsapp.com/send?text=Buy WASSCE & BECE checkers directly from my store: ${encodeURIComponent(storeLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:opacity-85 text-white font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-none transition-all flex items-center gap-2"
        >
          Share via WhatsApp
        </a>
        <a
          href={storeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-content-primary text-content-primary font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-none transition-all hover:bg-slate-50"
        >
          Visit Storefront ↗
        </a>
      </div>
    </div>
  );
}
