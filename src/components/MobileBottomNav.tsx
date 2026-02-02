/**
 * London's Imports - Mobile Bottom Navigation
 * Fixed bottom navigation for mobile devices
 * Design: Home, Categories, Basket (with badge), Account
 */
'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Home, Grid2X2, ShoppingCart, User, Heart } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const params = useParams();
    const { itemCount } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    // Check if we are in a vendor store context
    const vendorSlug = params?.slug as string;
    const isVendorStore = vendorSlug && pathname?.startsWith('/store/');

    const navItems = [
        {
            name: 'Home',
            href: isVendorStore ? `/store/${vendorSlug}` : '/',
            icon: Home,
        },
        {
            name: 'Categories',
            href: isVendorStore ? `/products?vendor=${vendorSlug}` : '/products',
            icon: Grid2X2,
        },
        {
            name: 'Basket',
            href: '/cart',
            icon: ShoppingCart,
            badge: itemCount,
        },
        {
            name: 'Wishlist',
            href: '/wishlist',
            icon: Heart,
        },
        {
            name: 'Account',
            href: isAuthenticated ? '/profile' : (isVendorStore ? `/login?vendor=${vendorSlug}&redirect=/store/${vendorSlug}` : '/login'),
            icon: User,
        },
    ];

    // Don't show on dashboard pages
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const isActive =
                            item.name === 'Home'
                                ? pathname === item.href
                                : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center justify-center flex-1 py-2 relative"
                            >
                                {/* Icon container */}
                                <div className="relative">
                                    <item.icon
                                        className={`w-6 h-6 transition-colors ${isActive
                                            ? 'text-pink-600 stroke-[2.5]'
                                            : 'text-gray-600 stroke-2'
                                            }`}
                                        fill={isActive && item.name === 'Home' ? 'currentColor' : 'none'}
                                    />

                                    {/* Badge for cart */}
                                    {item.badge !== undefined && (
                                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-xs mt-1 font-medium transition-colors ${isActive ? 'text-pink-600' : 'text-gray-600'
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
