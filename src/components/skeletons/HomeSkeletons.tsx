
export function HeroSkeleton() {
    return (
        <div className="w-full bg-surface border-b border-border-standard">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gray-200 dark:bg-slate-900 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 mt-8 pb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mt-4 lg:-mt-32">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}
