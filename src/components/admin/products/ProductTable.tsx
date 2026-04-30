'use client';

import React from 'react';
import { AdminProduct } from '@/types';
import { getImageUrl } from '@/lib/image';
import Image from 'next/image';

interface ProductTableProps {
    products: AdminProduct[];
    isDark: boolean;
    onEdit: (product: AdminProduct) => void;
    onDelete: (id: number) => void;
    onToggleFeatured: (id: number) => void;
    getStatusStyle: (status: string) => { bg: string; text: string; dot: string };
    ProductIcon: React.ComponentType<{ category: string; className?: string }>;
}

const ProductRow = React.memo(({ 
    product, 
    isDark, 
    onEdit, 
    onDelete, 
    onToggleFeatured, 
    getStatusStyle, 
    ProductIcon 
}: any) => {
    const statusStyle = getStatusStyle(product.status);
    return (
        <tr className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                        {product.image ? (
                            <Image
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                        ) : (
                            <ProductIcon category={product.category} className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                            {product.featured && (
                                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            )}
                            {product.preOrder && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                    PRE-ORDER
                                </span>
                            )}
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{product.description}</p>
                    </div>
                </div>
            </td>
            <td className={`px-5 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{product.category}</td>
            <td className={`px-5 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {product.price.toLocaleString()}</td>
            <td className={`px-5 py-4 text-sm ${product.stock === 0 ? 'text-purple-500' : isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                {product.stock === 0 ? 'Awaiting' : product.stock}
            </td>
            <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {product.status.replace('_', ' ')}
                </span>
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onToggleFeatured(product.id)}
                        title={product.featured ? 'Remove from featured' : 'Add to featured'}
                        aria-label={product.featured ? 'Remove from featured' : 'Add to featured'}
                        className={`p-1.5 rounded-md transition-colors ${product.featured ? 'text-amber-500' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>
                        <svg className="w-4 h-4" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                    <button onClick={() => onEdit(product)} aria-label="Edit product" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={() => onDelete(product.id)} aria-label="Delete product" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
});

const ProductTable = ({
    products,
    isDark,
    onEdit,
    onDelete,
    onToggleFeatured,
    getStatusStyle,
    ProductIcon
}: ProductTableProps) => {
    return (
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
            <table className="w-full">
                <thead>
                    <tr className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                        <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Product</th>
                        <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Category</th>
                        <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Price</th>
                        <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Stock</th>
                        <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                        <th className={`px-5 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                    {products.map((product) => (
                        <ProductRow 
                            key={product.id}
                            product={product}
                            isDark={isDark}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleFeatured={onToggleFeatured}
                            getStatusStyle={getStatusStyle}
                            ProductIcon={ProductIcon}
                        />
                    ))}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className={`py-12 text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
