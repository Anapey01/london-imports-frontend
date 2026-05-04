/**
 * London's Imports - Admin Blog Management
 * Create and manage blog posts for SEO
 */
'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI, api } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { 
    Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
    Globe, Eye, User, Calendar, Clock, ChevronRight, 
    Layout, Info, Loader2, Sparkles, AlertTriangle, 
    Image as ImageIcon, Type, MoveUp, MoveDown, Save, 
    X as CloseIcon 
} from 'lucide-react';

interface Section {
    id: string;
    type: 'text' | 'image';
    content: string;
    file?: File;
    previewUrl?: string;
}

const CanvasTextBlock = memo(({ 
    section, 
    updateSection, 
    isDark 
}: { 
    section: Section, 
    updateSection: (id: string, content: string) => void, 
    isDark: boolean 
}) => {
    const [localContent, setLocalContent] = useState(section.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync local state with global state when global state changes externally (like on load)
    useEffect(() => {
        setLocalContent(section.content);
    }, [section.content]);

    // Handle height on mount and content change
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [localContent]);

    // Debounced global update to keep typing smooth
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localContent !== section.content) {
                updateSection(section.id, localContent);
            }
        }, 500); // Wait for pause in typing
        return () => clearTimeout(timer);
    }, [localContent, section.id, updateSection, section.content]);

    return (
        <textarea
            ref={textareaRef}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            rows={1}
            placeholder="Tell your story..."
            className={`w-full p-0 bg-transparent border-none focus:ring-0 resize-none font-serif text-xl leading-relaxed transition-all placeholder:italic ${isDark ? 'text-slate-200 placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-200'}`}
        />
    );
});

CanvasTextBlock.displayName = 'CanvasTextBlock';

const CanvasImageBlock = memo(({ 
    section, 
    handleSectionImageUpload, 
    isDark 
}: { 
    section: Section, 
    handleSectionImageUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void, 
    isDark: boolean 
}) => {
    return (
        <div className="relative group/image-block">
            {section.content || section.previewUrl ? (
                <div className="relative w-full aspect-[16/9] bg-slate-50 border border-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group-hover/image-block:shadow-2xl group-hover/image-block:shadow-slate-200">
                    <img src={section.previewUrl || section.content} alt="" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover/image-block:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3">Replace Framework</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleSectionImageUpload(section.id, e)}
                        />
                    </label>
                </div>
            ) : (
                <label className={`flex flex-col items-center justify-center aspect-[21/9] border-2 border-dashed transition-all cursor-pointer group-hover/image-block:border-indigo-500 ${
                    isDark ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50/50'
                }`}>
                    <ImageIcon className="w-6 h-6 text-slate-200 mb-4" />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Anchor Visual Asset</span>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleSectionImageUpload(section.id, e)}
                    />
                </label>
            )}
        </div>
    );
});

