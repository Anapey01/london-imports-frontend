'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const GoogleProtocolButton = ({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) => {
    const { googleLogin, isLoading } = useAuthStore();
    const router = useRouter();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        
        if (!clientID) {
            console.error('Google Client ID is missing in environment.');
            return;
        }

        // Initialize Google Identity Services
        const initializeGoogle = () => {
            if ((window as any).google) {
                (window as any).google.accounts.id.initialize({
                    client_id: clientID,
                    callback: handleGoogleResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                (window as any).google.accounts.id.renderButton(
                    googleButtonRef.current!,
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
            }
        };

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [mode]);

    const handleGoogleResponse = async (response: any) => {
        try {
            await googleLogin(response.credential);
            toast.success('Success! Signed in with Google');
            router.push('/');
        } catch (error) {
            console.error('Google Login Error:', error);
            toast.error('Google sign-in failed. Please try again.');
        }
    };

    return (
        <div className="w-full">
            <div className="relative mb-10 mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                    <span className="bg-white px-6">Or continue with Google</span>
                </div>
            </div>
            
            <div 
                ref={googleButtonRef} 
                className="w-full overflow-hidden rounded-xl h-14 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity border border-slate-100" 
            />
            
            <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-20">
                Official Google Security
            </p>
        </div>
    );
};

export default GoogleProtocolButton;
