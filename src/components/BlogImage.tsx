'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BlogImageProps {
    src: string | null | undefined;
    alt: string;
    priority?: boolean;
    className?: string;
}

export default function BlogImage({ src, alt, priority = false, className = '' }: BlogImageProps) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div className={`w-full aspect-[21/9] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 md:p-12 flex flex-col justify-end shadow-xl border border-slate-800/60 relative overflow-hidden ${className}`}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                        Verified Official Briefing
                    </span>
                    <h3 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight max-w-2xl leading-tight">
                        {alt}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-slate-100 ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={priority}
                onError={() => setHasError(true)}
                unoptimized
            />
        </div>
    );
}
