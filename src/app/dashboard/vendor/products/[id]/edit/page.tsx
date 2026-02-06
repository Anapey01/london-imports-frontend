'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter, useParams } from 'next/navigation';
import { productsAPI, vendorsAPI } from '@/lib/api';
import { Upload, Loader2, Save, X, Plus, ArrowLeft } from 'lucide-react';
import { Category, Product, ProductImage } from '../../../../../../types';
import { getImageUrl } from '@/lib/image';
import Image from 'next/image';
import { compressImage } from '@/lib/imageUtils';

export default function EditProductPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [compressionStatus, setCompressionStatus] = useState<string>('');
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    // Existing data from backend
    const [product, setProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        preorder_status: 'PREORDER',
        sizes: '',
        colors: '',
        shipping_origin: '',
        image: null as File | null, // New main image
        images: [] as File[], // New gallery images
    });

    // Variants State
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string; price: string; stock_quantity: string }[]>([
        { name: '', price: '', stock_quantity: '0' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await productsAPI.categories();
                setCategories(catRes.data.results || []);

                // Fetch product details
                if (productId) {
                    // Ideally fetch single, but list works for now if detail endpoint protected/different
                    // Wait, vendorsAPI.products() returns list. We need detail.
                    // vendorsAPI.updateProduct(id, data) exists, but we need get.
                    // Let's rely on public product detail or add vendor detail to API if needed.
                    // Actually, vendorsAPI doesn't have a specific getDetail logic in frontend lib yet?
                    // Let's try /products/vendor/products/${id}/ directly via a new method or fetch.
                    // Re-checking api.ts... "products: () => api.get('/products/vendor/products/')"
                    // Let's add vendor detail fetch. For now, use the list and find? No, that's inefficient.
                    // The backend supports GET /products/vendor/products/{id}/ (VendorProductDetailView).
                    // So we can assume vendorsAPI.getProduct(id) should exist or we use axios directly.
                    // Let's assume we can fetch it.

                    // Temporary fix: fetching list and filtering (Upgrade this later!)
                    const listRes = await vendorsAPI.products();
                    const found = listRes.data.results.find((p: Product) => p.id === productId);

                    if (found) {
                        setProduct(found);
                        setFormData({
                            name: found.name,
                            description: found.description,
                            price: found.price,
                            category_id: found.category?.id || found.category, // Handle populated vs ID
                            preorder_status: found.preorder_status,
                            sizes: Array.isArray(found.available_sizes) ? found.available_sizes.join(', ') : '',
                            colors: Array.isArray(found.available_colors) ? found.available_colors.join(', ') : '',
                            shipping_origin: found.shipping_origin || 'China',
                            image: null,
                            images: []
                        });

                        // Populate Variants
                        if (found.variants && found.variants.length > 0) {
                            setHasVariants(true);
                            const mapped = found.variants.map((v: { name: string, price: number, stock_quantity: number }) => ({
                                name: v.name,
                                price: v.price.toString(),
                                stock_quantity: v.stock_quantity?.toString() || '0'
                            }));
                            setVariants(mapped);
                        }
                    } else {
                        alert("Product not found");
                        router.push('/dashboard/vendor/products');
                    }
                }
            } catch (err) {
                console.error("Error fetching data", err);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [productId, router]);

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
                    alert('Please add at least one valid option with Name and Price.');
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
                    alert('Please enter a price.');
                    setLoading(false);
                    return;
                }
                data.append('price', formData.price);
            }

            data.append('category', formData.category_id);
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

            // Only append main image if changed
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

            setCompressionStatus('Updating...');
            await vendorsAPI.updateProduct(productId, data);
            router.push('/dashboard/vendor/products');
            router.refresh();
        } catch (error: unknown) {
            setCompressionStatus('');
            console.error('Failed to update product:', error);
            const err = error as { response?: { data?: unknown }; message?: string };
            if (err.response && err.response.data) {
                console.error('Backend validation errors:', err.response.data);
                alert(`Failed to update product: ${JSON.stringify(err.response.data)}`);
            } else {
                alert('Failed to update product. Please check console for details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';
    const inputClasses = `w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
        ? 'bg-slate-800 border-slate-700 text-white focus:border-pink-500'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100'
        }`;

    if (fetching) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-pink-500" /></div>;
    }

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
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Product</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Update your product details</p>
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
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="hasVariants"
                                        checked={hasVariants}
                                        onChange={(e) => setHasVariants(e.target.checked)}
                                        className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                                    />
                                    <label htmlFor="hasVariants" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Has Multiple Options? (Different sizes/prices)
                                    </label>
                                </div>

                                {!hasVariants ? (
                                    <div>
                                        <label htmlFor="price" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                            Price (GH₵)
                                        </label>
                                        <input
                                            id="price"
                                            type="number"
                                            name="price"
                                            required={!hasVariants}
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product Variations</h4>
                                            <div className="space-y-3">
                                                {variants.map((variant, index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Size/Option (e.g. Small)"
                                                                value={variant.name}
                                                                onChange={(e) => {
                                                                    const newVariants = [...variants];
                                                                    newVariants[index].name = e.target.value;
                                                                    setVariants(newVariants);
                                                                }}
                                                                className={`w-full px-3 py-2 text-sm rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="w-24">
                                                            <input
                                                                type="number"
                                                                placeholder="Price"
                                                                value={variant.price}
                                                                onChange={(e) => {
                                                                    const newVariants = [...variants];
                                                                    newVariants[index].price = e.target.value;
                                                                    setVariants(newVariants);
                                                                }}
                                                                className={`w-full px-3 py-2 text-sm rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                                required
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            aria-label="Remove variant"
                                                            onClick={() => {
                                                                if (variants.length > 1) {
                                                                    const newVariants = variants.filter((_, i) => i !== index);
                                                                    setVariants(newVariants);
                                                                }
                                                            }}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVariants([...variants, { name: '', price: '', stock_quantity: '0' }])}
                                                className="mt-3 text-sm text-pink-600 font-medium flex items-center gap-1 hover:text-pink-700"
                                            >
                                                <Plus className="w-4 h-4" /> Add Another Option
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                    className={inputClasses}
                                >
                                    <option value="PREORDER">Pre-order (Standard)</option>
                                    <option value="READY_TO_SHIP">Ready to Ship (Available Now)</option>
                                    <option value="CLOSING_SOON">Closing Soon</option>
                                </select>
                            </div>
                        </div>

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
                                    className={inputClasses}
                                />
                            </div>
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

                        {/* Existing Main Image Preview */}
                        {product?.image && !formData.image && (
                            <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden">
                                <Image
                                    src={getImageUrl(product.image)}
                                    alt="Current Main"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-pink-500 hover:bg-slate-800' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer text-center w-full flex flex-col items-center justify-center relative min-h-[200px]">
                                {formData.image ? (
                                    <div className="text-pink-600 font-medium">Selected: {formData.image.name}</div>
                                ) : product?.image ? (
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={getImageUrl(product.image)}
                                            alt="Current Product Image"
                                            fill
                                            className="object-contain rounded-lg mb-4"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                            <span className="text-white font-medium">Click to change</span>
                                        </div>
                                    </div>
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

                        {/* Existing Gallery Images */}
                        {product?.images && product.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {product.images.map((img: ProductImage) => (
                                    <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={getImageUrl(img.image)}
                                            alt={img.alt_text || "Gallery"}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Delete button (would need API endpoint implementation to actually delete single image) */}
                                        {/* For now we just show them. Implementing delete requires backend 'destroy' on ProductImageViewSet or similar */}
                                    </div>
                                ))}
                            </div>
                        )}

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

                        {/* New Upload Preview List */}
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

                <div className="flex justify-end pt-4 gap-4">
                    <Link
                        href="/dashboard/vendor/products"
                        className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {compressionStatus || 'Updating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
