/**
 * London's Imports - Admin Login Page
 * Dedicated login portal for administrators
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminLoginPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Login
            const loginResponse = await authAPI.login(formData);
            const { access, refresh } = loginResponse.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Check if user is admin
            const userResponse = await authAPI.me();
            const userData = userResponse.data;

            if (userData.role !== 'ADMIN' && !userData.is_staff && !userData.is_superuser) {
                // Not an admin - clear tokens and show error
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setError('Access denied. This login is for administrators only.');
                setLoading(false);
                return;
            }

            // Success - redirect to admin dashboard
            router.push('/dashboard/admin');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
        >
            <div className={`w-full max-w-md`}>
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Admin Portal
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        London's Imports Management
                    </p>
                </div>

                {/* Login Form */}
                <div className={`rounded-2xl border p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} shadow-xl`}>
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-500 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-pink-500'
                                    } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-pink-500'
                                    } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In to Admin'
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className={`mt-6 p-3 rounded-lg text-center ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                        <p className={`text-xs flex items-center justify-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure admin portal. Unauthorized access attempts are logged.
                        </p>
                    </div>
                </div>

                {/* Back to Main Site */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                    >
                        ← Back to main site
                    </Link>
                </div>
            </div>
        </div>
    );
}
