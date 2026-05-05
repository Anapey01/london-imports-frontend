/**
 * London's Imports - Admin Product Catalog Management
 * Professional catalog management with clean design
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI, productsAPI } from '@/lib/api';
import { AdminProduct } from '@/types';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

// Component Imports
import ProductStats from '@/components/admin/products/ProductStats';
import ProductFilters from '@/components/admin/products/ProductFilters';
import ProductTable from '@/components/admin/products/ProductTable';
import ProductGrid from '@/components/admin/products/ProductGrid';
import AddProductModal from '@/components/admin/products/AddProductModal';
import EditProductModal from '@/components/admin/products/EditProductModal';

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
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        category: 'Electronics',
        price: 0,
        stock: 0,
        status: 'DRAFT',
        featured: false,
        preOrder: true,
        expectedDate: '',
        estimatedWeeks: 3,
    });

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

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    adminAPI.products(),
                    productsAPI.categories()
                ]);
                
                // Structural Immunity
                const pData = productsRes.data;
                const productsArray = Array.isArray(pData.results) ? pData.results : (Array.isArray(pData) ? pData : []);
                setProducts(productsArray);

                const cData = categoriesRes.data;
                const categoriesArray = Array.isArray(cData.results) ? cData.results : (Array.isArray(cData) ? cData : []);
                setCategories(categoriesArray.map((c: { name: string }) => c.name));
            } catch (err) {
                console.error('Failed to load data:', err);
                addAlert('Failed to load catalog data', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
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

    const handleAddProduct = async () => {
        try {
            await adminAPI.createProduct(newProduct);
            const response = await adminAPI.products();
            setProducts(response.data.results || response.data || []);
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
                estimatedWeeks: 3,
            });
            addAlert('Product added successfully');
        } catch (err) {
            console.error('Failed to add product:', err);
            addAlert('Failed to add product', 'error');
        }
    };

    const handleEditProduct = async () => {
        if (!selectedProduct) return;
        try {
            await adminAPI.updateProduct(String(selectedProduct.id), selectedProduct);
            const response = await adminAPI.products();
            setProducts(response.data.results || response.data || []);
            setShowEditModal(false);
            setSelectedProduct(null);
            addAlert('Product updated successfully');
        } catch (err) {
            console.error('Failed to update product:', err);
            addAlert('Failed to update product', 'error');
        }
    };

    const handleBulkActivate = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Bulk Activation',
            message: 'This will set ALL products to ACTIVE and 3 weeks delivery. Continue?',
            variant: 'warning',
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await adminAPI.bulkActivateProducts(3);
                    const response = await adminAPI.products();
                    setProducts(response.data.results || response.data || []);
                    addAlert('All products activated successfully!');
                } catch (err: any) {
                    console.error('Failed bulk activation:', err);
                    const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || 'Unknown error';
                    addAlert(`Bulk activation failed: ${errorMessage}`, 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleDeleteProduct = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Product',
            message: 'Remove this product from the catalog? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteProduct(String(id));
                    setProducts(products.filter((p) => p.id !== id));
                    addAlert('Product deleted successfully');
                } catch (err) {
                    console.error('Failed to delete product:', err);
                    addAlert('Failed to delete product', 'error');
                }
            }
        });
    };

    const toggleFeatured = async (id: number) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        try {
            await adminAPI.featureProduct(String(id), !product.featured);
            setProducts(products.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));
            addAlert(`Product ${!product.featured ? 'featured' : 'unfeatured'} successfully`);
        } catch (err) {
            console.error('Failed to toggle featured:', err);
            addAlert('Failed to update featured status', 'error');
        }
    };

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
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBulkActivate}
                        className={`px-4 py-2.5 rounded-lg border font-medium text-sm flex items-center gap-2 transition-colors ${isDark ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Bulk Active (3 Weeks)
                    </button>
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
            </div>

            <ProductStats products={products} isDark={isDark} />

            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
                categories={categories}
                isDark={isDark}
            />

            {viewMode === 'table' ? (
                <ProductTable
                    products={filteredProducts}
                    isDark={isDark}
                    onEdit={(p) => { setSelectedProduct(p); setShowEditModal(true); }}
                    onDelete={handleDeleteProduct}
                    onToggleFeatured={toggleFeatured}
                    getStatusStyle={getStatusStyle}
                    ProductIcon={ProductIcon}
                />
            ) : (
                <ProductGrid
                    products={filteredProducts}
                    isDark={isDark}
                    onEdit={(p) => { setSelectedProduct(p); setShowEditModal(true); }}
                    onToggleFeatured={toggleFeatured}
                    getStatusStyle={getStatusStyle}
                    ProductIcon={ProductIcon}
                />
            )}

            <AddProductModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProduct}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                categories={categories}
                isDark={isDark}
            />

            <EditProductModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleEditProduct}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                categories={categories}
                isDark={isDark}
            />

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Notification Toasts */}
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
