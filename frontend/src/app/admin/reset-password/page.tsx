/**
 * London's Imports - Reset Password Confirm
 * Confirm new password with token
 */
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDark = theme === 'dark';

    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!uid || !token) {
            setError('Invalid reset link. Missing required parameters.');
        }
    }, [uid, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.new_password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        if (!uid || !token) {
            setError('Invalid link parameters');
            return;
        }

        setLoading(true);

        try {
            await authAPI.confirmPasswordReset({
                uid,
                token,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password
            });
            setSuccess(true);
            toast.success('Password reset successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Success!</h2>
                <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Your password has been reset successfully. You can now login with your new password.
                </p>
                <Link
                    href="/admin/login"
                    className="inline-block px-6 py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                >
                    Return to Login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                    {error}
                </div>
            )}

            <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    New Password
                </label>
                <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    required
                    minLength={8}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-pink-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Enter new password"
                />
            </div>

            <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    required
                    minLength={8}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-pink-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Confirm new password"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !!error} // Disable if error (like missing token)
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Resetting...' : 'Set New Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
        >
            <div className={`w-full max-w-md`}>
                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Set New Password
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Enter your new password below
                    </p>
                </div>

                <div className={`rounded-2xl border p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} shadow-xl`}>
                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
