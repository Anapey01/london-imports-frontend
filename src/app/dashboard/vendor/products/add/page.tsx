'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { productsAPI, vendorsAPI } from '@/lib/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Category } from '../../../../../types';
import Link from 'next/link';
import { compressImage } from '@/lib/imageUtils';
import { ProductBasicInfo } from '@/components/admin/products/ProductBasicInfo';
import { ProductDetails } from '@/components/admin/products/ProductDetails';
import { ProductImageUpload } from '@/components/admin/products/ProductImageUpload';
import { ProductFormData, ProductVariant } from '@/types/product';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

export default function AddProductPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [compressionStatus, setCompressionStatus] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        category_id: '',
        preorder_status: 'PREORDER',
        sizes: '',
        colors: '',
        shipping_origin: 'China',
        image: null,
        images: [],
        video: null,
        video_url: '',
    });

    // Variants State
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<ProductVariant[]>([
        { name: '', price: '', stock_quantity: '0' }
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await productsAPI.categories();
                setCategories(res.data.results || []);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCompressionStatus('Compressing images...');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);

            // Price Logic
            if (hasVariants) {
                const validVariants = variants.filter(v => v.name && v.price);
                if (validVariants.length === 0) {
                    addAlert('Please add at least one valid option with Name and Price.', 'error');
                    setLoading(false);
                    return;
                }
                const prices = validVariants.map(v => parseFloat(v.price));
                const minPrice = Math.min(...prices);
                data.append('price', minPrice.toString());
                data.append('variants_json', JSON.stringify(validVariants));
            } else {
                if (!formData.price) {
                    addAlert('Please enter a price.', 'error');
                    setLoading(false);
                    return;
                }
                data.append('price', formData.price);
            }

            data.append('category', formData.category_id);
            data.append('preorder_status', formData.preorder_status);
            data.append('shipping_origin', formData.shipping_origin);

            if (formData.sizes) {
                const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
                data.append('available_sizes', JSON.stringify(sizesArray));
            }
            if (formData.colors) {
                const colorsArray = formData.colors.split(',').map(s => s.trim()).filter(Boolean);
                data.append('available_colors', JSON.stringify(colorsArray));
            }

            data.append('is_active', 'true');

            if (formData.image) {
                const compressedMain = await compressImage(formData.image);
                data.append('image', compressedMain);
            }

            if (formData.images.length > 0) {
                const compressedGallery = await Promise.all(
                    formData.images.map(file => compressImage(file))
                );
                compressedGallery.forEach((file) => {
                    data.append('uploaded_images', file);
                });
            }

            if (formData.video) {
                data.append('video', formData.video);
            }
            if (formData.video_url) {
                data.append('video_url', formData.video_url);
            }

            setCompressionStatus('Uploading...');
            await vendorsAPI.createProduct(data);
            router.push('/dashboard/vendor/products');
        } catch (error: unknown) {
            setCompressionStatus('');
            console.error('Failed to create product:', error);
            interface ApiError {
                response?: { data?: { detail?: string } };
                message?: string;
            }
            const err = error as ApiError;
            const errorMessage = err.response?.data?.detail ||
                (err.response?.data ? JSON.stringify(err.response.data) : null) ||
                err.message ||
                'Failed to create product.';
            addAlert(`Error: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';
    const inputClasses = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
        isDark
            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-white/10'
            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
    }`;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Link
                    href="/dashboard/vendor/products"
                    className={`p-2 rounded-xl border transition-colors ${
                        isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Add New Product
                    </h1>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Create and publish an item to your storefront catalog
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProductBasicInfo
                    formData={formData}
                    handleChange={handleChange}
                    isDark={isDark}
                    inputClasses={inputClasses}
                />

                <ProductDetails
                    formData={formData}
                    handleChange={handleChange}
                    hasVariants={hasVariants}
                    setHasVariants={setHasVariants}
                    variants={variants}
                    setVariants={setVariants}
                    categories={categories}
                    isDark={isDark}
                    inputClasses={inputClasses}
                />

                <ProductImageUpload
                    formData={formData}
                    setFormData={setFormData}
                    handleImageChange={handleImageChange}
                    isDark={isDark}
                />

                {/* Form Action Controls */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/dashboard/vendor/products"
                        className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                            isDark
                                ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDark
                                ? 'bg-white text-slate-950 hover:bg-slate-100'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{compressionStatus || 'Publishing...'}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Publish Listing</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

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
