import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, Loader2, Image as ImageIcon, MoveUp, MoveDown, X as CloseIcon } from 'lucide-react';
import { Section, BlogPost } from './types';
import { CanvasTextBlock, CanvasImageBlock } from './CanvasBlocks';

interface BlogEditorModalProps {
    isDark: boolean;
    formData: any;
    setFormData: (data: any) => void;
    sections: Section[];
    addSection: (type: 'text' | 'image') => void;
    updateSection: (id: string, content: string) => void;
    handleSectionImageUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    removeSection: (id: string) => void;
    moveSection: (index: number, direction: 'up' | 'down') => void;
    selectedImage: File | null;
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    categories: Array<{ value: string; label: string }>;
    hasUnsavedChanges: boolean;
    lastSaved: Date | null;
    closeModal: () => void;
    handleSubmit: () => void;
    saving: boolean;
    editingPost: BlogPost | null;
    uploadProgress: number;
}

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
    isDark,
    formData,
    setFormData,
    sections,
    addSection,
    updateSection,
    handleSectionImageUpload,
    removeSection,
    moveSection,
    selectedImage,
    imagePreview,
    handleImageChange,
    categories,
    hasUnsavedChanges,
    lastSaved,
    closeModal,
    handleSubmit,
    saving,
    editingPost,
    uploadProgress
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className={`w-full max-w-4xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className={`text-3xl font-serif font-bold leading-none mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {editingPost ? 'Refine Entry' : 'New Creation'}
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                {hasUnsavedChanges ? (lastSaved ? `Draft Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Auto-saving...') : 'Synced to Cloud'}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={closeModal} 
                        title="Close modal"
                        aria-label="Close modal"
                        className={`p-3 rounded-full transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Core Data */}
                    <div className="space-y-6">
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Main Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 text-2xl md:text-4xl font-serif font-bold transition-all focus:border-pink-500 outline-none ${isDark ? 'text-white border-slate-800' : 'text-gray-900'}`}
                                placeholder="Entry Headline..."
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <label className={`block text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Atelier Canvas
                                </label>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => addSection('text')}
                                        className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:text-pink-500 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                                    >
                                        <Plus className="w-3 h-3" /> Add Paragraph
                                    </button>
                                    <button 
                                        onClick={() => addSection('image')}
                                        className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:text-indigo-500 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                                    >
                                        <Plus className="w-3 h-3" /> Add Image
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-12 min-h-[500px] relative">
                                <AnimatePresence mode="popLayout">
                                    {sections.map((section, index) => (
                                        <motion.div 
                                            key={section.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="group relative"
                                        >
                                            {/* Seamless Control Sidebar */}
                                            <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                                                <button 
                                                    onClick={() => moveSection(index, 'up')}
                                                    disabled={index === 0}
                                                    title="Move Section Up"
                                                    aria-label="Move Section Up"
                                                    className="p-1.5 rounded-full text-slate-300 hover:text-slate-900 transition-colors disabled:opacity-0"
                                                >
                                                    <MoveUp className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="w-[1px] flex-1 bg-slate-100" />
                                                <button 
                                                    onClick={() => removeSection(section.id)}
                                                    title="Remove Section"
                                                    aria-label="Remove Section"
                                                    className="p-1.5 rounded-full text-slate-200 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="w-[1px] flex-1 bg-slate-100" />
                                                <button 
                                                    onClick={() => moveSection(index, 'down')}
                                                    disabled={index === sections.length - 1}
                                                    title="Move Section Down"
                                                    aria-label="Move Section Down"
                                                    className="p-1.5 rounded-full text-slate-300 hover:text-slate-900 transition-colors disabled:opacity-0"
                                                >
                                                    <MoveDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {section.type === 'text' ? (
                                                <CanvasTextBlock 
                                                    section={section} 
                                                    updateSection={updateSection} 
                                                    isDark={isDark} 
                                                />
                                            ) : (
                                                <CanvasImageBlock 
                                                    section={section} 
                                                    handleSectionImageUpload={handleSectionImageUpload} 
                                                    isDark={isDark} 
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                
                                {/* Blank State / End of Canvas */}
                                <div className="flex justify-center pt-24 pb-12 opacity-20 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-12 text-slate-900">
                                        <button onClick={() => addSection('text')} className="flex flex-col items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">New Para</span>
                                        </button>
                                        <div className="w-12 h-px bg-slate-100" />
                                        <button onClick={() => addSection('image')} className="flex flex-col items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <ImageIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">New Frame</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Imagery & SEO */}
                    <div className="space-y-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Featured Image</label>
                            <div className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${
                                selectedImage || imagePreview ? 'border-indigo-500/50' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                                {(selectedImage || imagePreview) ? (
                                    <>
                                        <div className="absolute inset-0 w-full h-full">
                                            <Image src={imagePreview || ''} alt="Preview" fill className="object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                            <label className="cursor-pointer px-4 py-2 bg-white rounded-lg text-xs font-bold text-slate-900">Change Image</label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center p-8">
                                        <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs text-slate-500">Upload high-res JPG/PNG</span>
                                    </label>
                                )}
                                <input 
                                    type="file" 
                                    onChange={handleImageChange} 
                                    className="hidden" 
                                    accept="image/*" 
                                    id="blog-image-input" 
                                    title="Select blog featured image"
                                />
                                <label htmlFor="blog-image-input" className="absolute inset-0 cursor-pointer" title="Click to upload image" aria-label="Upload featured image" />
                            </div>
                        </div>

                        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 mb-4">SEO Optimization</h4>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={formData.seo_title}
                                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg text-xs border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                                        placeholder="Target Meta Title"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.seo_keywords}
                                        onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg text-xs border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                                        placeholder="Keywords (Accra, Import, shipping...)"
                                    />
                                </div>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    className={`w-full px-3 py-2 rounded-lg text-xs border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                                    placeholder="Meta description (max 160 recommended for Google)"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                title="Select category"
                                aria-label="Category"
                                className={`w-full px-4 py-3 rounded-xl border text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-5 h-5 rounded text-pink-500" />
                                    <span className="text-xs font-bold text-slate-500">Live</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-500">Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700/50">
                    <button onClick={closeModal} className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-50'}`}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !formData.title || sections.length === 0}
                        className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{uploadProgress < 100 ? `Uploading Assets (${uploadProgress}%)...` : 'Finalizing Post...'}</span>
                                </div>
                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-white"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        ) : editingPost ? 'Update Knowledge Base' : 'Launch New Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};
