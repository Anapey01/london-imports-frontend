/**
 * London's Imports - Navbar Component
 * Hardened for WCAG 'Robust' Compliance (4.1.2 & 4.1.3)
 */
'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { Search, Menu, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import MobileMenuDrawer from './MobileMenuDrawer';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [, startTransition] = useTransition();
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch categories client-side using React Query
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await productsAPI.categories();
            return res.data?.results || res.data || [];
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
    
    // Safety check for hydration: render list only after mount and ensure it is an array
    const categories = (mounted && Array.isArray(categoriesData)) ? categoriesData : [];

    // Sync selectedCategory state with URL category parameter on path change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setSelectedCategory(params.get('category') || '');
        }
    }, [pathname]);

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated) {
            fetchCart();
        }

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY > 10;
                    setIsScrolled(prev => prev !== scrolled ? scrolled : prev);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
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
            <nav className={`sticky top-0 z-40 transition-all duration-500 border-b will-change-transform ${isScrolled ? 'bg-surface/90 backdrop-blur-md border-border-standard' : 'bg-surface border-transparent'}`}>
                <div className="max-w-[1800px] mx-auto px-4 md:px-12">
                    {/* Tier 1: Logo & Actions */}
                    <div className="flex justify-between items-center h-16 md:h-24 gap-4 md:gap-12">
                        {/* Left Group: Brand & Index */}
                        <div className="flex items-center gap-8 md:gap-16 shrink-0">
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
                                onClick={() => {
                                    startTransition(() => {
                                        setMobileMenuOpen(true);
                                    });
                                }}
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
                                    const query = (form.elements.namedItem('search') as HTMLInputElement).value.trim();
                                    
                                    const params: string[] = [];
                                    if (query) {
                                        params.push(`search=${encodeURIComponent(query)}`);
                                    }
                                    if (selectedCategory) {
                                        params.push(`category=${encodeURIComponent(selectedCategory)}`);
                                    }
                                    
                                    startTransition(() => {
                                        router.push(`/products${params.length > 0 ? `?${params.join('&')}` : ''}`);
                                    });
                                }}
                                className="relative flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-border-standard rounded-full p-1 focus-within:border-content-primary focus-within:bg-surface transition-all group"
                            >
                                {/* Desktop Category Dropdown */}
                                <div className="relative flex items-center shrink-0 bg-slate-100 dark:bg-slate-800/80 pl-6 pr-3 -ml-1 -my-1 self-stretch rounded-l-full border-r border-border-standard/80">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-transparent text-xs font-bold text-content-secondary hover:text-content-primary cursor-pointer pr-5 outline-none border-none appearance-none max-w-[140px] truncate"
                                        aria-label="Filter by category"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat.id || cat.slug} value={cat.slug} className="dark:bg-slate-900 dark:text-white">
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 pointer-events-none text-content-secondary opacity-60">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center pl-3 pr-2">
                                    <Search className="w-4 h-4 text-content-secondary mr-3 opacity-50" strokeWidth={1.5} />
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="Search products, brands and categories"
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-content-primary placeholder:text-content-secondary/30 py-1"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-slate-950 dark:bg-slate-800 text-white dark:text-white px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-brand-emerald transition-all active:scale-95 border border-transparent dark:border-slate-700 shrink-0"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Group: Personal Actions */}
                        <div className="flex items-center gap-6 md:gap-10 shrink-0">
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
                                    onClick={() => {
                                        startTransition(() => {
                                            setMobileMenuOpen(true);
                                        });
                                    }}
                                    className="md:hidden w-10 h-10 flex items-center justify-center text-content-primary"
                                    aria-label="Open Mobile Menu"
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
                                const query = (form.elements.namedItem('search') as HTMLInputElement).value.trim();
                                
                                const params: string[] = [];
                                if (query) {
                                    params.push(`search=${encodeURIComponent(query)}`);
                                }
                                if (selectedCategory) {
                                    params.push(`category=${encodeURIComponent(selectedCategory)}`);
                                }
                                
                                startTransition(() => {
                                    router.push(`/products${params.length > 0 ? `?${params.join('&')}` : ''}`);
                                });
                            }}
                            className="relative flex items-center bg-slate-50 dark:bg-slate-900 border border-border-standard rounded-full p-1 focus-within:border-content-primary transition-all"
                        >
                            {/* Mobile Category Dropdown */}
                            <div className="relative flex items-center shrink-0 bg-slate-100 dark:bg-slate-800/80 pl-4 pr-2 -ml-1 -my-1 self-stretch rounded-l-full border-r border-border-standard/80">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-content-secondary hover:text-content-primary cursor-pointer pr-4 outline-none border-none appearance-none max-w-[80px] truncate"
                                    aria-label="Filter by category"
                                >
                                    <option value="">All</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id || cat.slug} value={cat.slug} className="dark:bg-slate-900 dark:text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 pointer-events-none text-content-secondary opacity-60">
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>

                            <div className="flex-grow flex items-center pl-2.5 pr-1 py-0.5">
                                <Search className="w-3.5 h-3.5 text-content-secondary mr-2 opacity-50" strokeWidth={1.5} />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search products..."
                                    className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-content-primary placeholder:text-content-secondary/40 py-0.5"
                                />
                                <button 
                                    type="submit"
                                    className="bg-slate-950 dark:bg-slate-800 text-white dark:text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-brand-emerald transition-all active:scale-95 border border-transparent dark:border-slate-700 shrink-0"
                                >
                                    Search
                                </button>
                            </div>
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
