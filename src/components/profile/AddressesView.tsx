'use client';

import { useState, useEffect } from 'react';
import { Address, User } from '@/types';
import { MapPin, CheckCircle2, Navigation, Trash2, Edit2, Plus } from 'lucide-react';

interface AddressesViewProps {
    theme: string;
    user: User | null; // User type from authStore
}

const AddressesView = ({ theme, user }: AddressesViewProps) => {
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

    // Unused: const setDefault = (id: string) => {
    //    saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    // };

    const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-primary-surface border-primary-surface nuclear-text focus:border-emerald-500 placeholder:opacity-30`;

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="border-b pb-6 border-primary-surface">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight nuclear-text">
                            Your Addresses
                        </h2>
                        <p className="text-sm mt-1 nuclear-text opacity-50">
                            Manage your delivery locations and primary shipping info
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            <Plus className="w-3 h-3" />
                            Add Address
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Address (The one synced from checkout) */}
            {(user?.address || user?.city || user?.region) && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest nuclear-text opacity-40">
                            Primary Account Address
                        </h3>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('switch-profile-tab', { detail: 'settings' }))}
                            className="text-[10px] font-bold uppercase tracking-widest nuclear-text opacity-50 hover:opacity-100 transition-opacity"
                        >
                            Edit in Settings
                        </button>
                    </div>
                    <div className="p-6 rounded-3xl border border-primary-surface bg-primary-surface/40 hover:border-emerald-500/50 transition-all">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-emerald-500/10 rounded-xl">
                                <MapPin className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold nuclear-text">Official Shipping Info</h4>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase truncate">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Synced from Checkout
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                    {user.address || 'No street address provided'}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                    {(user.city || user.region) && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                            <Navigation className="w-3.5 h-3.5" />
                                            {user.city || 'N/A'}, {user.region || 'N/A'}
                                        </div>
                                    )}
                                    {user.ghana_post_gps && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-pink-600 bg-white px-2 py-1 rounded-lg border border-pink-100 shadow-sm">
                                            GPS: {user.ghana_post_gps}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className={`p-8 rounded-3xl border shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80 shadow-slate-950/50' : 'border-gray-100 bg-white shadow-gray-100'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {editingId ? 'Edit Address' : 'New Delivery Location'}
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider ml-1 nuclear-text opacity-40">Label</label>
                            <input type="text" placeholder="e.g. Home, Office" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className={inputClass} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">City</label>
                            <input type="text" placeholder="e.g. Accra" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputClass} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Area / Neighborhood</label>
                            <input type="text" placeholder="e.g. East Legon" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className={inputClass} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Landmark</label>
                            <input type="text" placeholder="e.g. Near Shell Hospital" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className={inputClass} />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                            <input type="tel" placeholder="+233..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} required />
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-10 p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl">
                        <button type="submit" className="flex-1 py-3.5 bg-pink-600 text-white text-sm font-bold rounded-xl hover:bg-pink-700 transition-all hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98]">
                            {editingId ? 'Save Changes' : 'Add to Collection'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ label: '', city: '', area: '', landmark: '', phone: '' }); }} className={`px-6 text-sm font-bold rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                    Additional saved address
                </h3>
                
                {addresses.length === 0 && !showForm ? (
                    <div className={`p-12 text-center rounded-[2.5rem] border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-gray-200 bg-gray-50/50'}`}>
                        <Plus className={`w-12 h-12 mx-auto mb-4 opacity-20 ${isDark ? 'text-white' : 'text-black'}`} />
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No additional addresses saved</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(address => (
                            <div key={address.id} className={`p-6 rounded-3xl border group transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-800/50' : 'border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-200/50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{address.label}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { setFormData({ label: address.label, city: address.city, area: address.area, landmark: address.landmark, phone: address.phone }); setEditingId(address.id); setShowForm(true); }} 
                                            className={`p-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all ${isDark ? 'text-slate-400' : 'text-gray-400'}`}
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(address.id)} 
                                            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all text-gray-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                                        {address.area}, {address.city}
                                    </p>
                                    {address.landmark && (
                                        <p className="text-[10px] text-gray-400 italic">Near {address.landmark}</p>
                                    )}
                                    <p className={`text-[10px] font-bold mt-2 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>{address.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressesView;
