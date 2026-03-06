'use client';

import { AdminProduct } from '@/types';
import { getImageUrl } from '@/lib/image';
import Image from 'next/image';

interface ProductGridProps {
    products: AdminProduct[];
    isDark: boolean;
    onEdit: (product: AdminProduct) => void;
    onToggleFeatured: (id: number) => void;
    getStatusStyle: (status: string) => { bg: string; text: string; dot: string };
    ProductIcon: React.ComponentType<{ category: string; className?: string }>;
}

const ProductGrid = ({
    products,
    isDark,
    onEdit,
    onToggleFeatured,
    getStatusStyle,
    ProductIcon
}: ProductGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
                const statusStyle = getStatusStyle(product.status);
                return (
                    <div key={product.id} className={`rounded-xl border overflow-hidden transition-shadow hover:shadow-lg ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                        <div className={`h-36 flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            {product.image ? (
                                <Image
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                        const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`${product.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                                <ProductIcon category={product.category} className={`w-16 h-16 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                            </div>
                            {product.preOrder && (
                                <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-md font-medium bg-purple-500 text-white">
                                    PRE-ORDER
                                </span>
                            )}
                            {product.featured && (
                                <span className="absolute top-3 right-3">
                                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{product.category}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                    <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                                    {product.status}
                                </span>
                            </div>
                            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{product.description}</p>
                            <div className="flex items-center justify-between mb-3">
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {product.price.toLocaleString()}</p>
                                {product.expectedDate && (
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Est. {product.expectedDate}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onEdit(product)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700/50 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    Edit
                                </button>
                                <button onClick={() => onToggleFeatured(product.id)} aria-label="Toggle featured" className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-amber-500' : isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <svg className="w-5 h-5" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
