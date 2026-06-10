/**
 * London's Imports - Prohibited & Restricted Items Policy
 * Premium 'Atelier' layout describing custom and shipping compliance guidelines
 */
import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

// ISR: Revalidate static info page every 7 days
export const revalidate = 604800;

export const metadata: Metadata = {
    title: 'Prohibited & Restricted Items | London\'s Imports',
    description: 'Guidelines on items restricted or prohibited from import via our logistics network under customs and payment gateway regulations.',
};

export default function ProhibitedItemsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* Header */}
            <header className="relative pt-32 pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-500 block mb-4">Logistics Compliance</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
                                Prohibited <span className="italic font-normal">Items.</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-right font-black">
                            Customs & payment regulations. <br /> Strictly restricted trade goods.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 py-24">
                <div className="space-y-12 text-slate-900 dark:text-white">
                    <div className="border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 pl-8">
                        <p className="text-xl font-serif italic text-slate-500 dark:text-slate-400 font-medium">
                            To ensure seamless customs clearance, compliance with Ghana Revenue Authority (GRA) laws, and approval from secure payment gateways, certain items are strictly prohibited or restricted from import.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">1. Weapons, Ammunition & Tactical Gear</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            We operate under a zero-tolerance policy for weapons and military-grade equipment. The procurement or shipping of the following items is strictly prohibited:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li>Firearms, ammunition, and weapon parts.</li>
                            <li>Tear gas, pepper sprays, stun guns, and electroshock weapons.</li>
                            <li>Tactical gear, replica weapons, paintball guns, and realistic toy guns.</li>
                            <li>Explosives, fireworks, gunpowder, and combustible materials.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">2. Counterfeit, Replica & Trademarked Goods</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            We respect intellectual property rights. The import of counterfeit brands and unauthorized replicas violates international shipping laws and payment gateway terms of service:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li>Replica designer clothing, luxury watches, handbags, and footwear.</li>
                            <li>Unauthorized copies of copyrighted works, software, or media.</li>
                            <li>Counterfeit currency, stamps, and official government documents.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">3. Illegal Imports & Contraband</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Under Ghana Customs regulations, the following categories of items are classified as illegal imports:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li>Narcotics, illegal drugs, and controlled substances.</li>
                            <li>Prescription medications and pharmaceutical drugs without certified regulatory permits.</li>
                            <li>Adult novelties, explicit materials, and pornographic media.</li>
                            <li>Live animals, restricted plants, untreated soil, and perishable foodstuffs.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">4. Restricted Electronics & Chemicals</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Electronics containing hazardous parts and unstable chemical compounds pose risk to air cargo transport and require pre-clearance or are entirely banned:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><strong>Hazardous Chemicals:</strong> Acids, industrial solvents, matches, corrosives, and oxidizing agents.</li>
                            <li><strong>Unprotected Batteries:</strong> Loose or standalone lithium-ion/metal batteries, power banks, and high-capacity battery units (only built-in batteries within approved consumer electronics may be shipped under strict safety compliance).</li>
                            <li><strong>Fluids & Aerosols:</strong> Compressed gases, perfumes, spray cans, and flammable liquids.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">5. Liabilities & Customs Seizures</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Customers are solely responsible for ensuring the compliance of their orders. If a package contains prohibited or restricted items:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li>The items may be seized, destroyed, or confiscated by customs authorities during inspection.</li>
                            <li>London&apos;s Imports will not be liable for the loss, nor will we provide any refunds or compensation.</li>
                            <li>Any fines, penalty fees, or legal consequences arising from attempt to import illegal items will be the sole responsibility of the customer.</li>
                        </ul>
                    </section>

                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 mt-20 border-t border-slate-50 dark:border-slate-900 pt-10">Last updated: June 2026</p>
                </div>
            </div>
        </div>
    );
}
