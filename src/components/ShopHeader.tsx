'use client';

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
    return (
        <div 
            className="bg-surface border-b-2 border-border-standard overflow-hidden relative z-30 pt-16 pb-16"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* Tagline */}
                    <span 
                        className="inline-block px-4 py-1.5 mb-4 md:mb-10 text-[10px] font-black tracking-[0.5em] uppercase border-x border-border-standard text-content-secondary"
                    >
                        {isAvailableItems
                            ? 'Instant Availability'
                            : featured
                                ? 'Exclusive Drop'
                                : 'A Global Journal'}
                    </span>

                    {/* Main Title */}
                    <h1 
                        className="font-serif font-black tracking-tighter leading-[0.85] text-content-primary text-6xl md:text-8xl lg:text-9xl mb-10"
                    >
                        {isAvailableItems
                            ? 'Available'
                            : featured
                                ? <>The <span className="italic font-light">Featured</span> Drop</>
                                : category
                                    ? <>{categoryTitle} <span className="italic font-light text-content-secondary px-2">&amp;</span> Arrivals</>
                                    : <>Pre-order <span className="italic font-light text-content-secondary px-2">&amp;</span> Products</>}
                    </h1>

                    {/* Description */}
                    <p 
                        className="hidden md:block text-base md:text-xl max-w-xl mx-auto leading-relaxed font-sans font-medium text-content-secondary mt-4"
                    >
                        {pageDescription}
                    </p>
                </div>
            </div>
        </div>
    );
}

