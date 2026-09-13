'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import NotificationCenter from './NotificationCenter';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

export default function SettingsView({ user }: { user: User }) {
    const { fetchUser } = useAuthStore();
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');


    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        region: user?.region || '',
        ghana_post_gps: user?.ghana_post_gps || '',
        email_notifications: user?.email_notifications ?? true,
        sms_notifications: user?.sms_notifications ?? true,
        whatsapp_notifications: user?.whatsapp_notifications ?? false,
        date_of_birth: user?.date_of_birth || '',
    });

    const inputClass = "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-xs font-medium bg-surface dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-brand-emerald focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600";

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        
        try {
            await authAPI.updateProfile(profileData);
            await fetchUser();
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
            setSaveStatus('error');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 4000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-24">
            {/* Profile Settings Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Account Settings</p>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                        My Profile
                    </h2>
                </div>
                {saveStatus === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-400"
                    >
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Changes Saved</span>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Core Profile Section */}
                <div className="lg:col-span-8 space-y-10">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">First Name</label>
                                <input id="first_name" type="text" placeholder="Enter first name" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Last Name</label>
                                <input id="last_name" type="text" placeholder="Enter last name" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Email Address</label>
                                <input id="email" type="email" value={user?.email} readOnly className={`${inputClass} bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 cursor-not-allowed`} placeholder="Email address" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Phone Number</label>
                                <input id="phone" type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className={inputClass} placeholder="Enter phone number" />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2 sm:max-w-xs">
                                <label htmlFor="date_of_birth" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Date of Birth</label>
                                <input id="date_of_birth" type="date" value={profileData.date_of_birth} onChange={e => setProfileData({...profileData, date_of_birth: e.target.value})} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Default Delivery Address</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Street Address</label>
                                <textarea 
                                    id="address"
                                    value={profileData.address} 
                                    onChange={e => setProfileData({...profileData, address: e.target.value})} 
                                    className={`${inputClass} h-20 resize-none font-normal`} 
                                    placeholder="Street name, landmark, building, apartment"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="city" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">City</label>
                                    <input id="city" type="text" placeholder="e.g. Accra" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="region" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Region</label>
                                    <input id="region" type="text" placeholder="e.g. Greater Accra" value={profileData.region} onChange={e => setProfileData({...profileData, region: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="gps" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">Ghana Post GPS</label>
                                    <input id="gps" type="text" value={profileData.ghana_post_gps} onChange={e => setProfileData({...profileData, ghana_post_gps: e.target.value})} className={inputClass} placeholder="GA-000-0000" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-emerald dark:hover:bg-brand-emerald dark:hover:text-white transition-all active:scale-[0.99] disabled:opacity-50 shadow-sm"
                        >
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-8">
                    <NotificationCenter
                        emailNotifications={profileData.email_notifications}
                        smsNotifications={profileData.sms_notifications}
                        whatsappNotifications={profileData.whatsapp_notifications}
                        onPreferenceChange={(key, value) => {
                            setProfileData(prev => ({ ...prev, [key]: value }));
                        }}
                    />

                    <section className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white px-1">Security</h4>
                        <Link
                            href="/password-reset"
                            className="flex items-center justify-between p-4 bg-surface dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-slate-900 dark:hover:border-slate-700 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">Change Password</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                        </Link>
                    </section>

                    <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all text-center">
                            <p className="text-xs font-black uppercase tracking-wider">Delete Account</p>
                            <p className="text-[10px] opacity-70 mt-0.5">Permanently remove account and data</p>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}


