/**
 * London's Imports - Hero Carousel
 * Minimalist Editorial Pro Redesign
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSlide {
    id: string | number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    bgClass?: string;
    isProduct?: boolean;
}

interface Product {
    id: string | number;
    name: string;
    slug: string;
    image?: string;
    category_name?: string;
}

interface Banner {
    id: string | number;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image: string;
}

interface HeroCarouselProps {
    initialProducts?: Product[];
    initialBanners?: Banner[];
}

export default function HeroCarousel({ initialProducts = [], initialBanners = [] }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // 1. Construct Slides from Banners or Products
    const slides: HeroSlide[] = useMemo(() => {
        if (initialBanners && initialBanners.length > 0) {
            return initialBanners.map(banner => ({
                id: banner.id,
                title: banner.title || "Promotional Drop",
                subtitle: banner.subtitle || "The latest curations from our global sourcing network.",
                ctaText: banner.cta_text || "Shop Collection",
                ctaLink: banner.cta_link || "/products",
                image: banner.image,
                bgClass: "bg-white"
            }));
        }

        // Fallback to Products if no banners exist
        return initialProducts.slice(0, 5).map(product => ({
            id: product.id,
            title: product.name,
            subtitle: product.category_name || "New Arrival",
            ctaText: "Shop Now",
            ctaLink: `/products/${product.slug}`,
            image: product.image || "/assets/images/placeholder.webp",
            bgClass: "bg-white",
            isProduct: true
        }));
    }, [initialBanners, initialProducts]);

    const nextSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [nextSlide, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden bg-white border-b border-slate-100 dark:border-slate-900">
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        >
                            <div className={`h-full w-full flex items-center relative overflow-hidden ${slide.bgClass} dark:bg-slate-950`}>
                                {/* 1. Editorial Text - Left Aligned Composition */}
                                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full relative z-20 flex flex-col items-start pt-12 md:pt-0">
                                    <div className="max-w-xl animate-fade-in">
                                        <div className="mb-6 overflow-hidden">
                                            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-4 animate-slide-right">
                                                London&apos;s Imports / 0{index + 1}
                                            </span>
                                            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-8 max-w-md">
                                                {slide.title}
                                            </h2>
                                            <p className="text-sm md:text-lg text-slate-400 dark:text-slate-500 font-medium leading-relaxed max-w-sm mb-12">
                                                {slide.subtitle}
                                            </p>
                                            <Link
                                                href={slide.ctaLink}
                                                className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white border-b border-slate-900 dark:border-white pb-2 hover:opacity-60 transition-all"
                                            >
                                                {slide.ctaText}
                                                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Image Layer - Professional Positioning */}
                                <div className="absolute inset-0 z-10 pointer-events-none opacity-20 sm:opacity-100">
                                     <div className="absolute right-0 top-0 h-full w-full sm:w-[50%] overflow-hidden">
                                        <Image
                                            src={getImageUrl(slide.image)}
                                            alt={slide.title}
                                            fill
                                            className={`object-cover object-center`}
                                            priority={index === 0}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            quality={90}
                                        />
                                     </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls - Thin Lines */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-12 flex gap-4 z-40">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-[1px] transition-all duration-700 ${index === currentSlide ? 'w-12 bg-slate-900 dark:bg-white' : 'w-6 bg-slate-200 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-600'}`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ArrowUpRight({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}

import { useMemo } from 'react';
import { getImageUrl } from '@/lib/image';
