'use client';

import React, { useState, useEffect } from 'react';
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
    ShieldCheck,
    Star,
    Phone,
    Clock,
    CheckCircle,
    Copy,
    Check
} from 'lucide-react';
import { api } from '@/lib/api';

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

    useEffect(() => {
        // Any initialization logic can go here
    }, []);

    const faqs = [
        { q: "How do I track my order?", a: "Log in to your dashboard and navigate to 'Trace My Batch'. Each order is tracked via a unique Batch ID with real-time updates from Guangzhou to Accra." },
        { q: "What is your refund policy?", a: "We offer 100% money-back guarantee for items that do not meet our authenticity standards or fail to arrive within the committed window." },
        { q: "Do you deliver to my region?", a: "Yes, we deliver to all 16 regions of Ghana. Our primary logistics hubs are in Accra, Kumasi, and Tamale." }
    ];

    const supportChannels = [
        {
            title: "WhatsApp",
            label: "Instant Messaging",
            desc: "The fastest way to reach our logistics team.",
            icon: <MessageCircle className="w-8 h-8" />,
            color: "bg-green-600",
            link: "https://wa.me/233545247009?text=Hi%20London's%20Imports!%20I%20need%20help%20with..."
        },
        {
            title: "Email Support",
            label: "24h Response",
            desc: "For formal inquiries and bulk order sourcing.",
            icon: <Mail className="w-8 h-8" />,
            color: "bg-orange-600",
            link: "mailto:info@londonsimports.com"
        },
        {
            title: "Global HQ",
            label: "Accra, Ghana",
            desc: "Our primary operating unit in West Africa.",
            icon: <Globe className="w-8 h-8" />,
            color: "bg-purple-600",
            link: "https://maps.app.goo.gl/K7qfiM3QesWfkkrp7"
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
                // Reset form
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or use WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-600">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />

            {/* 1. Support Hero (Extended for Glass Flow) */}
            <section className="relative pt-20 pb-40 bg-slate-950 overflow-hidden text-center border-b border-white/5">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-10 h-0.5 bg-orange-600 mx-auto mb-6"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight"
                    >
                        Support Center
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed"
                    >
                        Connecting our global logistics network to your doorstep. <br className="hidden md:block" /> Reliable support for your business growth.
                    </motion.p>
                </div>
            </section>

            {/* 2. Global Support Channels (Transparent Glass Cards) */}
            <section className="-mt-24 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 relative z-20">
                {supportChannels.map((channel, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.3 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

                        <div className={`${channel.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg shadow-orange-500/5`}>
                            {React.cloneElement(channel.icon as React.ReactElement<{ className: string }>, { className: "w-6 h-6" })}
                        </div>
                        <h3 className="text-xl font-bold mb-0.5 text-white">{channel.title}</h3>
                        <p className="text-orange-400 text-[10px] uppercase font-bold tracking-widest mb-3">{channel.label}</p>
                        <p className="text-gray-300 text-xs leading-relaxed mb-5">{channel.desc}</p>
                        <a
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-wider"
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
                            <div className="w-8 h-1 bg-orange-600 mb-6" />
                            <h2 className="text-4xl font-bold mb-6 italic uppercase tracking-tighter leading-none">Our Primary Operating Unit</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Our headquarters in Accra serves as the nerve center for distribution across West Africa.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Physical Address</h4>
                                    <p className="text-gray-500 text-sm">Felchris Estate 2, Danfa, Accra, Ghana</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Business Hours</h4>
                                    <p className="text-gray-500 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                    <p className="text-gray-500 text-sm">Sat: 10:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex items-center gap-12">
                            <div>
                                <div className="text-2xl font-black text-slate-900">92%</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">On-time Res</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">24h</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SLA Goal</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-600/5 rounded-[3rem] blur-2xl -z-10" />
                        <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden aspect-square relative shadow-xl border-8 border-white">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.1505!3d5.6771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDAnMzcuNiJOIDDCsDA5JzAxLjgiVw!5e0!3m2!1sen!2sgh!4v1"
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

            {/* 4. Instant Message / Form (The Jumia "Dark" Flow) */}
            <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-20">
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white/[0.03] text-[18vw] uppercase italic leading-none z-0">
                        DIRECT
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20">
                    <div className="flex flex-col justify-center">
                        <div className="w-10 h-1 bg-orange-600 mb-10" />
                        <h2 className="text-5xl font-bold mb-8 italic">Direct Inquiries</h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Have a specific sourcing request or a bulk wholesale inquiry? Use our direct line for priority handling.
                        </p>

                        <div className="space-y-4">
                            <div
                                onClick={() => handleCopy('+233541096372')}
                                className="inline-flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer max-w-max relative"
                            >
                                <Phone className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                                <span className="font-bold tracking-tight text-lg">+233 541 096 372</span>
                                <div className="ml-2 pl-3 border-l border-white/10">
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />}
                                </div>
                                {copied && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-600 text-[10px] font-bold px-2 py-1 rounded shadow-xl"
                                    >
                                        COPIED
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-slate-100">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-950 mb-2">Message Sent</h3>
                                    <p className="text-gray-500">We will get back to you within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-orange-600 font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                                        {error}
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-transparent border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-sm"
                                            placeholder="Abena Serwaa"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-transparent border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-sm"
                                            placeholder="abena@company.gh"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                                    <select
                                        required
                                        aria-label="Inquiry Type"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full bg-transparent border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-sm appearance-none"
                                    >
                                        <option value="">Select a topic...</option>
                                        {subjectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-transparent border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-sm resize-none"
                                        placeholder="How can our team assist you today?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-3 transition-all shadow-md shadow-orange-600/10 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
                                >
                                    {loading ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. DNA / Corporate Values */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-4 justify-center md:justify-start">
                        <Zap className="w-5 h-5 text-orange-600" />
                        <div className="text-left">
                            <h4 className="font-bold text-xs uppercase tracking-tight">Speed</h4>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Fast Logistics</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 justify-center md:justify-center border-x border-slate-50 px-8">
                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                        <div className="text-left">
                            <h4 className="font-bold text-xs uppercase tracking-tight">Integrity</h4>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Secure Sourcing</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 justify-center md:justify-end">
                        <Star className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                            <h4 className="font-bold text-xs uppercase tracking-tight">Growth</h4>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Business Partner</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. Regional Logistics Presence */}
            <section className="py-24 bg-slate-950 text-white overflow-hidden relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="w-8 h-0.5 bg-orange-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-4 italic">Regional Logistics Presence</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm">We deliver authentic electronics and lifestyle products to all 16 regions of Ghana with guaranteed safety.</p>
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
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-600/20 hover:border-orange-600/50 transition-all cursor-default group"
                            >
                                <MapPin className="w-3.5 h-3.5 text-orange-600 group-hover:scale-125 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-300 group-hover:text-white">{region}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQ Preview (Clean & High Density) */}
            <section className="py-32 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="w-10 h-1 bg-orange-600 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold mb-4 italic uppercase">Frequently Asked Questions</h2>
                        <p className="text-gray-500 font-medium">Quick answers to common logistics and sourcing inquiries.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight text-sm">{faq.q}</span>
                                    {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedFaq === idx ? 'auto' : 0, opacity: expandedFaq === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="/faq"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all uppercase tracking-widest text-xs"
                        >
                            View Full Help Center <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
