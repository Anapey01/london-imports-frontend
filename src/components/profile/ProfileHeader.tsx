'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { User } from '@/types';
import { ShieldCheck, LayoutDashboard, Mail, Phone, Camera } from 'lucide-react';

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
        <div className="w-full bg-white border-b border-slate-100 pt-32 pb-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Node */}
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
                                className="cursor-pointer block relative"
                            >
                                <div className="h-24 w-24 rounded-full border border-slate-100 p-1 bg-white shadow-sm transition-transform group-hover:scale-105 duration-500">
                                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                        {avatarUrl ? (
                                            <NextImage
                                                src={avatarUrl}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-serif italic text-slate-300">
                                                {user.first_name?.[0]}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                {/* Online/Verified Status Indicator */}
                                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-brand-emerald border-4 border-white shadow-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                </div>
                            </label>
                        </div>

                        {/* Identity Module */}
                        <div className="text-center md:text-left space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                                {isVendor ? 'Vendor Partner' : isAdmin ? 'Sovereign Administrator' : 'Customer Profile'}
                            </p>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    {user.email}
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-brand-emerald flex items-center gap-1">
                                        <ShieldCheck size={12} /> Verified Member
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Architectural Action Deck */}
                    <div className="flex items-center gap-4">
                        {(isAdmin || isVendor) && (
                            <Link
                                href={isAdmin ? "/dashboard/admin" : "/dashboard/vendor"}
                                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-brand-emerald transition-all duration-500 group"
                            >
                                <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                    {isAdmin ? 'Admin Portal' : 'Vendor Portal'}
                                </span>
                            </Link>
                        )}
                        
                        <button 
                            onClick={() => setShowInfo(!showInfo)}
                            className="flex items-center justify-center w-12 h-12 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all"
                        >
                            <Mail size={16} />
                        </button>
                    </div>
                </div>

                {/* Expanded Contact Node */}
                {showInfo && (
                    <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-8 justify-center md:justify-start animate-fade-in">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Direct Email</p>
                            <p className="text-xs font-bold text-slate-900">{user.email}</p>
                        </div>
                        {user.phone && (
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Phone Contact</p>
                                <p className="text-xs font-bold text-slate-900">{user.phone}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Member Since</p>
                            <p className="text-xs font-bold text-slate-900">{memberSince}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
