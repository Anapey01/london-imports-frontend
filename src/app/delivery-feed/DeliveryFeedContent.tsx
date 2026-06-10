'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { X, ExternalLink, Package, ArrowLeft } from 'lucide-react';

interface DeliveryPhoto {
    id: string;
    image: string;
    caption: string;
}

export default function DeliveryFeedContent() {
    const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);

    // Fetch delivery gallery photos client-side
    const { data: photosData, isLoading } = useQuery({
        queryKey: ['delivery-photos'],
        queryFn: async () => {
            const res = await productsAPI.deliveryPhotos({ category: 'DELIVERY' });
            return res.data?.results || res.data || [];
        },
        staleTime: 1000 * 60 * 10, // Cache client-side for 10 minutes
    });

    const photos: DeliveryPhoto[] = Array.isArray(photosData) ? photosData : [];

    return (
        <div className="min-h-screen bg-surface">
            {/* Header Section */}
            <header className="bg-primary-surface border-b border-primary-surface/60 py-12 md:py-20 transition-colors">
                <div className="max-w-[1800px] mx-auto px-4 md:px-12">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-content-secondary hover:text-content-primary mb-6 transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Home
                    </Link>
                    
                    <div className="max-w-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-content-primary">Logistics Verification Protocol</h2>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-content-primary">
                            Logistics & <span className="font-serif italic font-normal text-brand-emerald">Delivery Feed</span>
                        </h1>
                        <p className="text-sm md:text-base text-content-secondary font-medium leading-relaxed">
                            Real-world verification photos. We capture and catalog our weekly consolidated air and sea cargo shipments as they arrive and clear through our Accra & Kumasi fulfillment hubs.
                        </p>
                    </div>
                </div>
            </header>

            {/* Gallery Section */}
            <main className="max-w-[1800px] mx-auto px-4 md:px-12 py-12 md:py-16">
                {isLoading ? (
                    /* Shimmer Loading State */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="aspect-[4/3] w-full bg-primary-surface/40 animate-pulse border border-border-standard/40 rounded-2xl" />
                        ))}
                    </div>
                ) : photos.length > 0 ? (
                    /* Grid Layout of Proofs */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {photos.map((photo) => (
                            <div 
                                key={photo.id}
                                onClick={() => setLightboxImage({ url: photo.image, caption: photo.caption })}
                                className="aspect-[4/3] relative border border-border-standard bg-slate-50 cursor-pointer overflow-hidden group snap-start rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <Image
                                    src={photo.image}
                                    alt={photo.caption || 'Delivery photo'}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                />
                                
                                {/* Hover overlay for caption */}
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    {photo.caption && (
                                        <p className="text-[10px] font-black uppercase tracking-wider text-white">
                                            {photo.caption}
                                        </p>
                                    )}
                                    <span className="text-[8px] font-mono text-emerald-400 tracking-widest uppercase mt-1 flex items-center gap-1.5">
                                        View Full Proof <ExternalLink className="w-2.5 h-2.5" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="max-w-md mx-auto py-20 text-center border border-dashed border-border-standard rounded-3xl bg-primary-surface/20">
                        <Package className="w-12 h-12 text-content-secondary/35 mx-auto mb-4" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-content-primary mb-2">No Photos Loaded</h3>
                        <p className="text-xs text-content-secondary max-w-[280px] mx-auto leading-relaxed">
                            Logistics feed is updating shortly. Check back soon for the latest shipment photos.
                        </p>
                    </div>
                )}
            </main>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center z-10 animate-in fade-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setLightboxImage(null)}
                            className="absolute -top-12 right-0 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all z-20 focus:outline-none"
                            title="Close preview"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-black border border-white/10 overflow-hidden shadow-2xl rounded-2xl">
                            <Image
                                src={lightboxImage.url}
                                alt={lightboxImage.caption || 'Delivery Proof'}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {lightboxImage.caption && (
                            <div className="mt-4 px-6 py-2.5 bg-slate-900/80 backdrop-blur-md border border-white/5 text-center rounded-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">
                                    {lightboxImage.caption}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
