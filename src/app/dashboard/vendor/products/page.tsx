'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { Plus, Search, Edit, Eye, Trash2, Package } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

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

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

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

    const handleDeleteClick = (productId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Product',
            message: 'Permanently remove this product from your inventory? This cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await vendorsAPI.deleteProduct(productId);
                    setProducts(prev => prev.filter(p => p.id !== productId));
                    addAlert('Product deleted successfully');
                } catch (err) {
                    console.error('Failed to delete', err);
                    addAlert('Failed to delete product', 'error');
                }
            }
        });
    };

    const getStatusBadge = (status?: string, isActive?: boolean) => {
        const isOutOfStock = status === 'OUT_OF_STOCK';
        const isLive = status === 'ACTIVE' || isActive;

        if (isOutOfStock) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    Out of Stock
                </span>
            );
        }
        if (isLive) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    In Stock
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                Draft
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search your inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                            isDark
                                ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-white/10'
                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
                        }`}
                    />
                </div>

                <Link
                    href="/dashboard/vendor/products/add"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                        isDark
                            ? 'bg-white text-slate-950 hover:bg-slate-100'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-28 sm:h-80 rounded-2xl animate-pulse ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`} />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border border-dashed ${
                    isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'
                }`}>
                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                        <Package className="w-7 h-7" />
                    </div>
                    <h3 className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {search ? 'No matching products found' : 'No products listed yet'}
                    </h3>
                    <p className={`text-sm mb-6 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {search
                            ? 'Try refining your search keyword or check for typos.'
                            : 'Add your first product to start showcasing on your branded storefront.'}
                    </p>
                    <Link
                        href="/dashboard/vendor/products/add"
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                            isDark
                                ? 'bg-white text-slate-950 hover:bg-slate-100'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        Create Listing
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile Inventory View: Sleek horizontal row layout */}
                    <div className="space-y-3 sm:hidden">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`p-3.5 rounded-2xl border transition-all ${
                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
                                }`}
                            >
                                <div className="flex gap-3.5 items-start">
                                    {/* Compact square thumbnail */}
                                    <div className={`w-20 h-20 relative rounded-xl overflow-hidden shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        {product.image ? (
                                            <Image
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                                <Package className="w-6 h-6 opacity-40" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product summary info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            {getStatusBadge(product.status, product.is_active)}
                                            <span className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                GH₵ {parseFloat(product.price).toFixed(2)}
                                            </span>
                                        </div>

                                        <h3 className={`font-semibold text-xs leading-snug line-clamp-2 mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {product.name}
                                        </h3>

                                        {/* Persistent Mobile Action Bar */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                            <Link
                                                href={`/dashboard/vendor/products/${product.id}/edit`}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                                                    isDark 
                                                        ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                                }`}
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className={`p-1.5 rounded-lg border transition-all ${
                                                    isDark 
                                                        ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white' 
                                                        : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="View Listing"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(product.id)}
                                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tablet & Desktop Inventory Grid: Modern square cards */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md flex flex-col ${
                                    isDark
                                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                                }`}
                            >
                                {/* Square Product Thumbnail */}
                                <div className={`aspect-square relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    {product.image ? (
                                        <Image
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-1">
                                            <Package className="w-8 h-8 opacity-40" />
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        {getStatusBadge(product.status, product.is_active)}
                                    </div>
                                </div>

                                {/* Details & Persistent Actions */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className={`font-semibold text-sm mb-1.5 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`} title={product.name}>
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`font-bold text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                GH₵ {parseFloat(product.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Persistent Action Buttons */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <Link
                                            href={`/dashboard/vendor/products/${product.id}/edit`}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                                                isDark
                                                    ? 'bg-white text-slate-950 hover:bg-slate-100'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                            }`}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/products/${product.slug}`}
                                            target="_blank"
                                            className={`p-2 rounded-xl border transition-all ${
                                                isDark
                                                    ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                                                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                            }`}
                                            title="View Live Listing"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(product.id)}
                                            className={`p-2 rounded-xl border transition-all ${
                                                isDark
                                                    ? 'border-slate-800 text-rose-400 hover:bg-rose-950/40'
                                                    : 'border-slate-200 text-rose-600 hover:bg-rose-50'
                                            }`}
                                            title="Delete Listing"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Notification Toasts */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
