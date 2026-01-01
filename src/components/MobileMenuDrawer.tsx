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
} from 'lucide-react';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, user, logout } = useAuthStore();

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
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in-left">
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
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

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
                        {categories.slice(0, 8).map((category: any) => (
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
                            href="https://wa.me/233541096372?text=Hi%20I%20have%20a%20question%20about%20London's%20Imports"
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
                    href="/register/vendor"
                    onClick={onClose}
                    className="block px-4 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    Sell on London&apos;s Imports
                </Link>

                {/* Help Center */}
                <Link
                    href="/faq"
                    onClick={onClose}
                    className="block px-4 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                >
                    Help Center
                </Link>

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
