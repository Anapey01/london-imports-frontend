/**
 * London's Imports - Admin Product Catalog Management
 * Professional catalog management with clean design
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'PENDING' | 'OUT_OF_STOCK' | 'DRAFT';
    featured: boolean;
    preOrder: boolean;
    expectedDate: string;
    vendor: string;
    createdAt: string;
}

const CATEGORIES = [
    'Electronics',
    'Fashion',
    'Phones & Tablets',
    'Computers',
    'Home & Living',
    'Beauty & Health',
    'Gaming',
    'Accessories'
];

// Category icons as SVG paths
const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
        'Electronics': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        'Fashion': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
        'Phones & Tablets': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        'Computers': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        'Home & Living': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        'Beauty & Health': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        'Gaming': 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        'Accessories': 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    };
    return icons[category] || icons['Electronics'];
};

export default function AdminProductsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        category: 'Electronics',
        price: 0,
        stock: 0,
        status: 'DRAFT' as const,
        featured: false,
        preOrder: true,
        expectedDate: '',
    });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await adminAPI.products();
                // Map API response if necessary or use directly if matches interface
                // API returns list of objects matching Product interface mostly
                setProducts(response.data.results || response.data || []);
            } catch (err) {
                console.error('Failed to load products:', err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; text: string; dot: string }> = {
            ACTIVE: { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: isDark ? 'text-emerald-400' : 'text-emerald-700', dot: 'bg-emerald-500' },
            PENDING: { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', text: isDark ? 'text-amber-400' : 'text-amber-700', dot: 'bg-amber-500' },
            OUT_OF_STOCK: { bg: isDark ? 'bg-red-500/10' : 'bg-red-50', text: isDark ? 'text-red-400' : 'text-red-700', dot: 'bg-red-500' },
            DRAFT: { bg: isDark ? 'bg-slate-500/10' : 'bg-slate-100', text: isDark ? 'text-slate-400' : 'text-slate-600', dot: 'bg-slate-400' },
        };
        return styles[status] || styles.DRAFT;
    };

    const handleAddProduct = () => {
        const product: Product = {
            id: Date.now().toString(),
            ...newProduct,
            vendor: 'Admin',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setProducts([product, ...products]);
        setShowAddModal(false);
        setNewProduct({
            name: '',
            description: '',
            category: 'Electronics',
            price: 0,
            stock: 0,
            status: 'DRAFT',
            featured: false,
            preOrder: true,
            expectedDate: '',
        });
    };

    const handleEditProduct = () => {
        if (!selectedProduct) return;
        setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
        setShowEditModal(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('Remove this product from the catalog?')) {
            try {
                await adminAPI.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Failed to delete product');
            }
        }
    };

    const toggleFeatured = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    };

    const togglePreOrder = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, preOrder: !p.preOrder } : p));
    };

    // Product Icon Component
    const ProductIcon = ({ category, className = '' }: { category: string; className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={getCategoryIcon(category)} />
        </svg>
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <div className={`h-12 w-48 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                <div className={`h-16 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-20 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Product Catalog
                    </h2>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Manage your inventory and pre-order listings
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2.5 rounded-lg bg-pink-500 text-white font-medium text-sm flex items-center gap-2 hover:bg-pink-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Product
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: products.length, color: 'text-blue-500' },
                    { label: 'Pre-Orders', value: products.filter(p => p.preOrder).length, color: 'text-purple-500' },
                    { label: 'Active', value: products.filter(p => p.status === 'ACTIVE').length, color: 'text-emerald-500' },
                    { label: 'Pending Review', value: products.filter(p => p.status === 'PENDING').length, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className={`rounded-xl border p-4 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 relative">
                        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
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
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`px-4 py-2.5 rounded-lg border text-sm ${isDark ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                    >
                        <option value="ALL">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select
                        value={statusFilter}
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
                            className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-pink-500 text-white' : isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-pink-500 text-white' : isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                    <table className="w-full">
                        <thead>
                            <tr className={isDark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Product</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Category</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Price</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Stock</th>
                                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                                <th className={`px-5 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
                            {filteredProducts.map((product) => {
                                const statusStyle = getStatusStyle(product.status);
                                return (
                                    <tr key={product.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                                                    <ProductIcon category={product.category} className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                                                        {product.featured && (
                                                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        )}
                                                        {product.preOrder && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                                                PRE-ORDER
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-5 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{product.category}</td>
                                        <td className={`px-5 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {product.price.toLocaleString()}</td>
                                        <td className={`px-5 py-4 text-sm ${product.stock === 0 ? 'text-purple-500' : isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                            {product.stock === 0 ? 'Awaiting' : product.stock}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                {product.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => toggleFeatured(product.id)} title={product.featured ? 'Remove from featured' : 'Add to featured'} className={`p-1.5 rounded-md transition-colors ${product.featured ? 'text-amber-500' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>
                                                    <svg className="w-4 h-4" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className={`py-12 text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-sm">No products found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProducts.map((product) => {
                        const statusStyle = getStatusStyle(product.status);
                        return (
                            <div key={product.id} className={`rounded-xl border overflow-hidden transition-shadow hover:shadow-lg ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                                <div className={`h-36 flex items-center justify-center relative ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <ProductIcon category={product.category} className={`w-16 h-16 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                                    {product.preOrder && (
                                        <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-md font-medium bg-purple-500 text-white">
                                            PRE-ORDER
                                        </span>
                                    )}
                                    {product.featured && (
                                        <span className="absolute top-3 right-3">
                                            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{product.category}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                            <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                                            {product.status}
                                        </span>
                                    </div>
                                    <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{product.description}</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>GHS {product.price.toLocaleString()}</p>
                                        {product.expectedDate && (
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Est. {product.expectedDate}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700/50 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                            Edit
                                        </button>
                                        <button onClick={() => toggleFeatured(product.id)} className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-amber-500' : isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <svg className="w-5 h-5" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                    <div className={`w-full max-w-xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Product</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create a new listing for your catalog</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Product Name</label>
                                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`} placeholder="e.g., iPhone 16 Pro Max" />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows={2} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`} placeholder="Brief product description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                                    <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Price (GHS)</label>
                                    <input type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} placeholder="0.00" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Expected Arrival</label>
                                    <input type="date" value={newProduct.expectedDate} onChange={(e) => setNewProduct({ ...newProduct, expectedDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status</label>
                                    <select value={newProduct.status} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as any })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PENDING">Pending Review</option>
                                        <option value="ACTIVE">Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`flex items-center gap-6 py-2 px-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newProduct.preOrder} onChange={(e) => setNewProduct({ ...newProduct, preOrder: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Pre-Order Item</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured Product</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAddModal(false)} className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                Cancel
                            </button>
                            <button onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.price} className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                    <div className={`w-full max-w-xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Product</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Update product details</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Product Name</label>
                                <input type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                                <textarea value={selectedProduct.description} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} rows={2} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                                    <select value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Price (GHS)</label>
                                    <input type="number" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Stock</label>
                                    <input type="number" value={selectedProduct.stock} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status</label>
                                    <select value={selectedProduct.status} onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value as any })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="OUT_OF_STOCK">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Expected Arrival</label>
                                <input type="date" value={selectedProduct.expectedDate} onChange={(e) => setSelectedProduct({ ...selectedProduct, expectedDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                            </div>
                            <div className={`flex items-center gap-6 py-2 px-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={selectedProduct.preOrder} onChange={(e) => setSelectedProduct({ ...selectedProduct, preOrder: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Pre-Order</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={selectedProduct.featured} onChange={(e) => setSelectedProduct({ ...selectedProduct, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowEditModal(false)} className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                Cancel
                            </button>
                            <button onClick={handleEditProduct} className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
