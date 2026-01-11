
/**
 * London's Imports - Image Utilities
 * Robust handling for product images to prevent broken UI
 */

// Default placeholder if image is missing or invalid
const PLACEHOLDER_IMAGE = '/assets/placeholder-product.png'; // Make sure this exists or use a data URI

// Cloudinary Base URL (Fallback)
// We try to guess the cloud name if the backend sends a raw path
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dg67twduw/image/upload/';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return PLACEHOLDER_IMAGE;

    // If it's already a full URL (Http/Https), return it
    if (path.startsWith('http')) {
        // FORCE HTTPS to prevent Mixed Content warnings/blocking on Vercel
        return path.replace('http:', 'https:');
    }

    // If it's a relative path starting with /media/ (Local backend)
    if (path.startsWith('/media/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com'}${path}`;
    }

    // If it's a relative path starting with media/ (without slash)
    if (path.startsWith('media/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com'}/${path}`;
    }

    // If it looks like a Cloudinary ID (e.g. products/shoe1), try to construct full URL
    // prioritizing the backend fix, but this is the "Last Resort" frontend fix
    if (path.includes('/') && !path.startsWith('/')) {
        return `${CLOUDINARY_BASE}${path}`;
    }

    return path;
};
