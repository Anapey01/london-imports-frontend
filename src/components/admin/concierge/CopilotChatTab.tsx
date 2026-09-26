'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
    Send, 
    Bot, 
    ArrowRight, 
    ExternalLink, 
    Mic, 
    MicOff, 
    Volume2, 
    VolumeX, 
    RotateCcw, 
    MessageSquare, 
    CreditCard, 
    Package, 
    ShieldCheck 
} from 'lucide-react';
import { 
    AdminOrderData, 
    computeDebtorMetrics, 
    consolidateSourcingList, 
    generateWhatsAppMessage, 
    formatWhatsAppUrl,
    DebtorCustomer,
    SourcingItem 
} from '@/lib/concierge-utils';

export interface CopilotMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    actionRedirectTab?: 'debtors' | 'sourcing' | 'claims';
    quickReplies?: Array<{ label: string; query: string }>;
    actionLink?: { label: string; href: string };
    products?: Array<{ id: string; name: string; price: number; slug: string }>;
    orders?: Array<{ order_number: string; state_display: string; total: number; balance_due: number; customer_name?: string }>;
    debtors?: DebtorCustomer[];
    sourcingItems?: SourcingItem[];
}

interface CopilotChatTabProps {
    orders: AdminOrderData[];
    pendingClaimsCount: number;
    onSwitchTab: (tab: 'debtors' | 'sourcing' | 'claims') => void;
}

const STORAGE_KEY = 'li_admin_copilot_session_v1';

function selectBestConciergeVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
    if (!voices || voices.length === 0) return undefined;
    const preferredNames = [
        'en-GB', 'en_GB', 'British', 'Stephanie', 'Samantha', 'Karen', 'Victoria', 'Moira', 'Google UK English Female'
    ];
    for (const name of preferredNames) {
        const found = voices.find(v => v.name.includes(name) || v.lang.includes(name));
        if (found) return found;
    }
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
}

function renderStyledTokens(str: string) {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-semibold text-slate-900 dark:text-white">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return (
                <em key={i} className="italic text-slate-600 dark:text-slate-300">
                    {part.slice(1, -1)}
                </em>
            );
        }
        return part;
    });
}

