'use client';

import { useState, useEffect } from 'react';
import { Address } from '@/types';

// Addresses View
const AddressesView = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: '', city: '', area: '', landmark: '', phone: '' });

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user-addresses');
        if (saved) setAddresses(JSON.parse(saved));
    }, []);

    // Save to localStorage
    const saveAddresses = (newAddresses: Address[]) => {
        setAddresses(newAddresses);
        localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            saveAddresses(addresses.map(a => a.id === editingId ? { ...formData, id: editingId, isDefault: a.isDefault } : a));
        } else {
            const newAddress: Address = { ...formData, id: Date.now().toString(), isDefault: addresses.length === 0 };
            saveAddresses([...addresses, newAddress]);
        }
        setFormData({ label: '', city: '', area: '', landmark: '', phone: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        saveAddresses(addresses.filter(a => a.id !== id));
    };

    const setDefault = (id: string) => {
        saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    };

    const inputClass = `w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark
        ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500 placeholder:text-slate-600'
        : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500 placeholder:text-gray-400'
        }`;

    return (
        <div className="space-y-8">
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Addresses
                    </h2>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}
                        >
                            + Add address
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={`p-6 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {editingId ? 'Edit Address' : 'New Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Label (e.g., Home, Office)" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="Area / Neighborhood" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className={inputClass} required />
                        <input type="text" placeholder="Landmark" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className={inputClass} />
                        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} required />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="submit" className="px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">
                            {editingId ? 'Update' : 'Save Address'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ label: '', city: '', area: '', landmark: '', phone: '' }); }} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No saved addresses</p>
                    <button onClick={() => setShowForm(true)} className={`mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Add your first address
                    </button>
                </div>
            ) : (
                <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                    {addresses.map(address => (
                        <div key={address.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{address.label}</p>
                                    {address.isDefault && (
                                        <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>Default</span>
                                    )}
                                </div>
                                <p className={`text-sm font-light mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    {address.area}, {address.city}
                                    {address.landmark && ` · Near ${address.landmark}`}
                                </p>
                                <p className={`text-xs font-light mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{address.phone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {!address.isDefault && (
                                    <button onClick={() => setDefault(address.id)} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Set default</button>
                                )}
                                <button onClick={() => { setFormData({ label: address.label, city: address.city, area: address.area, landmark: address.landmark, phone: address.phone }); setEditingId(address.id); setShowForm(true); }} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Edit</button>
                                <button onClick={() => handleDelete(address.id)} className="text-xs font-light text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressesView;
