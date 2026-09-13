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

    const formattedIssueDate = new Date(order.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const formattedPaymentDate = order.paid_at || latestPayment?.created_at
        ? new Date(order.paid_at || latestPayment?.created_at || '').toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        : formattedIssueDate;

    return (
        <div className="invoice-paper bg-white text-slate-900 font-sans antialiased max-w-[820px] mx-auto p-6 sm:p-10 border border-slate-200 rounded-2xl shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none">
            
            {/* Header: Company & Invoice Info */}
            <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-200">
                {/* Left: Company Details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src="/logo.jpg" 
                                alt="London's Imports" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                                London&apos;s Imports Ltd.
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Online Shopping &amp; Direct Delivery
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed pt-1">
                        <p>{siteConfig.address}</p>
                        <p className="font-semibold text-slate-700">Digital Address: GE-123-4567 (Ghana Post GPS)</p>
                        <p>Phone: +233 54 524 7009 &bull; Email: {siteConfig.supportEmail}</p>
                        <p className="text-slate-400 font-medium">Registered Business in Ghana</p>
                    </div>
                </div>

                {/* Right: Invoice Meta */}
                <div className="text-left sm:text-right print:text-right space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                        Invoice
                    </h2>
                    <p className="font-mono text-sm font-bold text-slate-800">
                        INV-{order.order_number}
                    </p>
                    <div className="pt-2 text-xs text-slate-600 space-y-1">
                        <p>
                            <span className="text-slate-400">Date:</span> <span className="font-semibold text-slate-800">{formattedIssueDate}</span>
                        </p>
                        <p>
                            <span className="text-slate-400">Order Number:</span> <span className="font-mono font-semibold text-slate-800">#{order.order_number}</span>
                        </p>
                        {isFullyPaid && (
                            <p>
                                <span className="text-slate-400">Date Paid:</span> <span className="font-semibold text-emerald-700">{formattedPaymentDate}</span>
                            </p>
                        )}
                    </div>

                    <div className="pt-3">
                        {isFullyPaid ? (
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md uppercase tracking-wide border border-emerald-300">
                                PAID IN FULL
                            </span>
                        ) : (
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md uppercase tracking-wide border border-amber-300">
                                BALANCE DUE: GH₵ {balanceDueNum.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Billed To Box */}
            <div className="bill-to-card my-6 bg-slate-50 border border-slate-200 rounded-xl p-5 print:bg-slate-50">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Billed To
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div className="space-y-0.5 text-xs text-slate-600">
                        <p className="text-sm font-bold text-slate-900">
                            {order.customer || 'Customer'}
                        </p>
                        <p>{order.email}</p>
                        {order.phone && <p>{order.phone}</p>}
                    </div>

                    {/* Address for Proof of Address / KYC */}
                    <div className="space-y-0.5 text-xs text-slate-700 sm:text-right print:text-right">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Delivery Address
                        </p>
                        <p className="font-semibold text-slate-900">
                            {order.delivery_address || 'Address on file'}
                        </p>
                        <p>
                            {[order.delivery_city, order.delivery_region].filter(Boolean).join(', ') || 'Greater Accra'}
                        </p>
                        {order.delivery_gps && (
                            <p className="font-semibold text-emerald-800">
                                Ghana Post GPS: {order.delivery_gps}
                            </p>
                        )}
                        <p className="text-slate-500">Ghana</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="my-6">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="py-2.5 px-2">Item</th>
                            <th className="py-2.5 px-2 text-center w-16">Qty</th>
                            <th className="py-2.5 px-2 text-right w-32">Unit Price</th>
                            <th className="py-2.5 px-2 text-right w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => {
                                const priceNum = parseFloat(item.price?.toString() || '0');
                                const lineTotal = priceNum * (item.quantity || 1);
                                return (
                                    <tr key={item.id || index} className="hover:bg-slate-50/50">
                                        <td className="py-3 px-2">
                                            <p className="font-semibold text-slate-900">
                                                {item.product_name}
                                            </p>
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' | ')}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 text-center font-medium text-slate-700">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3 px-2 text-right font-medium text-slate-700 tabular-nums">
                                            GH₵ {priceNum.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-2 text-right font-bold text-slate-900 tabular-nums">
                                            GH₵ {lineTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                                    No items listed for this order.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Section: Payment Info / KYC Note + Totals */}
            <div className="totals-section pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6">
                
                {/* Left: Payment Info & Simple Proof of Address Note */}
                <div className="w-full sm:w-1/2 print:w-1/2 space-y-4 text-xs">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Payment Info
                        </p>
                        <div className="space-y-0.5 text-slate-600">
                            <p><span className="text-slate-400">Paid Via:</span> <span className="font-semibold text-slate-800 capitalize">{paymentMethodDisplay}</span></p>
                            <p><span className="text-slate-400">Payment Ref:</span> <span className="font-mono text-slate-800">{paymentRefDisplay}</span></p>
                            <p><span className="text-slate-400">Date Paid:</span> <span className="text-slate-800">{formattedPaymentDate}</span></p>
                        </div>
                    </div>

                    {/* Proof of Address Box (Simple English, No Jargon) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">
                        <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                            Proof of Address
                        </p>
                        <p className="text-xs leading-relaxed">
                            This official invoice confirms that this order was paid in full and delivered to the customer address above. You can use this document as a valid proof of address for bank accounts, SIM registration, and official verifications.
                        </p>
                    </div>
                </div>

                {/* Right: Totals Calculation */}
                <div className="w-full sm:w-64 print:w-64 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-800 tabular-nums">
                            GH₵ {subtotalNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                        <span>Delivery Fee</span>
                        <span className="font-medium text-slate-800 tabular-nums">
                            GH₵ {deliveryFeeNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                        <span>Total</span>
                        <span className="text-base tabular-nums">
                            GH₵ {totalNum.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-700 font-semibold pt-1">
                        <span>Amount Paid</span>
                        <span className="tabular-nums">
                            GH₵ {amountPaidNum.toFixed(2)}
                        </span>
                    </div>

                    <div className={`flex justify-between items-center font-bold pt-1 border-t border-slate-100 ${balanceDueNum > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        <span>Balance Due</span>
                        <span className="tabular-nums">
                            GH₵ {balanceDueNum.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
                <p className="font-medium text-slate-700">Thank you for your business!</p>
                <p className="text-slate-400">
                    If you have any questions, please contact us at {siteConfig.supportEmail} or call +233 54 524 7009.
                </p>
            </div>
        </div>
    );
}
