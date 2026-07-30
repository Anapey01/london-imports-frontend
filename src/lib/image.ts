import { siteConfig } from '@/config/site';

/**
 * London's Imports - Image Utilities
 * Robust handling for product images to prevent broken UI
 */

// Default placeholder if image is missing or invalid
const PLACEHOLDER_IMAGE = '/assets/placeholder-product.png';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return PLACEHOLDER_IMAGE;

    // ABSOLUTE FAIL-SAFE for truncated database links
    if (path === 'https://images.unsplash') {
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';
    }

    // If it's already a full URL (Http/Https), process it
    if (path.startsWith('http')) {
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
    if (path.includes('/') && !path.startsWith('/')) {
        const isVideo = path.includes('video') || path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi');
        if (isVideo) {
            return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/${path}`;
        }
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
    }

    return path;
};

/**
 * Ensures an image URL is absolute.
 */
export const getAbsoluteImageUrl = (path: string | null | undefined): string => {
    const url = getImageUrl(path);
    if (url.startsWith('http')) return url;
    return `${siteConfig.baseUrl}${url}`;
};

import { ImageLoaderProps } from 'next/image';

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
    if (!src.includes('cloudinary.com')) {
        return src;
    }

    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];

    if (src.includes('/image/upload/')) {
        const [base, rest] = src.split('/image/upload/');
        return `${base}/image/upload/${params.join(',')}/${rest}`;
    }

    return src;
};

/**
 * Fixes relative image paths and enhances plain text markdown in HTML content
 */
export const fixHtmlContent = (content: string | null | undefined): string => {
    if (!content) return '';
    
    const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
    let html = content;

    // 1. Replace relative media URLs with absolute URLs
    html = html.replace(
        /src=["']\/media\//g, 
        (match) => match.replace('/media/', `${rootUrl}/media/`)
    );
    html = html.replace(
        /src=["']http:\/\/london-imports-api\.onrender\.com/g,
        (match) => match.replace('http:', 'https:')
    );

    // 2. Replace plain horizontal lines (______ or ----) with styled divider
    html = html.replace(/(?:_{3,}|-{3,})/g, '<hr class="my-10 border-t border-slate-200" />');

    // 3. Convert raw asterisk bullet points (* Item or - Item) into styled HTML list cards
    html = html.replace(
        /(?:^\s*[*|-]\s+(.+)$)+/gm,
        (match) => {
            const items = match
                .trim()
                .split('\n')
                .map(line => {
                    const text = line.replace(/^\s*[*|-]\s+/, '').trim();
                    return `<li class="flex items-start gap-3 my-2 text-slate-800 font-medium text-base md:text-lg">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                        <span>${text}</span>
                    </li>`;
                })
                .join('');
            return `<ul class="my-6 space-y-1 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm">${items}</ul>`;
        }
    );

    // 4. Format published dates gracefully if in paragraph
    html = html.replace(/<p>Published:\s*([^<]+)<\/p>/gi, (match, date) => {
        return `<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold uppercase tracking-wider mb-8 border border-slate-200/60">
            <span>Published: ${date}</span>
        </div>`;
    });

    return html;
};
