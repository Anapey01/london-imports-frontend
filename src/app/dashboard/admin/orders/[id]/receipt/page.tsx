'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { Loader2, Printer, ChevronLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import InvoiceDocument, { InvoiceData } from '@/components/invoice/InvoiceDocument';

export default function OrderInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sendingInvoice, setSendingInvoice] = useState(false);
    const [sendFeedback, setSendFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-slate-950 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Official Invoice...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
                <p className="text-sm text-slate-500 mb-6">The requested order could not be located.</p>
                <button 
                    onClick={() => router.push('/dashboard/admin/orders')}
                    className="px-6 py-2.5 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                    Return to Orders
                </button>
            </div>
        );
    }

    const totalNum = parseFloat(order.total?.toString() || '0');
    const amountPaidNum = parseFloat(order.amount_paid?.toString() || '0');
    const balanceDueNum = parseFloat(order.balance_due?.toString() || '0');
    const isFullyPaid = (order.payment_status === 'PAID') || (amountPaidNum >= totalNum && totalNum > 0) || balanceDueNum <= 0;

    const handlePrint = () => {
        window.print();
    };

    const handleSendInvoice = async () => {
        if (!isFullyPaid) {
            setSendFeedback({
                type: 'error',
                message: `Cannot issue official invoice: Outstanding balance of ₵${balanceDueNum.toFixed(2)} remaining. Official invoices are only issued upon full payment.`
            });
            return;
        }

        setSendingInvoice(true);
        setSendFeedback(null);
        try {
            const res = await adminAPI.sendInvoice(orderId);
            setSendFeedback({
                type: 'success',
                message: res.data?.message || `Official Tax Invoice successfully sent to ${order.email}!`
            });
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string; detail?: string } } })?.response?.data?.error 
                || (err as { response?: { data?: { error?: string; detail?: string } } })?.response?.data?.detail 
                || 'Failed to dispatch invoice. Please ensure full payment has been confirmed.';
            setSendFeedback({
                type: 'error',
                message: errorMsg
            });
        } finally {
            setSendingInvoice(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
            {/* Executive Control Bar - Hidden on print */}
            <div className="max-w-[850px] mx-auto mb-6 print:hidden space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <button 
                        onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}
                        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50 self-start sm:self-auto"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Order
                    </button>

                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <button 
                            onClick={handleSendInvoice}
                            disabled={sendingInvoice || !isFullyPaid}
                            title={!isFullyPaid ? "Official invoice can only be sent once balance is ₵0.00" : "Email official invoice to customer"}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
                                isFullyPaid 
                                    ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 cursor-pointer' 
                                    : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {sendingInvoice ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                            ) : (
                                <Mail className="w-3.5 h-3.5" />
                            )}
                            <span>{sendingInvoice ? 'Sending...' : 'Send to Customer'}</span>
                        </button>

                        <button 
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-pink-600 transition-all shadow-md cursor-pointer ml-auto sm:ml-0"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / Save PDF</span>
                        </button>
                    </div>
                </div>

                {/* Feedback Banners */}
                {sendFeedback && (
                    <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-3 border ${
                        sendFeedback.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        {sendFeedback.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        )}
                        <span>{sendFeedback.message}</span>
                    </div>
                )}

                {/* Partial Payment Notice */}
                {!isFullyPaid && (
                    <div className="p-4 rounded-xl text-xs bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-bold">Partial Payment Notice</p>
                            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                                This order has a balance remaining of <strong>₵{balanceDueNum.toFixed(2)}</strong>. The official <strong>Paid in Full</strong> invoice and KYC compliance certificate will be automatically issued once total payment is completed.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* The Executive Invoice Document */}
            <InvoiceDocument order={order} />
        </div>
    );
}
