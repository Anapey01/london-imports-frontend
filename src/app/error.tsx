'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, HelpCircle, MapPin, Ship, Anchor, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans select-none">
            {/* Stationery Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')] invert" />

            {/* Custom Grid Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Ambient Backlights */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Branding */}
            <header className="relative z-10 w-full flex items-center justify-between gap-4 border-b border-slate-900 pb-5">
                <div className="flex flex-col items-start gap-0.5">
                    <span className="font-sans font-bold text-base md:text-lg tracking-[0.3em] text-white uppercase">
                        LONDON&apos;S <span className="text-emerald-400 italic font-serif font-semibold tracking-normal">IMPORTS</span>
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-slate-400 font-bold">Sourcing &amp; Logistics</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-widest bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sourcing Desk: Active
                </div>
            </header>

            {/* Main Bespoke Simplified Layout */}
            <main className="relative z-10 w-full max-w-xl mx-auto my-auto text-center space-y-8 py-12">
                <div className="space-y-4">
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] block">
                        System Maintenance
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight tracking-tight">
                        Catalog offline.<br />
                        Sourcing is <span className="italic text-emerald-400">active</span>.
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
                        We are completing database maintenance. Send your product sourcing links or inquiries to our team on WhatsApp for manual quotes and instant processing.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                    <a
                        href="https://wa.me/233541096372?text=Hello%20London's%20Imports%2C%20I'm%20visiting%20the%20website%20and%20would%20like%20to%20place%20an%20order%2Fmake%20an%20inquiry."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:brightness-95 text-white font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        Order via WhatsApp
                        <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-900 active:bg-slate-800 text-slate-100 font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Catalog
                    </button>
                </div>
            </main>

            {/* Footer and Diagnostics */}
            <footer className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-5 mt-4">
                <p className="text-[10px] text-slate-400 tracking-wide">
                    London&apos;s Imports Ghana &copy; 2026 &bull; Sourcing, Shipping & Logistics Excellence
                </p>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 underline transition-colors"
                    >
                        {showDetails ? 'Hide Diagnostics' : 'Show Diagnostics'}
                    </button>
                </div>

                {showDetails && (
                    <div className="absolute bottom-16 right-0 left-0 md:left-auto md:w-96 p-4 bg-slate-950 border border-slate-900 rounded-xl text-left overflow-x-auto text-[11px] text-red-300 font-mono space-y-1.5 shadow-2xl max-h-48 z-50">
                        <div><strong>Digest:</strong> {error.digest || 'N/A'}</div>
                        <div><strong>Error Message:</strong> {error.message}</div>
                        {error.stack && <div className="text-slate-400 text-[10px] mt-1 whitespace-pre">{error.stack}</div>}
                    </div>
                )}
            </footer>
        </div>
    );
}
