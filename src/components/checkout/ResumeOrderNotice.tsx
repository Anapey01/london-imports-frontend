'use client';

import Link from 'next/link';
import { CreditCard } from 'lucide-react';

interface ResumeOrderNoticeProps {
    orderNumber: string;
}

const ResumeOrderNotice = ({ orderNumber }: ResumeOrderNoticeProps) => (
    <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
                <CreditCard className="w-4 h-4" />
            </div>
            <div>
                <p className="text-sm font-medium">Resuming Order #{orderNumber}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Fast Track Payment Mode</p>
            </div>
        </div>
        <div className="hidden sm:block">
            <Link href="/orders" className="text-xs text-gray-400 hover:text-white transition-colors">
                Cancel & Go Back
            </Link>
        </div>
    </div>
);

export default ResumeOrderNotice;
