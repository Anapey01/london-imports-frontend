/**
 * London's Imports - Wishlist Page
 * Refined 'Lux Sans' Redesign: High-end collection view with wide-tracked typography.
 */
'use client';

import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
    const { items } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20 flex justify-center selection:bg-emerald-100">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-32 transition-all duration-500 selection:bg-emerald-100 relative">
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* EDITORIAL HEADER - LUX SANS */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-emerald-600/30" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 dark:text-emerald-400">
                                Curated Collection
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-[0.05em] uppercase text-slate-900 dark:text-white leading-none">
                            Saved <span className="text-slate-300 dark:text-slate-700 font-light italic font-serif">Portfolio</span>
                        </h1>
                    </div>
                    <div className="text-right border-l md:border-l-0 md:border-r border-slate-100 dark:border-slate-800 pl-6 md:pl-0 md:pr-6 py-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">Total Assets</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase italic">
                            {items.length} units
                        </span>
                    </div>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8">
                            <Heart className="w-10 h-10 text-slate-200" strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">Portfolio Empty.</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 max-w-xs mb-12">
                            Secure your interests by saving products to your curated portfolio.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
                        >
                            Explore Global Hub <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {items.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                hideProgress={true}
                                hideRating={true}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-24 pt-12 border-t border-slate-50 dark:border-slate-900 opacity-40">
                    <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest italic grayscale">
                        Personal procurement portfolio. London's Imports Global Hub 2026. Data encrypted via SSL-SHA256.
                    </p>
                </div>
            </div>
        </div>
    );
}
