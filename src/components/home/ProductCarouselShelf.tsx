'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { Product } from '@/stores/cartStore';
import { cleanProductName } from '@/lib/format';

interface ProductCarouselShelfProps {
    title: string;
    products: Product[];
}

export default function ProductCarouselShelf({ title, products = [] }: ProductCarouselShelfProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons();
            // Recalculate on window resize
            window.addEventListener('resize', checkScrollButtons);
        }
        return () => {
            container?.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [products]);

    if (products.length === 0) return null;

    const isFewItems = products.length <= 4;

    return (
        <section className="w-full bg-white dark:bg-slate-900 border-y border-slate-100/60 dark:border-slate-800/50 py-8 my-4 relative overflow-hidden group/shelf">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                            {title}
                        </h2>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {products.length} {products.length === 1 ? 'item' : 'picks'}
                        </span>
                    </div>

                    {!isFewItems && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className={`w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200 transition-all focus:outline-none ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 active:scale-95'}`}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className={`w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200 transition-all focus:outline-none ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 active:scale-95'}`}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content: Balanced Grid when few items, Smooth Carousel when many items */}
                {isFewItems ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-1">
                        {products.map((product) => {
                            const imageUrl = getImageUrl(product.image);
                            const isReady = product.preorder_status === 'READY_TO_SHIP';
                            return (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="group block bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3 transition-all duration-300 hover:shadow-xs flex flex-col justify-between"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square w-full rounded-xl bg-white dark:bg-slate-950 p-3 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800/50 mb-2.5">
                                        <Image
                                            src={imageUrl}
                                            alt=""
                                            aria-hidden="true"
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                                            className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                                        />
                                        <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isReady ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                                            {isReady ? 'Ready to Ship' : 'Pre-order'}
                                        </span>
                                    </div>
                                    {/* Info */}
                                    <div className="flex flex-col flex-1 justify-between">
                                        <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-[#006B5A] dark:group-hover:text-emerald-400 transition-colors">
                                            {cleanProductName(product)}
                                        </p>
                                        {Boolean(product.price) && (
                                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                                                GH₵ {Number(product.price).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-thin scroll-smooth px-1 pb-2 no-scrollbar"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {products.map((product) => {
                            const imageUrl = getImageUrl(product.image);
                            const isReady = product.preorder_status === 'READY_TO_SHIP';
                            return (
                                <div
                                    key={product.id}
                                    className="w-[155px] sm:w-[185px] md:w-[210px] lg:w-[220px] flex-shrink-0 scroll-snap-align-start flex flex-col justify-between"
                                >
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="group block bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3 transition-all duration-300 hover:shadow-xs flex flex-col h-full justify-between"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square w-full rounded-xl bg-white dark:bg-slate-950 p-2.5 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800/50 mb-2">
                                            <Image
                                                src={imageUrl}
                                                alt=""
                                                aria-hidden="true"
                                                fill
                                                sizes="(max-width: 640px) 155px, (max-width: 1024px) 210px, 220px"
                                                className="object-contain group-hover:scale-105 transition-transform duration-300 p-1.5"
                                            />
                                            <span className={`absolute top-1.5 left-1.5 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${isReady ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                                                {isReady ? 'In Stock' : 'Pre-order'}
                                            </span>
                                        </div>
                                        {/* Info */}
                                        <div className="flex flex-col flex-1 justify-between">
                                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-[#006B5A] dark:group-hover:text-emerald-400 transition-colors min-h-[32px]">
                                                {cleanProductName(product)}
                                            </p>
                                            {Boolean(product.price) && (
                                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                                                    GH₵ {Number(product.price).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
