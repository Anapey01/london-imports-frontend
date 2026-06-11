'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import { Product } from '@/stores/cartStore';

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
        <section className={`px-4 max-w-7xl mx-auto ${overlap ? 'mt-6 lg:-mt-28 mb-12' : 'py-12'} relative z-25`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {cards.slice(0, 4).map((card, cardIndex) => {
                    const hasFourOrMore = card.products.length >= 4;
                    const displayProducts = hasFourOrMore ? card.products.slice(0, 4) : card.products.slice(0, 1);

                    return (
                        <div 
                            key={cardIndex} 
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]"
                        >
                            <div>
                                <h3 className="text-[14px] font-black text-slate-950 dark:text-white tracking-tight uppercase mb-4 leading-tight">
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
                                                        <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950/40 p-2 flex items-center justify-center rounded-lg overflow-hidden border border-slate-100/50 dark:border-slate-800/30">
                                                            <Image
                                                                src={imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                sizes="(max-width: 640px) 25vw, 15vw"
                                                                className="object-contain hover:scale-105 transition-transform duration-300 p-1"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1 line-clamp-1 group-hover:text-brand-emerald transition-colors">
                                                            {product.short_name || product.name}
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
                                                        <div className="relative aspect-[4/3] w-full bg-slate-50 dark:bg-slate-950/40 p-4 flex items-center justify-center rounded-lg overflow-hidden border border-slate-100/50 dark:border-slate-800/30">
                                                            <Image
                                                                src={imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                sizes="(max-width: 640px) 50vw, 25vw"
                                                                className="object-contain hover:scale-105 transition-transform duration-300 p-2"
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-2 line-clamp-1 group-hover:text-brand-emerald transition-colors">
                                                            {product.name}
                                                        </p>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )
                                ) : (
                                    // Empty state placeholder
                                    <div className="aspect-[4/3] w-full bg-slate-50 dark:bg-slate-950/20 rounded-lg flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 mb-4">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
                                    </div>
                                )}
                            </div>

                            <Link 
                                href={card.linkHref} 
                                className="text-[10px] font-black text-brand-emerald hover:opacity-80 mt-auto transition-opacity uppercase tracking-wider block"
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
