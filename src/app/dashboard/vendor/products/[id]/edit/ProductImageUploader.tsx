import React from 'react';
import { Upload, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { ProductImage } from '../../../../../../types';
import { getImageUrl } from '@/lib/image';

interface ProductImageUploaderProps {
    productImage: string | null;
    productGallery: ProductImage[];
    formDataImage: File | null;
    formDataGallery: File[];
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveGalleryImage: (index: number) => void;
}

export function ProductImageUploader({
    productImage,
    productGallery,
    formDataImage,
    formDataGallery,
    onImageChange,
    onGalleryChange,
    onRemoveGalleryImage
}: ProductImageUploaderProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product Images</h3>

            {/* Main Image */}
            <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Main Display Image
                </label>

                {/* Existing Main Image Preview */}
                {productImage && !formDataImage && (
                    <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image
                            src={getImageUrl(productImage)}
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
                        onChange={onImageChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center w-full flex flex-col items-center justify-center relative min-h-[200px]">
                        {formDataImage ? (
                            <div className="text-pink-600 font-medium">Selected: {formDataImage.name}</div>
                        ) : productImage ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={getImageUrl(productImage)}
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
                {productGallery && productGallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {productGallery.map((img: ProductImage) => (
                            <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={getImageUrl(img.image)}
                                    alt={img.alt_text || "Gallery"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 ${isDark ? 'border-slate-700 hover:border-pink-500 hover:bg-slate-800' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'}`}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onGalleryChange}
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
                {formDataGallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {formDataGallery.map((file, index) => (
                            <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 p-2 text-center">
                                    {file.name}
                                </div>
                                <button
                                    type="button"
                                    title="Remove image"
                                    aria-label="Remove image"
                                    onClick={() => onRemoveGalleryImage(index)}
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
    );
}
