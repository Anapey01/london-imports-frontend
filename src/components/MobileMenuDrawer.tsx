/**
 * London's Imports - Minimalist Mobile Menu Drawer
 * Strictly text-focused vertical navigation
 * No promotional sections, no descriptions, neutral icons.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';
import {
    X,
    User,
    UserPlus,
    HelpCircle,
    Zap,
    Scan,
    Menu,
    ChevronRight,
    Instagram,
    Star,
    ShoppingBag,
    Info,
    BookOpen,
    Truck,
    Heart,
    Mail,
    FileText,
    Shield,
    ChevronDown,
    LayoutGrid,
} from 'lucide-react';
import { CATEGORY_GROUPS } from './MegaMenu';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHOP_ITEMS = [
    { name: 'Reviews', href: '/reviews', icon: Star },
    { name: 'How It Works', href: '/how-it-works', icon: Info },
    { name: 'FAQs', href: '/faq', icon: HelpCircle },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Track Order', href: '/track', icon: Truck },
];

const SUPPORT_ITEMS = [
    { name: 'Our Story', href: '/about', icon: Heart },
    { name: 'Contact Us', href: '/contact', icon: Mail },
    { name: 'Terms of Service', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
];

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, logout } = useAuthStore();
    const [shopOpen, setShopOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm z-50 shadow-2xl overflow-hidden flex flex-col transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Header - Branding & Navigation Control */}
                <div
                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                    <div className="flex items-center gap-2">
                        {/* THE MINIMALIST MENU ICON */}
                        <div
                            onClick={onClose}
                            className="p-2 -ml-2 cursor-pointer active:scale-90 transition-all"
                            style={{ color: '#000000' }}
                        >
                            <Menu className="w-6 h-6" strokeWidth={2.5} />
                        </div>

                        {/* Separator Line */}
                        <div className="w-[1px] h-6 bg-gray-200 dark:bg-slate-700 mx-1" />

                        <Link href="/" onClick={onClose} className="flex items-center gap-1.5 group">
                            <Image
                                src="/logo.jpg"
                                alt="London's Imports"
                                width={26}
                                height={26}
                                className="rounded-md shadow-sm"
                            />
                            <div className="flex flex-col leading-none">
                                <span className="text-[11px] font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-pink-600 transition-colors">LONDON&apos;S</span>
                                <span className="text-[8px] font-bold text-pink-600 tracking-[0.1em] uppercase">Imports</span>
                            </div>
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-pink-600 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Strict Vertical List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-24 flex flex-col">

                    <div className="px-2">
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                onClick={onClose}
                                className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                                style={{ color: '#000000' }}
                            >
                                <div className="flex items-center gap-4">
                                    <User className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                    MY ACCOUNT
                                </div>
                                <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                            </Link>
                        ) : (
                            <div className="flex flex-col">
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                                    style={{ color: '#000000' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <User className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                        LOGIN
                                    </div>
                                    <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={onClose}
                                    className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                                    style={{ color: '#000000' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <UserPlus className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                        SIGN UP
                                    </div>
                                    <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-slate-800 mx-6 my-2" />

                    <div className="px-2">
                        <Link
                            href="/products?status=READY_TO_SHIP"
                            onClick={onClose}
                            className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                            style={{ color: '#000000' }}
                        >
                            <div className="flex items-center gap-4">
                                <Zap className="w-5 h-5 text-rose-700" strokeWidth={2.5} />
                                Ready to Ship
                            </div>
                            <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                        </Link>
                        <Link
                            href="/sourcing"
                            onClick={onClose}
                            className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                            style={{ color: '#000000' }}
                        >
                            <div className="flex items-center gap-4">
                                <Scan className="w-5 h-5 text-indigo-700" strokeWidth={2.5} />
                                <div className="flex items-center gap-2">
                                    AI Sourcing
                                    <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-md font-black">NEW</span>
                                </div>
                            </div>
                            <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                        </Link>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-slate-800 mx-6 my-2" />

                    {/* 3. PRODUCTS SECTION (Now Accordion) */}
                    <div className="px-2">
                        <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                            style={{ color: '#000000' }}
                        >
                            <div className="flex items-center gap-4">
                                <LayoutGrid className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                                PRODUCTS
                            </div>
                            <ChevronDown className={`w-4 h-4 text-black transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${productsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-2 pb-2">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    if (category.id === 'all') return null;

                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/products?category=${category.id}`}
                                            onClick={onClose}
                                            className="flex items-center justify-between px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group"
                                        >
                                            <div
                                                className="flex items-center gap-4 text-[13px] font-black group-hover:text-pink-600 transition-colors"
                                                style={{ color: '#000000' }}
                                            >
                                                <Icon className="w-4.5 h-4.5 text-black group-hover:text-pink-600" strokeWidth={2.5} />
                                                {category.name}
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-slate-800 mx-6 my-4" />

                    <div className="px-2 space-y-1">
                        <Link
                            href="/faq"
                            onClick={onClose}
                            className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                            style={{ color: '#000000' }}
                        >
                            <div className="flex items-center gap-4">
                                <HelpCircle className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                HELP CENTER
                            </div>
                            <ChevronRight className="w-3 h-3" style={{ color: '#000000' }} />
                        </Link>

                        <div>
                            <button
                                onClick={() => setShopOpen(!shopOpen)}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                                style={{ color: '#000000' }}
                            >
                                <div className="flex items-center gap-4">
                                    <ShoppingBag className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                    SHOP
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${shopOpen ? 'rotate-180' : ''}`} style={{ color: '#000000' }} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${shopOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-14 pr-4 py-2 space-y-1">
                                    {SHOP_ITEMS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-[13px] font-black group-hover:text-pink-600 transition-all"
                                            style={{ color: '#000000' }}
                                        >
                                            <item.icon className="w-4 h-4" style={{ color: '#000000' }} strokeWidth={2.5} />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={() => setSupportOpen(!supportOpen)}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-black text-[13px] uppercase tracking-wider"
                                style={{ color: '#000000' }}
                            >
                                <div className="flex items-center gap-4">
                                    <Heart className="w-5 h-5" style={{ color: '#000000' }} strokeWidth={2.5} />
                                    SUPPORT
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${supportOpen ? 'rotate-180' : ''}`} style={{ color: '#000000' }} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${supportOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-14 pr-4 py-2 space-y-1">
                                    {SUPPORT_ITEMS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-[13px] font-black group-hover:text-pink-600 transition-all"
                                            style={{ color: '#000000' }}
                                        >
                                            <item.icon className="w-4 h-4" style={{ color: '#000000' }} strokeWidth={2.5} />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. LOGOUT (If Auth) */}
                    {isAuthenticated && (
                        <div className="px-2 mt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-[13px] text-red-600 uppercase tracking-wider"
                            >
                                <div className="flex items-center gap-4">
                                    <X className="w-5 h-5" strokeWidth={1.5} />
                                    EXIT ACCOUNT
                                </div>
                            </button>
                        </div>
                    )}

                    {/* BOTTOM PUSH / UTILITIES */}
                    <div className="mt-auto px-6 pb-20">
                        {/* SOCIAL ICONS (Moved above Theme Toggle for better visibility) */}
                        <div className="flex justify-between items-center py-6 border-t border-gray-100 dark:border-slate-800">
                            <a href="https://www.instagram.com/londonimportsghana" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ color: '#000000' }} title="Instagram">
                                <Instagram size={24} strokeWidth={2.5} />
                            </a>
                            <a href="https://www.tiktok.com/@londons_imports1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ color: '#000000' }} title="TikTok">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                            <a href="https://www.snapchat.com/add/londons_imports" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ color: '#000000' }} title="Snapchat">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" /></svg>
                            </a>
                            <a href="https://www.trustpilot.com/review/londonsimports.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ color: '#000000' }} title="Trustpilot">
                                <Star size={24} strokeWidth={2.5} />
                            </a>
                        </div>

                        {/* FLAT THEME TOGGLE (No Card) */}
                        <div className="flex items-center justify-between px-4 py-6 border-t border-gray-100 dark:border-slate-800">
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#000000' }}>Theme Mode</span>
                            <ThemeToggle />
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
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
            `}</style>
        </>
    );
}