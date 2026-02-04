'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { productsAPI, vendorsAPI } from '@/lib/api';
import { Upload, Loader2, Save, X, Plus, ArrowLeft } from 'lucide-react';
import { Category } from '../../../../../types';
import Link from 'next/link';


export default function AddProductPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        preorder_status: 'PREORDER',
        sizes: '',
        colors: '',
        shipping_origin: 'China', // Default to China
        image: null as File | null,
        images: [] as File[],
    });

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

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
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
            if (formData.image) {
                data.append('image', formData.image);
            }

            // Append multiple images
            formData.images.forEach((file) => {
                data.append('uploaded_images', file);
            });

            await vendorsAPI.createProduct(data);
            router.push('/dashboard/vendor/products');
        } catch (error: unknown) {
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
            alert(`Error: ${errorMessage}`);
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
                {/* Basic Info */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Basic Information</h3>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Product Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Premium Leather Bag"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your product..."
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Category */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Price (GH₵)
                            </label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                required
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label htmlFor="category_id" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Category
                            </label>
                            <select
                                id="category_id"
                                name="category_id"
                                required
                                value={formData.category_id}
                                onChange={handleChange}
                                aria-label="Category"
                                className={inputClasses}
                            >
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="preorder_status" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Pre-order Status
                            </label>
                            <select
                                id="preorder_status"
                                name="preorder_status"
                                required
                                value={formData.preorder_status}
                                onChange={handleChange}
                                aria-label="Pre-order status"
                                className={inputClasses}
                            >
                                <option value="PREORDER">Pre-order (Standard)</option>
                                <option value="READY_TO_SHIP">Ready to Ship (Available Now)</option>
                                <option value="CLOSING_SOON">Closing Soon</option>
                            </select>
                        </div>

                        {/* Variants */}
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="sizes" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Available Sizes (comma-separated)
                                </label>
                                <input
                                    id="sizes"
                                    type="text"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    placeholder="e.g. S, M, L, XL"
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label htmlFor="colors" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Available Colors (comma-separated)
                                </label>
                                <input
                                    id="colors"
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    placeholder="e.g. Red, Blue, Black"
                                    className={inputClasses}
                                />
                            </div>

                            {/* Shipping Origin */}
                            <div className="col-span-1 sm:col-span-2">
                                <label htmlFor="shipping_origin" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Shipping Origin
                                </label>
                                <input
                                    id="shipping_origin"
                                    type="text"
                                    name="shipping_origin"
                                    value={formData.shipping_origin}
                                    onChange={handleChange}
                                    placeholder="e.g. China, Turkey, London"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product Images</h3>

                    {/* Main Image */}
                    <div className="mb-6">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Main Display Image
                        </label>
                        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-pink-500 hover:bg-slate-800' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer text-center w-full">
                                {formData.image ? (
                                    <div className="text-pink-600 font-medium">Selected: {formData.image.name}</div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Click to upload main image</p>
                                        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Additional Images (Gallery)
                        </label>
                        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 ${isDark ? 'border-slate-700 hover:border-pink-500 hover:bg-slate-800' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: [...prev.images, ...Array.from(e.target.files!)]
                                        }));
                                    }
                                }}
                                className="hidden"
                                id="gallery-upload"
                            />
                            <label htmlFor="gallery-upload" className="cursor-pointer text-center w-full">
                                <div className="flex flex-col items-center">
                                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Add more images</span>
                                </div>
                            </label>
                        </div>

                        {/* Preview List */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {formData.images.map((file, index) => (
                                    <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 p-2 text-center">
                                            {file.name}
                                        </div>
                                        <button
                                            type="button"
                                            title="Remove image"
                                            aria-label="Remove image"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== index)
                                            }))}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

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
                                Creating...
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
        </div>
    );
}
