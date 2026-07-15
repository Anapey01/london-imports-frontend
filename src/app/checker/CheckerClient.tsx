'use client';

import { useState, useEffect } from 'react';
import { checkersAPI } from '@/lib/api';
import { siteConfig } from '@/config/site';

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

export default function CheckerClient() {
  const [activeModal, setActiveModal] = useState<'buy' | 'retrieve' | null>(null);
  
  // Buy Form State
  const [checkerType, setCheckerType] = useState<'BECE' | 'WASSCE'>('BECE');
  const [quantity, setQuantity] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(17.00);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricingTiers, setShowPricingTiers] = useState<boolean>(false);

  // Retrieve Form State
  const [retrieveEmail, setRetrieveEmail] = useState<string>('');
  const [retrieveLoading, setRetrieveLoading] = useState<boolean>(false);
  const [retrieveError, setRetrieveError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searched, setSearched] = useState<boolean>(false);

  // Dynamic Pricing State
  const [pricing, setPricing] = useState<PricingData>({
    BECE: [
      { min_quantity: 1, max_quantity: 9, price_per_unit: '17.00' },
      { min_quantity: 10, max_quantity: 29, price_per_unit: '16.50' },
      { min_quantity: 30, max_quantity: 99, price_per_unit: '16.00' },
      { min_quantity: 100, max_quantity: null, price_per_unit: '15.50' },
    ],
    WASSCE: [
      { min_quantity: 1, max_quantity: 9, price_per_unit: '17.00' },
      { min_quantity: 10, max_quantity: 29, price_per_unit: '16.50' },
      { min_quantity: 30, max_quantity: 99, price_per_unit: '16.00' },
      { min_quantity: 100, max_quantity: null, price_per_unit: '15.50' },
    ]
  });
  const [stock, setStock] = useState<{ [key: string]: number }>({ BECE: 0, WASSCE: 0 });
  const [stockLoading, setStockLoading] = useState<boolean>(true);

  // Fetch Pricing & Stock levels on mount — with one retry on failure
  useEffect(() => {
    async function fetchPricingAndStock(attempt = 1) {
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
          // Retry once after 2 seconds — keep showing "Checking..." during retry
          setTimeout(() => fetchPricingAndStock(2), 2000);
        } else {
          // Give up — unblock UI so user can still try to buy (backend will validate)
          setStockLoading(false);
        }
      }
    }
    fetchPricingAndStock();
  }, []);

  // Update total price when checkerType, quantity or pricing changes
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

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.initiate(email, checkerType, quantity);
      if (response.data && response.data.checkout_url) {
        // Redirect to Hubtel hosted checkout page
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

  // Handle Retrieve submit
  const handleRetrieveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRetrieveError(null);
    setRetrieveLoading(true);
    setHistory([]);
    setSearched(false);

    if (!retrieveEmail || !retrieveEmail.includes('@')) {
      setRetrieveError('Please enter a valid email address.');
      setRetrieveLoading(false);
      return;
    }

    try {
      const response = await checkersAPI.retrieve(retrieveEmail);
      if (response.data && response.data.history) {
        setHistory(response.data.history);
      }
      setSearched(true);
    } catch (err: any) {
      setRetrieveError('Could not retrieve vouchers. Please try again.');
    } finally {
      setRetrieveLoading(false);
    }
  };

  // Copy to clipboard helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-content-primary mb-4 tracking-tight uppercase">
            WAEC Results Checker Center
          </h1>
          <p className="max-w-xl mx-auto text-content-secondary font-medium text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
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
              onClick={() => {
                setError(null);
                setActiveModal('buy');
              }}
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
              onClick={() => {
                setRetrieveError(null);
                setHistory([]);
                setSearched(false);
                setActiveModal('retrieve');
              }}
              className="w-full bg-content-primary text-surface py-4 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald hover:text-white transition-all duration-200"
            >
              Click Here to Retrieve
            </button>
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center mt-12 text-[10px] text-content-secondary uppercase tracking-widest space-y-2">
          <p>© {new Date().getFullYear()} London's Imports Ghana. All rights reserved.</p>
          <p>
            For support, contact us at{' '}
            <a href={`mailto:${siteConfig.supportEmail}`} className="underline font-black hover:text-brand-emerald transition-colors">
              {siteConfig.supportEmail}
            </a>
          </p>
        </div>
      </div>

      {/* ==================== BUY MODAL ==================== */}
      {activeModal === 'buy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-surface border border-slate-200 rounded-none w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl sm:text-2xl font-black text-content-primary mb-5 pr-8 uppercase tracking-tight">
                WAEC Results Checker
              </h3>

              {/* Collapsible Pricing ledger block */}
              <div className="border border-slate-200 mb-5">
                <button
                  type="button"
                  onClick={() => setShowPricingTiers(!showPricingTiers)}
                  className="w-full flex items-center justify-between bg-slate-50 p-3 text-[9px] font-black uppercase tracking-[0.3em] text-content-primary focus:outline-none"
                >
                  <span>Volume Pricing Tiers</span>
                  <span className="font-mono text-[10px] text-brand-emerald font-black">
                    {showPricingTiers ? 'Collapse [-]' : 'Expand [+]'}
                  </span>
                </button>
                {showPricingTiers && (
                  <div className="divide-y divide-slate-200 text-xs font-bold text-content-primary">
                    <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50">
                      <span>1 to 9 Checkers</span>
                      <span className="text-right font-mono">GH₵ 17.00 each</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50">
                      <span>10 to 29 Checkers</span>
                      <span className="text-right font-mono">GH₵ 16.50 each</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50">
                      <span>30 to 99 Checkers</span>
                      <span className="text-right font-mono">GH₵ 16.00 each</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 hover:bg-slate-50/50">
                      <span>100 or more Checkers</span>
                      <span className="text-right font-mono">GH₵ 15.50 each</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleBuySubmit} className="space-y-4">
                {/* Select Type */}
                <div>
                  <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                    Select Checker Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={checkerType}
                    onChange={(e) => setCheckerType(e.target.value as 'BECE' | 'WASSCE')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  >
                    <option value="BECE">BECE (School & Private) [eresults]</option>
                    <option value="WASSCE">WASSCE, SSCE, ABCE [eresults]</option>
                  </select>
                </div>

                {/* Quantity & Total Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
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
                        className="w-full text-center bg-transparent border-0 text-xs font-black tracking-widest focus:ring-0 focus:outline-none"
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
                    <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                      Total Cost
                    </label>
                    <div className="h-[42px] flex items-center justify-between px-3 border border-slate-200 rounded-none bg-slate-50 font-black text-brand-emerald text-[11px] tracking-wider">
                      <span className="text-[8px] text-content-secondary font-black uppercase hidden sm:inline">TOTAL:</span>
                      <span className="font-mono text-sm ml-auto">GH₵ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Email Delivery */}
                <div>
                  <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                    Delivery Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to receive vouchers"
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                  />
                  <p className="mt-1.5 text-[9px] text-content-secondary uppercase tracking-widest font-semibold">
                    Vouchers are displayed on screen and sent to this email.
                  </p>
                </div>

                {/* Stock Level Warning */}
                <div className="text-[9px] font-black uppercase tracking-widest text-content-secondary">
                  Stock status:{' '}
                  {stockLoading ? (
                    <span className="text-content-secondary font-bold">Checking...</span>
                  ) : stock[checkerType] > 20 ? (
                    <span className="text-brand-emerald font-bold">In Stock</span>
                  ) : stock[checkerType] > 0 ? (
                    <span className="text-orange-500 font-bold">Low Stock ({stock[checkerType]} left)</span>
                  ) : (
                    <span className="text-red-600 font-bold">Out of Stock</span>
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                    {error}
                  </div>
                )}

                {/* Submit Row */}
                <button
                  type="submit"
                  disabled={loading || (!stockLoading && stock[checkerType] === 0)}
                  className="w-full bg-content-primary text-surface py-3.5 px-6 rounded-none font-black text-xs uppercase tracking-[0.25em] hover:bg-brand-emerald transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : stockLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-content-primary rounded-full animate-spin" />
                      <span>Loading...</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-surface border border-slate-200 rounded-none w-full max-w-xl shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
              <h3 className="font-serif text-xl sm:text-2xl font-black text-content-primary mb-5 pr-8 uppercase tracking-tight">
                Retrieve Checkers
              </h3>

              <form onSubmit={handleRetrieveSubmit} className="space-y-4 mb-5">
                <div>
                  <label className="block text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] mb-1.5">
                    Enter Purchased Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={retrieveEmail}
                      onChange={(e) => setRetrieveEmail(e.target.value)}
                      placeholder="e.g. misslondon@londonsimports.com"
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                    />
                    <button
                      type="submit"
                      disabled={retrieveLoading}
                      className="bg-content-primary text-surface px-6 py-2.5 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald transition-colors duration-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    >
                      {retrieveLoading ? 'Searching...' : 'Retrieve'}
                    </button>
                  </div>
                </div>

                {retrieveError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                    {retrieveError}
                  </div>
                )}
              </form>

              {/* Search History Results */}
              {searched && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-content-secondary uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
                    Purchase History ({history.length} records found)
                  </h4>
                  
                  {history.length === 0 ? (
                    <p className="text-center py-6 text-xs text-content-secondary font-bold uppercase tracking-wider">
                      No result checkers found for this email address.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                      {history.map((order, oIdx) => (
                        <div key={oIdx} className="border border-slate-200 rounded-none p-4 bg-surface">
                          <div className="flex justify-between items-center text-[9px] text-content-secondary mb-3 pb-2 border-b border-slate-100 font-black uppercase tracking-[0.15em]">
                            <span>{new Date(order.completed_at).toLocaleDateString()}</span>
                            <span>Ref: {order.client_reference}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs font-black text-content-primary mb-3 uppercase tracking-wider">
                            <span>{order.quantity}x {order.checker_type} results checker</span>
                            <a
                              href="https://ghana.waecdirect.org"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-brand-emerald hover:underline font-black uppercase tracking-widest flex items-center gap-1"
                            >
                              Check Results
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                          </div>

                          <div className="space-y-2">
                            {order.vouchers.map((v, vIdx) => (
                              <div key={vIdx} className="bg-slate-50 border border-slate-200 rounded-none p-2.5 flex justify-between items-center font-mono text-xs">
                                <div className="space-y-1">
                                  <div><span className="text-content-secondary text-[9px] font-sans font-black uppercase tracking-wider">SERIAL:</span> <span className="font-bold">{v.serial}</span></div>
                                  <div><span className="text-content-secondary text-[9px] font-sans font-black uppercase tracking-wider">PIN:</span> <span className="font-bold text-brand-emerald">{v.pin}</span></div>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(`Serial: ${v.serial}, PIN: ${v.pin}`, `v-${oIdx}-${vIdx}`)}
                                  className="text-[9px] bg-surface border border-slate-200 hover:border-content-primary hover:text-content-primary font-sans font-black uppercase tracking-widest px-2.5 py-1.5 rounded-none transition-all shrink-0"
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
