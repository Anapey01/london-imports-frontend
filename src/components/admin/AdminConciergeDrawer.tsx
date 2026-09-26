'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    X, 
    ShieldCheck, 
    RefreshCw, 
    Check, 
    AlertCircle, 
    MessageCircle, 
    Phone, 
    ExternalLink, 
    Copy, 
    Search, 
    Send,
    Truck,
    Package,
    CreditCard
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

interface CopilotMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    actionRedirectTab?: 'debtors' | 'sourcing';
}

export default function AdminConciergeDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'copilot' | 'debtors' | 'sourcing' | 'claims' | 'sync' | 'whatsapp'>('copilot');

    const [avatarError, setAvatarError] = useState(false);

    // USSD Claims State
    const [claims, setClaims] = useState<USSDClaim[]>([]);
    const [isLoadingClaims, setIsLoadingClaims] = useState(false);

    // Orders & Debtors State
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [debtorFilter, setDebtorFilter] = useState<'all' | 'partial' | 'pending'>('all');
    const [debtorSearch, setDebtorSearch] = useState('');

    // Stats State
    const [adminStats, setAdminStats] = useState<any>(null);

    // Copilot State
    const [copilotInput, setCopilotInput] = useState('');
    const [isCopilotTyping, setIsCopilotTyping] = useState(false);
    const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello Administrator. I am Miss London, your store operations concierge. How may I assist you with order audits, customer debt recovery, China sourcing consolidation, or Hubtel payment verification today?"
        }
    ]);
    const chatScrollRef = useRef<HTMLDivElement>(null);

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

    // Clipboard Feedback
    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

    // Data fetching (only triggered on open or explicit refresh to prevent background INP lag)
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

    const fetchStats = useCallback(async () => {
        try {
            const res = await adminAPI.stats();
            if (res.data) {
                setAdminStats(res.data);
            }
        } catch {
            // Silently fallback
        }
    }, []);

    // Initial load when drawer opens
    useEffect(() => {
        if (isOpen) {
            fetchClaims();
            fetchOrders();
            fetchStats();
        }
    }, [isOpen, fetchClaims, fetchOrders, fetchStats]);

    // Background claims badge polling ONLY (lightweight)
    useEffect(() => {
        const interval = setInterval(fetchClaims, 45000);
        return () => clearInterval(interval);
    }, [fetchClaims]);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-admin-concierge', handleOpen);
        return () => window.removeEventListener('open-admin-concierge', handleOpen);
    }, []);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [copilotMessages, isCopilotTyping]);

    // Memoized computations to prevent frame blocking and INP spikes
    const pendingClaims = useMemo(() => 
        claims.filter(c => c.status === 'PENDING_AUDIT'),
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

    // China Sourcing Consolidation calculation (memoized)
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

    // Copilot Query Processor
    const handleCopilotSubmit = useCallback((queryText?: string) => {
        const query = (queryText || copilotInput).trim();
        if (!query) return;

        const userMsg: CopilotMessage = {
            id: String(Date.now()),
            role: 'user',
            content: query
        };
        setCopilotMessages(prev => [...prev, userMsg]);
        setCopilotInput('');
        setIsCopilotTyping(true);

        const lower = query.toLowerCase();

        setTimeout(() => {
            setIsCopilotTyping(false);

            if (lower.includes('unpaid') || lower.includes('debt') || lower.includes('balance') || lower.includes('owe') || lower.includes('partially paid')) {
                const topAccounts = allDebtors.slice(0, 4).map(d => 
                    `• #${d.order_number}: ${d.customer?.name || 'Customer'} — GH₵ ${Number(d.balance_due).toFixed(2)} due (Paid: GH₵ ${Number(d.amount_paid).toFixed(2)})`
                ).join('\n');

                setCopilotMessages(prev => [
                    ...prev,
                    {
                        id: String(Date.now() + 1),
                        role: 'assistant',
                        content: `Outstanding Debt Audit:\nFound ${allDebtors.length} accounts with pending balance, totaling GH₵ ${totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\n${topAccounts}\n\nSwitch to the Debtors tab to send instant WhatsApp reminders.`,
                        actionRedirectTab: 'debtors'
                    }
                ]);
                return;
            }

            if (lower.includes('china') || lower.includes('sourcing') || lower.includes('manifest') || lower.includes('factory') || lower.includes('procure')) {
                const topItems = consolidatedSourcingItems.slice(0, 4).map(item => 
                    `• ${item.name}: ${item.quantity} units (Orders: ${item.orders.slice(0, 2).map(o => '#' + o).join(', ')})`
                ).join('\n');

                setCopilotMessages(prev => [
                    ...prev,
                    {
                        id: String(Date.now() + 1),
                        role: 'assistant',
                        content: `China Procurement Summary:\nTotal: ${totalUnitsToProcure} units across ${consolidatedSourcingItems.length} products ready for consolidation in Guangzhou.\n\n${topItems}\n\nSwitch to the China Sourcing tab to copy the full manifest.`,
                        actionRedirectTab: 'sourcing'
                    }
                ]);
                return;
            }

            if (lower.includes('revenue') || lower.includes('stat') || lower.includes('today') || lower.includes('batch')) {
                const totalRev = adminStats?.stats?.total_revenue || 0;
                const batchInfo = adminStats?.stats?.active_batch;
                setCopilotMessages(prev => [
                    ...prev,
                    {
                        id: String(Date.now() + 1),
                        role: 'assistant',
                        content: `Store Telemetry:\n• Total Verified Revenue: GH₵ ${Number(totalRev).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• Active Batch: ${batchInfo ? `${batchInfo.name} (${batchInfo.days_left} days left)` : 'Standard open'}\n• Unresolved USSD Claims: ${pendingClaims.length}\n• Total Outstanding Debt: GH₵ ${totalOutstandingDebt.toFixed(2)} across ${allDebtors.length} orders.`
                    }
                ]);
                return;
            }

            // Customer or order number lookup
            const match = orders.find(o => 
                o.order_number.toLowerCase().includes(lower) || 
                (o.phone && o.phone.includes(query)) ||
                (o.customer?.name && o.customer.name.toLowerCase().includes(lower))
            );

            if (match) {
                setCopilotMessages(prev => [
                    ...prev,
                    {
                        id: String(Date.now() + 1),
                        role: 'assistant',
                        content: `Order Lookup Found:\n• Order #${match.order_number}\n• Customer: ${match.customer?.name || 'Customer'} (${match.phone || 'No phone'})\n• Status: ${match.status}\n• Total: GH₵ ${Number(match.total).toFixed(2)}\n• Amount Paid: GH₵ ${Number(match.amount_paid).toFixed(2)}\n• Balance Due: GH₵ ${Number(match.balance_due).toFixed(2)}`
                    }
                ]);
                return;
            }

            setCopilotMessages(prev => [
                ...prev,
                {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: "Operations assistant ready. Ask to audit unpaid balances, summarize the China sourcing queue, review verified revenue, or enter any customer phone number or order number for instant verification."
                }
            ]);
        }, 300);
    }, [copilotInput, allDebtors, totalOutstandingDebt, consolidatedSourcingItems, totalUnitsToProcure, adminStats, pendingClaims.length, orders]);

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

    return (
        <>
            {/* Floating Admin Pill Button */}
            <div className="fixed bottom-6 right-6 z-[60] print:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-800 dark:border-slate-200 shadow-xl hover:bg-slate-900 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Open Miss London Admin Concierge"
                >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-900 border border-slate-700/60 shrink-0 flex items-center justify-center">
                        {!avatarError ? (
                            <Image
                                src="/logo.jpg"
                                alt="Miss London"
                                fill
                                sizes="24px"
                                className="object-cover object-top"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <span className="text-[9px] font-mono font-bold text-white">ML</span>
                        )}
                    </div>
                    <span className="text-xs font-semibold tracking-wide">
                        Miss London
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-slate-800 dark:bg-slate-200 px-1.5 py-0.5 rounded text-slate-300 dark:text-slate-700 font-bold">
                        OPS
                    </span>

                    {pendingClaims.length > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-950 text-[10px] font-bold font-mono">
                            {pendingClaims.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Slide-over Drawer Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Drawer Content Window */}
                    <div className="relative w-full sm:w-[480px] h-[100dvh] max-h-[100dvh] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden">
                        
                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60 flex items-center justify-center">
                                    {!avatarError ? (
                                        <Image
                                            src="/logo.jpg"
                                            alt="Miss London"
                                            fill
                                            sizes="32px"
                                            className="object-cover object-top"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <span className="text-xs font-mono font-bold text-white">ML</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                            Miss London
                                        </h3>
                                        <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                            OPERATIONS
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                        Debt Recovery • Sourcing • USSD Claims
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                aria-label="Close Miss London"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium overflow-x-auto no-scrollbar flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab('copilot')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                    activeTab === 'copilot'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                Copilot
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('debtors')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === 'debtors'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                <span>Debtors</span>
                                {allDebtors.length > 0 && (
                                    <span className="font-mono text-[10px] text-slate-500">
                                        ({allDebtors.length})
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('sourcing')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                    activeTab === 'sourcing'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                China Sourcing
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('claims')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === 'claims'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                <span>USSD Claims</span>
                                {pendingClaims.length > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[9px] font-bold font-mono">
                                        {pendingClaims.length}
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('sync')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                    activeTab === 'sync'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                Reconcile
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('whatsapp')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                    activeTab === 'whatsapp'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                WhatsApp
                            </button>
                        </div>

                        {/* Body Area */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                            
                            {/* TAB 1: COPILOT CONVERSATION */}
                            {activeTab === 'copilot' && (
                                <div className="flex flex-col h-full space-y-3">
                                    {/* Action Chips */}
                                    <div className="flex flex-wrap gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleCopilotSubmit("Audit unpaid balances and debtors")}
                                            className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                                        >
                                            Audit Debtors
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCopilotSubmit("Consolidate China sourcing queue")}
                                            className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                                        >
                                            China Sourcing Queue
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCopilotSubmit("Show revenue and active batch stats")}
                                            className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                                        >
                                            Today&apos;s Revenue & Batch
                                        </button>
                                    </div>

                                    {/* Messages Window */}
                                    <div 
                                        ref={chatScrollRef}
                                        className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1"
                                    >
                                        {copilotMessages.map(msg => (
                                            <div 
                                                key={msg.id}
                                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[92%] text-xs leading-relaxed p-3.5 rounded-lg whitespace-pre-line ${
                                                        msg.role === 'user'
                                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium'
                                                            : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                                                    }`}
                                                >
                                                    {msg.content}

                                                    {msg.actionRedirectTab && (
                                                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveTab(msg.actionRedirectTab!)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-[11px] font-semibold transition-colors cursor-pointer"
                                                            >
                                                                <span>Open {msg.actionRedirectTab === 'debtors' ? 'Debtors Hub' : 'China Sourcing'}</span>
                                                                <span className="font-mono">→</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {isCopilotTyping && (
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                                                Querying store data...
                                            </div>
                                        )}
                                    </div>

                                    {/* Pinned Input Bar */}
                                    <form 
                                        onSubmit={(e) => { e.preventDefault(); handleCopilotSubmit(); }}
                                        className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 shrink-0"
                                    >
                                        <input
                                            type="text"
                                            value={copilotInput}
                                            onChange={(e) => setCopilotInput(e.target.value)}
                                            placeholder="Ask Miss London or enter phone / order #..."
                                            className="flex-1 text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!copilotInput.trim()}
                                            className="px-3.5 py-2.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer shrink-0"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* TAB 2: DEBTORS HUB */}
                            {activeTab === 'debtors' && (
                                <div className="space-y-4">
                                    {/* Monochrome KPI summary */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                                Outstanding Debt
                                            </span>
                                            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                                                GH₵ {totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                                Debtor Accounts
                                            </span>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                                                    {allDebtors.length}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    ({partiallyPaidDebtors.length} partial)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search & Filter Controls */}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                                            <input
                                                type="text"
                                                value={debtorSearch}
                                                onChange={(e) => setDebtorSearch(e.target.value)}
                                                placeholder="Search by order #, phone, or name..."
                                                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[11px]">
                                            <button
                                                type="button"
                                                onClick={() => setDebtorFilter('all')}
                                                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                                    debtorFilter === 'all'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                All ({allDebtors.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDebtorFilter('partial')}
                                                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                                    debtorFilter === 'partial'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                Partially Paid ({partiallyPaidDebtors.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDebtorFilter('pending')}
                                                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                                    debtorFilter === 'pending'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                Unpaid ({completelyUnpaidDebtors.length})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Un-fragmented Clean Debtor Cards */}
                                    <div className="space-y-2.5">
                                        {isLoadingOrders ? (
                                            <div className="p-8 text-center text-xs text-slate-400">
                                                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                                                <span>Loading debtor accounts...</span>
                                            </div>
                                        ) : filteredDebtors.length === 0 ? (
                                            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                <ShieldCheck className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">No matching balances</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">All customer balances cleared for this criteria.</p>
                                            </div>
                                        ) : (
                                            filteredDebtors.map(debtor => (
                                                <div
                                                    key={debtor.id}
                                                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs"
                                                >
                                                    {/* Row 1: Order # & Balance Due */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                                #{debtor.order_number}
                                                            </span>
                                                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                                {Number(debtor.amount_paid) > 0 ? 'Partially Paid' : 'Unpaid'}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                            Due: GH₵ {Number(debtor.balance_due).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Row 2: Customer & Financials (Single Clean Line) */}
                                                    <div className="text-[11px] flex items-center justify-between text-slate-500">
                                                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                                                            {debtor.customer?.name || 'Customer'}
                                                            {debtor.phone ? ` • ${debtor.phone}` : ''}
                                                        </span>
                                                        <span className="font-mono shrink-0">
                                                            Paid: GH₵ {Number(debtor.amount_paid).toFixed(2)} / GH₵ {Number(debtor.total).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Row 3: Actions */}
                                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                                        <a
                                                            href={getDebtorWhatsAppUrl(debtor)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-medium transition-colors"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>Send WhatsApp Reminder</span>
                                                        </a>
                                                        {debtor.phone && (
                                                            <a
                                                                href={`tel:${debtor.phone}`}
                                                                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                title="Call Customer"
                                                            >
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        <Link
                                                            href={`/dashboard/admin/orders/${debtor.id}`}
                                                            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="View Order Details"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: CHINA SOURCING CONSOLIDATOR */}
                            {activeTab === 'sourcing' && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                                                Factory Consolidation
                                            </span>
                                            <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                                                {totalUnitsToProcure} Total Units Required
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(sourcingManifestString, 'Sourcing Manifest')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>{copiedLabel === 'Sourcing Manifest' ? 'Copied' : 'Copy Manifest'}</span>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                            Consolidated Items ({consolidatedSourcingItems.length})
                                        </span>

                                        {consolidatedSourcingItems.length === 0 ? (
                                            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                <Package className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">No active items</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">All pre-orders consolidated or processed.</p>
                                            </div>
                                        ) : (
                                            consolidatedSourcingItems.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                                                >
                                                    <div className="min-w-0 pr-3">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {item.name}
                                                        </h4>
                                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                                            Orders: {item.orders.map(o => '#' + o).join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700">
                                                            {item.quantity} pcs
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: USSD CLAIMS */}
                            {activeTab === 'claims' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Customer claims from *713*7453#</span>
                                        <button 
                                            type="button"
                                            onClick={fetchClaims} 
                                            disabled={isLoadingClaims}
                                            className="hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${isLoadingClaims ? 'animate-spin' : ''}`} />
                                            <span>Refresh</span>
                                        </button>
                                    </div>

                                    {pendingClaims.length === 0 ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                            <ShieldCheck className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">All claims reconciled</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">No offline claims requiring review.</p>
                                        </div>
                                    ) : (
                                        pendingClaims.map(claim => (
                                            <div 
                                                key={claim.id} 
                                                className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900 space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                        #{claim.order_number}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                        Claim: GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                    </span>
                                                </div>

                                                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center justify-between">
                                                        <span>Hubtel Txn ID:</span>
                                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{claim.transaction_id}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Order Balance:</span>
                                                        <span className="font-mono">GH₵ {Number(claim.order_balance).toFixed(2)}</span>
                                                    </div>
                                                    {claim.customer_phone && (
                                                        <div className="flex items-center justify-between">
                                                            <span>Phone:</span>
                                                            <a href={`tel:${claim.customer_phone}`} className="hover:underline font-mono">
                                                                {claim.customer_phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApproveClaim(claim)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Approve & Credit</span>
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
                                        ))
                                    )}
                                </div>
                            )}

                            {/* TAB 5: MANUAL RECONCILE */}
                            {activeTab === 'sync' && (
                                <form onSubmit={handleForceSync} className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Query Hubtel directly by Transaction ID or Client Reference to credit an order.
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Order Number
                                        </label>
                                        <input
                                            type="text"
                                            value={syncOrderNumber}
                                            onChange={(e) => setSyncOrderNumber(e.target.value)}
                                            placeholder="e.g. LI-20260921-87841"
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Hubtel Transaction ID or Client Reference
                                        </label>
                                        <input
                                            type="text"
                                            value={syncTxnId}
                                            onChange={(e) => setSyncTxnId(e.target.value)}
                                            placeholder="e.g. 90263045181"
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 font-mono"
                                            required
                                        />
                                    </div>

                                    {syncResult && (
                                        <div className="p-3 rounded-md text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                                            {syncResult.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSyncing}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span>{isSyncing ? 'Verifying...' : 'Verify & Credit Payment'}</span>
                                    </button>
                                </form>
                            )}

                            {/* TAB 6: WHATSAPP GENERATOR */}
                            {activeTab === 'whatsapp' && (
                                <div className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Generate standardized customer notification messages.
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Template
                                        </label>
                                        <select
                                            value={waTemplate}
                                            onChange={(e) => setWaTemplate(e.target.value as any)}
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                                        >
                                            <option value="balance_reminder">Outstanding Balance Reminder</option>
                                            <option value="payment_received">Payment Received Confirmation</option>
                                            <option value="china_shipped">Dispatched from China Factory</option>
                                            <option value="accra_arrived">Arrived at Accra Hub</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                value={waCustomerName}
                                                onChange={(e) => setWaCustomerName(e.target.value)}
                                                placeholder="e.g. Gabriel"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={waCustomerPhone}
                                                onChange={(e) => setWaCustomerPhone(e.target.value)}
                                                placeholder="024XXXXXXX"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Order Number
                                            </label>
                                            <input
                                                type="text"
                                                value={waOrderNumber}
                                                onChange={(e) => setWaOrderNumber(e.target.value)}
                                                placeholder="LI-2026..."
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Balance (GH₵)
                                            </label>
                                            <input
                                                type="text"
                                                value={waBalanceDue}
                                                onChange={(e) => setWaBalanceDue(e.target.value)}
                                                placeholder="e.g. 7.00"
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <a
                                        href={getCustomWhatsAppUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold transition-colors"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Launch WhatsApp Chat</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
                            <span>Miss London Operations</span>
                            <span className="font-mono">London&apos;s Imports</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
