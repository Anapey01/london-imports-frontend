/**
 * London's Imports - Mobile Menu Drawer
 * Slide-out menu for mobile devices (Jumia-inspired design)
 * Optimized for hierarchy and breathing room
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';
import {
    X,
    ChevronRight,
    HelpCircle,
    ShoppingBag,
    Heart,
    User,
    Package,
    Phone,
    LogOut,
    Truck,
    Flame,
    Sparkles,
} from 'lucide-react';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, logout } = useAuthStore();
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);

    // Fetch categories dynamically
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
    });

    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in-left flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-white sticky top-0 z-10">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="London's Imports"
                            width={32}
                            height={32}
                            className="rounded-lg shadow-sm"
                        />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-black tracking-tight text-gray-900 uppercase">London&apos;s</span>
                            <span className="text-[10px] font-bold text-pink-600 tracking-[0.2em] uppercase">Imports</span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-pink-600 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 pb-10">
                    {/* SECTION: Quick Actions / Highlights */}
                    <div className="p-4 grid grid-cols-2 gap-3">
                        <Link
                            href="/products?status=READY_TO_SHIP"
                            onClick={onClose}
                            className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-pink-50 hover:border-pink-100 transition-all group shadow-sm active:scale-95"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <Flame className="w-5 h-5 text-pink-500" />
                            </div>
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Ready to Ship</span>
                        </Link>
                        <Link
                            href="/sourcing"
                            onClick={onClose}
                            className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-purple-50 hover:border-purple-100 transition-all group shadow-sm active:scale-95"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">AI Sourcing</span>
                                <span className="text-[8px] font-black bg-purple-600 text-white px-1.5 py-0.5 rounded-full mt-1">NEW</span>
                            </div>
                        </Link>
                    </div>

                    {/* SECTION: Account */}
                    <div className="mt-2 border-t border-gray-50 pt-6">
                        <div className="px-6 pb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Personal</span>
                        </div>

                        <div className="px-2 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/orders"
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                            <Package className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-bold text-sm">My Orders</span>
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                            <User className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-bold text-sm">Profile Settings</span>
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                            <Heart className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-bold text-sm">Wishlist</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-2xl hover:bg-red-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-red-50/50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-red-500 font-bold text-sm">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="p-5 bg-gray-950 rounded-[2rem] mx-2 my-2 shadow-xl shadow-gray-200">
                                    <p className="text-white text-base font-black mb-1">Welcome back.</p>
                                    <p className="text-gray-400 text-xs mb-5 font-medium">Login to track orders and save your premium favorites.</p>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="flex-1 bg-white text-gray-900 py-3 px-4 rounded-2xl text-[10px] font-black text-center hover:bg-gray-100 transition-all active:scale-95"
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={onClose}
                                            className="flex-1 bg-white/10 text-white py-3 px-4 rounded-2xl text-[10px] font-black text-center border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                                        >
                                            JOIN
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION: Shop */}
                    <div className="mt-6 border-t border-gray-50 pt-6">
                        <div className="px-6 pb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shop</span>
                        </div>

                        <div className="px-2 space-y-1">
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                        <ShoppingBag className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                    </div>
                                    <span className="text-gray-800 font-bold text-sm">Product Categories</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${categoriesOpen ? 'rotate-90' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriesOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-14 pr-4 pb-4 space-y-3">
                                    <Link
                                        href="/products"
                                        onClick={onClose}
                                        className="block text-sm font-black text-pink-600 hover:text-pink-700 underline underline-offset-4"
                                    >
                                        All Collections
                                    </Link>

                                    {categories.slice(0, 10).map((category: { id: string; slug: string; name: string }) => (
                                        <Link
                                            key={category.id}
                                            href={`/products?category=${category.slug}`}
                                            onClick={onClose}
                                            className="block text-sm text-gray-500 font-bold hover:text-gray-900 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="/sell"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                    <Package className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                                </div>
                                <span className="text-gray-800 font-bold text-sm">Sell with Us</span>
                            </Link>
                        </div>
                    </div>

                    {/* SECTION: Support Accordion */}
                    <div className="mt-4 border-t border-gray-50 pt-4 px-2">
                        <button
                            onClick={() => setSupportOpen(!supportOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-slate-100 transition-colors">
                                    <HelpCircle className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-gray-800 font-bold text-sm">Support & Info</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${supportOpen ? 'rotate-90' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${supportOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-14 pr-4 py-2 space-y-3">
                                <Link href="/how-it-works" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900">How It Works</Link>
                                <Link href="/delivery-returns" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900">Delivery & Returns</Link>
                                <Link href="/track" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900">Track My Order</Link>
                                <Link href="/about" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900">Our Story</Link>
                                <Link href="/faq" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900">Help Center</Link>
                                <a
                                    href="https://wa.me/233545247009"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-green-100 transition-colors mt-2"
                                >
                                    <Phone className="w-3 h-3" />
                                    WHATSAPP SUPPORT
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Theme Toggle in Menu */}
                    <div className="px-6 py-6 mt-4 opacity-50">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Theme Mode</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Socials */}
                <div className="px-8 py-8 border-t border-gray-50 bg-gray-50/50">
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-100 transition-all shadow-sm">
                            <span className="sr-only">Instagram</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-black/10 transition-all shadow-sm">
                            <span className="sr-only">TikTok</span>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
}
