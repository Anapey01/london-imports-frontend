'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, Database, HelpCircle, MapPin, Ship, Anchor, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface ClientDbRecoveryProps {
    children: React.ReactNode;
}

export default function ClientDbRecovery({ children }: ClientDbRecoveryProps) {
    const [isOffline, setIsOffline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Run a fast check to see if the database is alive
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

        const apiUrl = siteConfig.apiUrl;

        fetch(`${apiUrl}/products/banners/`, { 
            signal: controller.signal,
            cache: 'no-store'
        })
        .then(res => {
            clearTimeout(timeoutId);
            // If the response is not OK and is a server error (like 500 from Neon), or if it fails
            if (!res.ok && res.status >= 500) {
                setIsOffline(true);
            } else {
                setIsOffline(false);
            }
            setIsLoading(false);
        })
        .catch(() => {
            clearTimeout(timeoutId);
            setIsOffline(true);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        // While loading the status check, let the children render (stale cache)
        return <>{children}</>;
    }

    if (isOffline) {
        // Render the premium database maintenance page
        return (
            <div className="fixed inset-0 z-[9999] bg-[#020617] text-slate-100 flex flex-col justify-between p-6 md:p-12 overflow-y-auto font-sans select-none">
                {/* Stationery Texture Overlay (Hardcoded to prevent global white bg overrides) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')] invert" />

                {/* Custom Grid Mesh (Dark theme grid lines) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

                {/* Elegant Floating Ambient Backlights */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Header Branding */}
                <header className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6">
                    <div className="flex flex-col items-center sm:items-start gap-1">
                        <span className="font-sans font-bold text-lg md:text-xl tracking-[0.3em] text-white uppercase">
                            LONDON&apos;S <span className="text-emerald-400 italic font-serif font-semibold tracking-normal">IMPORTS</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-bold">China to Ghana Shipping Center</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-widest bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Sourcing Desk: Active
                    </div>
                </header>

                {/* Main Bespoke Split Layout */}
                <main className="relative z-10 w-full max-w-6xl mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Sourcing Desk Focus (Editorial & Human Feel) */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-[0.25em] block">
                                System Notice &bull; Catalog Sync
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold font-serif text-white leading-[1.1] tracking-tight">
                                We are refining the catalog. Sourcing is <span className="italic text-emerald-400">fully active</span>.
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
                                We are optimizing our database configurations to provide faster product searches. 
                                While the online catalog index is temporarily offline, our sourcing desk, warehouse operations, and container shipping pipelines are running on schedule.
                            </p>
                        </div>

                        {/* WhatsApp Action Card */}
                        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl max-w-xl mx-auto lg:mx-0 shadow-[0_15px_30px_rgba(0,0,0,0.3)] backdrop-blur-md space-y-5 text-left">
                            <div className="space-y-1">
                                <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                                    Place Sourcing Orders Instantly
                                </h3>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                    You do not need to wait for the database sync to complete. Send your 1688 / Alibaba links directly to our managers on WhatsApp. We will quote and process your invoices manually within minutes.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
                                <a
                                    href="https://wa.me/233541096372?text=Hello%20London's%20Imports%2C%20I'm%20visiting%20the%20website%20and%20would%20like%20to%20place%20an%20order%2Fmake%20an%20inquiry."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:brightness-95 text-white font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    <MessageSquare className="w-4 h-4 fill-white" />
                                    Order via WhatsApp
                                    <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                                
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center justify-center gap-2.5 bg-slate-800/60 hover:bg-slate-800 active:bg-slate-700 text-slate-100 font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl border border-slate-700 transition-all duration-300"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reload Catalog
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Sourcing Pipeline Status Dashboard */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900/35 border border-slate-900 p-6 rounded-3xl backdrop-blur-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                    Physical Logistics Pipeline
                                </h4>
                                <span className="text-[9px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/40 font-bold uppercase tracking-wider">
                                    Active
                                </span>
                            </div>

                            {/* Pipeline list */}
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="mt-0.5 p-2 rounded-lg bg-slate-950 border border-slate-850 text-emerald-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-xs font-bold text-white">Guangzhou Warehouse</h5>
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-0.5">Receiving suppliers&apos; goods, grouping cargo, and loading shipping containers.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="mt-0.5 p-2 rounded-lg bg-slate-950 border border-slate-850 text-emerald-400">
                                        <Ship className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-xs font-bold text-white">Sea Cargo Line</h5>
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-0.5">Weekly containers are dispatched and transit from Guangzhou port to Tema port.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="mt-0.5 p-2 rounded-lg bg-slate-950 border border-slate-850 text-emerald-400">
                                        <Anchor className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-xs font-bold text-white">Accra Customs Clearing</h5>
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-0.5">Container clearance and domestic shipment distribution are running normally.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="mt-0.5 p-2 rounded-lg bg-slate-950 border border-slate-850 text-amber-400 animate-pulse">
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-xs font-bold text-white">Digital Product Catalog</h5>
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-0.5">Database schema maintenance in progress to enhance runtime stability.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Questions */}
                            <div className="border-t border-slate-900 pt-5 space-y-2.5">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    Frequently Asked Questions
                                </h4>
                                
                                <details className="group border border-slate-900 rounded-lg p-2 bg-slate-950/30">
                                    <summary className="flex items-center justify-between cursor-pointer py-0.5 text-xs font-bold text-slate-200 hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                                        <span>Is my existing order delayed?</span>
                                        <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
                                    </summary>
                                    <p className="mt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-2">
                                        No. Your items are safe and shipping pipelines are unaffected. Container schedules and port clearances are fully operational.
                                    </p>
                                </details>

                                <details className="group border border-slate-900 rounded-lg p-2 bg-slate-950/30">
                                    <summary className="flex items-center justify-between cursor-pointer py-0.5 text-xs font-bold text-slate-200 hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                                        <span>Who should I contact?</span>
                                        <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
                                    </summary>
                                    <p className="mt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-2">
                                        You can contact your designated sourcing manager or message us directly via the WhatsApp Concierge link on this screen.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-6">
                    <p className="text-[10px] text-slate-400 tracking-wide">
                        London&apos;s Imports Ghana &copy; 2026 &bull; Sourcing, Shipping & Logistics Excellence
                    </p>
                </footer>
            </div>
        );
    }

    return <>{children}</>;
}
