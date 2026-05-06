'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { User } from '@/types';
import { ShieldCheck, Camera, Calendar, Hash } from 'lucide-react';

const ProfileHeader = ({ user }: { user: User }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const memberSince = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

    useEffect(() => {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarUrl(savedAvatar);
    }, []);

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

    return (
        <div className="w-full bg-white border-b border-slate-100 pt-24 pb-8 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Compact Avatar */}
                    <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
                        <label htmlFor="avatar-upload" className="cursor-pointer block relative p-1 rounded-full bg-slate-50 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                            <div className="h-20 w-20 rounded-full overflow-hidden relative bg-slate-900 flex items-center justify-center">
                                {avatarUrl ? (
                                    <NextImage src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <span className="text-xl font-serif italic text-white/20 select-none">{user.first_name?.[0]}</span>
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={16} className="text-white" />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Minimalist Identity */}
                    <div className="text-center sm:text-left min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">
                            {user.role === 'VENDOR' ? 'Vendor' : user.is_staff ? 'Staff' : 'Member'}
                        </p>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full">
                                <ShieldCheck size={10} className="text-brand-emerald" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100/50 rounded-full">
                                <ShieldCheck size={10} className="text-brand-emerald" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-emerald">Verified Member</span>
                            </div>
                        </div>

                        {/* Inline Metrics */}
                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={10} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Est. {memberSince}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1.5">
                                <Hash size={10} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">ID {user.id?.toString().slice(-4).toUpperCase() || 'OFFICIAL'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
