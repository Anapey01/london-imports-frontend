/**
 * London's Imports - Hero Carousel
 * Amazon-style animated slideshow with product images on pastel backgrounds
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bgImage: string;
}

const slides: Slide[] = [
    {
        id: 1,
        title: "New Year, New Drops",
        subtitle: "Pre-order the latest fashion before they land",
        ctaText: "Shop now",
        ctaLink: "/products",
        bgImage: "/banners/banner-1.png",
    },
    {
        id: 2,
        title: "Fashion for less",
        subtitle: "Trendy dresses & shoes at amazing prices",
        ctaText: "See all deals",
        ctaLink: "/products?category=fashion",
        bgImage: "/banners/banner-2.png",
    },
    {
        id: 3,
        title: "Tech Essentials",
        subtitle: "Phones, laptops & gadgets delivered to you",
        ctaText: "Shop electronics",
        ctaLink: "/products?category=electronics",
        bgImage: "/banners/banner-3.png",
    },
    {
        id: 4,
        title: "Home & Living",
        subtitle: "Quality cooking utensils for your kitchen",
        ctaText: "Shop home",
        ctaLink: "/products?category=home",
        bgImage: "/banners/banner-4.png",
    },
];


export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-play every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

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
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            } else {
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            }
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
                    <Link
                        key={slide.id}
                        href={slide.ctaLink}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out cursor-pointer ${index === currentSlide
                                ? 'translate-x-0'
                                : index < currentSlide
                                    ? '-translate-x-full'
                                    : 'translate-x-full'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="relative h-full w-full">
                            <Image
                                src={slide.bgImage}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />

                            {/* Text Overlay on Left */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                                    <div className="max-w-sm">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                                            {slide.title}
                                        </h2>
                                        <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3">
                                            {slide.subtitle}
                                        </p>
                                        <span className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium">
                                            {slide.ctaText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Dot Indicators - No arrows, Amazon style */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            goToSlide(index);
                        }}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-gray-800 w-6'
                                : 'bg-gray-400 w-2 hover:bg-gray-600'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
