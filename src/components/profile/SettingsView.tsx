'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import ToggleSwitch from './ToggleSwitch';
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

    const inputClass = "w-full px-4 py-2.5 rounded-lg border outline-none transition-all text-[11px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-900 focus:border-brand-emerald focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300";

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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Account Settings</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        My Profile
                    </h2>
                </div>
                {saveStatus === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600"
                    >
                        <CheckCircle2 size={16} className="animate-bounce" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Profile Updated</span>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Core Profile Section */}
                <div className="lg:col-span-8 space-y-10">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <label htmlFor="first_name" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">First Name</label>
                                <input id="first_name" type="text" placeholder="Enter first name" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="last_name" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Last Name</label>
                                <input id="last_name" type="text" placeholder="Enter last name" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Email (Cannot be changed)</label>
                                <input id="email" type="email" value={user?.email} readOnly className={`${inputClass} bg-slate-50 border-transparent opacity-60 cursor-not-allowed`} placeholder="Email address" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="phone" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Phone Number</label>
                                <input id="phone" type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className={inputClass} placeholder="Enter phone" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="date_of_birth" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Date of Birth</label>
                                <input id="date_of_birth" type="date" value={profileData.date_of_birth} onChange={e => setProfileData({...profileData, date_of_birth: e.target.value})} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Default Delivery Address</h3>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label htmlFor="address" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Street Address</label>
                                <textarea 
                                    id="address"
                                    value={profileData.address} 
                                    onChange={e => setProfileData({...profileData, address: e.target.value})} 
                                    className={`${inputClass} h-20 resize-none`} 
                                    placeholder="Street, Building, Unit"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="city" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">City</label>
                                    <input id="city" type="text" placeholder="Enter city" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="region" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Region</label>
                                    <input id="region" type="text" placeholder="Enter region" value={profileData.region} onChange={e => setProfileData({...profileData, region: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="gps" className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">Ghana Post GPS</label>
                                    <input id="gps" type="text" value={profileData.ghana_post_gps} onChange={e => setProfileData({...profileData, ghana_post_gps: e.target.value})} className={inputClass} placeholder="GA-000-0000" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-10">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-brand-emerald transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-slate-900/10"
                        >
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Notifications
                        </h4>
                        <div className="space-y-4">
                            {[
                                { id: 'email_notifications', label: 'Email Alerts', desc: 'Detailed order receipts' },
                                { id: 'sms_notifications', label: 'SMS Alerts', desc: 'Real-time transit updates' },
                                { id: 'whatsapp_notifications', label: 'WhatsApp Alerts', desc: 'Direct updates via WhatsApp' },
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between group">
                                    <div className="max-w-[140px]">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={profileData[item.id as keyof typeof profileData] as boolean}
                                        onChange={() => {
                                            const key = item.id as keyof typeof profileData;
                                            setProfileData({ ...profileData, [key]: !profileData[key] });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1">Security</h4>
                        <Link
                            href="/reset-password"
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-900 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Change Password</span>
                            </div>
                            <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </Link>
                    </section>

                    <section className="pt-6 border-t border-slate-100">
                        <button className="w-full p-4 rounded-xl border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-center">
                            <p className="text-xs font-black uppercase tracking-widest">Delete Account</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">This action is permanent</p>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}


