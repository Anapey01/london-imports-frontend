/**
 * London's Imports - Admin Banner Management
 * Premium 'Atelier' architectural system for promotional asset management
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
    Layout,
    ArrowUpRight,
    Layers
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
            title: 'Delete Banner',
            message: 'Are you sure you want to delete this banner from the homepage?',
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
            addAlert(`Banner ${updated.is_active ? 'published' : 'hidden'} successfully`);
        } catch (err) {
            addAlert(err instanceof Error ? err.message : 'Update failed', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 p-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-slate-50 animate-pulse border border-slate-100"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Homepage Banners</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{banners.length} BANNERS</span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard/admin/banners/new"
                    className="px-8 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center gap-3"
                >
                    <Plus className="w-4 h-4" />
                    ADD BANNER
                </Link>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border-l border-red-600 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ERROR: {error}
                </div>
            )}

            {/* 2. ASSET REGISTRY TABLE */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Banner Preview</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Banner Details</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Visibility</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                                    <td className="px-8 py-8">
                                        <div className="w-40 h-24 border border-slate-100 overflow-hidden relative group-hover:border-slate-900 transition-all">
                                            <Image
                                                src={banner.image}
                                                alt={banner.title}
                                                fill
                                                className={`object-cover grayscale transition-all group-hover:grayscale-0 ${!banner.is_active ? 'opacity-30' : 'opacity-80 group-hover:opacity-100'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-2 max-w-xs">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-950 truncate">
                                                {banner.title || 'Untitled'}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-2">
                                                {banner.subtitle || 'No description'}
                                            </span>
                                            <div className="flex items-center gap-3 mt-2">
                                                <ExternalLink className="w-3 h-3 text-slate-300" />
                                                <span className="text-[8px] font-mono text-slate-300 truncate max-w-[150px]">{banner.cta_link}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${banner.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${banner.is_active ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {banner.is_active ? 'VISIBLE' : 'HIDDEN'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Layers className="w-3.5 h-3.5 text-slate-200" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sort Order: {banner.order}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex justify-end items-center gap-4">
                                            <button
                                                onClick={() => handleToggleActive(banner)}
                                                className={`p-3 border transition-all ${banner.is_active ? 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-900 hover:text-slate-900' : 'bg-emerald-500 border-emerald-500 text-white shadow-lg'}`}
                                                title={banner.is_active ? 'Hide Banner' : 'Show Banner'}
                                            >
                                                {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <Link
                                                href={`/dashboard/admin/banners/${banner.id}`}
                                                className="p-3 border border-slate-50 text-slate-300 hover:border-slate-950 hover:text-slate-950 transition-all"
                                                title="Edit Banner"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="p-3 border border-slate-100 text-slate-200 hover:border-red-600 hover:text-red-600 transition-all"
                                                title="Delete Banner"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {banners.length === 0 && (
                    <div className="py-32 text-center">
                        <Layout className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">No Banners Found</p>
                    </div>
                )}
            </div>

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
            <div className="fixed bottom-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
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
