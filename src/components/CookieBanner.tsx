'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Shield } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState({
        essential: true,
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('london_imports_cookie_consent_v2');
            if (stored) {
                setIsVisible(false);
                return;
            }

            let timer: NodeJS.Timeout;
            const showBanner = () => {
                setIsVisible(true);
                cleanup();
            };

            const cleanup = () => {
                clearTimeout(timer);
                window.removeEventListener('scroll', showBanner);
                window.removeEventListener('touchstart', showBanner);
                window.removeEventListener('pointerdown', showBanner);
                window.removeEventListener('mousemove', showBanner);
                window.removeEventListener('keydown', showBanner);
            };

            // Setup interaction listeners
            window.addEventListener('scroll', showBanner, { passive: true });
            window.addEventListener('touchstart', showBanner, { passive: true });
            window.addEventListener('pointerdown', showBanner, { passive: true });
            window.addEventListener('mousemove', showBanner, { passive: true });
            window.addEventListener('keydown', showBanner, { passive: true });

            // Fallback timer of 5 seconds (safely after primary LCP measurements)
            timer = setTimeout(showBanner, 5000);

            return cleanup;
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
        <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-0 z-[999] p-4 pb-24 md:pb-6 md:p-6 pointer-events-none flex justify-center md:justify-end">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[360px] w-full p-5 flex flex-col pointer-events-auto rounded-none transition-all duration-300 overflow-hidden">
                
                {/* 1. INITIAL VIEW */}
                {!showSettings ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex w-8 h-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-500" strokeWidth={2} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
                                    Cookie Preferences
                                </h3>
                                <p className="text-[12px] font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                                    We use cookies to personalize your shopping experience, analyze traffic, and keep things running smoothly.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                Customize
                            </button>
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/privacy" 
                                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline underline-offset-4"
                                >
                                    Policy
                                </Link>
                                <button
                                    onClick={() => handleSave({ essential: true, analytics: true, marketing: true })}
                                    className="bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 2. SETTINGS VIEW */
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                                Consent Settings
                            </h3>
                            <button 
                                onClick={() => setShowSettings(false)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                aria-label="Close Settings"
                            >
                                <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>

                        <div className="space-y-4">
                             {/* Essential */}
                            <div className="flex justify-between items-center gap-4">
                                <div className="space-y-0.5">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">Essential</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Required for cart & login stability.</p>
                                </div>
                                <div className="relative inline-flex h-5 w-9 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-slate-100 dark:bg-slate-800 opacity-60">
                                    <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-400 dark:bg-slate-500 translate-x-4 shadow" />
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex justify-between items-center gap-4">
                                <div className="space-y-0.5">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">Performance</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Helps us analyze traffic and page speed.</p>
                                </div>
                                <button
                                    onClick={() => toggle('analytics')}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${consent.analytics ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                                    role="switch"
                                    aria-checked={consent.analytics}
                                    aria-label="Toggle Analytics Cookies"
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${consent.analytics ? 'translate-x-4' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>

                            {/* Marketing */}
                            <div className="flex justify-between items-center gap-4">
                                <div className="space-y-0.5">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">Personalization</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Personalized offers & trend updates.</p>
                                </div>
                                <button
                                    onClick={() => toggle('marketing')}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${consent.marketing ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                                    role="switch"
                                    aria-checked={consent.marketing}
                                    aria-label="Toggle Marketing Cookies"
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${consent.marketing ? 'translate-x-4' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                             <button
                                onClick={() => setShowSettings(false)}
                                className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => handleSave()}
                                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
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

