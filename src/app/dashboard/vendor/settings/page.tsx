/**
 * London's Imports - Vendor Store Settings
 * Manage branding, shop info, and appearance
 */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Image from 'next/image';
import { Store, Upload, Save, User, Palette, Image as ImageIcon, CreditCard, Loader2, Check } from 'lucide-react';

const MOMO_PROVIDERS = [
    'MTN Mobile Money',
    'Telecel Cash',
    'AT Money'
];

export default function VendorSettingsPage() {
    const { showToast } = useToast();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [payoutType, setPayoutType] = useState<'momo' | 'bank'>('momo');

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
            primary_color: '#0f172a',
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
                    primary_color: vendor.store_config?.primary_color || '#0f172a',
                    banner_text: vendor.store_config?.banner_text || '',
                    layout: vendor.store_config?.layout || 'grid'
                }
            });

            const bName = (vendor.bank_name || '').toLowerCase();
            const isBank = bName.includes('bank') || bName.includes('ghana') || bName.includes('stanbic') || bName.includes('fidelity');
            setPayoutType(isBank ? 'bank' : 'momo');

            if (vendor.logo) {
                setLogoPreview(vendor.logo);
            }
        } catch (error) {
            console.error('Failed to load profile', error);
            showToast('Failed to load settings', 'error');
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
            data.append('store_config', JSON.stringify(formData.store_config));

            if (logoFile) {
                data.append('logo', logoFile);
            }

            await vendorsAPI.updateProfile(data);
            showToast('Store settings saved successfully!', 'success');
            loadVendorProfile();
        } catch (error) {
            console.error('Save failed', error);
            showToast('Failed to save changes', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none transition-all ${
        isDark
            ? 'border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-white/10'
            : 'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
    }`;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-white" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Store Settings & Branding
                </h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Customize your public storefront profile, contact information, and settlement details
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Info Card */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    <h3 className={`text-base font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <User className="w-4 h-4 text-slate-400" />
                        Business Profile
                    </h3>

                    <div className="grid gap-5">
                        <div>
                            <label htmlFor="business_name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Storefront Brand Name
                            </label>
                            <input
                                id="business_name"
                                type="text"
                                value={formData.business_name}
                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                About the Brand / Bio
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={inputClass}
                                placeholder="Describe what makes your collection unique..."
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Physical Store / Warehouse Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    City
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="region" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Region
                                </label>
                                <input
                                    id="region"
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="whatsapp" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    WhatsApp Line
                                </label>
                                <input
                                    id="whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="business_phone" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Business Contact Phone
                                </label>
                                <input
                                    id="business_phone"
                                    type="tel"
                                    value={formData.business_phone}
                                    onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Payment Information Card */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <CreditCard className="w-4 h-4 text-slate-400" />
                                Payout Settlement Details
                            </h3>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Where escrow payouts are disbursed once orders are fulfilled
                            </p>
                        </div>

                        {/* Payout Type Selector */}
                        <div className={`inline-flex p-1 rounded-xl border text-xs font-semibold ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                        }`}>
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutType('momo');
                                    if (!formData.bank_name || formData.bank_name.toLowerCase().includes('bank')) {
                                        setFormData(prev => ({ ...prev, bank_name: 'MTN Mobile Money' }));
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    payoutType === 'momo'
                                        ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Mobile Money
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutType('bank');
                                    if (!formData.bank_name || MOMO_PROVIDERS.includes(formData.bank_name)) {
                                        setFormData(prev => ({ ...prev, bank_name: '' }));
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    payoutType === 'bank'
                                        ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Bank Account
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        {payoutType === 'momo' ? (
                            <>
                                <div>
                                    <label htmlFor="momo_provider" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Mobile Money Network
                                    </label>
                                    <select
                                        id="momo_provider"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="">Select Network Provider</option>
                                        {MOMO_PROVIDERS.map(prov => (
                                            <option key={prov} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="momo_number" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Mobile Money Phone Number
                                        </label>
                                        <input
                                            id="momo_number"
                                            type="tel"
                                            value={formData.bank_account_number}
                                            onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                                            placeholder="e.g. 0244123456"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="momo_name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Registered SIM Account Name
                                        </label>
                                        <input
                                            id="momo_name"
                                            type="text"
                                            value={formData.bank_account_name}
                                            onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                                            placeholder="Name on SIM registration"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="bank_name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Bank Name
                                    </label>
                                    <input
                                        id="bank_name"
                                        type="text"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                        placeholder="e.g. Access Bank, Ecobank, GCB Bank, Stanbic"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="bank_account_number" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Bank Account Number
                                        </label>
                                        <input
                                            id="bank_account_number"
                                            type="text"
                                            value={formData.bank_account_number}
                                            onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                                            placeholder="e.g. 10023456789"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="bank_account_name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Account Holder Name
                                        </label>
                                        <input
                                            id="bank_account_name"
                                            type="text"
                                            value={formData.bank_account_name}
                                            onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                                            placeholder="Full name on bank account"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Visual Identity Card */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    <h3 className={`text-base font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Palette className="w-4 h-4 text-slate-400" />
                        Storefront Aesthetics
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Brand Avatar / Logo
                            </label>
                            <div className="flex items-center gap-4">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed ${
                                    isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                                }`}>
                                    {logoPreview ? (
                                        <Image src={logoPreview} alt="Logo" width={80} height={80} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-7 h-7 opacity-30 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                                            : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}>
                                        <Upload className="w-3.5 h-3.5" />
                                        Upload Logo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                    <p className="text-[11px] mt-1.5 text-slate-400">Recommended: Square 400x400px</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="banner_text" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Storefront Slogan / Subtitle
                                </label>
                                <input
                                    id="banner_text"
                                    type="text"
                                    value={formData.store_config.banner_text}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        store_config: { ...formData.store_config, banner_text: e.target.value }
                                    })}
                                    placeholder="e.g. London-curated luxury accessories"
                                    className={inputClass}
                                />
                            </div>

                            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                                isDark ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200/80 text-slate-500'
                            }`}>
                                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Official Editorial Branding
                                </p>
                                <p>
                                    Your public boutique automatically adopts London&apos;s Imports authentic editorial schema and verified trust badges for high-converting customer confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDark
                                ? 'bg-white text-slate-950 hover:bg-slate-100'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Settings</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
