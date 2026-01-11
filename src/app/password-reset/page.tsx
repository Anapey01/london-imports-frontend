/**
 * London's Imports - Password Reset Request Page
 * Premium, editorial aesthetic
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/auth/password/reset/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'If an account exists with this email, a reset link has been sent.');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setError('Failed to connect. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 md:px-6">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Reset Password</h1>
                    <p className="text-gray-500 font-light text-sm">Enter your email to receive a reset link</p>
                </div>

                {message ? (
                    <div className="text-center space-y-6">
                        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 rounded-lg text-sm font-light">
                            {message}
                        </div>
                        <p className="text-gray-500 font-light text-sm">
                            Check your inbox and spam folder for the reset link.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-gray-900 font-medium hover:underline underline-offset-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                                {error}
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                                placeholder="Email Address"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}

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
