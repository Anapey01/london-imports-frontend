/**
 * London's Imports - How It Works Page
 * Explains the pre-order process with animated phone mockup
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { sounds } from '@/lib/sounds';
import FAQAccordion from '@/components/FAQAccordion';

// Reserve Screen with MoMo Payment Animation
function ReserveScreen({ activeStep }: { activeStep: number }) {
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
            <div key="reserve-success" className="h-full rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-scale-in" style={{ backgroundColor: '#dcfce7' }}>
                    <svg className="w-8 h-8" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Payment Successful!</div>
                <div className="text-xs mb-3" style={{ color: '#6b7280' }}>GHS 150 received</div>
                <div className="rounded-xl p-3 w-full" style={{ backgroundColor: '#f3f4f6' }}>
                    <div className="text-xs mb-1" style={{ color: '#6b7280' }}>Order Reference</div>
                    <div className="text-sm font-bold" style={{ color: '#f43f5e' }}>#LI-2024-0847</div>
                </div>
            </div>
        );
    }

    if (phase === 'processing') {
        return (
            <div key="reserve-processing" className="h-full rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#fecdd3', borderTopColor: '#f43f5e' }}></div>
                <div className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Processing Payment...</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Waiting for MoMo confirmation</div>
            </div>
        );
    }

    return (
        <div key="reserve" className="h-full rounded-2xl p-4 flex flex-col" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
            <div className="text-center mb-3">
                <div className="text-sm font-bold" style={{ color: '#111827' }}>Mobile Money Payment</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Deposit: GHS 150</div>
            </div>

            <div className="rounded-xl p-3 mb-3 flex items-center gap-3" style={{ backgroundColor: '#fefce8' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: '#facc15' }}>MTN</div>
                <div className="flex-1">
                    <div className="text-xs" style={{ color: '#6b7280' }}>Phone Number</div>
                    <div className="text-sm font-bold flex items-center" style={{ color: '#111827' }}>
                        {phoneNumber}
                        <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: '#ec4899' }}></span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: '#f9fafb' }}>
                <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: '#6b7280' }}>Item</span>
                    <span style={{ color: '#111827' }}>iPhone 15 Pro Max</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span style={{ color: '#6b7280' }}>Deposit</span>
                    <span className="font-bold" style={{ color: '#ec4899' }}>GHS 150</span>
                </div>
            </div>

            <div className="mt-auto rounded-xl py-2.5 text-center" style={{ background: 'linear-gradient(to right, #facc15, #eab308)' }}>
                <span className="text-xs font-bold" style={{ color: '#ffffff' }}>Pay with MoMo →</span>
            </div>
        </div>
    );
}

// Track Screen with SMS Notification
function TrackScreen({ activeStep }: { activeStep: number }) {
    const [showSMS, setShowSMS] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);

    useEffect(() => {
        if (activeStep === 2) {
            setShowSMS(false);
            setCompletedSteps(0);
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
        }
    }, [activeStep]);

    const steps = [
        { label: 'Order Confirmed', icon: 'check' },
        { label: 'Shipped from UK', icon: 'plane' },
        { label: 'Arrived in Ghana', icon: 'box' },
        { label: 'Out for Delivery', icon: 'truck' },
    ];

    return (
        <div key="track" className="h-full rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
            <div className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Order #LI-2024-0847</div>
            <div className="text-xs mb-4" style={{ color: '#6b7280' }}>iPhone 15 Pro Max</div>

            <div className="flex-1 space-y-3">
                {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500"
                            style={{
                                backgroundColor: i < completedSteps ? '#ec4899' : i === completedSteps ? '#fbcfe8' : '#e5e7eb',
                                transform: i < completedSteps || i === completedSteps ? 'scale(1)' : 'scale(0.9)'
                            }}
                        >
                            {i < completedSteps && (
                                <svg className="w-3 h-3" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className="text-xs" style={{ color: i < completedSteps ? '#111827' : '#9ca3af', fontWeight: i < completedSteps ? 500 : 400 }}>
                            {s.label}
                        </span>
                        {i === completedSteps - 1 && i < 3 && (
                            <span className="text-xs ml-auto" style={{ color: '#ec4899' }}>Just now</span>
                        )}
                    </div>
                ))}
            </div>

            {/* SMS Notification Pop-up */}
            {showSMS && (
                <div className="absolute -top-2 left-2 right-2 rounded-xl p-3 shadow-xl animate-fade-in-up z-10" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#22c55e' }}>
                            <svg className="w-4 h-4" fill="#ffffff" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold" style={{ color: '#ffffff' }}>London&apos;s Imports</div>
                            <div className="text-xs" style={{ color: '#d1d5db' }}>Your order has arrived in Ghana! Delivery tomorrow</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-lg p-2 text-center text-xs mt-2" style={{ backgroundColor: '#fdf2f8', color: '#be185d' }}>
                📍 Estimated delivery: Tomorrow, 2PM
            </div>
        </div>
    );
}


