import React from 'react';
import { siteConfig } from '@/config/site';

export interface InvoiceItem {
    id?: string;
    product_name: string;
    quantity: number;
    price: string | number;
    size?: string;
    color?: string;
    image?: string;
}

export interface InvoicePayment {
    id?: string;
    amount: number;
    state?: string;
    payment_method?: string;
    reference?: string;
    created_at?: string;
}

export interface InvoiceData {
    id: string;
    order_number: string;
    customer: string;
    email: string;
    phone?: string;
    created_at: string;
    paid_at?: string;
    total: number | string;
    subtotal: number | string;
    delivery_fee: number | string;
    status?: string;
    payment_status?: string;
    amount_paid: number | string;
    balance_due: number | string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_region?: string;
    delivery_gps?: string;
    items: InvoiceItem[];
    payments?: InvoicePayment[];
}

interface InvoiceDocumentProps {
    order: InvoiceData;
    isCustomerView?: boolean;
}

export default function InvoiceDocument({ order }: InvoiceDocumentProps) {
    const totalNum = parseFloat(order.total?.toString() || '0');
    const subtotalNum = parseFloat(order.subtotal?.toString() || '0');
    const deliveryFeeNum = parseFloat(order.delivery_fee?.toString() || '0');
    const amountPaidNum = parseFloat(order.amount_paid?.toString() || '0');
    const balanceDueNum = parseFloat(order.balance_due?.toString() || '0');

    const isFullyPaid = (order.payment_status === 'PAID') || (amountPaidNum >= totalNum && totalNum > 0) || balanceDueNum <= 0;

    const latestPayment = order.payments && order.payments.length > 0 ? order.payments[0] : null;
    const paymentMethodDisplay = latestPayment?.payment_method 
        ? latestPayment.payment_method.replace(/_/g, ' ') 
        : 'Mobile Money / Card';
    const paymentRefDisplay = latestPayment?.reference || `REF-${order.order_number}`;

    const formattedIssueDate = new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const formattedPaymentDate = order.paid_at || latestPayment?.created_at
        ? new Date(order.paid_at || latestPayment?.created_at || '').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : formattedIssueDate;

    return (
        <div className="invoice-paper bg-white text-slate-900 font-sans antialiased max-w-[760px] mx-auto p-4 sm:p-8 md:p-12 border border-slate-200/80 rounded-2xl shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none">
            
            {/* 1. Brand Logo & Company Info (Exact layout from reference) */}
            <div className="space-y-1">
                <div className="w-10 h-10 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src="/logo.jpg" 
                        alt="London's Imports" 
                        className="w-10 h-10 object-contain rounded-lg"
                        onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                        }}
                    />
                </div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 uppercase">
                    London&apos;s Imports
                </h1>
                <div className="text-xs text-slate-500 leading-relaxed space-y-0.5">
                    <p>{siteConfig.supportEmail}</p>
                    <p>+233 54 524 7009</p>
                    <p>{siteConfig.address} &bull; Digital Address: GE-123-4567</p>
                    <p className="text-[11px] text-slate-400">Registered Business in Ghana</p>
                </div>
            </div>

            {/* 2. INVOICE Title & Details (Left-aligned, matching reference) */}
            <div className="mt-6 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-slate-950 uppercase">
                        Invoice
                    </h2>
                    {isFullyPaid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                            PAID IN FULL
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                            BALANCE DUE: GH₵ {balanceDueNum.toFixed(2)}
                        </span>
                    )}
                </div>
                <p className="text-xs font-mono text-slate-500">
                    INV-{order.order_number}
                </p>
                <div className="pt-1 text-xs text-slate-500 space-y-0.5">
                    <p>
                        <span>Issued:</span> <span className="text-slate-700 font-medium">{formattedIssueDate}</span>
                    </p>
                    {isFullyPaid && (
                        <p>
                            <span>Paid:</span> <span className="text-slate-700 font-medium">{formattedPaymentDate}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* 3. BILL TO Box (Soft rounded gray box matching reference) */}
            <div className="bill-to-card mt-6 bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    BILL TO
                </p>
                <div className="space-y-0.5 text-xs text-slate-600">
                    <p className="text-sm font-semibold text-slate-900">
                        {order.customer || 'Valued Customer'}
                    </p>
                    <p className="text-slate-500">{order.email}</p>
                    {order.phone && <p className="text-slate-500">{order.phone}</p>}
                    <p className="text-slate-700 pt-1 font-medium">
                        {order.delivery_address || 'Address provided on file'}
                    </p>
                    <p className="text-slate-600">
                        {[order.delivery_city, order.delivery_region].filter(Boolean).join(', ') || 'Greater Accra Region'}
                    </p>
                    {order.delivery_gps && (
                        <p className="text-emerald-700 font-medium pt-0.5">
                            Ghana Post GPS: {order.delivery_gps}
                        </p>
                    )}
                </div>
            </div>

            {/* 4. Table (Minimalist with generous breathing room, matching reference) */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <th className="py-2.5 text-left font-semibold">Description</th>
                            <th className="py-2.5 text-center w-16 font-semibold">Qty</th>
                            <th className="py-2.5 text-right w-28 font-semibold">Unit Price</th>
                            <th className="py-2.5 text-right w-28 font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => {
                                const priceNum = parseFloat(item.price?.toString() || '0');
                                const lineTotal = priceNum * (item.quantity || 1);
                                return (
                                    <tr key={item.id || index}>
                                        <td className="py-3 pr-4">
                                            <p className="font-medium text-slate-900">
                                                {item.product_name}
                                            </p>
                                            {(item.size || item.color) && (
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' &bull; ')}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 text-center text-slate-600">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3 text-right text-slate-600 tabular-nums">
                                            GH₵ {priceNum.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right font-medium text-slate-900 tabular-nums">
                                            GH₵ {lineTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                                    No items recorded for this order.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 5. Totals & Payment Info Block (Exact layout from reference) */}
            <div className="totals-section mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6">
                
                {/* Left Column: Payment & Proof of Address (matching reference bottom left notes) */}
                <div className="w-full sm:w-1/2 print:w-1/2 space-y-3 text-xs text-slate-500">
                    <div className="space-y-0.5">
                        <p>
                            <span className="font-semibold text-slate-700">Payment:</span>{' '}
                            {isFullyPaid 
                                ? `Paid in full via ${paymentMethodDisplay}` 
                                : `Partial payment received`}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                            Ref: {paymentRefDisplay} &bull; {formattedPaymentDate}
                        </p>
                    </div>

                    {/* Proof of Address note in simple English */}
                    <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700 block mb-0.5">Proof of Address:</span>
                        This invoice confirms delivery to the customer address listed above and serves as official proof of address for banks and verification.
                    </div>

                    <p className="text-slate-600 font-medium pt-1">
                        Thank you for your business!
                    </p>
                </div>

                {/* Right Column: Totals (Right-aligned, matching reference) */}
                <div className="w-full sm:w-56 print:w-56 space-y-1.5 text-xs text-right">
                    <div className="flex justify-between items-center text-slate-500">
                        <span>Subtotal</span>
                        <span className="text-slate-800 tabular-nums">
                            GH₵ {subtotalNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                        <span>Delivery Fee</span>
                        <span className="text-slate-800 tabular-nums">
                            GH₵ {deliveryFeeNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-950">
                        <span>Total</span>
                        <span className="tabular-nums">
                            GH₵ {totalNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-700 font-medium pt-0.5">
                        <span>Amount Paid</span>
                        <span className="tabular-nums">
                            GH₵ {amountPaidNum.toFixed(2)}
                        </span>
                    </div>

                    <div className={`flex justify-between items-center font-medium pt-0.5 ${balanceDueNum > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        <span>Balance Due</span>
                        <span className="tabular-nums">
                            GH₵ {balanceDueNum.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
