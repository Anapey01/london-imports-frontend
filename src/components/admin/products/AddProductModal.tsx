'use client';

import React from 'react';

interface NewProduct {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    expectedDate: string;
    status: string;
    preOrder: boolean;
    featured: boolean;
}

interface AddProductModalProps {
    show: boolean;
    onClose: () => void;
    onAdd: () => void;
    newProduct: NewProduct;
    setNewProduct: (product: NewProduct) => void;
    categories: string[];
    isDark: boolean;
}

const AddProductModal = ({
    show,
    onClose,
    onAdd,
    newProduct,
    setNewProduct,
    categories,
    isDark
}: AddProductModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`w-full max-w-xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Product</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create a new listing for your catalog</p>
                    </div>
                    <button onClick={onClose} aria-label="Close modal" className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="add-name" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Product Name</label>
                        <input id="add-name" type="text" value={newProduct.name || ''} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`} placeholder="e.g., iPhone 16 Pro Max" />
                    </div>
                    <div>
                        <label htmlFor="add-desc" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                        <textarea id="add-desc" value={newProduct.description || ''} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows={2} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-pink-500/20`} placeholder="Brief product description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="add-category" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                            <select id="add-category" value={newProduct.category || ''} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="add-price" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Price (GHS)</label>
                            <input id="add-price" type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} placeholder="0.00" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="add-date" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Expected Arrival</label>
                            <input id="add-date" type="date" value={newProduct.expectedDate || ''} onChange={(e) => setNewProduct({ ...newProduct, expectedDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                        </div>
                        <div>
                            <label htmlFor="add-status" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status</label>
                            <select id="add-status" value={newProduct.status || ''} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                <option value="DRAFT">Draft</option>
                                <option value="PENDING">Pending Review</option>
                                <option value="ACTIVE">Active</option>
                            </select>
                        </div>
                    </div>
                    <div className={`flex items-center gap-6 py-2 px-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={newProduct.preOrder || false} onChange={(e) => setNewProduct({ ...newProduct, preOrder: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Pre-Order Item</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={newProduct.featured || false} onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured Product</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Cancel
                    </button>
                    <button onClick={onAdd} disabled={!newProduct.name || !newProduct.price} className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
