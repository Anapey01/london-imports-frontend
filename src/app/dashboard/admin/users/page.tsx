/**
 * London's Imports - Admin User Management
 * View and manage all users with premium 'Atelier' architectural system
 */
'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import { Search, User, Trash2, Shield, Eye, ShieldCheck, Activity } from 'lucide-react';

interface AdminUser {
    id: string | number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
    date_joined?: string;
}

export default function AdminUsersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const loadUsers = async () => {
        try {
            const response = await adminAPI.users();
            const usersData = response.data.results || response.data || [];
            setUsers(usersData.map((user: AdminUser) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                role: user.role || 'CUSTOMER',
                is_active: user.is_active !== false,
                created_at: user.created_at || user.date_joined,
            })));
        } catch (err: unknown) {
            console.error('Failed to load users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeleteUser = async () => {
        if (!deleteUser) return;
        setIsDeleting(true);
        try {
            await adminAPI.deleteUser(deleteUser.id.toString());
            setUsers(users.filter(u => u.id !== deleteUser.id));
            setDeleteUser(null);
        } catch (err: unknown) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fullName.includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'text-slate-950';
            case 'VENDOR': return 'text-slate-600';
            default: return 'text-slate-400';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase();
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="space-y-4 p-8">
                {[...Array(5)].map((_, i) => (
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
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">User Directory</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{users.length} IDENTITIES_RECORDED</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH IDENTITIES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* 2. PROTOCOL FILTERS */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { key: 'ALL', label: 'All Users' },
                    { key: 'CUSTOMER', label: 'Customers' },
                    { key: 'VENDOR', label: 'Vendors' },
                    { key: 'ADMIN', label: 'Admin' },
                ].map((role) => (
                    <button
                        key={role.key}
                        onClick={() => setRoleFilter(role.key)}
                        className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${roleFilter === role.key
                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                            }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>

            {/* 3. MASTER REGISTRY TABLE */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Identity_Node</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Credential_Auth</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Temporal_Log</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Protocol_Level</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hidden lg:table-cell">Auth_State</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    isDark={isDark}
                                    setSelectedUser={setSelectedUser}
                                    setDeleteUser={setDeleteUser}
                                    getInitials={getInitials}
                                    getRoleColor={getRoleColor}
                                    formatDate={formatDate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-32 text-center">
                        <User className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">Identity Database Null</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteUser && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteUser(null)}>
                    <div
                        className="w-full max-w-sm bg-white p-12 text-center space-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">IDENT_DESTRUCTION_CONFIRM</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Permanently purge records for <span className="text-slate-900 font-black">{deleteUser.first_name} {deleteUser.last_name}</span>?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteUser}
                                disabled={isDeleting}
                                className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {isDeleting ? 'PURGING...' : 'EXECUTE_PURGE'}
                            </button>
                            <button
                                onClick={() => setDeleteUser(null)}
                                className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-all"
                            >
                                ABORT_OPERATION
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <div
                        className="w-full max-w-md bg-white p-12 space-y-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">PROTOCOL_OVERRIDE</h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Access_Tier</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    className="w-full p-4 bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-slate-900 transition-all"
                                    aria-label="Select user role"
                                    title="User role"
                                >
                                    <option value="CUSTOMER">CUSTOMER_PROTOCOL</option>
                                    <option value="VENDOR">VENDOR_AUTHORITY</option>
                                    <option value="ADMIN">ADMIN_MANIFEST</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Lifecycle_State</label>
                                <select
                                    defaultValue={selectedUser.is_active ? 'active' : 'suspended'}
                                    className="w-full p-4 bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-slate-900 transition-all"
                                    aria-label="Select user status"
                                    title="User status"
                                >
                                    <option value="active">ACTIVE_SYNC</option>
                                    <option value="suspended">SUSPEND_PROTOCOL</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 pt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all"
                            >
                                COMMIT_CHANGES
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-all"
                            >
                                DISCARD_INPUT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const UserRow = React.memo(({ 
    user, 
    isDark, 
    setSelectedUser, 
    setDeleteUser, 
    getInitials, 
    getRoleColor, 
    formatDate 
}: any) => {
    return (
        <tr className="group hover:bg-slate-50/50 transition-all duration-500">
            <td className="px-8 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                        {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{user.first_name} {user.last_name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">@{user.username}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic truncate max-w-[200px]">{user.email}</p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-300 uppercase tabular-nums">{formatDate(user.created_at)}</p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${getRoleColor(user.role)}`}>
                    {user.role}_MANIFEST
                </span>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{user.is_active ? 'LIVE_SESSION' : 'OFFLINE'}</span>
                </div>
            </td>
            <td className="px-8 py-8 text-right">
                <div className="flex justify-end items-center gap-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <button
                        onClick={() => setSelectedUser(user)}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors"
                    >
                        MODIFY_ACCESS
                    </button>
                    <button
                        onClick={() => setDeleteUser(user)}
                        className="p-2 text-slate-200 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>
            </td>
        </tr>
    );
});
