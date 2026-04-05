/**
 * London's Imports - Wishlist Page
 * Refined 'Lux Sans' Redesign: High-end collection view with wide-tracked typography.
 */
'use client';

import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
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
            <div className="min-h-screen bg-surface pt-32 pb-20 flex justify-center selection:bg-emerald-100">
                <div className="w-8 h-8 border-4 border-content-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface pt-24 pb-32 transition-all duration-500 selection:bg-emerald-100 relative backdrop-blur-sm">
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* EDITORIAL HEADER - LUX SANS */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-brand-emerald/30" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-emerald">
                                Curated Collection
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-[0.05em] uppercase text-content-primary leading-none">
                            Saved <span className="text-content-secondary font-light italic font-serif">Portfolio</span>
                        </h1>
                    </div>
                    <div className="text-right border-l md:border-l-0 md:border-r border-border-standard pl-6 md:pl-0 md:pr-6 py-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-content-secondary block mb-1">Total Assets</span>
                        <span className="text-2xl font-black text-content-primary tracking-widest uppercase italic">
                            {items.length} units
                        </span>
                    </div>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-surface-card rounded-full flex items-center justify-center mb-8 border border-border-standard">
                            <Heart className="w-10 h-10 text-content-secondary opacity-30" strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-content-primary mb-4">Collection Empty.</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-content-secondary max-w-xs mb-12">
                            Save the styles you love to your wishlist and find them here later.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-4 bg-content-primary text-surface px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:opacity-90 transition-all hover:scale-[1.02]"
                        >
                            Continue Shopping <ArrowLeft className="w-4 h-4 rotate-180" />
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

                <div className="mt-24 pt-12 border-t border-border-standard">
                    <p className="text-xs font-black text-content-primary leading-relaxed uppercase tracking-[0.2em] italic">
                        Personal procurement portfolio. London's Imports Global Hub 2026. Data encrypted via SSL-SHA256.
                    </p>
                </div>
            </div>
        </div>
    );
}
