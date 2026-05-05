'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export function NavbarWrapper() {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/dashboard/admin');
    if (isAdminPath) return null;
    return <Navbar />;
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
