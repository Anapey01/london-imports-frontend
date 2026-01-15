/**
 * London's Imports - Mobile Menu Drawer
 * Slide-out menu for mobile devices (Jumia-inspired design)
 */
'use client';

import { useEffect } from 'react';
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
    Star,
    Heart,
    User,
    Package,
    Phone,
    Info,
    FileText,
    MapPin,
    LogOut,
    LogIn,
    Truck,
    Flame,
    Store,
} from 'lucide-react';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, logout } = useAuthStore();

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
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in-left"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="London's Imports"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-bold">
                            <span className="text-pink-500">London&apos;s</span>
                            <span className="text-gray-800"> Imports</span>
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-700 hover:text-pink-600 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Featured / Available Items - Highlighted */}
                {/* Ready to Ship - Clean & Professional */}
                <Link
                    href="/products?status=READY_TO_SHIP"
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors group"
                >
                    <Flame className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    <div className="flex-1">
                        <span className="block font-medium text-gray-900 text-base">Ready to Ship</span>
                        <span className="block text-xs text-gray-500 mt-0.5">In stock now</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                </Link>

                {/* Marketplace Link - Clean & Professional */}
                <Link
                    href="/market"
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors group"
                >
                    <Store className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    <div className="flex-1">
                        <span className="block font-medium text-gray-900 text-base">Marketplace</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Browse partner stores</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                </Link>

                {/* Need Help Section */}
                <Link
                    href="/how-it-works"
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Need Help?</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                {/* My Account Section */}
                <div className="border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 py-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">My Account</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="pb-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/orders"
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <Package className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-800">Orders</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-800">My Profile</span>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <Heart className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-800">Wishlist</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 px-6 py-3 w-full text-left hover:bg-gray-50 transition-colors text-red-500"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <LogIn className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-800">Sign In</span>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-800">Create Account</span>
                                </Link>
                            </>
                        )}
                        <div className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4 w-full">
                                <span className="flex items-center justify-center shrink-0">
                                    <ThemeToggle />
                                </span>
                                <span className="text-gray-800">Theme</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Categories Section */}
                <div className="border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 py-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Our Categories</span>
                        <Link
                            href="/products"
                            onClick={onClose}
                            className="text-sm font-medium text-pink-500 hover:text-pink-600"
                        >
                            See All
                        </Link>
                    </div>

                    <div className="pb-2">
                        {categories.slice(0, 8).map((category: { id: string; slug: string; name: string }) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-800">{category.name}</span>
                            </Link>
                        ))}
                        {categories.length === 0 && (
                            <div className="px-6 py-3 text-gray-400 text-sm">
                                No categories yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Our Services Section */}
                <div className="border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 py-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Our Services</span>
                    </div>

                    <div className="pb-2">
                        <Link
                            href="/how-it-works"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <HelpCircle className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">How It Works</span>
                        </Link>
                        <Link
                            href="/delivery-returns"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Truck className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">Delivery & Returns</span>
                        </Link>
                        <Link
                            href="/track"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">Track Order</span>
                        </Link>
                        <Link
                            href="/about"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Info className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">About Us</span>
                        </Link>
                        <a
                            href="https://wa.me/233545247009?text=Hi%20I%20have%20a%20question%20about%20London's%20Imports"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Phone className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">Contact Us</span>
                        </a>
                        <Link
                            href="/reviews"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Star className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">Reviews</span>
                        </Link>
                        <Link
                            href="/faq"
                            onClick={onClose}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-800">FAQ</span>
                        </Link>
                    </div>
                </div>

                {/* Sell on London's Imports */}
                <Link
                    href="/sell"
                    onClick={onClose}
                    className="block px-4 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    Sell on London&apos;s Imports
                </Link>

                <Link
                    href="/faq"
                    onClick={onClose}
                    className="block px-4 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    Help Center
                </Link>

                {/* Trustpilot - External Link */}
                <a
                    href="https://www.trustpilot.com/review/londonsimports.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-green-50/50 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00b67a]/10 flex items-center justify-center text-[#00b67a] group-hover:bg-[#00b67a] group-hover:text-white transition-colors">
                            <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-lg font-medium text-gray-800">Trustpilot Reviews</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00b67a]" />
                </a>

                {/* Social Media Links */}
                <div className="px-4 py-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Follow Us</p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/londonimportsghana"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition-all"
                            aria-label="Instagram"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a
                            href="https://www.tiktok.com/@londons_imports1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                            aria-label="TikTok"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.snapchat.com/add/londons_imports"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yellow-50 hover:text-yellow-500 transition-all"
                            aria-label="Snapchat"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Bottom Spacing for Safe Area */}
                <div className="h-20" />
            </div>

            <style jsx>{`
                @keyframes slide-in-left {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
