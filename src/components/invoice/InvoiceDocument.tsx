import React from 'react';
import Image from 'next/image';
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
        <div className="invoice-root bg-white text-slate-900 font-sans antialiased max-w-[850px] mx-auto p-8 sm:p-14 border border-slate-100 rounded-3xl shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none">
            
            {/* 1. Header: Logo & Company Information */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center text-white font-serif font-black text-xl">
                            <Image 
                                src="/logo.jpg" 
                                alt="London's Imports" 
                                fill 
                                className="object-cover" 
                                onError={(e) => {
                                    // Fallback if image not found
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                            <span>L</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                                London&apos;s Imports Ltd.
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Global Sourcing &amp; Direct Logistics
                            </p>
                        </div>
                    </div>

                    <div className="text-[11px] text-slate-500 leading-relaxed font-normal pt-1">
                        <p>{siteConfig.address}</p>
                        <p className="font-mono text-[10px] text-slate-600 font-semibold">Digital Address: GE-123-4567 (Ghana Post GPS)</p>
                        <p>{siteConfig.supportEmail} • {siteConfig.whatsapp ? `+${siteConfig.whatsapp}` : '+233 54 524 7009'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">londonsimports.com • Reg. Entity: Republic of Ghana</p>
                    </div>
                </div>

                {/* Invoice Title & Identification */}
                <div className="text-left sm:text-right space-y-1 sm:self-start">
                    <div className="inline-block">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-950 uppercase">
                            Invoice
                        </h2>
                    </div>
                    <p className="font-mono text-sm font-bold text-slate-800 tracking-tight">
                        INV-{order.order_number}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-500 space-y-0.5">
                        <p>
                            <span className="text-slate-400">Issued:</span> <span className="font-medium text-slate-700">{formattedIssueDate}</span>
                        </p>
                        <p>
                            <span className="text-slate-400">Order Ref:</span> <span className="font-mono font-medium text-slate-700">#{order.order_number}</span>
                        </p>
                        {isFullyPaid && (
                            <p>
                                <span className="text-slate-400">Settled:</span> <span className="font-medium text-emerald-700">{formattedPaymentDate}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Bill To Card Container (Clean tinted card matching reference mockup) */}
            <div className="my-8 bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 sm:p-8">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
                    BILL TO (Verified Recipient &amp; Delivery Destination)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-950 tracking-tight">
                            {order.customer || 'Valued Customer'}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{order.email}</p>
                        {order.phone && (
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{order.phone}</p>
                        )}
                    </div>
                    
                    {/* Physical Address Block - Essential for Address Verification & KYC */}
                    <div className="text-left md:text-right text-[11px] text-slate-700 leading-relaxed">
                        <p className="font-semibold text-slate-900">
                            {order.delivery_address || 'Address provided on file'}
                        </p>
                        <p>
                            {[order.delivery_city, order.delivery_region].filter(Boolean).join(', ') || 'Greater Accra Region'}
                        </p>
                        {order.delivery_gps && (
                            <p className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 md:ml-auto inline-block px-2 py-0.5 rounded border border-emerald-200/60 mt-1">
                                GPS: {order.delivery_gps}
                            </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Republic of Ghana</p>
                    </div>
                </div>
            </div>

            {/* 3. Items Table */}
            <div className="my-8 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200/80 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                            <th className="py-3 text-left w-1/2">Description</th>
                            <th className="py-3 text-center w-16">Qty</th>
                            <th className="py-3 text-right w-28">Unit Price</th>
                            <th className="py-3 text-right w-28">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[12px]">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => {
                                const priceNum = parseFloat(item.price?.toString() || '0');
                                const lineTotal = priceNum * (item.quantity || 1);
                                return (
                                    <tr key={item.id || index} className="group">
                                        <td className="py-4 pr-4">
                                            <p className="font-bold text-slate-900 tracking-tight text-[13px]">
                                                {item.product_name}
                                            </p>
                                            {(item.size || item.color) && (
                                                <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    {item.size && item.color && <span>•</span>}
                                                    {item.color && <span>Color: {item.color}</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 text-center font-mono text-slate-600 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 text-right font-mono text-slate-600 tabular-nums">
                                            ₵{priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                                            ₵{lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                                    No item records found for this order.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. Totals Breakdown & Verification Stamp */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-start gap-8">
                
                {/* Left: Payment & Verification Status */}
                <div className="space-y-4 max-w-sm">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1.5">
                            Payment Confirmation
                        </span>
                        {isFullyPaid ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Paid in Full • Verified
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[10px] font-black uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                Partial Payment • Balance Due
                            </div>
                        )}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 font-mono">
                        <p>
                            <span className="text-slate-400">Method:</span> <span className="font-semibold text-slate-700 capitalize">{paymentMethodDisplay}</span>
                        </p>
                        <p className="truncate">
                            <span className="text-slate-400">Ref:</span> <span className="text-slate-700">{paymentRefDisplay}</span>
                        </p>
                        <p>
                            <span className="text-slate-400">Timestamp:</span> <span className="text-slate-700">{formattedPaymentDate}</span>
                        </p>
                    </div>
                </div>

                {/* Right: Calculations */}
                <div className="w-full sm:w-72 space-y-2.5 text-[11px]">
                    <div className="flex justify-between items-center text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-mono tabular-nums text-slate-800 font-medium">
                            ₵{subtotalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                        <span>Logistics &amp; Direct Shipping</span>
                        <span className="font-mono tabular-nums text-slate-800 font-medium">
                            ₵{deliveryFeeNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                        <span>Customs &amp; Import Duties (0%)</span>
                        <span className="font-mono tabular-nums text-slate-800 font-medium">
                            ₵0.00
                        </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm font-black uppercase tracking-wider text-slate-950">Total</span>
                        <span className="text-xl font-mono font-black text-slate-950 tabular-nums">
                            ₵{totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex justify-between items-center text-emerald-700 font-semibold">
                            <span>Amount Paid</span>
                            <span className="font-mono tabular-nums">
                                ₵{amountPaidNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className={`flex justify-between items-center font-bold ${balanceDueNum > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            <span>Balance Remaining</span>
                            <span className="font-mono tabular-nums">
                                ₵{balanceDueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Legal & Institutional Verification / KYC Section */}
            <div className="mt-12 pt-8 border-t border-slate-100 text-slate-400 text-[10px] leading-relaxed">
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 mb-6">
                    <p className="font-bold text-slate-700 uppercase tracking-widest text-[9px] mb-1">
                        Institutional Compliance &amp; Proof of Address Declaration
                    </p>
                    <p className="text-slate-500">
                        This official tax invoice serves as verified proof of commercial purchase, electronic payment settlement, and physical delivery address for the named recipient, certified by London&apos;s Imports Ltd., a registered business in the Republic of Ghana. For official verification or financial compliance inquiries, please contact <span className="text-slate-700 font-mono">info@londonsimports.com</span>.
                    </p>
                </div>

                <div className="text-center space-y-1">
                    <p className="font-medium text-slate-600">Thank you for your business!</p>
                    <p className="text-[9px] font-mono text-slate-400">
                        London&apos;s Imports • Verified Commercial Invoice • Document Ref: #{order.order_number}
                    </p>
                </div>
            </div>

            {/* Print Stylesheet */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm 15mm;
                    }
                    body {
                        background: #FFFFFF !important;
                        color: #0F172A !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .invoice-root {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    /* Prevent ugly page breaks inside blocks */
                    tr {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    .avoid-break {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
}
