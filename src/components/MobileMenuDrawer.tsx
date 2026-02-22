/**
 * London's Imports - Mobile Menu Drawer
 * Slide-out menu for mobile devices (Jumia-inspired design)
 * Optimized for hierarchy and breathing room
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { CATEGORY_GROUPS } from './MegaMenu';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, logout } = useAuthStore();
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const categories = CATEGORY_GROUPS;

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
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl overflow-y-auto animate-slide-in-left flex flex-col glass-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50 bg-white sticky top-0 z-20">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="London's Imports"
                            width={32}
                            height={32}
                            className="rounded-lg shadow-sm"
                        />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold tracking-tight text-gray-900 uppercase">London&apos;s</span>
                            <span className="text-[10px] font-semibold text-pink-600 tracking-[0.25em] uppercase">Imports</span>
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

                {/* Content - Fixed Scrollability */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                    {/* SECTION: Quick Actions / Highlights */}
                    <div className="px-4 py-6 space-y-1">
                        <Link
                            href="/products?status=READY_TO_SHIP"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-rose-50/50 flex items-center justify-center border border-rose-100/50 group-hover:scale-110 transition-transform flex-shrink-0">
                                <Zap className="w-4 h-4 text-rose-500" strokeWidth={1.5} />
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
                            <div className="w-8 h-8 rounded-xl bg-violet-50/50 flex items-center justify-center border border-violet-100/50 group-hover:scale-110 transition-transform flex-shrink-0">
                                <Scan className="w-4 h-4 text-violet-500" strokeWidth={1.5} />
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

                    {/* SECTION: Member Access */}
                    <div className="border-t border-gray-50 pt-6">
                        <div className="px-8 pb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Member Space</span>
                        </div>

                        <div className="px-4 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/orders" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                            <Package className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm">My Orders</span>
                                    </Link>
                                    <Link href="/profile" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                            <User className="w-4 h-4 text-gray-500 group-hover:text-pink-600" />
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm">Profile Settings</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-xl hover:bg-red-50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-red-500 font-semibold text-sm">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="px-4 py-4 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-gray-900 text-sm font-bold">Elite Member Access.</p>
                                        <p className="text-gray-400 text-[11px] font-medium leading-relaxed">Sign in to unlock exclusive features and track your premium orders.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href="/login" onClick={onClose} className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl text-[10px] font-bold text-center hover:bg-gray-800 transition-all active:scale-95 tracking-widest">LOG IN</Link>
                                        <Link href="/register" onClick={onClose} className="flex-1 bg-white text-gray-900 border border-gray-200 py-3 px-4 rounded-xl text-[10px] font-bold text-center hover:bg-gray-50 transition-all active:scale-95 tracking-widest">JOIN</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION: Direct Access */}
                    <div className="mt-6 border-t border-gray-50 pt-6">
                        <div className="px-8 pb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">Main Menu</span>
                        </div>

                        <div className="px-4 space-y-1">
                            <button onClick={() => setCategoriesOpen(!categoriesOpen)} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${categoriesOpen ? 'bg-pink-50 text-pink-600 shadow-sm' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${categoriesOpen ? 'bg-white' : 'bg-gray-50 group-hover:bg-pink-50'}`}>
                                        <ShoppingBag className={`w-4 h-4 ${categoriesOpen ? 'text-pink-600' : 'text-gray-500 group-hover:text-pink-600'}`} />
                                    </div>
                                    <span className={`font-bold text-sm ${categoriesOpen ? 'text-pink-600' : 'text-gray-800'}`}>Menu</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${categoriesOpen ? 'rotate-90' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriesOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-4 pb-4 mt-2 space-y-1">
                                    {categories.map((category) => {
                                        const Icon = category.icon;
                                        return (
                                            <Link
                                                key={category.id}
                                                href={category.id === 'all' ? '/products' : `/products?category=${category.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                                            >
                                                <Icon className="w-4 h-4 text-gray-400 group-hover:text-pink-600" strokeWidth={1.5} />
                                                <span className="text-sm text-gray-600 font-bold group-hover:text-gray-900 transition-colors">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Support Accordion */}
                    <div className="mt-4 border-t border-gray-50 pt-4 px-2">
                        <button onClick={() => setSupportOpen(!supportOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group">
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
                                <Link href="/blog" onClick={onClose} className="block text-xs font-bold text-pink-600 hover:text-pink-700">Blog / Articles</Link>
                                <a href="https://wa.me/233545247009" target="_blank" rel="noopener noreferrer" onClick={onClose} className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-green-100 transition-colors mt-2">
                                    <Phone className="w-3 h-3" />
                                    WHATSAPP SUPPORT
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility: Theme Toggle */}
                    <div className="px-6 py-8 mt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Theme Mode</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Socials Section - Professional Sync */}
                    <div className="px-6 py-8 border-t border-gray-50 bg-gray-50/50">
                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <a
                                href="https://www.instagram.com/londonimportsghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-all group"
                                aria-label="Instagram"
                                title="Instagram"
                            >
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@londons_imports1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all group"
                                aria-label="TikTok"
                                title="TikTok"
                            >
                                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                            <a
                                href="https://www.snapchat.com/add/londons_imports"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#FFCC00] hover:bg-yellow-50 transition-all shadow-sm group"
                                aria-label="Snapchat"
                                title="Snapchat"
                            >
                                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" /></svg>
                            </a>
                            <a
                                href="https://www.trustpilot.com/review/londonsimports.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#00b67a] hover:bg-green-50 transition-all group"
                                aria-label="Review us on Trustpilot"
                                title="Trustpilot"
                            >
                                <Star size={20} className="group-hover:scale-110 transition-transform fill-current" />
                            </a>
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
                    animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
}
