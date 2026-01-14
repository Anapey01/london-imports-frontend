'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

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
                <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payouts
            </h1>

            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-xs uppercase font-medium ${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                            <tr>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Reference</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No payouts found.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
                                        <td className={`px-6 py-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </td>
                                        <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            GH₵ {parseFloat(payout.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${payout.status === 'PROCESSED'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : payout.status === 'FAILED'
                                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {payout.reference || '-'}
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
