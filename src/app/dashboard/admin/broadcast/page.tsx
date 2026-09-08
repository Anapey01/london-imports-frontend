'use client';

import { useState } from 'react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Users, 
    AlertCircle, 
    CheckCircle,
    ArrowLeft,
    Package,
    Anchor,
    CreditCard,
    FileText,
    MapPin,
    Map,
    ArrowRight,
    Edit3,
    Eye,
    Mail,
    MessageSquare,
    Smartphone,
    ShieldCheck
} from 'lucide-react';
import { BroadcastDispatchModal, SampleRecipient } from '@/components/dashboard/BroadcastDispatchModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';

const LOGISTICS_TEMPLATES = [
    {
        id: 'payment-reminder',
        title: 'Payment Reminder (Unpaid Orders)',
        target: 'state:PENDING_PAYMENT',
        subject: 'Action Required: Complete Payment for Order #{{ORDER_ID}}',
        message: 'Hello {{FIRST_NAME}},\n\nThis is a friendly reminder that a pending balance of GHS {{AMOUNT_DUE}} remains due for your order #{{ORDER_ID}} ({{ITEMS}}).\n\nPlease complete your payment securely via Mobile Money on our portal to avoid any delays in shipping and delivery:\n{{PAY_URL}}\n\nThank you for choosing London\'s Imports.',
        icon: CreditCard,
        badge: 'Unpaid Orders Only'
    },
    {
        id: 'gz-arrived',
        title: 'Guangzhou Arrival',
        target: 'state:OPEN_FOR_BATCH',
        subject: 'Shipment Update: Goods Arrived at Guangzhou Warehouse',
        message: 'Hello {{FIRST_NAME}},\n\nWe are pleased to inform you that your items ({{ITEMS}}) for order #{{ORDER_ID}} have been successfully received and sorted at our Guangzhou Sorting Facility. They are now being prepared for the next available shipment batch.\n\nThank you for choosing London\'s Imports.',
        icon: Package,
        badge: 'GZ Warehouse Only'
    },
    {
        id: 'container-loaded',
        title: 'Container Loaded',
        target: 'state:IN_FULFILLMENT',
        subject: 'Logistics Update: Your Shipment is Now Loaded',
        message: 'Hello {{FIRST_NAME}},\n\nGood news! Your items ({{ITEMS}}) for order #{{ORDER_ID}} have been securely packed and loaded into our current container batch. The shipment is now finalizing documentation and will depart shortly.\n\nStay tuned for further updates.',
        icon: FileText,
        badge: 'Loaded Batch Only'
    },
    {
        id: 'transit-start',
        title: 'International Transit',
        target: 'state:IN_TRANSIT',
        subject: 'Transit Update: Goods are on the way to Ghana',
        message: 'Hello {{FIRST_NAME}},\n\nYour shipment for order #{{ORDER_ID}} ({{ITEMS}}) has officially departed and is currently in international transit toward Tema Port. Approximate transit times: Air (7-14 days), Sea (30-45 days).\n\nWe will notify you the moment it docks in Ghana.',
        icon: Anchor,
        badge: 'In Transit Only'
    },
    {
        id: 'ghana-arrived',
        title: 'Arrived at Accra Hub',
        target: 'state:ARRIVED',
        subject: 'Shipment Arrival: Your items are now at London\'s Imports Accra Hub!',
        message: 'Hello {{FIRST_NAME}},\n\nGreat news! Your shipment for order #{{ORDER_ID}} ({{ITEMS}}) has successfully arrived at London\'s Imports in Ghana and has passed sorting.\n\nYou can now come for collection at our center or wait for our last-mile delivery team to contact you.\n\nLocation: https://maps.app.goo.gl/F32KNuagHcczTtsFA\n\nThank you for choosing London\'s Imports.',
        icon: MapPin,
        badge: 'Arrived Hub Only'
    },
    {
        id: 'out-for-delivery',
        title: 'Out for Delivery',
        target: 'state:OUT_FOR_DELIVERY',
        subject: 'Delivery Alert: Your package is out for delivery today',
        message: 'Hello {{FIRST_NAME}},\n\nYour order #{{ORDER_ID}} ({{ITEMS}}) has been dispatched and is out for delivery with our courier today.\n\nPlease ensure you or someone designated is available at your delivery location with your phone reachable.\n\nThank you for shopping with London\'s Imports.',
        icon: Package,
        badge: 'Out for Delivery Only'
    },
    {
        id: 'delivered',
        title: 'Delivered / Completed',
        target: 'state:DELIVERED',
        subject: 'Package Delivered: Order #{{ORDER_ID}} Complete',
        message: 'Hello {{FIRST_NAME}},\n\nYour order #{{ORDER_ID}} ({{ITEMS}}) has been marked as delivered. We hope you love your items!\n\nIf you have any feedback or need assistance, please feel free to reach out to us at +233545247009.\n\nThank you for choosing London\'s Imports.',
        icon: CheckCircle,
        badge: 'Delivered Orders Only'
    },
    {
        id: 'weekly-drop',
        title: 'Weekly China Arrivals Drop',
        target: 'customers',
        subject: 'New Arrivals: Weekly China Shipment Just Dropped!',
        message: 'Hello {{FIRST_NAME}},\n\nOur latest weekly shipment of trending electronics, fashion, and home essentials has arrived from China!\n\nExplore all fresh arrivals and exclusive limited-quantity deals before they sell out:\nhttps://londonsimports.com/products\n\nHappy shopping,\nLondon\'s Imports Team',
        icon: Users,
        badge: 'All Customers'
    }
];

