/**
 * London's Imports - Vendor Store Settings
 * Manage branding, shop info, and appearance
 */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI, authAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Store, Upload, Save, User, Palette, Image as ImageIcon } from 'lucide-react';

export default function VendorSettingsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        business_name: '',
        description: '',
        whatsapp: '',
        store_config: {
            primary_color: '#db2777', // Default Pink-600
            banner_text: '',
            layout: 'grid'
        }
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        loadVendorProfile();
    }, []);

    const loadVendorProfile = async () => {
        try {
            const response = await authAPI.me();
            const vendor = response.data.vendor_profile;

            setFormData({
                business_name: vendor.business_name || '',
                description: vendor.description || '',
                whatsapp: vendor.whatsapp || '',
                store_config: {
                    primary_color: vendor.store_config?.primary_color || '#db2777',
                    banner_text: vendor.store_config?.banner_text || '',
                    layout: vendor.store_config?.layout || 'grid'
                }
            });

            if (vendor.logo) {
                setLogoPreview(vendor.logo);
            }
        } catch (error) {
            console.error('Failed to load profile', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = new FormData();

            // Text fields
            data.append('business_name', formData.business_name);
            data.append('description', formData.description);
            data.append('whatsapp', formData.whatsapp);

            // JSON fields need to be stringified for Multipart/Form-Data if backend expects it, 
            // BUT our Django UpdateView might expect flattened keys or specific handling. 
            // Best practice for Django REST Framework + JSONField in FormData:
            data.append('store_config', JSON.stringify(formData.store_config));

            if (logoFile) {
                data.append('logo', logoFile);
            }

            await vendorsAPI.updateProfile(data);

            toast.success('Store settings saved!');
            // Refresh to ensure sync
            loadVendorProfile();

        } catch (error) {
            console.error('Save failed', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse p-8">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl">
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Store className="w-6 h-6 text-pink-500" />
                Store Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Basic Info Card */}
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        <User className="w-5 h-5 text-gray-400" />
                        Basic Information
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">Business Name</label>
                            <input
                                type="text"
                                value={formData.business_name}
                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">Short Bio / Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                placeholder="Tell customers about your brand..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">WhatsApp Contact</label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Visual Identity Card */}
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        <Palette className="w-5 h-5 text-gray-400" />
                        Store Appearance
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">Store Logo</label>
                            <div className="flex items-center gap-4">
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 opacity-40" />
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Upload Logo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                    <p className="text-xs mt-2 opacity-60">Recommended: 400x400px</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 opacity-70">Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.store_config.primary_color}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            store_config: { ...formData.store_config, primary_color: e.target.value }
                                        })}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
                                    />
                                    <span className="text-sm font-mono opacity-80">{formData.store_config.primary_color}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 opacity-70">Banner Slogan</label>
                                <input
                                    type="text"
                                    value={formData.store_config.banner_text}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        store_config: { ...formData.store_config, banner_text: e.target.value }
                                    })}
                                    placeholder="e.g. Fashion for the bold"
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/20 active:scale-95 transition-all disabled:opacity-70"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Saving Changes...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
}
