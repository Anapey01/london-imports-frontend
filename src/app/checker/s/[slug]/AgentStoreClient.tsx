'use client';

import { useState, useEffect, useTransition } from 'react';
import { checkersAPI } from '@/lib/api';
import Link from 'next/link';

// Modular Storefront Subcomponents
import type { PricingData, HistoryItem } from '@/components/checker/storefront/types';
import BuyVoucherModal from '@/components/checker/storefront/BuyVoucherModal';
import RetrieveVouchersModal from '@/components/checker/storefront/RetrieveVouchersModal';

export default function AgentStoreClient({ slug, initialPricingData }: { slug: string; initialPricingData?: any }) {
  const [activeModal, setActiveModal] = useState<'buy' | 'retrieve' | null>(null);
  const [, startTransition] = useTransition();
  
  // Buy Form State
  const [checkerType, setCheckerType] = useState<'BECE' | 'WASSCE'>('WASSCE');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(17.00);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve Form State (2-step Email -> OTP -> Results)
  const [retrieveStep, setRetrieveStep] = useState<'email' | 'otp' | 'results'>('email');
  const [retrieveEmail, setRetrieveEmail] = useState<string>('');
  const [retrieveOtp, setRetrieveOtp] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
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
  const [, setStoreLoading] = useState<boolean>(!initialPricingData);
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

  // Fetch Pricing & Stock levels from agent profile
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
  }, [slug, initialPricingData]);

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
  const handleBuySubmit = async (emailValue: string) => {
    setError(null);
    setLoading(true);

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
  const handleSendOtpSubmit = async (emailValue: string) => {
    setRetrieveError(null);
    setRetrieveLoading(true);

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
  const handleVerifyOtpSubmit = async (email: string, otp: string) => {
    setRetrieveError(null);
    setRetrieveLoading(true);

    const otpCode = otp.trim();
    if (!otpCode || otpCode.length < 6) {
      setRetrieveError('Please enter the complete 6-digit verification code.');
      setRetrieveLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.verifyRetrieveOtp(email, otpCode);
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
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 cursor-pointer"
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
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200 cursor-pointer"
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

      {/* Buy Modal */}
      <BuyVoucherModal
        isOpen={activeModal === 'buy'}
        onClose={() => openModal(null)}
        checkerType={checkerType}
        setCheckerType={setCheckerType}
        quantity={quantity}
        setQuantity={setQuantity}
        totalPrice={totalPrice}
        becePrice={becePrice}
        wasscePrice={wasscePrice}
        stock={stock}
        onSubmit={handleBuySubmit}
        loading={loading}
        error={error}
      />

      {/* Retrieve Modal */}
      <RetrieveVouchersModal
        isOpen={activeModal === 'retrieve'}
        onClose={() => openModal(null)}
        retrieveStep={retrieveStep}
        setRetrieveStep={setRetrieveStep}
        retrieveEmail={retrieveEmail}
        setRetrieveEmail={setRetrieveEmail}
        retrieveOtp={retrieveOtp}
        setRetrieveOtp={setRetrieveOtp}
        history={history}
        retrieveLoading={retrieveLoading}
        retrieveError={retrieveError}
        setRetrieveError={setRetrieveError}
        resendCooldown={resendCooldown}
        onSendOtp={handleSendOtpSubmit}
        onVerifyOtp={handleVerifyOtpSubmit}
        onResendOtp={handleResendOtp}
        onReset={() => {
          setRetrieveStep('email');
          setRetrieveOtp('');
          setHistory([]);
        }}
      />
    </div>
  );
}
