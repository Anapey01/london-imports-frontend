/**
 * London's Imports - Password Reset Confirm Page
 * Premium, editorial aesthetic
 */
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';

import { authAPI } from '@/lib/api';

// API_URL is handled internally by authAPI

function ResetForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            // Using centralized API client to ensure correct Base URL and Headers
            await authAPI.confirmPasswordReset({
                uid,
                token,
                new_password: password,
                confirm_password: confirmPassword
            });

            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            console.error('Password Reset Error:', err);
            const errorMessage = err.response?.data?.error ||
                'Failed to reset password. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!uid || !token) {
        return (
            <div className="text-center space-y-4">
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-4 rounded-lg text-sm font-light">
                    Invalid reset link. Please request a new password reset.
                </div>
                <Link
                    href="/password-reset"
                    className="inline-flex items-center gap-2 text-gray-900 font-medium hover:underline underline-offset-4"
                >
                    Request New Link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-light text-gray-900 tracking-tight">Password Reset!</h2>
                <p className="text-gray-500 font-light text-sm">
                    Your password has been successfully changed. Redirecting to login...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                        placeholder="New Password (min. 8 chars)"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                    </div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                        placeholder="Confirm New Password"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Resetting...</span>
                    </>
                ) : (
                    <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

export default function PasswordResetConfirmPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 md:px-6">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">New Password</h1>
                    <p className="text-gray-500 font-light text-sm">Enter your new password below</p>
                </div>

                <Suspense fallback={<div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl" />}>
                    <ResetForm />
                </Suspense>

                <div className="mt-8 text-center text-sm font-light text-gray-500">
                    Remember your password?{' '}
                    <Link href="/login" className="text-gray-900 font-medium hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
