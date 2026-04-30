/**
 * London's Imports - Admin Blog Management
 * Create and manage blog posts for SEO
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Image from 'next/image';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image: string | null;  // Changed from featured_image
    is_published: boolean;
    is_featured: boolean;
    read_time_minutes: number;
    published_at: string | null;
    created_at: string;
    seo_title: string;     // Added
    seo_keywords: string;  // Added
}

const categories = [
    { value: 'guides', label: 'Guides' },
    { value: 'customs', label: 'Customs' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'business', label: 'Business' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'news', label: 'News' },
];

export default function AdminBlogPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'guides',
        read_time_minutes: 5,
        is_published: false,
        is_featured: false,
        seo_title: '',
        seo_keywords: '',
    });

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
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await adminAPI.blogPosts();
            setPosts(response.data.results || response.data || []);
        } catch (err) {
            console.error('Failed to load blog posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, String(value));
            });
            if (selectedImage) {
                data.append('image', selectedImage);
            }

            if (editingPost) {
                await adminAPI.updateBlogPost(String(editingPost.id), data);
            } else {
                await adminAPI.createBlogPost(data);
            }
            await loadPosts();
            closeModal();
            addAlert(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        } catch (err) {
            console.error('Failed to save post:', err);
            addAlert('Failed to save post. Check all fields.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Blog Post',
            message: 'Permanently delete this blog article? This action cannot be undone and will affect SEO indexing.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteBlogPost(String(id));
                    setPosts(posts.filter(p => p.id !== id));
                    addAlert('Blog post deleted successfully');
                } catch (err) {
                    console.error('Failed to delete:', err);
                    addAlert('Failed to delete blog post', 'error');
                }
            }
        });
    };


    const openCreateModal = () => {
        setEditingPost(null);
        setSelectedImage(null);
        setImagePreview(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'guides',
            read_time_minutes: 5,
            is_published: false,
            is_featured: false,
            seo_title: '',
            seo_keywords: '',
        });
        setShowModal(true);
    };

    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setSelectedImage(null);
        setImagePreview(post.image);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            read_time_minutes: post.read_time_minutes,
            is_published: post.is_published,
            is_featured: post.is_featured,
            seo_title: post.seo_title || post.title,
            seo_keywords: post.seo_keywords || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPost(null);
        setSelectedImage(null);
        setImagePreview(null);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className={`h-12 w-48 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-20 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Blog & SEO Management
                    </h2>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Create high-impact content and manage meta tags
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 rounded-lg bg-pink-500 text-white font-medium text-sm flex items-center gap-2 hover:bg-pink-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Article
                </button>
            </div>

            {/* Posts List */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                {posts.length === 0 ? (
                    <div className="py-12 text-center">
                        <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No blog posts yet</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Article</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>SEO Health</th>
                                <th className={`px-5 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {posts.map((post) => (
                                <tr key={post.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {post.image ? (
                                                <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                                                    <Image src={post.image} alt="" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                                                    <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.title}</p>
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${post.is_published
                                            ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                                            : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${post.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {post.is_published ? 'Live' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            {[
                                                { check: !!post.excerpt, label: 'Desc' },
                                                { check: !!post.seo_title, label: 'Tag' },
                                                { check: !!post.seo_keywords, label: 'Key' }
                                            ].map((s, i) => (
                                                <span key={i} className={`w-8 h-4 flex items-center justify-center rounded-[4px] text-[8px] font-bold ${
                                                    s.check ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {s.label}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(post)}
                                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className={`p-2 rounded-lg transition-colors text-red-400 hover:bg-red-400/10`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className={`w-full max-w-4xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {editingPost ? 'Refine Article' : 'Draft New Article'}
                            </h3>
                            <button 
                                onClick={closeModal} 
                                title="Close modal"
                                aria-label="Close modal"
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Core Data */}
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Main Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-pink-500/20`}
                                        placeholder="Article Headline"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Content (Markdown)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={12}
                                        className={`w-full px-4 py-3 rounded-xl border font-mono text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-pink-500/20`}
                                        placeholder="Type content here..."
                                    />
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
                                disabled={saving || !formData.title || !formData.content}
                                className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {saving ? 'Finalizing Article...' : editingPost ? 'Update Knowledge Base' : 'Launch New Post'}
                            </button>
                        </div>
                    </div>
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
