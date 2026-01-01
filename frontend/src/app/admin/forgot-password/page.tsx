/**
 * London's Imports - Forgot Password
 * Request password reset
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await authAPI.requestPasswordReset({ email });
            setStatus('success');
            setMessage('If an account exists with this email, a reset link has been sent. Please check your inbox (or console if running locally).');
        } catch (err: any) {
            setStatus('error');
            setMessage('Failed to process request. Please try again.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
        >
            <div className={`w-full max-w-md`}>
                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Reset Password
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Enter your email to receive recovery instructions
                    </p>
                </div>

                <div className={`rounded-2xl border p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} shadow-xl`}>
                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                {message}
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-block px-6 py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                            >
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {status === 'error' && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors ${isDark
                                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-pink-500'
                                        } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                    placeholder="Enter your registered email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    {status !== 'success' && (
                        <div className="text-center mt-6">
                            <Link
                                href="/admin/login"
                                className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
