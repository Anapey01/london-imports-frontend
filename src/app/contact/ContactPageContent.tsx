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
    Check,
    MapPin,
    ExternalLink
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
        { q: "How do I track my order?", a: "Log in to your dashboard and navigate to 'Track My Order'. Each order has real-time updates from our warehouse in China to your doorstep in Ghana." },
        { q: "What is your refund policy?", a: "We offer 100% money-back guarantee for items that do not meet our quality standards or fail to arrive within the committed window." },
        { q: "Do you deliver to my region?", a: "Yes, we deliver to all 16 regions of Ghana. Our primary delivery hubs are in Accra, Kumasi, and Tamale." }
    ];

    const supportChannels = [
        {
            title: "WhatsApp Support",
            label: "Main Support Line",
            desc: "The fastest way to reach our support team.",
            icon: <MessageCircle className="w-8 h-8" />,
            color: "bg-green-600",
            link: `${siteConfig.socials.whatsapp}?text=Hi%20London's%20Imports!%20I%20need%20help%20with...`
        },
        {
            title: "Email Support",
            label: "24h Response",
            desc: "For inquiries and bulk orders.",
            icon: <Mail className="w-8 h-8" />,
            color: "bg-slate-950",
            link: `mailto:${siteConfig.supportEmail}`
        },
        {
            title: "Headquarters",
            label: "Accra, Ghana",
            desc: "Our main office in West Africa.",
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

            {/* 1. Support Hero (Support Header) */}
            <section className="relative pt-24 md:pt-32 pb-14 md:pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-8 md:mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-4">Support Center</span>
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-none"
                            >
                                Support <span className="italic font-normal">Center.</span>
                            </motion.h1>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-left md:text-right font-black"
                        >
                            Connecting our shipping network <br className="hidden sm:inline" /> to your doorstep.
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
                            className="p-6 sm:p-8 md:p-12 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-500"
                        >
                            <div className="w-12 h-12 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-900 dark:group-hover:border-white transition-all mb-8">
                                {React.cloneElement(channel.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
                            </div>
                            <span className="text-emerald-700 dark:text-emerald-500 text-[9px] uppercase font-black tracking-[0.4em] mb-4 block leading-none">{channel.label}</span>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:italic transition-all">{channel.title}</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed mb-8 md:mb-10 max-w-[260px]">{channel.desc}</p>
                            <a
                                href={channel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-900 dark:border-white pb-1 hover:pr-4 transition-all"
                            >
                                Message Us <ArrowRight className="w-3 h-3" />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Detailed Contact & Location (Support Grid) */}
            <section className="py-16 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                        <div className="space-y-12 md:space-y-16">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-4 md:mb-6">Main Office</span>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 md:mb-8 text-slate-900 dark:text-white tracking-tight">Our <span className="italic font-normal">Headquarters.</span></h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
                                    Our headquarters in Accra serves as the main hub for distribution across Ghana.
                                </p>
                            </div>
    
                            <div className="grid grid-cols-2 gap-8 md:gap-12 border-t border-slate-50 dark:border-slate-900 pt-10 md:pt-16">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Location</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">{siteConfig.address}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Opening Hours</h4>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">Mon - Fri / 09:00 - 18:00</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed uppercase tracking-tight font-black">Sat / 10:00 - 16:00</p>
                                </div>
                            </div>
    
                            <div className="flex items-center gap-12 md:gap-16 border-t border-slate-50 dark:border-slate-900 pt-10 md:pt-16">
                                <div>
                                    <div className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">99%</div>
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Delivery Success</div>
                                </div>
                                <div>
                                    <div className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">24h</div>
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Response Time</div>
                                </div>
                            </div>
                        </div>
    
                        <div className="relative border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm">
                            <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.7148124396617!2d-0.1687550240594233!3d5.754127994228258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf77138b11ed4b%3A0xaae48c1875009a9d!2sLondon%27s%20Imports%20Ghana!5e0!3m2!1sen!2sgh!4v1775137181616!5m2!1sen!2sgh"
                                    width="100%"
                                    height="100%"
                                    title="London's Imports HQ"
                                    className="border-0 w-full h-full"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border border-slate-900 dark:border-white px-3.5 sm:px-5 py-2 sm:py-3 shadow-lg pointer-events-none rounded-sm">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">Verified Location</span>
                                </div>
                                <a
                                    href={siteConfig.addressMapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-center sm:justify-start gap-2 text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all group"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                                    <span>Open in Google Maps</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Instant Message / Concierge Form (Stationery Aesthetic) */}
            <section className="py-16 md:py-28 bg-surface dark:bg-slate-950/60 border-y border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-500 block mb-4 sm:mb-6 italic">Direct Message</span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-6 sm:mb-8 text-slate-900 dark:text-white tracking-tight leading-none">Order <br /><span className="italic font-normal">Support.</span></h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 sm:mb-10 leading-relaxed max-w-sm font-medium">
                            Need a special request or tracking an order? Message our team for priority help.
                        </p>
    
                        <div className="space-y-4">
                            <div
                                onClick={() => handleCopy(`+${siteConfig.concierge}`)}
                                className="group cursor-pointer max-w-max relative"
                            >
                                <div className="flex items-center gap-4 sm:gap-6 text-slate-900 dark:text-white mb-2">
                                    <Phone className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                    <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">+{siteConfig.concierge.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</span>
                                    {copied ? <Check className="w-5 h-5 text-brand-emerald" /> : <Copy className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />}
                                </div>
                                <div className="w-full h-px bg-slate-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                {copied && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-10 left-0 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black px-3 py-1.5 uppercase tracking-widest shadow-xl rounded-md"
                                    >
                                        Copied
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>
    
                    <div className="w-full bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 md:p-12 rounded-2xl shadow-xl shadow-slate-950/5 transition-colors">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6">
                                <div className="w-16 h-16 border border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 rounded-full">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Message Received</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">Our team will respond within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-900 dark:border-white pb-1 hover:pr-3 transition-all pt-4"
                                >
                                    New Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                {error && (
                                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 rounded-xl text-xs font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-2.5 text-slate-900 dark:text-white focus:border-brand-emerald dark:focus:border-brand-emerald outline-none transition-all text-base sm:text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-2.5 text-slate-900 dark:text-white focus:border-brand-emerald dark:focus:border-brand-emerald outline-none transition-all text-base sm:text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Subject</label>
                                    <select
                                        required
                                        aria-label="Inquiry Type"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-2.5 text-slate-900 dark:text-white focus:border-brand-emerald dark:focus:border-brand-emerald outline-none transition-all text-base sm:text-lg appearance-none cursor-pointer font-medium"
                                    >
                                        <option value="" className="dark:bg-slate-900">Select Subject...</option>
                                        {subjectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Your Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 py-2.5 text-slate-900 dark:text-white focus:border-brand-emerald dark:focus:border-brand-emerald outline-none transition-all text-base sm:text-lg resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-14 sm:h-16 font-black flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-50 uppercase tracking-[0.25em] text-xs group rounded-xl shadow-sm hover:bg-brand-emerald dark:hover:bg-brand-emerald dark:hover:text-white"
                                >
                                    {loading ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>
                                            <span className="whitespace-nowrap">Send Message</span>
                                            <Send className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. Regional Logistics Presence (Architectural Ledger) */}
            <section className="py-16 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6 md:gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 block mb-4 md:mb-6">Delivery Area</span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-none">Shipping <span className="italic font-normal">Network.</span></h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-[10px] uppercase tracking-[0.3em] leading-relaxed font-black text-left md:text-right">
                            Delivering genuine electronics and lifestyle <br className="hidden sm:inline" /> products across all 16 regions of Ghana.
                        </p>
                    </div>
 
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-900">
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
                                className="flex items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-default group"
                            >
                                <div className="w-2 h-2 rounded-full bg-brand-emerald shadow-[0_0_10px_rgba(0,107,90,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Preview (Thin-Line Repository) */}
            <section className="py-16 md:py-28 bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
                    <div className="text-center mb-16 md:mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 block mb-4 sm:mb-6 italic underline decoration-slate-200 dark:decoration-slate-800 underline-offset-8 text-center">FAQ</span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 sm:mb-6 tracking-tight text-slate-900 dark:text-white">Your <span className="italic font-normal">Questions.</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-widest text-center mt-4 sm:mt-8">Quick access to common shipping and order questions.</p>
                    </div>
 
                    <div className="space-y-0 border-t border-slate-100 dark:border-slate-800">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full py-8 sm:py-10 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-base sm:text-xl font-serif font-bold transition-all duration-500 ${expandedFaq === idx ? 'text-slate-900 dark:text-white italic pl-4' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:pl-2'}`}>
                                        {faq.q}
                                    </span>
                                    {expandedFaq === idx ? (
                                        <div className="w-8 h-8 rounded-full border border-slate-900 dark:border-white flex items-center justify-center transition-all rotate-180 shrink-0 ml-4">
                                            <ChevronUp className="w-4 h-4 text-slate-950 dark:text-white" strokeWidth={1.5} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-900 dark:group-hover:border-white transition-all shrink-0 ml-4">
                                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white" strokeWidth={1.5} />
                                        </div>
                                    )}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedFaq === idx ? 'auto' : 0, opacity: expandedFaq === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-8 sm:pb-10 pt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl font-medium border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 pl-6 sm:pl-8 ml-2 sm:ml-4">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
 
                    <div className="mt-16 sm:mt-24 text-center">
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-4 sm:gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2 hover:pr-6 transition-all group"
                        >
                            See all FAQs <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
