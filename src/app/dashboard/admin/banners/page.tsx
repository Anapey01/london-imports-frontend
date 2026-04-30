/**
 * London's Imports - Admin Banner Management
 * List and manage homepage promotional banners
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Eye, 
    EyeOff,
    ExternalLink,
    AlertCircle,
    Layout
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta_text: string;
    cta_link: string;
    order: number;
    is_active: boolean;
}

export default function AdminBannersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/banners/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch banners');
            const data = await response.json();
            setBanners(data.results || data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Hero Banner',
            message: 'Permanently remove this promotional banner from the homepage rotation?',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('access_token');
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/banners/${id}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) throw new Error('Failed to delete banner');
                    setBanners(banners.filter(b => b.id !== id));
                    addAlert('Banner deleted successfully');
                } catch (err) {
                    addAlert(err instanceof Error ? err.message : 'Delete failed', 'error');
                }
            }
        });
    };

    const handleToggleActive = async (banner: Banner) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/banners/${banner.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !banner.is_active })
            });

            if (!response.ok) throw new Error('Failed to toggle status');
            const updated = await response.json();
            setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: updated.is_active } : b));
            addAlert(`Banner ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            addAlert(err instanceof Error ? err.message : 'Update failed', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Loading banners...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hero Banners</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage promotional slides for the homepage carousel.</p>
                </div>
                <Link
                    href="/dashboard/admin/banners/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-pink-600/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Banner
                </Link>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Banners Grid */}
            {banners.length === 0 ? (
                <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center text-center gap-4 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-100 bg-white'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <Layout className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>No banners found</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} max-w-xs mx-auto mt-1`}>
                            Create your first promotional slide to start marketing on the homepage.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div 
                            key={banner.id}
                            className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-slate-950 border-slate-800 hover:border-pink-500/30' : 'bg-white border-gray-100 hover:border-pink-500/20'}`}
                        >
                            {/* Banner Image Preview */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={banner.image}
                                    alt={banner.title}
                                    fill
                                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!banner.is_active ? 'grayscale opacity-50' : ''}`}
                                />
                                <div className="absolute top-4 left-4">
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${banner.is_active ? 'bg-emerald-500/90 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300'}`}>
                                        {banner.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-sm backdrop-blur-md">
                                        Order: {banner.order}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {banner.title || "No Headline"}
                                    </h3>
                                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        {banner.subtitle || "No sub-headline provided."}
                                    </p>
                                </div>

                                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <ExternalLink className="w-3 h-3" />
                                    <span className="truncate max-w-[150px]">{banner.cta_link || 'No link'}</span>
                                </div>

                                {/* Actions */}
                                <div className={`flex items-center gap-2 pt-2 border-t ${isDark ? 'border-slate-900' : 'border-gray-50'}`}>
                                    <Link
                                        href={`/dashboard/admin/banners/${banner.id}`}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleToggleActive(banner)}
                                        className={`p-2.5 rounded-xl transition-all ${banner.is_active ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:hover:bg-emerald-500/20'}`}
                                        title={banner.is_active ? 'Deactivate' : 'Activate'}
                                    >
                                        {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className={`p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-all`}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
