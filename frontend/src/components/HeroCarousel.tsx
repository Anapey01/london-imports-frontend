/**
 * London's Imports - Hero Carousel
 * Amazon-style animated slideshow with left/right navigation
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bgColor: string;
    bgImage?: string;
}

const slides: Slide[] = [
    {
        id: 1,
        title: "New Year, New Drops",
        subtitle: "Pre-order the latest gadgets before they land in Ghana",
        ctaText: "Shop Pre-orders",
        ctaLink: "/products",
        bgColor: "#a3e635", // Lime green like Amazon
        bgImage: "/banners/banner-1.jpg",
    },
    {
        id: 2,
        title: "Fashion Week Deals",
        subtitle: "Reserve trendy clothing & accessories at amazing prices",
        ctaText: "Shop Fashion",
        ctaLink: "/products?category=fashion",
        bgColor: "#f472b6", // Pink
        bgImage: "/banners/banner-2.jpg",
    },
    {
        id: 3,
        title: "Tech Essentials",
        subtitle: "Phones, laptops & gadgets - shipped straight to your door",
        ctaText: "Shop Electronics",
        ctaLink: "/products?category=electronics",
        bgColor: "#818cf8", // Indigo
        bgImage: "/banners/banner-3.jpg",
    },
    {
        id: 4,
        title: "Home & Living",
        subtitle: "Transform your space with quality home products",
        ctaText: "Shop Home",
        ctaLink: "/products?category=home",
        bgColor: "#fb923c", // Orange
        bgImage: "/banners/banner-4.jpg",
    },
];


export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 5 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    // Touch/swipe support
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
        }
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient fade edges - Amazon style */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black/20 to-transparent z-[5] pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black/20 to-transparent z-[5] pointer-events-none" />

            {/* Slides Container - Taller like Amazon */}
            <div
                className="relative h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide
                                ? 'translate-x-0'
                                : index < currentSlide
                                    ? '-translate-x-full'
                                    : 'translate-x-full'
                            }`}
                    >
                        <div
                            className="h-full w-full flex items-center relative overflow-hidden"
                            style={{ backgroundColor: slide.bgColor }}
                        >
                            {/* Background pattern/decoration */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-4 right-4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/30 rounded-full blur-3xl" />
                                <div className="absolute bottom-4 right-24 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-2xl" />
                            </div>

                            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                                <div className="max-w-lg">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg leading-tight">
                                        {slide.title}
                                    </h2>
                                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 drop-shadow max-w-md">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.ctaLink}
                                        className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm sm:text-base shadow-lg"
                                    >
                                        {slide.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Amazon style */}
            <button
                onClick={() => {
                    prevSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 flex items-center justify-center bg-transparent hover:bg-black/10 transition-colors z-10 group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
                onClick={() => {
                    nextSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 flex items-center justify-center bg-transparent hover:bg-black/10 transition-colors z-10 group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? 'bg-white w-5'
                            : 'bg-white/50 w-2 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