const SMS_TEMPLATES = [
    {
        id: 'sms-payment-reminder',
        title: 'Payment Reminder',
        target: 'state:PENDING_PAYMENT',
        message: "London's Imports: Hi {{FIRST_NAME}}, your order #{{ORDER_ID}} ({{ITEMS}}) has a pending balance of GHS {{AMOUNT_DUE}}. Pay securely via Momo here: {{PAY_URL}}",
        icon: CreditCard,
        badge: 'Unpaid Orders Only'
    },
    {
        id: 'sms-gz-arrived',
        title: 'Guangzhou Arrival',
        target: 'state:OPEN_FOR_BATCH',
        message: "London's Imports: Hi {{FIRST_NAME}}, your items ({{ITEMS}}) for order #{{ORDER_ID}} have arrived at our Guangzhou warehouse and are sorting for packing.",
        icon: Package,
        badge: 'GZ Warehouse Only'
    },
    {
        id: 'sms-container-loaded',
        title: 'Container Loaded',
        target: 'state:IN_FULFILLMENT',
        message: "London's Imports: Hi {{FIRST_NAME}}, order #{{ORDER_ID}} ({{ITEMS}}) is packed and loaded into the container batch. Preparing for customs & departure.",
        icon: FileText,
        badge: 'Loaded Batch Only'
    },
    {
        id: 'sms-in-transit',
        title: 'International Transit',
        target: 'state:IN_TRANSIT',
        message: "London's Imports: Hi {{FIRST_NAME}}, order #{{ORDER_ID}} ({{ITEMS}}) is now in international transit toward Ghana. We will alert you upon port arrival.",
        icon: Anchor,
        badge: 'In Transit Only'
    },
    {
        id: 'sms-ghana-arrived',
        title: 'Arrived at Accra Hub',
        target: 'state:ARRIVED',
        message: "London's Imports: Good news {{FIRST_NAME}}! Order #{{ORDER_ID}} ({{ITEMS}}) has arrived at our Accra Hub and passed sorting. Ready for pickup or delivery: https://maps.app.goo.gl/F32KNuagHcczTtsFA",
        icon: MapPin,
        badge: 'Arrived Hub Only'
    },
    {
        id: 'sms-out-for-delivery',
        title: 'Out for Delivery',
        target: 'state:OUT_FOR_DELIVERY',
        message: "London's Imports: Hi {{FIRST_NAME}}, your order #{{ORDER_ID}} ({{ITEMS}}) is out for delivery today with our dispatch courier! Please be on standby to receive your package.",
        icon: Package,
        badge: 'Out for Delivery Only'
    },
    {
        id: 'sms-delivered',
        title: 'Delivered / Completed',
        target: 'state:DELIVERED',
        message: "London's Imports: Order #{{ORDER_ID}} ({{ITEMS}}) has been delivered! Thank you for choosing London's Imports. For help, contact +233545247009.",
        icon: CheckCircle,
        badge: 'Delivered Orders Only'
    },
    {
        id: 'sms-flash-deal',
        title: 'Weekly China Arrivals Drop',
        target: 'customers',
        message: "London's Imports: New weekly China arrival drop is live! Browse discounted electronics & fashion items: https://londonsimports.com/products",
        icon: Users,
        badge: 'All Customers'
    }
];

