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
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadVendors = async () => {
        try {
            const response = await adminAPI.vendors();
            setVendors(response.data || []);
        } catch (err: any) {
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
        if (statusFilter === 'ALL') return true;
        return vendor.status === statusFilter;
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

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl animate-pulse bg-gradient-to-r from-gray-100 to-gray-200"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Vendor Management</h2>
                        <p className="text-violet-100 text-sm">
                            {vendors.length} vendors • {pendingCount > 0 && <span className="font-semibold">{pendingCount} pending review</span>}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {[
                    { key: 'ALL', label: 'All Vendors' },
                    { key: 'PENDING', label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                    { key: 'VERIFIED', label: 'Verified' },
                    { key: 'REJECTED', label: 'Rejected' },
                ].map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setStatusFilter(filter.key)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${statusFilter === filter.key
                            ? filter.key === 'PENDING'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                : 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Vendor Cards */}
            <div className="space-y-3">
                {filteredVendors.map((vendor) => {
                    const statusStyle = getStatusBadge(vendor.status);
                    return (
                        <div key={vendor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {vendor.business_name.charAt(0)}{vendor.business_name.split(' ')[1]?.charAt(0) || ''}
                                </div>
                                <button
                                    onClick={() => setSelectedVendor(vendor)}
                                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-2">
                                <p className="font-bold text-gray-900 text-sm">{vendor.business_name}</p>
                                <p className="text-xs text-gray-500">{vendor.owner_name}</p>
                                <p className="text-xs text-gray-400 break-all">{vendor.business_email}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                    {vendor.status}
                                </span>
                                <span className="text-xs text-gray-400">{vendor.city}</span>
                                <span className="text-xs text-gray-400 ml-auto">{formatDate(vendor.created_at)}</span>
                            </div>
                        </div>
                    );
                })}

                {filteredVendors.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 font-medium">No vendors found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={() => !actionLoading && setSelectedVendor(null)}>
                    <div className="w-full md:max-w-md rounded-t-3xl md:rounded-2xl bg-white max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="pt-3 pb-2 md:hidden sticky top-0 bg-white">
                            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>
                        </div>
                        <div className="px-6 pt-4 pb-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {selectedVendor.business_name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{selectedVendor.business_name}</p>
                                    <p className="text-sm text-gray-500">{selectedVendor.owner_name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-gray-400 mb-1">Email</label><p className="text-sm break-all">{selectedVendor.business_email}</p></div>
                                <div><label className="block text-xs text-gray-400 mb-1">Phone</label><p className="text-sm">{selectedVendor.business_phone || '-'}</p></div>
                                <div><label className="block text-xs text-gray-400 mb-1">City</label><p className="text-sm">{selectedVendor.city}</p></div>
                                <div><label className="block text-xs text-gray-400 mb-1">Region</label><p className="text-sm">{selectedVendor.region}</p></div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-3">
                            {selectedVendor.status === 'PENDING' && (
                                <>
                                    <button onClick={() => handleVerify(selectedVendor)} disabled={actionLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold disabled:opacity-50">
                                        {actionLoading ? 'Processing...' : 'Verify Vendor'}
                                    </button>
                                    <button onClick={() => handleReject(selectedVendor)} disabled={actionLoading} className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold disabled:opacity-50">
                                        Reject Vendor
                                    </button>
                                </>
                            )}
                            {selectedVendor.status === 'VERIFIED' && (
                                <button onClick={() => handleReject(selectedVendor)} disabled={actionLoading} className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold disabled:opacity-50">Suspend Vendor</button>
                            )}
                            {selectedVendor.status === 'REJECTED' && (
                                <button onClick={() => handleVerify(selectedVendor)} disabled={actionLoading} className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold disabled:opacity-50">Reinstate Vendor</button>
                            )}
                            <button onClick={() => setSelectedVendor(null)} disabled={actionLoading} className="w-full py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
