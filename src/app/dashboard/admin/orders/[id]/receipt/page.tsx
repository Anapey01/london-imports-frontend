'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { Loader2, Printer, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price: string;
    image: string;
    size?: string;
    color?: string;
}

interface OrderDetail {
    id: string;
    order_number: string;
    customer: string;
    email: string;
    phone: string;
    total: string;
    subtotal: string;
    delivery_fee: string;
    status: string;
    payment_status: string;
    amount_paid: string;
    balance_due: string;
    created_at: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    items: OrderItem[];
}

export default function OrderReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const orderId = params.id as string;

    const loadOrder = useCallback(async () => {
        try {
            const response = await adminAPI.getOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to load order:', error);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (orderId) loadOrder();
    }, [orderId, loadOrder]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            </div>
        );
    }

    if (!order) return <div className="p-20 text-center">Order not found</div>;

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0 print:block">
            {/* Control Bar - Hidden on print */}
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Profile
                </button>
                <button 
                    onClick={printReceipt}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl"
                >
                    <Printer className="w-4 h-4" />
                    Print Receipt / Save PDF
                </button>
            </div>

            {/* Receipt Document */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl p-[20mm] min-h-[297mm] print:shadow-none print:p-[10mm] print:w-full print:mx-0 print:min-h-0 print:border-none">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-12 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24">
                            <Image 
                                src="/logo.jpg" 
                                alt="London's Imports Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold tracking-tighter text-slate-950 mb-1">London&apos;s Imports</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Atelier Operations Hub</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-mono font-bold tracking-tighter text-slate-950 mb-1">RECEIPT</h2>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">#{order.order_number}</p>
                    </div>
                </div>

                {/* Client & Transaction Info */}
                <div className="grid grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Billed To:</span>
                            <p className="text-lg font-serif font-bold text-slate-950 leading-tight">{order.customer}</p>
                            <p className="text-[10px] font-mono text-slate-400 lowercase mt-1">{order.email}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{order.phone}</p>
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Delivery Destination:</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-950 leading-relaxed">
                                {order.delivery_address}<br />
                                {order.delivery_city}, {order.delivery_region}
                            </p>
                        </div>
                    </div>
                    <div className="text-right space-y-6">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Transaction Date:</span>
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-950">
                                {new Date(order.created_at).toLocaleDateString('en-GB', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                }).toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Payment Status:</span>
                            <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                order.payment_status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            }`}>
                                {order.payment_status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-16">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 w-24">Item</th>
                                <th className="py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Description</th>
                                <th className="py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 w-16">Qty</th>
                                <th className="py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 w-32">Unit Price</th>
                                <th className="py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 w-32">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {order.items.map((item) => (
                                <tr key={item.id} className="group border-b border-slate-50 last:border-0">
                                    <td className="py-6">
                                        <div className="w-16 h-16 border border-slate-100 overflow-hidden relative bg-slate-50">
                                            {item.image && (
                                                <Image 
                                                    src={getImageUrl(item.image)} 
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover grayscale"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-6 pr-4">
                                        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-950">{item.product_name}</p>
                                        {(item.size || item.color) && (
                                            <div className="flex gap-3 mt-1">
                                                {item.size && <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">Size: {item.size}</span>}
                                                {item.color && <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">Color: {item.color}</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-6 text-center text-[11px] font-mono text-slate-400">{item.quantity}</td>
                                    <td className="py-6 text-right text-[11px] font-mono text-slate-400">₵{parseFloat(item.price).toLocaleString()}</td>
                                    <td className="py-6 text-right text-[12px] font-mono font-bold text-slate-950">
                                        ₵{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end border-t-2 border-slate-900 pt-8">
                    <div className="w-full max-w-xs space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Subtotal</span>
                            <span className="text-slate-950 tabular-nums">₵{parseFloat(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Logistics Fee</span>
                            <span className="text-slate-950 tabular-nums">₵{parseFloat(order.delivery_fee).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950">Total Amount</span>
                            <span className="text-2xl font-serif font-bold text-slate-950 tracking-tighter tabular-nums">₵{parseFloat(order.total).toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-8 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-40 print:opacity-100">
                                <span>Paid to Date</span>
                                <span className="text-emerald-500 tabular-nums">₵{parseFloat(order.amount_paid).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-40 print:opacity-100">
                                <span>Balance Remaining</span>
                                <span className="text-rose-500 tabular-nums">₵{parseFloat(order.balance_due).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-24 text-center">
                    <div className="w-16 h-px bg-slate-200 mx-auto mb-6" />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">Official London Hub Distribution Receipt</p>
                    <p className="text-[8px] font-mono text-slate-200 mt-2">ID: {order.id.toUpperCase()}</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 10mm;
                        size: A4;
                    }
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-bg-none {
                        background: none !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
