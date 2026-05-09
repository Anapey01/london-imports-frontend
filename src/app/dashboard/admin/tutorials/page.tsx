/**
 * London's Imports - Admin Tutorials
 * Premium 'Atelier' architectural system for operational directives
 */
'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useState } from 'react';
import { BookOpen, Command, Terminal, Shield, HelpCircle } from 'lucide-react';

export default function TutorialsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('products');

    const tutorials = {
        products: [
            {
                title: 'PRODUCT REGISTRATION',
                steps: [
                    'Navigate to the Product Inventory section.',
                    'Click on the "Add New Product" button.',
                    'Fill in the Name, Price, and Description fields.',
                    'Upload high-quality product photos.',
                    'Set the status to Active and enter your stock quantity.',
                    'Click "Save Product" to publish it to the shop.'
                ]
            },
            {
                title: 'UPDATING STOCK LEVELS',
                steps: [
                    'Find the target product in your inventory list.',
                    'Click the "Edit" button to open the product details.',
                    'Update the remaining stock count in the inventory field.',
                    'Verify that low-stock alerts are set correctly.'
                ]
            }
        ],
        orders: [
            {
                title: 'PROCESSING NEW ORDERS',
                steps: [
                    'Open the Recent Orders dashboard.',
                    'Select an order marked as "Pending".',
                    'Verify the customer details and items ordered.',
                    'Update the order status to "Processing".',
                    'Assign the order to a shipping batch for delivery.'
                ]
            },
            {
                title: 'REFUND OPERATIONS',
                steps: [
                    'Locate the completed order in the archives.',
                    'Confirm that items have been returned if necessary.',
                    'Process the refund via the payment gateway.',
                    'Mark the order as "Refunded" in the dashboard.'
                ]
            }
        ],
        users: [
            {
                title: 'MANAGING CUSTOMERS',
                steps: [
                    'The Customer Directory lists all registered users.',
                    'Review their past orders and contact history.',
                    'Use the "Block" action only for suspicious activity.'
                ]
            }
        ]
    };

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Operational Guide</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">ADMIN GUIDE V1.0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PROTOCOL TABS */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide border-b border-slate-50">
                {['products', 'orders', 'users'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${activeTab === tab
                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                            : 'bg-white text-slate-400 border-transparent hover:text-slate-900'
                            }`}
                    >
                        {tab.toUpperCase()} MANAGEMENT
                    </button>
                ))}
            </div>

            {/* 3. DIRECTIVE NODES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                {tutorials[activeTab as keyof typeof tutorials].map((guide, idx) => (
                    <div key={idx} className="bg-white p-12 space-y-8">
                        <div className="flex items-center gap-4">
                            <Terminal className="w-4 h-4 text-slate-300" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">
                                {guide.title}
                            </h3>
                        </div>
                        <ol className="space-y-6">
                            {guide.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex gap-6 items-start group">
                                    <span className="text-[9px] font-black text-slate-200 group-hover:text-slate-900 transition-colors tabular-nums mt-0.5">
                                        {(stepIdx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed group-hover:text-slate-950 transition-colors">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

            {/* Support Terminal */}
            <div className="p-12 bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 border border-slate-200 flex items-center justify-center bg-white text-slate-300">
                        <Shield className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">ADMIN HELP CENTER</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized personnel only</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white border border-slate-950 text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-950 hover:text-white transition-all">
                    CONTACT DEVELOPER
                </button>
            </div>
        </div>
    );
}
