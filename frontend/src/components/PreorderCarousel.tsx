/**
 * PreorderCarousel - Responsive carousel for upcoming drops
 * Auto-scrolls and allows manual navigation
 */
'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface PreorderCarouselProps {
    products: any[];
}

export default function PreorderCarousel({ products }: PreorderCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of view width
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    // Auto-scroll functionality
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (!isPaused && products.length > 4) { // Only auto-scroll if enough items
            interval = setInterval(() => {
                if (scrollContainerRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                    const isEnd = scrollLeft + clientWidth >= scrollWidth - 5;

                    if (isEnd) {
                        // Reset to start smoothly
                        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scroll next
                        scroll('right');
                    }
                }
            }, 5000); // 5 seconds per slide
        }

        return () => clearInterval(interval);
    }, [isPaused, products.length]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            // Initial check
            checkScrollButtons();
        }
        return () => container?.removeEventListener('scroll', checkScrollButtons);
    }, []);

    if (products.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
                <p className="text-slate-500 mb-4">No upcoming drops at the moment.</p>
                <p className="text-slate-400 text-sm">Check back soon!</p>
            </div>
        );
    }

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Navigation Buttons */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-700 hover:text-pink-500 hover:border-pink-200 transition-all focus:outline-none hidden md:flex"
                    aria-label="Previous items"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-700 hover:text-pink-500 hover:border-pink-200 transition-all focus:outline-none hidden md:flex"
                    aria-label="Next items"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Gradient Fade Masks (Premium Touch) */}
            <div className={`absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 px-4 md:px-1 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[85vw] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-shrink-0 snap-center md:snap-start transform transition-transform duration-300"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Mobile Progress Indicator */}
            <div className="flex justify-center gap-1.5 mt-2 md:hidden">
                {products.slice(0, 5).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-pink-500' : 'w-1.5 bg-slate-200'}`}
                    />
                ))}
            </div>
        </div>
    );
}
