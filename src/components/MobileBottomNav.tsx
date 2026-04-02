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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/20 z-50 safe-area-bottom shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.08)]">
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
                            className="flex flex-col items-center justify-center flex-1 py-1 group relative transition-all active:scale-90"
                        >
                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full dark:bg-white" />
                            )}

                            {/* Icon container */}
                            <div className="relative">
                                <item.icon
                                    className={`w-6 h-6 transition-all duration-300 ${isActive
                                        ? 'text-slate-900 dark:text-white stroke-[1.5] scale-110'
                                        : 'text-slate-400 stroke-[1.25] group-hover:text-slate-600'
                                        }`}
                                />

                                {/* Badge for cart */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-800 transition-colors">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[10px] mt-1 font-medium tracking-tight transition-all duration-300 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 opacity-70 group-hover:opacity-100'
                                    }`}
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
