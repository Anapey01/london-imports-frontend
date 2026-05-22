'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, Database, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Log the error to console for debugging
        console.error('Database/API Interruption:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 bg-stationery text-slate-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-y-auto font-sans">
            {/* SVG Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

            {/* Elegant Ambient Glowing Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-emerald-500/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Branding */}
            <header className="mb-8 relative z-10 animate-fade-in text-center">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-sans font-bold text-lg md:text-xl tracking-[0.25em] text-white uppercase">
                        LONDON&apos;S <span className="text-emerald-400 italic font-serif font-semibold tracking-normal">IMPORTS</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400 font-medium">Sourcing & Logistics</span>
                </div>
            </header>

            {/* Glassmorphic Central Card */}
            <div className="relative z-10 w-full max-w-lg p-6 md:p-8 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-6 md:space-y-8 animate-scale-in">
                
                {/* Live Operations Indicator */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-emerald-950/90 border border-emerald-500/35 text-emerald-300 uppercase">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Guangzhou to Accra Sourcing Desk: Active
                    </div>
                </div>

                {/* Headline and Narrative */}
                <div className="space-y-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-serif leading-tight">
                        Catalog Offline.<br />
                        <span className="text-emerald-400 font-sans font-extrabold text-xl md:text-2xl tracking-[0.1em] block mt-1">
                            Sales Desk is Active.
                        </span>
                    </h1>
                    <p className="text-xs md:text-sm text-slate-200 max-w-sm mx-auto leading-relaxed">
                        We are performing system upgrades on our online product catalog. Our logistics channels and order desks remain fully operational.
                    </p>
                </div>

                {/* Status Dashboard Monitor */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                    <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Guangzhou Hub</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            OPERATIONAL
                        </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Accra Logistics</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            OPERATIONAL
                        </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Order Managers</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ONLINE (WhatsApp)
                        </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Web Catalog</span>
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            MAINTENANCE
                        </span>
                    </div>
                </div>

                {/* FAQ Accordion Section */}
                <div className="border-t border-slate-800/80 pt-5 text-left max-w-sm mx-auto space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        Frequently Asked Questions
                    </h4>
                    <div className="space-y-2">
                        <details className="group [&_summary::-webkit-details-marker]:hidden border border-slate-800/50 rounded-lg p-2 bg-slate-950/40">
                            <summary className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-slate-200 hover:text-white transition-colors">
                                <span>Can I still place new orders?</span>
                                <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
                            </summary>
                            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed pl-1 border-t border-slate-850 pt-1.5">
                                Yes! Send your product links (1688, Alibaba, etc.) directly to our team on WhatsApp. We will process and issue quotes/invoices manually within minutes.
                            </p>
                        </details>
                        
                        <details className="group [&_summary::-webkit-details-marker]:hidden border border-slate-800/50 rounded-lg p-2 bg-slate-950/40">
                            <summary className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-slate-200 hover:text-white transition-colors">
                                <span>Is my existing order affected?</span>
                                <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
                            </summary>
                            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed pl-1 border-t border-slate-850 pt-1.5">
                                No. All current order shipments, customs clearance, and container shipping pipelines are processing normally. Only the catalog search interface is offline.
                            </p>
                        </details>
                    </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                    <a
                        href="https://wa.me/233541096372?text=Hello%20London's%20Imports%2C%20I'm%20visiting%20the%20website%20and%20would%20like%20to%20place%20an%20order%2Fmake%20an%20inquiry."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:brightness-95 text-white font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        Connect on WhatsApp
                    </a>
                    
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-100 font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl border border-slate-700 transition-all duration-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Catalog
                    </button>
                </div>
            </div>

            {/* Diagnostics and Technical Details */}
            <footer className="mt-8 relative z-10 text-center space-y-4">
                <p className="text-[10px] text-slate-400 tracking-wide">
                    London&apos;s Imports Ghana &bull; Sourcing, Shipping & Logistics
                </p>
                
                <div className="pt-2">
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
                    >
                        {showDetails ? 'Hide System Diagnostics' : 'Show System Diagnostics'}
                    </button>
                </div>

                {showDetails && (
                    <div className="mx-auto max-w-lg p-4 bg-slate-900 border border-slate-850 rounded-xl text-left overflow-x-auto text-[11px] text-red-300 font-mono space-y-1.5 shadow-2xl max-h-48">
                        <div><strong>Digest:</strong> {error.digest || 'N/A'}</div>
                        <div><strong>Error Message:</strong> {error.message}</div>
                        {error.stack && <div className="text-slate-400 text-[10px] mt-1 whitespace-pre">{error.stack}</div>}
                    </div>
                )}
            </footer>
        </div>
    );
}
