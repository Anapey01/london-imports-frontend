'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface StickyMobileCartProps {
    product: {
        name: string;
        price: number;
        preorder_status?: string;
    };
    isAdding: boolean;
    onAddToCart: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}

export default function StickyMobileCart({ product, isAdding, onAddToCart, triggerRef }: StickyMobileCartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const trigger = triggerRef.current;
        if (!trigger) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky bar when the main button is NOT visible (scrolled past)
                // We check boundingClientRect to ensure we are below it, not above it
                const isBelow = entry.boundingClientRect.top < 0;
                setIsVisible(!entry.isIntersecting && isBelow);
            },
            {
                threshold: 0,
                rootMargin: "-20px 0px 0px 0px" // Slight offset helps preventing flickering
            }
        );

        observer.observe(trigger);

        return () => {
            if (trigger) observer.unobserve(trigger);
        };
    }, [triggerRef]);

    // Use Portal to render at document body level (avoids z-index issues with parents)
    if (!mounted || typeof window === 'undefined') return null;

    return createPortal(
        <div
            className={`
                fixed bottom-0 left-0 right-0 z-50 bg-primary-surface/90 backdrop-blur-xl border-t border-primary-surface shadow-diffusion-lg
                px-4 py-2 pb-safe transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden
                ${isVisible ? 'translate-y-0' : 'translate-y-full'}
            `}
            {...(!isVisible && { 'aria-hidden': true })}
        >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                {/* Product Info (Truncated) */}
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black nuclear-text opacity-40 uppercase tracking-[0.2em] truncate mb-0.5">
                        {product.name}
                    </p>
                    <p className="text-[15px] font-black nuclear-text tabular-nums tracking-tighter leading-none">
                        {product.price?.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })}
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={onAddToCart}
                    disabled={isAdding || (product.preorder_status === 'SOLD_OUT')}
                    className="
                        bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-diffusion
                        active:scale-95 transition-all disabled:opacity-30 disabled:active:scale-100
                        flex items-center gap-3
                    "
                    aria-label={`Add ${product.name} to cart`}
                >
                    {isAdding ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )}
                    <span>Add</span>
                </button>
            </div>
        </div>,
        document.body
    );
}
