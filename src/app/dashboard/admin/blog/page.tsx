/**
 * London's Imports - Admin Blog Management
 * Create and manage blog posts for SEO
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    featured_image: string | null;
    is_published: boolean;
    is_featured: boolean;
    read_time_minutes: number;
    published_at: string | null;
    created_at: string;
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
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'guides',
        read_time_minutes: 5,
        is_published: false,
        is_featured: false,
    });

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

    const handleSubmit = async () => {
        try {
            if (editingPost) {
                await adminAPI.updateBlogPost(String(editingPost.id), formData);
            } else {
                await adminAPI.createBlogPost(formData);
            }
            await loadPosts();
            closeModal();
            alert(editingPost ? 'Post updated!' : 'Post created!');
        } catch (err) {
            console.error('Failed to save post:', err);
            alert('Failed to save post');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this blog post?')) {
            try {
                await adminAPI.deleteBlogPost(String(id));
                setPosts(posts.filter(p => p.id !== id));
            } catch (err) {
                console.error('Failed to delete:', err);
                alert('Failed to delete');
            }
        }
    };

    const togglePublish = async (id: number) => {
        try {
            await adminAPI.publishBlogPost(String(id));
            await loadPosts();
        } catch (err) {
            console.error('Failed to toggle publish:', err);
        }
    };

    const openCreateModal = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'guides',
            read_time_minutes: 5,
            is_published: false,
            is_featured: false,
        });
        setShowModal(true);
    };

    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            read_time_minutes: post.read_time_minutes,
            is_published: post.is_published,
            is_featured: post.is_featured,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPost(null);
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
                        Blog Posts
                    </h2>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Create SEO content to drive organic traffic
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 rounded-lg bg-pink-500 text-white font-medium text-sm flex items-center gap-2 hover:bg-pink-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Posts', value: posts.length, color: 'text-blue-500' },
                    { label: 'Published', value: posts.filter(p => p.is_published).length, color: 'text-emerald-500' },
                    { label: 'Drafts', value: posts.filter(p => !p.is_published).length, color: 'text-amber-500' },
                    { label: 'Featured', value: posts.filter(p => p.is_featured).length, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Posts List */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                {posts.length === 0 ? (
                    <div className="py-12 text-center">
                        <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No blog posts yet</p>
                        <button onClick={openCreateModal} className="mt-3 text-pink-500 text-sm font-medium hover:text-pink-600">
                            Create your first post →
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Title</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Category</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Date</th>
                                <th className={`px-5 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {posts.map((post) => (
                                <tr key={post.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                                                <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.title}</p>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{post.excerpt.slice(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-5 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                            {categories.find(c => c.value === post.category)?.label || post.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${post.is_published
                                            ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                                            : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${post.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : new Date(post.created_at).toLocaleDateString()
                                        }
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                                                title="View post"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => togglePublish(post.id)}
                                                className={`p-1.5 rounded-md transition-colors ${post.is_published ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'}`}
                                                title={post.is_published ? 'Unpublish' : 'Publish'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={post.is_published ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M5 13l4 4L19 7"} />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openEditModal(post)}
                                                className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
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
                    <div className={`w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {editingPost ? 'Edit Post' : 'Create New Post'}
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {editingPost ? 'Update your blog post' : 'Write an SEO-optimized article'}
                                </p>
                            </div>
                            <button onClick={closeModal} aria-label="Close modal" className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                    placeholder="e.g., How to Buy from 1688 in Ghana"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Excerpt (SEO Description)
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    maxLength={300}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                    placeholder="Short summary for search results (max 300 chars)"
                                />
                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    {formData.excerpt.length}/300 characters
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Content (Markdown supported)
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={10}
                                    className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                                    placeholder="Write your article here... Use ## for headings, - for lists"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category-select" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                                    <select
                                        id="category-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="read-time-input" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Read Time (mins)</label>
                                    <input
                                        id="read-time-input"
                                        type="number"
                                        value={formData.read_time_minutes}
                                        onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) || 5 })}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                                        min={1}
                                    />
                                </div>
                            </div>

                            <div className={`flex items-center gap-6 py-3 px-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Publish immediately</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured post</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.content}
                                className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingPost ? 'Save Changes' : 'Create Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
