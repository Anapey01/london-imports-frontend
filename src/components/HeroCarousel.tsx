/**
 * London's Imports - Hero Carousel
 * Refined 'Perceivable' Editorial Hardening
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, cloudinaryLoader } from '@/lib/image';
import { trackViewPromotion, trackSelectPromotion } from '@/lib/analytics';

interface HeroSlide {
    id: string | number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    bgClass?: string;
    isProduct?: boolean;
    creative?: string;
}

interface Product {
    id: string | number;
    name: string;
    short_name?: string;
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
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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
                bgClass: "bg-surface"
            }));
        }

        // Fallback to Products if no banners exist - SHUFFLED DYNAMIC POOL
        // Using a simple shuffle to ensure "all the product" eventually gets hero exposure
        const shuffled = [...initialProducts].sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, 7).map((product, idx) => ({
            id: product.id,
            title: product.short_name || product.name,
            subtitle: product.category_name || "New Arrival / Top Tier Sourcing",
            ctaText: "Source Now",
            ctaLink: `/products/${product.slug}`,
            image: product.image || "/assets/placeholder-product.png",
            bgClass: "bg-surface",
            isProduct: true,
            creative: `product_hero_fallback_${idx + 1}`
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
        if (slides.length <= 1 || isPaused || isHovered) return;
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [nextSlide, slides.length, isPaused, isHovered]);
    
    // 2. Track Promotion View on Slide Change - God-tier Analysis
    useEffect(() => {
        if (slides[currentSlide]) {
            trackViewPromotion({
                id: slides[currentSlide].id.toString(),
                name: slides[currentSlide].title,
                creative: slides[currentSlide].creative || "marketing_banner",
                position: `hero_slot_${currentSlide + 1}`
            });
        }
    }, [currentSlide, slides]);

    return (
        <div 
            className="relative w-full max-w-7xl mx-auto overflow-hidden bg-surface border-b border-border-standard group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
        >
            {/* 0. SEO Authority Header - Visually Hidden H1 for WCAG 1.3.1 */}
            <h1 className="sr-only">London&apos;s Imports - Premium China to Ghana Sourcing &amp; Mini-Importation Hub</h1>

            <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto z-20 visible' : 'opacity-0 pointer-events-none z-10 invisible'}`}
                        >
                            <div className={`h-full w-full flex items-center relative overflow-hidden ${slide.bgClass}`}>
                                {/* 1. Editorial Text - Left Aligned Composition */}
                                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full relative z-20 flex flex-col items-start pt-12 md:pt-0">
                                    <div className="max-w-xl animate-fade-in">
                                        <div className="mb-6 overflow-hidden">
                                            {/* 'Perceivable' Hardened: Removed opacity for absolute 4.5:1 contrast */}
                                            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary mb-4 animate-slide-right">
                                                London&apos;s Imports / 0{index + 1}
                                            </span>
                                            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-bold text-content-primary leading-[0.9] tracking-tighter mb-8 max-w-md">
                                                {slide.title}
                                            </h2>
                                            {/* 'Perceivable' Hardened: Solid text for subtitle readability */}
                                            <p className="text-sm md:text-lg text-content-secondary font-medium leading-relaxed max-w-sm mb-12 italic">
                                                {slide.subtitle}
                                            </p>
                                            <Link
                                                href={slide.ctaLink}
                                                onClick={() => {
                                                    trackSelectPromotion({
                                                        id: slide.id.toString(),
                                                        name: slide.title,
                                                        creative: slide.creative || "marketing_banner",
                                                        position: `hero_slot_${index + 1}`
                                                    });
                                                }}
                                                className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-content-primary border-b border-current pb-2 hover:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm"
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
                                            loader={cloudinaryLoader}
                                            src={getImageUrl(slide.image)}
                                            alt={slide.title}
                                            fill
                                            className="object-cover object-center"
                                            priority={index === 0}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
                                            quality={80}
                                        />
                                     </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination & Timing Controls - 'Operable' Hardened 2.2.2 */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-12 flex items-center gap-8 z-40">
                    <div className="flex gap-4">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-0.5 transition-all duration-700 institutional-focus rounded-full outline-none ${index === currentSlide ? 'w-12 bg-content-primary' : 'w-6 bg-content-secondary/20 hover:bg-content-secondary'}`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Industrial Pause/Play Protocol */}
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary hover:text-content-primary transition-colors institutional-focus flex items-center gap-3 px-2"
                        aria-label={isPaused ? "Play Carousel" : "Pause Carousel"}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {isPaused ? 'RESUME' : 'PAUSE'}
                    </button>
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
