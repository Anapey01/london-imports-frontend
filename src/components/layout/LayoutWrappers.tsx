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
    return (
        <Suspense fallback={<div className="h-16 md:h-24 bg-surface" />}>
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
