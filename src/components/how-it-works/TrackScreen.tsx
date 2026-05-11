import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';

interface TrackScreenProps {
    activeStep: number;
}

export const TrackScreen: React.FC<TrackScreenProps> = ({ activeStep }) => {
    const [showSMS, setShowSMS] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);

    useEffect(() => {
        if (activeStep !== 2) return;

        // Animate steps completing one by one
        const stepTimers = [
            setTimeout(() => setCompletedSteps(1), 500),
            setTimeout(() => setCompletedSteps(2), 1000),
            setTimeout(() => setCompletedSteps(3), 1500),
            setTimeout(() => {
                setShowSMS(true);
                sounds.notification();
            }, 2000),
        ];
        return () => stepTimers.forEach(clearTimeout);
    }, [activeStep]);

    const steps = [
        { label: 'Order Confirmed', id: 'ORD-01' },
        { label: 'Shipped from China', id: 'SHP-02' },
        { label: 'Arrived in Ghana', id: 'ARR-03' },
        { label: 'Local Delivery', id: 'DLV-04' },
    ];

    return (
        <div key="track" className="h-full p-6 flex flex-col relative bg-white text-slate-900">
            <header className="border-b border-slate-900 pb-6 mb-8">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 italic">Order Tracking #LI-0847</div>
                <div className="text-xl font-serif font-black text-slate-900 tracking-tight">iPhone 15 Pro Max</div>
            </header>

            <div className="flex-1 space-y-6">
                {steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-700 mt-1 ${i < completedSteps 
                                ? 'bg-emerald-500 scale-100' 
                                : i === completedSteps ? 'bg-slate-100 scale-100' : 'bg-slate-50 scale-90 opacity-20'
                                }`}
                        >
                            {i < completedSteps && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                             <div className="flex justify-between items-baseline mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${i < completedSteps ? 'text-slate-400' : 'text-slate-200'}`}>
                                    {s.id}
                                </span>
                                {i === completedSteps - 1 && i < 3 && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic animate-pulse">Just now</span>
                                )}
                             </div>
                             <span className={`text-sm font-bold tracking-tight ${i < completedSteps ? 'text-slate-900' : 'text-slate-300'}`}>
                                {s.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* SMS Notification Pop-up (Editorial Strategy) */}
            {showSMS && (
                <div className="absolute top-4 left-4 right-4 bg-slate-950 text-white p-4 shadow-2xl animate-fade-in-up z-10 ring-1 ring-white/10">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1 leading-none">ORDER UPDATE</div>
                            <div className="text-[10px] font-bold text-white leading-tight uppercase tracking-tight">Your order #LI-0847 has reached the Accra Center.</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="border border-slate-100 p-3 text-center text-[9px] font-black uppercase tracking-widest mt-6 bg-slate-50 text-slate-400 italic">
                📍 Scheduled Arrival: Tomorrow, 14:00
            </div>
        </div>
    );
};
