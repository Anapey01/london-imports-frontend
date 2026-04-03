/**
 * London's Imports - Share Button Component
 * Allows users to share products via native share or copy link
 */
'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    url: string;
    className?: string;
}

export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `${title} - London's Imports`,
            text: `Check out ${title} on London's Imports!`,
            url: url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // Ignore cancel
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 hover:text-green-600 transition-all border border-slate-100 rounded-lg hover:border-green-100 hover:bg-green-50/30"
                aria-label="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.2} />
            </a>

            <button
                onClick={handleShare}
                className="h-9 sm:h-11 flex items-center gap-2 px-3 sm:pr-5 sm:pl-4 text-[9px] uppercase tracking-[0.3em] font-semibold text-slate-400 border border-slate-100 rounded-lg hover:border-slate-200 hover:text-slate-900 transition-all font-sans whitespace-nowrap"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" strokeWidth={2} />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={1.2} />
                        <span>Copy</span>
                    </>
                )}
            </button>
        </div>
    );
}
