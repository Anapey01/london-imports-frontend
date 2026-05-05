'use client';

import { useState, useEffect } from 'react';
import { Address, User } from '@/types';
import { MapPin, CheckCircle2, Navigation, Trash2, Edit2, Plus } from 'lucide-react';

interface AddressesViewProps {
    user: User | null; // User type from authStore
}

const AddressesView = ({ user }: AddressesViewProps) => {
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

    const inputClass = "w-full px-4 py-3 rounded-lg border outline-none transition-all text-[11px] font-black uppercase tracking-widest bg-surface-card border-border-standard text-content-primary focus:border-brand-emerald placeholder:text-content-secondary";

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Architectural Header Archive */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Saved Addresses</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        My Addresses
                    </h2>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-brand-emerald transition-all active:scale-95 shadow-xl"
                    >
                        <Plus className="w-3 h-3" />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Primary Shipping Terminal */}
            {(user?.address || user?.city || user?.region) && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                            <MapPin size={14} className="text-slate-300" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                                 Primary Address
                            </h3>
                        </div>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('switch-profile-tab', { detail: 'settings' }))}
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            Change
                        </button>
                    </div>
                    <div className="p-8 rounded-2xl border border-slate-100 bg-white group hover:border-slate-300 transition-all duration-500 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-emerald-100 animate-pulse">
                                        Default Address
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-2">
                                        {user.address || 'Address not set'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Navigation size={10} />
                                            {user.city || 'UNDEFINED'}, {user.region || 'UNDEFINED'}
                                        </div>
                                        {user.ghana_post_gps && (
                                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200 uppercase tracking-widest tabular-nums">
                                                ID: {user.ghana_post_gps}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-8 hidden md:flex">
                                <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000">
                                    <CheckCircle2 className="w-6 h-6 text-brand-emerald" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="p-10 rounded-2xl border border-slate-900 bg-slate-900 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                            <Plus size={14} className="text-brand-emerald" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                {editingId ? 'Edit Address' : 'Add Address'}
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { label: 'Address Label', placeholder: 'e.g. Home', value: formData.label, key: 'label' },
                                { label: 'City', placeholder: 'e.g. Accra', value: formData.city, key: 'city' },
                                { label: 'Region', placeholder: 'e.g. Greater Accra', value: formData.area, key: 'area' },
                                { label: 'Landmark', placeholder: 'e.g. Near Hub', value: formData.landmark, key: 'landmark' },
                            ].map(field => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">{field.label}</label>
                                    <input 
                                        type="text" 
                                        placeholder={field.placeholder} 
                                        value={field.value} 
                                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-emerald focus:bg-white/10 transition-all placeholder:text-white/20" 
                                        required={field.key !== 'landmark'} 
                                    />
                                </div>
                            ))}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Phone</label>
                                <input 
                                    type="tel" 
                                    placeholder="+233..." 
                                    value={formData.phone} 
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-emerald focus:bg-white/10 transition-all placeholder:text-white/20" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mt-10">
                            <button type="submit" className="flex-1 py-5 bg-brand-emerald text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-emerald-400 transition-all active:scale-[0.98]">
                                {editingId ? 'Save' : 'Add Address'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ label: '', city: '', area: '', landmark: '', phone: '' }); }} className="px-8 text-[9px] font-black uppercase tracking-[0.4em] rounded-xl transition-all text-white/40 hover:text-white">
                                Cancel
                            </button>
                        </div>
                    </div>
                    {/* Decorative Terminal Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03]" />
                </form>
            )}

            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <Navigation size={14} className="text-slate-300" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                        Saved Addresses
                    </h3>
                </div>
                
                {addresses.length === 0 && !showForm ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                        <Plus size={32} className="mx-auto mb-4 text-slate-100" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No saved addresses</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map(address => (
                            <div key={address.id} className="p-6 rounded-2xl border border-slate-100 bg-white group hover:border-slate-300 transition-all duration-500 shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-brand-emerald transition-colors">
                                            <MapPin size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Label</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{address.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => { setFormData({ label: address.label, city: address.city, area: address.area, landmark: address.landmark, phone: address.phone }); setEditingId(address.id); setShowForm(true); }} 
                                            className="p-2 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(address.id)} 
                                            className="p-2 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">
                                        {address.area}, {address.city}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                                            Phone: {address.phone}
                                        </p>
                                        {address.landmark && (
                                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest truncate max-w-[100px]">
                                                {address.landmark}
                                            </p>
                                        )}
                                    </div>
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
