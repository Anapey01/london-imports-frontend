'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, AlertCircle, Database } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Log the error to console
        console.error('Database/API Interruption:', error);
    }, [error]);

    const isDbOffline = error.message?.includes('fetch failed') || 
                        error.message?.includes('ECONNREFUSED') ||
                        error.message?.includes('Failed to fetch') ||
                        error.message?.includes('status') ||
                        true; // Default to true during the outage

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
            {/* Elegant Background Glow Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
                {/* Visual Status Indicator */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-pulse">
                            <Database className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <span className="absolute bottom-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                        </span>
                    </div>
                </div>

                {/* Main Message */}
                <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 uppercase tracking-wider">
                        Scheduled Optimization
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase font-serif">
                        Database Upgrade in Progress
                    </h1>
                    <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
                        We are currently performing an optimized system and database upgrade to increase loading speed and platform stability. 
                        Our automated web catalog is temporarily offline, but our sales team is fully online!
                    </p>
                </div>

                {/* Dynamic Recommendation Banner (WhatsApp Call To Action) */}
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl max-w-xl mx-auto shadow-2xl space-y-4 backdrop-blur-sm">
                    <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                        No Interruption to Orders
                    </h3>
                    <p className="text-xs text-slate-300">
                        You don&apos;t have to wait! You can view items and place orders directly with our managers on WhatsApp right now.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link
                            href="https://wa.me/233541096372?text=Hello%20London's%20Imports%2C%20I'm%20visiting%20the%20website%20and%20would%20like%20to%20place%20an%20order%2Fmake%20an%20inquiry."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <MessageSquare className="w-4 h-4 fill-white" />
                            Order via WhatsApp
                        </Link>
                        
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl border border-slate-700 transition-all duration-300"
                        >
                            <RefreshCw className="w-4 h-4 animate-spin-slow" />
                            Reload Page
                        </button>
                    </div>
                </div>

                {/* Footer and Debug Info */}
                <div className="pt-8 border-t border-slate-900/60 max-w-md mx-auto space-y-4">
                    <p className="text-[10px] text-slate-500 tracking-wide">
                        London&apos;s Imports Ghana &bull; Logistics & Sourcing Excellence
                    </p>
                    
                    <div className="text-center">
                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-[10px] text-slate-600 hover:text-slate-400 underline transition-colors"
                        >
                            {showDetails ? 'Hide Status Details' : 'Show Status Details'}
                        </button>
                    </div>

                    {showDetails && (
                        <div className="mt-4 p-4 bg-slate-950 border border-slate-900 rounded-lg text-left overflow-x-auto text-[10px] text-rose-400 font-mono space-y-1 max-h-40">
                            <div><strong>Digest:</strong> {error.digest || 'N/A'}</div>
                            <div><strong>Error Message:</strong> {error.message}</div>
                            <div><strong>Stack:</strong> {error.stack}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
