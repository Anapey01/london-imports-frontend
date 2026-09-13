'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, Printer, ChevronLeft, AlertCircle } from 'lucide-react';
import InvoiceDocument, { InvoiceData } from '@/components/invoice/InvoiceDocument';
import Link from 'next/link';

export default function CustomerOrderInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const orderNumber = params.orderNumber as string;
    const { isAuthenticated } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['order-invoice', orderNumber],
        queryFn: () => ordersAPI.detail(orderNumber),
        enabled: isAuthenticated && !!orderNumber,
    });

    const rawOrder = data?.data;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-sm w-full shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Sign in Required</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Please log in to your London&apos;s Imports account to access your official KYC tax invoice.
                    </p>
                    <Link 
                        href={`/login?redirect=/orders/${orderNumber}/invoice`}
                        className="block w-full py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all"
                    >
                        Log In to View Invoice
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-slate-950 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Official Invoice...</p>
            </div>
        );
    }

    if (error || !rawOrder) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-sm w-full shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Invoice Not Found</h2>
                    <p className="text-xs text-slate-500">We couldn&apos;t locate the order invoice requested.</p>
                    <button 
                        onClick={() => router.push('/orders')}
                        className="w-full py-2.5 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const totalNum = parseFloat(rawOrder.total?.toString() || '0');
    const amountPaidNum = parseFloat(rawOrder.amount_paid?.toString() || '0');
    const balanceDueNum = parseFloat(rawOrder.balance_due?.toString() || '0');
    const isFullyPaid = (rawOrder.state === 'PAID') || (amountPaidNum >= totalNum && totalNum > 0) || balanceDueNum <= 0;

    // Transform raw order into InvoiceData structure
    const invoiceOrder: InvoiceData = {
        id: String(rawOrder.id),
        order_number: rawOrder.order_number,
        customer: rawOrder.customer_name || rawOrder.customer || 'Valued Customer',
        email: rawOrder.customer_email || rawOrder.email || '',
        phone: rawOrder.customer_phone || rawOrder.phone || '',
        created_at: rawOrder.created_at,
        paid_at: rawOrder.paid_at,
        total: rawOrder.total,
        subtotal: rawOrder.subtotal,
        delivery_fee: rawOrder.delivery_fee,
        status: isFullyPaid ? 'PAID' : (rawOrder.state || 'PENDING'),
        payment_status: isFullyPaid ? 'PAID' : (amountPaidNum > 0 ? 'PARTIAL' : 'PENDING'),
        amount_paid: rawOrder.amount_paid || '0.00',
        balance_due: rawOrder.balance_due || '0.00',
        delivery_address: rawOrder.delivery_address,
        delivery_city: rawOrder.delivery_city,
        delivery_region: rawOrder.delivery_region,
        delivery_gps: rawOrder.delivery_gps,
        items: (rawOrder.items || []).map((item: any) => ({
            id: item.id,
            product_name: item.product_name || item.name || 'Product',
            quantity: item.quantity || 1,
            price: item.price || item.unit_price || 0,
            size: item.size || item.selected_size,
            color: item.color || item.selected_color,
            image: item.image || item.product_image
        })),
        payments: rawOrder.payments
    };

    return (
        <div className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
            {/* Control Bar - Hidden on print */}
            <div className="max-w-[850px] mx-auto mb-6 print:hidden space-y-4">
                <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <button 
                        onClick={() => router.push(`/orders/${orderNumber}`)}
                        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Order
                    </button>

                    <button 
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save PDF</span>
                    </button>
                </div>

                {/* Partial Payment Notice */}
                {!isFullyPaid && (
                    <div className="p-4 rounded-xl text-xs bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-bold">Provisional Invoice Notice</p>
                            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                                This order has an unpaid balance of <strong>₵{balanceDueNum.toFixed(2)}</strong>. The final KYC-certified <strong>Paid in Full</strong> tax invoice will be generated upon final payment settlement.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Official Invoice Document */}
            <InvoiceDocument order={invoiceOrder} isCustomerView={true} />
        </div>
    );
}
