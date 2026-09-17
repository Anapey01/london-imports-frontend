'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuthStore } from '@/stores/agentAuthStore';
import { checkersAPI } from '@/lib/api';

import type { Order, LedgerEntry, Payout } from '@/components/checker/agent/types';
import StorefrontLinkTab from '@/components/checker/agent/StorefrontLinkTab';
import PricingManagerTab from '@/components/checker/agent/PricingManagerTab';
import RecentSalesTab from '@/components/checker/agent/RecentSalesTab';
import WalletLedgerTab from '@/components/checker/agent/WalletLedgerTab';
import StoreSettingsTab from '@/components/checker/agent/StoreSettingsTab';
import WithdrawalModal from '@/components/checker/agent/WithdrawalModal';

export default function AgentDashboardPage() {
  const router = useRouter();
  const { agent, isAuthenticated, logout } = useAgentAuthStore();

  const [activeTab, setActiveTab] = useState<'link' | 'pricing' | 'sales' | 'wallet' | 'settings'>('link');
  
  // Dashboard metrics
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [totalSold, setTotalSold] = useState<number>(0);
  
  // Lists
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [, setPayouts] = useState<Payout[]>([]);
  
  // Pricing manager state
  const [becePrice, setBecePrice] = useState<number>(16.50);
  const [wasscePrice, setWasscePrice] = useState<number>(16.50);
  const [becePriceInput, setBecePriceInput] = useState<string>('16.50');
  const [wasscePriceInput, setWasscePriceInput] = useState<string>('16.50');
  const [pricingLoading, setPricingLoading] = useState<boolean>(false);
  const [pricingSuccess, setPricingSuccess] = useState<boolean>(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Store Settings state
  const [storeNameInput, setStoreNameInput] = useState<string>('');
  const [slugInput, setSlugInput] = useState<string>('');
  const [momoNetworkInput, setMomoNetworkInput] = useState<string>('MTN');
  const [momoNumberInput, setMomoNumberInput] = useState<string>('');
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

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

  // Initialize profile & payout fields from agent profile
  useEffect(() => {
    if (agent) {
      setPayoutNetwork(agent.momo_network || 'MTN');
      setPayoutNumber(agent.momo_number || '');
      setStoreNameInput(agent.store_name || '');
      setSlugInput(agent.slug || '');
      setMomoNetworkInput(agent.momo_network || 'MTN');
      setMomoNumberInput(agent.momo_number || '');
    }
  }, [agent]);

  // Store Settings update handler
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(false);

    try {
      const res = await checkersAPI.agentUpdateProfile({
        store_name: storeNameInput.trim(),
        slug: slugInput.trim(),
        momo_network: momoNetworkInput,
        momo_number: momoNumberInput.trim(),
      });
      if (res.data) {
        useAgentAuthStore.getState().setAgent(res.data);
      }
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 4000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: Record<string, string[] | string> } };
      const errData = errorObj.response?.data;
      const msg = (
        (Array.isArray(errData?.store_name) ? errData.store_name[0] : null) || 
        (Array.isArray(errData?.slug) ? errData.slug[0] : null) || 
        (Array.isArray(errData?.momo_number) ? errData.momo_number[0] : null) || 
        (typeof errData?.error === 'string' ? errData.error : null) || 
        'Failed to update store settings.'
      );
      setSettingsError(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

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
      await Promise.all([fetchDashboardData(), fetchPricing()]);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } } };
      setPricingError(errorObj.response?.data?.error || 'Failed to update selling prices. Verify selling price is above GHS 16.50.');
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
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } } };
      setPayoutError(errorObj.response?.data?.error || 'Failed to submit withdrawal request.');
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
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 transition-colors focus:outline-none shrink-0 ${
                activeTab === 'settings' ? 'bg-surface text-brand-emerald border-t-2 border-t-brand-emerald' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Store Settings
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6">
            {activeTab === 'link' && (
              <StorefrontLinkTab
                storeLink={getStoreLink()}
                copiedLink={copiedLink}
                onCopyLink={copyStoreLink}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingManagerTab
                becePriceInput={becePriceInput}
                setBecePriceInput={setBecePriceInput}
                wasscePriceInput={wasscePriceInput}
                setWasscePriceInput={setWasscePriceInput}
                becePrice={becePrice}
                setBecePrice={setBecePrice}
                wasscePrice={wasscePrice}
                setWasscePrice={setWasscePrice}
                handlePricingSave={handlePricingSave}
                pricingLoading={pricingLoading}
                pricingSuccess={pricingSuccess}
                pricingError={pricingError}
              />
            )}

            {activeTab === 'sales' && (
              <RecentSalesTab recentOrders={recentOrders} />
            )}

            {activeTab === 'wallet' && (
              <WalletLedgerTab
                ledger={ledger}
                onOpenWithdrawal={() => setIsPayoutModalOpen(true)}
              />
            )}

            {activeTab === 'settings' && (
              <StoreSettingsTab
                storeNameInput={storeNameInput}
                setStoreNameInput={setStoreNameInput}
                slugInput={slugInput}
                setSlugInput={setSlugInput}
                momoNetworkInput={momoNetworkInput}
                setMomoNetworkInput={setMomoNetworkInput}
                momoNumberInput={momoNumberInput}
                setMomoNumberInput={setMomoNumberInput}
                handleSettingsSave={handleSettingsSave}
                settingsLoading={settingsLoading}
                settingsSuccess={settingsSuccess}
                settingsError={settingsError}
                agentEmail={agent?.email || agent?.user?.email}
              />
            )}
          </div>
        </div>
      </div>

      {/* Payout Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        walletBalance={walletBalance}
        payoutAmount={payoutAmount}
        setPayoutAmount={setPayoutAmount}
        payoutNetwork={payoutNetwork}
        setPayoutNetwork={setPayoutNetwork}
        payoutNumber={payoutNumber}
        setPayoutNumber={setPayoutNumber}
        handlePayoutSubmit={handlePayoutSubmit}
        payoutLoading={payoutLoading}
        payoutError={payoutError}
        payoutSuccess={payoutSuccess}
      />
    </div>
  );
}
