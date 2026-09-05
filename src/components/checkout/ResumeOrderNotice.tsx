'use client';

import Link from 'next/link';
import { CreditCard, ShoppingBag, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ResumeOrderNoticeProps {
    orderNumber: string;
}

const ResumeOrderNotice = ({ orderNumber }: ResumeOrderNoticeProps) => {
    const searchParams = useSearchParams();
    const isCancelled = searchParams.get('payment_cancelled') === 'true';

    return (
        <div className={`px-5 py-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${
            isCancelled 
                ? 'bg-amber-950/90 text-amber-100 border border-amber-800/60' 
                : 'bg-slate-900 text-white border border-slate-800'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full shrink-0 ${isCancelled ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white'}`}>
                    {isCancelled ? <AlertCircle className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        {isCancelled ? 'Payment was cancelled' : `Resuming Order #${orderNumber}`}
                    </p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-400">
                        {isCancelled ? 'Your items are safely saved in your basket. You can retry payment below or edit your basket.' : 'Fast Track Payment Mode'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                <Link 
                    href="/cart" 
                    className="inline-flex items-center gap-1.5 font-bold underline underline-offset-4 hover:opacity-80 transition-opacity text-white"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Basket</span>
                </Link>
            </div>
        </div>
    );
};

export default ResumeOrderNotice;
