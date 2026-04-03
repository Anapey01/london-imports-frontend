/**
 * StarRating - Interactive rating component
 * Allows users to hover/click to rate a product
 */
'use client';

import { useState, useEffect } from 'react';

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
                            className={`${sizeClasses[size]} text-gray-200 fill-gray-100 dark:text-gray-600 dark:fill-gray-800`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>

                        {/* Foreground Star (Filled) */}
                        <div 
                            className="absolute inset-0 overflow-hidden" 
                            style={{ width: `${fillPercent}%` }}
                        >
                            <svg
                                className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
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
                <span className="text-xs text-green-600 font-bold ml-1 animate-fade-in">
                    Thanks!
                </span>
            )}
        </div>
    );
}
