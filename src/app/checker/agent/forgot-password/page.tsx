'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { checkersAPI } from "@/lib/api";

export default function AgentForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.agentRequestPasswordReset({ email: targetEmail });
      const data = response.data as { message?: string };
      setMessage(data.message || "If an agent account exists with this email, a reset link has been sent.");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to request password reset. Please check your connection.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-md mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-extrabold text-content-primary mb-2 tracking-tight">
            Reset Agent Password
          </h1>
          <p className="text-content-secondary font-normal text-xs uppercase tracking-widest leading-relaxed">
            Reseller Agent Micro-Store Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-standard rounded-none p-8 shadow-diffusion-md space-y-6">
          {message ? (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-none text-xs font-bold uppercase tracking-wide flex flex-col items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
                <span>{message}</span>
              </div>
              <p className="text-content-secondary text-xs leading-relaxed">
                Please check your inbox and spam folder for the password reset link. The link expires in 24 hours.
              </p>
              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/checker/agent/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-content-primary hover:text-brand-emerald transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Agent Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-content-secondary text-xs leading-relaxed">
                Enter your registered agent email address. We will send a secure link to reset your account password.
              </p>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  Registered Agent Email
                </label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    required
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all font-normal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 hover:text-white transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>

              <div className="pt-4 border-t border-slate-200 text-center">
                <Link
                  href="/checker/agent/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-content-secondary hover:text-content-primary transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Agent Sign In
                </Link>
              </div>
            </form>
          )}
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
