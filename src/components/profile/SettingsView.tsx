'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import ToggleSwitch from './ToggleSwitch';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SettingsView = ({ user, theme }: { user: User; theme: string }) => {
    const isDark = theme === 'dark';
    const { fetchUser } = useAuthStore();
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [notifications, setNotifications] = useState({
        orders: true,
        promotions: true,
        newsletter: false
    });

    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        region: user?.region || '',
        ghana_post_gps: user?.ghana_post_gps || '',
    });

    const inputClass = `w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark
        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500 placeholder:text-slate-600'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 placeholder:text-gray-400'
        }`;

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        setErrorMessage('');
        
        try {
            await authAPI.updateProfile(profileData);
            await fetchUser(); // Sync global store
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err: unknown) {
            console.error("Profile update failed:", err);
            setSaveStatus('error');
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'} flex items-center justify-between`}>
                <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Settings
                </h2>
                {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-right-2 duration-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Changes Saved</span>
                    </div>
                )}
            </div>

            {/* Personal Information */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Account & Delivery Information
                </h3>
                <div className={`p-6 rounded-xl border ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="firstName" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>First Name</label>
                            <input id="firstName" type="text" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="lastName" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Last Name</label>
                            <input id="lastName" type="text" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="email" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Email Address</label>
                            <input id="email" type="email" defaultValue={user?.email} className={`${inputClass} cursor-not-allowed opacity-60`} readOnly />
                        </div>
                        <div>
                            <label htmlFor="phone" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Phone Number</label>
                            <input id="phone" type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="Add phone number" className={inputClass} />
                        </div>
                        
                        {/* Address Fields - THE MISSING LINK */}
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-slate-800">
                             <label className={`block text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-pink-500/50' : 'text-pink-600/50'}`}>Default Shipping Address</label>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="address" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Street Address</label>
                            <textarea id="address" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className={`${inputClass} resize-none h-20`} placeholder="Your main delivery address" />
                        </div>
                        
                        <div>
                            <label htmlFor="city" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>City</label>
                            <input id="city" type="text" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className={inputClass} placeholder="e.g. Accra" />
                        </div>
                        
                        <div>
                            <label htmlFor="region" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Region</label>
                            <input id="region" type="text" value={profileData.region} onChange={e => setProfileData({...profileData, region: e.target.value})} className={inputClass} placeholder="e.g. Greater Accra" />
                        </div>
                        
                        <div>
                            <label htmlFor="gps" className={`block text-xs font-light mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Digital Address (GPS)</label>
                            <input id="gps" type="text" value={profileData.ghana_post_gps} onChange={e => setProfileData({...profileData, ghana_post_gps: e.target.value})} className={`${inputClass} font-mono uppercase`} placeholder="GA-XXX-XXXX" />
                        </div>
                    </div>
                    
                    {saveStatus === 'error' && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-xs font-medium">{errorMessage}</p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-8 py-3 bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-pink-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20`}
                        >
                            {isSaving ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Notifications
                </h3>
                <div className={`px-6 rounded-xl border divide-y ${isDark ? 'border-slate-800 divide-slate-800' : 'border-gray-200 divide-gray-100'}`}>
                    <ToggleSwitch
                        enabled={notifications.orders}
                        onChange={() => setNotifications({ ...notifications, orders: !notifications.orders })}
                        label="Order updates"
                        description="Receive notifications about your order status"
                        isDark={isDark}
                    />
                    <ToggleSwitch
                        enabled={notifications.promotions}
                        onChange={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
                        label="Promotions & offers"
                        description="Get notified about sales and special deals"
                        isDark={isDark}
                    />
                    <ToggleSwitch
                        enabled={notifications.newsletter}
                        onChange={() => setNotifications({ ...notifications, newsletter: !notifications.newsletter })}
                        label="Newsletter"
                        description="Weekly updates on new arrivals"
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* Security */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Security
                </h3>
                <div className={`rounded-xl border ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <Link
                        href="/reset-password"
                        className={`flex items-center justify-between p-5 transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</p>
                                <p className={`text-xs font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Update your password securely</p>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 text-red-500`}>
                    Danger Zone
                </h3>
                <div className={`p-6 rounded-xl border ${isDark ? 'border-red-900/50 bg-red-900/10' : 'border-red-100 bg-red-50/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Account</p>
                            <p className={`text-xs font-light ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Permanently delete your account and all data</p>
                        </div>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
