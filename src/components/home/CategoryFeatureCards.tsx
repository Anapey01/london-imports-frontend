'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import { Product } from '@/stores/cartStore';
import { cleanProductName } from '@/lib/format';

export interface CardItem {
    title: string;
    products: Product[];
    linkText: string;
    linkHref: string;
}

interface CategoryFeatureCardsProps {
    cards: CardItem[];
    overlap?: boolean;
}

export default function CategoryFeatureCards({ cards = [], overlap = false }: CategoryFeatureCardsProps) {
    return (
        <section className={`px-4 max-w-7xl mx-auto ${overlap ? 'mt-6 lg:-mt-28 mb-6' : 'py-6'} relative z-25`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {cards.slice(0, 4).map((card, cardIndex) => {
                    const hasFourOrMore = card.products.length >= 4;
                    const displayProducts = hasFourOrMore ? card.products.slice(0, 4) : card.products.slice(0, 1);

                    return (
                        <div 
                            key={cardIndex} 
                            className="bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/50 p-5 rounded-none shadow-[0_1px_4px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col justify-between h-auto lg:h-[420px]"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                                    {card.title}
                                </h3>
                                
                                {card.products.length > 0 ? (
                                    hasFourOrMore ? (
                                        // 2x2 Grid Layout
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 mb-4">
                                            {displayProducts.map((product) => {
                                                const imageUrl = getImageUrl(product.image);
                                                return (
                                                    <Link 
                                                        key={product.id} 
                                                        href={`/products/${product.slug}`} 
                                                        className="group block"
                                                    >
                                                        <div className="relative aspect-square w-full bg-transparent p-1 flex items-center justify-center overflow-hidden">
                                                            <Image
                                                                src={imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                sizes="(max-width: 640px) 25vw, 15vw"
                                                                className="object-contain hover:scale-105 transition-transform duration-300 p-1"
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-slate-800 dark:text-slate-200 font-normal mt-1 line-clamp-1 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                                            {cleanProductName(product)}
                                                        </p>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // Single Product Layout
                                        <div className="mb-4">
                                            {displayProducts.map((product) => {
                                                const imageUrl = getImageUrl(product.image);
                                                return (
                                                    <Link 
                                                        key={product.id} 
                                                        href={`/products/${product.slug}`} 
                                                        className="group block"
                                                    >
                                                        <div className="relative aspect-[4/3] w-full bg-transparent p-2 flex items-center justify-center overflow-hidden">
                                                            <Image
                                                                src={imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                sizes="(max-width: 640px) 50vw, 25vw"
                                                                className="object-contain hover:scale-105 transition-transform duration-300 p-2"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-slate-800 dark:text-slate-200 font-normal mt-2 line-clamp-1 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                                            {cleanProductName(product)}
                                                        </p>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )
                                ) : (
                                    // Empty state placeholder
                                    <div className="aspect-[4/3] w-full bg-transparent flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 mb-4">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
                                    </div>
                                )}
                            </div>

                            <Link 
                                href={card.linkHref} 
                                className="text-xs font-semibold text-brand-emerald hover:opacity-85 mt-auto block transition-all"
                            >
                                {card.linkText}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
