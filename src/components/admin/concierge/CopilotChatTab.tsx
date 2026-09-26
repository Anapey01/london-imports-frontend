'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowRight, ExternalLink } from 'lucide-react';
import { AdminOrderData, computeDebtorMetrics, consolidateSourcingList } from '@/lib/concierge-utils';

export interface CopilotMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    actionRedirectTab?: 'debtors' | 'sourcing' | 'claims';
    quickReplies?: Array<{ label: string; query: string }>;
    actionLink?: { label: string; href: string };
    products?: Array<{ id: string; name: string; price: number; slug: string }>;
    orders?: Array<{ order_number: string; state_display: string; total: number; balance_due: number }>;
}

interface CopilotChatTabProps {
    orders: AdminOrderData[];
    pendingClaimsCount: number;
    onSwitchTab: (tab: 'debtors' | 'sourcing' | 'claims') => void;
}

export default function CopilotChatTab({ orders, pendingClaimsCount, onSwitchTab }: CopilotChatTabProps) {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<CopilotMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello Administrator. I am Miss London, your store operations concierge. How may I assist you with order audits, customer debt recovery, China sourcing consolidation, or Hubtel payment verification today?",
            quickReplies: [
                { label: "Summarize Debts", query: "Summarize outstanding debts" },
                { label: "China Sourcing", query: "Consolidate China sourcing" },
                { label: "Pending Claims", query: "Show pending Hubtel claims" }
            ]
        }
    ]);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || input).trim();
        if (!query || isTyping) return;

        const userMsg: CopilotMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: query
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Pre-compute real-time operational metrics for prompt & fallback
        const { allDebtors, partiallyPaid, totalOutstanding } = computeDebtorMetrics(orders);
        const { totalUnits, items: sourcingItems } = consolidateSourcingList(orders);

        // Format orders for assistant context
        const formattedOrders = orders.slice(0, 15).map(o => {
            const custName = typeof o.customer === 'string' ? o.customer : o.customer?.name || '';
            const orderItems = o.items || o.items_summary || [];
            return {
                id: o.id,
                order_number: o.order_number,
                state: o.state || o.status || 'PROCESSING',
                state_display: o.status || o.state || 'Processing',
                total: Number(o.total || 0),
                amount_paid: Number(o.amount_paid || 0),
                balance_due: Number(o.balance_due || 0),
                items_count: orderItems.reduce((acc, it) => acc + (it.quantity || 1), 0),
                items: orderItems.map(it => ({
                    name: (it.name || it.product_name || 'Product') + (custName ? ` (${custName})` : ''),
                    quantity: it.quantity || 1,
                    image: null
                }))
            };
        });

        const history = messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
        }));

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            let res: Response;
            try {
                res = await fetch('/api/assistant/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        message: query,
                        conversationHistory: history,
                        userName: 'Administrator',
                        isAuthenticated: true,
                        ordersContext: formattedOrders
                    })
                });
            } finally {
                clearTimeout(timeoutId);
            }

            if (res.ok) {
                const data = await res.json();

                // Determine contextual tab redirect if relevant
                let actionRedirectTab: 'debtors' | 'sourcing' | 'claims' | undefined;
                const lowerQ = query.toLowerCase();
                const lowerR = (data.reply || '').toLowerCase();

                if (lowerQ.includes('debt') || lowerQ.includes('balance') || lowerQ.includes('unpaid') || lowerQ.includes('owing') || lowerR.includes('outstanding balance')) {
                    actionRedirectTab = 'debtors';
                } else if (lowerQ.includes('sourcing') || lowerQ.includes('china') || lowerQ.includes('procure') || lowerR.includes('procurement') || lowerR.includes('sourcing')) {
                    actionRedirectTab = 'sourcing';
                } else if (lowerQ.includes('claim') || lowerQ.includes('audit') || lowerQ.includes('ussd') || lowerR.includes('claims audit')) {
                    actionRedirectTab = 'claims';
                }

                setMessages(prev => [
                    ...prev,
                    {
                        id: `asst-${Date.now()}`,
                        role: 'assistant',
                        content: data.reply || "Operations review complete.",
                        actionRedirectTab,
                        quickReplies: data.quickReplies,
                        actionLink: data.actionLink,
                        products: data.products,
                        orders: data.orders
                    }
                ]);
            } else {
                throw new Error('API returned non-200 status');
            }
        } catch {
            // Intelligent operational fallback using real computed data
            let fallbackContent = "I am Miss London, your store operations concierge. All systems are operational. You can ask me to inspect debtor balances, calculate China sourcing items, or audit pending payment claims.";
            let fallbackTab: 'debtors' | 'sourcing' | 'claims' | undefined;

            const lower = query.toLowerCase();
            if (lower.includes('debt') || lower.includes('balance') || lower.includes('unpaid') || lower.includes('owing')) {
                fallbackContent = `There are currently ${allDebtors.length} orders with outstanding balances totaling GH₵ ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\n• ${partiallyPaid.length} orders are partially paid.\n• ${allDebtors.length - partiallyPaid.length} orders are completely unpaid.\n\nYou can review each customer and send one-click WhatsApp payment reminders directly in the Debtors tab.`;
                fallbackTab = 'debtors';
            } else if (lower.includes('sourcing') || lower.includes('china') || lower.includes('procure') || lower.includes('items')) {
                fallbackContent = `Currently, there are ${totalUnits} total units across ${sourcingItems.length} distinct products to procure from China suppliers.\n\nYou can view the full consolidated breakdown and search 1688 / Taobao directly in the Sourcing tab.`;
                fallbackTab = 'sourcing';
            } else if (lower.includes('claim') || lower.includes('ussd') || lower.includes('momo') || lower.includes('audit')) {
                fallbackContent = `There are currently ${pendingClaimsCount} pending USSD / Mobile Money claims requiring administrative audit.\n\nYou can review, approve, or reject transactions in the Claims Audit tab.`;
                fallbackTab = 'claims';
            }

            setMessages(prev => [
                ...prev,
                {
                    id: `asst-${Date.now()}`,
                    role: 'assistant',
                    content: fallbackContent,
                    actionRedirectTab: fallbackTab,
                    quickReplies: [
                        { label: "Summarize Debts", query: "Summarize outstanding debts" },
                        { label: "China Sourcing", query: "Consolidate China sourcing" },
                        { label: "Pending Claims", query: "Show pending Hubtel claims" }
                    ]
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pb-2">
                <button
                    onClick={() => handleSendMessage("Summarize outstanding debts")}
                    className="text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                >
                    Outstanding Debts
                </button>
                <button
                    onClick={() => handleSendMessage("Consolidate China sourcing")}
                    className="text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                >
                    China Sourcing
                </button>
                <button
                    onClick={() => handleSendMessage("Show pending Hubtel claims")}
                    className="text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                >
                    Pending Claims ({pendingClaimsCount})
                </button>
            </div>

            {/* Chat Messages */}
            <div ref={chatScrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 py-2 pr-1">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                                <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed space-y-2 ${
                                msg.role === 'user'
                                    ? 'bg-white text-slate-950 font-medium'
                                    : 'bg-slate-900 text-slate-100 border border-slate-800'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {/* Optional Matched Orders */}
                            {msg.orders && msg.orders.length > 0 && (
                                <div className="pt-1 space-y-1">
                                    {msg.orders.map((ord, idx) => (
                                        <div key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px]">
                                            <span className="font-mono text-slate-300">{ord.order_number}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">GH₵ {ord.total.toFixed(2)}</span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-800 text-slate-300">
                                                    {ord.state_display}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Optional Matched Products */}
                            {msg.products && msg.products.length > 0 && (
                                <div className="pt-1 flex flex-wrap gap-1.5">
                                    {msg.products.map((prod) => (
                                        <a
                                            key={prod.id}
                                            href={`/products/${prod.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                                        >
                                            <span className="truncate max-w-[140px]">{prod.name}</span>
                                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Action Link if provided */}
                            {msg.actionLink && (
                                <div className="pt-1">
                                    <a
                                        href={msg.actionLink.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
                                    >
                                        {msg.actionLink.label}
                                        <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            )}

                            {/* Tab Switcher Button */}
                            {msg.actionRedirectTab && (
                                <button
                                    onClick={() => onSwitchTab(msg.actionRedirectTab!)}
                                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
                                >
                                    Open {msg.actionRedirectTab.toUpperCase()} Tab
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            )}

                            {/* Quick Reply Pills */}
                            {msg.quickReplies && msg.quickReplies.length > 0 && (
                                <div className="pt-2 flex flex-wrap gap-1.5">
                                    {msg.quickReplies.map((qr, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(qr.query)}
                                            className="text-[10px] font-medium bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-800 transition-colors"
                                        >
                                            {qr.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-2.5 items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                            <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400">
                            Analyzing operational data...
                        </div>
                    </div>
                )}
            </div>

            {/* Prompt Input */}
            <div className="pt-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        placeholder="Ask Miss London about orders, debts, or shipments..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-900 text-white placeholder-slate-400 border border-slate-800 rounded-lg focus:outline-none focus:border-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-1.5 p-1.5 bg-white text-slate-950 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-40"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