function FormattedCopilotMessage({ content, isUser }: { content: string; isUser: boolean }) {
    if (isUser) {
        return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // 1. Clean markdown pipe tables if any leaked
    let text = content;
    if (text.includes('|') && /\|[\s-:]+\|/.test(text)) {
        const pipeIdx = text.indexOf('|');
        if (pipeIdx > -1) {
            const intro = text.slice(0, pipeIdx).trim();
            text = intro.length > 5 ? intro : "Operations review complete:";
        }
    }

    // 2. Clean robotic header prefixes like "**London's Imports - Operations Support Overview**"
    text = text.replace(/^\s*\*\*.*?(?:overview|support|concierge|assistant).*?\*\*\s*/i, '');

    // 3. Normalize inline bullet patterns: " - **" -> "\n• **", " - " -> "\n• "
    text = text.replace(/\s+-\s+\*\*/g, '\n• **');
    text = text.replace(/\s+-\s+/g, '\n• ');
    text = text.replace(/([.!?])\s+•\s+/g, '$1\n• ');

    // 4. Split into lines
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

    return (
        <div className="space-y-1.5 font-sans leading-relaxed text-xs">
            {rawLines.map((line, idx) => {
                // Header line: "## Heading" or "### Heading"
                if (/^#+\s+/.test(line)) {
                    const headerText = line.replace(/^#+\s+/, '');
                    return (
                        <div key={idx} className="font-semibold text-slate-900 dark:text-white pt-1">
                            {renderStyledTokens(headerText)}
                        </div>
                    );
                }

                // Bullet point line
                if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                    const cleanItem = line.replace(/^[•\-\*]\s*/, '');
                    return (
                        <div key={idx} className="flex items-start gap-2 pl-0.5 text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0" />
                            <div className="flex-1">
                                {renderStyledTokens(cleanItem)}
                            </div>
                        </div>
                    );
                }

                // Regular text line
                return (
                    <div key={idx} className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        {renderStyledTokens(line)}
                    </div>
                );
            })}
        </div>
    );
}

export default function CopilotChatTab({ orders, pendingClaimsCount, onSwitchTab }: CopilotChatTabProps) {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Compute live operational metrics
    const debtorData = useMemo(() => computeDebtorMetrics(orders), [orders]);
    const sourcingData = useMemo(() => consolidateSourcingList(orders), [orders]);

    const { allDebtors, partiallyPaid, totalOutstanding } = debtorData;
    const { items: sourcingItems, totalUnits } = sourcingData;

    // Build initial dynamic briefing
    const buildInitialBriefing = useCallback((): CopilotMessage => {
        return {
            id: 'initial-briefing',
            role: 'assistant',
            content: `Hello Administrator. Store operations summary: GH₵ ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })} in outstanding customer receivables across ${allDebtors.length} orders, ${totalUnits} units across ${sourcingItems.length} products to procure from China suppliers, and ${pendingClaimsCount} USSD claims awaiting audit.\n\nHow may I assist with your store operations today?`,
            quickReplies: [
                { label: "Summarize Debts", query: "Summarize outstanding debts" },
                { label: "China Sourcing", query: "Consolidate China sourcing" },
                { label: "Pending Claims", query: "Show pending Hubtel claims" },
                { label: "Order Health", query: "Audit recent order statuses" }
            ]
        };
    }, [allDebtors.length, totalOutstanding, totalUnits, sourcingItems.length, pendingClaimsCount]);

    const [messages, setMessages] = useState<CopilotMessage[]>([buildInitialBriefing()]);

    // Pre-cache speech synthesis voices
    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        const syncVoices = () => {
            const v = window.speechSynthesis.getVoices();
            if (v && v.length > 0) setAvailableVoices(v);
        };

        syncVoices();
        window.speechSynthesis.onvoiceschanged = syncVoices;

        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    // Restore session from sessionStorage if available
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            }
        } catch {
            // Ignore storage parse errors
        }
    }, []);

    // Persist messages to sessionStorage
    useEffect(() => {
        if (messages.length > 0) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-25)));
            } catch {
                // Ignore quota
            }
        }
    }, [messages]);

    const scrollToBottom = () => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Reset chat session
    const handleResetSession = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsSpeakingId(null);
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
        setMessages([buildInitialBriefing()]);
    };

    // Speech-to-Text handler
    const handleVoiceInput = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results?.[0]?.[0]?.transcript;
                if (transcript) {
                    setInput(transcript);
                    handleSendMessage(transcript);
                }
            };
            recognition.start();
        } catch {
            setIsListening(false);
        }
    };

    // Text-to-Speech handler
    const handleToggleSpeech = (msgId: string, text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isSpeakingId === msgId) {
            window.speechSynthesis.cancel();
            setIsSpeakingId(null);
            return;
        }

        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_#`]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.93;
        utterance.pitch = 1.02;

        const currentVoices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
        const voice = selectBestConciergeVoice(currentVoices);
        if (voice) utterance.voice = voice;

        utterance.onstart = () => setIsSpeakingId(msgId);
        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);

        window.speechSynthesis.speak(utterance);
    };

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
                        isAdmin: true,
                        ordersContext: formattedOrders,
                        debtorMetrics: {
                            allDebtorsCount: allDebtors.length,
                            totalOutstanding,
                            partiallyPaidCount: partiallyPaid.length
                        },
                        sourcingMetrics: {
                            totalUnits,
                            distinctProductsCount: sourcingItems.length
                        },
                        pendingClaimsCount
                    })
                });
            } finally {
                clearTimeout(timeoutId);
            }

            if (res.ok) {
                const data = await res.json();

                let actionRedirectTab: 'debtors' | 'sourcing' | 'claims' | undefined = data.actionRedirectTab;
                const lowerQ = query.toLowerCase();
                const lowerR = (data.reply || '').toLowerCase();

                if (!actionRedirectTab) {
                    if (lowerQ.includes('debt') || lowerQ.includes('balance') || lowerQ.includes('unpaid') || lowerQ.includes('owing') || lowerR.includes('outstanding balance')) {
                        actionRedirectTab = 'debtors';
                    } else if (lowerQ.includes('sourcing') || lowerQ.includes('china') || lowerQ.includes('procure') || lowerR.includes('procurement') || lowerR.includes('sourcing')) {
                        actionRedirectTab = 'sourcing';
                    } else if (lowerQ.includes('claim') || lowerQ.includes('audit') || lowerQ.includes('ussd') || lowerR.includes('claims audit')) {
                        actionRedirectTab = 'claims';
                    }
                }

                // Attach matching debtor cards if query is about debts
                let matchedDebtors: DebtorCustomer[] | undefined;
                if (lowerQ.includes('debt') || lowerQ.includes('balance') || lowerQ.includes('owing') || lowerQ.includes('unpaid')) {
                    matchedDebtors = allDebtors.slice(0, 3);
                }

                // Attach matching sourcing items if query is about sourcing
                let matchedSourcing: SourcingItem[] | undefined;
                if (lowerQ.includes('sourcing') || lowerQ.includes('china') || lowerQ.includes('procure') || lowerQ.includes('manifest')) {
                    matchedSourcing = sourcingItems.slice(0, 3);
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
                        orders: data.orders,
                        debtors: matchedDebtors,
                        sourcingItems: matchedSourcing
                    }
                ]);
            } else {
                throw new Error('API returned non-200 status');
            }
        } catch {
            // Intelligent operational fallback using real computed data
            let fallbackContent = "I am Miss London, your store operations concierge. All systems are operational. You can ask me to inspect debtor balances, calculate China sourcing items, or audit pending payment claims.";
            let fallbackTab: 'debtors' | 'sourcing' | 'claims' | undefined;
            let matchedDebtors: DebtorCustomer[] | undefined;
            let matchedSourcing: SourcingItem[] | undefined;

            const lower = query.toLowerCase();
            if (lower.includes('debt') || lower.includes('balance') || lower.includes('unpaid') || lower.includes('owing')) {
                fallbackContent = `There are currently ${allDebtors.length} orders with outstanding balances totaling GH₵ ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\n• ${partiallyPaid.length} orders are partially paid.\n• ${allDebtors.length - partiallyPaid.length} orders are completely unpaid.\n\nYou can review individual customer accounts and dispatch WhatsApp payment reminders directly below.`;
                fallbackTab = 'debtors';
                matchedDebtors = allDebtors.slice(0, 3);
            } else if (lower.includes('sourcing') || lower.includes('china') || lower.includes('procure') || lower.includes('items') || lower.includes('manifest')) {
                fallbackContent = `Currently, there are ${totalUnits} total units across ${sourcingItems.length} distinct products to procure from China suppliers.\n\nYou can view the consolidated items below or search directly on 1688 and Taobao in the Sourcing tab.`;
                fallbackTab = 'sourcing';
                matchedSourcing = sourcingItems.slice(0, 3);
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
                    debtors: matchedDebtors,
                    sourcingItems: matchedSourcing,
                    quickReplies: [
                        { label: "Summarize Debts", query: "Summarize outstanding debts" },
                        { label: "China Sourcing", query: "Consolidate China sourcing" },
                        { label: "Pending Claims", query: "Show pending Hubtel claims" },
                        { label: "Order Health", query: "Audit recent order statuses" }
                    ]
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 text-slate-900 dark:text-slate-100">
            {/* Live Operational KPI Ticker & Reset Header */}
            <div className="pb-2.5 space-y-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        Live Operations Snapshot
                    </span>
                    <button
                        onClick={handleResetSession}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Reset conversation session"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                    {/* Outstanding Receivables Metric */}
                    <button
                        onClick={() => handleSendMessage("Summarize outstanding debts")}
                        className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
                            <CreditCard className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-wide">Receivables</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            GH₵ {totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {allDebtors.length} debtor{allDebtors.length === 1 ? '' : 's'}
                        </div>
                    </button>

                    {/* China Sourcing Queue Metric */}
                    <button
                        onClick={() => handleSendMessage("Consolidate China sourcing")}
                        className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
                            <Package className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-wide">Sourcing</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {totalUnits} units
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {sourcingItems.length} product{sourcingItems.length === 1 ? '' : 's'}
                        </div>
                    </button>

                    {/* Pending Claims Audit Metric */}
                    <button
                        onClick={() => handleSendMessage("Show pending Hubtel claims")}
                        className="text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-wide">Claims</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {pendingClaimsCount} pending
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            USSD audit
                        </div>
                    </button>
                </div>
            </div>

            {/* Quick Operations Prompts */}
            <div className="flex flex-wrap gap-1.5 py-2">
                <button
                    onClick={() => handleSendMessage("Summarize outstanding debts")}
                    className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                >
                    Top Debtors
                </button>
                <button
                    onClick={() => handleSendMessage("Consolidate China sourcing")}
                    className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                >
                    China Manifest
                </button>
                <button
                    onClick={() => handleSendMessage("Show pending Hubtel claims")}
                    className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                >
                    Audit Claims ({pendingClaimsCount})
                </button>
                <button
                    onClick={() => handleSendMessage("Audit recent order statuses")}
                    className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                >
                    Order Health
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
                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                                <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed space-y-2.5 ${
                                msg.role === 'user'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium'
                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <FormattedCopilotMessage content={msg.content} isUser={msg.role === 'user'} />
                                </div>
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => handleToggleSpeech(msg.id, msg.content)}
                                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5 rounded transition-colors shrink-0"
                                        title={isSpeakingId === msg.id ? "Stop reading" : "Read aloud"}
                                    >
                                        {isSpeakingId === msg.id ? (
                                            <VolumeX className="w-3.5 h-3.5 text-white animate-pulse" />
                                        ) : (
                                            <Volume2 className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Interactive Debtor Action Cards */}
                            {msg.debtors && msg.debtors.length > 0 && (
                                <div className="pt-1 space-y-1.5 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                                        Actionable Debtor Records
                                    </div>
                                    {msg.debtors.map((d, idx) => {
                                        const reminderText = generateWhatsAppMessage('balance_reminder', {
                                            customerName: d.customerName,
                                            orderNumber: d.orderNumber,
                                            balanceDue: d.balanceDue,
                                            amountPaid: d.amountPaid,
                                            total: d.total
                                        });
                                        const waUrl = formatWhatsAppUrl(d.customerPhone, reminderText);

                                        return (
                                            <div 
                                                key={idx} 
                                                className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-900 dark:text-white">{d.customerName}</span>
                                                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[10px]">#{d.orderNumber}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                                    <span>Balance Due: <strong className="text-slate-900 dark:text-white">GH₵ {d.balanceDue.toFixed(2)}</strong></span>
                                                    <span className="text-slate-500 dark:text-slate-400">Paid: GH₵ {d.amountPaid.toFixed(2)}</span>
                                                </div>
                                                <div className="pt-1 flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{d.customerPhone || 'No phone on file'}</span>
                                                    {d.customerPhone ? (
                                                        <a
                                                            href={waUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[10px] font-medium border border-slate-200 dark:border-slate-700 transition-colors"
                                                        >
                                                            <MessageSquare className="w-2.5 h-2.5" />
                                                            <span>WhatsApp Reminder</span>
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Interactive Sourcing Action Cards */}
                            {msg.sourcingItems && msg.sourcingItems.length > 0 && (
                                <div className="pt-1 space-y-1.5 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                                        Consolidated Procurement Items
                                    </div>
                                    {msg.sourcingItems.map((item, idx) => {
                                        const s1688Url = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(item.name)}`;

                                        return (
                                            <div 
                                                key={idx} 
                                                className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">{item.name}</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">{item.totalQuantity} units</span>
                                                </div>
                                                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                                                    <span>Variant: {item.variant}</span>
                                                    <span>{item.ordersCount} customer order{item.ordersCount === 1 ? '' : 's'}</span>
                                                </div>
                                                <div className="pt-1 flex items-center justify-end">
                                                    <a
                                                        href={item.supplierUrl || s1688Url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[10px] font-medium border border-slate-200 dark:border-slate-700 transition-colors"
                                                    >
                                                        <span>Search 1688 / Supplier</span>
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Matched Orders */}
                            {msg.orders && msg.orders.length > 0 && (
                                <div className="pt-1 space-y-1 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                                        Matched Orders
                                    </div>
                                    {msg.orders.map((ord, idx) => (
                                        <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                            <span className="font-mono text-slate-700 dark:text-slate-300">#{ord.order_number}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 dark:text-slate-400">GH₵ {ord.total.toFixed(2)}</span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {ord.state_display}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Matched Products */}
                            {msg.products && msg.products.length > 0 && (
                                <div className="pt-1 flex flex-wrap gap-1.5">
                                    {msg.products.map((prod) => (
                                        <a
                                            key={prod.id}
                                            href={`/products/${prod.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
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
                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-900 dark:border-slate-700 transition-colors"
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
                                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-900 dark:border-slate-700 transition-colors"
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
                                            className="text-[10px] font-medium bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 transition-colors"
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
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                            <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-white" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                            Analyzing operational data...
                        </div>
                    </div>
                )}
            </div>

            {/* Prompt Input Form */}
            <div className="pt-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="relative flex items-center gap-1.5"
                >
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder={isListening ? "Listening to your operational query..." : "Ask Miss London about orders, debts, or shipments..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceInput}
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded transition-colors ${
                                isListening 
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white animate-pulse' 
                                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                            title={isListening ? "Listening..." : "Click to speak"}
                        >
                            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-700 dark:hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 shrink-0"
                        title="Send message"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
