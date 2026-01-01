/**
 * London's Imports - Admin Tutorials
 * Guide for using the admin dashboard
 */
'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useState } from 'react';

export default function TutorialsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('products');

    const tutorials = {
        products: [
            {
                title: 'Adding a New Product',
                steps: [
                    'Navigate to the "Products" tab in the sidebar.',
                    'Click the "+ Add Product" button in the top right corner.',
                    'Fill in the product details: Name, Price, Description, etc.',
                    'Upload a product image (optional but recommended).',
                    'Set the status (Private/Public) and stock quantity.',
                    'Click "Create Product" to save.'
                ]
            },
            {
                title: 'Managing Inventory',
                steps: [
                    'In the Products list, find the product you want to update.',
                    'Click the "Edit" button (pencil icon).',
                    'Update the "Stock" number.',
                    'Save changes. Low stock items will be highlighted automatically.'
                ]
            }
        ],
        orders: [
            {
                title: 'Processing an Order',
                steps: [
                    'Go to the "Orders" tab.',
                    'Click "View" on a pending order.',
                    'Review the items and customer details.',
                    'Update the status to "Processing" while you pack it.',
                    'Once shipped, update status to "Shipped" and add tracking info if available.'
                ]
            },
            {
                title: 'Handling Refunds',
                steps: [
                    'Open the order details.',
                    'If a refund is requested, verify the return.',
                    'Click "Process Refund" (if integrated) or manually refund via payment provider.',
                    'Update order status to "Refunded".'
                ]
            }
        ],
        users: [
            {
                title: 'Managing Users',
                steps: [
                    'The "Users" tab shows all registered customers.',
                    'You can view their order history and contact info.',
                    'Use "Block" only for suspicious accounts.'
                ]
            }
        ]
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Tutorials</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Quick guides to help you manage the store
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex gap-6">
                    {['products', 'orders', 'users'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab
                                    ? 'text-pink-500'
                                    : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {tab} Management
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials[activeTab as keyof typeof tutorials].map((guide, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}
                    >
                        <h3 className={`font-semibold mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {guide.title}
                        </h3>
                        <ol className="space-y-3">
                            {guide.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex gap-3">
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-pink-50 text-pink-600'
                                        }`}>
                                        {stepIdx + 1}
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </div>
    );
}
