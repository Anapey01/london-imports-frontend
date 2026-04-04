'use client';

import React from 'react';

// Placeholder View
const PlaceholderView = ({ title, icon, theme }: { title: string; icon: React.ReactNode; theme: string }) => {
    const isDark = theme === 'dark';
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="mb-6 nuclear-text opacity-20">
                <div className="w-16 h-16">
                    {icon}
                </div>
            </div>
            <h2 className="text-xl font-light tracking-tight mb-2 nuclear-text">{title}</h2>
            <p className="text-sm font-light max-w-sm nuclear-text opacity-50">
                This feature is coming soon. We&aposs working on making your {(title || '').toLowerCase()} experience even better.
            </p>
        </div>
    );
};

export default PlaceholderView;
