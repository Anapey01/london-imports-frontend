'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export function NavbarWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin');
    if (isAdminPath) return null;

    const isHomePage = pathname === '/';
    const isShopPage = pathname?.startsWith('/products');
    const hasMobileSearch = isHomePage || isShopPage;

    return (
        <Suspense fallback={<div className={`${hasMobileSearch ? 'h-[120px] md:h-24' : 'h-16 md:h-24'} bg-surface border-b border-transparent transition-none`} />}>
            <Navbar />
        </Suspense>
    );
}

export function FooterWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin');
    if (isAdminPath) return null;
    return <Footer />;
}

export function MobileBottomNavWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin');
    if (isAdminPath) return null;
    return <MobileBottomNav />;
}
