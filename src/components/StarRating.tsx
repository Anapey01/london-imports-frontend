/**
 * StarRating - Interactive rating component
 * Allows users to hover/click to rate a product
 */
'use client';

import { useState } from 'react';

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
        <div className="flex items-center group/rating">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = (hover || rating) >= starValue;

                return readOnly ? (
                    <div key={index} className="p-0.5 -ml-1 first:ml-0">
                        <svg
                            className={`
                                ${sizeClasses[size]} 
                                ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100 dark:text-gray-600 dark:fill-gray-800'}
                            `}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={isFilled ? 0 : 1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    </div>
                ) : (
                    <button
                        key={index}
                        type="button"
                        className={`
                            cursor-pointer hover:scale-110
                            transition-all duration-200 focus:outline-none 
                            relative p-1.5 sm:p-2 -ml-1 first:ml-0
                        `}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRate(starValue);
                        }}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                        <svg
                            className={`
                                ${sizeClasses[size]} 
                                ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100 dark:text-gray-600 dark:fill-gray-800'}
                                drop-shadow-sm
                            `}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={isFilled ? 0 : 1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    </button>
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
