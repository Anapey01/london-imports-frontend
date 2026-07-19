'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { checkersAPI } from '@/lib/api';
import Link from 'next/link';

interface Voucher {
  serial: string;
  pin: string;
}

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const clientRef = searchParams.get('client_ref');

  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<'PENDING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN'>('PENDING');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Clipboard copied feedback state
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  
  const retryCountRef = useRef<number>(0);
  const maxRetries = 8; // Retry for 20 seconds total (8 * 2.5s)

  useEffect(() => {
    if (!clientRef) {
      setErrorMessage('No transaction reference found in URL.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    async function checkPayment() {
      try {
        const response = await checkersAPI.verify(clientRef!);
        if (!isMounted) return;

        if (response.data && response.data.success && response.data.status === 'COMPLETED') {
          setStatus('COMPLETED');
          setVouchers(response.data.vouchers || []);
          setLoading(false);
        } else {
          // If pending, retry after delay
          const txStatus = response.data?.status || 'PENDING';
          if (txStatus === 'FAILED') {
            setStatus('FAILED');
            setErrorMessage('Payment verification returned a failed status from Hubtel.');
            setLoading(false);
          } else if (retryCountRef.current < maxRetries) {
            retryCountRef.current += 1;
            timerId = setTimeout(checkPayment, 2500); // Poll every 2.5 seconds
          } else {
            setStatus('PENDING');
            setErrorMessage('Payment is taking longer than expected. Please check your email for the vouchers or refresh this page shortly.');
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        const backendError = err.response?.data?.error || 'Verification failed. Retrying...';
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          timerId = setTimeout(checkPayment, 3000);
        } else {
          setErrorMessage(backendError);
          setLoading(false);
        }
      }
    }

    checkPayment();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [clientRef]);

  // Copy single voucher details
  const copySingleVoucher = (serial: string, pin: string, idx: number) => {
    navigator.clipboard.writeText(`Serial: ${serial}, PIN: ${pin}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Copy all vouchers
  const copyAllVouchers = () => {
    const text = vouchers.map((v, i) => `Voucher #${i+1} - Serial: ${v.serial}, PIN: ${v.pin}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full text-center space-y-6 border border-content-primary bg-surface p-8">
          <div className="w-16 h-16 border border-brand-emerald text-brand-emerald flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-brand-emerald/20 border-t-brand-emerald rounded-none animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-black text-content-primary uppercase">
              Verifying Payment
            </h2>
            <p className="text-content-secondary text-xs uppercase tracking-widest font-semibold">
              Checking status with Hubtel. Please do not close or reload this page...
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-content-secondary font-black">
            Ref: {clientRef} (Attempt {retryCountRef.current + 1} of {maxRetries})
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans">
      <div className="max-w-md mx-auto w-full">
        {status === 'COMPLETED' ? (
          /* ================= SUCCESS STATE ================= */
          <div className="print-card bg-surface border border-border-standard rounded-none p-5 sm:p-6 shadow-diffusion-lg space-y-5 animate-elite-entrance">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 border border-brand-emerald text-brand-emerald flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-black text-content-primary uppercase tracking-tight">
                Payment Confirmed!
              </h2>
              <p className="text-content-secondary text-[10px] uppercase tracking-widest font-semibold">
                Your checker vouchers are ready and have been emailed to you.
              </p>
            </div>

            {/* Vouchers Container */}
            <div className="space-y-2.5 print:space-y-2.5">
              <div className="flex justify-between items-center text-[8px] font-black text-content-secondary uppercase tracking-widest border-b border-border-standard pb-1">
                <span>Vouchers</span>
                <span className="font-mono text-[8px]">REF: {clientRef}</span>
              </div>

              <div className="border border-border-standard bg-surface divide-y divide-border-standard">
                {vouchers.map((voucher, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs print:border-slate-300 print:bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-content-secondary font-sans text-[9px] font-black uppercase">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-content-secondary text-[9px] font-sans font-bold">S/N:</span>
                        <span className="font-bold select-all">{voucher.serial}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-content-secondary text-[9px] font-sans font-bold">PIN:</span>
                        <span className="font-black text-brand-emerald select-all print:text-slate-900">{voucher.pin}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copySingleVoucher(voucher.serial, voucher.pin, idx)}
                      className="text-[9px] text-content-secondary hover:text-brand-emerald font-sans font-black uppercase tracking-widest transition-all shrink-0 print:hidden"
                    >
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border-standard print:hidden">
              <button
                onClick={copyAllVouchers}
                className="bg-content-primary text-surface py-2.5 px-3 rounded-none font-black text-[10px] uppercase tracking-[0.15em] hover:bg-brand-emerald transition-colors duration-200"
              >
                {copied ? 'All Copied ✓' : 'Copy All Vouchers'}
              </button>
              <a
                href="https://ghana.waecdirect.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-emerald hover:bg-brand-emerald-dark text-white py-2.5 px-3 rounded-none font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-1"
              >
                Check Results
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
            
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-content-secondary print:hidden">
              <Link href="/checker" className="hover:text-brand-emerald">
                ← Back to Checker Portal
              </Link>
              <button onClick={() => window.print()} className="hover:text-brand-emerald">
                Print Vouchers ↗
              </button>
            </div>
            
            {/* Custom Print Style to hide everything else */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                /* Hide everything */
                body * {
                  visibility: hidden;
                }
                /* Show print-card and its contents only */
                .print-card, .print-card * {
                  visibility: visible;
                }
                /* Fit card cleanly onto A4/paper bounds */
                .print-card {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  max-width: 100% !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .print\\:hidden {
                  display: none !important;
                }
              }
            `}} />
          </div>
        ) : (
          /* ================= FAILURE/WARNING STATE ================= */
          <div className="bg-surface border-2 border-content-primary rounded-none p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] text-center space-y-6 animate-elite-entrance">
            <div className="w-16 h-16 border border-red-500 text-red-500 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-black text-content-primary uppercase">
                Fulfillment Pending or Failed
              </h2>
              <p className="text-content-secondary text-xs uppercase tracking-widest font-semibold leading-relaxed max-w-sm mx-auto">
                {errorMessage || 'Your payment verification is taking longer than usual or has failed. If you received a debit, the pins will be sent to your email.'}
              </p>
            </div>

            <div className="pt-4 border-t border-border-standard flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald transition-colors duration-200"
              >
                Refresh Page to Check Status
              </button>
              <Link
                href="/checker"
                className="w-full bg-surface text-content-primary border border-content-primary py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary-surface transition-colors duration-200"
              >
                Back to Checker Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
