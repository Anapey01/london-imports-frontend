'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { Loader2, Wallet, ArrowDownLeft } from 'lucide-react';

interface Payout {
    id: string;
    amount: string;
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
    reference?: string;
    created_at: string;
    processed_at?: string;
}

export default function VendorPayoutsPage() {
    const { theme } = useTheme();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const response = await vendorsAPI.payouts();
                setPayouts(response.data.results || response.data || []);
            } catch (error) {
                console.error('Failed to fetch payouts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayouts();
    }, []);

    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-white" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Payouts & Disbursements
                </h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Track escrow settlement transfers disbursed to your designated account
                </p>
            </div>

            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-[11px] uppercase font-semibold tracking-wider ${
                            isDark ? 'bg-slate-950/60 text-slate-400 border-b border-slate-800' : 'bg-slate-50 text-slate-500 border-b border-slate-100'
                        }`}>
                            <tr>
                                <th className="px-6 py-3.5 text-left">Initiated Date</th>
                                <th className="px-6 py-3.5 text-left">Net Amount</th>
                                <th className="px-6 py-3.5 text-left">Disbursement Status</th>
                                <th className="px-6 py-3.5 text-left">Settlement Reference</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y text-sm ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <Wallet className="w-6 h-6" />
                                            </div>
                                            <p className={`font-semibold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                No payout settlements yet
                                            </p>
                                            <p className="text-xs text-slate-400 max-w-sm">
                                                Net proceeds from successfully fulfilled customer orders will automatically settle into your banking or mobile money account.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className={`group transition-colors ${
                                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'
                                    }`}>
                                        <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {new Date(payout.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className={`px-6 py-4 font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            GH₵ {parseFloat(payout.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                payout.status === 'PROCESSED'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : payout.status === 'FAILED'
                                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                            }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {payout.reference || 'Auto-Escrow Settlement'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
