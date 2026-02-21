'use client';

import { useState } from 'react';
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
    User,
    Package,
    Phone,
    LogOut,
    Instagram,
    Star,
    Zap,
    Scan,
} from 'lucide-react';

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    const { isAuthenticated, logout } = useAuthStore();
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);

    // Fetch categories dynamically
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
    });

    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] animate-slide-in-left border-r border-gray-50"
                role="dialog"
                aria-modal="true"
                aria-label="Desktop navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50 bg-white sticky top-0 z-10">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2 group">
                        <Image
                            src="/logo.jpg"
                            alt="London's Imports"
                            width={32}
                            height={32}
                            className="rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold tracking-tight text-gray-900 uppercase">London&apos;s</span>
                            <span className="text-[10px] font-semibold text-pink-600 tracking-[0.25em] uppercase">Imports</span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-300 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
                    {/* SECTION: Featured Actions - Refined minimalist list */}
                    <div className="px-4 py-6 space-y-1">
                        <Link
                            href="/products?status=READY_TO_SHIP"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-rose-50/50 flex items-center justify-center border border-rose-100/50 group-hover:scale-110 transition-transform flex-shrink-0">
                                <Zap className="w-5 h-5 text-rose-500" strokeWidth={1.2} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Ready to Ship</span>
                                <span className="text-[10px] text-gray-400 font-medium">Instant global delivery</span>
                            </div>
                        </Link>

                        <Link
                            href="/sourcing"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-violet-50/50 flex items-center justify-center border border-violet-100/50 group-hover:scale-110 transition-transform flex-shrink-0">
                                <Scan className="w-5 h-5 text-violet-500" strokeWidth={1.2} />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">AI Sourcing</span>
                                    <span className="text-[8px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">Find anything, anywhere</span>
                            </div>
                        </Link>
                    </div>

                    {/* SECTION: Member Space - Integrated minimalist style */}
                    <div className="border-t border-gray-50 pt-6">
                        <div className="px-8 pb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Member Space</span>
                        </div>

                        <div className="px-4 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/profile" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-pink-50">
                                            <User className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm">Dashboard</span>
                                    </Link>
                                    <Link href="/orders" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-pink-50">
                                            <Package className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm">My Orders</span>
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group text-left">
                                        <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-red-50">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-red-600 font-semibold text-sm">Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="px-4 py-4 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-gray-900 text-sm font-bold">Elite Member Access.</p>
                                        <p className="text-gray-400 text-[11px] font-medium leading-relaxed">Sign in to unlock exclusive features and track your premium orders.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl text-[10px] font-bold text-center hover:bg-gray-800 transition-all tracking-widest"
                                        >
                                            LOG IN
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={onClose}
                                            className="flex-1 bg-white text-gray-900 border border-gray-200 py-3 px-4 rounded-xl text-[10px] font-bold text-center hover:bg-gray-50 transition-all tracking-widest"
                                        >
                                            JOIN
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION: Navigation */}
                    <div className="mt-6 border-t border-gray-50 pt-6">
                        <div className="px-8 pb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">Collections</span>
                        </div>

                        <div className="px-4 space-y-1">
                            {/* Categories Accordion */}
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-pink-50">
                                        <ShoppingBag className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                    </div>
                                    <span className="text-gray-800 font-bold text-sm">Collections</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${categoriesOpen ? 'rotate-90' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriesOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-16 pr-4 pb-4 space-y-3">
                                    <Link
                                        href="/products"
                                        onClick={onClose}
                                        className="block text-sm font-black text-pink-600 hover:text-pink-700 underline underline-offset-8"
                                    >
                                        Explore All Products
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

                        </div>
                    </div>

                    {/* SECTION: Support */}
                    <div className="mt-4 border-t border-gray-50 pt-4 px-4">
                        <button
                            onClick={() => setSupportOpen(!supportOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-slate-100">
                                    <HelpCircle className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-gray-800 font-bold text-sm">Support & Help</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${supportOpen ? 'rotate-90' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${supportOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-16 pr-4 py-3 space-y-3">
                                <Link href="/how-it-works" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">How It Works</Link>
                                <Link href="/delivery-returns" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Delivery & Returns</Link>
                                <Link href="/track" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Track My Order</Link>
                                <Link href="/faq" onClick={onClose} className="block text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link>
                                <a
                                    href="https://wa.me/233545247009"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-green-100 transition-colors mt-2"
                                >
                                    <Phone className="w-3 h-3" />
                                    GHANA SUPPORT
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Socials & Theme Toggle */}
                    <div className="mt-auto border-t border-gray-50 bg-gray-50/50">
                        <div className="px-8 py-6 flex gap-4">
                            <a
                                href="https://www.instagram.com/londonimportsghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-100 transition-all shadow-sm group"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@londons_imports1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-black/10 transition-all shadow-sm group"
                                aria-label="TikTok"
                            >
                                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                            <a
                                href="https://www.trustpilot.com/review/londonsimports.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#00b67a] hover:border-[#00b67a]/20 transition-all shadow-sm group"
                                aria-label="Review us on Trustpilot"
                            >
                                <Star size={18} className="group-hover:scale-110 transition-transform fill-current" />
                            </a>
                        </div>
                        <div className="px-8 pb-8">
                            <div className="flex items-center justify-between p-4 bg-white/50 border border-gray-100/50 rounded-2xl">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
