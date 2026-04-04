/**
 * London's Imports - Support Center (Redesigned)
 * Editorial, high-contrast repository of logistics protocols and queries.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

const faqs = [
    {
        id: "PRE-01",
        question: "What is a pre-order?",
        answer: "A pre-order allows you to reserve and pay for an item before it arrives in Ghana. This guarantees your item and often comes with better pricing than buying after arrival."
    },
    {
        id: "DEL-01",
        question: "How long does delivery take?",
        answer: "Delivery windows are shown on each product (typically 8-9 weeks). We use date ranges, not exact dates, to ensure honest timelines. You'll receive updates at each milestone."
    },
    {
        id: "PAY-01",
        question: "Is my payment secure?",
        answer: "Yes! All payments are processed through Paystack, Ghana's leading payment provider. Your funds are held securely until your order is delivered."
    },
    {
        id: "REF-01",
        question: "Can I cancel my order?",
        answer: "Yes, you can cancel any time before the batch cutoff date for a full refund. After cutoff, cancellations may be subject to supplier fees."
    },
    {
        id: "PAY-02",
        question: "What payment options are available?",
        answer: "We accept Mobile Money (MTN, Vodafone, AirtelTigo) and card payments. For most items, you can also pay a deposit now and the balance on delivery."
    },
    {
        id: "LOG-01",
        question: "How do I track my order?",
        answer: "Log in to your account and visit 'My Orders' to see real-time status updates. You'll also receive SMS/WhatsApp notifications at each milestone."
    },
    {
        id: "PRO-01",
        question: "What if my item doesn't arrive?",
        answer: "If delivery fails for any reason, you receive a full refund. Our 92% on-time delivery rate means this is rare, but you're always protected."
    },
    {
        id: "WHY-01",
        question: "Why pre-order instead of buying locally?",
        answer: "Pre-ordering often saves 20-40% compared to local retail prices. You also get access to items not yet available in Ghana and guaranteed genuine products."
    },
    {
        id: "LOG-02",
        question: "How do I find cheap shipping agents in Ghana?",
        answer: "London's Imports handles all shipping for you! We work with trusted freight partners to get the best rates from Guangzhou and Yiwu to Accra. No need to find agents yourself – just pre-order your items."
    },
    {
        id: "MINI-01",
        question: "Mini-importation training for 2026?",
        answer: "We don't offer formal training courses, but London's Imports makes mini-importation easy for beginners. Our platform lets you start importing from China to Ghana without any experience."
    },
    {
        id: "CUS-01",
        question: "What are the clearance costs at Tema Port?",
        answer: "Customs duties typically range from 0-20% depending on the item category. London's Imports includes customs clearance in our pricing where stated, so you pay one transparent price."
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* 1. Support Hero (Institutional Header) */}
            <header className="relative pt-32 pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-500 block mb-4">Query Repository / Knowledge Base</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
                                FAQ <span className="italic font-normal">Repository.</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-right font-black">
                            Transparent, architectural, and direct. <br /> Our logistics protocol explained in detail.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-10 relative z-10 mt-24">
                {/* 2. THE QUERY LEDGER (Institutional List) */}
                <div className="space-y-0 border-t border-slate-50 dark:border-slate-900">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-50 dark:border-slate-900 overflow-hidden transition-all duration-500"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-10 flex items-center justify-between text-left group"
                            >
                                <div className="flex gap-12 items-baseline">
                                    <span className="text-[9px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-widest shrink-0">
                                        {faq.id}
                                    </span>
                                    <span className={`text-xl md:text-2xl font-serif font-bold transition-all duration-500 ${openIndex === index ? 'text-slate-900 dark:text-white italic pl-4' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:pl-2'}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                {openIndex === index ? (
                                    <div className="w-8 h-8 rounded-full border border-slate-900 dark:border-white flex items-center justify-center transition-all rotate-180">
                                        <ChevronDown className="w-4 h-4 text-slate-950 dark:text-white" strokeWidth={1.5} />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-900 dark:group-hover:border-white transition-all">
                                        <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white" strokeWidth={1.5} />
                                    </div>
                                )}
                            </button>
 
                            <div
                                className={`overflow-hidden transition-all duration-700 ease-in-out ${openIndex === index ? 'max-h-[500px]' : 'max-h-0'}`}
                            >
                                <div className="pb-12 pt-2 border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 ml-24 pl-12 max-w-2xl">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* 3. CONTACT PROTOCOL (Institutional Footer) */}
                <div className="mt-32 border border-slate-50 dark:border-slate-900 grid md:grid-cols-2">
                    <div className="bg-white dark:bg-slate-900/50 p-12 md:p-16 flex flex-col justify-between group">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 mb-8 block font-sans">Human Interface Protocol 01</span>
                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
                                Still have <br /> 
                                <span className="italic font-normal">Unresolved Queries?</span>
                            </h3>
                        </div>
                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium leading-relaxed mb-12 max-w-xs">
                            Our support desk manages complex logistics inquiries that fall outside the standard repository protocol.
                        </p>
                        <Link 
                            href="/contact" 
                            className="group/link inline-flex items-center gap-6 text-[10px] font-black text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-3 self-start hover:pr-8 transition-all uppercase tracking-[0.4em]"
                        >
                            Contact Support Desk
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                        </Link>
                    </div>
 
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-12 md:p-16 flex flex-col justify-center border-l border-slate-100 dark:border-slate-900">
                         <div className="flex flex-col gap-8 opacity-40">
                             <div className="flex items-center gap-4 border-b border-slate-900/5 dark:border-white/5 pb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">MTN MOMO</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">SECURE</span>
                             </div>
                             <div className="flex items-center gap-4 border-b border-slate-900/5 dark:border-white/5 pb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">ACCRA HUB</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">ACTIVE</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">TEMA CLEARING</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">LIVE</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
