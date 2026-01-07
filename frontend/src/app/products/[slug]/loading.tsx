export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FFF8E7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Two Column Grid: Skeleton */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* LEFT COLUMN: Image Skeleton */}
                    <div className="relative">
                        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>

                        {/* Thumbnails / Specs Row */}
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info Skeleton */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>

                        {/* Rating */}
                        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>

                        {/* Price */}
                        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse mt-8"></div>

                        {/* Description Blocks */}
                        <div className="space-y-3 mt-8">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                        </div>

                        {/* Trust Badge Box */}
                        <div className="h-32 bg-gray-100 rounded-2xl border border-gray-200 mt-8 animate-pulse"></div>

                        {/* CTA Button */}
                        <div className="h-16 bg-gray-200 rounded-full w-full mt-8 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
