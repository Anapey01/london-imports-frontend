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
    // If it's a Cloudinary URL, apply on-the-fly transformations
    if (src.includes('cloudinary.com') && src.includes('/image/upload/')) {
        const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
        const [base, rest] = src.split('/image/upload/');
        return `${base}/image/upload/${params.join(',')}/${rest}`;
    }

    // For Cloudinary paths that don't have /image/upload/ (raw cloud IDs)
    if (src.includes('cloudinary.com')) {
        return src;
    }

    // For backend media URLs (https://london-imports-api.onrender.com/media/...)
    if (src.includes('onrender.com') && src.includes('/media/')) {
        return src;
    }

    // Safety: If it starts with /media/, prepend the backend host
    if (src.startsWith('/media/')) {
        return `https://london-imports-api.onrender.com${src}`;
    }

    // For local assets (e.g. /assets/logo.png), return as-is
    if (src.startsWith('/')) {
        return src;
    }

    // For any other external URL, return as-is
    return src;
}
