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
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 my-auto"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                                variant === 'danger' 
                                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' 
                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                            }`}>
                                <AlertTriangle className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-black text-slate-950 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={async () => {
                                        await new Promise(resolve => setTimeout(resolve, 10));
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white transition-all shadow-lg cursor-pointer ${
                                        variant === 'danger'
                                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                                            : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
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
