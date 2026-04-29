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
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-primary-surface border border-primary-surface shadow-diffusion-xl group transition-all duration-700">
                <Image
                    src={currentImage}
                    alt={`Buy ${productName} in Ghana - Authentic China Import`}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                />
                
                {/* Subtle Glass Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>

            {/* Gallery Thumbnails - Sleek Tiles */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide snap-x">
                    {allImages.map((img) => {
                        const imgUrl = getImageUrl(img.image);
                        const isSelected = currentImage === imgUrl;
                        return (
                            <button
                                key={img.id}
                                onClick={() => onImageSelect(imgUrl)}
                                aria-label={`View image of ${img.alt || productName}`}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-500 snap-start
                                    ${isSelected 
                                        ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-surface scale-105 shadow-lg' 
                                        : 'opacity-40 hover:opacity-100 grayscale-[0.3] hover:grayscale-0 scale-95 hover:scale-100'
                                    }
                                `}
                            >
                                <div className={`absolute inset-0 bg-primary-surface/20 ${isSelected ? 'opacity-0' : 'opacity-100'}`} />
                                <Image
                                    src={imgUrl}
                                    alt={`${img.alt || productName} - London's Imports Ghana`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Product Specs Row - High-Fidelity Discovery Units */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-primary-surface/40">
                {/* Delivery Unit */}
                <div className="flex flex-col items-center text-center gap-3 group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary-surface/60 border border-primary-surface text-emerald-500 transition-transform duration-500 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={preorderStatus === 'READY_TO_SHIP' ? "M5 13l4 4L19 7" : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-black nuclear-text tracking-tight">
                            {preorderStatus === 'READY_TO_SHIP' ? 'Ships within 24h' : deliveryWindowText}
                        </p>
                        <p className="text-[10px] nuclear-text opacity-40 uppercase tracking-[0.2em] font-bold">Delivery</p>
                    </div>
                </div>

                {/* Category Unit */}
                <div className="flex flex-col items-center text-center gap-3 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500/40 transition-transform duration-500 group-hover:scale-110 ${preorderStatus === 'READY_TO_SHIP' ? 'bg-emerald-600' : 'bg-primary-surface'}`}>
                        <span className={`text-[11px] font-black tracking-tighter ${preorderStatus === 'READY_TO_SHIP' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {preorderStatus === 'READY_TO_SHIP' ? 'NOW' : 'PRE'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-black nuclear-text tracking-tight line-clamp-1">{categoryName}</p>
                        <p className="text-[10px] nuclear-text opacity-40 uppercase tracking-[0.2em] font-bold">Category</p>
                    </div>
                </div>

                {/* Status Unit (Reserved or In Stock) */}
                <div className="flex flex-col items-center text-center gap-3 group">
                    {preorderStatus === 'READY_TO_SHIP' ? (
                        <>
                            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 transition-transform duration-500 group-hover:scale-110">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-black nuclear-text tracking-tight">In Stock</p>
                                <p className="text-[10px] nuclear-text opacity-40 uppercase tracking-[0.2em] font-bold text-center">Available</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-500 transition-transform duration-500 group-hover:scale-110">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-black nuclear-text tracking-tight">{reservationsCount}+</p>
                                <p className="text-[10px] nuclear-text opacity-40 uppercase tracking-[0.2em] font-bold text-center">Reserved</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Video Section */}
            {(video || videoUrl) && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold nuclear-text mb-4">Product Video</h3>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg group">
                        {!isPlaying ? (
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-full h-full relative flex items-center justify-center group"
                                aria-label="Play product video"
                            >
                                <Image
                                    src={currentImage}
                                    alt={`${productName} Video Preview - London's Imports`}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg">
                                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
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
