/**
 * London's Imports - Hero Carousel
 * Amazon-style animated slideshow with DYNAMIC product images from database
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useQuery } from '@tanstack/react-query'; // Removed for optimization
// import { productsAPI } from '@/lib/api'; // Removed for optimization

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bgClass: string;
    textClass: string;
    categorySlug?: string;
    heroImage?: string; // Static promotional image for the slide
    heroImages?: string[]; // Array of images to alternate
    blendMode?: string; // Optional CSS blend mode
    objectFit?: "object-cover" | "object-contain"; // Optional object fit style
    enableGradientMask?: boolean; // Enable fading mask for seamless blending
}

const slideTemplates: Slide[] = [
    {
        id: 1,
        title: "New Year, New Drops",
        subtitle: "Pre-order the latest fashion before they land",
        ctaText: "Shop now",
        ctaLink: "/products",
        bgClass: "bg-[#d1fae5]", // Mint green
        textClass: "text-[#064e3b]",
        heroImage: "/assets/images/newyear-drop.webp", // Optimized WebP
        blendMode: "mix-blend-multiply"
    },
    {
        id: 2,
        title: "Home & Living",
        subtitle: "Quality home products for your space",
        ctaText: "Shop home",
        ctaLink: "/products?category=kitchen-appliances",
        bgClass: "bg-[#795c3e]", // Darker brown for better contrast with white text
        textClass: "text-[#ffffff]",
        categorySlug: "kitchen-appliances",
        heroImages: [
            "/assets/images/home-living-1.webp",
            "/assets/images/home-living-2.webp"
        ],
        blendMode: "mix-blend-multiply",
        objectFit: "object-contain"
    },
    {
        id: 3,
        title: "Fashion for less",
        subtitle: "Trendy dresses & shoes at amazing prices",
        ctaText: "See all deals",
        ctaLink: "/products?category=outfits",
        bgClass: "bg-[#c1c1c1]", // Exact match from image (193,193,193)
        textClass: "text-[#1f2937]", // Dark gray for legibility on light background
        categorySlug: "outfits",
        heroImage: "/assets/images/fashion-for-less.webp", // Now 30KB instead of 668KB!
        blendMode: "mix-blend-normal",
        objectFit: "object-cover",
        enableGradientMask: true
    },
    {
        id: 4,
        title: "Tech Essentials",
        subtitle: "Phones, laptops & gadgets delivered to you",
        ctaText: "Shop electronics",
        ctaLink: "/products?category=mobile-phones-and-gadgets",
        bgClass: "bg-[#0f2b9e]", // Vibrant Blue
        textClass: "text-[#ffffff]",
        categorySlug: "mobile-phones-and-gadgets",
        heroImages: [
            "/assets/images/tech-essentials.webp"
        ],
        blendMode: "mix-blend-normal", // Normal blend for dark image on dark bg
        objectFit: "object-cover",
        enableGradientMask: true
    },
];

// Product type for proper typing
interface Product {
    id: string | number;
    name: string;
    primary_image?: string;
    category?: { slug: string };
}

interface HeroCarouselProps {
    initialProducts?: Product[];
}

export default function HeroCarousel({ initialProducts = [] }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Track slide visit count to alternate images on multi-image slides
    const [slideVisits, setSlideVisits] = useState<Record<number, number>>({});

    // Use initialProducts passed from server (SSG/ISR)
    // We remove the client-side fetch to save bundle size since 20 items are plenty for a carousel
    const products = initialProducts;

    // Get random products for displaying on slides
    const getProductsForSlide = (slideIndex: number, count: number = 4) => {
        if (products.length === 0) return [];

        const template = slideTemplates[slideIndex];
        let slideProducts = products;

        // Filter by category if available
        if (template.categorySlug) {
            const filtered = products.filter((p: Product) =>
                p.category?.slug === template.categorySlug
            );
            if (filtered.length > 0) slideProducts = filtered;
        }

        // For initial render (SSR/Hydration), we MUST be deterministic
        // We'll just take the top products until the client-side effect kicks in (if we wanted to shuffle)
        // For now, let's just use a stable slice. Shuffling during render is a crime in Next.js.
        return slideProducts.slice(0, count);
    };

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => {
            const next = (prev + 1) % slideTemplates.length;
            // Update visit count for the new slide
            setSlideVisits(visits => ({
                ...visits,
                [slideTemplates[next].id]: (visits[slideTemplates[next].id] || 0) + 1
            }));
            return next;
        });
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setSlideVisits(visits => ({
            ...visits,
            [slideTemplates[index].id]: (visits[slideTemplates[index].id] || 0) + 1
        }));
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
                setCurrentSlide((prev) => (prev + 1) % slideTemplates.length);
            } else {
                setCurrentSlide((prev) => (prev - 1 + slideTemplates.length) % slideTemplates.length);
            }
        }
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden sm:rounded-xl shadow-2xl mt-4">
            {/* Slides Container */}
            <div
                className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slideTemplates.map((slide, index) => {
                    const slideProducts = getProductsForSlide(index);

                    return (
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
                            <div
                                className={`h-full w-full flex items-center relative overflow-hidden ${slide.bgClass}`}
                            >
                                {/* Text Content - Left Side - Premium Styling */}
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-10 h-full flex items-center lg:items-start lg:pt-20">
                                    <div className="max-w-[50%] sm:max-w-xs md:max-w-sm">
                                        <h2
                                            className={`text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 leading-tight tracking-tight drop-shadow-sm ${slide.textClass}`}
                                        >
                                            {slide.title}
                                        </h2>
                                        <p
                                            className={`text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 opacity-90 font-medium ${slide.textClass}`}
                                        >
                                            {slide.subtitle}
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 bg-white text-black`}
                                        /* Note: Simplified CTA button for cleaner look, avoiding complex dynamic inversions */
                                        >
                                            {slide.ctaText}
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>




                                {/* Hero Image - Right Side */}
                                {(slide.heroImage || slide.heroImages) && (
                                    <>
                                        {/* CASE 1: Multiple Images (Home & Living) - Seamless Background */}
                                        {slide.heroImages ? (
                                            <div className={`absolute right-0 top-0 h-full w-[50%] sm:w-[45%] md:w-[40%] overflow-hidden ${slide.enableGradientMask ? '[mask-image:linear-gradient(to_right,transparent,black_20%)]' : ''
                                                }`}>
                                                {slide.heroImages.map((img, imgIndex) => (
                                                    <Image
                                                        key={img}
                                                        src={img}
                                                        alt={slide.title}
                                                        fill
                                                        className={`${slide.objectFit || 'object-contain'} object-right-bottom ${slide.blendMode || 'mix-blend-multiply'} transition-opacity duration-1000 ${imgIndex === ((slideVisits[slide.id] || 0) % slide.heroImages!.length)
                                                            ? 'opacity-100' // Opacity 100 for clear visibility
                                                            : 'opacity-0'
                                                            }`}
                                                        priority={index === 0}
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 40vw"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            /* CASE 2: Single Image (New Year Drop) - Model at Bottom */
                                            <div className={`absolute right-0 top-0 h-full w-[50%] sm:w-[45%] md:w-[40%] overflow-hidden pb-0 ${slide.enableGradientMask ? '[mask-image:linear-gradient(to_right,transparent,black)]' : ''
                                                }`}>
                                                <Image
                                                    src={slide.heroImage!}
                                                    alt={slide.title}
                                                    fill
                                                    className={`${slide.objectFit || 'object-contain'} object-right-bottom ${slide.blendMode || 'mix-blend-multiply'}`}
                                                    priority={index === 0}
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 40vw"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Dynamic Product Images - Right Side (Only when no heroImage) */}
                                <div className="absolute right-4 sm:right-8 md:right-16 lg:right-24 top-1/2 lg:top-[40%] -translate-y-1/2 hidden sm:flex items-center gap-2 md:gap-4">
                                    {slideProducts.slice(0, 3).map((product: Product, pIndex: number) => (
                                        <div
                                            key={product.id || pIndex}
                                            className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform 
                                                ${pIndex === 0 ? 'w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rotate-[-5deg]' : ''}
                                                ${pIndex === 1 ? 'w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-10' : ''}
                                                ${pIndex === 2 ? 'w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rotate-[5deg]' : ''}
                                            `}
                                        >
                                            {product.primary_image ? (
                                                <Image
                                                    src={product.primary_image}
                                                    alt={product.name}
                                                    fill
                                                    priority={index === 0}
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 33vw, 150px"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400"><span class="text-2xl">📦</span></div>';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                    <span className="text-2xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Dot Indicators - Hidden on Mobile, Visible on Desktop */}
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 hidden lg:flex gap-2 z-10">
                {slideTemplates.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            goToSlide(index);
                        }}
                        className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-800 ${index === currentSlide
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
