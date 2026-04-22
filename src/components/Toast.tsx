/**
 * London's Imports - Toast Notification Component
 * Hardened for WCAG 'Robust' Compliance (4.1.3 Status Messages)
 */
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuraAlert, AlertType } from './AuraAlert';
import { AnimatePresence } from 'framer-motion';

interface Toast {
    id: string;
    message: string;
    type: AlertType;
}

interface ToastContextType {
    showToast: (message: string, type?: AlertType) => void;
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

    const showToast = useCallback((message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Sovereign Aura Alert Container - Improved for Mobile (Bottom Center) */}
            <div 
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[420px] px-4 flex flex-col items-center pointer-events-none"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {toasts.map(toast => (
                        <AuraAlert
                            key={toast.id}
                            id={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
