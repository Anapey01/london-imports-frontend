/**
 * London's Imports - Hero Carousel
 * Amazon-style animated slideshow with product images on pastel backgrounds
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
    bgColor: string; // Light pastel color
    textColor: string; // Dark text for contrast on light bg
}

const slides: Slide[] = [
    {
        id: 1,
        title: "New Year, New Drops",
        subtitle: "Pre-order the latest before they land in Ghana",
        ctaText: "Shop Pre-orders",
        ctaLink: "/products",
        bgColor: "#d1fae5", // Mint green (like Amazon toys slide)
        textColor: "#064e3b", // Dark green text
    },
    {
        id: 2,
        title: "Fashion for less",
        subtitle: "Trendy clothing & accessories at amazing prices",
        ctaText: "Shop Fashion",
        ctaLink: "/products?category=fashion",
        bgColor: "#fce7f3", // Light pink
        textColor: "#9d174d", // Dark pink text
    },
    {
        id: 3,
        title: "Tech Essentials",
        subtitle: "Phones, laptops & gadgets delivered to you",
        ctaText: "Shop Electronics",
        ctaLink: "/products?category=electronics",
        bgColor: "#e0e7ff", // Light indigo
        textColor: "#3730a3", // Dark indigo text
    },
    {
        id: 4,
        title: "Home & Living",
        subtitle: "Quality home products for your space",
        ctaText: "Shop Home",
        ctaLink: "/products?category=home",
        bgColor: "#fef3c7", // Light amber
        textColor: "#92400e", // Dark amber text
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
            {/* Slides Container - Amazon style */}
            <div
                className="relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px]"
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
                            {/* Decorative shapes for visual interest */}
                            <div className="absolute inset-0">
                                <div className="absolute top-8 right-8 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 rounded-full" />
                                <div className="absolute top-20 right-32 w-12 h-12 sm:w-20 sm:h-20 bg-white/15 rounded-full" />
                                <div className="absolute bottom-12 right-16 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full" />
                            </div>

                            <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full relative z-10">
                                <div className="max-w-md">
                                    <h2
                                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight"
                                        style={{ color: slide.textColor }}
                                    >
                                        {slide.title}
                                    </h2>
                                    <p
                                        className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-sm opacity-80"
                                        style={{ color: slide.textColor }}
                                    >
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.ctaLink}
                                        className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-gray-900 font-medium rounded hover:bg-gray-100 transition-all text-sm shadow-sm"
                                    >
                                        {slide.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtle Navigation Arrows - Amazon style (semi-transparent) */}
            <button
                onClick={() => {
                    prevSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-20 flex items-center justify-center bg-white/80 hover:bg-white rounded shadow-sm transition-all z-10"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
                onClick={() => {
                    nextSlide();
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-20 flex items-center justify-center bg-white/80 hover:bg-white rounded shadow-sm transition-all z-10"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-gray-600 w-5'
                                : 'bg-gray-400 w-2 hover:bg-gray-500'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
