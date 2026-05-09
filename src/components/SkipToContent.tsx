'use client';

import React from 'react';

/**
 * London's Imports - Skip To Content (Signature Protocol)
 * Hardened for WCAG 'Operable' Navigation Bypass.
 */
export default function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] px-8 py-4 bg-[#0a0f1d] text-brand-emerald font-black text-[11px] uppercase tracking-[0.3em] rounded-b-2xl border-x border-b border-brand-emerald/20 shadow-2xl transition-all duration-500 -translate-y-full focus:translate-y-0 outline-none ring-2 ring-brand-emerald ring-offset-4 ring-offset-surface print:hidden"
        >
            <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-brand-emerald/40" />
                Skip To Protocol Content
                <span className="h-px w-6 bg-brand-emerald/40" />
            </span>
        </a>
    );
}
