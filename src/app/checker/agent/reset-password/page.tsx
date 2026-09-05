'use client';

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { checkersAPI } from "@/lib/api";

function AgentResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!uid || !token) {
      setError("Invalid or missing password reset parameters. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await checkersAPI.agentConfirmPasswordReset({
        uid,
        token,
        password
      });
      setSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to reset password. The link may be expired or already used.";
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
            Create New Password
          </h1>
          <p className="text-content-secondary font-normal text-xs uppercase tracking-widest leading-relaxed">
            Reseller Agent Micro-Store Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-standard rounded-none p-8 shadow-diffusion-md space-y-6">
          {!uid || !token ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Invalid or expired password reset link.</span>
              </div>
              <p className="text-content-secondary text-xs leading-relaxed">
                The reset link is missing required security tokens or has expired.
              </p>
              <div className="pt-2">
                <Link
                  href="/checker/agent/forgot-password"
                  className="w-full inline-block bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors text-center"
                >
                  Request New Reset Link
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-none text-xs font-bold uppercase tracking-wide flex flex-col items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
                <span>Password Reset Successful!</span>
              </div>
              <p className="text-content-secondary text-xs leading-relaxed">
                Your agent password has been updated. You can now sign in to your micro-store dashboard.
              </p>
              <div className="pt-2">
                <Link
                  href="/checker/agent/login"
                  className="w-full inline-block bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald transition-colors text-center"
                >
                  Sign In to Agent Portal
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 hover:text-white transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {isLoading ? "Updating Password..." : "Set New Password"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-200 text-center">
            <Link
              href="/checker/agent/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-content-secondary hover:text-content-primary transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Agent Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-emerald/20 border-t-brand-emerald rounded-full animate-spin" />
      </div>
    }>
      <AgentResetPasswordForm />
    </Suspense>
  );
}
