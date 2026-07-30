import { siteConfig } from '@/config/site';

/**
 * London's Imports - Image Utilities
 * Robust handling for product images to prevent broken UI
 */

const PLACEHOLDER_IMAGE = '/assets/placeholder-product.png';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return PLACEHOLDER_IMAGE;

    if (path === 'https://images.unsplash') {
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';
    }

    if (path.startsWith('http')) {
        const backendUrl = siteConfig.apiUrl.replace('/api/v1', '');
        
        if (path.includes('london-imports-api.onrender.com')) {
            return path.replace('https://london-imports-api.onrender.com', backendUrl);
        }

        const isLocal = path.includes('localhost') || path.includes('127.0.0.1');
        if (isLocal) return path;
        
        return path.replace('http:', 'https:');
    }

    if (path.startsWith('/media/') || path.startsWith('media/')) {
        const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${rootUrl}${normalizedPath}`;
    }

    if (path.includes('/') && !path.startsWith('/')) {
        const isVideo = path.includes('video') || path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi');
        if (isVideo) {
            return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/${path}`;
        }
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
    }

    return path;
};

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
 * Strictly aligns with Architectural Editorial Design System
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

    // 2. Replace plain horizontal lines (______ or ----) with sharp architectural divider
    html = html.replace(/(?:_{3,}|-{3,})/g, '<hr class="my-12 border-t border-slate-200" />');

    // 3. Convert raw asterisk bullet points (* Item or - Item) into sharp editorial ledger list
    html = html.replace(
        /(?:^\s*[*|-]\s+(.+)$)+/gm,
        (match) => {
            const items = match
                .trim()
                .split('\n')
                .map(line => {
                    const text = line.replace(/^\s*[*|-]\s+/, '').trim();
                    return `<li class="flex items-start gap-4 my-3 text-slate-800 font-sans text-base md:text-lg">
                        <span class="h-1.5 w-1.5 bg-slate-900 shrink-0 mt-2.5"></span>
                        <span class="leading-relaxed">${text}</span>
                    </li>`;
                })
                .join('');
            return `<ul class="my-8 border-l border-slate-900/10 pl-6 py-2 space-y-1">${items}</ul>`;
        }
    );

    // 4. Format published dates gracefully if in paragraph
    html = html.replace(/<p>Published:\s*([^<]+)<\/p>/gi, (match, date) => {
        return `<div class="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
            <span class="h-px w-8 bg-slate-900"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Published ${date}</span>
        </div>`;
    });

    return html;
};
