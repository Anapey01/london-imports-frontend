'use client';

import React, { useState, useRef } from 'react';
import type { HistoryItem } from './types';

interface RetrieveVouchersModalProps {
  isOpen: boolean;
  onClose: () => void;
  retrieveStep: 'email' | 'otp' | 'results';
  setRetrieveStep: (step: 'email' | 'otp' | 'results') => void;
  retrieveEmail: string;
  setRetrieveEmail: (email: string) => void;
  retrieveOtp: string;
  setRetrieveOtp: (otp: string) => void;
  history: HistoryItem[];
  retrieveLoading: boolean;
  retrieveError: string | null;
  setRetrieveError: (err: string | null) => void;
  resendCooldown: number;
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (email: string, otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onReset: () => void;
}

export default function RetrieveVouchersModal({
  isOpen,
  onClose,
  retrieveStep,
  setRetrieveStep,
  retrieveEmail,
  retrieveOtp,
  setRetrieveOtp,
  history,
  retrieveLoading,
  retrieveError,
  setRetrieveError,
  resendCooldown,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  onReset,
}: RetrieveVouchersModalProps) {
  const retrieveEmailRef = useRef<HTMLInputElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = (retrieveEmailRef.current?.value?.trim() || retrieveEmail).toLowerCase();
    onSendOtp(emailValue);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyOtp(retrieveEmail, retrieveOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
      <div className="bg-surface border border-slate-200 rounded-none w-full max-w-xl shadow-2xl relative animate-elite-entrance">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
          <h3 className="font-serif text-xl sm:text-2xl font-black text-content-primary mb-2 pr-8 uppercase tracking-tight">
            {retrieveStep === 'results' ? 'Your Results Checkers' : 'Retrieve Checkers'}
          </h3>
          <p className="text-content-secondary text-xs leading-relaxed mb-5">
            {retrieveStep === 'email' && 'Enter your email address. We will send a 6-digit verification code to retrieve your vouchers securely.'}
            {retrieveStep === 'otp' && (
              <span>
                We sent a 6-digit code to <strong className="text-content-primary">{retrieveEmail}</strong>.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setRetrieveStep('email');
                    setRetrieveError(null);
                  }}
                  className="text-brand-emerald underline font-bold hover:opacity-80 ml-1 cursor-pointer"
                >
                  Change email
                </button>
              </span>
            )}
            {retrieveStep === 'results' && 'Here are your purchased results checkers. Keep your Serial & PIN numbers secure.'}
          </p>

          {/* STEP 1: EMAIL INPUT */}
          {retrieveStep === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  Purchased Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={retrieveEmailRef}
                    type="email"
                    required
                    defaultValue={retrieveEmail}
                    placeholder="e.g. customer@email.com"
                    className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  />
                  <button
                    type="submit"
                    disabled={retrieveLoading}
                    className="bg-content-primary text-surface px-6 py-2.5 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald hover:text-white transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {retrieveLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : 'Send Code'}
                  </button>
                </div>
              </div>

              {retrieveError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                  {retrieveError}
                </div>
              )}
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {retrieveStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                  Enter 6-Digit Verification Code <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={retrieveOtp}
                    onChange={(e) => setRetrieveOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    autoFocus
                    className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-none px-4 py-2.5 text-lg font-mono font-bold tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  />
                  <button
                    type="submit"
                    disabled={retrieveLoading || retrieveOtp.length < 6}
                    className="bg-content-primary text-surface px-6 py-2.5 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald hover:text-white transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {retrieveLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : 'Verify & View Checkers'}
                  </button>
                </div>
              </div>

              {retrieveError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                  {retrieveError}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-content-secondary">
                  {resendCooldown > 0 ? (
                    <span>Resend code in <strong className="font-mono text-content-primary">{resendCooldown}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={onResendOtp}
                      disabled={retrieveLoading}
                      className="text-brand-emerald underline font-bold hover:opacity-80 cursor-pointer"
                    >
                      Didn't receive code? Resend Code
                    </button>
                  )}
                </span>
              </div>
            </form>
          )}

          {/* STEP 3: VOUCHERS RESULTS */}
          {retrieveStep === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-[10px] font-black text-content-secondary uppercase tracking-[0.2em]">
                  Purchase History ({history.length} records found)
                </h4>
                <button
                  type="button"
                  onClick={onReset}
                  className="text-[10px] text-brand-emerald underline font-black uppercase tracking-wider hover:opacity-80 cursor-pointer"
                >
                  Look Up Another Email
                </button>
              </div>
              
              {history.length === 0 ? (
                <p className="text-center py-6 text-xs text-content-secondary font-bold uppercase tracking-wider">
                  No checkers found for this email.
                </p>
              ) : (
                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                  {history.map((order, oIdx) => (
                    <div key={oIdx} className="border border-slate-200 rounded-none p-4 bg-surface shadow-sm">
                      <div className="flex justify-between items-center text-[9px] text-content-secondary mb-3 pb-2 border-b border-slate-100 font-black uppercase tracking-[0.15em]">
                        <span>{new Date(order.completed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span>Ref: {order.client_reference}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-black text-content-primary mb-3 uppercase tracking-wider">
                        <span>{order.quantity}x {order.checker_type} results checker</span>
                        <a
                          href={order.checker_type === 'BECE' ? 'https://eresults.waecgh.org' : 'https://ghana.waecdirect.org'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-brand-emerald hover:underline font-black uppercase tracking-widest flex items-center gap-1"
                        >
                          Check Results Portal
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </div>

                      <div className="space-y-2">
                        {order.vouchers.map((v, vIdx) => (
                          <div key={vIdx} className="bg-slate-50 border border-slate-200 rounded-none p-2.5 flex justify-between items-center font-mono text-xs">
                            <div className="space-y-1">
                              <div><span className="text-content-secondary text-[9px] font-sans font-black uppercase tracking-wider">SERIAL:</span> <span className="font-bold text-slate-800">{v.serial}</span></div>
                              <div><span className="text-content-secondary text-[9px] font-sans font-black uppercase tracking-wider">PIN:</span> <span className="font-bold text-brand-emerald">{v.pin}</span></div>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(`Serial: ${v.serial}, PIN: ${v.pin}`, `v-${oIdx}-${vIdx}`)}
                              className="text-[9px] bg-surface border border-slate-200 hover:border-content-primary hover:text-content-primary font-sans font-black uppercase tracking-widest px-2.5 py-1.5 rounded-none transition-all shrink-0 cursor-pointer"
                            >
                              {copiedText === `v-${oIdx}-${vIdx}` ? 'Copied ✓' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
