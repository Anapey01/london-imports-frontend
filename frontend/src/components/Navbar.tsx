/**
 * London's Imports - Navbar Component
 * Shows cart count, auth status, mobile-friendly
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import MobileMenuDrawer from './MobileMenuDrawer';
import { useTheme } from '@/providers/ThemeProvider';
import { Search, Menu } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    if (!mounted) return null;

    return (
        <>
            <nav className="border-b sticky top-0 z-40" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {/* Desktop Navbar */}
                <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/logo.jpg"
                                    alt="London's Imports"
                                    width={50}
                                    height={50}
                                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg"
                                    priority
                                />
                                <div>
                                    <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                                        London&apos;s
                                    </span>
                                    <span className="text-base sm:text-xl font-bold ml-1" style={{ color: theme === 'dark' ? '#f8fafc' : '#1f2937' }}>Imports</span>
                                </div>
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation Links */}
                        <div className="flex items-center justify-center flex-1 mx-8">
                            <div className="flex items-center space-x-8">
                                <Link href="/products" className="text-gray-900 hover:text-pink-600 font-bold transition-colors">
                                    Pre-orders
                                </Link>
                                <Link href="/how-it-works" className="text-gray-900 hover:text-pink-600 font-bold transition-colors">
                                    How It Works
                                </Link>
                                <Link href="/about" className="text-gray-900 hover:text-pink-600 font-bold transition-colors">
                                    About Us
                                </Link>
                            </div>
                        </div>

                        {/* Right: Icons (Theme, Search, User, Cart) */}
                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Search Icon */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-gray-900 hover:text-pink-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* User Icon / Auth */}
                            {isAuthenticated ? (
                                <div className="relative group">
                                    <Link href="/profile" className="text-gray-900 hover:text-pink-600 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="px-4 py-2 border-b border-gray-50 text-sm font-bold text-gray-900">{user?.first_name}</div>
                                        <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Orders</Link>
                                        <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
                                        {user?.role === 'VENDOR' && (
                                            <Link href="/vendor" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Vendor Dashboard</Link>
                                        )}
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-gray-900 hover:text-pink-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <Link href="/cart" className="relative text-gray-900 hover:text-pink-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar - Clean Style */}
                <div className="md:hidden">
                    {/* Single Row: Menu + Logo + Search */}
                    <div className="flex items-center justify-between px-4 h-14">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-700"
                        >
                            <Menu className="w-7 h-7" />
                        </button>

                        {/* Centered Logo */}
                        <Link href="/" className="flex items-center gap-1.5">
                            <Image
                                src="/logo.jpg"
                                alt="London's Imports"
                                width={36}
                                height={36}
                                className="rounded-lg"
                                priority
                            />
                            <span className="text-lg font-bold">
                                <span className="text-pink-500">London&apos;s</span>
                                <span className="text-gray-800"> Imports</span>
                            </span>
                        </Link>

                        {/* Search Icon */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 -mr-2 text-gray-700"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Search Modal */}
                <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </nav>

            {/* Mobile Menu Drawer */}
            <MobileMenuDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
