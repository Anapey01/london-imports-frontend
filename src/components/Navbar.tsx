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
import SidebarMenu from './SidebarMenu';
import MobileMenuDrawer from './MobileMenuDrawer';
import { Search, Menu, Heart } from 'lucide-react';
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
                            {/* Desktop Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700 hover:text-pink-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                                aria-label="Open menu"
                            >
                                <Menu className="w-7 h-7" />
                                <span className="text-sm font-bold hidden xl:inline">Menu</span>
                            </button>

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
                                    <span className="text-base sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                        London&apos;s
                                    </span>
                                    <span className="text-base sm:text-2xl font-bold ml-1 text-gray-800">Imports</span>
                                </div>
                            </Link>
                        </div>

                        {/* MIDDLE: Search Bar */}
                        <div className="flex-1 max-w-xl mx-8">
                            <div className="relative">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                    if (term) window.location.href = `/products?search=${encodeURIComponent(term)}`;
                                }}>
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full h-11 pl-5 pr-12 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm outline-none text-gray-900 placeholder-gray-500"
                                    />
                                    <button type="submit" className="absolute right-1 top-1 h-9 w-9 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500" aria-label="Search">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* MID-RIGHT: Marketplace Link */}
                        <div className="hidden lg:flex items-center mr-6">
                            <a href="https://market.londonsimports.com" className="bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                                <span>🏪</span>
                                <span>Marketplace</span>
                            </a>
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

                {/* Mobile Navbar - Clean Style */}
                <div className="md:hidden">
                    {/* Single Row: Menu + Logo + Search */}
                    <div className="flex items-center justify-between px-4 h-14">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-700"
                            aria-label="Open menu"
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
                                <span className="text-pink-600">London&apos;s</span>
                                <span className="text-gray-800"> Imports</span>
                            </span>
                        </Link>

                        {/* Search Icon */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 -mr-2 text-gray-700"
                            aria-label="Open search"
                        >
                            <Search className="w-6 h-6" />
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
