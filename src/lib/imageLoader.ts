'use client';

/**
 * Global Image Loader for Next.js
 * Bypasses Vercel's built-in image optimization to stay within Hobby plan limits.
 * For Cloudinary images, applies on-the-fly transformations.
 * For other images, returns the URL as-is.
 */



interface ImageLoaderParams {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
    // If it's a Cloudinary URL, apply transformations
    if (src.includes('cloudinary.com') && src.includes('/image/upload/')) {
        const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
        const [base, rest] = src.split('/image/upload/');
        return `${base}/image/upload/${params.join(',')}/${rest}`;
    }

    // For local assets (e.g. /assets/logo.png), return as-is
    if (src.startsWith('/')) {
        return src;
    }

    // For any other external URL, return as-is
    return src;
}
