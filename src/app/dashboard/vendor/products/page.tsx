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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-80 rounded-2xl animate-pulse ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`} />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
                                isDark
                                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                            }`}
                        >
                            {/* Product Image */}
                            <div className={`aspect-[4/5] relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
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
                                    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-lg border backdrop-blur-md ${
                                        product.is_active
                                            ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                                            : 'bg-slate-900/80 text-slate-300 border-slate-700/50'
                                    }`}>
                                        {product.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </div>

                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-xs">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        target="_blank"
                                        className="p-2.5 bg-white rounded-xl text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
                                        title="View Live Listing"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/vendor/products/${product.id}/edit`}
                                        className="p-2.5 bg-slate-900 rounded-xl text-white hover:bg-slate-800 transition-colors shadow-sm"
                                        title="Edit Listing"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setConfirmModal({
                                                isOpen: true,
                                                title: 'Delete Product',
                                                message: 'Permanently remove this product from your inventory? This cannot be undone.',
                                                variant: 'danger',
                                                onConfirm: async () => {
                                                    try {
                                                        await vendorsAPI.deleteProduct(product.id);
                                                        setProducts(prev => prev.filter(p => p.id !== product.id));
                                                        addAlert('Product deleted successfully');
                                                    } catch (err) {
                                                        console.error('Failed to delete', err);
                                                        addAlert('Failed to delete product', 'error');
                                                    }
                                                }
                                            });
                                        }}
                                        className="p-2.5 bg-rose-600 rounded-xl text-white hover:bg-rose-700 transition-colors shadow-sm"
                                        title="Delete Listing"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <h3 className={`font-bold text-sm mb-1.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className={`font-bold text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        GH₵ {parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {product.status || 'In Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
