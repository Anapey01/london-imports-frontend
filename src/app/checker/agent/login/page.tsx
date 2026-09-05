'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuthStore } from '@/stores/agentAuthStore';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function AgentLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAgentAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await login({ email, password });
      router.push('/checker/agent/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      const backendError = data?.detail || data?.error || data?.message || 'Invalid email or password.';
      setError(backendError);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-md mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-extrabold text-content-primary mb-2 tracking-tight">
            Reseller Agent Portal
          </h1>
          <p className="text-content-secondary font-normal text-xs uppercase tracking-widest leading-relaxed">
            Access your results checker micro-store dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-border-standard rounded-none p-8 shadow-diffusion-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="agent@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  href="/checker/agent/forgot-password"
                  className="text-[10px] font-bold text-content-secondary hover:text-brand-emerald transition-colors uppercase tracking-wider"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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
              className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 hover:text-white transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <span className="text-xs text-content-secondary">
              Don't have an agent account yet?{' '}
              <Link href="/checker/agent/register" className="font-bold text-content-primary underline hover:text-neutral-600">
                Register here
              </Link>
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/checker" className="text-xs font-bold text-content-secondary uppercase tracking-widest hover:text-black transition-colors">
            ← Back to Checker Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
