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
        <div className="w-full bg-white border-b border-slate-100 pt-32 pb-16 relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col items-center text-center">
                    {/* Editorial Avatar */}
                    <div className="relative group mb-8">
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
                        <label htmlFor="avatar-upload" className="cursor-pointer block relative p-1.5 rounded-full ring-1 ring-slate-100 group-hover:ring-slate-200 transition-all duration-700">
                            <div className="h-28 w-28 rounded-full overflow-hidden relative bg-slate-900 flex items-center justify-center shadow-2xl">
                                {avatarUrl ? (
                                    <NextImage src={avatarUrl} alt="Avatar" fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                                ) : (
                                    <span className="text-3xl font-serif italic text-white/30 select-none">{user.first_name?.[0]}</span>
                                )}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Identity Hierarchy */}
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-4">
                        {user.is_staff ? 'Official Staff' : user.role === 'VENDOR' ? 'Partner Vendor' : 'Member'}
                    </p>
                    
                    <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-slate-900 mb-6 lowercase">
                        {user.first_name} {user.last_name}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-1.5 border border-slate-100 rounded-full">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50/50 border border-emerald-100/50 rounded-full">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Member</span>
                        </div>
                    </div>

                    {/* Minimalist Metrics */}
                    <div className="flex items-center justify-center gap-6 text-slate-300 border-t border-slate-50 pt-8 w-full max-w-xs">
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-200 mb-1">Est.</p>
                            <p className="text-[11px] font-black text-slate-400 tracking-tighter">{memberSince}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-50" />
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-200 mb-1">ID</p>
                            <p className="text-[11px] font-black text-slate-400 tracking-tighter">#{user.id?.toString().slice(-4).toUpperCase() || '5313'}</p>
                        </div>
                    </div>

                    {/* PORTAL LINK: Only for Admins or Vendors */}
                    {(user.is_staff || user.role === 'VENDOR') && (
                        <div className="mt-12">
                            <a 
                                href={user.is_staff ? '/admin' : '/dashboard/vendor'} 
                                className="group flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                    {user.is_staff ? 'Admin Console' : 'Vendor Dashboard'}
                                </span>
                                <div className="w-5 h-px bg-white/20 group-hover:w-8 transition-all" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
