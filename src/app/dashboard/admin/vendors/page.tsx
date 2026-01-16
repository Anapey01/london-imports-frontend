/**
 * London's Imports - Admin Vendor Management
 * Premium mobile responsive design with verify/reject functionality
 */
'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

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
    vendor_type: 'MARKETPLACE' | 'STANDALONE';
    documents?: {
        ghana_card: string | null;
        business_cert: string | null;
        has_paystack: boolean;
    };
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL'); // New type filter
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadVendors = async () => {
        try {
            const response = await adminAPI.vendors();
            setVendors(response.data || []);
        } catch (err) {
            console.error('Failed to load vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const handleVerify = async (vendor: Vendor) => {
        setActionLoading(true);
        try {
            await adminAPI.verifyVendor(vendor.id);
            setVendors(vendors.map(v =>
                v.id === vendor.id
                    ? { ...v, is_verified: true, is_active: true, status: 'VERIFIED' as const }
                    : v
            ));
            setSelectedVendor(null);
        } catch (err) {
            console.error('Failed to verify vendor:', err);
            alert('Failed to verify vendor');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (vendor: Vendor) => {
        setActionLoading(true);
        try {
            await adminAPI.rejectVendor(vendor.id);
            setVendors(vendors.map(v =>
                v.id === vendor.id
                    ? { ...v, is_verified: false, is_active: false, status: 'REJECTED' as const }
                    : v
            ));
            setSelectedVendor(null);
        } catch (err) {
            console.error('Failed to reject vendor:', err);
            alert('Failed to reject vendor');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Recently';
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        } catch {
            return 'Recently';
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesStatus = statusFilter === 'ALL' || vendor.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || vendor.vendor_type === typeFilter;
        return matchesStatus && matchesType;
    });

    const pendingCount = vendors.filter(v => v.status === 'PENDING').length;

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string, text: string, dot: string }> = {
            PENDING: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
            VERIFIED: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
            REJECTED: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
        };
        return styles[status] || styles.PENDING;
    };

    const getTypeBadge = (type: string) => {
        if (type === 'STANDALONE') {
            return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Partner' };
        }
        return { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Seller' };
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl animate-pulse bg-gradient-to-r from-gray-100 to-gray-200"></div>
                ))}
            </div>
        );
    }

    // Helper for verification documents
    const VerificationStatus = ({ label, value, isBoolean = false }: { label: string, value: string | boolean | null | undefined, isBoolean?: boolean }) => {
        const isValid = isBoolean ? value === true : !!value;
        return (
            <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <div className="flex items-center gap-1.5">
                    {isValid ? (
                        <span className="text-emerald-600 bg-emerald-50 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Verified
                        </span>
                    ) : (
                        <span className="text-amber-600 bg-amber-50 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            Pending
                        </span>
                    )}
                    {!isBoolean && value && <span className="text-sm font-mono text-gray-700 ml-1">{String(value)}</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Vendor Management</h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            Review and manage marketplace sellers and strategic partners.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-right">
                            <p className="text-2xl font-bold">{vendors.length}</p>
                            <p className="text-xs text-indigo-200">Total Vendors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
                    {[
                        { key: 'ALL', label: 'All Status' },
                        { key: 'PENDING', label: `Pending Review${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                        { key: 'VERIFIED', label: 'Verified' },
                        { key: 'REJECTED', label: 'Rejected' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setStatusFilter(filter.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${statusFilter === filter.key
                                ? filter.key === 'PENDING'
                                    ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                                    : 'bg-gray-900 border-gray-900 text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Type Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {[
                        { key: 'ALL', label: 'All Types' },
                        { key: 'MARKETPLACE', label: 'Sellers' },
                        { key: 'STANDALONE', label: 'Partners' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setTypeFilter(filter.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${typeFilter === filter.key
                                ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-500/20'
                                : 'bg-transparent text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vendor List */}
            <div className="space-y-3">
                {filteredVendors.map((vendor) => {
                    const statusStyle = getStatusBadge(vendor.status);
                    const typeBadge = getTypeBadge(vendor.vendor_type);

                    return (
                        <div key={vendor.id}
                            onClick={() => setSelectedVendor(vendor)}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-4 cursor-pointer relative overflow-hidden"
                        >
                            {/* Hover Indicator */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center text-gray-700 font-bold text-lg shadow-inner">
                                        {vendor.business_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{vendor.business_name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${typeBadge.bg} ${typeBadge.text}`}>
                                                {typeBadge.label}
                                            </span>
                                            <span className="text-xs text-gray-400">• {vendor.owner_name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusStyle.bg.replace('50', '50/50')} ${statusStyle.text} border-transparent`}>
                                    {vendor.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <div className="text-xs text-gray-500 flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {vendor.city}, {vendor.region}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {formatDate(vendor.created_at)}
                                    </span>
                                </div>
                                <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    );
                })}

                {filteredVendors.length === 0 && (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No vendors match your filters</p>
                        <button onClick={() => { setStatusFilter('ALL'); setTypeFilter('ALL') }} className="mt-2 text-indigo-600 text-sm font-semibold hover:underline">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Detailed Review Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4" onClick={() => !actionLoading && setSelectedVendor(null)}>
                    <div className="w-full md:max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="relative h-24 bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex items-start justify-between shrink-0">
                            <div className="text-white">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 bg-white/20 backdrop-blur-md`}>
                                    {selectedVendor.vendor_type === 'STANDALONE' ? 'Strategic Partner' : 'Marketplace Seller'}
                                </span>
                                <h3 className="text-2xl font-bold">{selectedVendor.business_name}</h3>
                            </div>
                            <button onClick={() => setSelectedVendor(null)} aria-label="Close modal" className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Owner Name</p>
                                        <p className="font-medium text-sm text-gray-900">{selectedVendor.owner_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium text-sm text-gray-900">{selectedVendor.business_phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-sm text-gray-900 break-all">{selectedVendor.business_email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="font-medium text-sm text-gray-900">{selectedVendor.city}, {selectedVendor.region}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Data (For Partners mainly) */}
                            {selectedVendor.vendor_type === 'STANDALONE' && selectedVendor.documents && (
                                <div className="border border-gray-100 rounded-2xl p-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Verification Documents</h4>
                                    <div className="space-y-1">
                                        <VerificationStatus label="Ghana Card ID" value={selectedVendor.documents.ghana_card || 'Not uploaded'} />
                                        <VerificationStatus label="Business Cert" value={selectedVendor.documents.business_cert || 'Not uploaded'} />
                                        <VerificationStatus label="Paystack Integration" value={selectedVendor.documents.has_paystack} isBoolean />
                                    </div>
                                    <div className="mt-3 p-3 bg-blue-50 text-blue-700 text-xs rounded-xl flex gap-2 items-start">
                                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Verifying a partner grants them a dedicated storefront and enables their custom payment gateway. Ensure all legal documents are valid.
                                    </div>
                                </div>
                            )}

                            {/* Seller Note */}
                            {selectedVendor.vendor_type === 'MARKETPLACE' && (
                                <div className="p-3 bg-gray-50 text-gray-500 text-xs rounded-xl">
                                    Marketplace sellers are vetted for product quality and shipping reliability. No additional legal docs required for basic tier.
                                </div>
                            )}

                        </div>

                        {/* Sticky Action Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white shrink-0 grid grid-cols-2 gap-3">
                            {selectedVendor.status === 'PENDING' ? (
                                <>
                                    <button
                                        onClick={() => handleReject(selectedVendor)}
                                        disabled={actionLoading}
                                        className="py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 disabled:opacity-50 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleVerify(selectedVendor)}
                                        disabled={actionLoading}
                                        className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 hover:shadow-xl transition-all"
                                    >
                                        {actionLoading ? 'Processing...' : 'Approve & Verify'}
                                    </button>
                                </>
                            ) : (
                                selectedVendor.status === 'VERIFIED' ? (
                                    <button
                                        onClick={() => handleReject(selectedVendor)}
                                        disabled={actionLoading}
                                        className="col-span-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 disabled:opacity-50 transition-colors"
                                    >
                                        Suspend Account
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleVerify(selectedVendor)}
                                        disabled={actionLoading}
                                        className="col-span-2 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                                    >
                                        Reinstate Account
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
