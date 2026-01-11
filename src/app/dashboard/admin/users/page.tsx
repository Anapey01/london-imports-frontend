/**
 * London's Imports - Admin User Management
 * View and manage all users with mobile-friendly card layout
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

export default function AdminUsersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [deleteUser, setDeleteUser] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const loadUsers = async () => {
        try {
            const response = await adminAPI.users();
            const usersData = response.data.results || response.data || [];
            setUsers(usersData.map((user: any) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                role: user.role || 'CUSTOMER',
                is_active: user.is_active !== false,
                created_at: user.created_at || user.date_joined,
            })));
        } catch (err: any) {
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
            await adminAPI.deleteUser(deleteUser.id);
            setUsers(users.filter(u => u.id !== deleteUser.id));
            setDeleteUser(null);
        } catch (err: any) {
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
            case 'ADMIN': return 'text-red-500';
            case 'VENDOR': return 'text-purple-500';
            default: return 'text-blue-500';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">User Management</h2>
                    <p className="text-pink-100 text-sm">{users.length} registered users</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            </div>

            {/* Search */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder:text-slate-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
            </div>

            {/* Role Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { key: 'ALL', label: 'All Users' },
                    { key: 'CUSTOMER', label: 'Customers' },
                    { key: 'VENDOR', label: 'Vendors' },
                    { key: 'ADMIN', label: 'Admin' },
                ].map((role) => (
                    <button
                        key={role.key}
                        onClick={() => setRoleFilter(role.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${roleFilter === role.key
                            ? 'bg-gray-900 text-white'
                            : isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>

            {/* User Cards */}
            <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        No users found
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                                        {getInitials(user.first_name, user.last_name)}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-slate-800' : 'border-white'} ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {user.first_name} {user.last_name}
                                        </h3>
                                        <div className="flex items-center gap-1 ml-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteUser(user)}
                                                className="p-2 rounded-lg transition-colors hover:bg-red-50 text-red-400"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {user.email}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-xs font-medium flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {user.role}
                                        </span>
                                        <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteUser(null)}>
                    <div
                        className={`w-full max-w-sm rounded-2xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Delete User?
                        </h3>
                        <p className={`text-sm text-center mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Are you sure you want to delete <strong>{deleteUser.first_name} {deleteUser.last_name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteUser(null)}
                                className={`flex-1 py-2.5 rounded-xl border font-medium ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <div
                        className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Role</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="VENDOR">Vendor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Status</label>
                                <select
                                    defaultValue={selectedUser.is_active ? 'active' : 'suspended'}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className={`flex-1 py-2.5 rounded-xl border font-medium ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
