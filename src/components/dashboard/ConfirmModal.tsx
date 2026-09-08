'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling when modal is active
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-950 border border-slate-900 dark:border-slate-800 shadow-2xl p-8 sm:p-10 my-auto"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        </button>

                        <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${variant === 'danger' ? 'bg-rose-500' : 'bg-[#8B5E3C]'}`} />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                    {variant === 'danger' ? 'ACTION REQUIRED' : 'CONFIRMATION'}
                                </span>
                            </div>

                            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex w-full gap-3 pt-2 border-t border-slate-100 dark:border-slate-900">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-5 font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={async () => {
                                        await new Promise(resolve => setTimeout(resolve, 10));
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-3 px-5 font-black text-[10px] uppercase tracking-widest text-white transition-all cursor-pointer ${
                                        variant === 'danger'
                                            ? 'bg-rose-600 hover:bg-rose-700'
                                            : 'bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950'
                                    }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
