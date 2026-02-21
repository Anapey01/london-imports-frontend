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
    ShieldCheck,
    Star,
    Phone,
    Clock,
    Copy,
    Check
} from 'lucide-react';

/**
 * 🏢 London's Imports - Elite Support Center Mockup
 * Merging the "Jumia Authority" aesthetic with the existing functionality.
 */
export const ContactPageMockup = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
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
            title: "WhatsApp",
            label: "Instant Messaging",
            desc: "The fastest way to reach our logistics team.",
            icon: <MessageCircle className="w-8 h-8" />,
            color: "bg-green-600",
            link: "#"
        },
        {
            title: "Email Support",
            label: "24h Response",
            desc: "For formal inquiries and bulk order sourcing.",
            icon: <Mail className="w-8 h-8" />,
            color: "bg-orange-600",
            link: "#"
        },
        {
            title: "Global HQ",
            label: "Accra, Ghana",
            desc: "Our primary operating unit in West Africa.",
            icon: <Globe className="w-8 h-8" />,
            color: "bg-purple-600",
            link: "#"
        }
    ];

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
                            {/* Scaling down icon with type safety */}
                            {React.cloneElement(channel.icon as React.ReactElement<{ className: string }>, { className: "w-6 h-6" })}
                        </div>
                        <h3 className="text-xl font-bold mb-0.5 text-white">{channel.title}</h3>
                        <p className="text-orange-400 text-[10px] uppercase font-bold tracking-widest mb-3">{channel.label}</p>
                        <p className="text-gray-300 text-xs leading-relaxed mb-5">{channel.desc}</p>
                        <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-wider">
                            Connect Now <Zap className="w-3.5 h-3.5 fill-current" />
                        </button>
                    </motion.div>
                ))}
            </section>

            {/* 3. Detailed Contact & Location (Refined) */}
            <section className="py-24 max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div>
                            <div className="w-6 h-0.5 bg-orange-600 mb-5" />
                            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight leading-none text-slate-900">Primary Operating Unit</h2>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                Our headquarters in Accra serves as the nerve center for distribution across West Africa, managing thousands of precise international shipments.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200/60 flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="text-sm">
                                    <h4 className="font-bold text-slate-900 leading-none mb-1">Physical Address</h4>
                                    <p className="text-gray-500">Felchris Estate 2, Danfa, Accra, Ghana</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200/60 flex-shrink-0">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="text-sm">
                                    <h4 className="font-bold text-slate-900 leading-none mb-1">Business Hours</h4>
                                    <p className="text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center gap-10">
                            <div>
                                <div className="text-xl font-black text-slate-900">92%</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">On-time Res</div>
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900">24h</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SLA Goal</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-600/5 rounded-[2rem] blur-2xl -z-10" />
                        <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-video relative shadow-inner border border-slate-200/50">
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-300 text-xs uppercase tracking-widest text-center px-12 italic">
                                [Map Placeholder]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Instant Message / Form (Refined Jumia "Dark" Flow) */}
            <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-10">
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white/[0.02] text-[15vw] uppercase italic leading-none z-0">
                        DIRECT
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="w-8 h-0.5 bg-orange-600 mb-8" />
                        <h2 className="text-4xl font-bold mb-6 italic tracking-tight uppercase">Direct Inquiry</h2>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-sm">
                            Have a specific sourcing request or a bulk wholesale inquiry? Use our direct line for priority handling.
                        </p>

                        <div className="space-y-4">
                            <div
                                onClick={handleCopy}
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
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-600 text-[10px] font-bold px-2 py-1 rounded"
                                    >
                                        COPIED
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-2xl">
                        <form className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm" placeholder="Abena Serwaa" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm" placeholder="abena@company.gh" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                                <select aria-label="Inquiry Type" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm appearance-none">
                                    <option>General Support</option>
                                    <option>Wholesale Sourcing</option>
                                    <option>Logistics & Tracking</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm resize-none" placeholder="Assistance detail..." />
                            </div>
                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-extrabold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest text-sm">
                                Send Message <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 5. DNA / Corporate Values (Compact) */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center text-slate-900">
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

            {/* 6. FAQ Preview (Clean & High Density) */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="w-8 h-0.5 bg-orange-600 mx-auto mb-5" />
                        <h2 className="text-3xl font-bold mb-3 uppercase tracking-tight">Help Center</h2>
                        <p className="text-gray-500 text-xs font-medium">Quick answers to common logistics and sourcing inquiries.</p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl overflow-hidden border border-slate-200/50 shadow-sm">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors uppercase tracking-tight text-xs">{faq.q}</span>
                                    {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedFaq === idx ? 'auto' : 0, opacity: expandedFaq === idx ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-5 text-gray-500 text-[11px] leading-relaxed border-t border-slate-50 pt-3">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl font-bold hover:bg-orange-600 transition-all uppercase tracking-widest text-[10px]">
                            Full Help Center <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPageMockup;
