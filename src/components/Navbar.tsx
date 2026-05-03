/**
 * London's Imports - Navbar Component
 * Hardened for WCAG 'Robust' Compliance (4.1.2 & 4.1.3)
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { trackViewSearchResults } from '@/lib/analytics';
import { Search, Menu, Heart, User, UserPlus, Zap, ShoppingBag } from 'lucide-react';

// Lazy load heavy interactive components
const SearchModal = dynamic(() => import('./SearchModal'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));

export default function Navbar() {
    const { isAuthenticated, user } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const wishlistItems = useWishlistStore(state => state.items);
    const { isSearchModalOpen, isMobileMenuOpen, setSearchModalOpen, setMobileMenuOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 100);
        // Only fetch cart if user is authenticated — avoids a 401 on every guest page load
        if (isAuthenticated) {
            fetchCart();
        }
        return () => clearTimeout(timer);
    }, [fetchCart, isAuthenticated]);

    if (!mounted) {
        return (
            <nav className="border-b sticky top-0 z-40 bg-white border-slate-50">
                <div className="h-14 md:h-20 w-full flex items-center px-4 max-w-7xl mx-auto">
                    {/* Placeholder content to hold height */}
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-slate-50 dark:border-slate-900 transition-all duration-500">
                {/* 1. ATELIER HEADER (Desktop) */}
                <div className="hidden md:block max-w-[1800px] mx-auto px-12">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* Left: Navigation Core */}
                        <div className="flex items-center gap-12">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex items-center gap-4 group uppercase tracking-[0.4em] text-[9px] font-black text-content-secondary hover:text-content-primary transition-all"
                            >
                                <Menu className="w-4 h-4" strokeWidth={1} />
                                <span>Index</span>
                            </button>

                            <button 
                                onClick={() => setSearchModalOpen(true)}
                                className="flex items-center gap-4 group uppercase tracking-[0.4em] text-[9px] font-black text-content-secondary hover:text-content-primary transition-all"
                            >
                                <Search className="w-4 h-4" strokeWidth={1} />
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Middle: Brand Signature (Centered) */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Link href="/" className="flex flex-col items-center group">
                                <span className="text-xl font-serif font-atelier tracking-[-0.05em] text-content-primary group-hover:italic transition-all duration-700">
                                    London&apos;s Imports
                                </span>
                            </Link>
                        </div>

                        {/* Right: Personal & Cart */}
                        <div className="flex items-center gap-12">
                            <ThemeToggle />

                            <Link href={isAuthenticated ? "/profile" : "/login"} className="group flex items-center gap-3 uppercase tracking-[0.4em] text-[9px] font-black text-content-secondary hover:text-content-primary transition-all">
                                <span>{isAuthenticated ? (user?.first_name || 'Profile') : 'Sign In'}</span>
                                <User className="w-4 h-4" strokeWidth={1} />
                            </Link>

                            <Link href="/cart" className="group flex items-center gap-3 uppercase tracking-[0.4em] text-[9px] font-black text-content-secondary hover:text-content-primary transition-all">
                                <div className="relative">
                                    <ShoppingBag className="w-4 h-4" strokeWidth={1} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 text-[8px] font-black text-brand-emerald">{itemCount}</span>
                                    )}
                                </div>
                                <span className="hidden xl:block">Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. MOBILE HEADER */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between px-6 h-20">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-content-primary"
                        >
                            <Menu className="w-5 h-5" strokeWidth={1} />
                        </button>

                        <Link href="/" className="font-serif font-atelier text-lg tracking-tighter">
                            London&apos;s
                        </Link>

                        <button
                            onClick={() => setSearchModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-content-primary"
                        >
                            <Search className="w-5 h-5" strokeWidth={1} />
                        </button>
                    </div>
                </div>

                {/* Search Modal Protocol */}
                <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />
            </nav>

            {/* Mobile Menu */}
            <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
