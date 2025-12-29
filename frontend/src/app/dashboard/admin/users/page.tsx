/**
 * London's Imports - Admin User Management
 * View and manage all users
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function AdminUsersPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        // Mock data - replace with API call
        setUsers([
            { id: '1', username: 'johndoe', email: 'john@example.com', first_name: 'John', last_name: 'Doe', role: 'CUSTOMER', is_active: true, date_joined: '2024-01-15' },
            { id: '2', username: 'janesmith', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', role: 'VENDOR', is_active: true, date_joined: '2024-02-20' },
            { id: '3', username: 'mikejohn', email: 'mike@example.com', first_name: 'Mike', last_name: 'Johnson', role: 'CUSTOMER', is_active: false, date_joined: '2024-03-10' },
            { id: '4', username: 'sarahwilson', email: 'sarah@example.com', first_name: 'Sarah', last_name: 'Wilson', role: 'VENDOR', is_active: true, date_joined: '2024-04-05' },
            { id: '5', username: 'tombrown', email: 'tom@example.com', first_name: 'Tom', last_name: 'Brown', role: 'ADMIN', is_active: true, date_joined: '2024-05-12' },
            { id: '6', username: 'alicecooper', email: 'alice@example.com', first_name: 'Alice', last_name: 'Cooper', role: 'CUSTOMER', is_active: true, date_joined: '2024-06-18' },
        ]);
        setLoading(false);
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
            VENDOR: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
            CUSTOMER: isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600',
        };
        return colors[role] || colors.CUSTOMER;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-16 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>User Management</h2>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{users.length} users total</span>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${isDark
                                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                            }`}
                    />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'CUSTOMER', 'VENDOR', 'ADMIN'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === role
                                    ? 'bg-pink-500 text-white'
                                    : isDark
                                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {role === 'ALL' ? 'All' : role.charAt(0) + role.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <table className="w-full">
                    <thead className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>User</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Email</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Role</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Joined</th>
                            <th className={`px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={`${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${isDark ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.first_name} {user.last_name}</p>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.is_active
                                            ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                                            : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {user.is_active ? 'Active' : 'Suspended'}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {new Date(user.date_joined).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            className={`p-2 rounded-lg transition-colors text-red-500 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <div
                        className={`w-full max-w-md rounded-xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Role</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
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
                                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className={`flex-1 py-2 rounded-lg border font-medium ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600"
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
