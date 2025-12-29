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
        <section className="py-6 px-4 bg-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.slug}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Card Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                {category.title}
                            </h3>

                            {/* 2x2 Product Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {category.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        className="group"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-1">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={150}
                                                height={150}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">
                                            {item.name}
                                        </p>
                                    </Link>
                                ))}
                            </div>

                            {/* CTA Link */}
                            <Link
                                href={category.ctaLink}
                                className="text-sm font-medium text-pink-500 hover:text-pink-600 hover:underline"
                            >
                                {category.ctaText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
