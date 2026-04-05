'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { User } from '@/types';

// Polished Minimal Profile Header with Avatar Upload
const ProfileHeader = ({ user }: { user: User }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const memberSince = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

    // Handle avatar upload
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

    // Load avatar from localStorage on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatarUrl(savedAvatar);
    }, []);

    return (
        <div className="w-full border-b border-border-standard transition-all pt-24 md:pt-28 bg-surface">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    {/* Avatar */}
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
                            className="cursor-pointer block focus:outline-none"
                        >
                            <div className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-border-standard bg-surface-card transition-transform group-hover:scale-105">
                                {avatarUrl ? (
                                    <div className="relative w-full h-full">
                                        <NextImage
                                            src={avatarUrl}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <svg className="w-10 h-10 text-content-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </div>
                        </label>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-content-primary italic">
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-content-secondary">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${user.role === 'VENDOR'
                                ? 'bg-brand-emerald/10 text-brand-emerald'
                                : 'bg-surface-card text-content-secondary border border-border-standard'
                                }`}>
                                {user.role}
                            </span>
                            <span className="opacity-50">·</span>
                            <span className="font-light">Member since {memberSince}</span>
                        </div>

                        {/* Contact Info (expandable) */}
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="mt-3 text-xs flex items-center gap-1.5 text-content-secondary hover:text-content-primary transition-all uppercase tracking-widest font-black"
                        >
                            <svg className={`w-3.5 h-3.5 transition-transform ${showInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                            {showInfo ? 'Hide contact info' : 'View contact info'}
                        </button>

                        {showInfo && (
                            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-content-secondary">
                                <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-brand-emerald transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    {user.email}
                                </a>
                                {user.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-2 sm:mt-0">
                        {user.role === 'VENDOR' ? (
                            <Link
                                href="/dashboard/vendor"
                                className="group inline-flex items-center gap-2 border-b border-content-primary pb-0.5 text-[11px] font-black uppercase tracking-widest text-content-primary hover:text-brand-emerald hover:border-brand-emerald transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                                Vendor Dashboard
                            </Link>
                        ) : (user.role === 'ADMIN' || user.is_staff || user.is_superuser) ? (
                            <Link
                                href="/dashboard/admin"
                                className="group inline-flex items-center gap-2 border-b border-content-primary pb-0.5 text-[11px] font-black uppercase tracking-widest text-content-primary hover:text-brand-emerald hover:border-brand-emerald transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                Admin Dashboard
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