// Animated Phone Mockup Component
function PhoneMockup({ activeStep }: { activeStep: number }) {
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
                        className={`flex gap-3 p-2 rounded-xl animate-fade-in-up cursor-pointer transition-all duration-300 ${selectedProduct === i
                            ? 'bg-pink-100 ring-2 ring-pink-400 scale-[1.02]'
                            : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        style={{ animationDelay: `${i * 0.15}s`, opacity: 0, animationFillMode: 'forwards' }}
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
        <ReserveScreen activeStep={activeStep} />,

        // Step 3: Track with SMS Notification
        <TrackScreen activeStep={activeStep} />,

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

                {/* Screen - inline styles force light theme regardless of dark mode */}
                <div
                    className="w-full h-full rounded-[2.2rem] overflow-hidden relative phone-mockup"
                    style={{ backgroundColor: '#f3f4f6', color: '#111827' }}
                >
                    {/* Status Bar */}
                    <div className="h-8 flex items-center justify-between px-6 text-xs" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                        <span style={{ color: '#111827' }}>9:41</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#9ca3af' }}></div>
                            <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#9ca3af' }}></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 h-[calc(100%-2rem)]" style={{ color: '#111827' }}>
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
}

export default function HowItWorksPage() {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-rotate steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            step: '01',
            title: 'Browse & Choose',
            desc: 'Explore our curated selection of products from international suppliers.',
        },
        {
            step: '02',
            title: 'Reserve Your Spot',
            desc: 'Pay a small deposit to secure your order. Your money is held safely.',
        },
        {
            step: '03',
            title: 'We Handle Shipping',
            desc: 'We batch orders and ship directly from suppliers. Get SMS updates.',
        },
        {
            step: '04',
            title: 'Receive & Pay',
            desc: 'Get it delivered to your door. Pay the rest. Not happy? Full refund.',
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-16">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900">
                        How It Works
                    </h1>
                    <p className="text-xl text-slate-600 max-w-xl mx-auto">
                        4 easy steps to get international products delivered to Ghana.
                    </p>
                </div>
            </section>

            {/* Main Content - Split Layout */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Mobile: Phone mockup above steps */}
                    <div className="lg:hidden flex justify-center mb-12">
                        <PhoneMockup activeStep={activeStep} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: Steps */}
                        <div className="space-y-6">
                            {steps.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        sounds.click();
                                        setActiveStep(i);
                                    }}
                                    className={`w-full text-left p-6 rounded-2xl transition-all ${activeStep === i
                                        ? 'bg-rose-50 border-2 border-pink-200 shadow-md'
                                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${activeStep === i
                                            ? 'bg-pink-400 text-white'
                                            : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-semibold mb-1 ${activeStep === i ? 'text-pink-500' : 'text-slate-900'}`}>
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Right: Animated Phone (Desktop only) */}
                        <div className="hidden lg:flex justify-center sticky top-24">
                            <PhoneMockup activeStep={activeStep} />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-500 text-center mb-12">
                        Everything you need to know about pre-ordering.
                    </p>
                    <FAQAccordion />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-800 text-white">
                <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        Ready to start?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Browse our upcoming pre-orders and reserve your products today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 bg-pink-400 text-white font-semibold rounded-full hover:bg-pink-500 transition-all text-lg"
                        >
                            Browse Pre-orders
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-white font-semibold rounded-full hover:border-slate-400 transition-all text-lg"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
