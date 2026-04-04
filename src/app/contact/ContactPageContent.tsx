'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageCircle,
    Mail,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Send,
    Globe,
    Phone,
    CheckCircle,
    Copy,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { siteConfig } from '@/config/site';

const subjectOptions = [
    { value: 'order_issue', label: 'Order Issue' },
    { value: 'shipping', label: 'Shipping Question' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'product', label: 'Product Question' },
    { value: 'refund', label: 'Returns & Refunds' },
    { value: 'other', label: 'Other' },
];

export default function ContactPageContent() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const faqs = [
        { q: "How do I track my order?", a: "Log in to your dashboard and navigate to 'Trace My Batch'. Each order is tracked via a unique Batch ID with real-time updates from Guangzhou to Accra." },
        { q: "What is your refund policy?", a: "We offer 100% money-back guarantee for items that do not meet our authenticity standards or fail to arrive within the committed window." },
        { q: "Do you deliver to my region?", a: "Yes, we deliver to all 16 regions of Ghana. Our primary logistics hubs are in Accra, Kumasi, and Tamale." }
    ];

    const supportChannels = [
        {
            title: "WhatsApp Support",
            label: "Main Logistics Line",
            desc: "The fastest way to reach our general logistics team.",
            icon: <MessageCircle className="w-8 h-8" />,
            color: "bg-green-600",
            link: `${siteConfig.socials.whatsapp}?text=Hi%20London's%20Imports!%20I%20need%20help%20with...`
        },
        {
            title: "Email Support",
            label: "24h Response",
            desc: "For formal inquiries and bulk order sourcing.",
            icon: <Mail className="w-8 h-8" />,
            color: "bg-slate-950",
            link: `mailto:${siteConfig.supportEmail}`
        },
        {
            title: "Global HQ",
            label: "Accra, Ghana",
            desc: "Our primary operating unit in West Africa.",
            icon: <Globe className="w-8 h-8" />,
            color: "bg-green-600",
            link: siteConfig.addressMapLink
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const subjectLabel = subjectOptions.find(s => s.value === formData.subject)?.label || formData.subject;

        try {
            const response = await api.post('/auth/contact/', {
                ...formData,
                subject: subjectLabel
            });

            if (response.data) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or use WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-slate-100 dark:selection:bg-slate-800 selection:text-slate-950 dark:selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />

            {/* 1. Support Hero (Institutional Header) */}
            <section className="relative pt-32 pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-4">Terminal Support / Repository</span>
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none"
                            >
                                Support <span className="italic font-normal">Center.</span>
                            </motion.h1>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-right font-black"
                        >
                            Connecting our global logistics network <br /> to your institutional doorstep.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* 2. Global Support Channels (Horizontal Ledger) */}
            <section className="border-b border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-950">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-50 dark:divide-slate-900">
                    {supportChannels.map((channel, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3 }}
                            className="p-12 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-500"
                        >
                            <div className="w-12 h-12 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-900 dark:group-hover:border-white transition-all mb-8">
                                {React.cloneElement(channel.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                            </div>
                            <span className="text-emerald-600 dark:text-emerald-500 text-[9px] uppercase font-black tracking-[0.4em] mb-4 block leading-none">{channel.label}</span>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:italic transition-all">{channel.title}</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed mb-10 max-w-[260px]">{channel.desc}</p>
                            <a
                                href={channel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-900 dark:border-white pb-1 hover:pr-4 transition-all"
                            >
                                Execute Connection <ArrowRight className="w-3 h-3" />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Detailed Contact & Location (Institutional Grid) */}
            <section className="py-40 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="grid lg:grid-cols-2 gap-32 items-start">
                        <div className="space-y-16">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-6">HQ / Logistics Nerve Center</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-slate-900 dark:text-white tracking-tighter">Operating <span className="italic font-normal">Headquarters.</span></h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
                                    Our headquarters in Accra serves as the high-precision nerve center for distribution across the West African corridor.
                                </p>
                            </div>
    
                            <div className="grid grid-cols-2 gap-12 border-t border-slate-50 dark:border-slate-900 pt-16">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Physical Node</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">{siteConfig.address}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Operational Window</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">Mon - Fri / 0900 - 1800</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">Sat / 1000 - 1600</p>
                                </div>
                            </div>
    
                            <div className="flex items-center gap-16 border-t border-slate-50 dark:border-slate-900 pt-16">
                                <div>
                                    <div className="text-4xl font-serif font-bold text-slate-900 dark:text-white">92%</div>
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Precision Index</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-serif font-bold text-slate-900 dark:text-white">24h</div>
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Protocol SLA</div>
                                </div>
                            </div>
                        </div>
    
                        <div className="relative border border-slate-50 p-1">
                            <div className="aspect-[4/5] relative overflow-hidden grayscale contrast-125">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.7148124396617!2d-0.1687550240594233!3d5.754127994228258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf77138b11ed4b%3A0xaae48c1875009a9d!2sLondon&#39;s%20Imports%20Ghana!5e0!3m2!1sen!2sgh!4v1775137181616!5m2!1sen!2sgh"
                                    width="100%"
                                    height="100%"
                                    title="London's Imports HQ"
                                    className="border-0"
                                    allowFullScreen
                                />
                                <div className="absolute top-8 right-8 bg-white border border-slate-950 px-6 py-4 shadow-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Verified Location</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Instant Message / Concierge Form (Stationery Aesthetic) */}
            <section className="py-40 bg-slate-50 dark:bg-slate-950/50 border-y border-slate-100 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10 grid lg:grid-cols-2 gap-32">
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 block mb-8 italic">Direct Communication Protocol</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10 text-slate-900 dark:text-white tracking-tighter leading-none">Order <br /><span className="italic font-normal">Concierge.</span></h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-12 leading-relaxed max-w-sm font-medium">
                            Seeking a VIP sourcing request or tracking a premium batch? Execute a direct connection with our logistics team for priority handling.
                        </p>
    
                        <div className="space-y-4">
                            <div
                                onClick={() => handleCopy(`+${siteConfig.concierge}`)}
                                className="group cursor-pointer max-w-max relative"
                            >
                                <div className="flex items-center gap-6 text-slate-900 dark:text-white mb-2">
                                    <Phone className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                    <span className="font-serif text-4xl font-bold tracking-tight">+{siteConfig.concierge.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</span>
                                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-200 dark:text-slate-800 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />}
                                </div>
                                <div className="w-full h-px bg-slate-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                {copied && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-12 left-0 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black px-4 py-2 uppercase tracking-widest shadow-2xl"
                                    >
                                        Copied to Ledger
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>
    
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-16 shadow-2xl shadow-slate-950/5">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-8">
                                <div className="w-20 h-20 border border-emerald-500 flex items-center justify-center text-emerald-600">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tight underline decoration-emerald-500/30">Transmission Received</h3>
                                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">Our team will respond within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white border-b border-slate-900 dark:border-white pb-1 hover:pr-4 transition-all"
                                >
                                    New Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12">
                                {error && (
                                    <div className="text-[10px] font-black tracking-widest uppercase text-red-600 border-b border-red-100 dark:border-red-900/30 pb-4">
                                        Error // {error}
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] block leading-none">Sender Identity</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-3 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-white outline-none transition-all font-serif text-xl placeholder:text-slate-100 dark:placeholder:text-slate-800"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] block leading-none">Digital Node</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-3 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-white outline-none transition-all font-serif text-xl placeholder:text-slate-100 dark:placeholder:text-slate-800"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] block leading-none">Inquiry Protocol</label>
                                    <select
                                        required
                                        aria-label="Inquiry Type"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-3 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-white outline-none transition-all font-serif text-xl appearance-none cursor-pointer"
                                    >
                                        <option value="" className="dark:bg-slate-900">Select Protocol...</option>
                                        {subjectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.5em] block leading-none">Message Payload</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-3 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-white outline-none transition-all font-serif text-xl resize-none placeholder:text-slate-200 dark:placeholder:text-slate-800"
                                        placeholder="Detailed inquiry summary..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-24 font-black flex items-center justify-center gap-6 transition-all active:scale-[0.99] disabled:opacity-50 uppercase tracking-[0.6em] text-[11px] group"
                                >
                                    {loading ? 'Transmitting...' : 'Execute Submission'} <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. Regional Logistics Presence (Architectural Ledger) */}
            <section className="py-40 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-6">Territorial Coverage / Global Node</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter text-slate-900 dark:text-white leading-none">Logistics <span className="italic font-normal">Network.</span></h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-500 max-w-sm text-[10px] uppercase tracking-[0.3em] leading-relaxed font-black text-right">
                            Delivering authentic electronics and lifestyle <br /> products across all 16 regions of the Republic.
                        </p>
                    </div>
 
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-900">
                        {[
                            "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
                            "Volta", "Northern", "Upper East", "Upper West", "Bono",
                            "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
                        ].map((region, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: (idx % 4) * 0.05 }}
                                className="flex items-center gap-6 p-8 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-default group"
                            >
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Preview (Thin-Line Repository) */}
            <section className="py-40 bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-10">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-600 block mb-6 italic underline decoration-slate-200 dark:decoration-slate-800 underline-offset-8 text-center">Institutional FAQ Repository</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tighter text-slate-900 dark:text-white">Query <span className="italic font-normal">Repository.</span></h2>
                        <p className="text-slate-500 dark:text-slate-500 font-medium text-xs uppercase tracking-widest text-center mt-8">Quick access to common logistics and sourcing protocols.</p>
                    </div>
 
                    <div className="space-y-0 border-t border-slate-50 dark:border-slate-900">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-slate-50 dark:border-slate-900 overflow-hidden transition-all duration-500">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full py-10 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-xl font-serif font-bold transition-all duration-500 ${expandedFaq === idx ? 'text-slate-900 dark:text-white italic pl-4' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:pl-2'}`}>
                                        {faq.q}
                                    </span>
                                    {expandedFaq === idx ? (
                                        <div className="w-8 h-8 rounded-full border border-slate-900 dark:border-white flex items-center justify-center transition-all rotate-180">
                                            <ChevronUp className="w-4 h-4 text-slate-950 dark:text-white" strokeWidth={1.5} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-900 dark:group-hover:border-white transition-all">
                                            <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white" strokeWidth={1.5} />
                                        </div>
                                    )}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedFaq === idx ? 'auto' : 0, opacity: expandedFaq === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-10 pt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl font-medium border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 pl-8 ml-4">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
 
                    <div className="mt-24 text-center">
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-3 hover:pr-8 transition-all group"
                        >
                            Execute Full Repository <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
