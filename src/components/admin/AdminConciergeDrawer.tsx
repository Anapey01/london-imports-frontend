'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { 
    X, 
    Bot, 
    CreditCard, 
    Package, 
    ShieldCheck, 
    RefreshCw 
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { AdminOrderData } from '@/lib/concierge-utils';

import DebtorsTab from './concierge/DebtorsTab';
import SourcingTab from './concierge/SourcingTab';
import ClaimsAuditTab, { USSDClaim } from './concierge/ClaimsAuditTab';
import CopilotChatTab from './concierge/CopilotChatTab';

export default function AdminConciergeDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'copilot' | 'debtors' | 'sourcing' | 'claims'>('copilot');

    // USSD Claims State
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [isLoadingClaims, setIsLoadingClaims] = useState(false);

    // Orders State
    const [orders, setOrders] = useState<AdminOrderData[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Avatar error fallback
    const [avatarError, setAvatarError] = useState(false);

    const fetchClaims = useCallback(async () => {
        setIsLoadingClaims(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch {
            // Silently fallback
        } finally {
            setIsLoadingClaims(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setIsLoadingOrders(true);
        try {
            const res = await adminAPI.orders();
            const orderList = Array.isArray(res.data?.results) ? res.data.results : (Array.isArray(res.data) ? res.data : []);
            setOrders(orderList);
        } catch {
            // Silently fallback
        } finally {
            setIsLoadingOrders(false);
        }
    }, []);

    const handleRefreshAll = () => {
        fetchClaims();
        fetchOrders();
    };

    // Load data when opened
    useEffect(() => {
        if (isOpen) {
            handleRefreshAll();
        }
    }, [isOpen]);

    // Listen for custom trigger event
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-admin-concierge', handleOpen);
        return () => window.removeEventListener('open-admin-concierge', handleOpen);
    }, []);

    const pendingClaimsCount = useMemo(() => {
        return claims.filter(c => c.status === 'PENDING_AUDIT').length;
    }, [claims]);

    return (
        <>
            {/* Global Trigger Floating Button (when drawer is closed) */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative flex items-center gap-2.5 px-4 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-full border border-slate-800 dark:border-slate-200 shadow-xl transition-colors duration-150 hover:bg-slate-900"
                    aria-label="Open Operations Concierge"
                >
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800 flex items-center justify-center">
                        {!avatarError ? (
                            <Image
                                src="/miss-london-avatar.png"
                                alt="Miss London"
                                width={24}
                                height={24}
                                className="object-cover w-full h-full"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <Bot className="w-3.5 h-3.5 text-white" />
                        )}
                    </div>
                    <span className="text-xs font-semibold tracking-wide">Miss London</span>
                    {pendingClaimsCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-white dark:bg-slate-950 animate-pulse" />
                    )}
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Drawer */}
            <div
                className={`fixed top-0 right-0 h-[100dvh] w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-[60] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {!avatarError ? (
                                <Image
                                    src="/miss-london-avatar.png"
                                    alt="Miss London"
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                    onError={() => setAvatarError(true)}
                                />
                            ) : (
                                <Bot className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">Miss London</h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Store Operations Concierge</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleRefreshAll}
                            disabled={isLoadingOrders || isLoadingClaims}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${(isLoadingOrders || isLoadingClaims) ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
                            title="Close Concierge"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 shrink-0 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('copilot')}
                        className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                            activeTab === 'copilot'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Bot className="w-3.5 h-3.5" />
                        Copilot
                    </button>
                    <button
                        onClick={() => setActiveTab('debtors')}
                        className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                            activeTab === 'debtors'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        Debtors
                    </button>
                    <button
                        onClick={() => setActiveTab('sourcing')}
                        className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                            activeTab === 'sourcing'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Package className="w-3.5 h-3.5" />
                        China Sourcing
                    </button>
                    <button
                        onClick={() => setActiveTab('claims')}
                        className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors relative ${
                            activeTab === 'claims'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Claims
                        {pendingClaimsCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950">
                                {pendingClaimsCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4">
                    {activeTab === 'copilot' && (
                        <CopilotChatTab
                            orders={orders}
                            pendingClaimsCount={pendingClaimsCount}
                            onSwitchTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'debtors' && (
                        <DebtorsTab
                            orders={orders}
                            isLoading={isLoadingOrders}
                        />
                    )}
                    {activeTab === 'sourcing' && (
                        <SourcingTab
                            orders={orders}
                            isLoading={isLoadingOrders}
                        />
                    )}
                    {activeTab === 'claims' && (
                        <ClaimsAuditTab
                            claims={claims}
                            isLoading={isLoadingClaims}
                            onRefresh={fetchClaims}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
