'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';

const CheckoutHeader = () => (
    <div className="mb-10 relative z-10 transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/10 pb-6">
            <Link href="/" className="group flex items-center gap-2">
                <div className="text-xl font-serif font-black tracking-tighter nuclear-text group-hover:scale-105 transition-transform">
                    LON<span className="text-emerald-500">DON</span>S
                </div>
            </Link>
            
            <h1 className="hidden md:block text-2xl font-black nuclear-text tracking-tight uppercase">
                Checkout
            </h1>

            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Lock className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Secure Checkout</span>
            </div>
        </div>
    </div>
);

export default CheckoutHeader;
