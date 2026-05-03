/**
 * London's Imports - Institutional Mobile Directory
 * Strictly text-focused vertical navigation
 * Minimalist Editorial Pro Standard
 */
'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';
import {
    X,
    User,
    UserPlus,
    HelpCircle,
    Zap,
    Scan,
    ArrowUpRight,
    Instagram,
    Star,
    Info,
    BookOpen,
    Truck,
    Heart,
    Mail,
    FileText,
    Shield,
    Plus,
    Minus,
    LayoutGrid,
    MessageCircle,
    LogOut,
    Footprints,
    Tv,
    Utensils,
    Droplet,
    Shirt,
    ShoppingBag,
    Gem,
    Sparkles,
    IceCream,
    Smartphone,
    Briefcase,
    Wind,
    Sun,
    Crown,
    Package,
    Facebook
} from 'lucide-react';

// Mapping category names/keywords to Lucide icons for dynamic categories
export const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('shop all')) return LayoutGrid;
    if (name.includes('shoe') || name.includes('heel') || name.includes('footwear')) return Footprints;
    if (name.includes('electronics') || name.includes('tv') || name.includes('gadget')) return Tv;
    if (name.includes('kitchen') || name.includes('home') || name.includes('appliance')) return Utensils;
    if (name.includes('perfume') || name.includes('fragrance') || name.includes('scent')) return Droplet;
    if (name.includes('dress') || name.includes('outfit') || name.includes('cloth') || name.includes('apparel')) return Shirt;
    if (name.includes('bag') || name.includes('purse')) return ShoppingBag;
    if (name.includes('jewelry') || name.includes('accessory')) return Gem;
    if (name.includes('beauty') || name.includes('care') || name.includes('skin')) return Sparkles;
    if (name.includes('snack') || name.includes('food')) return IceCream;
    if (name.includes('phone') || name.includes('mobile')) return Smartphone;
    if (name.includes('business') || name.includes('book')) return Briefcase;
    if (name.includes('air') || name.includes('wind')) return Wind;
    if (name.includes('sun') || name.includes('light')) return Sun;
    if (name.includes('hair')) return Crown;
    
    return Package; // Default fallback
};

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ACTION_ITEMS = [
    { name: 'Ready to Ship', href: '/products?status=READY_TO_SHIP', icon: Zap, color: 'text-emerald-500' },
    { name: 'Find Products', href: '/sourcing', icon: Scan, color: 'text-slate-900' },
];

const SHOP_ITEMS = [
    { name: 'Customer Reviews', href: '/reviews', icon: Star },
    { name: 'How it Works', href: '/how-it-works', icon: Info },
    { name: 'Answer Hub (FAQ)', href: '/faq', icon: HelpCircle },
    { name: 'Our Blog', href: '/story', icon: BookOpen },
    { name: 'Track My Items', href: '/track', icon: Truck },
];

