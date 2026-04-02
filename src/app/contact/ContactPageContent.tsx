'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageCircle,
    Mail,
    MapPin,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Send,
    Zap,
    Globe,
    Phone,
    Clock,
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
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-100 selection:text-slate-950">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />

            {/* 1. Support Hero */}
            <section className="relative pt-24 pb-40 bg-slate-950 overflow-hidden text-center border-b border-white/5">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent" />
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-10 h-0.5 bg-green-600 mx-auto mb-6"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-[0.2em]"
                    >
                        Support Center
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xs md:text-sm uppercase tracking-widest max-w-xl mx-auto leading-relaxed"
                    >
                        Connecting our global logistics network to your doorstep. <br className="hidden md:block" /> Reliable support for your business growth.
                    </motion.p>
                </div>
            </section>

            {/* 2. Global Support Channels */}
            <section className="-mt-24 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 relative z-20">
                {supportChannels.map((channel, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.3 }}
                        className="bg-slate-950/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 group hover:-translate-y-1 hover:bg-slate-950 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

                        <div className={`${channel.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                            {React.cloneElement(channel.icon as React.ReactElement<{ className: string }>, { className: "w-6 h-6" })}
                        </div>
                        <p className="text-white font-bold mb-1 uppercase tracking-tight leading-none text-xl">{channel.title}</p>
                        <p className="text-green-500 text-[10px] uppercase font-black tracking-widest mb-4">{channel.label}</p>
                        <p className="text-slate-100 text-xs leading-relaxed mb-6 font-medium drop-shadow-sm">{channel.desc}</p>
                        <a
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] font-black text-white hover:text-green-500 transition-colors uppercase tracking-widest border-b border-transparent hover:border-green-500 pb-0.5"
                        >
                            Connect Now <Zap className="w-3.5 h-3.5 fill-current" />
                        </a>
                    </motion.div>
                ))}
            </section>

            {/* 3. Detailed Contact & Location */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div>
                            <div className="w-8 h-0.5 bg-slate-950 mb-6" />
                            <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight leading-none text-slate-950">Operating Headquarters</h2>
                            <p className="text-slate-500 text-lg leading-relaxed font-light">
                                Our headquarters in Accra serves as the nerve center for distribution across West Africa.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-slate-950" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-950 uppercase tracking-widest text-xs mb-1">Physical Address</h4>
                                    <p className="text-slate-500 text-sm font-light">{siteConfig.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                                    <Clock className="w-5 h-5 text-slate-950" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-950 uppercase tracking-widest text-xs mb-1">Business Hours</h4>
                                    <p className="text-slate-500 text-sm font-light uppercase tracking-tight">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                    <p className="text-slate-500 text-sm font-light uppercase tracking-tight">Sat: 10:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100 flex items-center gap-16">
                            <div>
                                <div className="text-3xl font-black text-slate-950">92%</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">On-time Res</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-950">24h</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Goal</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-slate-950/5 rounded-[3rem] blur-2xl -z-10" />
                        <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden aspect-square relative shadow-xl border-8 border-white">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.7148124396617!2d-0.1687550240594233!3d5.754127994228258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf77138b11ed4b%3A0xaae48c1875009a9d!2sLondon&#39;s%20Imports%20Ghana!5e0!3m2!1sen!2sgh!4v1775137181616!5m2!1sen!2sgh"
                                width="100%"
                                height="100%"
                                title="London's Imports HQ"
                                className="border-0 grayscale contrast-125"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Instant Message / Form */}
            <section className="py-32 bg-slate-50 text-slate-950 overflow-hidden relative border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20">
                    <div className="flex flex-col justify-center">
                        <div className="w-10 h-0.5 bg-slate-950 mb-10" />
                        <h2 className="text-4xl font-bold mb-8 uppercase tracking-tight">Order Concierge</h2>
                        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light">
                            Already have an order or seeking a VIP sourcing request? Use our dedicated concierge line for priority handling.
                        </p>

                        <div className="space-y-4">
                            <div
                                onClick={() => handleCopy(`+${siteConfig.concierge}`)}
                                className="inline-flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-950 transition-colors group cursor-pointer max-w-max relative shadow-sm"
                            >
                                <Phone className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                                <span className="font-bold tracking-tight text-lg text-slate-950">+{siteConfig.concierge.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</span>
                                <div className="ml-2 pl-3 border-l border-slate-100">
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-950 transition-colors" />}
                                </div>
                                {copied && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-xl"
                                    >
                                        COPIED
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-slate-100">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-950 mb-2 uppercase tracking-tight">Message Sent</h3>
                                    <p className="text-slate-500 font-light">We will get back to you within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-950 border-b border-slate-900 pb-0.5"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold tracking-widest uppercase border border-red-100">
                                        {error}
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-4 text-slate-900 focus:ring-1 focus:ring-slate-950 focus:border-slate-950 focus:bg-white transition-all font-light text-sm"
                                            placeholder="Abena Serwaa"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-4 text-slate-900 focus:ring-1 focus:ring-slate-950 focus:border-slate-950 focus:bg-white transition-all font-light text-sm"
                                            placeholder="abena@company.gh"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Inquiry Type</label>
                                    <select
                                        required
                                        aria-label="Inquiry Type"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-4 text-slate-900 focus:ring-1 focus:ring-slate-950 focus:border-slate-950 focus:bg-white transition-all font-light text-sm appearance-none"
                                    >
                                        <option value="">Select a topic...</option>
                                        {subjectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-4 text-slate-900 focus:ring-1 focus:ring-slate-950 focus:border-slate-950 focus:bg-white transition-all font-light text-sm resize-none"
                                        placeholder="How can our team assist you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-950 hover:bg-green-600 text-white py-5 rounded-xl font-bold flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.3em] text-[10px]"
                                >
                                    {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. Regional Logistics Presence */}
            <section className="py-32 bg-slate-950 text-white overflow-hidden relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="w-8 h-0.5 bg-green-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold uppercase tracking-[0.3em] text-white mb-6">Logistics Network</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-[10px] uppercase tracking-widest leading-relaxed">We deliver authentic electronics and lifestyle products to all 16 regions of Ghana with guaranteed safety.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
                            "Volta", "Northern", "Upper East", "Upper West", "Bono",
                            "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
                        ].map((region, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx % 4) * 0.05 }}
                                className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-green-600/20 hover:border-green-600/50 transition-all cursor-default group"
                            >
                                <MapPin className="w-4 h-4 text-green-600 group-hover:scale-125 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Preview */}
            <section className="py-32 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="w-10 h-0.5 bg-slate-950 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-slate-950">Help Center</h2>
                        <p className="text-slate-500 font-light text-lg">Quick answers to common logistics and sourcing inquiries.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full px-8 py-7 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold text-slate-950 group-hover:text-green-600 transition-colors uppercase tracking-[0.05em] text-sm">{faq.q}</span>
                                    {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedFaq === idx ? 'auto' : 0, opacity: expandedFaq === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-8 text-slate-500 text-sm leading-relaxed font-light border-t border-slate-50 pt-6">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-slate-950 text-white rounded-2xl font-bold hover:bg-green-600 transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-950/20 active:scale-95"
                        >
                            Full Help Center <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
