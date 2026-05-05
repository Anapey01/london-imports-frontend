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
                title: 'ASSET_REGISTRATION_PROTOCOL',
                steps: [
                    'NAVIGATE_TO_INVENTORY_MANIFEST_NODE.',
                    'EXECUTE_REGISTER_NEW_ENTRY_COMMAND.',
                    'POPULATE_METADATA: IDENTITY, VALUATION, DESCRIPTION.',
                    'UPLOAD_ASSET_VISUAL_PAYLOAD.',
                    'SET_SUPPLY_NODE_STATE (DRAFT/ACTIVE) AND_UNITS.',
                    'AUTHORIZE_COMMIT_TO_REGISTRY.'
                ]
            },
            {
                title: 'INVENTORY_NODE_SYNCHRONIZATION',
                steps: [
                    'LOCATE_TARGET_ASSET_IN_MANIFEST_REGISTRY.',
                    'INITIATE_OVERRIDE_MODE (EDIT_COMMAND).',
                    'SYNCHRONIZE_UNIT_COUNT (STOCK_LEVEL).',
                    'VERIFY_SUPPLY_THRESHOLD_ALERTS.'
                ]
            }
        ],
        orders: [
            {
                title: 'TRANSACTION_EXECUTION_FLOW',
                steps: [
                    'ACCESS_LIVE_MANIFEST_REGISTRY.',
                    'INSPECT_PENDING_TRANSACTION_NODE.',
                    'VERIFY_ENTITY_IDENTITY_AND_PAYLOAD.',
                    'TRANSITION_TO_PROCESSING_PROTOCOL.',
                    'INITIATE_DISPATCH_HANDSHAKE_AND_LOGISTICS_LINK.'
                ]
            },
            {
                title: 'REVERSAL_PROTOCOL (REFUNDS)',
                steps: [
                    'OPEN_ARCHIVED_TRANSACTION_ENTRY.',
                    'VERIFY_ASSET_RECOVERY_STATUS.',
                    'EXECUTE_REFUND_OVERRIDE_COMMAND.',
                    'UPDATE_LEDGER_TO_REFUNDED_STATE.'
                ]
            }
        ],
        users: [
            {
                title: 'ENTITY_IDENTITY_MANAGEMENT',
                steps: [
                    'DIRECTORY_NODE_CONTAINS_ALL_REGISTERED_ENTITIES.',
                    'AUDIT_TRANSACTION_HISTORY_AND_COMMUNICATION_LOGS.',
                    'DEPLOY_BLOCK_PROTOCOL_ONLY_FOR_UNAUTHORIZED_ACTIVITY.'
                ]
            }
        ]
    };

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Operational Directives</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">SYSTEM_GUIDANCE_V1.0</span>
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
                        {tab}_MANAGEMENT
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
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">SYSTEM_SUPPORT_CHANNEL</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized personnel only</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white border border-slate-950 text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-950 hover:text-white transition-all">
                    INITIATE_SUPPORT_LINK
                </button>
            </div>
        </div>
    );
}
