'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import ToggleSwitch from './ToggleSwitch';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

export default function SettingsView({ user }: { user: User }) {
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

    const inputClass = "w-full px-4 py-2.5 rounded-lg border outline-none transition-all text-[11px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-900 focus:border-brand-emerald focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300";

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        setErrorMessage('');
        
        try {
            await authAPI.updateProfile(profileData);
            await fetchUser();
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err: any) {
            setSaveStatus('error');
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-24">
            {/* High-Authority Header */}
            <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                        Account Hub
                    </h2>
                    <p className="text-[9px] font-black mt-1 text-slate-400 uppercase tracking-[0.2em]">
                        Global Identity & Logistics Management
                    </p>
                </div>
                {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile Synced</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Core Profile Section */}
                <div className="lg:col-span-8 space-y-10">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Personal Manifest</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">First Name</label>
                                <input type="text" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Last Name</label>
                                <input type="text" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Email (Immutable)</label>
                                <input type="email" value={user?.email} readOnly className={`${inputClass} bg-slate-50 border-transparent opacity-60 cursor-not-allowed`} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Contact Terminal</label>
                                <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className={inputClass} placeholder="Enter phone" />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Default Logistics Node</h3>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Delivery Pipeline Address</label>
                                <textarea 
                                    value={profileData.address} 
                                    onChange={e => setProfileData({...profileData, address: e.target.value})} 
                                    className={`${inputClass} h-20 resize-none`} 
                                    placeholder="Street, Building, Unit"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">City Hub</label>
                                    <input type="text" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Regional Zone</label>
                                    <input type="text" value={profileData.region} onChange={e => setProfileData({...profileData, region: e.target.value})} className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">GPS Endpoint</label>
                                    <input type="text" value={profileData.ghana_post_gps} onChange={e => setProfileData({...profileData, ghana_post_gps: e.target.value})} className={inputClass} placeholder="GA-000-0000" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-emerald-500/5"
                        >
                            {isSaving ? 'Syncing Profile...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            Notifications
                        </h4>
                        <div className="space-y-4">
                            {[
                                { id: 'orders', label: 'Order Pipeline', desc: 'Critical status updates' },
                                { id: 'promotions', label: 'Global Offers', desc: 'Sales & flash alerts' },
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.label}</p>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={(notifications as any)[item.id]}
                                        onChange={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-900 px-1">Security Manifest</h4>
                        <Link
                            href="/reset-password"
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-900 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Change Password</span>
                            </div>
                            <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </Link>
                    </section>

                    <section className="pt-6 border-t border-slate-100">
                        <button className="w-full p-4 rounded-xl border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest">Deactivate Identity</p>
                            <p className="text-[7px] font-bold uppercase tracking-widest opacity-60 mt-1">Permanent data erasure</p>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default SettingsView;
