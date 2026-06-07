import React from 'react';

/**
 * 🎭 Global Page Transition Template
 * Next.js 'template.tsx' re-mounts on every navigation, 
 * making it the perfect place for entrance animations.
 * 
 * Optimized: Uses high-performance CSS animations in globals.css 
 * to prevent loading client-side JavaScript (framer-motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-elite-entrance">
            {children}
        </div>
    );
}
