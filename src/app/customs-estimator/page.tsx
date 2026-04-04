import { Metadata } from 'next';
import CustomsCalculator from '@/components/CustomsCalculator';
import Link from 'next/link';
import { ShieldCheck, Scale, AlertCircle, ArrowUpRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ghana Customs Duty Estimator 2026 | Calculate Import Taxes',
    description: 'Free tool to calculate Import Duty, VAT, and Levies for goods shipping to Ghana. Estimate your clearing costs at Tema/Kotoka or use ours services to save.',
    keywords: ['Ghana customs duty calculator', 'Import tax Ghana', 'Tema port clearing charges', 'Car duty calculator Ghana', 'Duty on electronics Ghana'],
};

export default function CustomsEstimatorPage() {
    return (
        <div className="min-h-screen bg-white relative pb-32 selection:bg-emerald-100">
            {/* 1. ARCHITECTURAL HEADER SECTION */}
            <header className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-50">
                <div className="flex items-center gap-4 mb-12">
                    <span className="h-px w-12 bg-slate-900" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                        Fiscal Protocol / London&apos;s
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 mb-16">
                    Duty <br />
                    Forecasting <span className="italic font-light text-slate-200">&amp;</span> <br />
                    Assessment.
                </h1>

                <p className="max-w-2xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
                    A precision-based tax liability estimation engine. Calculated using the current GH Common External Tariff framework with architectural accuracy.
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mt-24">
                
                {/* 2. THE CALCULATOR (Main Component) */}
                <section className="mb-40">
                    <div className="max-w-5xl mx-auto">
                        <CustomsCalculator />
                        
                        <div className="mt-12 flex items-start gap-6 p-8 bg-slate-50/50 border-l border-slate-200">
                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-4xl italic">
                                This tool provides projections based on official GRA valuation principles. 
                                Final assessment at the port of entry remains subject to terminal exchange rates and customs officer physical inspection.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. EXPERT NOTES (Asymmetrical Split Grid) */}
                <section className="pt-24 border-t border-slate-100">
                    <div className="grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 mb-24">
                        
                        <div className="bg-white p-12 md:p-20 group">
                            <div className="flex items-center gap-3 mb-10">
                                <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" strokeWidth={1} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Audit Protocol AT-01 / Savings</span>
                            </div>
                            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                                Individual taxes & <br />
                                <span className="italic font-light text-slate-200">Business Obstacles.</span>
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium mb-12 max-w-md">
                                When you ship alone, you pay the full burden of VAT and Duties. Our commercial-grade clearing platform allows you to group shipments to slash liabilities.
                            </p>
                            <Link href="/products" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 border-b border-black pb-2 hover:opacity-60 transition-all">
                                Explore Sourcing Logic
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </Link>
                        </div>

                        <div className="bg-white p-12 md:p-20 grid grid-rows-2 gap-px border-l border-slate-100">
                             <div className="pb-12 border-b border-slate-50">
                                <Scale className="w-8 h-8 text-slate-100 mb-6" strokeWidth={1} />
                                <h4 className="text-xl font-serif font-bold text-slate-900 mb-2 tracking-tight">GH CET Compliance</h4>
                                <p className="text-sm text-slate-400 font-medium">Data is derived from the official 2026/27 Common External Tariff bands for West Africa.</p>
                             </div>
                             <div className="pt-12">
                                <ShieldCheck className="w-8 h-8 text-slate-100 mb-6" strokeWidth={1} />
                                <h4 className="text-xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Port Valuation Sync</h4>
                                <p className="text-sm text-slate-400 font-medium">Projections utilize standard valuation curves linked to current Ghana port data.</p>
                             </div>
                        </div>
                    </div>
                </section>

                {/* 4. REGULATORY FRAMEWORK (Clean Horizontal Grid) */}
                <div className="mb-48 pt-24 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-24 justify-center">
                        <span className="text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">
                            The Regulatory Framework
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-20">
                        {[
                            {
                                q: "CIF Valuation Methodology",
                                a: "Import duty is derived from the CIF Value (Cost, Insurance, Freight). Standard rates for general goods hover at 20% effective duty."
                            },
                            {
                                q: "Statutory Levies & VAT",
                                a: "Beyond duty, Ghana applies several statutory levies including VAT (15%), NHIL (2.5%), and the Covid-19 Relief Levy."
                            },
                            {
                                q: "Groupage Handling",
                                a: "Most of our flat-rate products already include clearing and duties to simplify the international sourcing experience."
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-6 group">
                                <h5 className="text-2xl font-serif font-bold text-slate-900 tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">
                                    {item.q}
                                </h5>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l border-slate-100 pl-6">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
