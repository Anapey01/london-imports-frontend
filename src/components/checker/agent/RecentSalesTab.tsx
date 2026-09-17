'use client';

import React from 'react';
import type { Order } from './types';

interface RecentSalesTabProps {
  recentOrders: Order[];
}

export default function RecentSalesTab({ recentOrders }: RecentSalesTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-bold text-content-primary pb-2 border-b border-slate-100">
        Recent Checker Sales
      </h3>

      {recentOrders.length === 0 ? (
        <p className="text-center py-8 text-xs text-content-secondary font-bold uppercase tracking-wider">
          No sales recorded yet. Share your store link to start selling.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-medium">
            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-content-secondary">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Checker Type</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3 text-right">Customer Price</th>
                <th className="px-4 py-3 text-right text-brand-emerald">Your Earnings</th>
                <th className="px-4 py-3">Buyer Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-content-primary font-mono">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary text-[11px]">
                    {new Date(order.completed_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.client_reference}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-sans text-[11px] uppercase">{order.checker_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-sans text-[11px]">{order.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-sans text-[11px]">GH₵ {parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-brand-emerald font-sans font-bold text-[11px]">
                    + GH₵ {parseFloat(order.commission).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-sans text-content-secondary">{order.buyer_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
