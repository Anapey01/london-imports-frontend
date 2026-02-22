/**
 * London's Imports - Login Page
 */
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const role = searchParams.get('role'); // 'vendor' | 'partner' | 'admin'
    const emailParam = searchParams.get('email');
    const isRegistered = searchParams.get('registered') === 'true';

    const { login, isLoading } = useAuthStore();
    const [username, setUsername] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(isRegistered ? 'Registration successful! Please sign in with your account.' : '');

    const getTitle = () => {
        switch (role) {
            case 'vendor': return 'Seller Portal';
            case 'partner': return 'Partner Portal';
            case 'admin': return 'Admin Dashboard';
            default: return 'Welcome Back';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await login(username, password);
            router.push(redirect);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string } }, message?: string };
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">{getTitle()}</h1>
                <p className="text-gray-500 font-light text-sm">
                    {role ? `Sign in to manage your ${role} account` : 'Please sign in to your account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                    <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-light flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4" />
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" strokeWidth={1} />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full pl-8 pr-3 py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all placeholder-gray-400 font-light"
                            placeholder="Username or Email"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" strokeWidth={1} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full pl-8 pr-3 py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all placeholder-gray-400 font-light"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Link href="/password-reset" className="text-xs text-gray-500 hover:text-gray-900 font-light underline-offset-4 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm font-light text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-gray-900 font-medium hover:underline underline-offset-4">
                    Create one
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 md:px-6">
            <Suspense fallback={<div className="w-full max-w-sm mx-auto h-96 bg-gray-100 animate-pulse rounded-2xl" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
