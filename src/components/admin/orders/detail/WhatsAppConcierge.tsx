import { useState, useEffect } from 'react';
import { MessageSquare, Send, HelpCircle, FileText } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface WhatsAppConciergeProps {
    order: OrderDetail;
    isDark: boolean;
}

interface Template {
    id: string;
    name: string;
    description: string;
    templateText: string;
}

export function WhatsAppConcierge({ order, isDark }: WhatsAppConciergeProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('restored_order');
    const [messageContent, setMessageContent] = useState<string>('');

    const firstItemName = order.items?.[0]?.product_name || 'your items';
    const formattedAmountPaid = parseFloat(order.amount_paid || '0').toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    const formattedBalance = parseFloat(order.balance_due || '0').toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    const statusLabel = order.status.replace(/_/g, ' ');

    const templates: Template[] = [
        {
            id: 'restored_order',
            name: 'Order Restored (Error Fix)',
            description: 'Warm recovery message for orders accidentally cancelled but now restored.',
            templateText: `Hi ${order.customer},

This is the London’s Imports team. 

I’m reaching out to you personally regarding your order for the ${firstItemName} (#${order.order_number}). You may have received an automated email saying your order was cancelled—please disregard this. 

Our system mistakenly triggered a cancellation, but I want to reassure you that your GHS ${formattedAmountPaid} deposit is safe and secure, and I have personally restored your order in our system. Your items are reserved and safe.

Whenever you are ready, you can complete the remaining balance of GHS ${formattedBalance} directly on your profile. 

I’m very sorry for the automated email scare! If you have any questions, please reply directly to me here.`
        },
        {
            id: 'payment_reminder',
            name: 'Instalment Reminder',
            description: 'A warm, non-intrusive reminder for remaining instalment balances.',
            templateText: `Hi ${order.customer},

Hope you are having a wonderful day! I'm checking in regarding your instalment plan for the ${firstItemName} (#${order.order_number}). 

We have secured your items with your deposit of GHS ${formattedAmountPaid}. Just a gentle reminder that the remaining balance of GHS ${formattedBalance} is due. 

Let us know if you need any assistance with completing the payment. We are here to help! 

Warmly,
London's Imports Team`
        },
        {
            id: 'delivery_setup',
            name: 'Delivery Coordination',
            description: 'Coordinate dispatch details, delivery window, and courier notes.',
            templateText: `Hi ${order.customer},

Great news! Your order #${order.order_number} for the ${firstItemName} is ready for delivery. 

We want to coordinate the dispatch to your address (${order.delivery_address || 'your address'}, ${order.delivery_city || 'your city'}) to ensure it arrives at a time that works best for you. Please let us know your preferred delivery slot or any specific dispatch instructions.

Thank you for choosing London's Imports!

Warmly,
London's Imports Team`
        },
        {
            id: 'general_update',
            name: 'Status Update',
            description: 'A personal update notifying the customer of status changes.',
            templateText: `Hi ${order.customer},

This is the London’s Imports team. I wanted to personally update you on your order (#${order.order_number}) for the ${firstItemName}. 

We've received your payment of GHS ${formattedAmountPaid} and our team is currently preparing your items. Your order status has been updated to ${statusLabel}. 

If you have any questions or custom preferences, please feel free to message us here!

Warmly,
London's Imports Team`
        },
        {
            id: 'custom_blank',
            name: 'Direct Blank Message',
            description: 'Start with a simple customer salutation and write everything custom.',
            templateText: `Hi ${order.customer},`
        }
    ];

    // Update message content when template selection changes
    useEffect(() => {
        const selected = templates.find(t => t.id === selectedTemplateId);
        if (selected) {
            setMessageContent(selected.templateText);
        }
    }, [selectedTemplateId, order]);

    const getCleanPhone = (phone: string) => {
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) {
            clean = '233' + clean.substring(1);
        } else if (clean.length === 9) {
            clean = '233' + clean;
        }
        return clean;
    };

    const handleSend = () => {
        if (!order.phone) return;
        const cleanPhone = getCleanPhone(order.phone);
        const encodedText = encodeURIComponent(messageContent);
        const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const hasPhone = !!order.phone;

    return (
        <section className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} relative group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#25D366]" />
            
            <div className="p-8 border-b border-inherit flex items-center gap-4">
                <MessageSquare className="w-5 h-5 opacity-20 text-[#25D366]" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">WhatsApp Concierge</h2>
            </div>
            
            <div className="p-8 space-y-5">
                {/* Template Selector */}
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest opacity-30 block ml-1">
                        Select Template Type
                    </label>
                    <div className="relative">
                        <select
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            className={`w-full p-4 pr-10 border border-inherit text-[10px] font-bold tracking-wider outline-none transition-all uppercase rounded-none appearance-none cursor-pointer ${
                                isDark 
                                    ? 'bg-slate-950 text-white focus:border-[#25D366]/40' 
                                    : 'bg-slate-50 text-slate-800 focus:border-[#25D366]/30'
                            }`}
                        >
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-30">
                            <ChevronDownIcon className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className={`text-[9px] italic pl-1 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {templates.find(t => t.id === selectedTemplateId)?.description}
                    </p>
                </div>

                {/* Message Customization Area */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[8px] font-black uppercase tracking-widest opacity-30">
                            Compose Message Content
                        </label>
                        <div className="flex items-center gap-1 opacity-20 hover:opacity-40 transition-opacity cursor-help" title="Double check dynamic fields before dispatching.">
                            <HelpCircle className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Guide</span>
                        </div>
                    </div>
                    <textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={12}
                        className={`w-full p-4 border border-inherit text-xs font-medium leading-relaxed outline-none focus:border-[#25D366]/50 transition-all font-sans resize-none ${
                            isDark 
                                ? 'bg-slate-950 text-slate-200' 
                                : 'bg-slate-50 text-slate-700'
                        }`}
                        placeholder="Type customized customer message..."
                    />
                </div>

                {/* Send Button */}
                {hasPhone ? (
                    <button
                        onClick={handleSend}
                        className="w-full flex items-center justify-between p-6 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#25D366]/10"
                    >
                        WhatsApp Customer
                        <Send className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="w-full p-4 border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[9px] font-black uppercase tracking-widest text-center">
                        Recipient phone number missing
                    </div>
                )}
            </div>
        </section>
    );
}

// Simple internal icon component to avoid extra imports
function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m6 9 6 6 6-6"/>
        </svg>
    );
}
