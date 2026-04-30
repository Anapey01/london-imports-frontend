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
    const [compressionStatus, setCompressionStatus] = useState<string>(''); // To show user what's happening
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
        shipping_origin: 'China', // Default to China
        image: null,
        images: [],
    });

    // Variants State
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<ProductVariant[]>([
        { name: '', price: '', stock_quantity: '0' }
    ]);

    useEffect(() => {
        // Fetch categories for dropdown
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
            // Handle Price Logic
            if (hasVariants) {
                // If has variants, validation check
                const validVariants = variants.filter(v => v.name && v.price);
                if (validVariants.length === 0) {
                    addAlert('Please add at least one valid option with Name and Price.', 'error');
                    setLoading(false);
                    return;
                }
                // Set main price to the lowest variant price for display sorting
                const prices = validVariants.map(v => parseFloat(v.price));
                const minPrice = Math.min(...prices);
                data.append('price', minPrice.toString());

                // Append variants JSON
                data.append('variants_json', JSON.stringify(validVariants));
            } else {
                if (!formData.price) {
                    addAlert('Please enter a price.', 'error');
                    setLoading(false);
                    return;
                }
                data.append('price', formData.price);
            }

            data.append('category', formData.category_id); // Backend expects ID or slug? Usually ID for Create
            data.append('preorder_status', formData.preorder_status);
            data.append('shipping_origin', formData.shipping_origin);

            // Variants parsing
            if (formData.sizes) {
                const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
                data.append('available_sizes', JSON.stringify(sizesArray));
            }
            if (formData.colors) {
                const colorsArray = formData.colors.split(',').map(s => s.trim()).filter(Boolean);
                data.append('available_colors', JSON.stringify(colorsArray));
            }

            data.append('is_active', 'true'); // Explicitly force Active status

            // Compress Main Image
            if (formData.image) {
                const compressedMain = await compressImage(formData.image);
                data.append('image', compressedMain);
            }

            // Compress Gallery Images
            if (formData.images.length > 0) {
                // Process in parallel
                const compressedGallery = await Promise.all(
                    formData.images.map(file => compressImage(file))
                );

                compressedGallery.forEach((file) => {
                    data.append('uploaded_images', file);
                });
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
    const inputClasses = `w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
        ? 'bg-slate-800 border-slate-700 text-white focus:border-pink-500'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100'
        }`;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/vendor/products"
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Product</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create a new product listing</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {compressionStatus || 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Publish Product
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
