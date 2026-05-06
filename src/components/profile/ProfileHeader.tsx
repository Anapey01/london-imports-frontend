'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { User } from '@/types';
import { ShieldCheck, LayoutDashboard, Mail, Phone, Camera, ArrowUpRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ user }: { user: User }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const memberSince = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                localStorage.setItem('userAvatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarUrl(savedAvatar);
    }, []);

    const isAdmin = user.role === 'ADMIN' || user.is_staff || user.is_superuser;
    const isVendor = user.role === 'VENDOR';

    return (
        <div className="w-full bg-slate-50/50 border-b border-slate-200/60 pt-28 pb-10 relative overflow-hidden">
            {/* Background Texture: Architectural Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.4] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10">
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Avatar Node: The Focus Point */}
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                id="avatar-upload"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer block relative p-1.5 rounded-full bg-white shadow-xl shadow-slate-200/50 group-hover:scale-105 transition-transform duration-700"
                            >
                                <div className="h-28 w-28 rounded-full border-2 border-slate-50 overflow-hidden relative bg-slate-100">
                                    {avatarUrl ? (
                                        <NextImage
                                            src={avatarUrl}
                                            alt="Avatar"
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                            <span className="text-4xl font-serif italic text-white/20 select-none">
                                                {user.first_name?.[0]}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                        <Camera size={20} className="text-white transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500" />
                                    </div>
                                </div>
                                
                                {/* Status Orb */}
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-1 -right-1 h-9 w-9 bg-brand-emerald text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                                >
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                </motion.div>
                            </label>
                        </div>

                        {/* Identity Module: Editorial Typography */}
                        <div className="text-center md:text-left space-y-4 max-w-xl">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                                    {isVendor ? 'Authorized Vendor' : isAdmin ? 'Sovereign Official' : 'Atelier Member'}
                                </p>
                                <h1 className="text-4xl sm:text-5xl font-serif italic font-light tracking-tight text-slate-900 leading-[0.9]">
                                    {user.first_name} <span className="font-bold not-italic tracking-tighter">{user.last_name}</span>
                                </h1>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/60 rounded-full shadow-sm">
                                    <Mail size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{user.email}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full">
                                    <ShieldCheck size={12} className="text-brand-emerald" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-emerald">Verified Profile</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Deck: Glassmorphism */}
                    <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md border border-white/60 p-2 rounded-2xl shadow-xl shadow-slate-200/20">
                        {(isAdmin || isVendor) && (
                            <Link
                                href={isAdmin ? "/dashboard/admin" : "/dashboard/vendor"}
                                className="flex items-center gap-4 pl-6 pr-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-brand-emerald transition-all duration-700 group"
                            >
                                <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                                    {isAdmin ? 'Operations' : 'Management'}
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors">
                                    <LayoutDashboard size={14} />
                                </div>
                            </Link>
                        )}
                        
                        <button 
                            onClick={() => setShowInfo(!showInfo)}
                            className={`flex items-center justify-center h-14 w-14 rounded-xl border transition-all duration-500 ${
                                showInfo ? 'bg-white border-slate-900 text-slate-900 shadow-inner' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300'
                            }`}
                        >
                            <ArrowUpRight size={20} className={`transition-transform duration-500 ${showInfo ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Status Bridge: Minimal Metrics */}
                <div className="mt-12 flex flex-wrap items-center gap-12 pt-8 border-t border-slate-200/40">
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-emerald/10 transition-colors">
                            <Calendar size={16} className="text-slate-400 group-hover:text-brand-emerald" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Since</p>
                            <p className="text-xs font-black text-slate-900 uppercase">{memberSince}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-emerald/10 transition-colors">
                            <ShieldCheck size={16} className="text-slate-400 group-hover:text-brand-emerald" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account ID</p>
                            <p className="text-xs font-black text-slate-900 tabular-nums">#{user.id?.toString().slice(-4).toUpperCase() || 'OFFICIAL'}</p>
                        </div>
                    </div>
                    
                    {showInfo && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-wrap gap-8 justify-end"
                        >
                            {user.phone && (
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Line</p>
                                    <p className="text-xs font-black text-slate-900">{user.phone}</p>
                                </div>
                            )}
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                <p className="text-xs font-black text-brand-emerald uppercase tracking-tighter">Active Sync</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
