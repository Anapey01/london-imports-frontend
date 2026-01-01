/**
 * London's Imports - Contact Page
 */
'use client';

import { useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function ContactPage() {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to backend
        setSubmitted(true);
    };

    const inputStyle = {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        color: theme === 'dark' ? '#f8fafc' : '#111827',
        borderColor: theme === 'dark' ? '#475569' : '#d1d5db',
    };

    return (
        <div className="min-h-screen py-16 px-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Contact Us
                    </h1>
                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Have a question? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                            Get in Touch
                        </h2>

                        <div className="space-y-6">
                            {/* WhatsApp */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                                    <svg className="w-6 h-6" fill="#22c55e" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                        WhatsApp
                                    </h3>
                                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                        +233 XX XXX XXXX
                                    </p>
                                    <p className="text-sm" style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>
                                        Fastest response • 9am - 6pm
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fce7f3' }}>
                                    <svg className="w-6 h-6" fill="none" stroke="#ec4899" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                        Email
                                    </h3>
                                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                        support@londonsimports.com
                                    </p>
                                    <p className="text-sm" style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>
                                        Response within 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                                    <svg className="w-6 h-6" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                        Location
                                    </h3>
                                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                        Accra, Ghana
                                    </p>
                                    <p className="text-sm" style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>
                                        Pickup points across Greater Accra
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', borderColor: theme === 'dark' ? '#334155' : '#e5e7eb', borderWidth: 1 }}>
                            <h3 className="font-semibold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                Business Hours
                            </h3>
                            <div className="space-y-2 text-sm" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-2xl p-8" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}>
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                                    <svg className="w-8 h-8" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Message Sent!
                                </h3>
                                <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                    We&apos;ll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Send us a Message
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}>
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
                                        style={inputStyle}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl font-semibold text-white"
                                    style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
