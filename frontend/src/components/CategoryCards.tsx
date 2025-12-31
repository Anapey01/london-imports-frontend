/**
 * London's Imports - Category Cards
 * Responsive: Amazon Grid (Desktop) / Jumia Scroll (Mobile)
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

interface GridItem {
    name: string;
    image: string;
    link: string;
}

interface CategoryCard {
    title: string;
    slug: string;
    type: 'single' | 'quad';
    items: GridItem[];
    ctaText: string;
    ctaLink: string;
}

// Configuration for the Amazon Grid (Desktop)
const amazonGridConfig: CategoryCard[] = [
    {
        title: "Get your game on",
        slug: "electronics",
        type: "single",
        items: [
            { name: "Gaming", image: "/assets/cards/gadgets.png", link: "/products?category=electronics" }
        ],
        ctaText: "Shop gaming",
        ctaLink: "/products?category=electronics"
    },
    {
        title: "New home arrivals under $50",
        slug: "home",
        type: "quad",
        items: [
            { name: "Kitchen & Dining", image: "/assets/cards/home.png", link: "/products?category=home&q=kitchen" },
            { name: "Home Improvement", image: "/assets/cards/home.png", link: "/products?category=home&q=improvement" }, // Duplicate for now or use placeholders if distinct
            { name: "Decor", image: "/assets/cards/home.png", link: "/products?category=home&q=decor" },
            { name: "Bedding & Bath", image: "/assets/cards/home.png", link: "/products?category=home&q=bedding" }
        ],
        ctaText: "Shop the latest from Home",
        ctaLink: "/products?category=home"
    },
    {
        title: "Shop Fashion for less",
        slug: "fashion",
        type: "quad",
        items: [
            { name: "Jeans under $50", image: "/assets/cards/fashion.png", link: "/products?category=fashion&q=jeans" },
            { name: "Tops under $25", image: "/assets/cards/dresses.png", link: "/products?category=fashion&q=tops" },
            { name: "Dresses under $30", image: "/assets/cards/dresses.png", link: "/products?category=fashion&q=dresses" },
            { name: "Shoes under $50", image: "/assets/cards/fashion.png", link: "/products?category=fashion&q=shoes" }
        ],
        ctaText: "See all deals",
        ctaLink: "/products?category=fashion"
    },
    {
        title: "Refresh your space",
        slug: "home-refresh",
        type: "single", // Changed to Single based on available good images
        items: [
            { name: "Health and Beauty", image: "/assets/cards/dresses.png", link: "/products?category=beauty" }
        ],
        ctaText: "See more",
        ctaLink: "/products"
    }
];

export default function CategoryCards() {
    // Fetch products to populate images - REMOVED
    // const { data: productsData } = useQuery({
    //     queryKey: ['amazon-grid-products'],
    //     queryFn: () => productsAPI.list({ limit: 50 }),
    // });

    // const products = productsData?.data?.results || productsData?.data || [];

    // Helper to find images for categories - REMOVED
    // const getImagesForCategory = (slug: string, count: number) => {
    //     const catProducts = products.filter((p: any) => p.category?.slug === slug || p.category?.name?.toLowerCase().includes(slug));
    //     // Fallbacks if not enough products
    //     const result = catProducts.map((p: any) => p.primary_image).slice(0, count);
    //     while (result.length < count) {
    //         result.push(null); // Will trigger UI fallback
    //     }
    //     return result;
    // }

    return (
        <section className="relative z-20 px-4 max-w-7xl mx-auto">

            {/* DESKTOP & MOBILE: Amazon Card Style */}
            {/* Desktop: Grid | Mobile: Horizontal Scroll */}
            <div className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 -mt-10 lg:-mt-32 mb-12 overflow-x-auto pb-6 lg:pb-0 px-2 lg:px-0 scrollbar-hide snap-x">
                {amazonGridConfig.map((card, idx) => {
                    // Populate images dynamically - REMOVED
                    // const dynamicImages = getImagesForCategory(card.slug === 'home-refresh' ? 'home' : card.slug, 4);

                    return (
                        <div key={idx} className="bg-white p-4 lg:p-5 shadow-md rounded-lg flex flex-col h-[380px] lg:h-[420px] min-w-[280px] lg:min-w-0 snap-center border border-gray-100 lg:border-none">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{card.title}</h3>

                            <div className="flex-1">
                                {card.type === 'single' ? (
                                    <Link href={card.ctaLink} className="block relative w-full h-full max-h-[260px] lg:max-h-[300px] overflow-hidden rounded-md">
                                        <Image
                                            src={card.items[0].image}
                                            alt={card.title}
                                            fill
                                            className="object-cover object-center transform hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full max-h-[260px] lg:max-h-[300px]">
                                        {card.items.map((item, i) => (
                                            <Link key={i} href={item.link} className="block group">
                                                <div className="relative aspect-square mb-1 bg-gray-50 overflow-hidden rounded-md border border-gray-100">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover p-0 hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-700 block truncate font-medium">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link href={card.ctaLink} className="text-sm font-medium text-teal-700 hover:text-orange-700 hover:underline mt-4 block">
                                {card.ctaText}
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Replaced Jumia Circles with the layout above */}
        </section>
    );
}
