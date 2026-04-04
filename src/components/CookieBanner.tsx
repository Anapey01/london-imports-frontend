'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Shield, Settings, Check } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState({
        essential: true,
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        // Initial check for consent state
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('london_imports_cookie_consent_v2');
            if (stored) {
                setIsVisible(false);
            } else {
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleSave = (finalConsent = consent) => {
        localStorage.setItem('london_imports_cookie_consent_v2', JSON.stringify(finalConsent));
        setIsVisible(false);
        // Dispatch event for GA4 to pick up
        window.dispatchEvent(new Event('cookieConsentUpdate'));
    };

    const toggle = (key: keyof typeof consent) => {
        if (key === 'essential') return;
        setConsent(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:pb-8 flex justify-center pointer-events-none">
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] max-w-2xl w-full p-6 md:p-8 flex flex-col pointer-events-auto rounded-none transition-all duration-500 overflow-hidden">
                
                {/* 1. INITIAL VIEW */}
                {!showSettings ? (
                    <div className="flex flex-col gap-8">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex w-12 h-12 border border-slate-950 dark:border-white items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-slate-950 dark:text-white" strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Privacy Preferences
                                </p>
                                <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    We use cookies to personalize your sourcing journey and ensure the platform runs smoothly. Acknowledge our use of cookies to proceed.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="w-full sm:w-auto text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-2 group transition-colors"
                            >
                                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" strokeWidth={1} />
                                Manage Settings
                            </button>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:ml-auto">
                                <Link 
                                    href="/privacy" 
                                    className="hidden sm:inline-flex text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 dark:hover:text-white items-center h-12"
                                >
                                    Privacy Policy
                                </Link>
                                <button
                                    onClick={() => handleSave({ essential: true, analytics: true, marketing: true })}
                                    className="w-full sm:w-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 2. SETTINGS VIEW (Institutional Preferences) */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white">
                                Consent Settings
                            </p>
                            <button 
                                onClick={() => setShowSettings(false)} 
                                className="text-slate-400 hover:text-slate-950 dark:hover:text-white"
                                aria-label="Close Settings"
                            >
                                <X className="w-5 h-5" strokeWidth={1} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Essential */}
                            <div className="flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">Essential Protocol</p>
                                    <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400">Required for cart & login stability.</p>
                                </div>
                                <div className="w-10 h-10 border border-slate-950 dark:border-white flex items-center justify-center opacity-50 cursor-not-allowed">
                                    <Check className="w-4 h-4 text-slate-950 dark:text-white" />
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">Performance Tools</p>
                                    <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400">Helps us improve your page experience.</p>
                                </div>
                                <button 
                                    onClick={() => toggle('analytics')}
                                    className={`w-10 h-10 border transition-all duration-300 flex items-center justify-center ${consent.analytics ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950' : 'border-slate-200 text-transparent'}`}
                                    aria-label="Toggle Performance Metrics"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Marketing */}
                            <div className="flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">Sourcing Alerts</p>
                                    <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400">Personalized deals & trend tracking.</p>
                                </div>
                                <button 
                                    onClick={() => toggle('marketing')}
                                    className={`w-10 h-10 border transition-all duration-300 flex items-center justify-center ${consent.marketing ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950' : 'border-slate-200 text-transparent'}`}
                                    aria-label="Toggle Sourcing Alerts"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-900">
                             <button
                                onClick={() => setShowSettings(false)}
                                className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => handleSave()}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Save Selection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
