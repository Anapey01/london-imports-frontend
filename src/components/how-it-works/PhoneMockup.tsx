import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ReserveScreen } from './ReserveScreen';
import { TrackScreen } from './TrackScreen';
import styles from '@/app/how-it-works/how-it-works.module.css';

interface PhoneMockupProps {
    activeStep: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ activeStep }) => {
    const [searchText, setSearchText] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const searchQuery = 'iPhone 15 Pro...';

    // Typewriter effect for browse step
    useEffect(() => {
        if (activeStep === 0) {
            setSearchText('');
            setShowResults(false);
            setSelectedProduct(null);
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < searchQuery.length) {
                    setSearchText(searchQuery.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => setShowResults(true), 300);
                    // Auto-select first product after results show
                    setTimeout(() => setSelectedProduct(0), 1800);
                }
            }, 100);
            return () => clearInterval(typeInterval);
        }
    }, [activeStep]);

    // Professional phone SVG icon (Editorial Edition)
    const PhoneIcon = ({ color }: { color: string }) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <rect x="5" y="2" width="14" height="20" rx="1" className={color} />
            <rect x="7" y="4" width="10" height="14" rx="0.5" fill="white" opacity="0.9" />
            <circle cx="12" cy="20" r="0.8" fill="white" opacity="0.6" />
        </svg>
    );

    const products = [
        { name: 'iPhone 15 Pro Max', price: 'GHS 8,500', color: 'fill-slate-900', bg: 'bg-slate-50' },
        { name: 'iPhone 15 Pro', price: 'GHS 7,200', color: 'fill-slate-700', bg: 'bg-slate-50' },
        { name: 'iPhone 15', price: 'GHS 5,800', color: 'fill-slate-500', bg: 'bg-slate-50' },
    ];

    const screens = [
        // Step 1: Browse (Editorial Protocol Style)
        <div key="browse" className="h-full bg-white rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-slate-100 flex items-center justify-center overflow-hidden grayscale">
                    <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-900 uppercase">London&apos;s Protocol</span>
            </div>

            {/* Search Bar with Typewriter */}
            <div className="bg-slate-50 rounded-lg px-4 py-3 mb-6 flex items-center gap-3 border border-slate-100">
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-[11px] font-medium text-slate-900 flex-1 tabular-nums tracking-tight">
                    {searchText}
                    <span className="inline-block w-0.5 h-3 bg-slate-900 ml-0.5 animate-pulse"></span>
                </span>
            </div>

            {/* Results Grid (High-Contrast Monochrome) */}
            <div className="flex-1 space-y-3 overflow-hidden">
                {showResults && products.map((p, i) => (
                    <div
                        key={i}
                        className={`flex gap-4 p-3 rounded-lg animate-fade-in-up cursor-pointer transition-all duration-500 ${i === 0 ? 'delay0' : i === 1 ? 'delay1' : 'delay2'} ${selectedProduct === i
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-50'
                            }`}
                    >
                        <div className={`w-10 h-10 ${p.bg} rounded flex items-center justify-center overflow-hidden border border-slate-100`}>
                            <PhoneIcon color={p.color} />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className={`text-[10px] font-bold truncate uppercase tracking-tight ${selectedProduct === i ? 'text-white' : 'text-slate-900'}`}>
                                {p.name}
                            </div>
                            <div className={`text-[11px] font-bold ${selectedProduct === i ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {p.price}
                            </div>
                        </div>
                        {selectedProduct === i ? (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center self-center shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="text-slate-200 text-xs self-center">→</div>
                        )}
                    </div>
                ))}
                {!showResults && (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-[3px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Selection Status */}
            {selectedProduct !== null && (
                <div className="mt-4 bg-emerald-600 rounded-lg py-3 text-center animate-fade-in-up shadow-xl shadow-emerald-600/20">
                    <span className="text-white text-[11px] font-black uppercase tracking-widest">Protocol 01 / Initiate</span>
                </div>
            )}
        </div>,

        // Step 2: Reserve (Now uses Neutralized ReserveScreen)
        <ReserveScreen key={`reserve-${activeStep}`} activeStep={activeStep} />,

        // Step 3: Track (Now uses Neutralized TrackScreen)
        <TrackScreen key={`track-${activeStep}`} activeStep={activeStep} />,

        // Step 4: Finalize
        <div key="receive" className="h-full bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-8 group animate-pulse">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div className="text-[11px] font-black text-emerald-600 mb-2 uppercase tracking-[0.3em] font-sans italic">Delivered / Arrival</div>
            <div className="text-3xl font-serif font-black text-slate-900 mb-6 leading-none">Arrival Complete.</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed">
                Your order has reached the Accra Hub and is ready for local dispatch.
            </div>
            <div className="bg-slate-900 text-white rounded px-6 py-4 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">
                Final Settlement: GHS 250
            </div>
        </div>,
    ];

    return (
        <div className="relative">
            {/* Phone Frame - Harden to Pitch Black */}
            <div className="w-64 h-[500px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl ring-1 ring-white/5">
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-950 rounded-full z-10"></div>

                {/* Screen */}
                <div
                    className={`w-full h-full rounded-[2.2rem] overflow-hidden relative ${styles.phoneMockup} bg-white text-slate-900`}
                >
                    {/* Status Bar */}
                    <div className="h-8 flex items-center justify-between px-8 text-[9px] bg-white text-slate-400 font-bold tracking-tighter">
                        <span>9:41</span>
                        <div className="flex gap-1.5 items-center">
                            <div className="w-4 h-2 rounded-[1px] bg-slate-200"></div>
                            <div className="w-4 h-2 rounded-[1px] bg-slate-200"></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 h-[calc(100%-2rem)] text-slate-900">
                        {screens[activeStep]}
                    </div>
                </div>
            </div>

            {/* Step indicator dots - Minimalist Protocol style */}
            <div className="flex justify-center gap-3 mt-10">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`transition-all duration-700 ${activeStep === i 
                            ? 'w-10 h-1.5 bg-slate-900' 
                            : 'w-2 h-1.5 bg-slate-100'}`}
                    />
                ))}
            </div>
        </div>
    );
};
