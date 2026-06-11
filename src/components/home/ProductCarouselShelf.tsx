'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { Product } from '@/stores/cartStore';

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

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm my-6 relative overflow-hidden group/shelf">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-[15px] font-black text-slate-950 dark:text-white uppercase tracking-wider leading-none">
                    {title}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200 transition-all focus:outline-none ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 active:scale-95'}`}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200 transition-all focus:outline-none ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 active:scale-95'}`}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-thin scroll-smooth px-2 pb-2 no-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {products.map((product) => {
                    const imageUrl = getImageUrl(product.image);
                    return (
                        <div
                            key={product.id}
                            className="w-[140px] sm:w-[160px] flex-shrink-0 scroll-snap-align-start flex flex-col justify-between"
                        >
                            <Link
                                href={`/products/${product.slug}`}
                                className="group block"
                            >
                                {/* Image Wrapper */}
                                <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950/40 p-4 flex items-center justify-center rounded-lg overflow-hidden border border-slate-100/50 dark:border-slate-800/30">
                                    <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 140px, 160px"
                                        className="object-contain hover:scale-105 transition-transform duration-300 p-2"
                                    />
                                </div>
                                {/* Label */}
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold tracking-tight mt-2 line-clamp-2 leading-snug group-hover:text-brand-emerald transition-colors min-h-[30px]">
                                    {product.name}
                                </p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
