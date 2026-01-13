/**
 * London's Imports - Smart Help Center
 * FAQ search first, then contact form if needed
 */
'use client';

import { useState, useMemo } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Search, MessageCircle, Mail, ChevronDown, ChevronUp, CheckCircle, Send, HelpCircle } from 'lucide-react';

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

// Subject options for contact form
const subjectOptions = [
    { value: 'order_issue', label: 'Order Issue' },
    { value: 'shipping', label: 'Shipping Question' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'vendor', label: 'Vendor/Seller Inquiry' },
    { value: 'product', label: 'Product Question' },
    { value: 'refund', label: 'Returns & Refunds' },
    { value: 'other', label: 'Other' },
];

export default function ContactPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

    // Filter FAQs based on search
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
                body: JSON.stringify({
                    ...formData,
                    subject: subjectLabel
                }),
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
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gradient-to-b from-pink-50 to-white'}`}>
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-pink-900/30 to-violet-900/30' : 'bg-gradient-to-br from-pink-100/50 to-violet-100/50'}`} />
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pink-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative px-4 py-12 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                        <HelpCircle className={`w-8 h-8 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        How can we help?
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Search our FAQ or contact support
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-4 pb-12">
                {/* Search Input */}
                <div className={`relative rounded-2xl shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Type your question..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-white text-gray-900 placeholder-gray-400'}`}
                    />
                </div>

                {/* FAQ Results */}
                {searchQuery.trim() && (
                    <div className="mt-4 space-y-3">
                        {filteredFaqs.length > 0 ? (
                            <>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
                                </p>
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-xl overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-left ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}
                                        >
                                            <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {faq.question}
                                            </span>
                                            {expandedFaq === index ? (
                                                <ChevronUp className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                                            ) : (
                                                <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                                            )}
                                        </button>
                                        {expandedFaq === index && (
                                            <div className={`px-4 pb-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className={`text-center py-8 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    No matching answers found
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/233541096372?text=Hi%20London's%20Imports!%20I%20need%20help%20with..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <div>
                            <p className="font-semibold text-sm">WhatsApp</p>
                            <p className="text-xs opacity-90">Instant response</p>
                        </div>
                    </a>

                    {/* Email */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`flex items-center gap-3 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                            <Mail className={`w-5 h-5 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-sm">Email Us</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>24hr response</p>
                        </div>
                    </button>
                </div>

                {/* Contact Form */}
                {showForm && !submitted && (
                    <div className={`mt-6 p-6 rounded-2xl shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Send us a message
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={`px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'} border`}
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className={`px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'} border`}
                                />
                            </div>

                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                            >
                                <option value="">Select a topic...</option>
                                {subjectOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            <textarea
                                placeholder="How can we help?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={4}
                                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none ${isDark ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'} border`}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
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
                    <div className={`mt-6 p-8 rounded-2xl text-center ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Message Sent!
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            We&apos;ll get back to you within 24 hours.
                        </p>
                    </div>
                )}

                {/* Contact Info */}
                <div className={`mt-8 p-5 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Contact Information
                    </h4>
                    <div className="space-y-2">
                        <a href="mailto:info@londonsimports.com" className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <Mail className="w-4 h-4" />
                            info@londonsimports.com
                        </a>
                        <a href="https://wa.me/233541096372" className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <MessageCircle className="w-4 h-4" />
                            +233 541 096 372
                        </a>
                    </div>

                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Business Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