CanvasImageBlock.displayName = 'CanvasImageBlock';

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
        category: 'guides',
        read_time_minutes: 5,
        is_published: false,
        is_featured: false,
        seo_title: '',
        seo_keywords: '',
    });

    const [sections, setSections] = useState<Section[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [draftFound, setDraftFound] = useState<{ title: string; date: string } | null>(null);

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

    useEffect(() => {
        loadPosts();
        
        // Restore draft if exists for a "new" post
        const savedDraft = localStorage.getItem('blog_post_draft_new');
        if (savedDraft) {
            try {
                const { formData: draftData, sections: draftSections, last_updated } = JSON.parse(savedDraft);
                const hasContent = draftData.title || draftData.excerpt || (draftSections && draftSections.some((s: any) => s.content.trim()));
                
                if (!showModal && hasContent) {
                    setDraftFound({ 
                        title: draftData.title || 'Untitled Article', 
                        date: last_updated ? new Date(last_updated).toLocaleTimeString() : 'Recently'
                    });
                }
            } catch (e) {
                console.error('Failed to parse draft:', e);
            }
        }
    }, [showModal]);

    // Immediate save on tab hide/switch
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && showModal) {
                const draftKey = editingPost ? `blog_post_draft_${editingPost.id}` : 'blog_post_draft_new';
                const sectionsToSave = sections.map(s => ({
                    id: s.id,
                    type: s.type,
                    content: s.type === 'image' && s.file ? '' : s.content
                }));
                localStorage.setItem(draftKey, JSON.stringify({ 
                    formData, 
                    sections: sectionsToSave,
                    last_updated: new Date().toISOString()
                }));
            }
        };
        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [showModal, editingPost, formData, sections]);

    // BeforeUnload listener to prevent accidental loss AND force save
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (showModal) {
                // Emergency save on refresh
                const draftKey = editingPost ? `blog_post_draft_${editingPost.id}` : 'blog_post_draft_new';
                const sectionsToSave = sections.map(s => ({
                    id: s.id,
                    type: s.type,
                    content: s.type === 'image' && s.file ? '' : s.content
                }));
                localStorage.setItem(draftKey, JSON.stringify({ 
                    formData, 
                    sections: sectionsToSave,
                    last_updated: new Date().toISOString()
                }));

                if (hasUnsavedChanges) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, showModal, formData, sections, editingPost]);

    // Auto-save logic with aggressive debounce
    useEffect(() => {
        if (showModal) {
            const draftKey = editingPost ? `blog_post_draft_${editingPost.id}` : 'blog_post_draft_new';
            
            // Save if there's any content or title
            if (formData.title.trim() || sections.some(s => s.content.trim())) {
                const timer = setTimeout(() => {
                    const sectionsToSave = sections.map(s => ({
                        id: s.id,
                        type: s.type,
                        content: s.type === 'image' && s.file ? '' : s.content
                    }));
                    
                    localStorage.setItem(draftKey, JSON.stringify({ 
                        formData, 
                        sections: sectionsToSave,
                        last_updated: new Date().toISOString()
                    }));
                    setLastSaved(new Date());
                    setHasUnsavedChanges(true);
                }, 500); // 500ms debounce
                return () => clearTimeout(timer);
            }
        }
    }, [formData, sections, showModal, editingPost]);

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
            // First, start all image uploads in parallel
            const uploadPromises = sections.map(async (section) => {
                if (section.type === 'image' && section.file) {
                    try {
                        const formData = new FormData();
                        formData.append('upload', section.file);
                        const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
                        const response = await api.post(`${rootUrl}/ckeditor/upload/`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        return { id: section.id, url: response.data.url };
                    } catch (e) {
                        console.error('Failed to upload section image:', e);
                        return { id: section.id, url: section.previewUrl || '' };
                    }
                }
                return { id: section.id, url: section.content };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const imageMap = Object.fromEntries(uploadedImages.map(img => [img.id, img.url]));

            // Serialize sections to HTML using the already uploaded URLs
            const htmlContent = serializeSectionsToHtmlSync(sections, imageMap);
            
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, String(value));
            });
            data.append('content', htmlContent);

            if (selectedImage) {
                data.append('featured_image', selectedImage);
            }

            if (editingPost) {
                await adminAPI.updateBlogPost(String(editingPost.id), data);
            } else {
                await adminAPI.createBlogPost(data);
            }
            
            // Clear draft on success
            const draftKey = editingPost ? `blog_post_draft_${editingPost.id}` : 'blog_post_draft_new';
            localStorage.removeItem(draftKey);
            setHasUnsavedChanges(false);
            
            await loadPosts();
            closeModal();
            addAlert(editingPost ? 'Article refined successfully!' : 'Article published successfully!');
        } catch (err) {
            console.error('Failed to save post:', err);
            addAlert('Failed to save post. Check connectivity.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const serializeSectionsToHtmlSync = (sections: Section[], imageMap: Record<string, string>) => {
        let html = '';
        for (const section of sections) {
            if (section.type === 'text') {
                const textHtml = section.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '<br/>').join('');
                html += `<div class="content-section text-section">${textHtml}</div>`;
            } else if (section.type === 'image') {
                const url = imageMap[section.id] || section.content;
                if (url) {
                    html += `<div class="content-section image-section"><img src="${url}" alt="Article image" style="width:100%; height:auto; margin: 2rem 0;" /></div>`;
                }
            }
        }
        return html;
    };

    const parseHtmlToSections = (html: string): Section[] => {
        if (!html) return [{ id: Math.random().toString(36).substr(2, 9), type: 'text', content: '' }];
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sectionNodes = doc.querySelectorAll('.content-section');
        
        if (sectionNodes.length === 0) {
            // Fallback for plain HTML or old posts
            return [{ id: Math.random().toString(36).substr(2, 9), type: 'text', content: html.replace(/<[^>]*>?/gm, '\n').trim() }];
        }

        const parsedSections: Section[] = [];
        sectionNodes.forEach(node => {
            if (node.classList.contains('text-section')) {
                parsedSections.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    content: Array.from(node.querySelectorAll('p, br')).map(el => el.textContent || '').join('\n').trim()
                });
            } else if (node.classList.contains('image-section')) {
                const img = node.querySelector('img');
                if (img) {
                    parsedSections.push({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'image',
                        content: img.getAttribute('src') || ''
                    });
                }
            }
        });
        return parsedSections;
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
            category: 'guides',
            read_time_minutes: 5,
            is_published: false,
            is_featured: false,
            seo_title: '',
            seo_keywords: '',
        });

        // Check for existing draft for NEW posts
        const savedDraft = localStorage.getItem('blog_post_draft_new');
        if (savedDraft) {
            try {
                const { formData: draftData, sections: draftSections } = JSON.parse(savedDraft);
                setFormData(draftData);
                // Merge draft sections but keep image blocks as placeholders since files weren't saved
                setSections(draftSections.map((s: any) => ({
                    ...s,
                    previewUrl: s.type === 'image' ? '' : undefined
                })));
                addAlert('New article draft restored.', 'info');
            } catch (e) {
                setSections([{ id: Math.random().toString(36).substr(2, 9), type: 'text', content: '' }]);
            }
        } else {
            setSections([{ id: Math.random().toString(36).substr(2, 9), type: 'text', content: '' }]);
        }
        
        setShowModal(true);
        setDraftFound(null);
    };

    const clearNewDraft = () => {
        localStorage.removeItem('blog_post_draft_new');
        setDraftFound(null);
        addAlert('Draft cleared', 'info');
    };

    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setSelectedImage(null);
        setImagePreview(post.image);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            read_time_minutes: post.read_time_minutes,
            is_published: post.is_published,
            is_featured: post.is_featured,
            seo_title: post.seo_title || post.title,
            seo_keywords: post.seo_keywords || '',
        });
        setSections(parseHtmlToSections(post.content));
        
        // Check for existing draft for THIS specific post
        const draftKey = `blog_post_draft_${post.id}`;
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            try {
                const { formData: draftData, sections: draftSections } = JSON.parse(savedDraft);
                // We could prompt here, but for now we'll just restore if it looks more recent?
                // Or just always restore if it exists.
                setFormData(draftData);
                // Note: images in drafts are lost, we keep the original ones from the post
                addAlert('Unsaved edits restored for this post.', 'info');
            } catch (e) {
                console.error('Failed to restore edit draft', e);
            }
        }
        
        setShowModal(true);
    };

    const closeModal = () => {
        if (hasUnsavedChanges) {
            setConfirmModal({
                isOpen: true,
                title: 'Unsaved Changes',
                message: 'You have unsaved edits in your draft. If you close now, they will be saved locally, but not published. Continue?',
                variant: 'warning',
                onConfirm: () => {
                    setShowModal(false);
                    setEditingPost(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setSections([]);
                    setHasUnsavedChanges(false);
                }
            });
        } else {
            setShowModal(false);
            setEditingPost(null);
            setSelectedImage(null);
            setImagePreview(null);
            setSections([]);
        }
    };

    const addSection = (type: 'text' | 'image') => {
        const newSection: Section = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: '',
        };
        setSections(prev => [...prev, newSection]);
    };

    const updateSection = useCallback((id: string, content: string) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
    }, []);

    const handleSectionImageUpload = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSections(prev => prev.map(s => s.id === id ? { ...s, file, previewUrl } : s));
        }
    }, []);

    const removeSection = (id: string) => {
        if (sections.length > 1) {
            setSections(prev => prev.filter(s => s.id !== id));
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < sections.length) {
            [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
            setSections(newSections);
        }
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

            {/* Draft Recovery Banner */}
            {draftFound && !showModal && (
                <div className={`p-4 rounded-xl border flex items-center justify-between animate-in slide-in-from-top-4 duration-500 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Unsaved Draft Found</p>
                            <p className={`text-[11px] font-medium opacity-60 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                &quot;{draftFound.title}&quot; was auto-saved at {draftFound.date}.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={clearNewDraft}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400 opacity-40' : 'text-slate-500 opacity-60'}`}
                        >
                            Discard
                        </button>
                        <button 
                            onClick={openCreateModal}
                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Continue Writing
                        </button>
                    </div>
                </div>
            )}

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
                                                            className="p-1.5 rounded-full text-slate-300 hover:text-slate-900 transition-colors disabled:opacity-0"
                                                        >
                                                            <MoveUp className="w-3.5 h-3.5" />
                                                        </button>
                                                        <div className="w-[1px] flex-1 bg-slate-100" />
                                                        <button 
                                                            onClick={() => removeSection(section.id)}
                                                            className="p-1.5 rounded-full text-slate-200 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <div className="w-[1px] flex-1 bg-slate-100" />
                                                        <button 
                                                            onClick={() => moveSection(index, 'down')}
                                                            disabled={index === sections.length - 1}
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
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Uploading Assets & Publishing...</span>
                                    </div>
                                ) : editingPost ? 'Update Knowledge Base' : 'Launch New Post'}
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
