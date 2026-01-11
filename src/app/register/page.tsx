/**
 * London's Imports - Registration Page
 * Redesigned to match the premium, editorial aesthetic
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '', // Initialize to avoid controlled/uncontrolled issues
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Auto-set username to email
            await register({
                ...formData,
                username: formData.email
            });
            router.push('/');
        } catch (error: unknown) {
            console.error('Registration Error:', error);
            const err = error as { response?: { data?: Record<string, string | string[]> }, message?: string };
            const errors = err.response?.data;
            if (errors) {
                const firstKey = Object.keys(errors)[0];
                const firstError = errors[firstKey];
                const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
                // capitalization
                const fieldName = firstKey.charAt(0).toUpperCase() + firstKey.slice(1).replace('_', ' ');
                setError(`${fieldName}: ${message}`);
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 md:px-6">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Create Account</h1>
                    <p className="text-gray-500 font-light text-sm">Join London&apos;s Imports to start shopping</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                            </div>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="block w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light text-sm"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                            </div>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="block w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light text-sm"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>



                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                            placeholder="Phone Number (0XX XXX XXXX)"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                                placeholder="Password (min. 8 chars)"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1} />
                            </div>
                            <input
                                type="password"
                                name="password_confirm"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-colors bg-white placeholder-gray-400 font-light"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl active:scale-[0.98] mt-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-light text-gray-500">
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className="text-gray-900 font-medium hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                    <p className="mt-3">
                        Want to sell?{' '}
                        <Link href="/register/vendor" className="text-gray-900 font-medium hover:underline underline-offset-4">
                            Register as vendor
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
