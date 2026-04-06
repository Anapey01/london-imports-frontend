import { siteConfig } from '@/config/site';

/**
 * Global Image Loader for Next.js
 * Bypasses Vercel's built-in image optimization to stay within Hobby plan limits.
 * For Cloudinary images, applies on-the-fly transformations.
 * For other images (backend media, local assets), returns the URL as-is.
 *
 * NOTE: This file must NOT have 'use client' - it runs in both environments.
 */


interface ImageLoaderParams {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';

    // 1. If it's already a Cloudinary URL, apply on-the-fly transformations
    if (src.includes('cloudinary.com') && src.includes('/image/upload/')) {
        const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
        const [base, rest] = src.split('/image/upload/');
        return `${base}/image/upload/${params.join(',')}/${rest}`;
    }

    // 2. PERFORMANCE POWER-UP: Use Cloudinary Fetch for backend media
    // This resizes and optimizes raw images from Render.com on the fly.
    const isBackendImage = src.includes('london-imports-api.onrender.com') || src.includes('/media/');
    const isProduction = process.env.NODE_ENV === 'production';

    if (isBackendImage && isProduction) {
        // Ensure we have a full URL for the fetch API
        let fullSrc = src;
        if (src.startsWith('/')) {
            const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
            fullSrc = `${rootUrl}${src}`;
        }
        
        // Cloudinary Fetch URL pattern
        const params = ['f_auto', 'q_auto', 'c_limit', `w_${width}`];
        return `https://res.cloudinary.com/${cloudName}/image/fetch/${params.join(',')}/${encodeURIComponent(fullSrc)}`;
    }

    // 3. Fallback for Local Development or other assets
    // We append params just to satisfy Next.js loader requirements, even if ignored by local server
    const connector = src.includes('?') ? '&' : '?';
    return `${src}${connector}w=${width}&q=${quality || 75}`;
}
