'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
    Send,
    Filter,
    ArrowRight,
    Sparkles,
    Search,
    Truck,
    Package,
    Clock,
    DollarSign
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [avatarError, setAvatarError] = useState(false);
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'debtors' | 'sourcing' | 'sync' | 'history' | 'whatsapp'>('pending');
    
    // Claims filter query
    const [filterQuery, setFilterQuery] = useState('');
    const [copiedTxn, setCopiedTxn] = useState<string | null>(null);

    // Debtors filter & search
    const [debtorFilter, setDebtorFilter] = useState<'all' | 'partial' | 'pending'>('all');
    const [debtorSearch, setDebtorSearch] = useState('');

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
    const [waTemplate, setWaTemplate] = useState<'payment_received' | 'china_shipped' | 'accra_arrived' | 'balance_reminder'>('balance_reminder');

    // Fetch all claims
    const fetchClaims = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch (err) {
            console.error('Failed to fetch claims:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch orders for debtors and sourcing consolidation
    const fetchOrders = useCallback(async () => {
        setIsLoadingOrders(true);
        try {
            const res = await adminAPI.orders();
            const orderList = Array.isArray(res.data?.results) ? res.data.results : (Array.isArray(res.data) ? res.data : []);
            setOrders(orderList);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setIsLoadingOrders(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
        fetchOrders();
        const interval = setInterval(() => {
            fetchClaims();
            fetchOrders();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchClaims, fetchOrders]);

    const pendingClaims = claims.filter(c => c.status === 'PENDING_AUDIT');
    const resolvedClaims = claims.filter(c => c.status !== 'PENDING_AUDIT');

    // Debtors calculation
    const allDebtors = orders.filter(o => Number(o.balance_due) > 0);
    const partiallyPaidDebtors = allDebtors.filter(o => Number(o.amount_paid) > 0);
    const completelyUnpaidDebtors = allDebtors.filter(o => Number(o.amount_paid) <= 0);

    const filteredDebtors = allDebtors.filter(o => {
        if (debtorFilter === 'partial' && Number(o.amount_paid) <= 0) return false;
        if (debtorFilter === 'pending' && Number(o.amount_paid) > 0) return false;
        if (debtorSearch.trim()) {
            const q = debtorSearch.toLowerCase();
            const matchesOrder = o.order_number.toLowerCase().includes(q);
            const matchesName = o.customer?.name?.toLowerCase().includes(q);
            const matchesPhone = o.phone?.toLowerCase().includes(q);
            return matchesOrder || matchesName || matchesPhone;
        }
        return true;
    });

    const totalOutstandingDebt = allDebtors.reduce((acc, curr) => acc + (Number(curr.balance_due) || 0), 0);

    // China Sourcing Consolidation calculation
    const sourcingOrders = orders.filter(o => 
        ['PAID', 'PROCESSING', 'OPEN_FOR_BATCH', 'CUTOFF_REACHED', 'IN_FULFILLMENT'].includes(o.state) ||
        (Number(o.amount_paid) > 0 && !['CANCELLED', 'REFUNDED', 'DELIVERED'].includes(o.state))
    );

    const consolidatedItemsMap = new Map<string, { name: string; quantity: number; orders: string[]; estimatedCost: number }>();
    sourcingOrders.forEach(o => {
        if (Array.isArray(o.items_summary)) {
            o.items_summary.forEach(item => {
                const key = item.name.trim();
                const existing = consolidatedItemsMap.get(key);
                if (existing) {
                    existing.quantity += item.quantity || 1;
                    if (!existing.orders.includes(o.order_number)) existing.orders.push(o.order_number);
                    existing.estimatedCost += (item.price || 0) * (item.quantity || 1);
                } else {
                    consolidatedItemsMap.set(key, {
                        name: item.name,
                        quantity: item.quantity || 1,
                        orders: [o.order_number],
                        estimatedCost: (item.price || 0) * (item.quantity || 1)
                    });
                }
            });
        }
    });
    const consolidatedSourcingItems = Array.from(consolidatedItemsMap.values());
    const totalUnitsToProcure = consolidatedSourcingItems.reduce((acc, curr) => acc + curr.quantity, 0);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTxn(text);
        setTimeout(() => setCopiedTxn(null), 2000);
    };

    const handleApproveClaim = async (claim: USSDClaim) => {
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
            alert(`GH₵ ${parsed.toFixed(2)} successfully credited to Order #${claim.order_number}!`);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Failed to approve claim');
        }
    };

    const handleRejectClaim = async (claim: USSDClaim) => {
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
    };

    const handleForceSync = async (e: React.FormEvent) => {
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
    };

    const generateDebtorWhatsAppLink = (debtor: AdminOrder) => {
        const cleanPhone = (debtor.phone || '').replace(/\D/g, '');
        let targetPhone = cleanPhone;
        if (targetPhone.startsWith('0')) targetPhone = '233' + targetPhone.slice(1);
        if (!targetPhone.startsWith('233') && targetPhone.length === 9) targetPhone = '233' + targetPhone;

        const customerName = debtor.customer?.name || 'Customer';
        const text = `Hello ${customerName}, this is London's Imports customer concierge regarding Order #${debtor.order_number}. Our records indicate an outstanding balance of GH₵ ${Number(debtor.balance_due).toFixed(2)} (Total: GH₵ ${Number(debtor.total).toFixed(2)}, Amount Paid: GH₵ ${Number(debtor.amount_paid).toFixed(2)}). You can view your order tracking and clear your balance online or via USSD (*713*7453#) here: https://londonsimports.com/track?order=${debtor.order_number}. Thank you!`;

        return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    };

    const generateWhatsAppLink = () => {
        let cleanPhone = waCustomerPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '233' + cleanPhone.slice(1);
        if (!cleanPhone.startsWith('233') && cleanPhone.length === 9) cleanPhone = '233' + cleanPhone;

        const name = waCustomerName.trim() || 'Customer';
        const order = waOrderNumber.trim() || 'your order';
        const balance = waBalanceDue.trim() ? `GH₵ ${waBalanceDue.trim()}` : '';

        let text = '';
        if (waTemplate === 'payment_received') {
            text = `Hello ${name}, your payment for Order #${order} has been verified and credited. ${balance ? `Your remaining balance is ${balance}.` : 'Your order is fully cleared for processing.'} Thank you for choosing London's Imports!`;
        } else if (waTemplate === 'china_shipped') {
            text = `Hello ${name}, great news! Your Order #${order} has been dispatched from our partner factory consolidation warehouse in China and is en route to our central distribution hub in Accra (estimated around 6 weeks for standard sea freight, or 2-3 weeks for express air). We will notify you the moment it lands!`;
        } else if (waTemplate === 'balance_reminder') {
            text = `Hello ${name}, this is London's Imports regarding Order #${order}. Please note your current outstanding balance is ${balance || 'pending'}. You may settle this via MoMo or dialing *713*7453# to avoid delivery delays. View tracking: https://londonsimports.com/track?order=${order}`;
        } else {
            text = `Hello ${name}, your package for Order #${order} has safely landed at our Accra Central sorting hub! ${balance ? `Please clear the remaining balance of ${balance} so our dispatch rider can release your package for doorstep delivery.` : 'Your package is ready for delivery!'}`;
        }

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    const generateSourcingManifestText = () => {
        const lines = [
            `LONDON'S IMPORTS - CHINA SOURCING MANIFEST`,
            `Generated: ${new Date().toLocaleDateString('en-GB')}`,
            `Total Units to Procure: ${totalUnitsToProcure}`,
            `Unique Products: ${consolidatedSourcingItems.length}`,
            `===========================================`
        ];
        consolidatedSourcingItems.forEach((item, index) => {
            lines.push(`${index + 1}. ${item.name} - Qty: ${item.quantity} units (Orders: ${item.orders.slice(0, 3).map(o => '#' + o).join(', ')}${item.orders.length > 3 ? ` +${item.orders.length - 3} more` : ''})`);
        });
        return lines.join('\n');
    };

    // Filtered lists
    const filteredPending = pendingClaims.filter(c => 
        !filterQuery || 
        c.order_number.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.transaction_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (c.customer_phone && c.customer_phone.includes(filterQuery))
    );

    const filteredHistory = resolvedClaims.filter(c => 
        !filterQuery || 
        c.order_number.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.transaction_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (c.customer_phone && c.customer_phone.includes(filterQuery))
    );

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60 shadow-xs flex items-center justify-center">
                        {!avatarError ? (
                            <NextImage
                                src="/logo.jpg"
                                alt="Miss London"
                                fill
                                sizes="48px"
                                className="object-cover object-top"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <span className="text-sm font-black text-white">ML</span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Miss London AI Operations Command
                            </h1>
                            <span className="text-[10px] font-mono uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded font-bold">
                                Central Hub
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Customer USSD payments (*713*7453#), debt recovery, China sourcing consolidation & Hubtel reconciliation
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { fetchClaims(); fetchOrders(); }}
                        disabled={isLoading || isLoadingOrders}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isLoadingOrders) ? 'animate-spin' : ''}`} />
                        <span>Refresh All</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-admin-concierge'))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Open AI Side Drawer</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pending USSD Audits</span>
                        {pendingClaims.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
                            {pendingClaims.length}
                        </span>
                        <span className="text-xs text-slate-400">claims awaiting review</span>
                    </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Outstanding Debt</span>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                            {allDebtors.length} accounts
                        </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
                            GH₵ {totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">China Sourcing Queue</span>
                        <Truck className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
                            {totalUnitsToProcure}
                        </span>
                        <span className="text-xs text-slate-400">units across {consolidatedSourcingItems.length} products</span>
                    </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Offline MoMo Shortcode</span>
                        <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                            *713*7453#
                        </span>
                        <span className="text-xs text-slate-400">Hubtel USSD</span>
                    </div>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1 overflow-x-auto pb-px no-scrollbar">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'pending'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>Pending Claims</span>
                        {pendingClaims.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                                {pendingClaims.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('debtors')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'debtors'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>Debtors Hub</span>
                        {allDebtors.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                                {allDebtors.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('sourcing')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'sourcing'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>China Sourcing Consolidator</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                            {totalUnitsToProcure} pcs
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('sync')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'sync'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>Force Sync Hubtel</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'history'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>Audit History</span>
                        <span className="text-[10px] text-slate-400">({resolvedClaims.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                            activeTab === 'whatsapp'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>WhatsApp Dispatcher</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: PENDING CLAIMS */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Search by order number, transaction ID, or customer phone..."
                                className="w-full text-xs px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                            />
                        </div>
                    </div>

                    {filteredPending.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40">
                            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
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
                                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                                    #{claim.order_number}
                                                </span>
                                                <Link
                                                    href={`/dashboard/admin/orders?search=${claim.order_number}`}
                                                    target="_blank"
                                                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                                                GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                            </span>
                                        </div>

                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-[11px]">Hubtel Txn ID:</span>
                                                <div className="flex items-center gap-1.5 font-mono font-medium">
                                                    <span>{claim.transaction_id}</span>
                                                    <button
                                                        onClick={() => handleCopy(claim.transaction_id)}
                                                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                                        title="Copy Transaction ID"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-[11px]">Order Total:</span>
                                                <span className="font-mono font-medium">GH₵ {Number(claim.order_total).toFixed(2)}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-[11px]">Order Balance:</span>
                                                <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
                                                    GH₵ {Number(claim.order_balance).toFixed(2)}
                                                </span>
                                            </div>

                                            {claim.customer_phone && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 text-[11px]">Customer Phone:</span>
                                                    <a 
                                                        href={`tel:${claim.customer_phone}`} 
                                                        className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                                    >
                                                        <Phone className="w-3 h-3" />
                                                        <span>{claim.customer_phone}</span>
                                                    </a>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                                                <span>Submitted:</span>
                                                <span>{new Date(claim.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                        <button
                                            onClick={() => handleApproveClaim(claim)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Approve & Credit</span>
                                        </button>
                                        <button
                                            onClick={() => handleRejectClaim(claim)}
                                            className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-all cursor-pointer"
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

            {/* TAB 2: DEBTORS & BALANCE RECOVERY */}
            {activeTab === 'debtors' && (
                <div className="space-y-4">
                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={debtorSearch}
                                onChange={(e) => setDebtorSearch(e.target.value)}
                                placeholder="Filter debtor accounts by customer name, phone, or order #..."
                                className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                            <button
                                onClick={() => setDebtorFilter('all')}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    debtorFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                All Debtors ({allDebtors.length})
                            </button>
                            <button
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
                                onClick={() => setDebtorFilter('pending')}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    debtorFilter === 'pending'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                0 Paid ({completelyUnpaidDebtors.length})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Order #</th>
                                        <th className="py-3.5 px-4">Customer</th>
                                        <th className="py-3.5 px-4">Phone</th>
                                        <th className="py-3.5 px-4 text-right">Order Total</th>
                                        <th className="py-3.5 px-4 text-right">Amount Paid</th>
                                        <th className="py-3.5 px-4 text-right">Balance Due</th>
                                        <th className="py-3.5 px-4 text-center">Payment State</th>
                                        <th className="py-3.5 px-4 text-right">Quick Follow-Up</th>
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
                                                No matching debtor accounts found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDebtors.map(debtor => (
                                            <tr key={debtor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    <Link 
                                                        href={`/dashboard/admin/orders/${debtor.id}`}
                                                        className="hover:underline flex items-center gap-1.5"
                                                    >
                                                        <span>#{debtor.order_number}</span>
                                                        <ExternalLink className="w-3 h-3 text-slate-400" />
                                                    </Link>
                                                </td>
                                                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                                                    {debtor.customer?.name || 'Guest'}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {debtor.phone ? (
                                                        <a href={`tel:${debtor.phone}`} className="hover:underline text-emerald-600 dark:text-emerald-400">
                                                            {debtor.phone}
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400">No phone</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    GH₵ {Number(debtor.total).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                    GH₵ {Number(debtor.amount_paid).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                                                    GH₵ {Number(debtor.balance_due).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    {Number(debtor.amount_paid) > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                            Partially Paid
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                            Pending Payment
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <a
                                                            href={generateDebtorWhatsAppLink(debtor)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors shadow-2xs"
                                                            title="Send WhatsApp Payment Reminder"
                                                        >
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>WhatsApp</span>
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
                    <div className="p-6 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-600 block">
                                Direct Factory Sourcing Manifest (Guangzhou / 1688)
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold font-mono mt-1">
                                {totalUnitsToProcure} Total Units Required Across {consolidatedSourcingItems.length} Products
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-xl">
                                Consolidated procurement tally from all active pre-orders with verified deposits. Formatted for forwarders and 1688 purchasing agents.
                            </p>
                        </div>
                        <button
                            onClick={() => handleCopy(generateSourcingManifestText())}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 text-xs font-bold cursor-pointer transition-colors shrink-0"
                        >
                            <Copy className="w-4 h-4" />
                            <span>{copiedTxn ? 'Copied Sourcing Manifest' : 'Copy Sourcing Manifest'}</span>
                        </button>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">#</th>
                                        <th className="py-3.5 px-4">Product Name</th>
                                        <th className="py-3.5 px-4 text-center">Quantity to Procure</th>
                                        <th className="py-3.5 px-4">Customer Orders Requiring Item</th>
                                        <th className="py-3.5 px-4 text-right">Estimated Order Value</th>
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
                                                <td className="py-3.5 px-4 font-mono text-slate-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                                                    {item.name}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-xs">
                                                        {item.quantity} pcs
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {item.orders.map(o => '#' + o).join(', ')}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
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
                <div className="max-w-xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Hubtel Manual Payment Reconciliation
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Directly query Hubtel API using Transaction ID or Client Reference to credit an order.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleForceSync} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                                syncResult.success 
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                                {syncResult.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                <span>{syncResult.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSyncing}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                        >
                            {isSyncing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Querying Hubtel Gateway...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4" />
                                    <span>Live Verify & Credit Payment</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 5: CLAIMS AUDIT HISTORY */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Filter audit history by order number, transaction ID, or phone..."
                            className="w-full text-xs px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                        />
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Order #</th>
                                        <th className="py-3.5 px-4">Transaction ID</th>
                                        <th className="py-3.5 px-4">Customer Phone</th>
                                        <th className="py-3.5 px-4 text-right">Amount Claimed</th>
                                        <th className="py-3.5 px-4 text-center">Status</th>
                                        <th className="py-3.5 px-4">Resolved By</th>
                                        <th className="py-3.5 px-4 text-right">Resolved Date</th>
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
                                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    #{claim.order_number}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.transaction_id}
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                                                    {claim.customer_phone || '-'}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono font-semibold">
                                                    GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        claim.status === 'MATCHED'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500">
                                                    {claim.resolved_by || 'Admin Concierge'}
                                                </td>
                                                <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
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

            {/* TAB 6: WHATSAPP DISPATCH STUDIO */}
            {activeTab === 'whatsapp' && (
                <div className="max-w-xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Miss London WhatsApp Dispatch Studio
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Generate pre-formatted professional operational updates for customers.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Broadcast Notification Template
                        </label>
                        <select
                            value={waTemplate}
                            onChange={(e) => setWaTemplate(e.target.value as any)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="balance_reminder">Outstanding Balance Reminder</option>
                            <option value="payment_received">Payment Received Confirmation</option>
                            <option value="china_shipped">Dispatched from China Factory (Guangzhou)</option>
                            <option value="accra_arrived">Arrived at Accra Central Hub (Ready for Delivery)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Launch WhatsApp Chat with Pre-Filled Message</span>
                    </a>
                </div>
            )}
        </div>
    );
}
