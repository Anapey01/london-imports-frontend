'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuthStore } from '@/stores/agentAuthStore';
import Link from 'next/link';

export default function AgentRegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAgentAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const storeNameRef = useRef<HTMLInputElement>(null);
  const [momoNetwork, setMomoNetwork] = useState<'MTN' | 'TELECEL' | 'AT'>('MTN');
  const momoNumberRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/checker/agent/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = emailRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const store_name = storeNameRef.current?.value?.trim() || '';
    const momo_number = momoNumberRef.current?.value?.trim() || '';

    if (!email || !password || !store_name || !momo_number) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await register({
        email,
        password,
        store_name,
        momo_network: momoNetwork,
        momo_number
      });
      // Redirect to dashboard on success
      router.push('/checker/agent/dashboard');
    } catch (err: any) {
      let backendError = 'Registration failed. Please check inputs.';
      if (err.response?.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          // Flatten standard DRF serializer field validation errors
          backendError = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        } else {
          backendError = errors.error || backendError;
        }
      }
      setError(backendError);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-md mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-extrabold text-content-primary mb-2 tracking-tight">
            Register Agent Profile
          </h1>
          <p className="text-content-secondary font-normal text-xs uppercase tracking-widest leading-relaxed">
            Apply to become a Results Checker reseller agent
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-surface border border-border-standard rounded-none p-8 shadow-diffusion-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                Store Name / Brand <span className="text-red-500">*</span>
              </label>
              <input
                ref={storeNameRef}
                type="text"
                required
                placeholder="e.g. John's Fast Checker Hub"
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="e.g. agent@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                ref={passwordRef}
                type="password"
                required
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Mobile Money Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  MoMo Network <span className="text-red-500">*</span>
                </label>
                <select
                  value={momoNetwork}
                  onChange={(e) => setMomoNetwork(e.target.value as 'MTN' | 'TELECEL' | 'AT')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                >
                  <option value="MTN">MTN</option>
                  <option value="TELECEL">Telecel</option>
                  <option value="AT">AirtelTigo</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  MoMo Number <span className="text-red-500">*</span>
                </label>
                <input
                  ref={momoNumberRef}
                  type="text"
                  required
                  placeholder="e.g. 0545142658"
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald hover:text-white transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {isLoading ? 'Registering Agent...' : 'Register'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <span className="text-xs text-content-secondary">
              Already have an agent account?{' '}
              <Link href="/checker/agent/login" className="font-bold text-brand-emerald hover:underline">
                Sign in here
              </Link>
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/checker" className="text-xs font-bold text-content-secondary uppercase tracking-widest hover:text-brand-emerald transition-colors">
            ← Back to Checker Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
