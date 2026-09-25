'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { X, Send, MessageCircle, ArrowRight, Mic, MicOff } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import ConciergeProductRow, { AssistantProduct } from './ConciergeProductRow';
import ConciergeOrderCard, { AssistantOrder } from './ConciergeOrderCard';

export interface QuickReplyOption {
    label: string;
    query: string;
    isCheckout?: boolean;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    products?: AssistantProduct[];
    orders?: AssistantOrder[];
    isSourcingPrompt?: boolean;
    actionLink?: {
        label: string;
        href: string;
    };
    quickReplies?: QuickReplyOption[];
}

const QUICK_NAV = [
    { label: "Browse catalog", query: "Browse catalog" },
    { label: "Check my cart", query: "Check my cart" },
    { label: "Track my order", query: "Track my order" },
    { label: "Order from China", query: "Order from China" },
];

export default function ConciergeDrawer() {
    const router = useRouter();
    const pathname = usePathname();
    const isProductPage = Boolean(pathname?.startsWith('/products/') && !pathname.includes('/category/'));
    const currentProductSlug = isProductPage && pathname ? pathname.replace(/^\/products\//, '').split('/')[0] : undefined;
    const [isListening, setIsListening] = useState(false);
    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const rawName = user?.first_name?.trim() || (user?.username ? user.username.split('@')[0].trim() : '');
    const firstName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [conciergePhase, setConciergePhase] = useState<'idle' | 'typing_1' | 'typing_2' | 'ready'>('idle');
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch user orders in the background when concierge is open & authenticated
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            ordersAPI.list()
                .then(res => {
                    const results = res.data?.results || res.data || [];
                    const validOrders = Array.isArray(results) ? results : [];
                    setUserOrders(validOrders);
                })
                .catch(err => {
                    console.warn('[Concierge] Error fetching user orders:', err);
                });
        }
    }, [isOpen, isAuthenticated]);

    // Auto-scroll on new message or state change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, conciergePhase]);

    // Lock body scroll and apply concierge-open class when drawer is active
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('concierge-open');
        } else {
            document.body.classList.remove('concierge-open');
        }
        return () => {
            document.body.classList.remove('concierge-open');
        };
    }, [isOpen]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Trigger typing_1 when drawer opens
    useEffect(() => {
        if (isOpen && conciergePhase === 'idle' && messages.length === 0) {
            setConciergePhase('typing_1');
        }
    }, [isOpen, conciergePhase, messages.length]);

    // Choreographed sequence:
    // 1. typing_1 (2.5s) -> Greeting 1 appears -> typing_2
    // 2. typing_2 (1.5s) -> Greeting 2 appears -> ready (Quick Nav appears)
    useEffect(() => {
        if (conciergePhase === 'typing_1') {
            const timer = setTimeout(() => {
                const greetingText = firstName
                    ? `Hello ${firstName}! I am Miss London from London's Imports. How can I help you shop, track an order, or check items today?`
                    : "Hello! I am Miss London from London's Imports. How can I help you shop, track an order, or check items today?";

                setMessages([
                    {
                        id: 'initial',
                        role: 'assistant',
                        content: greetingText
                    }
                ]);
                setConciergePhase('typing_2');
            }, 2500);
            return () => clearTimeout(timer);
        }

        if (conciergePhase === 'typing_2') {
            const timer = setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: 'quick-nav-intro',
                        role: 'assistant',
                        content: firstName
                            ? `${firstName}, here are a few quick ways I can help you right now:`
                            : 'Here are some quick options to help you:'
                    }
                ]);
                setConciergePhase('ready');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [conciergePhase, firstName]);

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
                    handleSend(transcript);
                }
            };
            recognition.start();
        } catch {
            setIsListening(false);
        }
    };

    const handleSend = async (userText: string) => {
        const trimmed = userText.trim();
        if (!trimmed || isLoading) return;

        setConciergePhase('ready');

        // Special quick prompt: WhatsApp
        if (/whatsapp/i.test(trimmed)) {
            window.open('https://wa.me/233545247009?text=Hello%20London%27s%20Imports%2C%20I%20am%20inquiring%20about%20a%20product%20order', '_blank');
            return;
        }

        const userMsg: Message = {
            id: String(Date.now()),
            role: 'user',
            content: trimmed
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Gather real-time cart context from Zustand store
        const cartState = useCartStore.getState();
        const items = cartState.cart?.items || cartState.guestItems || [];
        const count = cartState.itemCount;
        const total = cartState.cart?.total ?? items.reduce((sum, i) => sum + (Number(i.unit_price || i.product?.price || 0) * i.quantity), 0);
        const cartContext = {
            count,
            total,
            items: items.map(i => ({
                name: i.product?.name || 'Item',
                quantity: i.quantity,
                price: i.unit_price || i.product?.price
            }))
        };

        // Format ordersContext
        const ordersContext = userOrders.map(o => ({
            id: o.id,
            order_number: o.order_number,
            state: o.state,
            state_display: o.state_display,
            total: typeof o.total === 'string' ? parseFloat(o.total) : (o.total || 0),
            amount_paid: typeof o.amount_paid === 'string' ? parseFloat(o.amount_paid) : (o.amount_paid || 0),
            balance_due: typeof o.balance_due === 'string' ? parseFloat(o.balance_due) : (o.balance_due || 0),
            items_count: o.items_count || o.items?.length || 0,
            delivery_window: o.delivery_window || '',
            items: (o.items || []).map((it: any) => ({
                name: it.product_name || it.product?.name || 'Item',
                quantity: it.quantity || 1,
                image: it.product?.image || null
            }))
        }));

        try {
            const history = messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/assistant/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    conversationHistory: history,
                    cartContext,
                    userName: firstName,
                    isAuthenticated,
                    ordersContext,
                    currentProductSlug
                })
            });

            if (!res.ok) {
                throw new Error('Response error');
            }

            const data = await res.json();
            if (data.cartAction && data.cartAction.action === 'add' && data.cartAction.product) {
                try {
                    await useCartStore.getState().addToCart(data.cartAction.product, data.cartAction.quantity || 1);
                } catch (e) {
                    console.warn('[Concierge] Error adding to cart:', e);
                }
            }
            const assistantMsg: Message = {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: data.reply || "I checked our shop for your request.",
                products: data.products || [],
                orders: data.orders || [],
                actionLink: data.actionLink,
                quickReplies: data.quickReplies
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: "Sorry, I had a small network issue. Please browse our shop directly or chat with us on WhatsApp."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductAdded = (product: AssistantProduct) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const greeting = firstName ? `${firstName}, you` : 'You';
            const assistantMsg: Message = {
                id: String(Date.now()),
                role: 'assistant',
                content: `${greeting} added "${product.name}" to your cart! Would you like to order anything else, or proceed to checkout?`,
                actionLink: {
                    label: "Proceed to Checkout",
                    href: "/checkout"
                },
                quickReplies: [
                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                    { label: "Order something else", query: "Order something else" }
                ]
            };
            setMessages(prev => [...prev, assistantMsg]);
        }, 600);
    };

    return (
        <>
            {/* 1. Sleek Compact Trigger Pill */}
            {!isOpen && (
                <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="group inline-flex items-center p-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-800/40 dark:border-slate-200/50 cursor-pointer"
                        aria-label="Chat with London"
                    >
                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-700/60 dark:border-slate-300 shrink-0 bg-white shadow-2xs">
                            <Image
                                src="/logo.jpg"
                                alt="London's Imports Logo"
                                fill
                                sizes="28px"
                                className="object-cover"
                            />
                        </div>
                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:pl-2 group-hover:pr-2.5 transition-all duration-300 ease-out text-[10px] font-bold uppercase tracking-[0.16em]">
                            London
                        </span>
                    </button>
                </div>
            )}

            {/* 2. Slide-Over Editorial Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] h-dvh max-h-dvh flex justify-end overflow-hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full sm:w-[440px] h-dvh max-h-dvh bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-200">
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs bg-white">
                                    <Image
                                        src="/logo.jpg"
                                        alt="London's Imports Logo"
                                        fill
                                        sizes="36px"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-serif font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                                             London
                                        </h2>
                                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            CONCIERGE
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
                                        London&apos;s Imports Personal Shopper
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                aria-label="Close Concierge"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar"
                        >
                            {messages.map(msg => (
                                <div 
                                    key={msg.id}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    {/* Text Bubble */}
                                    <div
                                        className={`max-w-[85%] text-xs sm:text-[13px] leading-relaxed p-3.5 rounded-2xl ${
                                            msg.role === 'user'
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-tr-xs font-sans shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-800 font-sans'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* Action Link button (Primary Action - only if no order cards) */}
                                    {msg.actionLink && (!msg.orders || msg.orders.length === 0) && (
                                        <div className="mt-2">
                                            {/browse(\s+our|\s+the)?\s+catalog/i.test(msg.actionLink.label) || msg.actionLink.href === '/products' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSend("Browse catalog")}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <span>{msg.actionLink.label}</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        router.push(msg.actionLink!.href);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <span>{msg.actionLink.label}</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Quick Reply Pills (Quiet Minimalist Chips) */}
                                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {msg.quickReplies
                                                .filter((replyOpt) => {
                                                    // When orders are shown, suppress redundant order action pills
                                                    if (msg.orders && msg.orders.length > 0) {
                                                        const q = replyOpt.query.toLowerCase();
                                                        if (q.includes('pay') || q.includes('track') || q.includes('order')) {
                                                            return false;
                                                        }
                                                    }
                                                    if (msg.actionLink && replyOpt.label.toLowerCase() === msg.actionLink.label.toLowerCase()) {
                                                        return false;
                                                    }
                                                    return true;
                                                })
                                                .map((replyOpt) => {
                                                    const isCheckout = replyOpt.isCheckout || /proceed to checkout/i.test(replyOpt.query);
                                                    const isBrowse = /browse(\s+our|\s+the)?\s+catalog/i.test(replyOpt.label) || /browse(\s+our|\s+the)?\s+catalog/i.test(replyOpt.query);
                                                    return (
                                                        <button
                                                            key={replyOpt.label}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isCheckout) {
                                                                    setIsOpen(false);
                                                                    router.push('/checkout');
                                                                } else if (isBrowse) {
                                                                    handleSend("Browse catalog");
                                                                } else {
                                                                    handleSend(replyOpt.query);
                                                                }
                                                            }}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                                        >
                                                            <span>{replyOpt.label}</span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    )}

                                    {/* Orders Cards */}
                                    {msg.orders && msg.orders.length > 0 && (
                                        <div className="w-full mt-3 space-y-2">
                                            <div className="text-[10px] font-medium tracking-wide uppercase text-slate-400 dark:text-slate-500 px-0.5">
                                                Orders ({msg.orders.length})
                                            </div>
                                            {msg.orders.map(order => (
                                                <ConciergeOrderCard
                                                    key={order.order_number}
                                                    order={order}
                                                    onTrack={(orderNumber) => handleSend(`Track order ${orderNumber}`)}
                                                    onCloseDrawer={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Products Staging Cards */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="w-full mt-3 space-y-2">
                                            <div className="text-[9px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 px-1">
                                                VERIFIED MATCHES ({msg.products.length})
                                            </div>
                                            {msg.products.map(product => (
                                                <ConciergeProductRow 
                                                    key={product.id} 
                                                    product={product} 
                                                    onAdded={handleProductAdded}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Greeting Typing Simulator */}
                            {(conciergePhase === 'typing_1' || conciergePhase === 'typing_2') && (
                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 font-medium w-fit animate-in fade-in duration-300">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">London is typing</span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]" />
                                    </span>
                                </div>
                            )}

                            {/* In-Chat Response Typing Indicator */}
                            {isLoading && (
                                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 w-fit">
                                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">London is typing</span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]" />
                                    </span>
                                </div>
                            )}

                            {/* Quick Navigation - Options */}
                            {conciergePhase === 'ready' && messages.length <= 2 && !isLoading && (
                                <div className="w-full pt-1 animate-in fade-in duration-300">
                                    <div className="flex flex-col gap-2 w-full">
                                        {QUICK_NAV.map(nav => (
                                            <button
                                                key={nav.label}
                                                type="button"
                                                onClick={() => handleSend(nav.label)}
                                                className="w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all group active:scale-[0.99] shadow-2xs"
                                            >
                                                <span className="font-medium text-slate-800 dark:text-slate-200">{nav.label}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Input Area */}
                        <div className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend(input);
                                }}
                                className="relative flex items-center w-full"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={firstName ? `Ask Miss London anything, ${firstName}...` : "Ask to track order, check catalog, or pay balance..."}
                                    className="w-full h-11 sm:h-10 pl-4 pr-20 text-sm sm:text-xs bg-slate-100/90 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs"
                                />
                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handleVoiceInput}
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                                            isListening
                                                ? 'bg-rose-500 text-white animate-pulse'
                                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                        aria-label="Voice input"
                                        title="Speak to Miss London"
                                    >
                                        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-slate-950 disabled:opacity-25 disabled:pointer-events-none hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
                                        aria-label="Send message"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                            <div className="flex items-center justify-between text-[10px] sm:text-[9px] text-slate-400 dark:text-slate-500 mt-2 px-1">
                                <span>Prices in Ghana Cedis (GH₵)</span>
                                <a 
                                    href={`https://wa.me/233545247009?text=${encodeURIComponent(
                                        `Hello London's Imports, I am inquiring with Miss London${firstName ? ` (${firstName})` : ''} regarding an order or product sourcing.`
                                    )}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400"
                                >
                                    <MessageCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export { ConciergeDrawer };
