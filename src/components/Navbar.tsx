/**
 * London's Imports - Navbar Component
 * Hardened for WCAG 'Robust' Compliance (4.1.2 & 4.1.3)
 */
'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [, startTransition] = useTransition();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch categories client-side using React Query
    const { data: categoriesData } = useQuery({
        queryKey: ['product-categories'],
        queryFn: async () => {
            const res = await productsAPI.categories();
            return res.data?.results || res.data || [];
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
    
    // Safety check for hydration: render list only after mount and ensure it is an array
    const categories = (mounted && Array.isArray(categoriesData)) ? categoriesData : [];

    const handleCategoryChange = (categorySlug: string, isMobile = false) => {
        setSelectedCategory(categorySlug);
        
        let query = '';
        if (typeof window !== 'undefined') {
            const inputs = document.querySelectorAll('input[name="search"]') as NodeListOf<HTMLInputElement>;
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                const isDesktopForm = input.closest('.hidden.md\\:flex') !== null;
                const isMobileForm = input.closest('.md\\:hidden') !== null;
                if ((isMobile && isMobileForm) || (!isMobile && isDesktopForm)) {
                    query = input.value.trim();
                    break;
                }
            }
        }
        
        const params: string[] = [];
        if (query) {
            params.push(`search=${encodeURIComponent(query)}`);
        }
        if (categorySlug) {
            params.push(`category=${encodeURIComponent(categorySlug)}`);
        }
        
        startTransition(() => {
            router.push(`/products${params.length > 0 ? `?${params.join('&')}` : ''}`);
        });
    };

    // Sync selectedCategory state with URL category parameter
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '');
    }, [searchParams]);

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
            <nav className={`w-full sticky top-0 z-40 transition-all duration-500 border-b ${isScrolled ? 'bg-surface/90 backdrop-blur-md border-border-standard' : 'bg-surface border-transparent'}`}>
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
                                <div className="relative flex items-center shrink-0 -ml-1 -my-1 self-stretch rounded-l-full border-r border-border-standard/80">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="h-full flex items-center gap-2 pl-6 pr-8 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-xs font-bold text-content-secondary hover:text-content-primary transition-all duration-200 rounded-l-full outline-none select-none min-w-[125px] max-w-[160px] justify-between"
                                        aria-haspopup="listbox"
                                        aria-expanded={isDropdownOpen}
                                    >
                                        <span className="truncate max-w-[95px]">
                                            {selectedCategory ? (categories.find(c => c.slug === selectedCategory)?.name || 'Category') : 'All Categories'}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-content-secondary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'opacity-60'}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40 cursor-default" 
                                                onClick={() => setIsDropdownOpen(false)}
                                            />
                                            <div 
                                                className="absolute top-[calc(100%+8px)] left-0 w-64 bg-surface dark:bg-slate-950 border border-border-standard rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2.5 z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200"
                                                role="listbox"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleCategoryChange('');
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 flex items-center justify-between ${
                                                        !selectedCategory
                                                            ? 'bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 dark:text-emerald-400 font-bold'
                                                            : 'text-content-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-content-primary'
                                                    }`}
                                                    role="option"
                                                    aria-selected={!selectedCategory}
                                                >
                                                    <span>All Categories</span>
                                                    {!selectedCategory && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald dark:bg-emerald-400" />
                                                    )}
                                                </button>
                                                {categories.map((cat: any) => (
                                                    <button
                                                        key={cat.id || cat.slug}
                                                        type="button"
                                                        onClick={() => {
                                                            handleCategoryChange(cat.slug);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 flex items-center justify-between ${
                                                            selectedCategory === cat.slug
                                                                ? 'bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 dark:text-emerald-400 font-bold'
                                                                : 'text-content-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-content-primary'
                                                        }`}
                                                        role="option"
                                                        aria-selected={selectedCategory === cat.slug}
                                                    >
                                                        <span>{cat.name}</span>
                                                        {selectedCategory === cat.slug && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald dark:bg-emerald-400" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex-1 flex items-center pl-3 pr-2 min-w-0">
                                    <Search className="w-4 h-4 text-content-secondary mr-3 opacity-50 shrink-0" strokeWidth={1.5} />
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="Search products, brands and categories"
                                        className="w-full min-w-0 flex-1 bg-transparent border-none outline-none text-sm font-medium text-content-primary placeholder:text-content-secondary/30 py-1"
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
                            className="w-full relative flex items-center bg-slate-50 dark:bg-slate-900 border border-border-standard rounded-full p-1 focus-within:border-content-primary transition-all"
                        >
                            {/* Mobile Category Dropdown */}
                            <div className="relative flex items-center shrink-0 bg-slate-100 dark:bg-slate-800/80 pl-4 pr-2 -ml-1 -my-1 self-stretch rounded-l-full border-r border-border-standard/80">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value, true)}
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

                            <div className="flex-grow flex items-center pl-3 pr-2 py-0.5 min-w-0">
                                <Search className="w-3.5 h-3.5 text-content-secondary mr-2 opacity-50 shrink-0" strokeWidth={1.5} />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full min-w-0 flex-grow bg-transparent border-none outline-none text-xs font-medium text-content-primary placeholder:text-content-secondary/40 py-0.5"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="bg-slate-950 dark:bg-slate-800 text-white dark:text-white px-5 -mr-1 -my-1 self-stretch rounded-r-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-brand-emerald transition-all active:scale-95 border-l border-border-standard/80 shrink-0 flex items-center justify-center"
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
