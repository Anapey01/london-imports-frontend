/**
 * London's Imports - Refund Policy Page
 */
'use client';

import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';

export default function RefundsPage() {
    const { theme } = useTheme();

    const sectionStyle = {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        borderColor: theme === 'dark' ? '#334155' : '#e5e7eb',
    };

    const headingStyle = {
        color: theme === 'dark' ? '#f8fafc' : '#111827',
    };

    const textStyle = {
        color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
    };

    return (
        <div className="min-h-screen py-16 px-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={headingStyle}>
                        Refund Policy
                    </h1>
                    <p style={textStyle}>
                        Your satisfaction is our priority. Here&apos;s how refunds work at London&apos;s Imports.
                    </p>
                </div>

                {/* Key Points Banner */}
                <div className="p-6 rounded-2xl mb-8" style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}>
                    <div className="grid sm:grid-cols-3 gap-4 text-center text-white">
                        <div>
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-sm opacity-90">Refund if item fails</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">48hrs</div>
                            <div className="text-sm opacity-90">Processing time</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">Free</div>
                            <div className="text-sm opacity-90">Pre-cutoff cancellation</div>
                        </div>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {/* Eligibility */}
                    <div className="rounded-2xl p-6 border" style={sectionStyle}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={headingStyle}>
                            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                                <svg className="w-4 h-4" fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            When You&apos;re Eligible for a Refund
                        </h2>
                        <ul className="space-y-3" style={textStyle}>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#22c55e" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span><strong>Order cancelled before batch cutoff</strong> — Full refund, no questions asked</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#22c55e" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span><strong>Item not delivered</strong> — 100% refund including any fees</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#22c55e" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span><strong>Wrong item received</strong> — Full refund or replacement, your choice</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#22c55e" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span><strong>Item damaged on arrival</strong> — Full refund (report within 48 hours)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#22c55e" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span><strong>Significant delay beyond window</strong> — Option to cancel for full refund or wait with discount</span>
                            </li>
                        </ul>
                    </div>

                    {/* Process */}
                    <div className="rounded-2xl p-6 border" style={sectionStyle}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={headingStyle}>
                            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
                                <svg className="w-4 h-4" fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </span>
                            How to Request a Refund
                        </h2>
                        <div className="space-y-4" style={textStyle}>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb', color: headingStyle.color }}>1</div>
                                <div>
                                    <strong style={headingStyle}>Go to My Orders</strong>
                                    <p className="text-sm">Log in to your account and find the order you want to refund.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb', color: headingStyle.color }}>2</div>
                                <div>
                                    <strong style={headingStyle}>Click &quot;Request Refund&quot;</strong>
                                    <p className="text-sm">Select the reason and provide any additional details.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb', color: headingStyle.color }}>3</div>
                                <div>
                                    <strong style={headingStyle}>We Review (24-48 hours)</strong>
                                    <p className="text-sm">Our team will review your request and contact you if needed.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb', color: headingStyle.color }}>4</div>
                                <div>
                                    <strong style={headingStyle}>Refund Processed</strong>
                                    <p className="text-sm">Money returned to your original payment method within 3-5 business days.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Non-refundable */}
                    <div className="rounded-2xl p-6 border" style={sectionStyle}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={headingStyle}>
                            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                                <svg className="w-4 h-4" fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </span>
                            Non-Refundable Cases
                        </h2>
                        <ul className="space-y-2" style={textStyle}>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#ef4444" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Change of mind after batch cutoff (except during cooling-off period)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#ef4444" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Items marked &quot;Final Sale&quot; or &quot;Non-Refundable&quot;</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#ef4444" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Damage reported more than 48 hours after delivery</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Need Help */}
                <div className="mt-12 text-center p-8 rounded-2xl" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fdf2f8' }}>
                    <h3 className="text-xl font-bold mb-2" style={headingStyle}>
                        Need Help with a Refund?
                    </h3>
                    <p className="mb-4" style={textStyle}>
                        Our support team is here to assist you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                            style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                        >
                            Contact Support
                        </Link>
                        <Link
                            href="/faq"
                            className="inline-block px-6 py-3 rounded-xl font-semibold"
                            style={{
                                backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb',
                                color: headingStyle.color
                            }}
                        >
                            View FAQ
                        </Link>
                    </div>
                </div>

                {/* Last Updated */}
                <p className="text-center text-sm mt-8" style={textStyle}>
                    Last updated: December 2024
                </p>
            </div>
        </div>
    );
}
