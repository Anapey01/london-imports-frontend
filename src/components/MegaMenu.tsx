'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
    Shirt,
    Zap,
    Scan,
    Sun,
    Wind,
    Tv,
    ShoppingBag,
    Briefcase,
    ChevronRight,
    HelpCircle,
    User,
    UserPlus,
    Footprints,
    Droplet,
    Utensils,
    Crown,
    Instagram,
    Star,
    LayoutGrid,
    Package,
    Gem,
    Sparkles,
    Smartphone,
    IceCream,
} from 'lucide-react';

export const CATEGORY_GROUPS = [
    { id: 'all', name: 'PRODUCTS', icon: LayoutGrid },
    { id: 'lightenings', name: 'Lightenings', icon: Sun },
    { id: 'kids-shoes', name: 'Kids shoes', icon: Footprints },
    { id: 'Rooms', name: 'Air care products', icon: Wind },
    { id: 'electronic-appliances', name: 'Electronic Appliances', icon: Tv },
    { id: 'shein-ladies-dress-bale', name: 'SHEIN ladies dress bale', icon: Package },
    { id: 'perfumes', name: 'Arabian perfumes', icon: Droplet },
    { id: 'kitchen-appliances', name: 'Home and kitchen', icon: Utensils },
    { id: 'outfits', name: 'Outfits', icon: Shirt },
    { id: 'business-finance-books', name: 'Business & Finance', icon: Briefcase },
    { id: 'hair-and-accessories', name: 'Hair and accessories', icon: Crown },
    { id: 'bags', name: 'Bags', icon: ShoppingBag },
    { id: 'accessories', name: 'Jewelry and accessories', icon: Gem },
    { id: 'body-care-and-beauty', name: 'Body care and beauty', icon: Sparkles },
    { id: 'heels-and-shoes', name: 'Heels and shoes', icon: Footprints },
    { id: 'snacks', name: 'Snacks', icon: IceCream },
    { id: 'mobile-phones-and-gadgets', name: 'Mobile phones and gadgets', icon: Smartphone },
];

export default function MegaMenu() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div
            className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden flex z-50 max-h-[calc(100vh-110px)] min-h-[500px] w-[280px]"
        >
            {/* JUMIA-STYLE CARET/POINTER */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-slate-900 border-t border-l border-gray-100 dark:border-slate-800 rotate-45 z-[-1]" />


            {/* LEFT RAIL: Parent Categories & Top Actions */}
            <div className="w-[280px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-50 dark:border-slate-800 py-4 flex flex-col">

                {/* LOGIN / ACCOUNT SECTION */}
                <div className="px-3 mb-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <User className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Welcome</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">My Account</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Link href="/login" className="flex items-center justify-between px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 transition-transform" strokeWidth={1.5} />
                                    <span className="text-[13px] font-bold uppercase tracking-wider">Login</span>
                                </div>
                                <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                            </Link>
                            <Link href="/signup" className="flex items-center justify-between px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="w-5 h-5 transition-transform" strokeWidth={1.5} />
                                    <span className="text-[13px] font-bold uppercase tracking-wider">Sign Up</span>
                                </div>
                                <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* HIGHLIGHTED ACTIONS */}
                <div className="px-3 mb-2 space-y-1">
                    <Link href="/products?status=READY_TO_SHIP" className="flex items-center justify-between px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                            <span className="text-[13px] font-bold">Ready to Ship</span>
                        </div>
                        <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/sourcing" className="flex items-center justify-between px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-3">
                            <Scan className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold">AI Sourcing</span>
                                <span className="text-[8px] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-black uppercase">NEW</span>
                            </div>
                        </div>
                        <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="h-px bg-gray-50 dark:bg-slate-800 mx-6 mb-4" />

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {CATEGORY_GROUPS.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.id}`}
                                className="flex items-center justify-between px-6 py-2.5 cursor-pointer transition-all group text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 transition-transform" strokeWidth={1.5} />
                                    <span className="text-[13px] font-bold">
                                        {category.name}
                                    </span>
                                </div>
                                <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                            </Link>
                        );
                    })}
                </div>

                {/* BOTTOM UTILITY (Internal to Rail) */}
                <div className="mt-auto border-t border-gray-50 dark:border-slate-800 pt-4 px-3 pb-2 flex flex-col gap-3">
                    <Link href="/faq" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group">
                        <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-pink-500" />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Help Center</span>
                    </Link>

                    {/* SOCIAL MEDIA ICONS (Synced with Footer) */}
                    <div className="flex items-center justify-between px-4 pb-2">
                        <a
                            href="https://www.instagram.com/londonimportsghana"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            title="Instagram"
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@londons_imports1"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            title="TikTok"
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.snapchat.com/add/londons_imports"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Snapchat"
                            title="Snapchat"
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-[#FFCC00] hover:bg-yellow-50 transition-all"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.trustpilot.com/review/londonsimports.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Trustpilot"
                            title="Trustpilot"
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                        >
                            <Star className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