const SUPPORT_ITEMS = [
    { name: 'Shipping Services', href: '/shipping', icon: Truck },
    { name: 'Customs Help', href: '/customs', icon: Shield },
    { name: 'Shopping Guide', href: '/guide', icon: BookOpen },
    { name: 'About Us', href: '/about', icon: Heart },
    { name: 'Contact Support', href: '/contact', icon: Mail },
    { name: 'Terms of Use', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
];

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const { isAuthenticated, logout } = useAuthStore();
    const [productsOpen, setProductsOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (drawerRef.current) {
            drawerRef.current.style.transform = isOpen ? 'translateX(0)' : 'translateX(-100%)';
        }
    }, [isOpen]);

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: productsAPI.categories,
        staleTime: 1000 * 60 * 60,
    });

    const categories = categoriesData?.data?.results || categoriesData?.data || [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
            // Institutional Focus Management: Focus close button on open
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-500"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer (Solid Canvas) */}
            <div
                ref={drawerRef}
                className="fixed inset-y-0 left-0 w-full max-w-[340px] md:max-w-[450px] bg-surface z-[1000] flex flex-col shadow-2xl border-r border-border-standard transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                role="dialog"
                aria-modal="true"
            >
                {/* 1. INSTITUTIONAL HEADER */}
                <div className="flex items-center justify-between px-8 py-8 border-b border-border-standard sticky top-0 z-20 bg-surface">
                    <Link href="/" onClick={onClose} className="flex items-center gap-4 group">
                        <div className="relative w-10 h-10 border border-content-primary overflow-hidden">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black tracking-widest text-content-primary">LONDON&apos;S</span>
                            <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-content-secondary italic">Imports</span>
                        </div>
                    </Link>
                    <button 
                        ref={closeButtonRef}
                        onClick={onClose} 
                        className="p-2 transition-colors hover:bg-surface-card institutional-focus" 
                        title="Close Menu" 
                        aria-label="Close Menu"
                    >
                        <X className="w-5 h-5 text-content-secondary" strokeWidth={1} />
                    </button>
                </div>

                {/* 2. DIRECTORY CONTENT (Vertical Ledger) */}
                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
                    
                    {/* ACCOUNT PROTOCOL */}
                    <div className="mb-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-secondary mb-6 block px-4">Your Account</span>
                        {isAuthenticated ? (
                            <>
                                <Link href="/profile" onClick={onClose} className="flex items-center justify-between p-4 group transition-all hover:bg-surface-card border-b border-border-standard institutional-focus">
                                    <div className="flex items-center gap-6">
                                        <User className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                        <span className="text-[13px] font-black uppercase tracking-widest text-content-primary">Profile Dashboard</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-content-secondary group-hover:text-content-primary transition-colors" />
                                </Link>
                                {useAuthStore.getState().user?.is_staff && (
                                    <Link href="/dashboard/admin" onClick={onClose} className="flex items-center justify-between p-4 group transition-all bg-emerald-500/5 hover:bg-emerald-500/10 border-b border-emerald-500/20 institutional-focus">
                                        <div className="flex items-center gap-6">
                                            <Zap className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                                            <span className="text-[13px] font-black uppercase tracking-widest text-emerald-600">Admin Command</span>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-emerald-500 transition-colors" />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col">
                                <Link href="/login" onClick={onClose} className="flex items-center justify-between p-4 group transition-all hover:bg-surface-card border-b border-border-standard institutional-focus">
                                    <div className="flex items-center gap-6">
                                        <User className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                        <span className="text-[13px] font-black uppercase tracking-widest text-content-primary">Login</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-content-secondary group-hover:text-content-primary transition-colors" />
                                </Link>
                                <Link href="/register" onClick={onClose} className="flex items-center justify-between p-4 group transition-all hover:bg-surface-card border-b border-border-standard institutional-focus">
                                    <div className="flex items-center gap-6">
                                        <UserPlus className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                        <span className="text-[13px] font-black uppercase tracking-widest text-content-primary">Create Account</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-content-secondary group-hover:text-content-primary transition-colors" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ACTION LEDGER */}
                    <div className="mb-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-secondary mb-6 block px-4">Quick Links</span>
                        {ACTION_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between p-4 group transition-all hover:bg-surface-card border-b border-border-standard institutional-focus"
                            >
                                <div className="flex items-center gap-6">
                                    <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                                    <span className="text-[13px] font-black uppercase tracking-widest text-content-primary">{item.name}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-content-secondary group-hover:text-content-primary transition-colors" />
                            </Link>
                        ))}
                        
                        {/* WhatsApp Protocol */}
                        <a 
                            href={siteConfig.socials.whatsapp}
                            target="_blank" 
                            rel="noopener"
                            className="flex items-center justify-between p-4 group transition-all hover:bg-surface-card border-b border-border-standard"
                        >
                            <div className="flex items-center gap-6">
                                <MessageCircle className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-black uppercase tracking-widest text-content-primary">WhatsApp Orders</span>
                                    <span className="text-[8px] font-bold text-content-secondary uppercase tracking-widest italic">Direct Liaison</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-content-secondary group-hover:text-content-primary transition-colors" />
                        </a>
                    </div>

                    {/* PRODUCT DIRECTORY ACCORDION */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setProductsOpen(!productsOpen)}
                            className="w-full flex items-center justify-between p-4 group transition-all border-b border-border-standard"
                            aria-controls="products-accordion"
                            {...({ "aria-expanded": productsOpen })}
                        >
                            <div className="flex items-center gap-6">
                                <LayoutGrid className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-content-primary">Product Categories</span>
                            </div>
                            {productsOpen ? <Minus className="w-3 h-3 text-content-primary" /> : <Plus className="w-3 h-3 text-content-secondary group-hover:text-content-primary" />}
                        </button>
                        {productsOpen && (
                            <div id="products-accordion" className="bg-surface-card py-4 transition-all">
                                {categories.map((cat: { id: string; name: string; slug: string }) => {
                                    const Icon = getCategoryIcon(cat.name);
                                    return (
                                        <Link 
                                            key={cat.id}
                                            href={`/products/category/${cat.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-6 px-12 py-3.5 hover:italic transition-all institutional-focus"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-content-secondary" strokeWidth={1.5} />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-content-secondary hover:text-content-primary">{cat.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* SHOP PROTOCOLS ACCORDION */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setShopOpen(!shopOpen)}
                            className="w-full flex items-center justify-between p-4 group transition-all border-b border-border-standard"
                            aria-controls="shop-accordion"
                            {...({ "aria-expanded": shopOpen })}
                        >
                            <div className="flex items-center gap-6">
                                <Star className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-content-primary">Shopping Guide</span>
                            </div>
                            {shopOpen ? <Minus className="w-3 h-3 text-content-primary" /> : <Plus className="w-3 h-3 text-content-secondary group-hover:text-content-primary" />}
                        </button>
                        {shopOpen && (
                            <div id="shop-accordion" className="bg-surface-card py-4">
                                {SHOP_ITEMS.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-6 px-12 py-3 hover:italic transition-all"
                                    >
                                        <item.icon className="w-3.5 h-3.5 text-content-secondary" strokeWidth={1.5} />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-content-secondary hover:text-content-primary">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INSTITUTIONAL SUPPORT ACCORDION */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setSupportOpen(!supportOpen)}
                            className="w-full flex items-center justify-between p-4 group transition-all border-b border-border-standard"
                            aria-controls="support-accordion"
                            {...({ "aria-expanded": supportOpen })}
                        >
                            <div className="flex items-center gap-6">
                                <Shield className="w-4 h-4 text-content-primary" strokeWidth={1.5} />
                                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-content-primary">Our Company</span>
                            </div>
                            {supportOpen ? <Minus className="w-3 h-3 text-content-primary" /> : <Plus className="w-3 h-3 text-content-secondary group-hover:text-content-primary" />}
                        </button>
                        {supportOpen && (
                            <div id="support-accordion" className="bg-surface-card py-4">
                                {SUPPORT_ITEMS.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-6 px-12 py-3 hover:italic transition-all"
                                    >
                                        <item.icon className="w-3.5 h-3.5 text-content-secondary" strokeWidth={1.5} />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-content-secondary hover:text-content-primary">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* EXIT ACCOUNT (If Auth) */}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 mt-8 bg-content-primary transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-6 text-surface">
                                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                                <span className="text-[11px] font-black uppercase tracking-[0.6em]">Logout</span>
                            </div>
                        </button>
                    )}
                </div>

                {/* 3. UTILITY FOOTER (High-Contrast Monochrome) */}
                <div className="mt-auto border-t border-border-standard pt-10 pb-16 px-8">
                     <div className="flex items-center justify-between mb-10">
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-content-secondary">Terminal Mode</span>
                          <ThemeToggle />
                     </div>
                     
                      <div className="flex flex-wrap items-center gap-6 border-t border-border-standard pt-8 mb-6">
                         <a href={siteConfig.socials.instagram} target="_blank" rel="noopener" className="text-content-secondary hover:text-content-primary" title="Instagram" aria-label="Instagram">
                             <Instagram size={18} strokeWidth={1.5} />
                         </a>
                         <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener" className="text-content-secondary hover:text-content-primary" title="TikTok" aria-label="TikTok">
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                         </a>
                         <a href={siteConfig.socials.snapchat} target="_blank" rel="noopener" className="text-content-secondary hover:text-content-primary" title="Snapchat" aria-label="Snapchat">
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" /></svg>
                         </a>
                         <a href={siteConfig.socials.facebook} target="_blank" rel="noopener" className="text-content-secondary hover:text-content-primary" title="Facebook" aria-label="Facebook">
                            <Facebook size={18} strokeWidth={1.5} />
                         </a>
                         <a href="https://www.trustpilot.com/review/londonsimports.com" target="_blank" rel="noopener" className="text-content-secondary hover:text-content-primary" title="Trustpilot" aria-label="Trustpilot">
                             <Star size={18} strokeWidth={1.5} />
                         </a>
                      </div>
                      
                      <div className="flex items-center justify-between opacity-40">
                           <div className="h-px flex-1 bg-border-standard mr-4" />
                           <span className="text-[10px] font-black text-content-primary uppercase tracking-[0.3em] italic whitespace-nowrap">2026 Operational Protocol</span>
                      </div>
                 </div>
            </div>
        </>
    );
}