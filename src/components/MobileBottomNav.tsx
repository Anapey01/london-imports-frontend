/**
 * London's Imports - Mobile Bottom Navigation
 * Fixed bottom navigation for mobile devices
 * Design: Home, Categories, Basket (with badge), Account
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { itemCount } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const wishlistItems = useWishlistStore(state => state.items);

    // Consolidated to 4 primary items for better usability and less clutter
    const navItems = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
        },
        {
            name: 'Shop',
            href: '/products',
            icon: Search,
        },
        {
            name: 'Wishlist',
            href: '/wishlist',
            icon: Heart,
            badge: wishlistItems.length,
        },
        {
            name: 'Basket',
            href: '/cart',
            icon: ShoppingBag,
            badge: itemCount,
        },
        {
            name: 'Profile',
            href: isAuthenticated ? '/profile' : '/login',
            icon: User,
        },
    ];

    // Don't show on dashboard pages or specific auth pages where it might be distracting
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/checkout')) {
        return null;
    }

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-t border-slate-100 dark:border-slate-900 z-50 safe-area-bottom shadow-diffusion">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive =
                        item.href === '/'
                            ? pathname === '/'
                            : pathname?.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center flex-1 py-1 group relative outline-none focus:outline-none border-none ring-0 focus:ring-0 tap-highlight-none shadow-none"
                        >
                            {/* Icon container */}
                            <div className="relative">
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? 'text-emerald-500' : 'nuclear-text opacity-60 dark:opacity-80'}`}
                                    strokeWidth={1.5}
                                />

                                {/* Badge for cart */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[8px] font-black min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-950 transition-colors shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[9px] mt-1.5 font-black uppercase tracking-[0.2em] ${isActive ? 'text-emerald-500' : 'nuclear-text opacity-60 dark:opacity-80'}`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
