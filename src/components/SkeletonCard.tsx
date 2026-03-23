'use client';

import { motion } from 'framer-motion';

export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative h-full">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                />
            </div>
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-100 rounded-full w-24 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full w-12" />
                </div>
                <div className="h-6 bg-gray-100 rounded-xl w-full pr-4 relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-100 rounded-full w-24 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                        />
                    </div>
                </div>
                <div className="pt-2">
                    <div className="h-10 bg-gray-50 rounded-2xl w-full" />
                </div>
            </div>
        </div>
    );
}
