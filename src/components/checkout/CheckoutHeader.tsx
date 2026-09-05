'use client';

import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CheckoutHeader = () => (
    <div className="mb-8 sm:mb-10 relative z-10 transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/10 pb-5 sm:pb-6">
            <div className="flex items-center gap-3">
                <Link 
                    href="/cart" 
                    className="p-1.5 -ml-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Back to Cart"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl sm:text-2xl font-semibold nuclear-text tracking-tight uppercase">
                    Checkout
                </h1>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-500 dark:text-emerald-400">
                <Lock className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-sans">Secure Checkout</span>
            </div>
        </div>
    </div>
);

export default CheckoutHeader;
