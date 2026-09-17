'use client';

import React from 'react';
import type { LedgerEntry } from './types';

interface WalletLedgerTabProps {
  ledger: LedgerEntry[];
  onOpenWithdrawal: () => void;
}

export default function WalletLedgerTab({ ledger, onOpenWithdrawal }: WalletLedgerTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-slate-100 gap-4">
        <h3 className="font-serif text-lg font-bold text-content-primary">
          Financial Wallet History
        </h3>
        <button
          onClick={onOpenWithdrawal}
          className="bg-content-primary text-surface py-2 px-4 rounded-none font-bold text-[9px] uppercase tracking-widest hover:bg-brand-emerald transition-colors align-self-start sm:align-self-auto"
        >
          Withdraw Funds
        </button>
      </div>

      {ledger.length === 0 ? (
        <p className="text-center py-8 text-xs text-content-secondary font-bold uppercase tracking-wider">
          No payments or transactions yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-medium">
            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-content-secondary">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Wallet Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-content-primary font-mono">
              {ledger.map((entry, idx) => {
                const amountVal = parseFloat(entry.amount);
                const isCredit = amountVal > 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary text-[11px]">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{entry.reference}</td>
                    <td className="px-4 py-3 font-sans text-content-primary text-[11px]">
                      {entry.description || entry.entry_type_display}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-right font-sans font-bold text-[11px] ${
                      isCredit ? 'text-brand-emerald' : 'text-red-500'
                    }`}>
                      {isCredit ? '+' : ''} GH₵ {amountVal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-sans text-[11px]">
                      GH₵ {parseFloat(entry.balance_after).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
