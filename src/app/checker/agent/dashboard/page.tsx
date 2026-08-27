'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuthStore } from '@/stores/agentAuthStore';
import { checkersAPI } from '@/lib/api';
import Link from 'next/link';

interface Order {
  client_reference: string;
  checker_type: string;
  quantity: number;
  completed_at: string;
  total_price: string;
  commission: string;
  buyer_email: string;
}

interface LedgerEntry {
  id: string;
  entry_type: string;
  entry_type_display: string;
  amount: string;
  balance_after: string;
  reference: string;
  description: string;
  created_at: string;
}

interface Payout {
  id: string;
  amount: string;
  momo_network: string;
  momo_number: string;
  status: string;
  status_display: string;
  reference: string;
  notes: string;
  created_at: string;
}

export default function AgentDashboardPage() {
  const router = useRouter();
  const { agent, isAuthenticated, logout, isLoading } = useAgentAuthStore();

  const [activeTab, setActiveTab] = useState<'link' | 'pricing' | 'sales' | 'wallet'>('link');
  
  // Dashboard metrics
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [totalSold, setTotalSold] = useState<number>(0);
  
  // Lists
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  
  // Pricing manager state
  const [becePrice, setBecePrice] = useState<number>(16.50);
  const [wasscePrice, setWasscePrice] = useState<number>(16.50);
  const [becePriceInput, setBecePriceInput] = useState<string>('16.50');
  const [wasscePriceInput, setWasscePriceInput] = useState<string>('16.50');
  const [pricingLoading, setPricingLoading] = useState<boolean>(false);
  const [pricingSuccess, setPricingSuccess] = useState<boolean>(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Payout request modal/form state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [payoutNetwork, setPayoutNetwork] = useState<string>('');
  const [payoutNumber, setPayoutNumber] = useState<string>('');
  const [payoutLoading, setPayoutLoading] = useState<boolean>(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/checker/agent/login');
    }
  }, [isAuthenticated, router]);

  // Load Dashboard Data & Ledger/Payouts
  const fetchDashboardData = async () => {
    try {
      const response = await checkersAPI.agentDashboard();
      if (response.data) {
        setWalletBalance(parseFloat(response.data.wallet_balance));
        setLifetimeEarnings(parseFloat(response.data.lifetime_earnings));
        setTotalSold(response.data.total_checkers_sold);
        setRecentOrders(response.data.recent_orders || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const fetchLedgerAndPayouts = async () => {
    try {
      const [ledgerRes, payoutsRes] = await Promise.all([
        checkersAPI.agentLedger(1),
        checkersAPI.agentPayouts()
      ]);
      if (ledgerRes.data && ledgerRes.data.results) {
        setLedger(ledgerRes.data.results);
      }
      if (payoutsRes.data) {
        setPayouts(payoutsRes.data);
      }
    } catch (err) {
      console.error('Failed to load transaction data:', err);
    }
  };

  const fetchPricing = async () => {
    try {
      const response = await checkersAPI.agentPricing();
      if (response.data && Array.isArray(response.data)) {
        const bece = response.data.find(p => p.checker_type === 'BECE');
        const wassce = response.data.find(p => p.checker_type === 'WASSCE');
        if (bece) {
          const val = parseFloat(bece.selling_price);
          setBecePrice(val);
          setBecePriceInput(bece.selling_price);
        }
        if (wassce) {
          const val = parseFloat(wassce.selling_price);
          setWasscePrice(val);
          setWasscePriceInput(wassce.selling_price);
        }
      }
    } catch (err) {
      console.error('Failed to load pricing configurations:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchLedgerAndPayouts();
      fetchPricing();
    }
  }, [isAuthenticated]);

  // Initialize payout fields from agent profile
  useEffect(() => {
    if (agent) {
      setPayoutNetwork(agent.momo_network);
      setPayoutNumber(agent.momo_number);
    }
  }, [agent]);

  // Logout handler
  const handleLogout = async () => {
    await logout();
    router.push('/checker/agent/login');
  };

  // Pricing update handler
  const handlePricingSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingLoading(true);
    setPricingError(null);
    setPricingSuccess(false);

    const parsedBece = parseFloat(becePriceInput);
    const parsedWassce = parseFloat(wasscePriceInput);

    if (isNaN(parsedBece) || parsedBece < 16.50) {
      setPricingError('BECE price must be at least GH₵ 16.50');
      setPricingLoading(false);
      return;
    }
    if (isNaN(parsedWassce) || parsedWassce < 16.50) {
      setPricingError('WASSCE price must be at least GH₵ 16.50');
      setPricingLoading(false);
      return;
    }

    try {
      await checkersAPI.agentUpdatePricing([
        { checker_type: 'BECE', selling_price: parsedBece },
        { checker_type: 'WASSCE', selling_price: parsedWassce }
      ]);
      setPricingSuccess(true);
      fetchDashboardData();
    } catch (err: any) {
      setPricingError(err.response?.data?.error || 'Failed to update selling prices. Verify selling price is above GHS 16.50.');
    } finally {
      setPricingLoading(false);
    }
  };

  // Payout request handler
  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutLoading(true);
    setPayoutError(null);
    setPayoutSuccess(false);

    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutError('Please enter a valid payout amount.');
      setPayoutLoading(false);
      return;
    }

    try {
      await checkersAPI.agentRequestPayout({
        amount: amountNum,
        momo_network: payoutNetwork,
        momo_number: payoutNumber
      });
      setPayoutSuccess(true);
      setPayoutAmount('');
      // Reload financial logs
      await fetchDashboardData();
      await fetchLedgerAndPayouts();
      setTimeout(() => {
        setIsPayoutModalOpen(false);
        setPayoutSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPayoutError(err.response?.data?.error || 'Failed to submit withdrawal request.');
    } finally {
      setPayoutLoading(false);
    }
  };

  // Copy Store Link
  const getStoreLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/checker/s/${agent?.slug}`;
    }
    return `https://londonsimports.com/checker/s/${agent?.slug}`;
  };

  const copyStoreLink = () => {
    navigator.clipboard.writeText(getStoreLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-brand-emerald/30 border-t-brand-emerald rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-standard pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              {agent.store_name}
            </h1>
            <p className="text-[9px] text-content-secondary uppercase font-black tracking-widest">
              Checker Reseller Partner &bull; Slug: {agent.slug}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-content-primary hover:bg-slate-50 text-content-primary px-5 py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Balance */}
          <div className="bg-surface border border-border-standard p-6 rounded-none relative">
            <span className="text-[9px] text-content-secondary font-black uppercase tracking-widest block mb-2">
              Withdrawable Wallet
            </span>
            <div className="font-mono text-2xl font-bold text-brand-emerald">
              GH₵ {walletBalance.toFixed(2)}
            </div>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="mt-4 w-full bg-content-primary text-surface py-2.5 px-4 rounded-none font-bold text-[9px] uppercase tracking-widest hover:bg-brand-emerald transition-colors"
            >
              Request Withdrawal
            </button>
          </div>

          {/* Card 2: Lifetime Earnings */}
          <div className="bg-surface border border-border-standard p-6 rounded-none flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-content-secondary font-black uppercase tracking-widest block mb-2">
                Lifetime Commission
              </span>
              <div className="font-mono text-2xl font-bold text-content-primary">
                GH₵ {lifetimeEarnings.toFixed(2)}
              </div>
            </div>
            <p className="text-[9px] text-content-secondary uppercase font-semibold mt-4">
              All validated credit entries.
            </p>
          </div>

          {/* Card 3: Total Sold */}
          <div className="bg-surface border border-border-standard p-6 rounded-none flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-content-secondary font-black uppercase tracking-widest block mb-2">
                Total Checkers Sold
              </span>
              <div className="font-mono text-2xl font-bold text-content-primary">
                {totalSold} units
              </div>
            </div>
            <p className="text-[9px] text-content-secondary uppercase font-semibold mt-4">
              WASSCE & BECE completed checks.
            </p>
          </div>
        </div>

        {/* Workspace / Dashboard Tabs */}
        <div className="bg-surface border border-border-standard rounded-none overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-border-standard text-[10px] font-black uppercase tracking-widest overflow-x-auto divide-x divide-border-standard bg-slate-50">
            <button
              onClick={() => setActiveTab('link')}
              className={`px-6 py-4 transition-colors focus:outline-none shrink-0 ${
                activeTab === 'link' ? 'bg-surface text-brand-emerald border-t-2 border-t-brand-emerald' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Share Storefront
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-6 py-4 transition-colors focus:outline-none shrink-0 ${
                activeTab === 'pricing' ? 'bg-surface text-brand-emerald border-t-2 border-t-brand-emerald' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Price Manager
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-4 transition-colors focus:outline-none shrink-0 ${
                activeTab === 'sales' ? 'bg-surface text-brand-emerald border-t-2 border-t-brand-emerald' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Recent Sales
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-6 py-4 transition-colors focus:outline-none shrink-0 ${
                activeTab === 'wallet' ? 'bg-surface text-brand-emerald border-t-2 border-t-brand-emerald' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Wallet Logs
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6">
            
            {/* === Tab: Share storefront === */}
            {activeTab === 'link' && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-content-primary">
                    Your Shareable Link
                  </h3>
                  <p className="text-content-secondary text-xs leading-relaxed font-normal">
                    Customers who visit this link will buy WASSCE & BECE checkers at your custom prices. Your reseller profile is automatically linked to verify transactions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-grow bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-xs text-content-primary select-all break-all flex items-center">
                    {getStoreLink()}
                  </div>
                  <button
                    onClick={copyStoreLink}
                    className="bg-content-primary text-surface px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald transition-colors shrink-0"
                  >
                    {copiedLink ? 'Copied ✓' : 'Copy Link'}
                  </button>
                </div>

                <div className="flex gap-4 pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=Buy WASSCE & BECE checkers directly from my store: ${encodeURIComponent(getStoreLink())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:opacity-85 text-white font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-none transition-all flex items-center gap-2"
                  >
                    Share via WhatsApp
                  </a>
                  <a
                    href={getStoreLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-content-primary text-content-primary font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-none transition-all hover:bg-slate-50"
                  >
                    Visit Storefront ↗
                  </a>
                </div>
              </div>
            )}

            {/* === Tab: Price overrides === */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-content-primary">
                    Price Customization
                  </h3>
                  <p className="text-content-secondary text-xs leading-relaxed font-normal">
                    Configure your selling price for each results checker. The margin profit represents your commission per item sold (Selling Price minus locked Base Price).
                  </p>
                </div>

                <form onSubmit={handlePricingSave} className="space-y-5">
                  {/* BECE Override */}
                  <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-content-secondary">
                      <span>BECE Checker Pricing</span>
                      <span className="text-brand-emerald font-black">Base price: GH₵ 16.50</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-xs font-bold text-content-primary mb-1">
                          Selling Price (GH₵)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="16.50"
                          value={becePriceInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBecePriceInput(val);
                            const parsed = parseFloat(val);
                            if (!isNaN(parsed)) {
                              setBecePrice(parsed);
                            }
                          }}
                          className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase text-content-secondary mb-1">
                          Your Profit Margin
                        </span>
                        <div className="font-mono text-sm font-bold text-brand-emerald h-[38px] flex items-center">
                          + GH₵ {(becePrice - 16.50).toFixed(2)} / sale
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WASSCE Override */}
                  <div className="border border-border-standard p-4 space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-content-secondary">
                      <span>WASSCE / SSCE Pricing</span>
                      <span className="text-brand-emerald font-black">Base price: GH₵ 16.50</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-xs font-bold text-content-primary mb-1">
                          Selling Price (GH₵)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="16.50"
                          value={wasscePriceInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWasscePriceInput(val);
                            const parsed = parseFloat(val);
                            if (!isNaN(parsed)) {
                              setWasscePrice(parsed);
                            }
                          }}
                          className="w-full bg-surface border border-slate-200 rounded-none px-3 py-2 text-sm font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase text-content-secondary mb-1">
                          Your Profit Margin
                        </span>
                        <div className="font-mono text-sm font-bold text-brand-emerald h-[38px] flex items-center">
                          + GH₵ {(wasscePrice - 16.50).toFixed(2)} / sale
                        </div>
                      </div>
                    </div>
                  </div>

                  {pricingSuccess && (
                    <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold rounded-none text-xs uppercase tracking-wide">
                      Selling prices saved successfully!
                    </div>
                  )}

                  {pricingError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                      {pricingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pricingLoading}
                    className="bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald transition-colors"
                  >
                    {pricingLoading ? 'Saving changes...' : 'Save Selling Prices'}
                  </button>
                </form>
              </div>
            )}

            {/* === Tab: Sales Logs === */}
            {activeTab === 'sales' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-content-primary pb-2 border-b border-slate-100">
                  Recent Checker Sales
                </h3>

                {recentOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-content-secondary font-bold uppercase tracking-wider">
                    No sales recorded yet. Share your store link to start selling.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-medium">
                      <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-content-secondary">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Reference</th>
                          <th className="px-4 py-3">Checker Type</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3 text-right">Customer Price</th>
                          <th className="px-4 py-3 text-right text-brand-emerald">Your Earnings</th>
                          <th className="px-4 py-3">Buyer Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-content-primary font-mono">
                        {recentOrders.map((order, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary text-[11px]">
                              {new Date(order.completed_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{order.client_reference}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-sans text-[11px] uppercase">{order.checker_type}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-sans text-[11px]">{order.quantity}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-sans text-[11px]">GH₵ {parseFloat(order.total_price).toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-brand-emerald font-sans font-bold text-[11px]">
                              + GH₵ {parseFloat(order.commission).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary">{order.buyer_email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* === Tab: Wallet Logs === */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-slate-100 gap-4">
                  <h3 className="font-serif text-lg font-bold text-content-primary">
                    Financial Wallet History
                  </h3>
                  <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="bg-content-primary text-surface py-2 px-4 rounded-none font-bold text-[9px] uppercase tracking-widest hover:bg-brand-emerald transition-colors align-self-start sm:align-self-auto"
                  >
                    Withdraw Funds
                  </button>
                </div>

                {ledger.length === 0 ? (
                  <p className="text-center py-8 text-xs text-content-secondary font-bold uppercase tracking-wider">
                    No transactions recorded on your ledger yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-medium">
                      <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-content-secondary">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Reference</th>
                          <th className="px-4 py-3">Activity</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                          <th className="px-4 py-3 text-right">Wallet Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-content-primary font-mono">
                        {ledger.map((entry, idx) => {
                          const amountVal = parseFloat(entry.amount);
                          const isCredit = amountVal > 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary text-[11px]">
                                {new Date(entry.created_at).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">{entry.reference}</td>
                              <td className="px-4 py-3 font-sans text-content-primary text-[11px]">
                                {entry.description || entry.entry_type_display}
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-right font-sans font-bold text-[11px] ${
                                isCredit ? 'text-brand-emerald' : 'text-red-500'
                              }`}>
                                {isCredit ? '+' : ''} GH₵ {amountVal.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right font-sans text-[11px]">
                                GH₵ {parseFloat(entry.balance_after).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ==================== PAYOUT MODAL ==================== */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-fade-in">
          <div className="bg-surface border border-slate-200 rounded-none w-full max-w-md shadow-2xl relative animate-elite-entrance">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute top-4 right-4 text-content-secondary hover:text-content-primary focus:outline-none p-1 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-content-primary mb-4">
                Withdraw Reseller Earnings
              </h3>

              <div className="mb-4 bg-slate-50 border border-slate-200 p-3 text-xs font-semibold uppercase tracking-wider text-content-secondary flex justify-between">
                <span>Available Balance:</span>
                <span className="font-mono text-brand-emerald font-bold">GH₵ {walletBalance.toFixed(2)}</span>
              </div>

              <form onSubmit={handlePayoutSubmit} className="space-y-4">
                {/* Payout amount */}
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1.5">
                    Amount to Withdraw (GH₵) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="50.00"
                    max={walletBalance}
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Minimum GH₵ 50.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                  />
                  <p className="mt-1 text-[10px] text-content-secondary uppercase font-semibold">
                    Must be at least GH₵ 50.00
                  </p>
                </div>

                {/* Mobile Money Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1.5">
                      MoMo Network <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={payoutNetwork}
                      onChange={(e) => setPayoutNetwork(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-medium focus:outline-none"
                    >
                      <option value="MTN">MTN</option>
                      <option value="TELECEL">Telecel</option>
                      <option value="AT">AirtelTigo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1.5">
                      Recipient Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutNumber}
                      onChange={(e) => setPayoutNumber(e.target.value)}
                      placeholder="e.g. 0545142658"
                      className="w-full bg-slate-50 border border-slate-200 rounded-none px-3 py-2.5 text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {payoutSuccess && (
                  <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold rounded-none text-xs uppercase tracking-wide">
                    Withdrawal request submitted successfully!
                  </div>
                )}

                {payoutError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-none text-xs font-bold uppercase tracking-wide">
                    {payoutError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={payoutLoading || walletBalance < 50}
                  className="w-full bg-content-primary text-surface py-3 px-6 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-brand-emerald disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {payoutLoading ? 'Submitting request...' : 'Confirm Withdrawal'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
