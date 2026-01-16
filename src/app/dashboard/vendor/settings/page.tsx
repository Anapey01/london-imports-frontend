/**
 * London's Imports - Vendor Store Settings
 * Manage branding, shop info, and appearance
 */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
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
        business_phone: '',
        address: '',
        city: '',
        region: '',
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
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
            const response = await vendorsAPI.getProfile();
            const vendor = response.data;

            setFormData({
                business_name: vendor.business_name || '',
                description: vendor.description || '',
                whatsapp: vendor.whatsapp || '',
                business_phone: vendor.business_phone || '',
                address: vendor.address || '',
                city: vendor.city || '',
                region: vendor.region || '',
                bank_name: vendor.bank_name || '',
                bank_account_number: vendor.bank_account_number || '',
                bank_account_name: vendor.bank_account_name || '',
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
            data.append('business_phone', formData.business_phone);
            data.append('address', formData.address);
            data.append('city', formData.city);
            data.append('region', formData.region);
            data.append('bank_name', formData.bank_name);
            data.append('bank_account_number', formData.bank_account_number);
            data.append('bank_account_name', formData.bank_account_name);

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
                            <label htmlFor="business_name" className="block text-sm font-medium mb-2 opacity-70">Business Name</label>
                            <input
                                id="business_name"
                                type="text"
                                value={formData.business_name}
                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-2 opacity-70">Short Bio / Description</label>
                            <textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                placeholder="Tell customers about your brand..."
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium mb-2 opacity-70">Physical Address</label>
                            <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium mb-2 opacity-70">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="region" className="block text-sm font-medium mb-2 opacity-70">Region</label>
                                <input
                                    id="region"
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium mb-2 opacity-70">WhatsApp Contact</label>
                                <input
                                    id="whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="business_phone" className="block text-sm font-medium mb-2 opacity-70">Business Phone</label>
                                <input
                                    id="business_phone"
                                    type="tel"
                                    value={formData.business_phone}
                                    onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Payment Information Card */}
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Details
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label htmlFor="bank_name" className="block text-sm font-medium mb-2 opacity-70">Bank Name / Provider</label>
                            <input
                                id="bank_name"
                                type="text"
                                value={formData.bank_name}
                                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                placeholder="e.g. Access Bank or MTN Mobile Money"
                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="bank_account_name" className="block text-sm font-medium mb-2 opacity-70">Account Name</label>
                                <input
                                    id="bank_account_name"
                                    type="text"
                                    value={formData.bank_account_name}
                                    onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="bank_account_number" className="block text-sm font-medium mb-2 opacity-70">Account Number</label>
                                <input
                                    id="bank_account_number"
                                    type="text"
                                    value={formData.bank_account_number}
                                    onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                                    className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
                                />
                            </div>
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
                                        <Image src={logoPreview} alt="Logo" width={96} height={96} className="w-full h-full object-cover" />
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
                                <label htmlFor="primary_color" className="block text-sm font-medium mb-2 opacity-70">Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="primary_color"
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
                                <label htmlFor="banner_text" className="block text-sm font-medium mb-2 opacity-70">Banner Slogan</label>
                                <input
                                    id="banner_text"
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
