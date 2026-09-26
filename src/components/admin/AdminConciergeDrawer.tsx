'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    X, 
    ShieldCheck, 
    RefreshCw, 
    Check, 
    AlertCircle, 
    MessageCircle, 
    ArrowRight, 
    Send,
    Phone,
    CreditCard,
    Sparkles,
    Copy,
    ExternalLink,
    Search,
    Package,
    TrendingUp,
    Truck,
    Clock,
    DollarSign
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
    actionType?: 'debtors' | 'sourcing' | 'stats' | 'order';
    payload?: any;
}

export default function AdminConciergeDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'copilot' | 'debtors' | 'sourcing' | 'claims' | 'sync' | 'whatsapp'>('copilot');

    // Avatar error state for bulletproof fallback
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
            content: "Hello Administrator, I am Miss London, your store operations concierge. How may I assist you with orders, outstanding customer balances, China sourcing batches, or offline Hubtel claims today?"
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
    const [waTemplate, setWaTemplate] = useState<'payment_received' | 'china_shipped' | 'accra_arrived' | 'balance_reminder'>('balance_reminder');

    // Clipboard Feedback
    const [copiedText, setCopiedText] = useState<string | null>(null);

    // Fetch pending claims
    const fetchClaims = useCallback(async () => {
        setIsLoadingClaims(true);
        try {
            const res = await adminAPI.getUSSDClaims();
            if (res.data?.claims) {
                setClaims(res.data.claims);
            }
        } catch {
            // Graceful fallback
        } finally {
            setIsLoadingClaims(false);
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
            // Graceful fallback
        } finally {
            setIsLoadingOrders(false);
        }
    }, []);

    // Fetch stats
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

    useEffect(() => {
        fetchClaims();
        fetchOrders();
        fetchStats();
        const interval = setInterval(() => {
            fetchClaims();
            fetchOrders();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchClaims, fetchOrders, fetchStats]);

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

    const pendingClaims = claims.filter(c => c.status === 'PENDING_AUDIT');

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

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2500);
    };

    // Copilot Query Handler
    const handleCopilotSubmit = async (queryText?: string) => {
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

            // 1. Audit Unpaid Balances
            if (lower.includes('unpaid') || lower.includes('debt') || lower.includes('balance') || lower.includes('owe') || lower.includes('partially paid')) {
                const assistantMsg: CopilotMessage = {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: `I have audited our order books. There are currently ${allDebtors.length} orders with an outstanding balance, totaling GH₵ ${totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Of these, ${partiallyPaidDebtors.length} have paid partial deposits. Below are the priority accounts requiring follow-up:`,
                    actionType: 'debtors',
                    payload: allDebtors.slice(0, 5)
                };
                setCopilotMessages(prev => [...prev, assistantMsg]);
                return;
            }

            // 2. China Sourcing Consolidation
            if (lower.includes('china') || lower.includes('sourcing') || lower.includes('manifest') || lower.includes('factory') || lower.includes('procure') || lower.includes('1688') || lower.includes('guangzhou')) {
                const assistantMsg: CopilotMessage = {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: `Here is the current China procurement summary. We have ${totalUnitsToProcure} total units across ${consolidatedSourcingItems.length} unique products ready for factory procurement and consolidation in Guangzhou:`,
                    actionType: 'sourcing',
                    payload: consolidatedSourcingItems.slice(0, 6)
                };
                setCopilotMessages(prev => [...prev, assistantMsg]);
                return;
            }

            // 3. Today's Revenue & Stats
            if (lower.includes('revenue') || lower.includes('stat') || lower.includes('today') || lower.includes('sales') || lower.includes('batch')) {
                const totalRev = adminStats?.stats?.total_revenue || 0;
                const batchInfo = adminStats?.stats?.active_batch;
                const assistantMsg: CopilotMessage = {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: `Platform Overview:\n• Verified Revenue: GH₵ ${Number(totalRev).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• Active Batch: ${batchInfo ? `${batchInfo.name} (${batchInfo.days_left} days remaining)` : 'Standard sea freight batch open'}\n• Pending USSD Claims: ${pendingClaims.length}\n• Total Debtors: ${allDebtors.length} accounts (GH₵ ${totalOutstandingDebt.toFixed(2)})`,
                    actionType: 'stats'
                };
                setCopilotMessages(prev => [...prev, assistantMsg]);
                return;
            }

            // 4. Order or Customer Lookup
            const foundOrder = orders.find(o => 
                o.order_number.toLowerCase().includes(lower) || 
                (o.phone && o.phone.includes(query)) ||
                (o.customer?.name && o.customer.name.toLowerCase().includes(lower))
            );

            if (foundOrder) {
                const assistantMsg: CopilotMessage = {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: `Found matching order #${foundOrder.order_number} for customer ${foundOrder.customer?.name || 'Guest'}. Status: ${foundOrder.status}. Amount Paid: GH₵ ${Number(foundOrder.amount_paid).toFixed(2)}, Balance Due: GH₵ ${Number(foundOrder.balance_due).toFixed(2)}.`,
                    actionType: 'order',
                    payload: foundOrder
                };
                setCopilotMessages(prev => [...prev, assistantMsg]);
                return;
            }

            // 5. Default General Response
            const assistantMsg: CopilotMessage = {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: `Understood. I am monitoring all incoming customer payments, USSD claims from *713*7453#, outstanding balances, and China factory batch consolidation. You can ask me to "Audit unpaid balances", "Check China sourcing queue", "Review today's revenue", or look up any customer by phone number.`
            };
            setCopilotMessages(prev => [...prev, assistantMsg]);
        }, 500);
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

    return (
        <>
            {/* Floating Admin Miss London Button */}
            <div className="fixed bottom-6 right-6 z-[60] print:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-800 dark:border-slate-200 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label="Open Miss London Admin Concierge"
                    title="Miss London Admin Concierge"
                >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-900 border border-slate-700/60 shrink-0 flex items-center justify-center">
                        {!avatarError ? (
                            <Image
                                src="/logo.jpg"
                                alt="Miss London"
                                fill
                                sizes="28px"
                                className="object-cover object-top"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <span className="text-[10px] font-black text-white">ML</span>
                        )}
                    </div>
                    <span className="text-xs font-semibold tracking-wide hidden sm:inline">
                        Miss London
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 dark:bg-slate-200 px-1.5 py-0.5 rounded text-slate-300 dark:text-slate-700 font-bold">
                        AI Ops
                    </span>

                    {/* Pending Claims Notification Badge */}
                    {pendingClaims.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                            {pendingClaims.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Slide-over Drawer Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60 shadow-xs flex items-center justify-center">
                                    {!avatarError ? (
                                        <Image
                                            src="/logo.jpg"
                                            alt="Miss London"
                                            fill
                                            sizes="36px"
                                            className="object-cover object-top"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <span className="text-xs font-black text-white">ML</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Miss London</h3>
                                        <span className="text-[9px] font-bold tracking-widest uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-1.5 py-0.5 rounded font-mono">
                                            AI Operations Copilot
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Debt Recovery • Sourcing Consolidator • USSD Claims
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] font-medium overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('copilot')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'copilot'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Copilot</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('debtors')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'debtors'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>Debtors</span>
                                {allDebtors.length > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                                        {allDebtors.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('sourcing')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'sourcing'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Truck className="w-3.5 h-3.5" />
                                <span>China Sourcing</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('claims')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'claims'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>USSD Claims</span>
                                {pendingClaims.length > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                                        {pendingClaims.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('sync')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'sync'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>Reconcile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('whatsapp')}
                                className={`py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'whatsapp'
                                        ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>WhatsApp</span>
                            </button>
                        </div>

                        {/* Body Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* TAB 1: COPILOT AI OPERATIONS */}
                            {activeTab === 'copilot' && (
                                <div className="flex flex-col h-full space-y-3">
                                    {/* Quick Operational Action Chips */}
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                            Quick Operational Queries
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleCopilotSubmit("Audit unpaid balances and debtors")}
                                                className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
                                            >
                                                Audit Unpaid Balances
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopilotSubmit("Consolidate China sourcing queue")}
                                                className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
                                            >
                                                China Sourcing Queue
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopilotSubmit("Show revenue and active batch stats")}
                                                className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
                                            >
                                                Today&apos;s Revenue & Batch
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chat Messages Log */}
                                    <div 
                                        ref={chatScrollRef}
                                        className="flex-1 min-h-[300px] max-h-[460px] overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80"
                                    >
                                        {copilotMessages.map(msg => (
                                            <div 
                                                key={msg.id}
                                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[90%] text-xs leading-relaxed p-3 rounded-xl whitespace-pre-line ${
                                                        msg.role === 'user'
                                                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-tr-xs shadow-xs'
                                                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs'
                                                    }`}
                                                >
                                                    {msg.content}

                                                    {/* Debtor Action Cards inside Copilot */}
                                                    {msg.actionType === 'debtors' && Array.isArray(msg.payload) && (
                                                        <div className="mt-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                                                            {msg.payload.map((d: AdminOrder) => (
                                                                <div key={d.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                                                                    <div className="flex items-center justify-between font-bold">
                                                                        <span className="font-mono">#{d.order_number}</span>
                                                                        <span className="text-amber-600 dark:text-amber-400">
                                                                            Balance: GH₵ {Number(d.balance_due).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-slate-500 flex items-center justify-between text-[10px]">
                                                                        <span>{d.customer?.name || 'Customer'}</span>
                                                                        <span>Paid: GH₵ {Number(d.amount_paid).toFixed(2)}</span>
                                                                    </div>
                                                                    {d.phone && (
                                                                        <div className="pt-1 flex items-center gap-2">
                                                                            <a
                                                                                href={generateDebtorWhatsAppLink(d)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium"
                                                                            >
                                                                                <MessageCircle className="w-2.5 h-2.5" />
                                                                                <span>WhatsApp Reminder</span>
                                                                            </a>
                                                                            <Link
                                                                                href={`/dashboard/admin/orders/${d.id}`}
                                                                                className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                                            >
                                                                                <span>View Order</span>
                                                                                <ArrowRight className="w-2.5 h-2.5" />
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => setActiveTab('debtors')}
                                                                className="w-full py-1 text-center text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium hover:underline cursor-pointer"
                                                            >
                                                                View all {allDebtors.length} debtors in Debtors Hub →
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Sourcing Action Cards inside Copilot */}
                                                    {msg.actionType === 'sourcing' && Array.isArray(msg.payload) && (
                                                        <div className="mt-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
                                                            {msg.payload.map((item, idx) => (
                                                                <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                                                                    <span className="truncate pr-2 font-medium">{item.name}</span>
                                                                    <span className="font-mono font-bold shrink-0">{item.quantity} units</span>
                                                                </div>
                                                            ))}
                                                            <div className="pt-2 flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleCopy(generateSourcingManifestText(), 'Copilot Manifest')}
                                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold cursor-pointer"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                    <span>{copiedText === 'Copilot Manifest' ? 'Copied to Clipboard' : 'Copy Full Manifest'}</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => setActiveTab('sourcing')}
                                                                    className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-medium"
                                                                >
                                                                    Open Sourcing Tab
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {isCopilotTyping && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-100" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-200" />
                                                <span className="text-[11px]">Miss London is querying store records...</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input Form */}
                                    <form 
                                        onSubmit={(e) => { e.preventDefault(); handleCopilotSubmit(); }}
                                        className="flex items-center gap-2 pt-1"
                                    >
                                        <input
                                            type="text"
                                            value={copilotInput}
                                            onChange={(e) => setCopilotInput(e.target.value)}
                                            placeholder="Ask Miss London or enter customer phone / order #..."
                                            className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-200"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!copilotInput.trim()}
                                            className="px-3 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* TAB 2: DEBTORS & BALANCE RECOVERY */}
                            {activeTab === 'debtors' && (
                                <div className="space-y-3.5">
                                    {/* Debt KPI Bar */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                                                Total Outstanding Debt
                                            </span>
                                            <span className="text-base font-bold font-mono text-amber-800 dark:text-amber-300 mt-0.5 block">
                                                GH₵ {totalOutstandingDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                                Accounts with Balance
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                                                    {allDebtors.length}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    ({partiallyPaidDebtors.length} partial)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filters & Search */}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={debtorSearch}
                                                onChange={(e) => setDebtorSearch(e.target.value)}
                                                placeholder="Filter by order #, phone, or name..."
                                                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px]">
                                            <button
                                                onClick={() => setDebtorFilter('all')}
                                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                                    debtorFilter === 'all'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                All Debtors ({allDebtors.length})
                                            </button>
                                            <button
                                                onClick={() => setDebtorFilter('partial')}
                                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                                    debtorFilter === 'partial'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                Partially Paid ({partiallyPaidDebtors.length})
                                            </button>
                                            <button
                                                onClick={() => setDebtorFilter('pending')}
                                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                                    debtorFilter === 'pending'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                0 Paid ({completelyUnpaidDebtors.length})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Debtors List */}
                                    <div className="space-y-2.5">
                                        {isLoadingOrders ? (
                                            <div className="p-8 text-center text-xs text-slate-400">
                                                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                                                <span>Loading debtor accounts...</span>
                                            </div>
                                        ) : filteredDebtors.length === 0 ? (
                                            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No matching balances</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">All customer balances cleared for this criteria.</p>
                                            </div>
                                        ) : (
                                            filteredDebtors.map(debtor => (
                                                <div
                                                    key={debtor.id}
                                                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                                #{debtor.order_number}
                                                            </span>
                                                            {Number(debtor.amount_paid) > 0 ? (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                                    Partially Paid
                                                                </span>
                                                            ) : (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                                    Unpaid
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">
                                                            Due: GH₵ {Number(debtor.balance_due).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="text-[11px] grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                                                        <div>
                                                            <span className="text-slate-400 block text-[10px]">Customer:</span>
                                                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                                                                {debtor.customer?.name || 'Guest'}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-slate-400 block text-[10px]">Paid / Total:</span>
                                                            <span className="font-mono">
                                                                GH₵ {Number(debtor.amount_paid).toFixed(2)} / GH₵ {Number(debtor.total).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                                                        <a
                                                            href={generateDebtorWhatsAppLink(debtor)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium active:scale-95 transition-all shadow-2xs"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>WhatsApp Reminder</span>
                                                        </a>
                                                        {debtor.phone && (
                                                            <a
                                                                href={`tel:${debtor.phone}`}
                                                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors"
                                                                title="Call Customer"
                                                            >
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        <Link
                                                            href={`/dashboard/admin/orders/${debtor.id}`}
                                                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors"
                                                            title="View Order in Admin"
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
                                <div className="space-y-3.5">
                                    <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 block">
                                                Guangzhou Factory Consolidation
                                            </span>
                                            <span className="text-base font-bold font-mono mt-0.5 block">
                                                {totalUnitsToProcure} Total Units Required
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(generateSourcingManifestText(), 'Sourcing Tab Manifest')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 text-xs font-semibold cursor-pointer transition-colors"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>{copiedText === 'Sourcing Tab Manifest' ? 'Copied' : 'Copy Manifest'}</span>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                            Consolidated Items by Product ({consolidatedSourcingItems.length})
                                        </span>

                                        {consolidatedSourcingItems.length === 0 ? (
                                            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                                <Package className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-80" />
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No active items</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">All pre-orders have been consolidated or completed.</p>
                                            </div>
                                        ) : (
                                            consolidatedSourcingItems.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                                                >
                                                    <div className="min-w-0 pr-3">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {item.name}
                                                        </h4>
                                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                                            Orders: {item.orders.map(o => '#' + o).join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white block">
                                                            {item.quantity} pcs
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: PENDING USSD CLAIMS */}
                            {activeTab === 'claims' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Customer claims from USSD *713*7453#</span>
                                        <button 
                                            onClick={fetchClaims} 
                                            disabled={isLoadingClaims}
                                            className="hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${isLoadingClaims ? 'animate-spin' : ''}`} />
                                            <span>Refresh</span>
                                        </button>
                                    </div>

                                    {pendingClaims.length === 0 ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All clear</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">No pending customer claims requiring review.</p>
                                        </div>
                                    ) : (
                                        pendingClaims.map(claim => (
                                            <div 
                                                key={claim.id} 
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-2xs"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                        #{claim.order_number}
                                                    </span>
                                                    <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-mono">
                                                        Claim: GH₵ {claim.claimed_amount ? Number(claim.claimed_amount).toFixed(2) : '1.00'}
                                                    </span>
                                                </div>

                                                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Hubtel Txn ID:</span>
                                                        <span className="font-mono font-semibold">{claim.transaction_id}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Order Balance:</span>
                                                        <span className="font-mono">GH₵ {Number(claim.order_balance).toFixed(2)}</span>
                                                    </div>
                                                    {claim.customer_phone && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-400">Customer Phone:</span>
                                                            <a href={`tel:${claim.customer_phone}`} className="hover:underline font-mono">
                                                                {claim.customer_phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveClaim(claim)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Approve & Credit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClaim(claim)}
                                                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-all cursor-pointer"
                                                    >
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* TAB 5: MANUAL FORCE SYNC */}
                            {activeTab === 'sync' && (
                                <form onSubmit={handleForceSync} className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Paste any Hubtel transaction ID or client reference to live-verify and credit to an order.
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
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 font-mono"
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
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 font-mono"
                                            required
                                        />
                                    </div>

                                    {syncResult && (
                                        <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
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
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        {isSyncing ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>Verifying with Hubtel...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-3.5 h-3.5" />
                                                <span>Verify & Reconcile Payment</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* TAB 6: WHATSAPP CUSTOMER COMMUNICATOR */}
                            {activeTab === 'whatsapp' && (
                                <div className="space-y-3.5">
                                    <div className="text-xs text-slate-500">
                                        Generate pre-formatted professional customer WhatsApp notifications.
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Notification Type
                                        </label>
                                        <select
                                            value={waTemplate}
                                            onChange={(e) => setWaTemplate(e.target.value as any)}
                                            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                                        >
                                            <option value="balance_reminder">Outstanding Balance Reminder</option>
                                            <option value="payment_received">Payment Received Confirmation</option>
                                            <option value="china_shipped">Dispatched from China Factory</option>
                                            <option value="accra_arrived">Arrived at Accra Hub & Balance Due</option>
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
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
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
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
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
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
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
                                                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <a
                                        href={generateWhatsAppLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold active:scale-95 transition-all shadow-xs"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Open WhatsApp Chat with Message</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-between">
                            <span>Miss London AI Operations Copilot</span>
                            <span className="font-mono">London&apos;s Imports Ghana</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
