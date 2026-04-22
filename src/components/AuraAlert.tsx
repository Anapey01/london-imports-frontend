'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning' | 'processing';

interface AuraAlertProps {
    id: string;
    message: string;
    type: AlertType;
    onClose: (id: string) => void;
}

const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
    processing: <Loader2 className="w-5 h-5 text-white animate-spin" />,
};

const styles = {
    success: 'border-emerald-500/20 bg-[#0a0a0b]/80',
    error: 'border-rose-500/20 bg-[#0a0a0b]/80',
    warning: 'border-amber-500/20 bg-[#0a0a0b]/80',
    info: 'border-sky-500/20 bg-[#0a0a0b]/80',
    processing: 'border-white/10 bg-[#0a0a0b]/80',
};

const shadows = {
    success: 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]',
    error: 'shadow-[0_0_40px_-10px_rgba(244,63,94,0.15)]',
    warning: 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]',
    info: 'shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)]',
    processing: 'shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]',
};

export function AuraAlert({ id, message, type, onClose }: AuraAlertProps) {
    useEffect(() => {
        if (type !== 'processing') {
            const timer = setTimeout(() => onClose(id), 5000);
            return () => clearTimeout(timer);
        }
    }, [id, type, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
                relative flex items-center gap-4 px-6 py-4 
                rounded-2xl border backdrop-blur-2xl
                ${styles[type]} ${shadows[type]}
                pointer-events-auto cursor-pointer group
                max-w-[400px] w-full mx-auto mb-3
            `}
            onClick={() => type !== 'processing' && onClose(id)}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/90 leading-snug">
                    {message}
                </p>
            </div>

            {type !== 'processing' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(id);
                    }}
                    className="flex-shrink-0 p-1 text-white/20 hover:text-white/60 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Subtle Progress Bar for Auto-close */}
            {type !== 'processing' && (
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 5, ease: 'linear' }}
                    style={{ originX: 0 }}
                    className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-30 ${type === 'success' ? 'bg-emerald-400' : 'bg-white'}`}
                />
            )}
        </motion.div>
    );
}
