/**
 * London's Imports - Premium Contact Page
 * Mobile-first, visually polished contact experience
 */
'use client';

import { useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com/api/v1';

export default function ContactPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try WhatsApp instead.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Compact Hero Header */}
            <div className="relative overflow-hidden">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-pink-900/40 to-violet-900/40' : 'bg-gradient-to-br from-pink-100 to-violet-100'}`}></div>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-pink-500/20 blur-2xl"></div>

                <div className="relative px-4 py-8 text-center">
                    <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Contact Us
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        We&apos;d love to hear from you
                    </p>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 mt-6 pb-8 space-y-4">
                {/* WhatsApp Card - Primary CTA */}
                <a
                    href="https://wa.me/233541096372?text=Hi%20London's%20Imports!%20I%20have%20a%20question."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>WhatsApp</h3>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Fastest</span>
                            </div>
                            <p className="text-green-500 font-semibold">+233 54 109 6372</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tap to chat • 9am - 6pm</p>
                        </div>
                        <svg className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </a>

                {/* Email & Location Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Email */}
                    <a
                        href="mailto:info@londonsimports.com"
                        className={`p-4 rounded-2xl shadow-sm hover:shadow-md transition-all ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h3>
                        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>info@londonsimports.com</p>
                    </a>

                    {/* Location */}
                    <div className={`p-4 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Location</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Accra, Ghana</p>
                    </div>
                </div>

                {/* Business Hours */}
                <div className={`p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Business Hours</h3>
                    </div>
                    <div className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span className="font-medium">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saturday</span>
                            <span className="font-medium">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sunday</span>
                            <span className={`font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Closed</span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={`p-6 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    {submitted ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Message Sent!
                            </h3>
                            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                                We&apos;ll get back to you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Send a Message
                            </h2>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    placeholder="Order inquiry"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    placeholder="How can we help you?"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
