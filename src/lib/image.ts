import { siteConfig } from '@/config/site';

/**
 * London's Imports - Image Utilities & Editorial Content Engine
 * Robust handling for product images and rich editorial text formatting
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
 * Smart Editorial Content Engine
 * Transforms raw pasted text into a soft, professional, editorial publication.
 * Completely strips all asterisks (*), formats FAQ Q&A blocks, and converts steps into process guides.
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

    // 2. Replace plain horizontal lines (⸻, ____, ----) with subtle architectural divider
    html = html.replace(/(?:⸻|_{3,}|-{3,})/g, '<hr class="my-12 border-t border-slate-200" />');

    // 3. Format published date lines
    html = html.replace(/(?:<p>)?Published:\s*([^<]+)(?:<\/p>)?/gi, (match: string, date: string) => {
        return `<div class="flex items-center gap-3 mb-10 pb-4 border-b border-slate-100">
            <span class="h-px w-6 bg-slate-900"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Published ${date.trim()}</span>
        </div>`;
    });

    // 4. Convert standalone title lines / subheadings into clean serif <h2> tags
    const knownHeadings = [
        "2026 BECE Results Have Been Released",
        "2026 BECE Examination Statistics",
        "Examination Malpractice Cases",
        "How to Check Your 2026 BECE Results",
        "Need a BECE Results Checker?",
        "Frequently Asked Questions",
        "Final Thoughts"
    ];

    knownHeadings.forEach(heading => {
        const regex = new RegExp(`(?:<p>)?(?:<b>|<strong>)?\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:<\\/b>|<\\/strong>)?(?:<\\/p>)?`, 'gi');
        html = html.replace(regex, `<h2 class="text-2xl md:text-3xl font-serif font-bold text-slate-900 mt-12 mb-6 tracking-tight border-b border-slate-100 pb-3">${heading}</h2>`);
    });

    // 5. COMPREHENSIVE ASTERISK STRIPPER & LIST CONVERTER
    // Handle <p>* ...</p> blocks (with or without <br> inside)
    html = html.replace(
        /<p>\s*(?:\*|-|&#42;)\s*(.*?)<\/p>/gi,
        (match: string, contentStr: string) => {
            const rawItems = contentStr.split(/<br\s*\/?>\s*(?:\*|-|&#42;)\s*/i);
            const lis = rawItems.map((item: string) => {
                const cleanItem = item.replace(/^\s*(?:\*|-|&#42;)\s*/, '').trim();
                if (!cleanItem) return '';
                return `<li class="flex items-start gap-3 my-2.5 text-slate-700 font-sans text-base md:text-lg"><span class="h-1.5 w-1.5 bg-slate-900 shrink-0 mt-2.5"></span><span class="leading-relaxed">${cleanItem}</span></li>`;
            }).filter(Boolean).join('');
            return `<ul class="my-6 border-l border-slate-900/10 pl-6 py-2 space-y-1">${lis}</ul>`;
        }
    );

    // Also convert any multiline text starting with *
    html = html.replace(
        /(?:^\s*[*|-]\s+(.+)$)+/gm,
        (match: string) => {
            const lines = match.trim().split('\n');
            const items = lines.map((line: string) => {
                const text = line.replace(/^\s*[*|-]\s+/, '').trim();
                return `<li class="flex items-start gap-3 my-2.5 text-slate-700 font-sans text-base md:text-lg">
                    <span class="h-1.5 w-1.5 bg-slate-900 shrink-0 mt-2.5"></span>
                    <span class="leading-relaxed">${text}</span>
                </li>`;
            }).join('');
            return `<ul class="my-6 border-l border-slate-900/10 pl-6 py-2 space-y-1">${items}</ul>`;
        }
    );

    // FAILSAFE: Strip ANY remaining raw asterisks at the beginning of words or after tags
    html = html.replace(/(<br\s*\/?>)\s*\*\s*/gi, '$1 ');
    html = html.replace(/(<p>)\s*\*\s*/gi, '$1 ');
    html = html.replace(/(^|\s)\*\s+/g, '$1 ');

    // 6. Convert numbered step lists (1. Step..., 2. Step...) into soft professional step guide
    html = html.replace(
        /(?:^\s*\d+\.\s+(.+)$)+/gm,
        (match: string) => {
            let index = 1;
            const steps = match.trim().split('\n').map((line: string) => {
                const text = line.replace(/^\s*\d+\.\s+/, '').trim();
                const numStr = index < 10 ? `0${index}` : `${index}`;
                index++;
                return `<li class="flex items-start gap-4 p-4 bg-slate-50/80 border border-slate-200/60">
                    <span class="flex items-center justify-center w-7 h-7 bg-slate-900 text-white font-mono font-bold text-xs shrink-0 mt-0.5">${numStr}</span>
                    <span class="text-slate-800 text-base md:text-lg font-medium leading-relaxed">${text}</span>
                </li>`;
            }).join('');
            return `<ol class="my-8 space-y-3">${steps}</ol>`;
        }
    );

    // 7. Soft Professional CTA Link Conversion (👉 https://londonsimports.com/checker)
    // Matches standalone URLs while avoiding matching attributes inside tags (like href/src)
    html = html.replace(
        /(<[^>]+>)|(?:👉)?\s*(https?:\/\/[^\s<]+)/gi,
        (match: string, tag: string, url: string) => {
            if (tag) return tag;
            
            let isCheckerBuyUrl = false;
            try {
                const parsedUrl = new URL(url);
                const path = parsedUrl.pathname.toLowerCase().replace(/\/+$/, '');
                isCheckerBuyUrl = (path === '/checker');
            } catch {
                const cleanPath = url.toLowerCase().split('?')[0].replace(/\/+$/, '');
                isCheckerBuyUrl = cleanPath.endsWith('/checker') || cleanPath === 'checker';
            }

            if (isCheckerBuyUrl) {
                return `<div class="my-10 p-6 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 blog-checker-cta">
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Official Result Checker Desk</span>
                        <span class="text-base md:text-lg font-serif font-bold text-slate-900">Purchase Authentic WAEC Result Checker</span>
                    </div>
                    <a href="${url}" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 border border-slate-900">
                        Buy Checker →
                    </a>
                </div>`;
            } else {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-900 underline hover:opacity-60 break-all font-mono text-sm">${url}</a>`;
            }
        }
    );

    // Clean up redundant wrapping paragraphs around checker CTA divs
    html = html.replace(
        /<p>\s*(<div class="my-10 p-6 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 blog-checker-cta">[\s\S]*?<\/div>)\s*<\/p>/gi,
        '$1'
    );

    // 8. Convert FAQ Question/Answer paragraphs into soft editorial Q&A cards
    html = html.replace(
        /<p>\s*([^<]+\?)\s*<\/p>\s*<p>\s*([^<]+)\s*<\/p>/gi,
        (match: string, question: string, answer: string) => {
            return `<div class="my-6 p-6 bg-slate-50/80 border border-slate-200/70">
                <h3 class="text-lg md:text-xl font-serif font-bold text-slate-900 mb-2 flex items-start gap-3">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border border-slate-200/80 px-2 py-0.5 bg-white shrink-0 mt-1">Q</span>
                    <span class="leading-tight">${question.trim()}</span>
                </h3>
                <p class="text-slate-600 font-sans text-base leading-relaxed pl-8 mb-0">${answer.trim()}</p>
            </div>`;
        }
    );

    return sanitizeHtml(html);
};

