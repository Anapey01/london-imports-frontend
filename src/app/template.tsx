'use client';

import { motion } from 'framer-motion';

/**
 * 🎭 Global Page Transition Template
 * Next.js 'template.tsx' re-mounts on every navigation, 
 * making it the perfect place for entrance animations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1], // Custom "Elite" ease-out
                delay: 0.05
            }}
        >
            {children}
        </motion.div>
    );
}
