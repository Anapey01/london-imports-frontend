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
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';

const LOGISTICS_TEMPLATES = [
    {
        id: 'gz-arrived',
        title: 'Guangzhou Arrival',
        subject: 'Shipment Update: Goods Arrived at Guangzhou Warehouse',
        message: 'Hello,\n\nWe are pleased to inform you that your items have been successfully received and sorted at our Guangzhou Sorting Facility. They are now being prepared for the next available shipment batch.\n\nThank you for choosing London\'s Imports.',
        icon: Package
    },
    {
        id: 'container-loaded',
        title: 'Container Loaded',
        subject: 'Logistics Update: Your Shipment is Now Loaded',
        message: 'Hello,\n\nGood news! Your items have been securely packed and loaded into our current container batch. The shipment is now finalizing documentation and will be on the water/air shortly.\n\nStay tuned for further updates.',
        icon: FileText
    },
    {
        id: 'transit-start',
        title: 'Transit (On Water)',
        subject: 'Transit Update: Goods are on the way to Ghana',
        message: 'Hello,\n\nYour shipment has officially departed and is currently in international transit toward Tema Port. Approximate transit times: Air (7-14 days), Sea (30-45 days).\n\nWe will notify you the moment it docks in Ghana.',
        icon: Anchor
    },
    {
        id: 'ghana-arrived',
        title: 'Arrived in Ghana',
        subject: 'Shipment Arrival: Your items are now at London\'s Imports!',
        message: 'Hello,\n\nGreat news! Your shipment has successfully arrived at London\'s Imports in Ghana and has been sorted.\n\nYou can now come for collection at our center or wait for our last-mile delivery team to contact you.\n\nLocation: https://maps.app.goo.gl/F32KNuagHcczTtsFA\n\nThank you for your patience.',
        icon: Map
    },
    {
        id: 'tema-port',
        title: 'Tema Port / Customs',
        subject: 'Ghana Update: Shipment Arrived at Tema Port',
        message: 'Hello,\n\nYour shipment has successfully docked at Tema Port! Customs clearance is now underway. This process typically takes 3-7 business days depending on port congestion.\n\nWe are working hard to get your items released soon.',
        icon: Anchor
    },
    {
        id: 'ready-delivery',
        title: 'Ready for Collection',
        subject: 'Order Ready: Come pick up your items!',
        message: 'Hello,\n\nGreat news! Your order is now cleared and ready for collection at London\'s Imports. If you requested doorstep delivery, our courier will be in touch with you shortly.\n\nPlease remember to bring your Order ID.',
        icon: CheckCircle
    },
    {
        id: 'payment-reminder',
        title: 'Payment Reminder',
        subject: 'Action Required: Balance Due for Delivery',
        message: 'Hello,\n\nThis is a friendly reminder that a balance remains due on your order #{{ORDER_ID}}. Please complete your payment via the dashboard to ensure there are no delays in releasing your items for delivery.\n\nYou can pay quickly with Momo on the site.',
        icon: CreditCard
    }
];

const SMS_TEMPLATES = [
    {
        id: 'sms-payment-reminder',
        title: 'Payment Reminder (1-Time)',
        message: 'London\'s Imports: Hi {{FIRST_NAME}}, friendly reminder that order #{{ORDER_ID}} has an unpaid balance. Complete payment with Momo here: https://londonsimports.com/orders/{{ORDER_ID}}',
        icon: CreditCard,
        badge: 'Anti-Spam Protected'
    },
    {
        id: 'sms-ghana-arrived',
        title: 'Arrived at Accra Hub',
        message: 'London\'s Imports: Good news! Your order #{{ORDER_ID}} has arrived at our Accra Hub and passed sorting. Call/WhatsApp +233545247009 for pickup or delivery.',
        icon: MapPin,
        badge: 'Logistics Alert'
    },
    {
        id: 'sms-out-for-delivery',
        title: 'Out for Delivery',
        message: 'London\'s Imports: Your order #{{ORDER_ID}} is out for delivery today with our dispatch courier! Please be on standby to receive your package.',
        icon: Package,
        badge: 'Courier Alert'
    },
    {
        id: 'sms-flash-deal',
        title: 'Arrival Drop / Promo',
        message: 'London\'s Imports: New weekly China arrival drop is live! Browse discounted electronics & fashion items: https://londonsimports.com/products',
        icon: CheckCircle,
        badge: 'Announcement'
    }
];

