'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';
import {
    Smartphone,
    Shirt,
    Home,
    Gamepad2,
    ChevronRight,
    Zap,
    Scan,
    User,
    Package,
    LogOut,
    HelpCircle,
    Instagram,
    Star
} from 'lucide-react';

const CATEGORY_GROUPS = [
    {
        id: 'electronics',
        name: 'Electronics',
        icon: Smartphone,
        subgroup: [
            {
                title: 'Phones & Tablets',
                links: [
                    { name: 'iPhones', href: '/products?category=phones&q=iphone' },
                    { name: 'Samsung', href: '/products?category=phones&q=samsung' },
                    { name: 'Tablets', href: '/products?category=tablets' },
                    { name: 'Accessories', href: '/products?category=phone-accessories' },
                ]
            },
            {
                title: 'Computing',
                links: [
                    { name: 'Laptops', href: '/products?category=computing&q=laptops' },
                    { name: 'Printers', href: '/products?category=computing&q=printers' },
                    { name: 'Storage', href: '/products?category=computing&q=storage' },
                ]
            }
        ]
    },
    {
        id: 'fashion',
        name: 'Fashion',
        icon: Shirt,
        subgroup: [
            {
                title: "Women's Fashion",
                links: [
                    { name: 'Dresses', href: '/products?category=fashion&q=dresses' },
                    { name: 'Shoes', href: '/products?category=fashion&q=women-shoes' },
                    { name: 'Bags', href: '/products?category=fashion&q=bags' },
                ]
            },
            {
                title: "Men's Fashion",
                links: [
                    { name: 'Shirts', href: '/products?category=fashion&q=shirts' },
                    { name: 'Trousers', href: '/products?category=fashion&q=trousers' },
                    { name: 'Watch', href: '/products?category=fashion&q=watches' },
                ]
            }
        ]
    },
    {
        id: 'home',
        name: 'Home & Office',
        icon: Home,
        subgroup: [
            {
                title: 'Home Decoration',
                links: [
                    { name: 'Curtains', href: '/products?category=home&q=curtains' },
                    { name: 'Wall Art', href: '/products?category=home&q=art' },
                    { name: 'Lighting', href: '/products?category=home&q=lighting' },
                ]
            },
            {
                title: 'Small Appliances',
                links: [
                    { name: 'Blenders', href: '/products?category=home&q=blenders' },
                    { name: 'Air Fryers', href: '/products?category=home&q=fryers' },
                    { name: 'Kettles', href: '/products?category=home&q=kettles' },
                ]
            }
        ]
    },
    {
        id: 'gaming',
        name: 'Gaming',
        icon: Gamepad2,
        subgroup: [
            {
                title: 'Consoles',
                links: [
                    { name: 'PlayStation', href: '/products?category=gaming&q=ps5' },
                    { name: 'Nintendo Switch', href: '/products?category=gaming&q=nintendo' },
                    { name: 'Xbox', href: '/products?category=gaming&q=xbox' },
                ]
            },
            {
                title: 'Video Games',
                links: [
                    { name: 'PS5 Games', href: '/products?category=gaming&q=ps5-games' },
                    { name: 'PC Games', href: '/products?category=gaming&q=pc-games' },
                ]
            }
        ]
    }
];

