'use client';

import React from 'react';
import { AdminProduct } from '@/types';
import { getImageUrl } from '@/lib/image';
import Image from 'next/image';
import { MoreHorizontal, Trash2, ShieldCheck, Zap, Eye, Edit3, Star, Package } from 'lucide-react';

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
        <tr className="group hover:bg-slate-50/50 transition-all duration-500 cursor-pointer" onClick={() => onEdit(product)}>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-8">
                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-slate-900 transition-all">
                        {product.image ? (
                            <Image
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                        ) : (
                            <ProductIcon category={product.category} className="w-5 h-5 text-slate-300" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-950 truncate max-w-[120px] sm:max-w-none">{product.name}</p>
                            {product.featured && (
                                <Star className="w-3 h-3 text-slate-950 fill-slate-950 shrink-0" />
                            )}
                            {product.preOrder && (
                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 italic shrink-0">PRE-ORDER</span>
                            )}
                        </div>
                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tighter truncate mt-0.5 sm:mt-1">{product.category}</p>
                    </div>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-8 whitespace-nowrap">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-950 tabular-nums uppercase tracking-widest">GHS {product.price.toLocaleString()}</span>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-8 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${product.stock === 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {product.stock === 0 ? 'OUT OF STOCK' : `${product.stock} UNITS`}
                    </span>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-8 whitespace-nowrap">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dot}`} />
                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ${statusStyle.text === 'text-white' ? 'text-slate-950' : statusStyle.text}`}>
                        {product.status}
                    </span>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-8 text-right whitespace-nowrap">
                <div className="flex justify-end items-center gap-2 sm:gap-6 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:transform sm:translate-x-4 sm:group-hover:translate-x-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFeatured(product.id); }}
                        className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-colors p-1 cursor-pointer ${product.featured ? 'text-slate-950' : 'text-slate-400 hover:text-slate-950'}`}
                    >
                        {product.featured ? 'UNFEATURE' : 'FEATURE'}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete product"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
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
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-left text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-slate-400">Product</th>
                        <th className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-left text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-slate-400">Price</th>
                        <th className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-left text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-slate-400">Stock</th>
                        <th className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-left text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-slate-400">Status</th>
                        <th className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-right text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-slate-400">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
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
                <div className="py-32 text-center">
                    <Package className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">No Products Found</p>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
