'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ShopHeaderProps = {
    isAvailableItems: boolean;
    featured: boolean;
    category: string | undefined;
    categoryTitle: string;
    pageDescription: string;
};

export default function ShopHeader({
    isAvailableItems,
    featured,
    category,
    categoryTitle,
    pageDescription
}: ShopHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div 
            initial={false}
            animate={{ 
                height: isScrolled ? 'auto' : 'auto', // CSS will handle the padding transition
                paddingTop: isScrolled ? '1rem' : '4rem', // py-16 is 4rem
                paddingBottom: isScrolled ? '1rem' : '4rem'
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`bg-surface border-b-2 border-border-standard overflow-hidden sticky top-0 md:relative z-40 backdrop-blur-xl transition-all duration-300`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* Tagline - Hidden when scrolled on mobile */}
                    <AnimatePresence>
                        {!isScrolled && (
                            <motion.span 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="inline-block px-4 py-1.5 mb-4 md:mb-10 text-[10px] font-black tracking-[0.5em] uppercase border-x border-border-standard text-content-secondary overflow-hidden"
                            >
                                {isAvailableItems
                                    ? 'Instant Availability'
                                    : featured
                                        ? 'Exclusive Drop'
                                        : 'A Global Journal'}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Main Title - Shrinks on scroll */}
                    <motion.h1 
                        initial={false}
                        animate={{ 
                            fontSize: isScrolled ? '1.5rem' : '3.75rem', // text-6xl is 3.75rem
                            marginBottom: isScrolled ? '0' : '2.5rem', // mb-10 is 2.5rem
                            lineHeight: isScrolled ? 1.2 : 0.85
                        }}
                        transition={{ duration: 0.3 }}
                        className="font-serif font-black tracking-tighter leading-[0.85] text-content-primary md:text-8xl lg:text-9xl transition-all"
                    >
                        {isAvailableItems
                            ? 'Ready to Ship'
                            : featured
                                ? <>The <span className="italic font-light">Featured</span> Drop</>
                                : category
                                    ? <>{categoryTitle} <span className="italic font-light text-content-secondary px-2">&amp;</span> Arrivals</>
                                    : <>Pre-order <span className="italic font-light text-content-secondary px-2">&amp;</span> Products</>}
                    </motion.h1>

                    {/* Description - Semi-hidden on mobile scroll */}
                    <AnimatePresence>
                        {!isScrolled && (
                            <motion.p 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="hidden md:block text-base md:text-xl max-w-xl mx-auto leading-relaxed font-sans font-medium text-content-secondary overflow-hidden mt-4"
                            >
                                {pageDescription}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    
                    {/* Mobile-only collapsed description hint (optional, but keep it clean) */}
                </div>
            </div>
        </motion.div>
    );
}
