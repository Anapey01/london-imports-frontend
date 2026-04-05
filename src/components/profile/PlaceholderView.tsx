'use client';

import React from 'react';

// Placeholder View
const PlaceholderView = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="mb-6 text-content-secondary opacity-30">
                <div className="w-16 h-16">
                    {icon}
                </div>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-content-primary italic">{title}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-sm text-content-secondary leading-relaxed">
                This feature is currently under high-authority development. We&apos;re refining your {(title || '').toLowerCase()} experience to exceed global standards.
            </p>
        </div>
    );
};

export default PlaceholderView;
