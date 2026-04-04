/**
 * StarRating - Interactive rating component
 * Allows users to hover/click to rate a product
 */
'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface StarRatingProps {
    initialRating?: number;
    readOnly?: boolean;
    onRate?: (rating: number) => void;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function StarRating({
    initialRating = 0,
    readOnly = false,
    onRate,
    size = 'sm'
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    // Sync state when prop changes (Crucial for Parent -> Child reactivity)
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleRate = (value: number) => {
        if (readOnly) return;
        setRating(value);
        setHasRated(true);
        if (onRate) onRate(value);
    };

    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const fillRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    useLayoutEffect(() => {
        [...Array(5)].forEach((_, index) => {
            const starValue = index + 1;
            let fillPercent = 0;
            if (rating >= starValue) {
                fillPercent = 100;
            } else if (rating > index) {
                fillPercent = (rating - index) * 100;
            }

            if (hover > 0 && !readOnly) {
                fillPercent = hover >= starValue ? 100 : 0;
            }

            const el = fillRefs.current.get(index);
            if (el) {
                el.style.width = `${fillPercent}%`;
            }
        });
    }, [rating, hover, readOnly]);

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                // Calculate fill percentage for each star
                let fillPercent = 0;
                if (rating >= starValue) {
                    fillPercent = 100;
                } else if (rating > index) {
                    fillPercent = (rating - index) * 100;
                }

                if (hover > 0 && !readOnly) {
                    fillPercent = hover >= starValue ? 100 : 0;
                }

                return (
                    <div 
                        key={index} 
                        className={`relative ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                        onMouseEnter={() => !readOnly && setHover(starValue)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        onClick={() => handleRate(starValue)}
                    >
                        {/* Background Star (Empty) */}
                        <svg
                            className={`${sizeClasses[size]} nuclear-text opacity-10 fill-primary-surface border border-primary-surface`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>

                        {/* Foreground Star (Filled) */}
                        <div 
                            ref={(el) => {
                                if (el) fillRefs.current.set(index, el);
                                else fillRefs.current.delete(index);
                            }}
                            className="absolute inset-0 overflow-hidden" 
                        >
                            <svg
                                className={`${sizeClasses[size]} text-emerald-500 fill-emerald-500`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </div>
                    </div>
                );
            })}
            {!readOnly && hasRated && (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2 animate-fade-in">
                    Thank You
                </span>
            )}
        </div>
    );
}
