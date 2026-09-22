import React from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { ProductFormData } from '@/types/product';

interface ProductImageUploadProps {
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDark: boolean;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
    formData,
    setFormData,
    handleImageChange,
    isDark
}) => {
    return (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
            <h3 className={`text-base font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Product Imagery</h3>

            {/* Main Image */}
            <div className="mb-6">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Primary Cover Photo
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDark
                        ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/40'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/70'
                }`}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center w-full">
                        {formData.image ? (
                            <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                                Selected: {formData.image.name}
                            </div>
                        ) : (
                            <>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Click to upload main cover image</p>
                                <p className="text-xs text-slate-400">PNG, JPG, WEBP or GIF (max. 5MB)</p>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Additional Images */}
            <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Gallery Photos
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 ${
                    isDark
                        ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/40'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/70'
                }`}>
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
                            <Plus className="w-6 h-6 text-slate-400 mb-1.5" />
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Add gallery views & angles</span>
                        </div>
                    </label>
                </div>

                {/* Preview List */}
                {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {formData.images.map((file, index) => (
                            <div key={index} className={`relative group aspect-square rounded-xl overflow-hidden border ${
                                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                            }`}>
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 p-2 text-center truncate">
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
                                    className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
