'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/components/Toast';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/image';
import { Check, Plus, Package } from 'lucide-react';

export interface AssistantProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    image: string | null;
    category: string;
    vendor_name: string | null;
    is_preorder: boolean;
    preorder_status: string;
    delivery_window_text: string;
    stock_quantity: number;
    deposit_amount: number;
}

export default function ConciergeProductRow({ 
    product,
    onAdded 
}: { 
    product: AssistantProduct;
    onAdded?: (product: AssistantProduct) => void;
}) {
    const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle');
    const addToCart = useCartStore(state => state.addToCart);
    const { showToast } = useToast();

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setStatus('adding');
            await addToCart({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image || '',
                is_preorder: product.is_preorder,
                delivery_window_text: product.delivery_window_text,
                stock_quantity: product.stock_quantity,
            });
            setStatus('added');
            showToast(`Added ${product.name} to cart`, 'success');
            onAdded?.(product);
            setTimeout(() => setStatus('idle'), 2500);
        } catch {
            showToast('Unable to add to cart', 'error');
            setStatus('idle');
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            {/* Thumbnail */}
            <Link 
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800"
            >
                {product.image ? (
                    <Image
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="56px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <Link 
                    href={`/products/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-serif font-bold text-xs sm:text-sm text-slate-950 dark:text-white truncate hover:underline"
                >
                    {product.name}
                </Link>
                
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {formatPrice(product.price)}
                    </span>
                    {product.is_preorder ? (
                        <span className="text-[9px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
                            Pre-order
                        </span>
                    ) : (
                        <span className="text-[9px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
                            In Stock
                        </span>
                    )}
                </div>
            </div>

            {/* 1-Tap Add Action */}
            <button
                type="button"
                onClick={handleAdd}
                disabled={status === 'adding'}
                className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider transition-all ${
                    status === 'added'
                        ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                        : 'bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 active:scale-95'
                }`}
            >
                {status === 'added' ? (
                    <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                    </>
                ) : (
                    <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                    </>
                )}
            </button>
        </div>
    );
}
