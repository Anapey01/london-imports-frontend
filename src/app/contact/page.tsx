/**
 * London's Imports - Premium Help Center
 * High-tech design with glassmorphism, animations & gradients
 */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Search, MessageCircle, Mail, ChevronDown, ChevronUp, CheckCircle, Send, Sparkles, Zap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com/api/v1';

// FAQ Data
const faqs = [
    {
        question: "What is a pre-order?",
        answer: "A pre-order allows you to reserve and pay for an item before it arrives in Ghana. This guarantees your item and often comes with better pricing than buying after arrival.",
        keywords: ["pre-order", "preorder", "reserve", "before"]
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery windows are shown on each product (typically 8-9 weeks). We use date ranges, not exact dates, to ensure honest timelines. You'll receive updates at each milestone.",
        keywords: ["delivery", "shipping", "time", "how long", "weeks", "days"]
    },
    {
        question: "Is my payment secure?",
        answer: "Yes! All payments are processed through Paystack, Ghana's leading payment provider. Your funds are held securely until your order is delivered.",
        keywords: ["payment", "secure", "safe", "paystack", "momo"]
    },
    {
        question: "Can I cancel my order?",
        answer: "Yes, you can cancel any time before the batch cutoff date for a full refund. After cutoff, cancellations may be subject to supplier fees.",
        keywords: ["cancel", "refund", "cancel order", "cancellation"]
    },
    {
        question: "What payment options are available?",
        answer: "We accept Mobile Money (MTN, Vodafone, AirtelTigo) and card payments. For most items, you can also pay a deposit now and the balance on delivery.",
        keywords: ["payment", "momo", "mobile money", "card", "pay", "options"]
    },
    {
        question: "How do I track my order?",
        answer: "Log in to your account and visit 'My Orders' to see real-time status updates. You'll also receive SMS/WhatsApp notifications at each milestone.",
        keywords: ["track", "order", "status", "where", "my order"]
    },
    {
        question: "What if my item doesn't arrive?",
        answer: "If delivery fails for any reason, you receive a full refund. Our 92% on-time delivery rate means this is rare, but you're always protected.",
        keywords: ["not arrive", "missing", "lost", "refund", "didn't come"]
    },
    {
        question: "How do I become a vendor?",
        answer: "Visit our 'Become a Vendor' page and fill out the application form. Our team will review your application and contact you within 2-3 business days.",
        keywords: ["vendor", "seller", "sell", "store", "become vendor"]
    },
    {
        question: "What happens if there's a delay?",
        answer: "We'll notify you immediately via SMS and WhatsApp. If the delay exceeds the promised window, you can choose to wait for a discount or receive a full refund.",
        keywords: ["delay", "late", "delayed", "waiting"]
    },
    {
        question: "Can I buy from 1688 or Taobao?",
        answer: "Yes! We ship to all major cities in Ghana from 1688, Taobao, or Alibaba. We consolidate your orders in China and deliver door-to-door anywhere in Ghana.",
        keywords: ["1688", "taobao", "alibaba", "china", "order from china"]
    },
    {
        question: "What are the customs/clearance costs?",
        answer: "Customs duties typically range 0-20% depending on item category. London's Imports includes customs clearance in our pricing - no hidden fees!",
        keywords: ["customs", "clearance", "duty", "tax", "tema", "port"]
    },
    {
        question: "Do you deliver to Kumasi/outside Accra?",
        answer: "Yes! We deliver to Accra, Kumasi, Tema, Takoradi, Cape Coast, and all major cities in Ghana. Door-to-door delivery included.",
        keywords: ["kumasi", "delivery", "outside accra", "takoradi", "cape coast", "city"]
    }
];

const subjectOptions = [
    { value: 'order_issue', label: 'Order Issue', icon: '📦' },
    { value: 'shipping', label: 'Shipping Question', icon: '🚚' },
    { value: 'payment', label: 'Payment Problem', icon: '💳' },
    { value: 'vendor', label: 'Vendor/Seller Inquiry', icon: '🏪' },
    { value: 'product', label: 'Product Question', icon: '🛍️' },
    { value: 'refund', label: 'Returns & Refunds', icon: '↩️' },
    { value: 'other', label: 'Other', icon: '💬' },
];

