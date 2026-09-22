/**
 * London's Imports - Admin Vendor Management
 * Comprehensive merchant moderation, compliance inspection, and lifecycle governance
 */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';
import {
    Search,
    Building2,
    X,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    FileText,
    CreditCard,
    User,
    MapPin,
    ArrowUpRight
} from 'lucide-react';

interface Vendor {
    id: string;
    business_name: string;
    slug: string;
    owner_name: string;
    owner_email: string;
    business_email: string;
    business_phone: string;
    city: string;
    region: string;
    total_orders: number;
    fulfillment_rate: number;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    vendor_type?: 'MARKETPLACE' | 'STANDALONE';
    documents?: {
        ghana_card?: string | null;
        business_cert?: string | null;
        bank_name?: string | null;
        bank_account_number?: string | null;
        bank_account_name?: string | null;
        has_payout_setup?: boolean;
    };
}

export default function AdminVendorsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'MARKETPLACE' | 'STANDALONE'>('ALL');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const loadVendors = async () => {
        try {
            const response = await adminAPI.vendors();
            setVendors(response.data || []);
        } catch (err) {
            console.error('Failed to load vendors:', err);
            addAlert('Failed to load vendor registry', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const handleVerify = (vendor: Vendor) => {
        setConfirmModal({
            isOpen: true,
            title: 'AUTHORIZE & ACTIVATE VENDOR',
            message: `Authorize ${vendor.business_name} for active participation on London's Imports? Their branded storefront and product listings will be published.`,
            variant: 'warning',
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    await adminAPI.verifyVendor(vendor.id);
                    setVendors(prev => prev.map(v =>
                        v.id === vendor.id
                            ? { ...v, is_verified: true, is_active: true, status: 'VERIFIED' as const }
                            : v
                    ));
                    if (selectedVendor && selectedVendor.id === vendor.id) {
                        setSelectedVendor({ ...selectedVendor, is_verified: true, is_active: true, status: 'VERIFIED' });
                    }
                    addAlert(`${vendor.business_name} authorized and activated successfully`);
                } catch (err) {
                    console.error('Failed to verify vendor:', err);
                    addAlert('Failed to authorize vendor', 'error');
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleReject = (vendor: Vendor) => {
        const isCurrentlyVerified = vendor.status === 'VERIFIED';
        setConfirmModal({
            isOpen: true,
            title: isCurrentlyVerified ? 'SUSPEND VENDOR ACCOUNT' : 'REJECT REGISTRATION APPLICATION',
            message: isCurrentlyVerified
                ? `Suspend ${vendor.business_name}? Their active listings and storefront will be temporarily deactivated.`
                : `Reject the application for ${vendor.business_name}?`,
            variant: 'danger',
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    await adminAPI.rejectVendor(vendor.id);
                    setVendors(prev => prev.map(v =>
                        v.id === vendor.id
                            ? { ...v, is_verified: false, is_active: false, status: 'REJECTED' as const }
                            : v
                    ));
                    if (selectedVendor && selectedVendor.id === vendor.id) {
                        setSelectedVendor({ ...selectedVendor, is_verified: false, is_active: false, status: 'REJECTED' });
                    }
                    addAlert(`${vendor.business_name} ${isCurrentlyVerified ? 'suspended' : 'rejected'} successfully`);
                } catch (err) {
                    console.error('Failed to reject vendor:', err);
                    addAlert('Failed to execute action', 'error');
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Recent';
        }
    };

    const counts = useMemo(() => {
        return {
            ALL: vendors.length,
            PENDING: vendors.filter(v => v.status === 'PENDING').length,
            VERIFIED: vendors.filter(v => v.status === 'VERIFIED').length,
            REJECTED: vendors.filter(v => v.status === 'REJECTED').length,
        };
    }, [vendors]);

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            const matchesStatus = statusFilter === 'ALL' || vendor.status === statusFilter;
            const matchesType = typeFilter === 'ALL' || (vendor.vendor_type || 'MARKETPLACE') === typeFilter;
            const term = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !term ||
                vendor.business_name.toLowerCase().includes(term) ||
                vendor.owner_name.toLowerCase().includes(term) ||
                (vendor.business_email && vendor.business_email.toLowerCase().includes(term)) ||
                (vendor.city && vendor.city.toLowerCase().includes(term));

            return matchesStatus && matchesType && matchesSearch;
        });
    }, [vendors, statusFilter, typeFilter, searchTerm]);

    if (loading) {
        return (
            <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-20 rounded-2xl animate-pulse ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32">
            {/* 1. Header & Quick Stats */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
                <div>
                    <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Vendor Oversight & Governance
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {counts.ALL} Registered Merchants
                            </span>
                        </div>
                        {counts.PENDING > 0 && (
                            <>
                                <span className={`h-3 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {counts.PENDING} Pending Review
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Search Field */}
                <div className="relative w-full md:w-80">
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                    }`} />
                    <input
                        type="text"
                        placeholder="Search merchant, owner, city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                            isDark
                                ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-white/10'
                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
                        }`}
                    />
                </div>
            </div>

            {/* 2. Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { key: 'ALL' as const, label: 'All Merchants', count: counts.ALL },
                        { key: 'PENDING' as const, label: 'Pending Review', count: counts.PENDING },
                        { key: 'VERIFIED' as const, label: 'Authorized', count: counts.VERIFIED },
                        { key: 'REJECTED' as const, label: 'Suspended / Rejected', count: counts.REJECTED },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                statusFilter === tab.key
                                    ? isDark
                                        ? 'bg-white text-slate-950 border-white shadow-sm'
                                        : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                    : isDark
                                        ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                statusFilter === tab.key
                                    ? isDark ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-white'
                                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Model / Type Filter */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Model:</span>
                    <select
                        aria-label="Filter by merchant model"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'MARKETPLACE' | 'STANDALONE')}
                        className={`text-xs font-semibold rounded-xl border px-3 py-1.5 outline-none transition-all ${
                            isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-slate-400'
                                : 'bg-white border-slate-200 text-slate-700 focus:border-slate-900'
                        }`}
                    >
                        <option value="ALL">All Models</option>
                        <option value="MARKETPLACE">Marketplace Seller</option>
                        <option value="STANDALONE">Standalone Storefront</option>
                    </select>
                </div>
            </div>

            {/* 3. Master Registry Table */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`text-[11px] uppercase font-semibold tracking-wider ${
                            isDark ? 'bg-slate-950/60 text-slate-400 border-b border-slate-800' : 'bg-slate-50 text-slate-500 border-b border-slate-100'
                        }`}>
                            <tr>
                                <th className="px-6 py-3.5 text-left">Business Entity</th>
                                <th className="px-6 py-3.5 text-left">Contact Principal</th>
                                <th className="px-6 py-3.5 text-left hidden md:table-cell">Enrolled</th>
                                <th className="px-6 py-3.5 text-left">Status</th>
                                <th className="px-6 py-3.5 text-left hidden lg:table-cell">Compliance</th>
                                <th className="px-6 py-3.5 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y text-sm ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                            {filteredVendors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <p className={`font-semibold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                No vendors matching current criteria
                                            </p>
                                            <p className="text-xs text-slate-400 max-w-sm">
                                                {searchTerm
                                                    ? 'Try refining your search keyword or clearing the search query.'
                                                    : 'New merchant registration applications will appear here for review.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <tr
                                        key={vendor.id}
                                        onClick={() => setSelectedVendor(vendor)}
                                        className={`group cursor-pointer transition-colors ${
                                            isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                                                    isDark
                                                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                                                        : 'bg-slate-100 border-slate-200 text-slate-800'
                                                }`}>
                                                    {vendor.business_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className={`font-bold text-sm tracking-tight truncate ${
                                                        isDark ? 'text-white' : 'text-slate-900'
                                                    }`}>
                                                        {vendor.business_name}
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">
                                                        {vendor.city}{vendor.city && vendor.region ? ', ' : ''}{vendor.region}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-medium text-xs truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                {vendor.owner_name}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">
                                                {vendor.business_email || vendor.owner_email}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-xs font-medium hidden md:table-cell ${
                                            isDark ? 'text-slate-400' : 'text-slate-500'
                                        }`}>
                                            {formatDate(vendor.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                vendor.status === 'VERIFIED'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : vendor.status === 'PENDING'
                                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                            }`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className={`inline-flex items-center gap-1 font-medium ${
                                                    vendor.documents?.ghana_card ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                                }`}>
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    {vendor.documents?.ghana_card ? 'ID Verified' : 'No ID'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                                                isDark
                                                    ? 'border-slate-700 text-slate-300 group-hover:bg-slate-800 group-hover:text-white'
                                                    : 'border-slate-200 text-slate-700 group-hover:bg-slate-100 group-hover:text-slate-900'
                                            }`}>
                                                Review
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Compliance & Legal Review Modal */}
            {selectedVendor && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => !actionLoading && setSelectedVendor(null)}
                >
                    <div
                        className={`w-full max-w-2xl rounded-2xl border shadow-xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold tracking-tight">
                                        {selectedVendor.business_name}
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                                        selectedVendor.status === 'VERIFIED'
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            : selectedVendor.status === 'PENDING'
                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    }`}>
                                        {selectedVendor.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span>Registered on {formatDate(selectedVendor.created_at)}</span>
                                    <span>•</span>
                                    <Link
                                        href={`/store/${selectedVendor.slug}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:underline font-semibold"
                                    >
                                        <span>View Storefront</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVendor(null)}
                                className={`p-2 rounded-xl transition-colors ${
                                    isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Principal Profile Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border space-y-2 ${
                                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'
                            }`}>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <User className="w-3.5 h-3.5" />
                                    <span>Owner / Principal</span>
                                </div>
                                <p className="font-bold text-sm">{selectedVendor.owner_name}</p>
                                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                                    <p>{selectedVendor.business_email}</p>
                                    <p>{selectedVendor.business_phone}</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border space-y-2 ${
                                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'
                            }`}>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Location & Fulfillment</span>
                                </div>
                                <p className="font-bold text-sm">
                                    {selectedVendor.city || 'Accra'}, {selectedVendor.region || 'Greater Accra'}
                                </p>
                                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                                    <p>Total Orders: {selectedVendor.total_orders}</p>
                                    <p>Fulfillment Rate: {selectedVendor.fulfillment_rate}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Compliance & Legal Credentials Inspection */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Legal Compliance & Settlement Audit
                            </h4>
                            <div className={`rounded-xl border divide-y overflow-hidden ${
                                isDark ? 'border-slate-800 divide-slate-800 bg-slate-900' : 'border-slate-200 divide-slate-100 bg-white'
                            }`}>
                                {/* Ghana Card */}
                                <div className="p-3.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="font-semibold">Ghana Card Number</span>
                                            <div className="text-[11px] text-slate-400 font-mono">
                                                {selectedVendor.documents?.ghana_card || 'Not provided'}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                        selectedVendor.documents?.ghana_card
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                    }`}>
                                        {selectedVendor.documents?.ghana_card ? 'Provided' : 'Pending'}
                                    </span>
                                </div>

                                {/* Business Registration Certificate */}
                                <div className="p-3.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="font-semibold">Business Registration Certificate</span>
                                            <div className="text-[11px] text-slate-400 font-mono">
                                                {selectedVendor.documents?.business_cert || 'Not provided'}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                        selectedVendor.documents?.business_cert
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                    }`}>
                                        {selectedVendor.documents?.business_cert ? 'Provided' : 'Pending'}
                                    </span>
                                </div>

                                {/* Escrow Settlement Credentials */}
                                <div className="p-3.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="font-semibold">Escrow Settlement Destination</span>
                                            <div className="text-[11px] text-slate-400">
                                                {selectedVendor.documents?.bank_name
                                                    ? `${selectedVendor.documents.bank_name} • ${selectedVendor.documents.bank_account_number || ''}`
                                                    : 'No payout account on file'}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                        selectedVendor.documents?.has_payout_setup
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    }`}>
                                        {selectedVendor.documents?.has_payout_setup ? 'Configured' : 'Needs Setup'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 1-Click Moderation Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {selectedVendor.status === 'PENDING' ? (
                                <>
                                    <button
                                        onClick={() => handleVerify(selectedVendor)}
                                        disabled={actionLoading}
                                        className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Authorize & Activate Vendor</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedVendor)}
                                        disabled={actionLoading}
                                        className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold border border-rose-600/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                                    >
                                        Reject Application
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => selectedVendor.status === 'VERIFIED' ? handleReject(selectedVendor) : handleVerify(selectedVendor)}
                                    disabled={actionLoading}
                                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${
                                        selectedVendor.status === 'VERIFIED'
                                            ? 'border border-rose-600/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                            : isDark
                                                ? 'bg-white text-slate-950 hover:bg-slate-100'
                                                : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {selectedVendor.status === 'VERIFIED' ? 'Suspend Merchant Account' : 'Re-Authorize Merchant'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Toast Notifications */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
