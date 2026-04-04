import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, AlertTriangle, Calculator, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
    title: "Ghana Customs Clearance Services | Import Duties Simplified | London's Imports",
    description: "Navigate Ghana Customs (GRA) with ease. We handle all import duties, VAT, and levies for your China imports. Transparent, flat-rate shipping to Accra & Tema. No hidden port fees.",
    keywords: ["Ghana customs clearance Tema", "Import duty Ghana calculator", "GRA import taxes", "Customs clearing agent Accra", "Clearing goods at Kotoka Airport"],
};

export default function CustomsPage() {
    return (
        <div className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100">
            {/* 1. ARCHITECTURAL HEADER SECTION */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-50">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                        Customs protocol / London&apos;s
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 mb-16">
                    Customs <br />
                    <span className="italic font-light text-slate-200">Neutralized</span>.
                </h1>

                <p className="max-w-2xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
                    Tema Port is a logistical puzzle. We solve it with architectural precision. 
                    From GRA duty sheets to the final gate clearance, our agents manage the complexity so you don’t have to.
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mt-24">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* 2. THE COMPLIANCE LEDGER (Left Column) */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 mb-20">
                            <div className="bg-white p-12 flex flex-col gap-6">
                                <AlertTriangle className="w-8 h-8 text-slate-200" strokeWidth={1} />
                                <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">The Complexity</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    Import Duty, VAT, NHIL, GetFund, and the COVID Levy. Calculating your total liability in Ghana is a nightmare for individuals.
                                </p>
                            </div>
                            <div className="bg-white p-12 flex flex-col gap-6 border-l border-slate-100">
                                <div className="w-8 h-8 rounded-full border border-emerald-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">The Protocol</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    By grouping your items into our &apos;Groupage&apos; containers, we handle the bulk clearance at commercial rates. You pay ONE flat fee.
                                </p>
                            </div>
                        </div>

                         {/* Authority Protocol List */}
                         <div className="space-y-16 py-12">
                            {[
                                { 
                                    icon: ShieldCheck, 
                                    title: "Tax Compliant Classification", 
                                    text: "Every SKU is correctly classified under the GH ECOWAS Common External Tariff (CET) to ensure zero penalties." 
                                },
                                { 
                                    icon: FileText, 
                                    title: "Digital Paperwork Brokerage", 
                                    text: "Our team generates and submits all digital declarations on your behalf at the Port of Tema and KIA." 
                                },
                                { 
                                    icon: Scale, 
                                    title: "Professional Representation", 
                                    text: "In case of any discrepancies at the port, our lead clearing agents represent your interests directly with GRA officials." 
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-10 items-start group">
                                    <div className="w-12 h-12 flex items-center justify-center text-slate-200 group-hover:text-emerald-500 transition-colors shrink-0">
                                        <item.icon className="w-full h-full" strokeWidth={1} />
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 italic">Protocol CP-0{i+1}</h4>
                                        <h5 className="text-2xl font-serif font-bold text-slate-900 mb-4 tracking-tighter">{item.title}</h5>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                    {/* 3. THE ANALYTICAL SUMMARY (Right Column) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-12">
                        <div className="bg-slate-50 px-10 py-16 flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12">Financial Audit / GH Duties</span>
                            
                            <div className="space-y-8 flex-1">
                                <div className="flex justify-between items-baseline border-b border-slate-100 pb-6">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Standard Duty</span>
                                    <span className="text-2xl font-serif font-bold text-slate-900 tabular-nums">20.0%</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-slate-100 pb-6">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Import VAT</span>
                                    <span className="text-2xl font-serif font-bold text-slate-900 tabular-nums">15.0%</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-slate-100 pb-6">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Consolidated Levies</span>
                                    <span className="text-2xl font-serif font-bold text-slate-900 tabular-nums">6.0%</span>
                                </div>
                            </div>

                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mt-12 bg-white p-6 border border-slate-100 italic">
                                *All these are included in your London&apos;s Imports flat-rate. ZERO extra Cent at pick-up.
                            </p>
                        </div>

                        {/* HIGH-END ACTION LINKS */}
                        <div className="flex flex-col gap-6 pt-8 border-t border-slate-50">
                            <Link 
                                href="/customs-estimator" 
                                className="group/link flex items-center justify-between w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-900 transition-all hover:opacity-60"
                            >
                                <span>Duty Estimator Access</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>
                            
                            <Link 
                                href="/shipping" 
                                className="group/link flex items-center justify-between w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-900 transition-all hover:opacity-60"
                            >
                                <span>View Shipping Flat Rates</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>

                            <Link 
                                href="/contact" 
                                className="w-full h-16 bg-slate-900 text-white flex items-center justify-center text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-colors"
                            >
                                Request Policy Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
