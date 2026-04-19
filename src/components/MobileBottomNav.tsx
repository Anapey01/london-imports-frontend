/**
 * London's Imports - Mobile Bottom Navigation
 * Hardened for WCAG 'Operable' & 'Perceivable' Compliance
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { itemCount } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const wishlistItems = useWishlistStore(state => state.items);
    const { setSearchModalOpen, isSearchModalOpen } = useUIStore();

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Shop', href: '#search', icon: Search, isSearch: true },
        { name: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistItems.length },
        { name: 'Basket', href: '/cart', icon: ShoppingBag, badge: itemCount },
        { name: 'Profile', href: isAuthenticated ? '/profile' : '/login', icon: User },
    ];

    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/checkout')) {
        return null;
    }

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-border-standard z-50 safe-area-bottom shadow-diffusion">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : (item.href !== '#' && pathname?.startsWith(item.href));
                    const isSearch = item.icon === Search;

                    const content = (
                        <>
                            {/* Icon container */}
                            <div className="relative">
                                <item.icon
                                    className={`w-5 h-5 transition-colors ${isActive || (isSearch && isSearchModalOpen) ? 'text-brand-emerald' : 'text-content-secondary group-hover:text-content-primary'}`}
                                    strokeWidth={(isActive || (isSearch && isSearchModalOpen)) ? 2 : 1.5}
                                />

                                {/* Badge for cart/wishlist */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-emerald text-white text-[8px] font-black min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 border-2 border-surface transition-colors shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label - Hardened for Perceivable Contrast */}
                            <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-[0.2em] transition-colors ${(isActive || (isSearch && isSearchModalOpen)) ? 'text-brand-emerald font-black' : 'text-content-secondary group-hover:text-content-primary'}`}>
                                {item.name}
                            </span>
                        </>
                    );

                    if (item.isSearch) {
                        return (
                            <button
                                key={item.name}
                                onClick={() => setSearchModalOpen(true)}
                                className={`flex flex-col items-center justify-center flex-1 py-1 group relative transition-all institutional-focus rounded-lg outline-none tap-highlight-none ${(isActive || isSearchModalOpen) ? 'text-brand-emerald' : 'text-content-secondary'}`}
                                aria-label={item.name}
                                aria-expanded={isSearchModalOpen ? "true" : "false"}
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 py-1 group relative transition-all institutional-focus rounded-lg outline-none tap-highlight-none ${isActive ? 'text-brand-emerald' : 'text-content-secondary'}`}
                            aria-label={item.name}
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
