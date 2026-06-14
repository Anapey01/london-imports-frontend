import StarRating from '@/components/StarRating';
import { formatPrice, cleanProductName } from '@/lib/format';
import { Product } from '@/types/product';

interface ProductHeaderProps {
    product: Product;
    currentPrice: number;
    effectiveRating: number;
}

export function ProductHeader({ product, currentPrice, effectiveRating }: ProductHeaderProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-content-secondary opacity-60">Original Product / London&apos;s</span>
                {product.is_discreet && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                        <span className="text-[7px] font-black text-emerald-700 dark:text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em]">Discreet</span>
                    </div>
                )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-atelier text-content-primary leading-[1.1] tracking-tighter text-balance">
                {cleanProductName(product)}
            </h1>
            {product.subtitle && (
                <p className="text-xs lg:text-sm font-medium text-content-secondary tracking-[0.2em] uppercase opacity-60 mt-1">
                    {product.subtitle}
                </p>
            )}
            
            <div className="flex items-baseline flex-wrap gap-4 pt-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-content-primary tracking-tighter tabular-nums leading-none">
                    {formatPrice(currentPrice)}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-emerald mb-0.5 opacity-60">
                    Minus shipping
                </span>
                
                <button 
                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-3 py-1 hover:opacity-60 transition-all ml-auto"
                >
                    <StarRating initialRating={Number(effectiveRating)} readOnly size="xs" />
                    <span className="text-[9px] font-black text-content-secondary tracking-widest tabular-nums">
                        ({Number(effectiveRating).toFixed(1)})
                    </span>
                </button>
            </div>
        </div>
    );
}
