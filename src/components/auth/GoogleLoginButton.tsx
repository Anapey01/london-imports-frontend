'use client';

import { useCallback, useRef, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/Toast';
import Script from 'next/script';

interface GoogleResponse {
    credential: string;
}

interface GoogleInterface {
    accounts: {
        id: {
            initialize: (config: {
                client_id: string;
                callback: (response: GoogleResponse) => void;
                auto_select: boolean;
                cancel_on_tap_outside: boolean;
            }) => void;
            renderButton: (parent: HTMLElement, options: {
                type: string;
                theme: string;
                size: string;
                text: string;
                shape: string;
                logo_alignment: string;
            }) => void;
        };
    };
}

function GoogleButtonContent({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
    const { googleLogin } = useAuthStore();
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleGoogleResponse = useCallback(async (response: GoogleResponse) => {
        try {
            await googleLogin(response.credential);
            const successMsg = mode === 'signup' 
                ? 'Welcome to Atelier! Your account is ready.' 
                : 'Success! Signed in with Google';
            
            showToast(successMsg, 'success');
            
            // Critical: Respect the redirect parameter for smooth checkout flows
            router.push(redirect);
        } catch (error: unknown) {
            console.error('[Atelier Auth] Google Handshake Failed:', error);
            const err = error as { response?: { data?: { error?: string } } };
            const errorMsg = err.response?.data?.error || 'Google authentication failed. Please try again.';
            showToast(errorMsg, 'error');
        }
    }, [googleLogin, router, showToast, redirect, mode]);

    const initializeGoogle = useCallback(() => {
        if (!clientID) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Atelier Auth] GOOGLE_CLIENT_ID missing in environment');
            }
            return;
        }

        const google = (window as unknown as { google?: GoogleInterface }).google;

        if (google?.accounts?.id && googleButtonRef.current) {
            try {
                // Ensure container is empty before rendering to avoid duplicate button frames
                if (googleButtonRef.current.hasChildNodes()) {
                    googleButtonRef.current.innerHTML = '';
                }

                // Initialize if not already done for this session
                if (!isInitialized.current) {
                    google.accounts.id.initialize({
                        client_id: clientID,
                        callback: handleGoogleResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });
                    isInitialized.current = true;
                }

                google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { 
                        type: 'standard',
                        theme: 'outline', 
                        size: 'large', 
                        text: mode === 'signin' ? 'signin_with' : 'signup_with',
                        shape: 'rectangular',
                        logo_alignment: 'center'
                    }
                );
            } catch (error) {
                console.error('[Atelier Auth] Error rendering Google button:', error);
            }
        }
    }, [clientID, mode, handleGoogleResponse]);

    // Handle mount and script availability polling
    useEffect(() => {
        const checkInterval = setInterval(() => {
            const google = (window as unknown as { google?: GoogleInterface }).google;
            if (google?.accounts?.id) {
                initializeGoogle();
                clearInterval(checkInterval);
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, [initializeGoogle]);

    return (
        <div className="w-full">
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={initializeGoogle}
            />
            
            <div className="relative mb-10 mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border-standard/50"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-content-secondary/30">
                    <span className="bg-surface px-6">Or continue with Google</span>
                </div>
            </div>
            
            {/* Standardized Atelier Button Container */}
            <div 
                ref={googleButtonRef} 
                className="w-full flex items-center justify-center min-h-[50px] transition-all duration-500" 
            />
            
            {!clientID && process.env.NODE_ENV === 'development' && (
                <p className="mt-4 text-center text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-500/20 p-4 rounded-xl bg-rose-500/5">
                    [ ATELIER_DEV_ALERT: GOOGLE_CLIENT_ID_MISSING ]
                </p>
            )}

            <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.2em] text-content-secondary/20">
                Official Google Security Protocol
            </p>
        </div>
    );
}

// Wrapper for Suspense (Required for useSearchParams)
const GoogleLoginButton = ({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) => (
    <Suspense fallback={<div className="h-20 w-full animate-pulse bg-slate-50" />}>
        <GoogleButtonContent mode={mode} />
    </Suspense>
);

export default GoogleLoginButton;
