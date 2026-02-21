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

    useEffect(() => {
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
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            className={`
                fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-t border-white/20 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.08)]
                px-4 py-3 pb-safe transform transition-transform duration-300 ease-in-out md:hidden
                ${isVisible ? 'translate-y-0' : 'translate-y-full'}
            `}
            aria-hidden={!isVisible ? "true" : "false"}
        >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                {/* Product Info (Truncated) */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                    </p>
                    <p className="text-sm font-bold text-[#006B5A]">
                        GHS {product.price?.toLocaleString()}
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={onAddToCart}
                    disabled={isAdding || (product.preorder_status === 'SOLD_OUT')}
                    className="
                        bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md 
                        active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100
                        flex items-center gap-2
                    "
                    aria-label={`Add ${product.name} to cart`}
                >
                    {isAdding ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )}
                    Add
                </button>
            </div>
        </div>,
        document.body
    );
}
