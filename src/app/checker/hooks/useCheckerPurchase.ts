'use client';

import { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { checkersAPI } from '@/lib/api';

export interface PricingTier {
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: string;
}

export interface PricingData {
  [key: string]: PricingTier[];
}

export interface VoucherDetail {
  serial: string;
  pin: string;
}

export interface HistoryItem {
  client_reference: string;
  checker_type: string;
  quantity: number;
  completed_at: string;
  vouchers: VoucherDetail[];
}

export function useCheckerPurchase(initialPricingData?: any) {
  const [activeModal, setActiveModal] = useState<'buy' | 'retrieve' | null>(null);
  const [, startTransition] = useTransition();

  // Buy Form State
  const [checkerType, setCheckerType] = useState<'BECE' | 'WASSCE'>('WASSCE');
  const [quantity, setQuantity] = useState<number>(1);
  const emailRef = useRef<HTMLInputElement>(null);
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

  // Dynamic Pricing State
  const [pricing, setPricing] = useState<PricingData>(initialPricingData?.pricing || {
    WASSCE: [
      { min_quantity: 1, max_quantity: 9, price_per_unit: '17.00' },
      { min_quantity: 10, max_quantity: 29, price_per_unit: '16.50' },
      { min_quantity: 30, max_quantity: 99, price_per_unit: '16.00' },
      { min_quantity: 100, max_quantity: null, price_per_unit: '15.50' },
    ],
    BECE: [
      { min_quantity: 1, max_quantity: 9, price_per_unit: '17.00' },
      { min_quantity: 10, max_quantity: 29, price_per_unit: '16.50' },
      { min_quantity: 30, max_quantity: 99, price_per_unit: '16.00' },
      { min_quantity: 100, max_quantity: null, price_per_unit: '15.50' },
    ]
  });
  const [stock, setStock] = useState<{ [key: string]: number }>(initialPricingData?.stock || { WASSCE: -1, BECE: -1 });
  const [stockLoading, setStockLoading] = useState<boolean>(!initialPricingData);

  // Helper for non-blocking modal toggles (INP fix)
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

  // Fetch Pricing & Stock levels on mount
  useEffect(() => {
    async function fetchPricingAndStock(attempt = 1) {
      if (initialPricingData) return;
      try {
        const response = await checkersAPI.getPricing();
        if (response.data) {
          if (response.data.pricing) setPricing(response.data.pricing);
          if (response.data.stock != null) setStock(response.data.stock);
        }
        setStockLoading(false);
      } catch (err) {
        console.error(`Failed to load checkers pricing (attempt ${attempt}):`, err);
        if (attempt < 2) {
          setTimeout(() => fetchPricingAndStock(2), 2000);
        } else {
          setStockLoading(false);
        }
      }
    }
    fetchPricingAndStock();
  }, [initialPricingData]);

  // Derived total price via useMemo (eliminates secondary re-renders and reduces INP)
  const totalPrice = useMemo(() => {
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
    
    return pricePerUnit * quantity;
  }, [checkerType, quantity, pricing]);

  // Responsive quantity setter wrapped in startTransition for low INP
  const updateQuantity = (updater: number | ((prev: number) => number)) => {
    startTransition(() => {
      setQuantity(prev => {
        const nextVal = typeof updater === 'function' ? updater(prev) : updater;
        return Math.min(200, Math.max(1, nextVal));
      });
    });
  };

  // Handle Buy submit
  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Yield to browser to paint loading spinner (fixes INP)
    await new Promise(resolve => setTimeout(resolve, 10));

    const emailValue = emailRef.current?.value?.trim() || '';
    if (!emailValue || !emailValue.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.initiate(emailValue, checkerType, quantity);
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

  return {
    activeModal,
    openModal,
    checkerType,
    setCheckerType,
    quantity,
    setQuantity,
    updateQuantity,
    emailRef,
    totalPrice,
    loading,
    error,
    showPricingTiers,
    setShowPricingTiers,
    retrieveStep,
    retrieveEmail,
    retrieveOtp,
    setRetrieveOtp,
    resendCooldown,
    retrieveEmailRef,
    retrieveLoading,
    retrieveError,
    history,
    pricing,
    stock,
    stockLoading,
    handleBuySubmit,
    handleSendOtpSubmit,
    handleVerifyOtpSubmit,
    handleResendOtp,
    copiedText,
    copyToClipboard
  };
}
