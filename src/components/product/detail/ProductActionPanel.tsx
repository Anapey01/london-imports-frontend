import { ShoppingBag, Phone, Download, Share2 } from 'lucide-react';
import { Product } from '@/types/product';
import React from 'react';

interface ProductActionPanelProps {
    product: Product;
    quantity: number;
    setQuantity: (q: number) => void;
    isAdding: boolean;
    isBuyingNow: boolean;
    isSoldOut: boolean;
    isDownloading: boolean;
    handleAddToCart: () => void;
    handleBuyNow: () => void;
    handleWhatsAppContact: () => void;
    handleDownloadFlyer: () => void;
    handleShare: () => void;
    setCtaRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

export function ProductActionPanel({
    product,
    quantity,
    setQuantity,
    isAdding,
    isBuyingNow,
    isSoldOut,
    isDownloading,
    handleAddToCart,
    handleBuyNow,
    handleWhatsAppContact,
    handleDownloadFlyer,
    handleShare,
    setCtaRef
}: ProductActionPanelProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-12 border-t border-slate-50 dark:border-slate-900 pt-8 sm:pt-0">
            <div className="w-full sm:w-40">
                <p className="text-[9px] font-black text-content-secondary uppercase tracking-[0.3em] mb-3 text-center sm:text-left">Quantity</p>
                <div className="flex items-center h-11 w-full border border-border-standard px-2 bg-surface-card">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex-1 h-full flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors text-lg"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="flex-none w-12 text-center font-bold text-content-primary text-sm tabular-nums">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                        className="flex-1 h-full flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors text-lg"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>
            
            <div 
                ref={setCtaRef}
                className="flex items-center gap-8 sm:gap-12 mt-6 sm:mt-0 w-full overflow-x-auto scrollbar-hide py-2"
            >
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isSoldOut}
                    className="text-[11px] font-black uppercase tracking-[0.25em] text-content-primary border-b border-black dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20 whitespace-nowrap flex-shrink-0"
                >
                    {isAdding ? 'Sourcing...' : 'Add to Basket'}
                </button>
                
                <button
                    onClick={handleBuyNow}
                    disabled={isAdding || isBuyingNow || isSoldOut}
                    className="flex items-center gap-3 text-content-primary text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-900 dark:border-white pb-1 hover:opacity-60 transition-all disabled:opacity-20 whitespace-nowrap flex-shrink-0"
                >
                    {!isSoldOut && !isBuyingNow && <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    <span>{isSoldOut ? "Sold Out" : (isBuyingNow ? "Processing..." : (product.preorder_status === 'READY_TO_SHIP' ? "Buy Now" : "Order Now"))}</span>
                </button>

                <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center gap-3 text-[#006B5A] text-[11px] font-black uppercase tracking-[0.3em] border-b border-[#006B5A] pb-1 hover:opacity-60 transition-all whitespace-nowrap flex-shrink-0"
                >
                    <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Concierge</span>
                </button>

                <button
                    onClick={handleDownloadFlyer}
                    disabled={isDownloading}
                    className={`flex items-center gap-3 text-[#006B5A] text-[11px] font-black uppercase tracking-[0.3em] border-b border-[#006B5A]/30 pb-1 hover:border-[#006B5A] transition-all disabled:opacity-50 flex-shrink-0 whitespace-nowrap ${isDownloading ? 'animate-pulse' : ''}`}
                    title="Download professional social flyer"
                >
                    <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} strokeWidth={2.5} />
                    <span>{isDownloading ? 'Flyer...' : 'Flyer'}</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-200 dark:border-slate-800 pb-1 hover:opacity-60 transition-all flex-shrink-0"
                    aria-label="Share product"
                >
                    <Share2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
