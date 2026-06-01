/**
 * London's Imports - Admin Blog Management
 * Create and manage blog posts for SEO
 */
'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI, api } from '@/lib/api';
import { siteConfig } from '@/config/site';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Plus, Trash2, 
    Loader2, Sparkles, 
    Image as ImageIcon, MoveUp, MoveDown, 
    X as CloseIcon 
} from 'lucide-react';

import { BlogListTable } from './components/BlogListTable';
import { BlogEditorModal } from './components/BlogEditorModal';
import { Section, BlogPost } from './components/types';

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
    const [uploadProgress, setUploadProgress] = useState(0);
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
                const hasContent = draftData.title || draftData.excerpt || (draftSections && draftSections.some((s: Section) => s.content.trim()));
                
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
        setUploadProgress(0);
        try {
            // Options for image compression
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: 0.8
            };

            // Track individual progress for each upload
            const totalTasks = sections.filter(s => s.type === 'image' && s.file).length + 1; // +1 for the main request
            const taskProgress = new Array(totalTasks).fill(0);

            const updateOverallProgress = () => {
                const average = taskProgress.reduce((a, b) => a + b, 0) / totalTasks;
                setUploadProgress(Math.round(average));
            };

            // First, start all image uploads in parallel with compression
            const uploadPromises = sections.map(async (section, index) => {
                if (section.type === 'image' && section.file) {
                    try {
                        // Compress before upload
                        const compressedFile = await imageCompression(section.file, compressionOptions);
                        
                        const formData = new FormData();
                        formData.append('upload', compressedFile);
                        
                        const rootUrl = siteConfig.apiUrl.replace('/api/v1', '');
                        const response = await api.post(`${rootUrl}/ckeditor/upload/`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    taskProgress[index] = (progressEvent.loaded / progressEvent.total) * 100;
                                    updateOverallProgress();
                                }
                            }
                        });
                        taskProgress[index] = 100;
                        updateOverallProgress();
                        return { id: section.id, url: response.data.url };
                    } catch (e) {
                        console.error('Failed to compress/upload section image:', e);
                        taskProgress[index] = 100; // Mark as done even if failed to not stall bar
                        updateOverallProgress();
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
                // Compress featured image
                const compressedFeatured = await imageCompression(selectedImage, compressionOptions);
                data.append('featured_image', compressedFeatured);
            }

            const finalTaskIndex = totalTasks - 1;
            if (editingPost) {
                await adminAPI.updateBlogPost(String(editingPost.id), data);
            } else {
                await adminAPI.createBlogPost(data);
            }
            taskProgress[finalTaskIndex] = 100;
            updateOverallProgress();
            
            // Clear draft on success
            const draftKey = editingPost ? `blog_post_draft_${editingPost.id}` : 'blog_post_draft_new';
            localStorage.removeItem(draftKey);
            setHasUnsavedChanges(false);
            
            await loadPosts();
            closeModal();
            addAlert(editingPost ? 'Article refined successfully!' : 'Article published successfully!');
        } catch (err) {
            console.error('Failed to save post:', err);
            addAlert('Failed to save. Please check all fields.', 'error');
        } finally {
            setSaving(false);
            setUploadProgress(0);
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
                setSections(draftSections.map((s: Section) => ({
                    ...s,
                    previewUrl: s.type === 'image' ? '' : undefined
                })));
                addAlert('New article draft restored.', 'info');
            } catch {
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
                const { formData: draftData } = JSON.parse(savedDraft);
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
                <BlogListTable 
                    posts={posts}
                    isDark={isDark}
                    openEditModal={openEditModal}
                    handleDelete={handleDelete}
                />
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <BlogEditorModal 
                    isDark={isDark}
                    formData={formData}
                    setFormData={setFormData}
                    sections={sections}
                    addSection={addSection}
                    updateSection={updateSection}
                    handleSectionImageUpload={handleSectionImageUpload}
                    removeSection={removeSection}
                    moveSection={moveSection}
                    selectedImage={selectedImage}
                    imagePreview={imagePreview}
                    handleImageChange={handleImageChange}
                    categories={categories}
                    hasUnsavedChanges={hasUnsavedChanges}
                    lastSaved={lastSaved}
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                    saving={saving}
                    editingPost={editingPost}
                    uploadProgress={uploadProgress}
                />
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