const JOURNEY_FILTERS = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded/Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Anchor },
    { key: 'manual', label: 'Manual Email List', icon: Edit3 },
];

const SMS_JOURNEY_FILTERS = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:PENDING_PAYMENT', label: 'Unpaid (Pending Payment)', icon: CreditCard },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana Hub', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Package },
    { key: 'state:IN_TRANSIT', label: 'In Transit from China', icon: Anchor },
    { key: 'manual', label: 'Manual Phone Numbers', icon: Edit3 },
];

export default function AdminBroadcastPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    // Channel switch: 'email' | 'sms'
    const [channel, setChannel] = useState<'email' | 'sms'>('email');

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
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
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
    };

    const applySmsTemplate = (template: typeof SMS_TEMPLATES[0]) => {
        setSmsMessage(template.message);
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

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        
        const audienceLabel = JOURNEY_FILTERS.find(f => f.key === emailTarget)?.label || emailTarget;
        
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Email Broadcast',
            message: `Are you sure you want to send this email broadcast to [${audienceLabel}] via Resend? This runs as a background process.`,
            variant: 'warning',
            onConfirm: async () => {
                setSending(true);
                setStatus(null);
                
                try {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const emails = emailTarget === 'manual' 
                        ? manualEmails.split(/[\n,;]/).map(e => e.trim()).filter(e => emailRegex.test(e))
                        : [];

                    if (emailTarget === 'manual' && emails.length === 0) {
                        throw new Error('Please enter at least one valid email address.');
                    }

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
    };

    const handleSendSMS = (e: React.FormEvent) => {
        e.preventDefault();

        if (!smsMessage.trim()) {
            addAlert('Please enter an SMS message body.', 'error');
            return;
        }

        const audienceLabel = SMS_JOURNEY_FILTERS.find(f => f.key === smsTarget)?.label || smsTarget;

        setConfirmModal({
            isOpen: true,
            title: 'Confirm SMS Broadcast (Hubtel Gateway)',
            message: `Send SMS to [${audienceLabel}]? Message length: ${smsCharCount} chars (${smsSegments} segment${smsSegments > 1 ? 's' : ''} per user). Sender ID: LondonsImp.`,
            variant: 'warning',
            onConfirm: async () => {
                setSending(true);
                setStatus(null);

                try {
                    const phones = smsTarget === 'manual'
                        ? manualPhones.split(/[\n,;]/).map(p => p.trim()).filter(p => p.length >= 9)
                        : [];

                    if (smsTarget === 'manual' && phones.length === 0) {
                        throw new Error('Please enter at least one valid Ghanaian phone number.');
                    }

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
    };

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Top Bar */}
            <div className={`sticky top-0 z-20 px-4 py-4 border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`} title="Go back">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Broadcast Command Center
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">Multi-Channel Customer Comms</p>
                        </div>
                    </div>

                    {/* Channel Selector */}
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => { setChannel('email'); setShowPreview(false); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                channel === 'email'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Mail className="w-4 h-4 text-pink-500" />
                            Email (Resend)
                        </button>
                        <button
                            type="button"
                            onClick={() => { setChannel('sms'); setShowPreview(false); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                channel === 'sms'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            SMS (Hubtel Gateway)
                        </button>
                    </div>

                    {status && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:text-emerald-500' : 'bg-red-50 text-red-600'
                            }`}
                        >
                            {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.msg}
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Templates & Filters */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Target Section */}
                        <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <h3 className={`text-xs font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                01. Target Audience
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
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
                                            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                                                isActive
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg dark:bg-slate-950 dark:border-emerald-500'
                                                : `${isDark ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? (channel === 'email' ? 'text-pink-400' : 'text-emerald-400') : ''}`} />
                                            <span className="text-sm font-semibold">{filter.label}</span>
                                            {isActive && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${channel === 'email' ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Templates Section */}
                        <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-xs font-black uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    02. Preset Templates
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {channel.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {channel === 'email' ? (
                                    LOGISTICS_TEMPLATES.map((tpl) => {
                                        const Icon = tpl.icon;
                                        return (
                                            <button
                                                key={tpl.id}
                                                type="button"
                                                onClick={() => applyEmailTemplate(tpl)}
                                                className={`group flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                                                    isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-gray-50 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                                    <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-500" />
                                                </div>
                                                <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{tpl.title}</span>
                                                <ArrowRight className="ml-auto w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
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
                                                className={`group flex flex-col gap-1.5 p-3 rounded-2xl border text-left transition-all ${
                                                    isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-gray-50 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                                        <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500" />
                                                    </div>
                                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{tpl.title}</span>
                                                    <ArrowRight className="ml-auto w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-emerald-500" />
                                                </div>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium ml-1">
                                                    {tpl.badge}
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Message Editor & Preview */}
                    <div className="lg:col-span-8">
                        <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <h3 className={`text-xs font-black uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                        03. {channel === 'email' ? 'Email Dispatch' : 'SMS Dispatch (Hubtel)'}
                                    </h3>
                                    {channel === 'sms' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20">
                                            Sender: LondonsImp
                                        </span>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="px-4 py-1.5 rounded-full bg-gray-50 dark:bg-slate-700 text-[10px] font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    {showPreview ? 'EDIT MODE' : 'DEVICE PREVIEW'}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {showPreview ? (
                                    <motion.div 
                                        key="preview"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className={`rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100 shadow-inner'} p-8 min-h-[350px]`}
                                    >
                                        {channel === 'email' ? (
                                            <div>
                                                <div className="mb-8 flex items-center gap-4 text-xs">
                                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                                                    <div>
                                                        <p className="font-bold">London&apos;s Imports Command</p>
                                                        <p className="text-gray-400 lowercase">To: {emailTarget}@users</p>
                                                    </div>
                                                </div>
                                                <h2 className="text-xl font-bold mb-4">{subject || '(No Subject)'}</h2>
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed font-light text-gray-600 dark:text-slate-300">
                                                    {emailMessage || '(Enter your message in Edit Mode...)'}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Phone SMS Mockup */
                                            <div className="max-w-sm mx-auto bg-slate-950 text-white rounded-[2.5rem] p-6 shadow-2xl border-4 border-slate-800">
                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-xs font-black uppercase tracking-wider">LondonsImp</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500">SMS Gateway</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="bg-slate-800/90 text-slate-100 p-4 rounded-2xl rounded-tl-sm text-xs leading-relaxed font-medium shadow-sm">
                                                        {smsMessage
                                                            .replace('{{FIRST_NAME}}', 'Kofi')
                                                            .replace('{{ORDER_ID}}', 'LI-2026-0042') || 'Type your message in edit mode to see the live SMS preview...'}
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 text-right pr-2">
                                                        {smsCharCount} chars · {smsSegments} segment{smsSegments > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    channel === 'email' ? (
                                        /* Email Form */
                                        <motion.form 
                                            key="email-form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSendEmail} 
                                            className="space-y-6"
                                        >
                                            {emailTarget === 'manual' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-2"
                                                >
                                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                        Paste Recipient Emails (Comma separated or new lines)
                                                    </label>
                                                    <textarea
                                                        value={manualEmails}
                                                        onChange={(e) => setManualEmails(e.target.value)}
                                                        className={`w-full h-32 p-6 rounded-2xl border outline-none transition-all resize-none text-sm font-medium ${
                                                            isDark 
                                                            ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-emerald-500' 
                                                            : 'bg-white border-gray-100 text-emerald-700 dark:text-emerald-500 focus:border-emerald-500 shadow-sm'
                                                        }`}
                                                        placeholder="customer1@example.com, customer2@example.com..."
                                                        required={emailTarget === 'manual'}
                                                    />
                                                </motion.div>
                                            )}

                                            <div>
                                                <input
                                                    id="subject"
                                                    type="text"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    className={`w-full p-6 text-xl font-bold rounded-2xl border outline-none transition-all ${
                                                        isDark 
                                                        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' 
                                                        : 'bg-white border-gray-100 text-gray-900 focus:border-pink-500 shadow-sm'
                                                    }`}
                                                    placeholder="Enter Email Subject Line"
                                                    required
                                                />
                                            </div>

                                            <div className="relative">
                                                <textarea
                                                    id="message"
                                                    value={emailMessage}
                                                    onChange={(e) => setEmailMessage(e.target.value)}
                                                    className={`w-full h-80 p-8 rounded-[2rem] border outline-none transition-all resize-none text-base font-light leading-relaxed ${
                                                        isDark 
                                                        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' 
                                                        : 'bg-white border-gray-100 text-gray-900 focus:border-pink-500 shadow-sm'
                                                    }`}
                                                    placeholder="Message body. HTML supported... Use {{ORDER_ID}} as placeholder."
                                                    required
                                                />
                                                <div className="absolute right-4 bottom-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-gray-400 pointer-events-none">
                                                    Markdown & HTML Ready
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                <button
                                                    type="submit"
                                                    disabled={sending}
                                                    className={`flex-1 w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest transition-all ${
                                                        sending ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'bg-gray-900 hover:bg-black shadow-xl shadow-gray-900/10'
                                                    }`}
                                                >
                                                    <Send className="w-5 h-5 text-pink-400" />
                                                    {sending ? 'SENDING EMAILS...' : 'SEND BROADCAST EMAIL'}
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={handleWhatsAppExport}
                                                    disabled={sending || emailTarget === 'manual'}
                                                    className={`px-8 py-5 rounded-[2rem] border font-bold text-xs uppercase tracking-widest transition-all ${
                                                        isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    } ${emailTarget === 'manual' ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                >
                                                    {sending ? 'FETCHING...' : 'WhatsApp Contact List'}
                                                </button>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        /* SMS Form */
                                        <motion.form 
                                            key="sms-form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSendSMS} 
                                            className="space-y-6"
                                        >
                                            {smsTarget === 'manual' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-2"
                                                >
                                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                        Paste Recipient Ghanaian Phone Numbers (024..., 055..., +233...)
                                                    </label>
                                                    <textarea
                                                        value={manualPhones}
                                                        onChange={(e) => setManualPhones(e.target.value)}
                                                        className={`w-full h-28 p-6 rounded-2xl border outline-none transition-all resize-none text-sm font-medium ${
                                                            isDark 
                                                            ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-emerald-500' 
                                                            : 'bg-white border-gray-100 text-emerald-700 dark:text-emerald-500 focus:border-emerald-500 shadow-sm'
                                                        }`}
                                                        placeholder="0244123456, 0559988776, 0501112233..."
                                                        required={smsTarget === 'manual'}
                                                    />
                                                </motion.div>
                                            )}

                                            <div className="relative">
                                                <textarea
                                                    id="sms-message"
                                                    value={smsMessage}
                                                    onChange={(e) => setSmsMessage(e.target.value)}
                                                    className={`w-full h-64 p-8 rounded-[2rem] border outline-none transition-all resize-none text-base font-medium leading-relaxed ${
                                                        isDark 
                                                        ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                                                        : 'bg-white border-gray-100 text-gray-900 focus:border-emerald-500 shadow-sm'
                                                    }`}
                                                    placeholder="Type SMS message. Available placeholders: {{FIRST_NAME}}, {{ORDER_ID}}..."
                                                    required
                                                />
                                                
                                                {/* Segment Counter */}
                                                <div className="absolute right-4 bottom-4 flex items-center gap-3">
                                                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                                        smsCharCount <= 160
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                                                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {smsCharCount} / 160 chars · {smsSegments} segment{smsSegments > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                <button
                                                    type="submit"
                                                    disabled={sending}
                                                    className={`flex-1 w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest transition-all ${
                                                        sending ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20'
                                                    }`}
                                                >
                                                    <Send className="w-5 h-5 text-white" />
                                                    {sending ? 'DISPATCHING SMS...' : `DISPATCH SMS VIA HUBTEL (${smsSegments} SEGMENT${smsSegments > 1 ? 'S' : ''})`}
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={handleWhatsAppExport}
                                                    disabled={sending || smsTarget === 'manual'}
                                                    className={`px-8 py-5 rounded-[2rem] border font-bold text-xs uppercase tracking-widest transition-all ${
                                                        isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    } ${smsTarget === 'manual' ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                >
                                                    {sending ? 'FETCHING...' : 'WhatsApp Contact List'}
                                                </button>
                                            </div>
                                        </motion.form>
                                    )
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Anti-Spam & Operational Notice */}
                        <div className={`mt-8 p-6 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 flex gap-4`}>
                            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed font-medium space-y-1">
                                <p><strong>Anti-Spam Safeguards Active:</strong> Automated payment reminders are strictly rate-limited to <strong>only once per order</strong> so customers are never spammed.</p>
                                <p><strong>Hubtel Gateway Specifications:</strong> Sender ID is registered as <code>LondonsImp</code>. Ghana telcos bill per 160-character segment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
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
