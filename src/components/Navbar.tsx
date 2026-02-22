/**
 * London's Imports - Navbar Component
 * Shows cart count, auth status, mobile-friendly
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic'; // Added dynamic import
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';
// Lazy load heavy interactive components
const SearchModal = dynamic(() => import('./SearchModal'));
const SidebarMenu = dynamic(() => import('./SidebarMenu'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));
const MegaMenu = dynamic(() => import('./MegaMenu'));

import ThemeToggle from './ThemeToggle';
import { Search, Menu, Heart, ChevronDown } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    // const { theme } = useTheme();
    const wishlistItems = useWishlistStore(state => state.items);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Desktop Sidebar
    const [searchOpen, setSearchOpen] = useState(false);
    const [isHoveringMenu, setIsHoveringMenu] = useState(false);

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
            <nav className="border-b sticky top-0 z-40 bg-white border-gray-200">
                <div className="h-14 md:h-20 w-full flex items-center px-4 max-w-7xl mx-auto">
                    {/* Placeholder content to hold height */}
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="border-b sticky top-0 z-40 navbar-themed">
                {/* Desktop Navbar */}
                <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* LEFT: Menu Toggle + Logo */}
                        <div className="flex-shrink-0 flex items-center gap-6">
                            {/* Categories / MegaMenu Trigger */}
                            <div
                                className="relative py-4"
                                onMouseEnter={() => setIsHoveringMenu(true)}
                                onMouseLeave={() => setIsHoveringMenu(false)}
                            >
                                <button
                                    className={`p-2.5 -ml-2 rounded-xl transition-all flex items-center gap-2 focus:outline-none ${isHoveringMenu
                                        ? 'bg-pink-50 text-pink-600 ring-2 ring-pink-100'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-pink-600'
                                        }`}
                                    aria-label="Toggle categories menu"
                                >
                                    <Menu className="w-6 h-6" strokeWidth={2.5} />
                                    <span className="text-sm font-black uppercase tracking-wider hidden lg:inline">Categories</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isHoveringMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* MEGA MENU COMPONENT */}
                                <div
                                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[100vw] transition-all duration-300 origin-top overflow-visible ${isHoveringMenu
                                        ? 'opacity-100 translate-y-0 visible'
                                        : 'opacity-0 -translate-y-2 invisible'
                                        }`}
                                >
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1">
                                        <MegaMenu />
                                    </div>
                                </div>
                            </div>

                            <Link href="/" className="flex items-center gap-2 group">
                                <Image
                                    src="/logo.jpg"
                                    alt="London's Imports"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                                    priority
                                />
                                <div className="flex flex-col leading-none">
                                    <span className="text-lg font-black tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                        LONDON&apos;S
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">Imports</span>
                                </div>
                            </Link>
                        </div>

                        {/* MIDDLE: Search Bar (Refined & Subtle) */}
                        <div className="flex-1 max-w-md mx-12">
                            <div className="relative group">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                    if (term) window.location.href = `/products?search=${encodeURIComponent(term)}`;
                                }}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="Search premium imports..."
                                        className="w-full h-10 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-pink-500/30 focus:border-pink-500 transition-all text-sm outline-none text-gray-900 placeholder-gray-400 font-medium"
                                    />
                                </form>
                            </div>
                        </div>



                        {/* RIGHT: User Actions (No Nav Links here anymore) */}
                        <div className="flex items-center gap-6">
                            {/* Nav Links Removed - Moved to Sidebar */}

                            {/* Icons */}
                            <div className="flex items-center gap-4">
                                <ThemeToggle />

                                {/* User / Auth */}
                                {isAuthenticated ? (
                                    <div className="relative group">
                                        <Link href="/profile" className="flex items-center gap-2 text-gray-900 hover:text-pink-600 transition-colors" aria-label="View profile">
                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="hidden xl:inline text-sm font-semibold truncate max-w-[100px]">{user?.first_name}</span>
                                        </Link>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                            <div className="p-2">
                                                <Link href="/orders" className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600">My Orders</Link>
                                                <Link href="/profile" className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600">Profile</Link>
                                                {(user?.role === 'ADMIN' || user?.is_superuser || user?.is_staff) && (
                                                    <Link href="/dashboard/admin" className="block px-4 py-2 rounded-lg text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100">
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button onClick={logout} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/login" className="flex items-center gap-2 text-gray-900 hover:text-pink-600 transition-colors font-semibold text-sm" aria-label="Login">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="hidden xl:inline">Login</span>
                                    </Link>
                                )}

                                {/* Wishlist Icon */}
                                <Link href="/wishlist" className="relative group p-1" aria-label="View wishlist">
                                    <div className="text-gray-900 group-hover:text-pink-600 transition-colors">
                                        <Heart className="w-7 h-7" />
                                    </div>
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Cart Icon */}
                                <Link href="/cart" className="relative group p-1" aria-label="View cart">
                                    <div className="text-gray-900 group-hover:text-pink-600 transition-colors">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar - Professional & Tighter */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between px-4 h-16">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-1.5 text-gray-700 hover:text-pink-600 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Centered Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.jpg"
                                alt="London's Imports"
                                width={32}
                                height={32}
                                className="rounded-lg shadow-sm"
                                priority
                            />
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-black tracking-tight text-gray-900">LONDON&apos;S</span>
                                <span className="text-[10px] font-bold text-pink-600 tracking-[0.2em] uppercase">Imports</span>
                            </div>
                        </Link>

                        {/* Search Icon */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-1.5 text-gray-700 hover:text-pink-600 transition-colors"
                            aria-label="Open search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Modal */}
                <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </nav >

            {/* Desktop Sidebar Menu */}
            < SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)
            } />

            {/* Mobile Menu Drawer */}
            <MobileMenuDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
