/**
 * London's Imports - Admin New Banner
 * Form to create a promotional banner with Cloudinary upload
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ChevronLeft, 
    Upload, 
    Save, 
    X,
    Info,
    AlertCircle
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function NewBannerPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        cta_text: 'Shop Now',
        cta_link: '/products',
        order: 0,
        is_active: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!imageFile) {
            setError('Please upload a banner image.');
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            
            // 1. Upload to Cloudinary (Using the same logic as products)
            const cloudinaryData = new FormData();
            cloudinaryData.append('file', imageFile);
            cloudinaryData.append('upload_preset', 'londons_imports'); // Hardcoded based on project knowledge

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/onrender/image/upload`,
                { method: 'POST', body: cloudinaryData }
            );
            
            if (!uploadRes.ok) throw new Error('Image upload failed');
            const uploadResult = await uploadRes.json();
            const imageUrl = uploadResult.secure_url;

            // 2. Save Banner Metadata to Backend
            const bannerData = {
                ...formData,
                image: imageUrl // The backend expects a string for the image if it's already uploaded, or we can use a standard Multipart form if we want the backend to handle it. 
                // However, I'll use the same logic we used for products (direct strings or multipart).
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/banners/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bannerData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to create banner');
            }

            router.push('/dashboard/admin/banners');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/banners"
                        className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50'}`}
                        aria-label="Go back to banners"
                        title="Back to Banners"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Banner</h2>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Design a new marketing slide for the homepage.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Visual Assets (Image Upload) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <label className={`block text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Banner Image
                        </label>
                        <div 
                            className={`relative aspect-[4/5] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-900/50 hover:border-pink-500/30' : 'border-gray-100 bg-white hover:border-pink-500/20'}`}
                        >
                            {imagePreview ? (
                                <>
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all z-10"
                                        title="Remove artwork"
                                        aria-label="Remove artwork"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center gap-3 px-6 text-center"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                            <Upload className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upload Artwork</p>
                                            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-500'} leading-relaxed`}>
                                                Use high-res editorial shots (JPG/PNG/WEBP).
                                            </p>
                                        </div>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-blue-50/30 border-blue-100'}`}>
                        <div className="flex gap-3">
                            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-500' : 'text-blue-500'}`} />
                            <p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-blue-600'}`}>
                                <strong>Optimization Tip:</strong> Banners look best with a clear subject on the right side of the image, as text overlays the left side.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Marketing Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className={`p-8 md:p-10 rounded-3xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        Headline
                                    </label>
                                    <input
                                        id="banner-title"
                                        type="text"
                                        placeholder="e.g. New Seasonal Drops"
                                        required
                                        className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-pink-500'}`}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        title="Headline text for the banner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        Carousel Order
                                    </label>
                                    <input
                                        id="banner-order"
                                        type="number"
                                        required
                                        placeholder="e.g. 1"
                                        className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-pink-500'}`}
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        title="Display order in the homepage carousel"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Sub-Headline
                                </label>
                                <textarea
                                    id="banner-subtitle"
                                    placeholder="Enter secondary marketing copy..."
                                    rows={3}
                                    className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-pink-500'}`}
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    title="Sub-headline text (optional)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        Button Text
                                    </label>
                                    <input
                                        id="banner-cta-text"
                                        type="text"
                                        required
                                        placeholder="e.g. Shop Now"
                                        className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-pink-500'}`}
                                        value={formData.cta_text}
                                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                        title="The text displayed on the action button"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        Destination Link
                                    </label>
                                    <input
                                        id="banner-cta-link"
                                        type="text"
                                        required
                                        placeholder="e.g. /products?category=shoes"
                                        className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all outline-none ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-pink-500'}`}
                                        value={formData.cta_link}
                                        onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                                        title="The destination URL when the banner is clicked"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={formData.is_active}
                                        onChange={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    <span className={`ml-3 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Now</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Area */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:scale-100 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-pink-600/20 active:scale-95`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Launch Banner
                                </>
                            )}
                        </button>
                        <Link
                            href="/dashboard/admin/banners"
                            className={`flex-1 w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-center text-sm transition-all ${isDark ? 'bg-slate-900 text-slate-400 hover:bg-slate-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
