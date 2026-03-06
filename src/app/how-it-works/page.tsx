/**
 * London's Imports - How It Works Page
 * Explains the pre-order process with animated phone mockup
 */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';
import FAQAccordion from '@/components/FAQAccordion';
import { PhoneMockup } from '@/components/how-it-works/PhoneMockup';


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
