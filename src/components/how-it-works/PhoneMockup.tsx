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

    // Professional phone SVG icon
    const PhoneIcon = ({ color }: { color: string }) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <rect x="5" y="2" width="14" height="20" rx="3" className={color} />
            <rect x="7" y="4" width="10" height="14" rx="1" fill="white" opacity="0.9" />
            <circle cx="12" cy="20" r="1" fill="white" opacity="0.6" />
            <rect x="9" y="5" width="6" height="1" rx="0.5" fill="currentColor" opacity="0.2" />
        </svg>
    );

    const products = [
        { name: 'iPhone 15 Pro Max', price: 'GHS 8,500', color: 'fill-blue-500', bg: 'bg-gradient-to-br from-blue-100 to-blue-50' },
        { name: 'iPhone 15 Pro', price: 'GHS 7,200', color: 'fill-purple-500', bg: 'bg-gradient-to-br from-purple-100 to-purple-50' },
        { name: 'iPhone 15', price: 'GHS 5,800', color: 'fill-pink-500', bg: 'bg-gradient-to-br from-pink-100 to-pink-50' },
    ];

    const screens = [
        // Step 1: Browse with typewriter and selection
        <div key="browse" className="h-full bg-white rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                    <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-gray-900">London&apos;s Imports</span>
            </div>

            {/* Search Bar with Typewriter */}
            <div className="bg-gray-100 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs text-gray-800 flex-1">
                    {searchText}
                    <span className="inline-block w-0.5 h-3 bg-pink-400 ml-0.5 animate-pulse"></span>
                </span>
            </div>

            {/* Results with professional icons */}
            <div className="flex-1 space-y-2 overflow-hidden">
                {showResults && products.map((p, i) => (
                    <div
                        key={i}
                        className={`flex gap-3 p-2 rounded-xl animate-fade-in-up cursor-pointer transition-all duration-300 ${i === 0 ? 'delay0' : i === 1 ? 'delay1' : 'delay2'} ${selectedProduct === i
                            ? 'bg-pink-100 ring-2 ring-pink-400 scale-[1.02]'
                            : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className={`w-10 h-10 ${p.bg} rounded-lg flex items-center justify-center shadow-sm`}>
                            <PhoneIcon color={p.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{p.name}</div>
                            <div className="text-xs font-bold text-pink-400">{p.price}</div>
                        </div>
                        {selectedProduct === i ? (
                            <div className="w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="text-pink-400 text-xs self-center">→</div>
                        )}
                    </div>
                ))}
                {!showResults && (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Add to Cart Button */}
            {selectedProduct !== null && (
                <div className="mt-3 bg-pink-400 rounded-xl py-2 text-center animate-fade-in-up">
                    <span className="text-white text-xs font-semibold">Pre-order Now →</span>
                </div>
            )}
        </div>,

        // Step 2: Reserve with MoMo Payment Animation
        <ReserveScreen key={`reserve-${activeStep}`} activeStep={activeStep} />,

        // Step 3: Track with SMS Notification
        <TrackScreen key={`track-${activeStep}`} activeStep={activeStep} />,

        // Step 4: Receive
        <div key="receive" className="h-full bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-2">Delivered!</div>
            <div className="text-sm text-gray-500 mb-4">Your order has arrived</div>
            <div className="bg-pink-400 text-white rounded-xl px-4 py-2 text-sm font-semibold">
                Pay Balance: GHS 250
            </div>
        </div>,
    ];

    return (
        <div className="relative">
            {/* Phone Frame */}
            <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full z-10"></div>

                {/* Screen */}
                <div
                    className={`w-full h-full rounded-[2.2rem] overflow-hidden relative ${styles.phoneMockup} bg-gray-100 text-gray-900`}
                >
                    {/* Status Bar */}
                    <div className="h-8 flex items-center justify-between px-6 text-xs bg-white text-gray-900">
                        <span className="text-gray-900">9:41</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-2 rounded-sm bg-gray-400"></div>
                            <div className="w-4 h-2 rounded-sm bg-gray-400"></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 h-[calc(100%-2rem)] text-gray-900">
                        {screens[activeStep]}
                    </div>
                </div>
            </div>

            {/* Step indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${activeStep === i ? 'bg-pink-400 w-6' : 'bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};
