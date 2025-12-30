/**
 * London's Imports - Category Cards
 * Amazon-style category grid with product images
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

interface CategoryCard {
    title: string;
    slug: string;
    items: {
        name: string;
        image: string;
        link: string;
    }[];
    ctaText: string;
    ctaLink: string;
}

// Fallback categories when no products exist yet
const fallbackCategories: CategoryCard[] = [
    {
        title: "Fashion Deals",
        slug: "fashion",
        items: [
            { name: "Dresses", image: "/placeholder-product.jpg", link: "/products?category=fashion" },
            { name: "Tops", image: "/placeholder-product.jpg", link: "/products?category=fashion" },
            { name: "Shoes", image: "/placeholder-product.jpg", link: "/products?category=fashion" },
            { name: "Accessories", image: "/placeholder-product.jpg", link: "/products?category=fashion" },
        ],
        ctaText: "Shop Fashion",
        ctaLink: "/products?category=fashion",
    },
    {
        title: "Electronics",
        slug: "electronics",
        items: [
            { name: "Phones", image: "/placeholder-product.jpg", link: "/products?category=electronics" },
            { name: "Laptops", image: "/placeholder-product.jpg", link: "/products?category=electronics" },
            { name: "Accessories", image: "/placeholder-product.jpg", link: "/products?category=electronics" },
            { name: "Gadgets", image: "/placeholder-product.jpg", link: "/products?category=electronics" },
        ],
        ctaText: "Shop Electronics",
        ctaLink: "/products?category=electronics",
    },
    {
        title: "Home & Living",
        slug: "home",
        items: [
            { name: "Decor", image: "/placeholder-product.jpg", link: "/products?category=home" },
            { name: "Kitchen", image: "/placeholder-product.jpg", link: "/products?category=home" },
            { name: "Bedding", image: "/placeholder-product.jpg", link: "/products?category=home" },
            { name: "Storage", image: "/placeholder-product.jpg", link: "/products?category=home" },
        ],
        ctaText: "Shop Home",
        ctaLink: "/products?category=home",
    },
    {
        title: "Beauty & Health",
        slug: "beauty",
        items: [
            { name: "Skincare", image: "/placeholder-product.jpg", link: "/products?category=beauty" },
            { name: "Makeup", image: "/placeholder-product.jpg", link: "/products?category=beauty" },
            { name: "Hair Care", image: "/placeholder-product.jpg", link: "/products?category=beauty" },
            { name: "Fragrance", image: "/placeholder-product.jpg", link: "/products?category=beauty" },
        ],
        ctaText: "Shop Beauty",
        ctaLink: "/products?category=beauty",
    },
];

export default function CategoryCards() {
    // Fetch categories from backend
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
    });

    // Fetch products to get images
    const { data: productsData } = useQuery({
        queryKey: ['products-for-cards'],
        queryFn: () => productsAPI.list({ limit: 20 }),
    });

    const backendCategories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);
    const products = productsData?.data?.results || productsData?.data || [];

    // Build dynamic categories from backend data
    const dynamicCategories: CategoryCard[] = backendCategories.slice(0, 4).map((cat: any) => {
        const categoryProducts = products.filter((p: any) =>
            p.category?.slug === cat.slug || p.category?.id === cat.id
        ).slice(0, 4);

        return {
            title: cat.name,
            slug: cat.slug,
            items: categoryProducts.length > 0
                ? categoryProducts.map((p: any) => ({
                    name: p.name,
                    image: p.primary_image || '/placeholder-product.jpg',
                    link: `/products/${p.slug}`,
                }))
                : fallbackCategories[0].items,
            ctaText: `Shop ${cat.name}`,
            ctaLink: `/products?category=${cat.slug}`,
        };
    });

    // Use dynamic categories if available, otherwise fallback
    const categories = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories;

    return (
        <section className="py-6 px-2 sm:px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                    <Link href="/products" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
                        See All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Jumia-style Circular Row - Horizontal Scroll */}
                <div
                    className="flex overflow-x-auto pb-4 gap-4 px-1 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Hardcoded "Happy New Deal" Item */}
                    <Link href="/products?sort=newest" className="flex flex-col items-center group min-w-[70px] sm:min-w-[80px] snap-start">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-red-600 flex flex-col items-center justify-center text-white p-2 shadow-sm group-hover:scale-105 transition-transform mb-2 overflow-hidden border-2 border-red-100 flex-shrink-0">
                            <div className="text-xs font-bold text-center leading-tight">
                                <span className="block text-[10px] opacity-90">UP TO</span>
                                <span className="text-lg sm:text-xl font-extrabold">75%</span>
                                <span className="block text-[10px] font-bold">OFF</span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center line-clamp-2 px-1 w-full truncate">Happy New Deal!</span>
                    </Link>

                    {/* Dynamic Categories */}
                    {categories.map((category) => {
                        const catImage = category.items[0]?.image || '/placeholder-product.jpg';

                        return (
                            <Link
                                key={category.slug}
                                href={category.ctaLink}
                                className="flex flex-col items-center group min-w-[70px] sm:min-w-[80px] snap-start"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-100 p-0.5 shadow-sm group-hover:scale-105 transition-transform mb-2 overflow-hidden border border-gray-100 flex-shrink-0">
                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                                        {catImage && catImage !== '/placeholder-product.jpg' ? (
                                            <Image
                                                src={catImage}
                                                alt={category.title}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-700 text-center line-clamp-2 px-1 leading-tight group-hover:text-pink-600 transition-colors w-full">
                                    {category.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

