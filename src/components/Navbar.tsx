/**
 * London's Imports - Navbar Component
 * Shows cart count, auth status, mobile-friendly
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';

// Lazy load heavy interactive components
const SearchModal = dynamic(() => import('./SearchModal'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));

import ThemeToggle from './ThemeToggle';
import { Search, Menu, Heart, User, UserPlus } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { trackViewSearchResults } from '@/lib/analytics';

export default function Navbar() {
    const { isAuthenticated, user } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const wishlistItems = useWishlistStore(state => state.items);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 100);
        fetchCart();
        return () => clearTimeout(timer);
    }, [fetchCart]);

    // Prevent hydration mismatch but reserve space to avoid CLS
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
            <nav className="border-b sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-slate-200/50 dark:border-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.02)] font-sans transition-all duration-300">
                {/* 1. INSTITUTIONAL HEADER (Desktop) */}
                <div className="hidden md:block max-w-[1600px] mx-auto px-10">
                    <div className="flex justify-between items-center h-24">
                        
                        {/* Menu + Account Links */}
                        <div className="flex items-center gap-10">
                            {/* Menu Trigger (Minimalist) */}
                            <div className="relative py-4">
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className={`flex items-center gap-4 transition-all group ${mobileMenuOpen ? 'italic' : ''}`}
                                    aria-label="Open Menu"
                                >
                                    <div className="w-10 h-10 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-950 dark:group-hover:border-white transition-colors">
                                         <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white" strokeWidth={1} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white">Menu</span>
                                </button>
                            </div>

                            {/* Home Link */}
                            <Link href="/" className="flex items-center gap-6 group">
                                <div className="relative w-12 h-12 border border-slate-900 dark:border-white overflow-hidden">
                                    <Image
                                        src="/logo.jpg"
                                        alt="London's Imports"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-2xl font-serif font-bold tracking-tighter text-slate-900 dark:text-white group-hover:italic transition-all">
                                        LONDON&apos;S
                                    </span>
                                    <span className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-300 dark:text-slate-700 italic">Imports</span>
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
                                className="relative group border-b border-slate-200/60 dark:border-slate-800 focus-within:border-slate-950 dark:focus-within:border-white transition-colors"
                            >
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors" strokeWidth={1} />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full h-12 pl-10 pr-20 bg-transparent text-[10px] font-black uppercase tracking-widest outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-950 dark:text-white"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 hover:text-slate-950 dark:hover:text-white transition-colors"
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
                                <Link href="/profile" className="flex items-center gap-4 group hover:italic transition-all" aria-label="My Account">
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{user?.first_name}</span>
                                        <span className="text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">Account Active</span>
                                    </div>
                                    <div className="w-10 h-10 border border-slate-50 dark:border-slate-900 flex items-center justify-center group-hover:border-slate-900 dark:group-hover:border-white transition-colors">
                                        <User className="w-4 h-4 text-slate-900 dark:text-white" strokeWidth={1.5} />
                                    </div>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-4 group hover:italic transition-all" aria-label="Sign In">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white">Sign In</span>
                                    <div className="w-10 h-10 border border-slate-50 dark:border-slate-900 flex items-center justify-center group-hover:border-slate-900 dark:group-hover:border-white transition-colors">
                                        <UserPlus className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white" strokeWidth={1.5} />
                                    </div>
                                </Link>
                            )}

                            {/* My Basket */}
                            <div className="flex items-center gap-6 border-l border-slate-200/60 dark:border-slate-800 pl-10">
                                <Link href="/wishlist" className="relative group" aria-label="View Saved Items">
                                    <Heart className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors" strokeWidth={1} />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 text-[8px] font-black text-slate-950 dark:text-white">{wishlistItems.length}</span>
                                    )}
                                </Link>
                                <Link href="/cart" className="relative group" aria-label="View My Basket">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            {itemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 text-[8px] font-black text-slate-950 dark:text-white">{itemCount}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white hidden lg:block">Shopping Bag</span>
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
                            <div className="relative w-8 h-8 border border-slate-900 dark:border-white overflow-hidden">
                                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-serif font-bold tracking-tight text-slate-900 dark:text-white">LONDON&apos;S</span>
                                <span className="text-[8px] font-black tracking-[0.2em] uppercase text-emerald-500 italic">Imports</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3 w-20 justify-end">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-10 h-10 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center active:scale-95 transition-all"
                                aria-label="Execute search"
                            >
                                <Search className="w-5 h-5 text-slate-950 dark:text-white" strokeWidth={1} />
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="w-10 h-10 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center active:scale-95 transition-all"
                                aria-label="Open Menu"
                            >
                                <Menu className="w-5 h-5 text-slate-950 dark:text-white" strokeWidth={1} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Modal Protocol */}
                <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </nav>

            {/* Mobile Menu */}
            <MobileMenuDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
