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
        <div className={`flex items-center gap-3 ${className}`}>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-green-500 transition-colors border border-gray-100 rounded-lg hover:border-green-100 hover:bg-green-50/30"
                aria-label="Share on WhatsApp"
            >
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
            </a>

            <button
                onClick={handleShare}
                className="flex items-center gap-2 pr-4 pl-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 border border-gray-100 rounded-lg hover:border-gray-200 hover:text-gray-900 hover:bg-gray-50 transition-all font-sans"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <LinkIcon className="w-3 h-3" strokeWidth={2} />
                        <span>Copy Link</span>
                    </>
                )}
            </button>
        </div>
    );
}
