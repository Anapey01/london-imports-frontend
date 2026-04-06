import { siteConfig } from '@/config/site';

/**
 * London's Imports - Image Utilities
 * Robust handling for product images to prevent broken UI
 */

// Default placeholder if image is missing or invalid
const PLACEHOLDER_IMAGE = '/assets/placeholder-product.png'; // Make sure this exists or use a data URI

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return PLACEHOLDER_IMAGE;

    // ABSOLUTE FAIL-SAFE for truncated database links
    if (path === 'https://images.unsplash') {
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';
    }

    // If it's already a full URL (Http/Https), process it
    if (path.startsWith('http')) {
        // Rewrite production URL to local backend for development testing
        const backendUrl = siteConfig.apiUrl.replace('/api/v1', '');
        
        // Handle production API re-routing
        if (path.includes('london-imports-api.onrender.com')) {
            return path.replace('https://london-imports-api.onrender.com', backendUrl);
        }

        // FORCE HTTPS to prevent Mixed Content warnings/blocking on Vercel
        const isLocal = path.includes('localhost') || path.includes('127.0.0.1');
        if (isLocal) return path;
        
        return path.replace('http:', 'https:');
    }

    // If it's a relative path starting with /media/ (Local backend)
    if (path.startsWith('/media/') || path.startsWith('media/')) {
        const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${rootUrl}${normalizedPath}`;
    }

    // If it looks like a Cloudinary Public ID (e.g. products/shoe1)
    // We return a CLEAN Cloudinary URL so the loader can inject params correctly
    if (path.includes('/') && !path.startsWith('/')) {
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
    }

    return path;
};

/**
 * Ensures an image URL is absolute.
 * Required for Satori/next/og rendering on Vercel Edge.
 */
export const getAbsoluteImageUrl = (path: string | null | undefined): string => {
    const url = getImageUrl(path);
    if (url.startsWith('http')) return url;
    
    // Prepend baseUrl for relative paths (e.g. placeholders)
    return `${siteConfig.baseUrl}${url}`;
};

import { ImageLoaderProps } from 'next/image';

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
    // If it's not a Cloudinary URL, return as is (Next.js will optimize if configured, or just serve)
    if (!src.includes('cloudinary.com')) {
        return src;
    }

    // Default params: f_auto (auto-format), c_limit (responsive crop), w (width), q (quality)
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];

    // If src already has transformations (e.g. /image/upload/v123/...), inject new ones after /upload/
    if (src.includes('/image/upload/')) {
        const [base, rest] = src.split('/image/upload/');
        return `${base}/image/upload/${params.join(',')}/${rest}`;
    }

    return src;
};
