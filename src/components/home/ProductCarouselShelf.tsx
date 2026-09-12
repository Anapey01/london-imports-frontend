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
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const overflow = scrollWidth > clientWidth + 5;
            setHasOverflow(overflow);
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
            window.addEventListener('resize', checkScrollButtons);
        }
        return () => {
            container?.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [products]);

    if (products.length === 0) return null;

    const isFew = products.length <= 2;

    return (
        <section className="w-full bg-white dark:bg-slate-900 border-y border-slate-100/60 dark:border-slate-800/50 py-8 my-4 relative overflow-hidden group/shelf">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`flex items-center ${isFew ? 'justify-between sm:justify-center' : 'justify-between'} mb-6 px-2`}>
                    <h2 className={`text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none ${isFew ? 'sm:text-center' : ''}`}>
                        {title}
                    </h2>

                    {hasOverflow && (
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
                    )}
                </div>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className={`flex gap-4 sm:gap-8 overflow-x-auto scrollbar-thin scroll-smooth px-2 pb-2 no-scrollbar ${isFew ? 'sm:justify-center' : ''}`}
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product) => {
                        const imageUrl = getImageUrl(product.image);
                        return (
                            <div
                                key={product.id}
                                className={`${isFew ? 'w-[140px] sm:w-[220px] md:w-[250px]' : 'w-[140px] sm:w-[160px]'} flex-shrink-0 scroll-snap-align-start flex flex-col justify-between`}
                            >
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="group block"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative aspect-square w-full bg-slate-50/60 dark:bg-slate-800/40 rounded-sm p-2 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt=""
                                            aria-hidden="true"
                                            fill
                                            sizes={isFew ? "(max-width: 640px) 140px, (max-width: 768px) 220px, 250px" : "(max-width: 640px) 140px, 160px"}
                                            className="object-contain hover:scale-105 transition-[transform,opacity] duration-500 ease-out p-2 opacity-0"
                                            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                        />
                                    </div>
                                    {/* Label */}
                                    <p className={`text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-normal mt-2 line-clamp-2 leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors min-h-[30px] ${isFew ? 'sm:text-center' : ''}`}>
                                        {cleanProductName(product)}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
