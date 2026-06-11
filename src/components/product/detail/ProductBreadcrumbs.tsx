import Link from 'next/link';
import { Product } from '@/types/product';
import { cleanProductName } from '@/lib/format';

export function ProductBreadcrumbs({ product }: { product: Product }) {
    return (
        <nav className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-content-secondary mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide py-4 border-b border-border-standard">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
            </Link>
            <span className="mx-4 text-slate-100 dark:text-slate-900">/</span>
            <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Products
            </Link>
            {product.category && (
                <>
                    <span className="mx-4 text-border-standard">/</span>
                    <Link 
                        href={`/products/category/${product.category.slug || ''}`} 
                        className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        {product.category.name}
                    </Link>
                </>
            )}
            <span className="mx-4 text-border-standard">/</span>
            <span className="text-slate-900 dark:text-white">
                {cleanProductName(product)}
            </span>
        </nav>
    );
}
