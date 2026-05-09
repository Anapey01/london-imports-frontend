/**
 * London's Imports - Admin Vendor Management
 * Premium 'Atelier' architectural system with monochromatic precision
 */
'use client';

import React, { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';
import { Search, Building2, Eye, Activity, MapPin, Calendar, CheckSquare, X } from 'lucide-react';

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
    const [typeFilter, setTypeFilter] = useState('ALL');
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
            title: 'AUTHORIZE PARTNER',
            message: `Authorize ${vendor.business_name} for active marketplace participation?`,
            variant: 'warning',
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    await adminAPI.verifyVendor(vendor.id);
                    setVendors(vendors.map(v =>
                        v.id === vendor.id
                            ? { ...v, is_verified: true, is_active: true, status: 'VERIFIED' as const }
                            : v
                    ));
                    setSelectedVendor(null);
                    addAlert(`${vendor.business_name} authorization complete`);
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
        const isVerified = vendor.status === 'VERIFIED';
        setConfirmModal({
            isOpen: true,
            title: isVerified ? 'SUSPEND ACCOUNT' : 'REJECT APPLICATION',
            message: `Execute ${isVerified ? 'suspension' : 'rejection'} for ${vendor.business_name}?`,
            variant: 'danger',
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    await adminAPI.rejectVendor(vendor.id);
                    setVendors(vendors.map(v =>
                        v.id === vendor.id
                            ? { ...v, is_verified: false, is_active: false, status: 'REJECTED' as const }
                            : v
                    ));
                    setSelectedVendor(null);
                    addAlert(`${vendor.business_name} ${isVerified ? 'suspended' : 'rejected'} successfully`);
                } catch (err) {
                    console.error('Failed to reject vendor:', err);
                    addAlert('Action failed', 'error');
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase();
        } catch {
            return 'RECENT';
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesStatus = statusFilter === 'ALL' || vendor.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || vendor.vendor_type === typeFilter;
        const matchesSearch = vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             vendor.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });

    const pendingCount = vendors.filter(v => v.status === 'PENDING').length;

    if (loading) {
        return (
            <div className="space-y-4 p-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse border border-slate-100"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Vendor Registry</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{vendors.length} PARTNERS ENROLLED</span>
                        </div>
                        {pendingCount > 0 && (
                            <>
                                <span className="h-4 w-px bg-slate-200" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 animate-pulse">{pendingCount} WAITING FOR REVIEW</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH ENTITIES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 2. PROTOCOL FILTERS */}
            <div className="flex flex-col gap-6">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { key: 'ALL', label: 'All Manifests' },
                        { key: 'PENDING', label: 'Pending Review' },
                        { key: 'VERIFIED', label: 'Authorized' },
                        { key: 'REJECTED', label: 'Restricted' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setStatusFilter(filter.key)}
                            className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${statusFilter === filter.key
                                ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 border-l border-slate-100 pl-4">
                    {[
                        { key: 'ALL', label: 'ALL PARTNERS' },
                        { key: 'MARKETPLACE', label: 'MARKETPLACE VENDORS' },
                        { key: 'STANDALONE', label: 'OFFICIAL PARTNERS' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setTypeFilter(filter.key)}
                            className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all ${typeFilter === filter.key
                                ? 'text-slate-950 underline underline-offset-8'
                                : 'text-slate-300 hover:text-slate-900'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. MASTER REGISTRY TABLE */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Partner Name</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Contact Person</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Enrolled Date</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Status</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Location</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredVendors.map((vendor) => (
                                <VendorRow
                                    key={vendor.id}
                                    vendor={vendor}
                                    setSelectedVendor={setSelectedVendor}
                                    formatDate={formatDate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredVendors.length === 0 && (
                    <div className="py-32 text-center">
                        <Building2 className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">No Partners Found</p>
                    </div>
                )}
            </div>

            {/* Detailed Review Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !actionLoading && setSelectedVendor(null)}>
                    <div className="w-full max-w-2xl bg-white p-12 space-y-12 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 bg-slate-50 px-3 py-1">
                                    {selectedVendor.vendor_type === 'STANDALONE' ? 'OFFICIAL PARTNER PROFILE' : 'MARKETPLACE VENDOR PROFILE'}
                                </span>
                                <h3 className="text-3xl font-serif font-bold text-slate-950 tracking-tighter">{selectedVendor.business_name}</h3>
                            </div>
                            <button onClick={() => setSelectedVendor(null)} className="text-slate-300 hover:text-slate-950 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Owner Name</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.owner_name}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Contact Info</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.business_email}</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.business_phone}</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Business Location</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.city}, {selectedVendor.region}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Performance Summary</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.total_orders} TOTAL ORDERS</p>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{selectedVendor.fulfillment_rate}% SUCCESS RATE</p>
                                </div>
                            </div>
                        </div>

                        {selectedVendor.vendor_type === 'STANDALONE' && selectedVendor.documents && (
                            <div className="border-t border-slate-100 pt-12 space-y-6">
                                <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em]">Document Verification</h4>
                                <div className="grid grid-cols-1 gap-px bg-slate-100 border border-slate-100">
                                    {[
                                        { label: 'NATIONAL ID (GHANA CARD)', value: selectedVendor.documents.ghana_card },
                                        { label: 'REGISTRATION CERTIFICATE', value: selectedVendor.documents.business_cert },
                                        { label: 'PAYMENT SETUP (PAYSTACK)', value: selectedVendor.documents.has_paystack, isBool: true }
                                    ].map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-6 bg-white">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.label}</span>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${(doc.isBool ? doc.value : !!doc.value) ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {(doc.isBool ? doc.value : !!doc.value) ? 'VERIFIED' : 'WAITING FOR DOCS'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-4 pt-12">
                            {selectedVendor.status === 'PENDING' ? (
                                <>
                                    <button
                                        onClick={() => handleVerify(selectedVendor)}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading ? 'PROCESSING...' : 'AUTHORIZE PARTNER'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedVendor)}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-white border border-slate-950 text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
                                    >
                                        REJECT APPLICATION
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => selectedVendor.status === 'VERIFIED' ? handleReject(selectedVendor) : handleVerify(selectedVendor)}
                                    disabled={actionLoading}
                                    className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all disabled:opacity-50 ${
                                        selectedVendor.status === 'VERIFIED' 
                                        ? 'bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white' 
                                        : 'bg-slate-950 text-white hover:bg-emerald-600'
                                    }`}
                                >
                                    {selectedVendor.status === 'VERIFIED' ? 'SUSPEND PARTNER' : 'RESTORE PARTNER'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            <div className="fixed bottom-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
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

const VendorRow = React.memo(({ 
    vendor, 
    setSelectedVendor, 
    formatDate 
}: { 
    vendor: Vendor; 
    setSelectedVendor: (vendor: Vendor) => void; 
    formatDate: (date: string) => string; 
}) => {
    return (
        <tr className="group hover:bg-slate-50/50 transition-all duration-500 cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
            <td className="px-8 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                        {vendor.business_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{vendor.business_name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">TYPE: {vendor.vendor_type}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-950 truncate max-w-[200px]">{vendor.owner_name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{vendor.business_email}</p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-300 uppercase tabular-nums">{formatDate(vendor.created_at)}</p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                        vendor.status === 'VERIFIED' ? 'bg-emerald-500' : 
                        vendor.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-red-600'
                    }`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                        vendor.status === 'VERIFIED' ? 'text-slate-950' : 
                        vendor.status === 'PENDING' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                        {vendor.status}
                    </span>
                </div>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vendor.city}, {vendor.region}</p>
            </td>
            <td className="px-8 py-8 text-right">
                <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-950 pb-1">VIEW PROFILE</span>
                </div>
            </td>
        </tr>
    );
});
