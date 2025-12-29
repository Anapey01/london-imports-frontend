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
    bgGradient: string;
    image?: string;
}

const slides: Slide[] = [
    {
        id: 1,
        title: "New Year, New Drops",
        subtitle: "Pre-order the latest gadgets before they land in Ghana",
        ctaText: "Shop Pre-orders",
        ctaLink: "/products",
        bgGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    },
    {
        id: 2,
        title: "Fashion Week Deals",
        subtitle: "Reserve trendy clothing & accessories at amazing prices",
        ctaText: "Shop Fashion",
        ctaLink: "/products?category=fashion",
        bgGradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
        id: 3,
        title: "Tech Essentials",
        subtitle: "Phones, laptops & gadgets - shipped straight to your door",
        ctaText: "Shop Electronics",
        ctaLink: "/products?category=electronics",
        bgGradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
        id: 4,
        title: "Home & Living",
        subtitle: "Transform your space with quality home products",
        ctaText: "Shop Home",
        ctaLink: "/products?category=home",
        bgGradient: "from-amber-400 via-orange-500 to-red-500",
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

            {/* Slides Container */}
            <div
                className="relative h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px]"
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
                            className={`h-full w-full bg-gradient-to-r ${slide.bgGradient} flex items-center`}
                        >
                            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                                <div className="max-w-lg">
                                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
                                        {slide.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-5 drop-shadow max-w-md">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.ctaLink}
                                        className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all text-xs sm:text-sm shadow-lg"
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
