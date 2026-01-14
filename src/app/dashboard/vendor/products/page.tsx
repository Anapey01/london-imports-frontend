'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import { getImageUrl } from '@/lib/image';

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    slug: string;
    is_active: boolean;
    status: string;
    category?: string;
}

export default function VendorProductsPage() {
    const { theme } = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await vendorsAPI.products();
            setProducts(response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                        type="text"
                        placeholder="Search your products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-pink-500'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100'
                            }`}
                    />
                </div>

                <Link
                    href="/dashboard/vendor/products/add"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-80 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No products yet</h3>
                    <p className="text-gray-500 mb-6">Start selling by adding your first product.</p>
                    <Link
                        href="/dashboard/vendor/products/add"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-bold rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors"
                    >
                        Add Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative rounded-2xl overflow-hidden border transition-all hover:shadow-xl ${isDark
                                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                : 'bg-white border-gray-100 hover:border-pink-100'
                                }`}
                        >
                            {/* Image */}
                            <div className="aspect-[4/5] relative bg-gray-100 dark:bg-slate-900">
                                {product.image ? (
                                    <Image
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${product.is_active
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-500 text-white'
                                        }`}>
                                        {product.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        target="_blank"
                                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                                        title="View Live"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/vendor/products/${product.id}/edit`}
                                        className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
                                                try {
                                                    await vendorsAPI.deleteProduct(product.id);
                                                    setProducts(prev => prev.filter(p => p.id !== product.id));
                                                } catch (err) {
                                                    console.error('Failed to delete', err);
                                                    alert('Failed to delete product');
                                                }
                                            }
                                        }}
                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <h3 className={`font-bold text-lg mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-pink-600 font-bold">
                                        GH₵ {parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {product.status || 'In Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