export default function ContactPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    // Animation mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filter FAQs
    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            faq.keywords.some(kw => kw.includes(query))
        );
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const subjectLabel = subjectOptions.find(s => s.value === formData.subject)?.label || formData.subject;

        try {
            const response = await fetch(`${API_URL}/auth/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, subject: subjectLabel }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send');
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-pink-50/30 to-violet-50/30'}`}>
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-pink-500/10' : 'bg-pink-300/30'}`} />
                <div className={`absolute bottom-20 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-violet-500/10' : 'bg-violet-300/30'}`} style={{ animationDelay: '1s' }} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${isDark ? 'bg-blue-500/5' : 'bg-blue-200/20'}`} />
            </div>

            {/* Hero Header */}
            <div className={`relative pt-12 pb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-center px-4">
                    {/* Premium Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 ${isDark ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-white/80 text-gray-600 border border-gray-200/50 shadow-sm'} backdrop-blur-xl`}>
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        24/7 Support Available
                    </div>

                    {/* Gradient Heading */}
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                        How can we help?
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Search our FAQ or get instant support
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pb-16 relative z-10">
                {/* Premium Search Input */}
                <div className={`relative transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${searchFocused ? 'bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-violet-500/20 blur-xl scale-105' : 'opacity-0'}`} />
                    <div className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/50 shadow-xl shadow-pink-500/5'} ${searchFocused ? 'ring-2 ring-pink-500/50' : ''}`}>
                        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchFocused ? 'text-pink-500' : isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Type your question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`w-full pl-14 pr-5 py-5 rounded-2xl text-base font-medium focus:outline-none bg-transparent ${isDark ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
                        />
                    </div>
                </div>

                {/* FAQ Results */}
                {searchQuery.trim() && (
                    <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {filteredFaqs.length > 0 ? (
                            <>
                                <p className={`text-xs font-medium px-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
                                </p>
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-xl overflow-hidden border backdrop-blur-xl transition-all duration-200 hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/80 border-gray-100 hover:shadow-lg shadow-sm'}`}
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className="w-full flex items-center justify-between px-5 py-4 text-left"
                                        >
                                            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {faq.question}
                                            </span>
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expandedFaq === index ? 'bg-pink-500/20' : isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className={`w-4 h-4 ${isDark ? 'text-pink-400' : 'text-pink-500'}`} />
                                                ) : (
                                                    <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                                                )}
                                            </div>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className={`px-5 pb-4 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className={`text-center py-10 rounded-xl border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-100'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                    <Search className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                                </div>
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    No matching answers found
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Try different keywords or contact us below
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                <div className={`mt-8 grid grid-cols-2 gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                    {/* WhatsApp - Premium Card */}
                    <a
                        href="https://wa.me/233541096372?text=Hi%20London's%20Imports!%20I%20need%20help%20with..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-2xl p-5 text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-green-500/25"
                        style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-base">WhatsApp</p>
                            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                                <Zap className="w-3 h-3" />
                                Instant response
                            </p>
                        </div>
                    </a>

                    {/* Email - Premium Card */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.03] border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-2xl hover:shadow-pink-500/10' : 'bg-white/80 border-gray-200/50 hover:shadow-2xl shadow-lg hover:shadow-pink-500/20'}`}
                    >
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ${isDark ? 'bg-pink-500/10' : 'bg-pink-500/5'}`} />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/30">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Us</p>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Response within 24h
                            </p>
                        </div>
                    </button>
                </div>

                {/* Contact Form */}
                {showForm && !submitted && (
                    <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50 shadow-xl'}`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a message</h3>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>We&apos;ll get back to you soon</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={`px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${isDark ? 'bg-white/5 text-white placeholder-slate-500 border border-white/10' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`}
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className={`px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${isDark ? 'bg-white/5 text-white placeholder-slate-500 border border-white/10' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`}
                                />
                            </div>

                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none cursor-pointer ${isDark ? 'bg-white/5 text-white border border-white/10' : 'bg-gray-50 text-gray-900 border border-gray-200'}`}
                            >
                                <option value="">Select a topic...</option>
                                {subjectOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                                ))}
                            </select>

                            <textarea
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={4}
                                className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none ${isDark ? 'bg-white/5 text-white placeholder-slate-500 border border-white/10' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-[length:200%_100%] hover:bg-right transition-all duration-500 disabled:opacity-50 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Success State */}
                {submitted && (
                    <div className={`mt-6 p-8 rounded-2xl text-center border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50 shadow-xl'}`}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Message Sent!
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            We&apos;ll get back to you within 24 hours.
                        </p>
                    </div>
                )}

                {/* Contact Info Footer */}
                <div className={`mt-10 p-6 rounded-2xl border backdrop-blur-xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200/50'}`} style={{ transitionDelay: '300ms' }}>
                    <h4 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Contact Information
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        <a href="mailto:info@londonsimports.com" className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-pink-400' : 'text-gray-600 hover:text-pink-500'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <Mail className="w-4 h-4" />
                            </div>
                            info@londonsimports.com
                        </a>
                        <a href="https://wa.me/233541096372" className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-green-400' : 'text-gray-600 hover:text-green-500'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            +233 541 096 372
                        </a>
                    </div>
                    <p className={`text-xs mt-4 pt-4 border-t ${isDark ? 'text-slate-500 border-white/10' : 'text-gray-400 border-gray-200'}`}>
                        Business Hours: Mon-Fri 9AM-6PM • Sat 10AM-4PM
                    </p>
                </div>
            </div>
        </div>
    );
}
