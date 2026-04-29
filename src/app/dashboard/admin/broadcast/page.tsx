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
    ArrowRight,
    Eye,
    Edit3
} from 'lucide-react';

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
        message: 'Hello,\n\nGreat news! Your order is now cleared and ready for collection at our London\'s Imports Hub. If you requested doorstep delivery, our courier will be in touch with you shortly.\n\nPlease remember to bring your Order ID.',
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

const JOURNEY_FILTERS = [
    { key: 'all', label: 'All Users', icon: Users },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded/Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Port Clearance', icon: Anchor },
    { key: 'manual', label: 'Manual Email List', icon: Edit3 },
];

export default function AdminBroadcastPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('customers');
    const [manualEmails, setManualEmails] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const applyTemplate = (template: typeof LOGISTICS_TEMPLATES[0]) => {
        setSubject(template.subject);
        setMessage(template.message);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const audienceLabel = JOURNEY_FILTERS.find(f => f.key === target)?.label || target;
        if (!confirm(`Are you sure you want to send this broadcast to [${audienceLabel}]?`)) return;
        
        setSending(true);
        setStatus(null);
        
        try {
            // Parse manual emails if needed
            const emails = target === 'manual' 
                ? manualEmails.split(/[\n,;]/).map(e => e.trim()).filter(e => e.includes('@'))
                : [];

            if (target === 'manual' && emails.length === 0) {
                throw new Error('Please enter at least one valid email address.');
            }

            const { data } = await adminAPI.sendBroadcastEmail({ 
                subject, 
                message, 
                target,
                emails 
            });
            
            setStatus({ 
                type: 'success', 
                msg: data.message || 'Broadcast dispatched successfully!' 
            });
            
            if (target === 'manual') setManualEmails('');
            setSubject('');
            setMessage('');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            setStatus({ 
                type: 'error', 
                msg: error.response?.data?.error || error.message || 'Failed to send broadcast' 
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className={`sticky top-0 z-20 px-4 py-4 border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`} title="Go back">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Broadcast Command Center
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-pink-500">Logistics Mass-Comms</p>
                        </div>
                    </div>
                    {status && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                                status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
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
                                01. Precise Audience Target
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {JOURNEY_FILTERS.map((filter) => {
                                    const Icon = filter.icon;
                                    const isActive = target === filter.key;
                                    return (
                                        <button
                                            key={filter.key}
                                            type="button"
                                            onClick={() => setTarget(filter.key)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                                                isActive
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                                                : `${isDark ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : ''}`} />
                                            <span className="text-sm font-semibold">{filter.label}</span>
                                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Templates Section */}
                        <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <h3 className={`text-xs font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                02. Smart Template Library
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {LOGISTICS_TEMPLATES.map((tpl) => {
                                    const Icon = tpl.icon;
                                    return (
                                        <button
                                            key={tpl.id}
                                            type="button"
                                            onClick={() => applyTemplate(tpl)}
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
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Message Editor & Preview */}
                    <div className="lg:col-span-8">
                        <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className={`text-xs font-black uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    03. Message Dispatch
                                </h3>
                                <button 
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="px-4 py-1.5 rounded-full bg-gray-50 dark:bg-slate-700 text-[10px] font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    {showPreview ? 'EDIT MODE' : 'DRAFT PREVIEW'}
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
                                        <div className="mb-8 flex items-center gap-4 text-xs">
                                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                                            <div>
                                                <p className="font-bold">London's Imports Command</p>
                                                <p className="text-gray-400 lowercase">To: {target}@users</p>
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold mb-4">{subject || '(No Subject)'}</h2>
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed font-light text-gray-600 dark:text-slate-300">
                                            {message || '(Enter your message in Edit Mode...)'}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSend} 
                                        className="space-y-6"
                                    >
                                        {target === 'manual' && (
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
                                                        : 'bg-white border-gray-100 text-emerald-600 focus:border-emerald-500 shadow-sm'
                                                    }`}
                                                    placeholder="customer1@example.com, customer2@example.com..."
                                                    required={target === 'manual'}
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
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
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
                                                <Send className="w-5 h-5 text-emerald-400" />
                                                {sending ? 'COMMENCING DISPATCH...' : 'EXECUTE BROADCAST'}
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => {/* Copy phones logic */}}
                                                className={`px-8 py-5 rounded-[2rem] border font-bold text-xs uppercase tracking-widest transition-all ${
                                                    isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                WhatsApp Link Hub
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Safety Note */}
                        <div className={`mt-8 p-6 rounded-[2.5rem] bg-amber-50/50 dark:bg-amber-900/5 border border-amber-100/50 flex gap-4`}>
                            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                            <div className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                                <strong>Precision Targeting Active:</strong> Executing a broadcast will notify only the selected audience via Resend. 
                                Targets starting with <code>state:</code> automatically filter users based on their current order journey stage. 
                                <strong>Manual Mode:</strong> Privacy safe—only the emails you paste will be contacted.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
