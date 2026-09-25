'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { X, Send, MessageCircle, ArrowRight, Mic, MicOff, Volume2, VolumeX, RotateCcw, Camera } from 'lucide-react';
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
    imageUrl?: string;
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
                <em key={i} className="italic text-slate-700 dark:text-slate-300">
                    {part.slice(1, -1)}
                </em>
            );
        }
        return part;
    });
}

function FormattedConciergeMessage({ content, isUser }: { content: string; isUser: boolean }) {
    if (isUser) {
        return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // 1. Clean markdown pipe tables if any leaked
    let text = content;
    if (text.includes('|') && /\|[\s-:]+\|/.test(text)) {
        const pipeIdx = text.indexOf('|');
        if (pipeIdx > -1) {
            const intro = text.slice(0, pipeIdx).trim();
            text = intro.length > 5 ? intro : "Here are your recent orders on record:";
        }
    }

    // 2. Normalize inline bullet patterns: " - **" -> "\n• **", " - " -> "\n• "
    text = text.replace(/\s+-\s+\*\*/g, '\n• **');
    text = text.replace(/\s+-\s+/g, '\n• ');
    text = text.replace(/([.!?])\s+•\s+/g, '$1\n• ');

    // 3. Split into lines
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

    return (
        <div className="space-y-1.5 font-sans leading-relaxed text-xs sm:text-[13px]">
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

export default function ConciergeDrawer() {
    const router = useRouter();
    const pathname = usePathname();
    const isProductPage = Boolean(pathname?.startsWith('/products/') && !pathname.includes('/category/'));
    const currentProductSlug = isProductPage && pathname ? pathname.replace(/^\/products\//, '').split('/')[0] : undefined;
    const [isListening, setIsListening] = useState(false);
    const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const rawName = user?.first_name?.trim() || (user?.username ? user.username.split('@')[0].trim() : '');
    const firstName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';

    const STORAGE_KEY = 'li_concierge_messages_v2';
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [conciergePhase, setConciergePhase] = useState<'idle' | 'typing_1' | 'typing_2' | 'ready'>('idle');
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [showTeaser, setShowTeaser] = useState(false);
    const [teaserDismissed, setTeaserDismissed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize mute preference and teaser dismissal state
    useEffect(() => {
        try {
            const savedMute = localStorage.getItem('li_concierge_muted');
            if (savedMute === 'true') setIsMuted(true);
            const savedTeaser = sessionStorage.getItem('li_concierge_teaser_dismissed');
            if (savedTeaser === 'true') setTeaserDismissed(true);
        } catch {}
    }, []);

    // Proactive context-aware teaser bubble timer (pops up after 4s unless dismissed)
    useEffect(() => {
        if (isOpen || teaserDismissed) {
            setShowTeaser(false);
            return;
        }

        const timer = setTimeout(() => {
            setShowTeaser(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, [isOpen, teaserDismissed, pathname]);

    const handleDismissTeaser = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowTeaser(false);
        setTeaserDismissed(true);
        try {
            sessionStorage.setItem('li_concierge_teaser_dismissed', 'true');
        } catch {}
    };

    const toggleMute = () => {
        const next = !isMuted;
        setIsMuted(next);
        if (next && typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeakingId(null);
        }
        try {
            localStorage.setItem('li_concierge_muted', String(next));
        } catch {}
    };

    const getTeaserText = () => {
        const cartState = useCartStore.getState();
        if (cartState.itemCount > 0) {
            return "Ready to complete your order or find matching pieces? Tap to ask me.";
        }
        if (isProductPage && currentProductSlug) {
            return "Questions about sizing or China shipping timelines? Tap to ask me.";
        }
        if (pathname === '/track') {
            return "Have an order number? Send it here for live shipping updates.";
        }
        return "Looking for a specific item from China factories? Tap to ask me.";
    };

    // Restore session conversation if available
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Discard stale error sessions
                    const hasOnlyError = parsed.length === 1 && (parsed[0].content?.includes('network issue') || parsed[0].content?.includes('connection pause'));
                    if (!hasOnlyError) {
                        setMessages(parsed);
                        setConciergePhase('ready');
                        return;
                    }
                    sessionStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch {
            // Ignore
        }
    }, []);

    // Persist messages to sessionStorage
    useEffect(() => {
        if (messages.length > 0) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
            } catch {
                // Ignore quota
            }
        }
    }, [messages]);

    const handleResetChat = () => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsSpeakingId(null);
        setMessages([]);
        setConciergePhase('idle');
    };

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
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                setIsSpeakingId(null);
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Dynamic context-aware greeting when drawer opens with no existing messages (Instant & Reliable)
    useEffect(() => {
        if (!isOpen || messages.length > 0) return;

        const cartState = useCartStore.getState();
        const cartCount = cartState.itemCount;
        const cartTotal = cartState.cart?.total ?? (cartState.guestItems || []).reduce((s, i) => s + (Number(i.unit_price || i.product?.price || 0) * i.quantity), 0);

        let greetingText = '';
        let dynamicQuickReplies: QuickReplyOption[] = [];

        if (isProductPage && currentProductSlug) {
            greetingText = firstName
                ? `Hello ${firstName}, I see you're looking at this item. I can help you check color options, verify China air-freight delivery times to Accra, or add it to your cart for you.`
                : "Hello, I see you're looking at this item. I can help you check color options, verify China air-freight delivery times to Accra, or add it to your cart for you.";
            dynamicQuickReplies = [
                { label: "Add this to cart", query: "Add this to my cart please" },
                { label: "China shipping times", query: "How long does shipping take for this item from China?" },
                { label: "Browse catalog", query: "Browse catalog" },
                { label: "Track my order", query: "Track my order" }
            ];
        } else if (cartCount > 0) {
            greetingText = firstName
                ? `Welcome back, ${firstName}. You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart (GH₵ ${cartTotal}). Would you like to proceed to checkout or look for matching accessories?`
                : `Welcome back. You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart (GH₵ ${cartTotal}). Would you like to proceed to checkout or look for matching accessories?`;
            dynamicQuickReplies = [
                { label: "Proceed to checkout", query: "Proceed to checkout", isCheckout: true },
                { label: "What is in my cart?", query: "What is currently in my cart and my total?" },
                { label: "Delivery fees across Ghana", query: "How much is delivery across Ghana?" },
                { label: "Order from China", query: "Order from China" }
            ];
        } else if (pathname === '/track') {
            greetingText = firstName
                ? `Hello ${firstName}. Tracking a package from China? Send me your order number (e.g. LI-2026...) and I'll pull up live status for you right away.`
                : "Hello. Tracking a package from China? Send me your order number (e.g. LI-2026...) and I'll pull up live status for you right away.";
            dynamicQuickReplies = [
                { label: "Track my order", query: "Track my order" },
                { label: "Browse catalog", query: "Browse catalog" },
                { label: "How do pre-orders work?", query: "How do pre-orders work?" }
            ];
        } else {
            greetingText = firstName
                ? `Hello ${firstName}. I am Miss London, your personal shopping assistant at London's Imports. We source directly from China factories to Ghana at direct wholesale prices. How can I help you today?`
                : "Hello. I am Miss London, your personal shopping assistant at London's Imports. We source directly from China factories to Ghana at direct wholesale prices. How can I help you today?";
            dynamicQuickReplies = [
                { label: "Browse catalog", query: "Browse catalog" },
                { label: "Check my cart", query: "Check my cart" },
                { label: "Track my order", query: "Track my order" },
                { label: "Order from China", query: "Order from China" }
            ];
        }

        setMessages([
            {
                id: 'initial',
                role: 'assistant',
                content: greetingText,
                quickReplies: dynamicQuickReplies
            }
        ]);
        setConciergePhase('ready');
    }, [isOpen, messages.length, isProductPage, currentProductSlug, pathname, firstName]);

    const speakMessage = (msgId: string, text: string) => {
        if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isSpeakingId === msgId) {
            window.speechSynthesis.cancel();
            setIsSpeakingId(null);
            return;
        }

        window.speechSynthesis.cancel();

        const cleanText = text
            .replace(/[*#_~`\[\]()|]/g, ' ')
            .replace(/GH₵|GHS/gi, 'Ghana Cedis')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Natural') || v.name.includes('Google UK English Female')));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeakingId(msgId);
        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);

        window.speechSynthesis.speak(utterance);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            const dataUrl = uploadEvent.target?.result as string;
            if (!dataUrl) return;

            const userMsg: Message = {
                id: String(Date.now()),
                role: 'user',
                content: "I have a photo of an item I want to source directly from factories in China. Can you help me find this?",
                imageUrl: dataUrl
            };

            const assistantMsg: Message = {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: "I would love to help you source this! Our procurement team in Guangzhou and Yiwu can match this exact factory product for you at direct wholesale prices.",
                actionLink: {
                    label: "Forward Photo to China Sourcing Team (WhatsApp)",
                    href: `https://wa.me/233545247009?text=${encodeURIComponent(
                        "Hello London's Imports, I want to source a product from China factories. I have attached the reference photo for you."
                    )}`
                },
                quickReplies: [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "How do China Pre-orders work?", query: "How do pre-orders work?" }
                ]
            };

            setMessages(prev => [...prev, userMsg, assistantMsg]);
        };
        reader.readAsDataURL(file);
        if (e.target) e.target.value = '';
    };

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

        try {
            // Gather real-time cart context from Zustand store
            const cartState = useCartStore.getState();
            const items = cartState.cart?.items || cartState.guestItems || [];
            const count = cartState.itemCount;
            const total = cartState.cart?.total ?? items.reduce((sum, i) => sum + (Number(i.unit_price || i.product?.price || 0) * i.quantity), 0);
            const cartContext = {
                count,
                total,
                items: items.map(i => ({
                    id: i.id,
                    name: i.product?.name || 'Item',
                    quantity: i.quantity,
                    price: i.unit_price || i.product?.price
                }))
            };

            // Format ordersContext
            const ordersContext = (userOrders || []).map(o => ({
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

            const history = messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content
            }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            let res: Response;
            try {
                res = await fetch('/api/assistant/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
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
            } finally {
                clearTimeout(timeoutId);
            }

            let data: any = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (!res.ok) {
                // If the server provided a custom reply (e.g. rate limit notice or length warning), display it!
                if (data && (data.reply || data.error)) {
                    const fallbackMsg = data.reply || data.error;
                    setMessages(prev => [
                        ...prev,
                        {
                            id: String(Date.now() + 1),
                            role: 'assistant',
                            content: fallbackMsg,
                            quickReplies: data.quickReplies || [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Chat on WhatsApp", query: "Can I chat with your team on WhatsApp?" }
                            ]
                        }
                    ]);
                    return;
                }
                throw new Error(data?.error || `Server responded with ${res.status}`);
            }

            if (data?.cartAction) {
                if (data.cartAction.action === 'add' && data.cartAction.product) {
                    try {
                        await useCartStore.getState().addToCart(data.cartAction.product, data.cartAction.quantity || 1);
                    } catch (e) {
                        console.warn('[Concierge] Error adding to cart:', e);
                    }
                } else if (data.cartAction.action === 'remove' && data.cartAction.itemId) {
                    try {
                        await useCartStore.getState().removeFromCart(data.cartAction.itemId);
                    } catch (e) {
                        console.warn('[Concierge] Error removing from cart:', e);
                    }
                } else if (data.cartAction.action === 'clear') {
                    try {
                        useCartStore.getState().clearCart();
                    } catch (e) {
                        console.warn('[Concierge] Error clearing cart:', e);
                    }
                }
            }

            const assistantMsg: Message = {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: data?.reply || "I'm right here! Feel free to ask about any product, order, or shipping from China to Ghana.",
                products: data?.products || [],
                orders: data?.orders || [],
                actionLink: data?.actionLink,
                quickReplies: data?.quickReplies
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err: any) {
            console.warn('[Concierge] Error communicating with assistant:', err);
            const isTimeout = err?.name === 'AbortError';
            setMessages(prev => [
                ...prev,
                {
                    id: String(Date.now() + 1),
                    role: 'assistant',
                    content: isTimeout 
                        ? "I took a bit too long to connect to our catalog. Please ask me again or chat directly with our team on WhatsApp!"
                        : "Sorry, I had a brief connection pause. Please tap below to retry, browse our shop, or message us on WhatsApp.",
                    actionLink: {
                        label: "Chat on WhatsApp",
                        href: "https://wa.me/233545247009?text=Hello%20London%27s%20Imports%2C%20I%20need%20assistance%20with%20an%20order"
                    },
                    quickReplies: [
                        { label: "Retry last question", query: trimmed },
                        { label: "Browse catalog", query: "Browse catalog" },
                        { label: "Track my order", query: "Track my order" }
                    ]
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
            {/* 1. Mobile-First Smart Floating Launcher & Proactive Teaser */}
            {!isOpen && (
                <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
                    {/* Context-Aware Teaser Callout (Strictly Zero Emojis) */}
                    {showTeaser && !teaserDismissed && (
                        <div 
                            onClick={() => {
                                setShowTeaser(false);
                                setIsOpen(true);
                            }}
                            className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[260px] sm:max-w-[290px] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl p-3 shadow-xl border border-slate-200/90 dark:border-slate-800 text-xs leading-relaxed cursor-pointer relative group/teaser hover:border-slate-400 dark:hover:border-slate-600 transition-all select-none"
                        >
                            <button
                                type="button"
                                onClick={handleDismissTeaser}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-[10px] shadow-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                aria-label="Dismiss message"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Miss London</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-sans pr-1">
                                {getTeaserText()}
                            </p>
                        </div>
                    )}

                    {/* Always-Identified Launcher Pill */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowTeaser(false);
                            setIsOpen(true);
                        }}
                        className="group inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-800/40 dark:border-slate-200/50 cursor-pointer"
                        aria-label="Chat with Miss London"
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
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-bold tracking-tight text-white dark:text-slate-950 whitespace-nowrap">
                            Miss London
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
                                            Miss London
                                        </h2>
                                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            CONCIERGE
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
                                        Personal Shopping Assistant
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={toggleMute}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                    aria-label={isMuted ? "Unmute voice responses" : "Mute voice responses"}
                                    title={isMuted ? "Unmute voice responses" : "Mute voice responses"}
                                >
                                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetChat}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                    aria-label="New conversation"
                                    title="Start new conversation"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                                            window.speechSynthesis.cancel();
                                        }
                                        setIsSpeakingId(null);
                                        setIsOpen(false);
                                    }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                    aria-label="Close Concierge"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
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
                                        {msg.imageUrl && (
                                            <div className="relative w-36 h-36 rounded-lg overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
                                                <Image 
                                                    src={msg.imageUrl} 
                                                    alt="Sourcing reference" 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            </div>
                                        )}
                                        <FormattedConciergeMessage content={msg.content} isUser={msg.role === 'user'} />
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center justify-end mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                                                <button
                                                    type="button"
                                                    onClick={() => speakMessage(msg.id, msg.content)}
                                                    className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer py-0.5 px-1 rounded-sm hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                                                    aria-label="Listen to response"
                                                    title={isSpeakingId === msg.id ? "Stop voice" : "Listen aloud"}
                                                >
                                                    {isSpeakingId === msg.id ? (
                                                        <>
                                                            <VolumeX className="w-3 h-3 text-rose-500 animate-pulse" />
                                                            <span className="text-[9px] text-rose-500 font-medium">Stop</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Volume2 className="w-3 h-3" />
                                                            <span className="text-[9px]">Listen</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
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
                                    className="w-full h-11 sm:h-10 pl-4 pr-28 text-sm sm:text-xs bg-slate-100/90 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-200 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs"
                                />
                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                                        aria-label="Upload photo to source from China"
                                        title="Upload photo to source from China"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageSelect} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
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