/**
 * Sanitizes rich HTML content to prevent XSS attacks while preserving legitimate formatting.
 * Disallows <script>, <iframe>, <object>, <embed>, <style>, event handlers (on*), and javascript: URLs.
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    // 1. Remove dangerous tags and their inner contents (<script>, <iframe>, <object>, <embed>, <style>)
    let clean = html.replace(/<(script|iframe|object|embed|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');

    // 2. Remove self-closing / unclosed dangerous tags
    clean = clean.replace(/<(script|iframe|object|embed|style)\b[^>]*\/?>/gi, '');

    // 3. Remove inline event handlers (onclick, onerror, onload, onmouseover, etc.)
    clean = clean.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // 4. Remove javascript: and vbscript: URL schemes from href/src
    clean = clean.replace(/(href|src)\s*=\s*(?:"\s*(?:javascript|vbscript):[^"]*"|'\s*(?:javascript|vbscript):[^']*'|(?:javascript|vbscript):[^\s>]+)/gi, '$1="#"');

    return clean;
};

/**
 * Uploads an image to Cloudinary using staff-signed signatures (H-1 Security Protection).
 */
export const uploadImageSigned = async (file: File, folder: string = 'products'): Promise<string> => {
    try {
        const signRes = await fetch(`${siteConfig.apiUrl}/products/cloudinary-sign/?folder=${encodeURIComponent(folder)}`, {
            credentials: 'include',
        });
        if (signRes.ok) {
            const signData = await signRes.json();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.api_key);
            formData.append('timestamp', String(signData.timestamp));
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${signData.cloud_name}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (uploadRes.ok) {
                const uploadResult = await uploadRes.json();
                return uploadResult.secure_url;
            }
        }
    } catch (err) {
        console.warn('Signed Cloudinary upload failed:', err);
    }

    // Fallback if sign endpoint fails or is unauthenticated
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'londons_imports');
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';
    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
    );
    if (!uploadRes.ok) throw new Error('Image upload failed');
    const uploadResult = await uploadRes.json();
    return uploadResult.secure_url;
};
