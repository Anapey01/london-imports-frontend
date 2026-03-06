'use client';

import React from 'react';
import { AdminProduct } from '@/types';

interface EditProductModalProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    selectedProduct: AdminProduct | null;
    setSelectedProduct: (product: AdminProduct | null) => void;
    categories: string[];
    isDark: boolean;
}

const EditProductModal = ({
    show,
    onClose,
    onSave,
    selectedProduct,
    setSelectedProduct,
    categories,
    isDark
}: EditProductModalProps) => {
    if (!show || !selectedProduct) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`w-full max-w-xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Product</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Update product details</p>
                    </div>
                    <button onClick={onClose} aria-label="Close modal" className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Product Name</label>
                        <input id="edit-name" type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                    </div>
                    <div>
                        <label htmlFor="edit-desc" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                        <textarea id="edit-desc" value={selectedProduct.description} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} rows={2} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-category" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                            <select id="edit-category" value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit-price" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Price (GHS)</label>
                            <input id="edit-price" type="number" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-stock" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Stock</label>
                            <input id="edit-stock" type="number" value={selectedProduct.stock} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                        </div>
                        <div>
                            <label htmlFor="edit-status" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status</label>
                            <select id="edit-status" value={selectedProduct.status} onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}>
                                <option value="DRAFT">Draft</option>
                                <option value="PENDING">Pending</option>
                                <option value="ACTIVE">Active</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="edit-date" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Expected Arrival</label>
                        <input id="edit-date" type="date" value={selectedProduct.expectedDate || ''} onChange={(e) => setSelectedProduct({ ...selectedProduct, expectedDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`} />
                    </div>
                    <div className={`flex items-center gap-6 py-2 px-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <label htmlFor="edit-preorder" className="flex items-center gap-2 cursor-pointer">
                            <input id="edit-preorder" type="checkbox" checked={selectedProduct.preOrder} onChange={(e) => setSelectedProduct({ ...selectedProduct, preOrder: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Pre-Order</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={selectedProduct.featured} onChange={(e) => setSelectedProduct({ ...selectedProduct, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Cancel
                    </button>
                    <button onClick={onSave} className="flex-1 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
