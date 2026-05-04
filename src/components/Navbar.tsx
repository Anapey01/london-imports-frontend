/**
 * London's Imports - Navbar Component
 * Hardened for WCAG 'Robust' Compliance (4.1.2 & 4.1.3)
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Search, Menu, User, ShoppingBag } from 'lucide-react';

// Lazy load heavy interactive components
const SearchModal = dynamic(() => import('./SearchModal'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const { isSearchModalOpen, isMobileMenuOpen, setMobileMenuOpen, setSearchModalOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated) {
            fetchCart();
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchCart, isAuthenticated]);

    // Shell matches for SSR stability
    const authText = mounted && isAuthenticated ? (user?.first_name || 'Profile') : 'Sign In';
    const authLink = mounted && isAuthenticated ? "/profile" : "/login";

    // Determine if mobile search should be shown
    const isHomePage = pathname === '/';
    const isShopPage = pathname?.startsWith('/products');
    const showMobileSearch = isHomePage || isShopPage;

    return (
        <>
            <nav className={`sticky top-0 z-40 transition-all duration-500 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-slate-100 dark:border-slate-800' : 'bg-white border-transparent'}`}>
                <div className="max-w-[1800px] mx-auto px-4 md:px-12">
                    {/* Tier 1: Logo & Actions */}
                    <div className="flex justify-between items-center h-16 md:h-24 gap-4 md:gap-12">
                        {/* Left Group: Brand & Index */}
                        <div className="flex items-center gap-8 md:gap-16 flex-shrink-0">
                            <Link href="/" className="flex items-center gap-4 group">
                                <div className="relative w-9 h-9 md:w-11 md:h-11 border border-content-primary overflow-hidden bg-slate-50 dark:bg-slate-900">
                                    <Image
                                        src="/logo.jpg"
                                        alt="London's Imports"
                                        fill
                                        sizes="(max-width: 768px) 36px, 44px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-content-primary group-hover:italic transition-all duration-700">
                                        LONDON&apos;S
                                    </span>
                                    <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase text-brand-emerald italic">Imports</span>
                                </div>
                            </Link>

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="hidden lg:flex items-center gap-3 group uppercase tracking-[0.4em] text-[10px] font-black text-content-secondary hover:text-content-primary transition-all"
                            >
                                <Menu className="w-4 h-4" strokeWidth={1} />
                                <span>Index</span>
                            </button>
                        </div>

                        {/* Center Group: Search (Dominant) */}
                        <div className="hidden md:flex flex-1 max-w-3xl">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const query = (form.elements.namedItem('search') as HTMLInputElement).value;
                                    if (query.trim().length >= 2) {
                                        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                                    }
                                }}
                                className="relative flex items-center w-full bg-slate-50 dark:bg-white/5 border border-border-standard rounded-full px-8 py-2.5 focus-within:border-content-primary focus-within:bg-white transition-all group"
                            >
                                <Search className="w-4 h-4 text-content-secondary mr-4 opacity-50" strokeWidth={1.5} />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search products, brands and categories"
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-content-primary placeholder:text-content-secondary/30 py-1"
                                />
                                <button 
                                    type="submit"
                                    className="bg-content-primary text-white px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-brand-emerald transition-all active:scale-95"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Right Group: Personal Actions */}
                        <div className="flex items-center gap-6 md:gap-10 flex-shrink-0">
                            <div className="flex items-center gap-6 md:gap-10">
                                <Link href={authLink} className="hidden md:flex items-center gap-3 group uppercase tracking-[0.4em] text-[10px] font-black text-content-secondary hover:text-content-primary transition-all">
                                    <User className="w-4 h-4" strokeWidth={1} />
                                    <span className="hidden xl:block">{authText}</span>
                                </Link>

                                <Link href="/cart" className="hidden md:flex items-center gap-3 relative group uppercase tracking-[0.4em] text-[10px] font-black text-content-secondary hover:text-content-primary transition-all">
                                    <div className="relative">
                                        <ShoppingBag className="w-4 h-4" strokeWidth={1} />
                                        {mounted && itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1.5 bg-brand-emerald text-white text-[7px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
                                                {itemCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden xl:block">Cart</span>
                                </Link>

                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="md:hidden w-10 h-10 flex items-center justify-center text-content-primary"
                                >
                                    <Menu className="w-6 h-6" strokeWidth={1} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tier 2: Mobile Search (Visible only on mobile and specific pages) */}
                    {showMobileSearch && (
                        <div className="md:hidden pb-4">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const query = (form.elements.namedItem('search') as HTMLInputElement).value;
                                if (query.trim().length >= 2) {
                                    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                                }
                            }}
                            className="relative flex items-center bg-slate-50 border border-border-standard rounded-full px-5 py-1.5 focus-within:border-content-primary transition-all"
                        >
                            <Search className="w-4 h-4 text-content-secondary mr-3 opacity-50" strokeWidth={1.5} />
                            <input
                                name="search"
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-content-primary placeholder:text-content-secondary/40 py-1"
                            />
                            <button 
                                type="submit"
                                className="bg-content-primary text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
