'use client';

import React from 'react';
import { useCheckerPurchase } from '../hooks/useCheckerPurchase';

interface RetrieveVouchersModalProps {
  hook: ReturnType<typeof useCheckerPurchase>;
}

export default function RetrieveVouchersModal({ hook }: RetrieveVouchersModalProps) {
  const {
    openModal,
    retrieveStep,
    retrieveEmail,
    retrieveOtp,
    setRetrieveOtp,
    resendCooldown,
    retrieveEmailRef,
    retrieveLoading,
    retrieveError,
    history,
    handleSendOtpSubmit,
    handleVerifyOtpSubmit,
    handleResendOtp,
    copiedText,
    copyToClipboard
  } = hook;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
      <div className="bg-surface border border-slate-200 rounded-none w-full max-w-lg shadow-2xl relative">
        <button
          onClick={() => openModal(null)}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary pr-8">
              Retrieve Voucher History
            </h3>
            <p className="text-[11px] text-content-secondary mt-1">
              {retrieveStep === 'email' && 'Enter the email you used at checkout. We will send a secure verification code.'}
              {retrieveStep === 'otp' && `Enter the 6-digit code sent to ${retrieveEmail}`}
              {retrieveStep === 'results' && `Showing all purchased vouchers for ${retrieveEmail}`}
            </p>
          </div>

          {/* STEP 1: Email Form */}
          {retrieveStep === 'email' && (
            <form onSubmit={handleSendOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  Your Checkout Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  ref={retrieveEmailRef}
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>

              {retrieveError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {retrieveError}
                </div>
              )}

              <button
                type="submit"
                disabled={retrieveLoading}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {retrieveLoading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Form */}
          {retrieveStep === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1.5">
                  6-Digit Verification Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={retrieveOtp}
                  onChange={(e) => setRetrieveOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-center text-xl font-mono font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>

              {retrieveError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {retrieveError}
                </div>
              )}

              <button
                type="submit"
                disabled={retrieveLoading || retrieveOtp.length < 6}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {retrieveLoading ? 'Verifying...' : 'Verify & View Vouchers'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-content-secondary pt-2">
                <button
                  type="button"
                  onClick={() => openModal('retrieve')}
                  className="underline hover:text-content-primary"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || retrieveLoading}
                  className="font-bold underline hover:text-brand-emerald disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Results Display */}
          {retrieveStep === 'results' && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-content-secondary py-6 text-center">
                  No completed orders found for this email.
                </p>
              ) : (
                history.map((order, idx) => (
                  <div key={idx} className="border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                      <div>
                        <span className="font-bold text-content-primary uppercase">{order.checker_type}</span>
                        <span className="text-content-secondary ml-2 font-mono text-[10px]">
                          ({order.quantity} voucher{order.quantity > 1 ? 's' : ''})
                        </span>
                      </div>
                      <span className="text-[10px] text-content-secondary font-mono">
                        {order.completed_at ? new Date(order.completed_at).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.vouchers.map((v, vIdx) => (
                        <div key={vIdx} className="bg-white border border-slate-200 p-2.5 text-xs font-mono flex items-center justify-between">
                          <div>
                            <div><span className="text-content-secondary text-[10px]">SERIAL:</span> <span className="font-bold">{v.serial}</span></div>
                            <div><span className="text-content-secondary text-[10px]">PIN:</span> <span className="font-bold text-brand-emerald">{v.pin}</span></div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`Serial: ${v.serial}\nPIN: ${v.pin}`, `${idx}-${vIdx}`)}
                            className="text-[10px] uppercase font-bold text-content-secondary hover:text-content-primary px-2 py-1 border border-slate-200 bg-slate-50"
                          >
                            {copiedText === `${idx}-${vIdx}` ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <button
                type="button"
                onClick={() => openModal(null)}
                className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
