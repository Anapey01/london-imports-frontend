import React from 'react';
import { Upload, Plus, X, Video, Film } from 'lucide-react';
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
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 50 * 1024 * 1024) {
                alert('Video must be less than 50MB');
                return;
            }
            setFormData(prev => ({ ...prev, video: file }));
        }
    };

    return (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'} space-y-6`}>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Product Media</h3>

            {/* Main Image */}
            <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Primary Cover Photo
                </label>
                <div className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
                            <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Cover preview"
                                    className="w-full h-full object-contain bg-slate-50 dark:bg-slate-950 rounded-xl"
                                />
                                <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                    <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/60">
                                        Click to replace cover photo
                                    </span>
                                    <span className="text-white/80 text-[11px] truncate max-w-[80%]">{formData.image.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setFormData(prev => ({ ...prev, image: null }));
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md cursor-pointer transition-colors"
                                    title="Remove cover photo"
                                    aria-label="Remove cover photo"
                                >
                                    <X className="w-4 h-4" />
                                </button>
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
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-[10px] text-white truncate">
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
                                    className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Video Section */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Product Video (Optional)
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors mb-3 ${
                    isDark
                        ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/40'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/70'
                }`}>
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                    />
                    {formData.video ? (
                        <div className="flex items-center justify-between w-full max-w-sm px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                            <div className="flex items-center gap-2 truncate">
                                <Film className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                                    {formData.video.name}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, video: null }))}
                                className="text-rose-500 hover:text-rose-700 p-1"
                                title="Remove video"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label htmlFor="video-upload" className="cursor-pointer text-center w-full">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}>
                                <Video className="w-5 h-5" />
                            </div>
                            <p className={`font-semibold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Upload product demo or showcase video
                            </p>
                            <p className="text-xs text-slate-400">MP4, WebM, MOV (max. 50MB)</p>
                        </label>
                    )}
                </div>

                <div>
                    <label htmlFor="video_url" className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Or Video Link (YouTube / Vimeo)
                    </label>
                    <input
                        id="video_url"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.video_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none transition-all ${
                            isDark
                                ? 'border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-white/10'
                                : 'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
                        }`}
                    />
                </div>
            </div>
        </div>
    );
};
