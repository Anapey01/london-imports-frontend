'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { checkersAPI } from '@/lib/api';
import Link from 'next/link';

interface PricingTier {
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: string;
}

interface PricingData {
  [key: string]: PricingTier[];
}

interface VoucherDetail {
  serial: string;
  pin: string;
}

interface HistoryItem {
  client_reference: string;
  checker_type: string;
  quantity: number;
  completed_at: string;
  vouchers: VoucherDetail[];
}

export default function AgentStoreClient({ slug, initialPricingData }: { slug: string; initialPricingData?: any }) {
  const [activeModal, setActiveModal] = useState<'buy' | 'retrieve' | null>(null);
  const [, startTransition] = useTransition();
  
  // Buy Form State
  const [checkerType, setCheckerType] = useState<'BECE' | 'WASSCE'>('WASSCE');
  const [quantity, setQuantity] = useState<number>(1);
  const emailRef = useRef<HTMLInputElement>(null);
  const [totalPrice, setTotalPrice] = useState<number>(17.00);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricingTiers, setShowPricingTiers] = useState<boolean>(false);

  // Retrieve Form State (2-step Email -> OTP -> Results)
  const [retrieveStep, setRetrieveStep] = useState<'email' | 'otp' | 'results'>('email');
  const [retrieveEmail, setRetrieveEmail] = useState<string>('');
  const [retrieveOtp, setRetrieveOtp] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const retrieveEmailRef = useRef<HTMLInputElement>(null);
  const [retrieveLoading, setRetrieveLoading] = useState<boolean>(false);
  const [retrieveError, setRetrieveError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Store Brand State
  const [storeName, setStoreName] = useState<string>(initialPricingData?.store_name || '');
  const [pricing, setPricing] = useState<PricingData>(initialPricingData?.pricing || {
    WASSCE: [{ min_quantity: 1, max_quantity: null, price_per_unit: '17.00' }],
    BECE: [{ min_quantity: 1, max_quantity: null, price_per_unit: '17.00' }]
  });
  const [stock, setStock] = useState<{ [key: string]: number }>(initialPricingData?.stock || { WASSCE: -1, BECE: -1 });
  const [storeLoading, setStoreLoading] = useState<boolean>(!initialPricingData);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Modal handlers
  const openModal = (modal: 'buy' | 'retrieve' | null) => {
    startTransition(() => {
      if (modal === 'buy') setError(null);
      if (modal === 'retrieve') {
        setRetrieveError(null);
        setHistory([]);
        setRetrieveStep('email');
        setRetrieveEmail('');
        setRetrieveOtp('');
      }
      setActiveModal(modal);
    });
  };

  // Fetch Pricing & Stock levels from agent profile (SWR pattern for live sync)
  useEffect(() => {
    async function fetchStoreDetails() {
      try {
        const response = await checkersAPI.getPricing(slug);
        if (response.data) {
          if (response.data.pricing) setPricing(response.data.pricing);
          if (response.data.stock != null) setStock(response.data.stock);
          if (response.data.store_name) setStoreName(response.data.store_name);
        }
        setStoreLoading(false);
      } catch (err: any) {
        if (!initialPricingData) {
          console.error('Failed to load reseller store details:', err);
          setStoreError(err.response?.data?.error || 'Reseller store profile not found or inactive.');
        }
        setStoreLoading(false);
      }
    }
    fetchStoreDetails();
  }, [slug]);

  // Calculate dynamic totalPrice
  useEffect(() => {
    const typeTiers = pricing[checkerType] || [];
    let pricePerUnit = 17.00;
    
    for (const tier of typeTiers) {
      const min = tier.min_quantity;
      const max = tier.max_quantity;
      const price = parseFloat(tier.price_per_unit);
      
      if (max === null) {
        if (quantity >= min) {
          pricePerUnit = price;
          break;
        }
      } else {
        if (quantity >= min && quantity <= max) {
          pricePerUnit = price;
          break;
        }
      }
    }
    
    setTotalPrice(pricePerUnit * quantity);
  }, [checkerType, quantity, pricing]);

  // Handle Buy submit
  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const emailValue = emailRef.current?.value?.trim() || '';
    if (!emailValue || !emailValue.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.initiate(emailValue, checkerType, quantity, slug);
      if (response.data && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setError('Failed to initiate checkout. Please try again.');
      }
    } catch (err: any) {
      const backendError = err.response?.data?.error || 'Something went wrong. Please check stock levels and try again.';
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to customer's email
  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRetrieveError(null);
    setRetrieveLoading(true);

    const emailValue = (retrieveEmailRef.current?.value?.trim() || retrieveEmail).toLowerCase();
    if (!emailValue || !emailValue.includes('@')) {
      setRetrieveError('Please enter a valid email address.');
      setRetrieveLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.sendRetrieveOtp(emailValue);
      if (response.data && response.data.success) {
        setRetrieveEmail(emailValue);
        setRetrieveStep('otp');
        setResendCooldown(60);
      } else {
        setRetrieveError(response.data?.message || 'Failed to send verification code.');
      }
    } catch (err: any) {
      const backendError = err.response?.data?.error || 'Could not send verification code. Please check your email and try again.';
      setRetrieveError(backendError);
    } finally {
      setRetrieveLoading(false);
    }
  };

  // Step 2: Verify OTP and retrieve vouchers
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRetrieveError(null);
    setRetrieveLoading(true);

    const otpCode = retrieveOtp.trim();
    if (!otpCode || otpCode.length < 6) {
      setRetrieveError('Please enter the complete 6-digit verification code.');
      setRetrieveLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.verifyRetrieveOtp(retrieveEmail, otpCode);
      if (response.data && response.data.history) {
        setHistory(response.data.history);
        setRetrieveStep('results');
      } else {
        setRetrieveError('Could not verify code. Please try again.');
      }
    } catch (err: any) {
      const backendError = err.response?.data?.error || 'Invalid or expired verification code. Please check your email or request a new code.';
      setRetrieveError(backendError);
    } finally {
      setRetrieveLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !retrieveEmail) return;
    setRetrieveError(null);
    setRetrieveLoading(true);
    try {
      await checkersAPI.sendRetrieveOtp(retrieveEmail);
      setResendCooldown(60);
    } catch (err: any) {
      const backendError = err.response?.data?.error || 'Failed to resend verification code.';
      setRetrieveError(backendError);
    } finally {
      setRetrieveLoading(false);
    }
  };

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (storeError && !initialPricingData) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full text-center space-y-6 border-2 border-content-primary bg-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]">
          <div className="w-16 h-16 border border-red-500 text-red-500 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-content-primary uppercase">Store Not Found</h2>
            <p className="text-content-secondary text-xs leading-relaxed max-w-xs mx-auto">
              {storeError}
            </p>
          </div>
          <div className="pt-4 border-t border-border-standard">
            <Link
              href="/checker"
              className="w-full block bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald transition-colors"
            >
              Go to Main Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const becePrice = parseFloat(pricing.BECE?.[0]?.price_per_unit || '17.00');
  const wasscePrice = parseFloat(pricing.WASSCE?.[0]?.price_per_unit || '17.00');

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-4xl mx-auto w-full font-sans">
        {/* Header Block */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-content-primary mb-3 tracking-tight">
            {storeName || 'Results Checker Center'}
          </h1>
          <p className="max-w-md mx-auto text-content-secondary font-normal text-xs sm:text-sm leading-relaxed">
            Instant online purchase of WASSCE and BECE results checkers. Pay securely via Mobile Money & get your codes immediately.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card 1: Buy */}
          <div className="bg-surface border border-border-standard rounded-none p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-content-primary">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 border border-border-standard text-content-secondary flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h2 className="text-md font-black text-content-primary mb-3 uppercase tracking-widest">
                Buy Results Checker
              </h2>
              <p className="text-content-secondary text-xs leading-relaxed mb-8 uppercase tracking-wider max-w-xs">
                Pay securely with Mobile Money. Receive Pin Codes instantly on-screen and via Email.
              </p>
            </div>
            <button
              onClick={() => openModal('buy')}
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200"
            >
              Click Here to Buy
            </button>
          </div>

          {/* Card 2: Retrieve */}
          <div className="bg-surface border border-border-standard rounded-none p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-content-primary">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 border border-border-standard text-content-secondary flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <h2 className="text-md font-black text-content-primary mb-3 uppercase tracking-widest">
                Retrieve History
              </h2>
              <p className="text-content-secondary text-xs leading-relaxed mb-8 uppercase tracking-wider max-w-xs">
                Look up previously purchased pins using the email address specified during your checkout.
              </p>
            </div>
            <button
              onClick={() => openModal('retrieve')}
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200"
            >
              Click Here to Retrieve
            </button>
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center mt-12 text-[10px] text-content-secondary uppercase tracking-widest space-y-2">
          <p>© {new Date().getFullYear()} London's Imports Ghana. All rights reserved.</p>
          <p>Powered by {storeName || 'Authorized Checker Agent'}</p>
        </div>
      </div>

      {/* ==================== BUY MODAL ==================== */}
      {activeModal === 'buy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
          <div className="bg-surface border border-slate-200 rounded-none w-full max-w-lg shadow-2xl relative animate-elite-entrance">
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
              <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary mb-4 pr-8">
                Purchase Results Checker
              </h3>

              {/* Pricing breakdown info */}
              <div className="border border-slate-200 mb-4 p-3 bg-slate-50 text-xs font-semibold text-content-primary uppercase tracking-wider space-y-1.5">
                <div className="flex justify-between">
                  <span>BECE Checker price:</span>
                  <span className="font-mono text-brand-emerald">GH₵ {becePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>WASSCE Checker price:</span>
                  <span className="font-mono text-brand-emerald">GH₵ {wasscePrice.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleBuySubmit} className="space-y-3">
                {/* Select Type */}
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1.5">
                    Select Checker Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={checkerType}
                    onChange={(e) => setCheckerType(e.target.value as 'BECE' | 'WASSCE')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  >
                    <option value="WASSCE">WASSCE, SSCE, ABCE</option>
                    <option value="BECE">BECE (School & Private)</option>
                  </select>
                </div>

                {/* Quantity & Total Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1.5">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-none bg-slate-50 h-[42px]">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-full flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-slate-100 disabled:opacity-40 border-r border-slate-200 transition-colors"
                      >
                        <span className="text-md font-bold">−</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setQuantity(Math.min(200, Math.max(1, val)));
                        }}
                        className="w-full text-center bg-transparent border-0 text-sm font-bold focus:ring-0 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(200, q + 1))}
                        disabled={quantity >= 200}
                        className="w-9 h-full flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-slate-100 disabled:opacity-40 border-l border-slate-200 transition-colors"
                      >
                        <span className="text-md font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1.5">
                      Total Cost
                    </label>
                    <div className="h-[42px] flex items-center justify-between px-3 border border-slate-200 rounded-none bg-slate-50 font-bold text-brand-emerald text-sm">
                      <span className="font-mono text-sm ml-auto">GH₵ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Email Delivery */}
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1.5">
                    Delivery Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    required
                    placeholder="Enter email to receive vouchers"
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  />
                  <p className="mt-1.5 text-xs text-content-secondary font-normal">
                    Vouchers are displayed on screen and sent to this email.
                  </p>
                </div>

                {/* Stock status */}
                <div className="text-xs font-medium text-content-secondary">
                  Stock status:{' '}
                  {stock[checkerType] > 20 ? (
                    <span className="text-brand-emerald font-semibold">In stock</span>
                  ) : stock[checkerType] > 0 ? (
                    <span className="text-orange-500 font-semibold">Low stock ({stock[checkerType]} left)</span>
                  ) : stock[checkerType] === 0 ? (
                    <span className="text-orange-500 font-semibold">Limited — order now</span>
                  ) : (
                    <span className="text-brand-emerald font-semibold">Available</span>
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-sm tracking-wide hover:bg-brand-emerald transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Make Payment (GH₵ {totalPrice.toFixed(2)})</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RETRIEVE MODAL ==================== */}
      {activeModal === 'retrieve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
          <div className="bg-surface border border-slate-200 rounded-none w-full max-w-xl shadow-2xl relative animate-elite-entrance">
            <button
              onClick={() => openModal(null)}
              className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
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
                <form onSubmit={handleSendOtpSubmit} className="space-y-4">
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
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
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
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
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
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-lg font-mono font-bold tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
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
                          onClick={handleResendOtp}
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
                      onClick={() => {
                        setRetrieveStep('email');
                        setRetrieveOtp('');
                        setHistory([]);
                      }}
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
      )}
    </div>
  );
}
