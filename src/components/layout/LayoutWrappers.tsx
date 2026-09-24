'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import ConciergeDrawer from '@/components/assistant/ConciergeDrawer';

export function NavbarWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/admin');
    if (isAdminPath) return null;

    const isHomePage = pathname === '/';
    const isShopPage = pathname?.startsWith('/products');
    const hasMobileSearch = isHomePage || isShopPage;

    return (
        <div className="print:hidden">
            <Suspense fallback={<div className={`${hasMobileSearch ? 'h-[120px] md:h-24' : 'h-16 md:h-24'} bg-surface border-b border-transparent transition-none`} />}>
                <Navbar />
            </Suspense>
        </div>
    );
}

export function FooterWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/admin');
    if (isAdminPath) return null;
    return (
        <div className="print:hidden">
            <Footer />
        </div>
    );
}

export function MobileBottomNavWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/admin');
    if (isAdminPath) return null;
    return (
        <div className="print:hidden">
            <MobileBottomNav />
        </div>
    );
}

export function ConciergeDrawerWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/admin');
    if (isAdminPath) return null;
    return <ConciergeDrawer />;
}
