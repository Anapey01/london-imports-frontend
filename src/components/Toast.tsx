/**
 * London's Imports - Toast Notification Component
 * Hardened for WCAG 'Robust' Compliance (4.1.3 Status Messages)
 */
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after 3.5 seconds to give screen readers time to announce
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const icons: Record<ToastType, React.ReactElement> = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors: Record<ToastType, string> = {
        success: 'bg-surface border-emerald-500/20 shadow-emerald-500/5',
        error: 'bg-surface border-rose-500/20 shadow-rose-500/5',
        warning: 'bg-surface border-amber-500/20 shadow-amber-500/5',
        info: 'bg-surface border-blue-500/20 shadow-blue-500/5',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container - Hardened as a Live Region */}
            <div 
                className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border shadow-diffusion-lg animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto cursor-pointer group ${bgColors[toast.type]}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className="flex-shrink-0">
                            {icons[toast.type]}
                        </div>
                        <span className="text-xs font-black text-content-primary uppercase tracking-widest">{toast.message}</span>
                        <button 
                            className="ml-4 p-1 text-content-secondary/40 hover:text-content-primary transition-colors institutional-focus rounded-lg"
                            onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                            aria-label={`Close ${toast.type} notification`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
