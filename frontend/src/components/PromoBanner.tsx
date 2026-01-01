import Link from 'next/link';
import { Package } from 'lucide-react';

interface PromoBannerProps {
    title?: string;
    subtitle?: string;
    linkText?: string;
    href?: string;
    bgColor?: string; // Tailwind class, e.g. "bg-pink-100"
}

export default function PromoBanner({
    title = "Fashion for less",
    subtitle = "Trendy dresses & shoes at amazing prices",
    linkText = "See all deals",
    href = "/products",
    bgColor = "bg-[#feeef6]", // Specific light pink from image
}: PromoBannerProps) {
    return (
        <div className={`w-full ${bgColor} rounded-lg p-6 sm:p-8 flex items-center justify-between relative overflow-hidden mb-6 shadow-sm`}>

            {/* Left Content */}
            <div className="z-10 relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#961a4f] mb-2 font-sans tracking-tight">
                    {title}
                </h2>
                <p className="text-[#c85a86] text-sm sm:text-base mb-4 font-medium">
                    {subtitle}
                </p>
                <Link
                    href={href}
                    className="text-[#008f87] hover:text-[#006e68] text-sm font-bold uppercase tracking-wide hover:underline transition-all"
                >
                    {linkText}
                </Link>
            </div>

            {/* Right Images (Decorative) */}
            <div className="flex gap-4 absolute right-4 sm:right-12 bottom-2 sm:top-1/2 sm:-translate-y-1/2 opacity-90">
                {/* Box 1 - Tilted */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-200 rounded-lg shadow-md transform -rotate-6 flex items-center justify-center border-4 border-white">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 opacity-50" />
                </div>
                {/* Box 2 - Tilted */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-200 rounded-lg shadow-md transform rotate-3 flex items-center justify-center border-4 border-white -ml-8 sm:-ml-10 mt-4 sm:mt-0 z-10">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 opacity-50" />
                </div>
            </div>
        </div>
    );
}
