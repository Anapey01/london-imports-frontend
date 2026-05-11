import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';

interface ReserveScreenProps {
    activeStep: number;
}

export const ReserveScreen: React.FC<ReserveScreenProps> = ({ activeStep }) => {
    const [phase, setPhase] = useState<'input' | 'processing' | 'success'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneQuery = '024 XXX 1234';

    useEffect(() => {
        if (activeStep === 1) {
            setPhase('input');
            setPhoneNumber('');
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < phoneQuery.length) {
                    setPhoneNumber(phoneQuery.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => setPhase('processing'), 500);
                    setTimeout(() => {
                        setPhase('success');
                        sounds.success();
                    }, 2000);
                }
            }, 80);
            return () => clearInterval(typeInterval);
        }
    }, [activeStep]);

    if (phase === 'success') {
        return (
            <div key="reserve-success" className="h-full p-6 flex flex-col items-center justify-center text-center bg-white text-slate-900">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 animate-[scale-in_0.5s_ease-out] bg-emerald-50 border border-emerald-100">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 italic">Success / Confirmed</div>
                <div className="text-2xl font-serif font-black mb-1 text-slate-900 tracking-tight leading-none">Reserved.</div>
                <div className="text-[10px] mb-8 text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Deposit of GHS 150.00 confirmed and order secured.</div>
                
                <div className="bg-slate-50 border border-slate-100 p-4 w-full">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Order Reference</div>
                    <div className="text-[11px] font-black text-slate-900 tabular-nums">#LI-EST-2026-0847</div>
                </div>
            </div>
        );
    }

    if (phase === 'processing') {
        return (
            <div key="reserve-processing" className="h-full p-6 flex flex-col items-center justify-center text-center bg-white text-slate-900">
                <div className="w-10 h-10 border-[3px] border-slate-100 border-t-slate-900 rounded-full animate-spin mb-8"></div>
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 animate-pulse">Processing Payment...</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Waiting for MoMo confirmation</div>
            </div>
        );
    }

    return (
        <div key="reserve" className="h-full p-6 flex flex-col bg-white text-slate-900">
            <header className="border-b border-slate-900 pb-6 mb-8 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">MoMo Payment</div>
                <div className="text-xl font-serif font-black text-slate-900 tracking-tight">Reserve Slot</div>
            </header>

            <div className="border border-slate-100 p-6 mb-6 flex items-center gap-4 bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white font-black text-[10px] uppercase tracking-tighter">MTN</div>
                <div className="flex-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Phone Number</div>
                    <div className="text-[13px] font-black flex items-center text-slate-900 tabular-nums">
                        {phoneNumber}
                        <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse bg-slate-900"></span>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8">
                <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">iPhone 15 Pro Max</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Deposit</span>
                    <span className="text-xl font-serif font-black text-emerald-600 tabular-nums tracking-tighter">GHS 150.00</span>
                </div>
            </div>

            <div className="mt-auto bg-slate-900 py-3 text-center shadow-xl shadow-slate-900/10">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Pay Now →</span>
            </div>
        </div>
    );
};
