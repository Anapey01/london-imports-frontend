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
            {/* Slides Container */}
            <div
                className="relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-transform duration-500 ease-out ${index === currentSlide
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
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                                        {slide.title}
                                    </h2>
                                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 drop-shadow">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.ctaLink}
                                        className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all text-sm sm:text-base shadow-lg"
                                    >
                                        {slide.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => {
                    prevSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>
            <button
                onClick={() => {
                    nextSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