export default function MegaMenu() {
    const [activeTab, setActiveTab] = useState<string | null>(CATEGORY_GROUPS[0].id);
    const { isAuthenticated, logout } = useAuthStore();

    const activeCategory = CATEGORY_GROUPS.find(c => c.id === activeTab);

    return (
        <div className="w-full bg-white dark:bg-slate-900 border-x border-b border-gray-100 dark:border-slate-800 shadow-2xl rounded-b-3xl overflow-hidden flex z-50 min-h-[500px] glass-menu">

            {/* LEFT RAIL: Parent Categories & Mobile Ported Actions */}
            <div className="w-1/4 bg-gray-50/50 dark:bg-slate-900/50 border-r border-gray-100 dark:border-slate-800 py-6 overflow-y-auto max-h-[600px] scrollbar-hide">

                {/* HIGHLIGHTED ACTIONS (Ported from Mobile) */}
                <div className="px-3 mb-6 space-y-1">
                    <Link href="/products?status=READY_TO_SHIP" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group text-rose-600">
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-wider">Ready to Ship</span>
                            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">Global Delivery</span>
                        </div>
                    </Link>
                    <Link href="/sourcing" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group text-violet-600">
                        <div className="p-2 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition-colors">
                            <Scan className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black uppercase tracking-wider">AI Sourcing</span>
                                <span className="text-[7px] bg-violet-600 text-white px-1 rounded-full">NEW</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">Fine anything</span>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-2">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Categories</span>
                </div>

                {CATEGORY_GROUPS.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeTab === category.id;

                    return (
                        <div
                            key={category.id}
                            onMouseEnter={() => setActiveTab(category.id)}
                            className={`flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 group ${isActive
                                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm border-y border-gray-100 dark:border-slate-700'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/30 dark:hover:bg-slate-800/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>
                                    {category.name}
                                </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                        </div>
                    );
                })}

                {/* MEMBER SPACE (Ported from Mobile) */}
                <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6">
                    <div className="px-6 mb-3">
                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Member Space</span>
                    </div>

                    <div className="px-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group">
                                    <Package className="w-4 h-4 text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">My Orders</span>
                                </Link>
                                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group">
                                    <User className="w-4 h-4 text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Dashboard</span>
                                </Link>
                                <button onClick={() => logout()} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group w-full text-left">
                                    <LogOut className="w-4 h-4 text-red-400" />
                                    <span className="text-sm font-bold text-red-500 dark:text-red-400">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <div className="px-4 py-2">
                                <Link href="/login" className="block w-full text-center bg-gray-900 dark:bg-pink-600 text-white text-[10px] font-black py-2.5 rounded-xl hover:bg-black dark:hover:bg-pink-700 transition-all">SIGN IN</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Sub-categories + Support + Socials */}
            <div className="w-3/4 flex flex-col dark:bg-slate-900">
                <div className="p-10 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-3 gap-12"
                        >
                            {activeCategory?.subgroup.map((group, idx) => (
                                <div key={idx} className="space-y-5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 border-b border-gray-100 dark:border-slate-800 pb-3">
                                        {group.title}
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                        {group.links.map((link, lIdx) => (
                                            <Link
                                                key={lIdx}
                                                href={link.href}
                                                className="text-[13px] font-bold text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:translate-x-1.5 transition-all flex items-center gap-2 group/link"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-slate-800 group-hover/link:bg-pink-400 transition-colors" />
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* BOTTOM UTILITY / FOOTER AREA (Ported from Mobile Menu) */}
                <div className="bg-gray-50/80 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800 p-8 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        {/* Support Link */}
                        <Link href="/faq" className="flex items-center gap-3 group">
                            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:bg-pink-50 dark:group-hover:bg-pink-950/20 transition-colors">
                                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900 dark:text-white">Support & Help</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-600 font-bold">24/7 Assistance</span>
                            </div>
                        </Link>

                        {/* Theme Toggle (Desktop Friendly Version) */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Social Links (Ported from Mobile) */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Follow us on Instagram"
                            className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-all hover:scale-110"
                        >
                            <Instagram size={18} />
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Follow us on TikTok"
                            className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all hover:scale-110"
                        >
                            <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                        </a>
                        <a
                            href="https://trustpilot.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Rate us on Trustpilot"
                            className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all hover:scale-110"
                        >
                            <Star size={18} />
                        </a>
                    </div>

                    <Link
                        href="/products?status=FLASH_DEAL"
                        className="bg-pink-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 uppercase"
                    >
                        View Weekly Deals
                    </Link>
                </div>
            </div>
        </div>
    );
}
