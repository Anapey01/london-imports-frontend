'use client';

import { useState } from 'react';
import Image from 'next/image';

import { getImageUrl } from '@/lib/image';

interface ProductImage {
    id: string;
    image: string;
    alt_text?: string;
    alt?: string; // Handle both cases
}

interface ProductImageGalleryProps {
    mainImage: string;
    productName: string;
    images?: ProductImage[];
    video?: string;
    videoUrl?: string;
    currentImage: string;
    onImageSelect: (url: string) => void;
    preorderStatus?: string;
    deliveryWindowText?: string;
    categoryName?: string;
    reservationsCount?: number;
}

export default function ProductImageGallery({
    mainImage,
    productName,
    images = [],
    video,
    videoUrl,
    currentImage,
    onImageSelect,
    preorderStatus,
    deliveryWindowText,
    categoryName,
    reservationsCount = 0
}: ProductImageGalleryProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper to normalize image objects
    const allImages = [
        { id: 'main', image: mainImage, alt: productName },
        ...images.map((img) => ({
            id: img.id,
            image: img.image,
            alt: img.alt_text || img.alt || productName
        }))
    ].filter(img => img.image);

    return (
        <div className="space-y-6">
            {/* Main Image - directly on cream background */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
                <Image
                    src={currentImage}
                    alt={`${productName} - China Import to Ghana`}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {allImages.map((img) => {
                        const imgUrl = getImageUrl(img.image);
                        const isSelected = currentImage === imgUrl;
                        return (
                            <button
                                key={img.id}
                                onClick={() => onImageSelect(imgUrl)}
                                aria-label={`View image of ${img.alt || productName}`}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start
                                    ${isSelected ? 'border-pink-600 ring-2 ring-pink-100 scale-105' : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'}
                                `}
                            >
                                <Image
                                    src={imgUrl}
                                    alt={img.alt || productName}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Product Specs Row - below image */}
            <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                    <svg className={`w-7 h-7 mb-2 ${preorderStatus === 'READY_TO_SHIP' ? 'text-green-600' : 'text-[#006B5A]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={preorderStatus === 'READY_TO_SHIP' ? "M5 13l4 4L19 7" : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">
                        {preorderStatus === 'READY_TO_SHIP' ? 'Ships within 24h' : deliveryWindowText}
                    </span>
                    <span className="text-xs text-gray-500">Delivery</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${preorderStatus === 'READY_TO_SHIP' ? 'bg-green-600' : 'bg-[#006B5A]'}`}>
                        <span className="text-white text-[10px] font-bold">{preorderStatus === 'READY_TO_SHIP' ? 'NOW' : 'PRE'}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{categoryName}</span>
                    <span className="text-xs text-gray-500">Category</span>
                </div>

                {/* Show Reserved only if not fully available or if we want social proof? Maybe hide for available items to reduce clutter? */}
                {/* User requested differentiation, so let's keep it clean for Available Items unless high demand */}
                {reservationsCount > 0 && preorderStatus !== 'READY_TO_SHIP' && (
                    <div className="flex flex-col items-center text-center">
                        <svg className="w-7 h-7 text-[#F5A623] mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{reservationsCount}+</span>
                        <span className="text-xs text-gray-500">Reserved</span>
                    </div>
                )}

                {/* Stock Count for Ready Items */}
                {preorderStatus === 'READY_TO_SHIP' && (
                    <div className="flex flex-col items-center text-center">
                        <svg className="w-7 h-7 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">In Stock</span>
                        <span className="text-xs text-gray-500">Available</span>
                    </div>
                )}
            </div>

            {/* Video Section */}
            {(video || videoUrl) && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Video</h3>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg group">
                        {!isPlaying ? (
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-full h-full relative flex items-center justify-center group"
                                aria-label="Play product video"
                            >
                                <Image
                                    src={currentImage}
                                    alt="Video thumbnail"
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg">
                                            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ) : (
                            video ? (
                                <video
                                    controls
                                    autoPlay
                                    className="w-full h-full object-cover"
                                >
                                    <source src={video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : videoUrl ? (
                                <iframe
                                    src={`${videoUrl.replace('watch?v=', 'embed/').split('&')[0]}?autoplay=1`}
                                    title={productName}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : null
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
