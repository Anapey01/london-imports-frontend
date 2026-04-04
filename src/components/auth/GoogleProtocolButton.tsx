'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Script from 'next/script';

const GoogleProtocolButton = ({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) => {
    const { googleLogin } = useAuthStore();
    const router = useRouter();
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const initializeGoogle = useCallback(() => {
        if (!clientID) {
            if (process.env.NODE_ENV === 'development') {
                console.error('DEBUG: Google Client ID is missing in environment.');
            }
            return;
        }

        if ((window as any).google && googleButtonRef.current) {
            try {
                // Remove existing button if any to prevent duplicates on remount
                if (googleButtonRef.current.hasChildNodes()) {
                    googleButtonRef.current.innerHTML = '';
                }

                (window as any).google.accounts.id.initialize({
                    client_id: clientID,
                    callback: handleGoogleResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                (window as any).google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { 
                        type: 'standard',
                        theme: 'outline', 
                        size: 'large', 
                        text: mode === 'signin' ? 'signin_with' : 'signup_with',
                        shape: 'rectangular',
                        width: '100%',
                        logo_alignment: 'center'
                    }
                );
            } catch (error) {
                console.error('Error rendering Google button:', error);
            }
        }
    }, [clientID, mode]);

    // Handle initial script mount and subsequent navigations
    useEffect(() => {
        const checkInterval = setInterval(() => {
            if ((window as any).google) {
                initializeGoogle();
                clearInterval(checkInterval);
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, [initializeGoogle]);

    const handleGoogleResponse = useCallback(async (response: any) => {
        try {
            await googleLogin(response.credential);
            toast.success('Success! Signed in with Google');
            router.push('/');
        } catch (error) {
            console.error('Google Login Error:', error);
            toast.error('Google sign-in failed. Please try again.');
        }
    }, [googleLogin, router]);

    return (
        <div className="w-full">
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={initializeGoogle}
            />
            
            <div className="relative mb-10 mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                    <span className="bg-white px-6">Or continue with Google</span>
                </div>
            </div>
            
            {/* Clean container without manual border/opacity that was masking failures */}
            <div 
                ref={googleButtonRef} 
                className="w-full flex items-center justify-center min-h-[50px] transition-all duration-300" 
            />
            
            {!clientID && process.env.NODE_ENV === 'development' && (
                <p className="mt-4 text-center text-[10px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/20 p-2 rounded">
                    [ DEVELOPER_MODE: CLIENT_ID_MISSING ]
                </p>
            )}

            <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-20">
                Official Google Security
            </p>
        </div>
    );
};

export default GoogleProtocolButton;
