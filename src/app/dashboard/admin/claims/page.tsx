'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { 
    ShieldCheck, 
    RefreshCw, 
    Check, 
    AlertCircle, 
    ExternalLink,
    Copy,
    CreditCard,
    Phone,
    MessageCircle,
    Search,
    Truck,
    Package,
    Sparkles
} from 'lucide-react';
import { adminAPI } from '@/lib/api';

interface USSDClaim {
    id: string;
    order_number: string;
    order_total: number;
    order_balance: number;
    transaction_id: string;
    claimed_amount: number | null;
    customer_phone: string;
    status: string;
    created_at: string;
    resolved_at?: string | null;
    resolved_by?: string | null;
    notes?: string;
}

interface AdminOrder {
    id: string;
    order_number: string;
    customer: {
        name: string;
        email: string;
        avatar?: string | null;
    };
    phone?: string;
    total: number;
    amount_paid: number;
    balance_due: number;
    is_installment?: boolean;
    status: string;
    state: string;
    created_at: string;
    items_summary?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    batch_name?: string;
}

export default function AdminClaimsPage() {
    const [avatarError, setAvatarError] = useState(false);
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'debtors' | 'sourcing' | 'sync' | 'history' | 'whatsapp'>('pending');
    
    // Filter & search states
    const [filterQuery, setFilterQuery] = useState('');
    const [debtorFilter, setDebtorFilter] = useState<'all' | 'partial' | 'pending'>('all');
    const [debtorSearch, setDebtorSearch] = useState('');
    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

    // Sync Form State
    const [syncOrderNumber, setSyncOrderNumber] = useState('');
    const [syncTxnId, setSyncTxnId] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

    // WhatsApp Generator State
    const [waCustomerName, setWaCustomerName] = useState('');
    const [waCustomerPhone, setWaCustomerPhone] = useState('');
    const [waOrderNumber, setWaOrderNumber] = useState('');
    const [waBalanceDue, setWaBalanceDue] = useState('');
    const [waTemplate, setWaTemplate] = useState<'balance_reminder' | 'payment_received' | 'china_shipped' | 'accra_arrived'>('balance_reminder');

    // Fetch all claims
    const fetchClaims = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch {
            // Silently fallback
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch orders for debtors and sourcing
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

    useEffect(() => {
        fetchClaims();
        fetchOrders();
    }, [fetchClaims, fetchOrders]);

    // Memoized computations
    const pendingClaims = useMemo(() => 
        claims.filter(c => c.status === 'PENDING_AUDIT'),
        [claims]
    );

    const resolvedClaims = useMemo(() => 
        claims.filter(c => c.status !== 'PENDING_AUDIT'),
        [claims]
    );

    const allDebtors = useMemo(() => 
        orders.filter(o => Number(o.balance_due) > 0),
        [orders]
    );

    const partiallyPaidDebtors = useMemo(() => 
        allDebtors.filter(o => Number(o.amount_paid) > 0),
        [allDebtors]
    );

    const completelyUnpaidDebtors = useMemo(() => 
        allDebtors.filter(o => Number(o.amount_paid) <= 0),
        [allDebtors]
    );

    const filteredDebtors = useMemo(() => {
        return allDebtors.filter(o => {
            if (debtorFilter === 'partial' && Number(o.amount_paid) <= 0) return false;
            if (debtorFilter === 'pending' && Number(o.amount_paid) > 0) return false;
            if (debtorSearch.trim()) {
                const q = debtorSearch.toLowerCase();
                return (
                    o.order_number.toLowerCase().includes(q) ||
                    (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
                    (o.phone && o.phone.toLowerCase().includes(q))
                );
            }
            return true;
        });
    }, [allDebtors, debtorFilter, debtorSearch]);

    const totalOutstandingDebt = useMemo(() => 
        allDebtors.reduce((acc, curr) => acc + (Number(curr.balance_due) || 0), 0),
        [allDebtors]
    );

    // China Sourcing Consolidation (memoized)
    const consolidatedSourcingItems = useMemo(() => {
        const sourcingOrders = orders.filter(o => 
            ['PAID', 'PROCESSING', 'OPEN_FOR_BATCH', 'CUTOFF_REACHED', 'IN_FULFILLMENT'].includes(o.state) ||
            (Number(o.amount_paid) > 0 && !['CANCELLED', 'REFUNDED', 'DELIVERED'].includes(o.state))
        );

        const itemsMap = new Map<string, { name: string; quantity: number; orders: string[]; estimatedCost: number }>();
        sourcingOrders.forEach(o => {
            if (Array.isArray(o.items_summary)) {
                o.items_summary.forEach(item => {
                    const key = item.name.trim();
                    const existing = itemsMap.get(key);
                    if (existing) {
                        existing.quantity += item.quantity || 1;
                        if (!existing.orders.includes(o.order_number)) existing.orders.push(o.order_number);
                        existing.estimatedCost += (item.price || 0) * (item.quantity || 1);
                    } else {
                        itemsMap.set(key, {
                            name: item.name,
                            quantity: item.quantity || 1,
                            orders: [o.order_number],
                            estimatedCost: (item.price || 0) * (item.quantity || 1)
                        });
                    }
                });
            }
        });
        return Array.from(itemsMap.values());
    }, [orders]);

    const totalUnitsToProcure = useMemo(() => 
        consolidatedSourcingItems.reduce((acc, curr) => acc + curr.quantity, 0),
        [consolidatedSourcingItems]
    );

    const handleCopy = useCallback((text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(null), 2000);
    }, []);

    const handleApproveClaim = useCallback(async (claim: USSDClaim) => {
        const customAmount = prompt(
            `Confirm payment credit for Order #${claim.order_number}:\nEnter amount in GH₵ (claimed: GH₵ ${claim.claimed_amount || claim.order_balance || 1}):`,
            String(claim.claimed_amount || claim.order_balance || 1)
        );
        if (customAmount === null) return;
        const parsed = parseFloat(customAmount);
        if (isNaN(parsed) || parsed <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        try {
            await adminAPI.resolveUSSDClaim({
                claim_id: claim.id,
                action: 'approve',
                amount: parsed
            });
            await fetchClaims();
            await fetchOrders();
            alert(`GH₵ ${parsed.toFixed(2)} credited to Order #${claim.order_number}.`);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to approve claim');
        }
    }, [fetchClaims, fetchOrders]);

    const handleRejectClaim = useCallback(async (claim: USSDClaim) => {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason === null) return;
        try {
            await adminAPI.resolveUSSDClaim({
                claim_id: claim.id,
                action: 'reject',
                notes: reason || undefined
            });
            await fetchClaims();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to reject claim');
        }
    }, [fetchClaims]);

    const handleForceSync = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!syncOrderNumber.trim() || !syncTxnId.trim()) return;

        setIsSyncing(true);
        setSyncResult(null);

        try {
            const res = await adminAPI.forceSyncPayment({
                order_number: syncOrderNumber.trim(),
                reference: syncTxnId.trim()
            });

            if (res.data?.success) {
                setSyncResult({
                    success: true,
                    message: res.data.message || 'Payment reconciled and credited successfully.'
                });
                setSyncOrderNumber('');
                setSyncTxnId('');
                fetchClaims();
                fetchOrders();
            } else {
                setSyncResult({
                    success: false,
                    message: res.data?.error || 'Could not reconcile payment.'
                });
            }
        } catch (err: any) {
            setSyncResult({
                success: false,
                message: err.response?.data?.error || err.message || 'Verification error'
            });
        } finally {
            setIsSyncing(false);
        }
    }, [syncOrderNumber, syncTxnId, fetchClaims, fetchOrders]);

    const getDebtorWhatsAppUrl = useCallback((debtor: AdminOrder) => {
        const cleanPhone = (debtor.phone || '').replace(/\D/g, '');
        let targetPhone = cleanPhone;
        if (targetPhone.startsWith('0')) targetPhone = '233' + targetPhone.slice(1);
        if (!targetPhone.startsWith('233') && targetPhone.length === 9) targetPhone = '233' + targetPhone;

        const customerName = debtor.customer?.name || 'Customer';
        const text = `Hello ${customerName}, this is London's Imports customer concierge regarding Order #${debtor.order_number}. Our records indicate an outstanding balance of GH₵ ${Number(debtor.balance_due).toFixed(2)} (Total: GH₵ ${Number(debtor.total).toFixed(2)}, Paid: GH₵ ${Number(debtor.amount_paid).toFixed(2)}). You can view your order tracking and clear your balance online or via USSD (*713*7453#) here: https://londonsimports.com/track?order=${debtor.order_number}. Thank you.`;

        return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    }, []);

    const getCustomWhatsAppUrl = useCallback(() => {
        let cleanPhone = waCustomerPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '233' + cleanPhone.slice(1);
        if (!cleanPhone.startsWith('233') && cleanPhone.length === 9) cleanPhone = '233' + cleanPhone;

        const name = waCustomerName.trim() || 'Customer';
        const order = waOrderNumber.trim() || 'your order';
        const balance = waBalanceDue.trim() ? `GH₵ ${waBalanceDue.trim()}` : '';

        let text = '';
        if (waTemplate === 'payment_received') {
            text = `Hello ${name}, your payment for Order #${order} has been verified and credited. ${balance ? `Your remaining balance is ${balance}.` : 'Your order is cleared for processing.'} Thank you for choosing London's Imports.`;
        } else if (waTemplate === 'china_shipped') {
            text = `Hello ${name}, your Order #${order} has been dispatched from our consolidation warehouse in China and is en route to Accra (standard sea freight approx 6 weeks, or express air 2-3 weeks). We will notify you when it lands.`;
        } else if (waTemplate === 'balance_reminder') {
            text = `Hello ${name}, this is London's Imports regarding Order #${order}. Your current outstanding balance is ${balance || 'pending'}. You may settle this via MoMo or dialing *713*7453# to avoid delivery delays. View tracking: https://londonsimports.com/track?order=${order}`;
        } else {
            text = `Hello ${name}, your package for Order #${order} has safely landed at our Accra Central sorting hub. ${balance ? `Please clear the remaining balance of ${balance} so our dispatch rider can release your package for delivery.` : 'Your package is ready for delivery.'}`;
        }

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }, [waCustomerPhone, waCustomerName, waOrderNumber, waBalanceDue, waTemplate]);

    const sourcingManifestString = useMemo(() => {
        const lines = [
            `LONDON'S IMPORTS - CHINA SOURCING MANIFEST`,
            `Generated: ${new Date().toLocaleDateString('en-GB')}`,
            `Total Units: ${totalUnitsToProcure}`,
            `Products: ${consolidatedSourcingItems.length}`,
            `===========================================`
        ];
        consolidatedSourcingItems.forEach((item, index) => {
            lines.push(`${index + 1}. ${item.name} - Qty: ${item.quantity} units (Orders: ${item.orders.slice(0, 3).map(o => '#' + o).join(', ')}${item.orders.length > 3 ? ` +${item.orders.length - 3} more` : ''})`);
        });
        return lines.join('\n');
    }, [totalUnitsToProcure, consolidatedSourcingItems]);

    const filteredPending = useMemo(() => {
        if (!filterQuery) return pendingClaims;
        const q = filterQuery.toLowerCase();
        return pendingClaims.filter(c => 
            c.order_number.toLowerCase().includes(q) ||
            c.transaction_id.toLowerCase().includes(q) ||
            (c.customer_phone && c.customer_phone.includes(q))
        );
    }, [pendingClaims, filterQuery]);

    const filteredHistory = useMemo(() => {
        if (!filterQuery) return resolvedClaims;
        const q = filterQuery.toLowerCase();
        return resolvedClaims.filter(c => 
            c.order_number.toLowerCase().includes(q) ||
            c.transaction_id.toLowerCase().includes(q) ||
            (c.customer_phone && c.customer_phone.includes(q))
        );
    }, [resolvedClaims, filterQuery]);

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60 flex items-center justify-center">
                        {!avatarError ? (
                            <NextImage
                                src="/logo.jpg"
                                alt="Miss London"
                                fill
                                sizes="44px"
                                className="object-cover object-top"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <span className="text-xs font-mono font-bold text-white">ML</span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Miss London Operations
                            </h1>
                            <span className="text-[10px] font-mono uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded font-bold">
                                RECONCILIATION
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Offline USSD payments (*713*7453#), debt recovery, China sourcing consolidation & Hubtel verification
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => { fetchClaims(); fetchOrders(); }}
                        disabled={isLoading || isLoadingOrders}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isLoadingOrders) ? 'animate-spin' : ''}`} />
                        <span>Refresh Data</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-admin-concierge'))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open Side Drawer</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards - Clean Monochrome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Pending USSD Audits</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {pendingClaims.length}
                        </span>
                        <span className="text-xs text-slate-400">claims</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Outstanding Balance</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            GH₵ {totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-400">({allDebtors.length} accounts)</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">China Sourcing Queue</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            {totalUnitsToProcure}
                        </span>
                        <span className="text-xs text-slate-400">units ({consolidatedSourcingItems.length} products)</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">USSD Shortcode</span>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            *713*7453#
                        </span>
                        <span className="text-xs text-slate-400">Hubtel</span>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'pending'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    Pending Claims ({pendingClaims.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('debtors')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'debtors'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    Debtors Hub ({allDebtors.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('sourcing')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'sourcing'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    China Sourcing ({totalUnitsToProcure} pcs)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('sync')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'sync'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    Force Sync Hubtel
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'history'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    Audit History ({resolvedClaims.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'whatsapp'
                            ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    WhatsApp Dispatcher
                </button>
            </div>

            {/* TAB 1: PENDING CLAIMS */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Filter by order number, transaction ID, or customer phone..."
                            className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                        />
                    </div>

                    {filteredPending.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                            <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No pending claims</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                                All customer claims submitted via USSD *713*7453# have been reviewed and reconciled.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPending.map(claim => (
                                <div 
                                    key={claim.id} 
                                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xs space-y-3"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                #{claim.order_number}
                                            </span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                Claim: GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                            </span>
                                        </div>

                                        <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-mono">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500 font-sans">Txn ID:</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{claim.transaction_id}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500 font-sans">Balance:</span>
                                                <span>GH₵ {Number(claim.order_balance).toFixed(2)}</span>
                                            </div>
                                            {claim.customer_phone && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500 font-sans">Phone:</span>
                                                    <a href={`tel:${claim.customer_phone}`} className="hover:underline">
                                                        {claim.customer_phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleApproveClaim(claim)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Approve</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRejectClaim(claim)}
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: DEBTORS HUB */}
            {activeTab === 'debtors' && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={debtorSearch}
                                onChange={(e) => setDebtorSearch(e.target.value)}
                                placeholder="Search by customer name, phone, or order #..."
                                className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setDebtorFilter('all')}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    debtorFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                All ({allDebtors.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setDebtorFilter('partial')}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    debtorFilter === 'partial'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Partially Paid ({partiallyPaidDebtors.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setDebtorFilter('pending')}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    debtorFilter === 'pending'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Unpaid ({completelyUnpaidDebtors.length})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Order #</th>
                                        <th className="py-3 px-4">Customer</th>
                                        <th className="py-3 px-4">Phone</th>
                                        <th className="py-3 px-4 text-right">Total</th>
                                        <th className="py-3 px-4 text-right">Paid</th>
                                        <th className="py-3 px-4 text-right">Balance Due</th>
                                        <th className="py-3 px-4 text-center">State</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {isLoadingOrders ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400">
                                                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                                                <span>Loading debtor accounts...</span>
                                            </td>
                                        </tr>
                                    ) : filteredDebtors.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400">
                                                No debtor accounts match this filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDebtors.map(debtor => (
                                            <tr key={debtor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    #{debtor.order_number}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                                                    {debtor.customer?.name || 'Customer'}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {debtor.phone || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    GH₵ {Number(debtor.total).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    GH₵ {Number(debtor.amount_paid).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                    GH₵ {Number(debtor.balance_due).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {Number(debtor.amount_paid) > 0 ? 'Partial' : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <a
                                                            href={getDebtorWhatsAppUrl(debtor)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-[11px] font-medium transition-colors"
                                                            title="WhatsApp Reminder"
                                                        >
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>Reminder</span>
                                                        </a>
                                                        {debtor.phone && (
                                                            <a
                                                                href={`tel:${debtor.phone}`}
                                                                className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                title="Call Customer"
                                                            >
                                                                <Phone className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                        <Link
                                                            href={`/dashboard/admin/orders/${debtor.id}`}
                                                            className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="View Order"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: CHINA SOURCING CONSOLIDATOR */}
            {activeTab === 'sourcing' && (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                Factory Procurement Summary
                            </span>
                            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                                {totalUnitsToProcure} Total Units Required Across {consolidatedSourcingItems.length} Products
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleCopy(sourcingManifestString, 'Page Manifest')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedLabel === 'Page Manifest' ? 'Copied' : 'Copy Sourcing Manifest'}</span>
                        </button>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">Product Name</th>
                                        <th className="py-3 px-4 text-center">Required Units</th>
                                        <th className="py-3 px-4">Orders</th>
                                        <th className="py-3 px-4 text-right">Value (GH₵)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {consolidatedSourcingItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400">
                                                No active pre-order items requiring procurement.
                                            </td>
                                        </tr>
                                    ) : (
                                        consolidatedSourcingItems.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3 px-4 font-mono text-slate-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                                    {item.name}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700">
                                                        {item.quantity} pcs
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {item.orders.map(o => '#' + o).join(', ')}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    GH₵ {item.estimatedCost.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: FORCE SYNC HUBTEL */}
            {activeTab === 'sync' && (
                <div className="max-w-xl mx-auto p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Hubtel Payment Verification
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Query Hubtel API using Transaction ID or Client Reference to credit an order.
                        </p>
                    </div>

                    <form onSubmit={handleForceSync} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Order Reference Number
                            </label>
                            <input
                                type="text"
                                value={syncOrderNumber}
                                onChange={(e) => setSyncOrderNumber(e.target.value)}
                                placeholder="e.g. LI-20260921-87841"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Hubtel Transaction ID or Client Reference
                            </label>
                            <input
                                type="text"
                                value={syncTxnId}
                                onChange={(e) => setSyncTxnId(e.target.value)}
                                placeholder="e.g. 90263045181"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                required
                            />
                        </div>

                        {syncResult && (
                            <div className="p-3 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                                {syncResult.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSyncing}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isSyncing ? 'Verifying Gateway...' : 'Verify & Credit Payment'}</span>
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 5: AUDIT HISTORY */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Filter audit history..."
                            className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                        />
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Order #</th>
                                        <th className="py-3 px-4">Transaction ID</th>
                                        <th className="py-3 px-4">Customer Phone</th>
                                        <th className="py-3 px-4 text-right">Amount Claimed</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-4">Audited By</th>
                                        <th className="py-3 px-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                No resolved claims in history.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map(claim => (
                                            <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    #{claim.order_number}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.transaction_id}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.customer_phone || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-semibold">
                                                    GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-500">
                                                    {claim.resolved_by || 'Admin Concierge'}
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-400 font-mono">
                                                    {claim.resolved_at ? new Date(claim.resolved_at).toLocaleDateString() : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 6: WHATSAPP DISPATCHER */}
            {activeTab === 'whatsapp' && (
                <div className="max-w-xl mx-auto p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Customer WhatsApp Notification Dispatcher
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Generate standardized notifications with tracking links.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Template
                        </label>
                        <select
                            value={waTemplate}
                            onChange={(e) => setWaTemplate(e.target.value as any)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="balance_reminder">Outstanding Balance Reminder</option>
                            <option value="payment_received">Payment Received Confirmation</option>
                            <option value="china_shipped">Dispatched from China Factory</option>
                            <option value="accra_arrived">Arrived at Accra Central Hub</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Customer First Name
                            </label>
                            <input
                                type="text"
                                value={waCustomerName}
                                onChange={(e) => setWaCustomerName(e.target.value)}
                                placeholder="e.g. Gabriel"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Customer Phone Number
                            </label>
                            <input
                                type="text"
                                value={waCustomerPhone}
                                onChange={(e) => setWaCustomerPhone(e.target.value)}
                                placeholder="024XXXXXXX"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Order Reference Number
                            </label>
                            <input
                                type="text"
                                value={waOrderNumber}
                                onChange={(e) => setWaOrderNumber(e.target.value)}
                                placeholder="e.g. LI-20260921-87841"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Outstanding Balance (GH₵)
                            </label>
                            <input
                                type="text"
                                value={waBalanceDue}
                                onChange={(e) => setWaBalanceDue(e.target.value)}
                                placeholder="e.g. 7.00"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <a
                        href={getCustomWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Launch WhatsApp Chat</span>
                    </a>
                </div>
            )}
        </div>
    );
}
