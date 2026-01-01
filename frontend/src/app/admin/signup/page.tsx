/**
 * London's Imports - Admin Signup
 * Secure registration for new administrators
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AdminSignupPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        secret_key: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authAPI.registerAdmin(formData);
            toast.success('Admin account created! Please login.');
            router.push('/admin/login');
        } catch (err: any) {
            // Check for specific error messages from backend
            if (err.response?.status === 403) {
                setError('Invalid secret key. Authorization required.');
            } else {
                setError(err.response?.data?.detail || err.response?.data?.message || 'Registration failed');
            }
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Admin Registration
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Create a new administrator account
                    </p>
                </div>

                {/* Signup Form */}
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                    placeholder="jdoe"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Secret Key
                                </label>
                                <input
                                    type="password"
                                    value={formData.secret_key}
                                    onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                                    required
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                    placeholder="••••••"
                                />
                            </div>
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
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={formData.password_confirm}
                                onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                                required
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                placeholder="Confirm password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Admin Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link
                            href="/admin/login"
                            className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
