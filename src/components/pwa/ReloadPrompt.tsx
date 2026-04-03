'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * London's Imports - PWA Reload Prompt
 * Notifies the user when a new version of the app is available.
 * This fixes the "stale PWA" issue where users see old styles/bugs.
 */
export default function ReloadPrompt() {
  const [show, setShow] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Only run in browser and if service workers are supported
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleServiceWorker = (reg: ServiceWorkerRegistration) => {
      // Check if there is already an updated worker waiting
      if (reg.waiting) {
        setRegistration(reg);
        setShow(true);
        return;
      }

      // Listen for new workers being installed
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setRegistration(reg);
              setShow(true);
            }
          });
        }
      });
    };

    // Get current registration
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) handleServiceWorker(reg);
    });

    // Also check for updates periodically (every hour)
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) reg.update();
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const onReload = () => {
    if (registration && registration.waiting) {
      // Tell the waiting worker to skipWaiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for the new worker taking control to reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[100] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-[#006B5A] text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 max-w-md border border-white/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Update Available</p>
            <p className="text-xs text-white/80">Refresh for the latest premium features.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onReload}
            className="bg-white text-[#006B5A] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Update Now
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
