'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, Database, ShieldCheck, Globe } from 'lucide-react';
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
            <div className="fixed inset-0 z-[9999] bg-slate-950 bg-stationery text-slate-100 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto font-sans">
                {/* SVG Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

                {/* Elegant Ambient Glowing Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Header Branding */}
                <header className="mb-6 relative z-10 animate-fade-in">
                    <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-base md:text-lg tracking-[0.25em] text-white uppercase">
                            LONDON&apos;S <span className="text-emerald-400 italic font-serif font-semibold tracking-normal">IMPORTS</span>
                        </span>
                    </div>
                </header>

                {/* Glassmorphic Central Card */}
                <div className="relative z-10 w-full max-w-lg p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-center space-y-6 md:space-y-8 animate-scale-in">
                    {/* Live Operations Indicator */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-widest bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Guangzhou to Accra Order Desk: Active
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
                        <p className="text-xs md:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                            We are currently upgrading our online web catalog for faster loading speeds. Our logistics channels and order managers are fully online.
                        </p>
                    </div>

                    {/* Status Dashboard Monitor */}
                    <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto text-left">
                        <div className="bg-slate-950/50 border border-slate-900/70 rounded-xl p-3.5 space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Guangzhou Hub</span>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                OPERATIONAL
                            </span>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-900/70 rounded-xl p-3.5 space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Accra Logistics</span>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                OPERATIONAL
                            </span>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-900/70 rounded-xl p-3.5 space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Order Managers</span>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                ONLINE (WhatsApp)
                            </span>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-900/70 rounded-xl p-3.5 space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Web Catalog</span>
                            <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                UPGRADING
                            </span>
                        </div>
                    </div>

                    {/* Quick FAQ Accordion */}
                    <div className="border-t border-slate-800/60 pt-5 text-left max-w-sm mx-auto space-y-3">
                        <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Frequently Asked Questions</h4>
                        <div className="space-y-2">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                                    <span>Can I still place new orders?</span>
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
                                </summary>
                                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed pl-1">
                                    Yes! Send your 1688/Alibaba links directly to our managers on WhatsApp. We will quote and process your invoices manually within minutes.
                                </p>
                            </details>
                            
                            <details className="group [&_summary::-webkit-details-marker]:hidden border-t border-slate-900/50 pt-1.5">
                                <summary className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                                    <span>Is my existing order delayed?</span>
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
                                </summary>
                                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed pl-1">
                                    No. All current order processing, custom clearance, and container shipping lines are running normally. Only the catalog is undergoing upgrades.
                                </p>
                            </details>
                        </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <a
                            href="https://wa.me/233541096372?text=Hello%20London's%20Imports%2C%20I'm%20visiting%20the%20website%20and%20would%20like%20to%20place%20an%20order%2Fmake%20an%20inquiry."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:brightness-95 text-white font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <MessageSquare className="w-4 h-4 fill-white" />
                            Connect with a Manager
                        </a>
                        
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2.5 bg-slate-800/40 hover:bg-slate-800/80 active:bg-slate-700/80 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl border border-slate-850 hover:border-slate-700 transition-all duration-300"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Catalog
                        </button>
                    </div>
                </div>

                {/* Footer Brand Info */}
                <footer className="mt-6 relative z-10 animate-fade-in opacity-80">
                    <p className="text-[10px] text-slate-500 tracking-wide text-center">
                        London&apos;s Imports Ghana &bull; Logistics & Sourcing Excellence
                    </p>
                </footer>
            </div>
        );
    }

    return <>{children}</>;
}
