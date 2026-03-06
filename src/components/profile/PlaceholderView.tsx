'use client';

import React from 'react';

// Placeholder View
const PlaceholderView = ({ title, icon, theme }: { title: string; icon: React.ReactNode; theme: string }) => {
    const isDark = theme === 'dark';
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className={`mb-6 ${isDark ? 'text-slate-700' : 'text-gray-200'}`}>
                <div className="w-16 h-16">
                    {icon}
                </div>
            </div>
            <h2 className={`text-xl font-light tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <p className={`text-sm font-light max-w-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                This feature is coming soon. We&apos;re working on making your {(title || '').toLowerCase()} experience even better.
            </p>
        </div>
    );
};

export default PlaceholderView;