const JOURNEY_FILTERS = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:PENDING_PAYMENT', label: 'Unpaid (Pending Payment)', icon: CreditCard },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded / Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana Hub', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Package },
    { key: 'state:DELIVERED', label: 'Delivered / Completed', icon: CheckCircle },
    { key: 'manual', label: 'Manual Email List', icon: Edit3 },
];

const SMS_JOURNEY_FILTERS = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:PENDING_PAYMENT', label: 'Unpaid (Pending Payment)', icon: CreditCard },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded / Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana Hub', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Package },
    { key: 'state:DELIVERED', label: 'Delivered / Completed', icon: CheckCircle },
    { key: 'manual', label: 'Manual Phone Numbers', icon: Edit3 },
];

export default function AdminBroadcastPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    // Channel switch: 'sms' | 'email'
    const [channel, setChannel] = useState<'sms' | 'email'>('sms');

    // Email state
    const [subject, setSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailTarget, setEmailTarget] = useState('customers');
    const [manualEmails, setManualEmails] = useState('');

    // SMS state
    const [smsMessage, setSmsMessage] = useState('');
    const [smsTarget, setSmsTarget] = useState('customers');
    const [manualPhones, setManualPhones] = useState('');

    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [dispatchModal, setDispatchModal] = useState<{
        isOpen: boolean;
        channel: 'sms' | 'email';
        target: string;
        audienceLabel: string;
        rawMessage: string;
        subject?: string;
        recipientCount: number | null;
        sampleRecipient: SampleRecipient | null;
        loadingCount: boolean;
        onConfirm: () => Promise<void>;
    }>({
        isOpen: false,
        channel: 'sms',
        target: 'customers',
        audienceLabel: '',
        rawMessage: '',
        recipientCount: null,
        sampleRecipient: null,
        loadingCount: false,
        onConfirm: async () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const applyEmailTemplate = (template: typeof LOGISTICS_TEMPLATES[0]) => {
        setSubject(template.subject);
        setEmailMessage(template.message);
        if (template.target) {
            setEmailTarget(template.target);
        }
    };

    const applySmsTemplate = (template: typeof SMS_TEMPLATES[0]) => {
        setSmsMessage(template.message);
        if (template.target) {
            setSmsTarget(template.target);
        }
    };

    const insertPlaceholder = (token: string) => {
        if (channel === 'sms') {
            setSmsMessage(prev => {
                const space = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
                return prev + space + token + ' ';
            });
        } else {
            setEmailMessage(prev => {
                const space = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
                return prev + space + token + ' ';
            });
        }
    };

    // SMS Segment Calculator
    const smsCharCount = smsMessage.length;
    const smsSegments = Math.max(1, Math.ceil(smsCharCount / 160));

    const handleWhatsAppExport = async () => {
        setSending(true);
        try {
            const activeTarget = channel === 'sms' ? smsTarget : emailTarget;
            const { data } = await adminAPI.getAudienceContacts(activeTarget);
            if (!data.contacts || data.contacts.length === 0) {
                addAlert('No phone numbers found for this audience.', 'error');
                return;
            }

            const phones = data.contacts.map((c: { phone: string }) => c.phone).join('\n');
            await navigator.clipboard.writeText(phones);
            addAlert(`${data.contacts.length} phone numbers copied to clipboard for WhatsApp Broadcast!`);
            
            if (data.contacts.length <= 5) {
                const multiLink = `https://wa.me/${data.contacts[0].phone}`;
                window.open(multiLink, '_blank');
            }
        } catch {
            addAlert('Failed to fetch audience contacts.', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!subject.trim() || !emailMessage.trim()) {
            addAlert('Please enter both subject and message body.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emails = emailTarget === 'manual' 
            ? manualEmails.split(/[\n,;]/).map(e => e.trim()).filter(e => emailRegex.test(e))
            : [];

        if (emailTarget === 'manual' && emails.length === 0) {
            addAlert('Please enter at least one valid email address.', 'error');
            return;
        }

        const audienceLabel = JOURNEY_FILTERS.find(f => f.key === emailTarget)?.label || emailTarget;

        setDispatchModal({
            isOpen: true,
            channel: 'email',
            target: emailTarget,
            audienceLabel,
            rawMessage: emailMessage,
            subject,
            recipientCount: emailTarget === 'manual' ? emails.length : null,
            sampleRecipient: emailTarget === 'manual' ? { name: 'Recipient', email: emails[0] } : null,
            loadingCount: emailTarget !== 'manual',
            onConfirm: async () => {
                setSending(true);
                setStatus(null);
                try {
                    const { data } = await adminAPI.sendBroadcastEmail({ 
                        subject, 
                        message: emailMessage, 
                        target: emailTarget,
                        emails 
                    });
                    
                    setStatus({ 
                        type: 'success', 
                        msg: data.message || 'Email broadcast initiated!' 
                    });
                    addAlert(data.message || 'Email broadcast initiated!');
                    
                    if (emailTarget === 'manual') setManualEmails('');
                    setSubject('');
                    setEmailMessage('');
                    setDispatchModal(prev => ({ ...prev, isOpen: false }));
                } catch (err: unknown) {
                    const error = err as { response?: { data?: { error?: string } }, message?: string };
                    const msg = error.response?.data?.error || error.message || 'Failed to initiate email broadcast';
                    setStatus({ type: 'error', msg });
                    addAlert(msg, 'error');
                } finally {
                    setSending(false);
                }
            }
        });

        if (emailTarget !== 'manual') {
            try {
                const { data } = await adminAPI.getAudienceContacts(emailTarget, 'email');
                setDispatchModal(prev => ({
                    ...prev,
                    recipientCount: data.count ?? (data.contacts ? data.contacts.length : 0),
                    sampleRecipient: data.sample || (data.samples && data.samples[0]) || null,
                    loadingCount: false
                }));
            } catch {
                setDispatchModal(prev => ({ ...prev, loadingCount: false }));
            }
        }
    };

    const handleSendSMS = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!smsMessage.trim()) {
            addAlert('Please enter an SMS message body.', 'error');
            return;
        }

        const phones = smsTarget === 'manual'
            ? manualPhones.split(/[\n,;]/).map(p => p.trim()).filter(p => p.length >= 9)
            : [];

        if (smsTarget === 'manual' && phones.length === 0) {
            addAlert('Please enter at least one valid Ghanaian phone number.', 'error');
            return;
        }

        const audienceLabel = SMS_JOURNEY_FILTERS.find(f => f.key === smsTarget)?.label || smsTarget;

        setDispatchModal({
            isOpen: true,
            channel: 'sms',
            target: smsTarget,
            audienceLabel,
            rawMessage: smsMessage,
            recipientCount: smsTarget === 'manual' ? phones.length : null,
            sampleRecipient: smsTarget === 'manual' ? { name: 'Recipient', phone: phones[0] } : null,
            loadingCount: smsTarget !== 'manual',
            onConfirm: async () => {
                setSending(true);
                setStatus(null);
                try {
                    const { data } = await adminAPI.sendBroadcastSMS({
                        message: smsMessage,
                        target: smsTarget,
                        phones
                    });

                    setStatus({
                        type: 'success',
                        msg: data.message || 'SMS broadcast initiated!'
                    });
                    addAlert(data.message || 'SMS broadcast initiated!');

                    if (smsTarget === 'manual') setManualPhones('');
                    setSmsMessage('');
                    setDispatchModal(prev => ({ ...prev, isOpen: false }));
                } catch (err: unknown) {
                    const error = err as { response?: { data?: { error?: string } }, message?: string };
                    const msg = error.response?.data?.error || error.message || 'Failed to initiate SMS broadcast';
                    setStatus({ type: 'error', msg });
                    addAlert(msg, 'error');
                } finally {
                    setSending(false);
                }
            }
        });

        if (smsTarget !== 'manual') {
            try {
                const { data } = await adminAPI.getAudienceContacts(smsTarget, 'sms');
                setDispatchModal(prev => ({
                    ...prev,
                    recipientCount: data.count ?? (data.contacts ? data.contacts.length : 0),
                    sampleRecipient: data.sample || (data.samples && data.samples[0]) || null,
                    loadingCount: false
                }));
            } catch {
                setDispatchModal(prev => ({ ...prev, loadingCount: false }));
            }
        }
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Top Minimalist Header & Channel Navigation */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200/80'
            }`}>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.back()} 
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isDark 
                                ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white' 
                                : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`} 
                        title="Go back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">HUBTEL / RESEND</span>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase">Live Gateway</span>
                        </div>
                        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Customer Communications
                        </h1>
                    </div>
                </div>

                {/* Minimalist Channel Selector Tabs */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className={`inline-flex items-center p-1 rounded-lg border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200/80'
                    }`}>
                        <button
                            type="button"
                            onClick={() => { setChannel('sms'); setShowPreview(false); }}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                channel === 'sms'
                                    ? `${isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'}`
                                    : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            SMS Gateway
                        </button>
                        <button
                            type="button"
                            onClick={() => { setChannel('email'); setShowPreview(false); }}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                channel === 'email'
                                    ? `${isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'}`
                                    : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`
                            }`}
                        >
                            <Mail className="w-3.5 h-3.5 text-pink-500" />
                            Email (Resend)
                        </button>
                    </div>

                    {status && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border ${
                                status.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40' 
                                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
                            }`}
                        >
                            {status.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{status.msg}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Target Audience & Quick Templates */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Audience Selector Card */}
                    <div className={`p-5 rounded-xl border ${
                        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
                    }`}>
                        <div className="flex items-center justify-between mb-3.5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Target Audience
                            </h2>
                            <span className="font-mono text-[10px] text-slate-400">
                                {(channel === 'email' ? JOURNEY_FILTERS : SMS_JOURNEY_FILTERS).length} cohorts
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            {(channel === 'email' ? JOURNEY_FILTERS : SMS_JOURNEY_FILTERS).map((filter) => {
                                const Icon = filter.icon;
                                const activeTarget = channel === 'email' ? emailTarget : smsTarget;
                                const isActive = activeTarget === filter.key;
                                return (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => {
                                            if (channel === 'email') setEmailTarget(filter.key);
                                            else setSmsTarget(filter.key);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? `${isDark ? 'bg-white text-slate-900 border-white font-semibold shadow-xs' : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'}`
                                                : `${isDark ? 'border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'}`
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? (isDark ? 'text-slate-900' : 'text-white') : 'text-slate-400'}`} />
                                            <span className="truncate">{filter.label}</span>
                                        </div>
                                        {isActive && (
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Templates Card */}
                    <div className={`p-5 rounded-xl border ${
                        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
                    }`}>
                        <div className="flex items-center justify-between mb-3.5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Quick Templates
                            </h2>
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                                {channel}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            {channel === 'email' ? (
                                LOGISTICS_TEMPLATES.map((tpl) => {
                                    const Icon = tpl.icon;
                                    return (
                                        <button
                                            key={tpl.id}
                                            type="button"
                                            onClick={() => applyEmailTemplate(tpl)}
                                            className={`group w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                                isDark 
                                                    ? 'border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40' 
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`p-1.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs font-medium truncate">{tpl.title}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 truncate">{tpl.badge}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 shrink-0" />
                                        </button>
                                    );
                                })
                            ) : (
                                SMS_TEMPLATES.map((tpl) => {
                                    const Icon = tpl.icon;
                                    return (
                                        <button
                                            key={tpl.id}
                                            type="button"
                                            onClick={() => applySmsTemplate(tpl)}
                                            className={`group w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                                isDark 
                                                    ? 'border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40' 
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`p-1.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs font-medium truncate">{tpl.title}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 truncate">{tpl.badge}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 shrink-0" />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sleek Message Composer & Device Preview */}
                <div className="lg:col-span-8 space-y-6">
                    <div className={`p-6 sm:p-8 rounded-xl border ${
                        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
                    }`}>
                        {/* Composer Header */}
                        <div className={`flex items-center justify-between pb-4 mb-6 border-b ${
                            isDark ? 'border-slate-800' : 'border-slate-100'
                        }`}>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    {channel === 'sms' ? 'SMS Message Composer' : 'Email Dispatcher'}
                                </h2>
                                {channel === 'sms' && (
                                    <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                                        Sender: LondonsImp
                                    </span>
                                )}
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                                    <span className="text-slate-400 uppercase font-mono tracking-wider text-[9px]">Targeting:</span>
                                    <span className="font-semibold">
                                        {channel === 'email' 
                                            ? (JOURNEY_FILTERS.find(f => f.key === emailTarget)?.label || emailTarget)
                                            : (SMS_JOURNEY_FILTERS.find(f => f.key === smsTarget)?.label || smsTarget)
                                        }
                                    </span>
                                    {(channel === 'email' ? emailTarget : smsTarget).startsWith('state:') && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                            Cohort Isolated
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                                    showPreview 
                                        ? `${isDark ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-white border-slate-900'}` 
                                        : `${isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`
                                }`}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{showPreview ? 'Edit Message' : 'Preview'}</span>
                            </button>
                        </div>

                        {/* Interactive Mode: Preview vs Editor */}
                        <AnimatePresence mode="wait">
                            {showPreview ? (
                                <motion.div 
                                    key="preview-pane"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="py-4"
                                >
                                    {channel === 'email' ? (
                                        <div className={`rounded-xl border p-6 sm:p-8 space-y-4 ${
                                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                                        }`}>
                                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">London&apos;s Imports</p>
                                                    <p className="text-[11px] text-slate-400 font-mono">To: {emailTarget}@cohort</p>
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400">Via Resend API</span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                {subject
                                                    .replace(/\{\{FIRST_NAME\}\}/g, 'Kofi')
                                                    .replace(/\{\{ORDER_ID\}\}/g, 'LI-2026-0042')
                                                    .replace(/\{\{ITEMS\}\}/g, '1x Pleated Skirt, 2x Chunky Loafers')
                                                    .replace(/\{\{AMOUNT_DUE\}\}/g, '145.00')
                                                    .replace(/\{\{PAY_URL\}\}/g, 'https://londonsimports.com/orders/LI-2026-0042') || '(No subject provided)'}
                                            </h3>
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                                                {emailMessage
                                                    .replace(/\{\{FIRST_NAME\}\}/g, 'Kofi')
                                                    .replace(/\{\{ORDER_ID\}\}/g, 'LI-2026-0042')
                                                    .replace(/\{\{ITEMS\}\}/g, '1x Pleated Skirt, 2x Chunky Loafers')
                                                    .replace(/\{\{AMOUNT_DUE\}\}/g, '145.00')
                                                    .replace(/\{\{PAY_URL\}\}/g, 'https://londonsimports.com/orders/LI-2026-0042') || '(Enter your email message body in edit mode...)'}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Minimalist Realistic SMS Mockup */
                                        <div className="max-w-sm mx-auto bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span className="text-xs font-bold tracking-tight text-slate-200">LondonsImp</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400">SMS Gateway</span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="bg-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs text-xs leading-relaxed font-normal shadow-xs">
                                                    {smsMessage
                                                        .replace(/\{\{FIRST_NAME\}\}/g, 'Kofi')
                                                        .replace(/\{\{ORDER_ID\}\}/g, 'LI-2026-0042')
                                                        .replace(/\{\{ITEMS\}\}/g, '1x Pleated Skirt, 2x Chunky Loafers')
                                                        .replace(/\{\{AMOUNT_DUE\}\}/g, '145.00')
                                                        .replace(/\{\{PENDING_AMOUNT\}\}/g, '145.00')
                                                        .replace(/\{\{PAY_URL\}\}/g, 'https://londonsimports.com/orders/LI-2026-0042') || 'Type your message in edit mode to see the live SMS delivery preview...'}
                                                </div>
                                                <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-mono">
                                                    <span>Delivered · Just now</span>
                                                    <span>{smsCharCount} chars · {smsSegments} segment{smsSegments > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                channel === 'email' ? (
                                    /* Email Composer Form */
                                    <motion.form 
                                        key="email-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSendEmail} 
                                        className="space-y-5"
                                     >
                                        {emailTarget === 'manual' && (
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Manual Recipient Emails
                                                </label>
                                                <textarea
                                                    value={manualEmails}
                                                    onChange={(e) => setManualEmails(e.target.value)}
                                                    rows={3}
                                                    className={`w-full p-3 rounded-lg border text-xs font-mono outline-none transition-colors resize-none ${
                                                        isDark 
                                                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
                                                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900'
                                                    }`}
                                                    placeholder="customer1@example.com, customer2@example.com..."
                                                    required={emailTarget === 'manual'}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Subject Line
                                            </label>
                                            <input
                                                id="subject"
                                                type="text"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium outline-none transition-colors ${
                                                    isDark 
                                                        ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
                                                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900'
                                                }`}
                                                placeholder="e.g. Action Required: Complete Payment for Order #{{ORDER_ID}}"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Message Body
                                                </label>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[10px] text-slate-400 font-mono">Insert:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{FIRST_NAME}}')}
                                                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{FIRST_NAME}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{ORDER_ID}}')}
                                                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{ORDER_ID}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{ITEMS}}')}
                                                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{ITEMS}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{AMOUNT_DUE}}')}
                                                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{AMOUNT_DUE}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{PAY_URL}}')}
                                                        className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{PAY_URL}}'}
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                id="message"
                                                rows={9}
                                                value={emailMessage}
                                                onChange={(e) => setEmailMessage(e.target.value)}
                                                className={`w-full p-4 rounded-lg border text-sm leading-relaxed outline-none transition-colors resize-y font-normal ${
                                                    isDark 
                                                        ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
                                                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900'
                                                }`}
                                                placeholder="Type your broadcast email message here. HTML and Markdown formatting supported."
                                                required
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={sending}
                                                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>{sending ? 'Sending...' : 'Send Broadcast Email'}</span>
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={handleWhatsAppExport}
                                                disabled={sending || emailTarget === 'manual'}
                                                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                    isDark 
                                                        ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800' 
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                } ${emailTarget === 'manual' ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>{sending ? 'Exporting...' : 'Export WhatsApp Numbers'}</span>
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    /* SMS Composer Form */
                                    <motion.form 
                                        key="sms-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSendSMS} 
                                        className="space-y-5"
                                    >
                                        {smsTarget === 'manual' && (
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Manual Ghanaian Phone Numbers (Comma separated or new line)
                                                </label>
                                                <textarea
                                                    value={manualPhones}
                                                    onChange={(e) => setManualPhones(e.target.value)}
                                                    rows={3}
                                                    className={`w-full p-3 rounded-lg border text-xs font-mono outline-none transition-colors resize-none ${
                                                        isDark 
                                                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
                                                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900'
                                                    }`}
                                                    placeholder="0244123456, 0559988776, 0501112233..."
                                                    required={smsTarget === 'manual'}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <label htmlFor="sms-message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    SMS Message Content
                                                </label>
                                                
                                                {/* Clickable Quick Tokens */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[10px] text-slate-400 font-mono">Insert Token:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{FIRST_NAME}}')}
                                                        className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{FIRST_NAME}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{ORDER_ID}}')}
                                                        className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{ORDER_ID}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{ITEMS}}')}
                                                        className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{ITEMS}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{AMOUNT_DUE}}')}
                                                        className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{AMOUNT_DUE}}'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertPlaceholder('{{PAY_URL}}')}
                                                        className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        + {'{{PAY_URL}}'}
                                                    </button>
                                                </div>
                                            </div>

                                            <textarea
                                                id="sms-message"
                                                rows={7}
                                                value={smsMessage}
                                                onChange={(e) => setSmsMessage(e.target.value)}
                                                className={`w-full p-4 rounded-lg border text-sm leading-relaxed outline-none transition-colors resize-y font-normal ${
                                                    isDark 
                                                        ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
                                                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900'
                                                }`}
                                                placeholder="Type SMS broadcast message here. Available placeholders: {{FIRST_NAME}}, {{ORDER_ID}}, {{ITEMS}}, {{AMOUNT_DUE}}, {{PAY_URL}}..."
                                                required
                                            />
                                            
                                            {/* Minimalist Segment & Character Counter */}
                                            <div className="flex items-center justify-between pt-1 px-1">
                                                <span className="text-[11px] text-slate-400">
                                                    Standard billing: 160 characters per SMS segment
                                                </span>
                                                <span className={`font-mono text-xs font-semibold ${
                                                    smsCharCount > 160 
                                                        ? 'text-amber-600 dark:text-amber-400' 
                                                        : 'text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {smsCharCount} / 160 chars · {smsSegments} segment{smsSegments > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={sending}
                                                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>{sending ? 'Dispatching...' : `Dispatch SMS (${smsSegments} Segment${smsSegments > 1 ? 's' : ''})`}</span>
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={handleWhatsAppExport}
                                                disabled={sending || smsTarget === 'manual'}
                                                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                    isDark 
                                                        ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800' 
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                } ${smsTarget === 'manual' ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>{sending ? 'Exporting...' : 'Export WhatsApp Numbers'}</span>
                                            </button>
                                        </div>
                                    </motion.form>
                                )
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Anti-Spam & Delivery Notice Card */}
                    <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                        isDark 
                            ? 'bg-slate-900/30 border-slate-800 text-slate-400' 
                            : 'bg-slate-50/70 border-slate-200/70 text-slate-600'
                    }`}>
                        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                Anti-Spam & Delivery Safeguards
                            </p>
                            <p className="text-[11px] leading-relaxed text-slate-500">
                                Automated payment reminders are strictly rate-limited to <strong>at most once per order</strong> to protect customer trust. Outbound SMS is dispatched through the Hubtel API using the registered alphanumeric Sender ID <code className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">LondonsImp</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimalist Dispatch Verification Modal */}
            <BroadcastDispatchModal
                isOpen={dispatchModal.isOpen}
                onClose={() => setDispatchModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={dispatchModal.onConfirm}
                channel={dispatchModal.channel}
                target={dispatchModal.target}
                audienceLabel={dispatchModal.audienceLabel}
                rawMessage={dispatchModal.rawMessage}
                subject={dispatchModal.subject}
                smsCharCount={smsCharCount}
                smsSegments={smsSegments}
                recipientCount={dispatchModal.recipientCount}
                sampleRecipient={dispatchModal.sampleRecipient}
                loadingCount={dispatchModal.loadingCount}
                sending={sending}
            />

            {/* Notification Toasts */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
