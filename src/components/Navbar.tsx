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
import { Search, Menu, Heart, User, UserPlus } from 'lucide-react';

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
            <nav className="border-b sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md border-border-standard/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.02)] font-sans transition-all duration-300">
                {/* 1. INSTITUTIONAL HEADER (Desktop) */}
                <div className="hidden md:block max-w-[1600px] mx-auto px-10">
                    <div className="flex justify-between items-center h-24">
                        
                        {/* Menu + Account Links */}
                        <div className="flex items-center gap-10">
                            {/* Menu Trigger (Minimalist) */}
                            <div className="relative py-4">
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className={`flex items-center gap-4 transition-all group institutional-focus rounded-lg p-2 -m-2 ${isMobileMenuOpen ? 'italic' : ''}`}
                                    aria-label="Open Menu"
                                    aria-expanded={isMobileMenuOpen}
                                >
                                    <div className="w-10 h-10 border border-border-standard/60 flex items-center justify-center group-hover:border-content-primary transition-colors">
                                         <Menu className="w-5 h-5 text-content-secondary group-hover:text-content-primary" strokeWidth={1} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-content-secondary group-hover:text-content-primary">Menu</span>
                                </button>
                            </div>

                            {/* Home Link */}
                            <Link href="/" className="flex items-center gap-6 group hover:italic transition-all institutional-focus rounded-lg p-2 -m-2">
                                <div className="relative w-12 h-12 border border-content-primary overflow-hidden">
                                    <Image
                                        src="/logo.jpg"
                                        alt="London's Imports"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-2xl font-serif font-bold tracking-tighter text-content-primary group-hover:italic transition-all">
                                        LONDON&apos;S
                                    </span>
                                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-content-secondary italic">Imports</span>
                                </div>
                            </Link>
                        </div>

                        {/* MIDDLE: Search (Minimalist) */}
                        <div className="flex-1 max-w-xl mx-8 xl:mx-20 transition-all duration-300">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                    if (term) {
                                        trackViewSearchResults(term, 0);
                                        window.location.href = `/products?search=${encodeURIComponent(term)}`;
                                    }
                                }}
                                className="relative group border-b border-border-standard/60 focus-within:border-content-primary transition-colors"
                            >
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-content-secondary group-focus-within:text-content-primary transition-colors" strokeWidth={1} />
                                <label htmlFor="nav-search-input" className="sr-only">Search</label>
                                <input
                                    id="nav-search-input"
                                    name="search"
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full h-12 pl-10 pr-20 bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none placeholder:opacity-40 text-content-primary"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-[0.3em] text-content-secondary hover:text-content-primary transition-colors"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: Your Account */}
                        <div className="flex items-center gap-10">
                            <ThemeToggle />

                            {/* My Account */}
                            {isAuthenticated ? (
                                <Link href="/profile" className="flex items-center gap-4 group hover:italic transition-all institutional-focus rounded-lg p-2 -m-2" aria-label="My Account">
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-content-primary">{user?.first_name}</span>
                                        <span className="text-[8px] font-bold text-content-secondary uppercase tracking-widest">Account Active</span>
                                    </div>
                                    <div className="w-10 h-10 border border-border-standard flex items-center justify-center group-hover:border-content-primary transition-colors">
                                        <User className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                    </div>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-4 group hover:italic transition-all institutional-focus rounded-lg p-2 -m-2" aria-label="Sign In">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary">Sign In</span>
                                    <div className="w-10 h-10 border border-border-standard flex items-center justify-center group-hover:border-content-primary transition-colors">
                                        <UserPlus className="w-4 h-4 text-content-secondary hover:text-content-primary" strokeWidth={1.5} />
                                    </div>
                                </Link>
                            )}

                            {/* Admin Command (Staff Only) */}
                            {isAuthenticated && user?.is_staff && (
                                <Link href="/dashboard/admin" className="flex items-center gap-4 group hover:italic transition-all institutional-focus rounded-lg p-2 -m-2" aria-label="Admin Dashboard">
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Admin</span>
                                        <span className="text-[8px] font-bold text-emerald-500/50 uppercase tracking-widest">Command</span>
                                    </div>
                                    <div className="w-10 h-10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500 transition-colors bg-emerald-500/5">
                                        <Zap className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                                    </div>
                                </Link>
                            )}

                            {/* My Basket */}
                            <div className="flex items-center gap-6 border-l border-border-standard/60 pl-10">
                                <Link href="/wishlist" className="relative group institutional-focus rounded-lg p-2 -m-2 transition-all" aria-label="View Saved Items">
                                    <Heart className="w-5 h-5 text-content-secondary group-hover:text-content-primary transition-colors" strokeWidth={1} />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 text-[8px] font-black text-content-primary">{wishlistItems.length}</span>
                                    )}
                                </Link>
                                <Link href="/cart" className="relative group institutional-focus rounded-lg p-2 -m-2 transition-all" aria-label="View My Basket">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-content-secondary group-hover:text-content-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            {itemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 text-[8px] font-black text-content-primary">{itemCount}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-content-primary hidden lg:block">Shopping Bag</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden">
                    <div className="flex items-center justify-between px-6 h-20">
                        {/* Ghost container to balance the right actions and keep logo centered */}
                        <div className="w-20" aria-hidden="true" />

                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-8 h-8 border border-content-primary overflow-hidden">
                                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-serif font-bold tracking-tight text-content-primary">LONDON&apos;S</span>
                                <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-brand-emerald italic">Imports</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3 w-20 justify-end">
                            <button
                                onClick={() => setSearchModalOpen(true)}
                                className="w-11 h-11 border border-border-standard flex items-center justify-center active:scale-95 transition-all institutional-focus"
                                aria-label="Open search modal"
                                aria-expanded={isSearchModalOpen}
                            >
                                <Search className="w-5 h-5 text-content-primary" strokeWidth={1} />
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="w-11 h-11 border border-border-standard flex items-center justify-center active:scale-95 transition-all institutional-focus"
                                aria-label="Open navigation menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <Menu className="w-5 h-5 text-content-primary" strokeWidth={1} />
                            </button>
                        </div>
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
