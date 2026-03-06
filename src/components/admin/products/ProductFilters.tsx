'use client';

import React from 'react';

interface ProductFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categoryFilter: string;
    setCategoryFilter: (cat: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    viewMode: 'grid' | 'table';
    setViewMode: (mode: 'grid' | 'table') => void;
    categories: string[];
    isDark: boolean;
}

const ProductFilters = ({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    categories,
    isDark
}: ProductFiltersProps) => {
    return (
        <div className={`rounded-xl border p-4 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                    <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products..."
                        aria-label="Search products"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm ${isDark
                            ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                    />
                </div>
                <select
                    value={categoryFilter}
                    aria-label="Filter by category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`px-4 py-2.5 rounded-lg border text-sm ${isDark ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                >
                    <option value="ALL">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                    value={statusFilter}
                    aria-label="Filter by status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-4 py-2.5 rounded-lg border text-sm ${isDark ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="DRAFT">Draft</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
                <div className={`flex rounded-lg border overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <button
                        onClick={() => setViewMode('table')}
                        aria-label="Switch to table view"
                        className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-pink-500 text-white' : isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        aria-label="Switch to grid view"
                        className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-pink-500 text-white' : isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
