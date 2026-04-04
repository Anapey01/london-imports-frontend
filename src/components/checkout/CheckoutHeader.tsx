'use client';

import { Lock } from 'lucide-react';

const CheckoutHeader = () => (
    <div className="flex flex-col gap-6 mb-8 relative z-10 transition-all duration-300">
        <div className="flex items-end justify-between border-b border-slate-900/10 dark:border-white/10 pb-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Session</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-serif font-black nuclear-text tracking-tighter">
                    Secure Checkout
                </h1>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 opacity-40">
                <span className="text-[8px] font-black nuclear-text uppercase tracking-[0.4em]">LTRX-MANIFEST</span>
                <span className="text-[10px] font-black nuclear-text tabular-nums tracking-wider uppercase">v2.4.LI</span>
            </div>
        </div>

        {/* Lean Manifest Progress */}
        <div className="flex items-center justify-between gap-6 px-1">
            {[
                { step: '01', label: 'Sourcing', active: true },
                { step: '02', label: 'Allocation', active: false },
                { step: '03', label: 'Execution', active: false }
            ].map((item, i) => (
                <div key={item.step} className="flex flex-col gap-1.5 flex-1 max-w-[200px]">
                    <div className={`h-[1px] w-full transition-all duration-700 ${item.active ? 'bg-slate-900 dark:bg-white' : 'bg-slate-900/10 dark:bg-white/10'}`} />
                    <div className={`flex items-center gap-2 transition-opacity ${item.active ? 'opacity-100' : 'opacity-20'}`}>
                        <span className="text-[9px] font-black nuclear-text tabular-nums">{item.step}</span>
                        <span className="text-[8px] font-black nuclear-text uppercase tracking-[0.3em] truncate">{item.label}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CheckoutHeader;
