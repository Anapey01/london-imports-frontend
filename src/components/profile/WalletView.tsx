'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

// Wallet View
const WalletView = () => {
    const [paymentMethods, setPaymentMethods] = useState<{ id: string; type: string; number: string; isDefault: boolean }[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('user-payment-methods');
        if (saved) setPaymentMethods(JSON.parse(saved));
    }, []);

    const savePaymentMethods = (methods: { id: string; type: string; number: string; isDefault: boolean }[]) => {
        setPaymentMethods(methods);
        localStorage.setItem('user-payment-methods', JSON.stringify(methods));
    };

    const handleAddMomo = (e: React.FormEvent) => {
        e.preventDefault();
        const newMethod = { id: Date.now().toString(), type: 'momo', number: phoneNumber, isDefault: paymentMethods.length === 0 };
        savePaymentMethods([...paymentMethods, newMethod]);
        setPhoneNumber('');
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        savePaymentMethods(paymentMethods.filter(m => m.id !== id));
    };

    const setDefault = (id: string) => {
        savePaymentMethods(paymentMethods.map(m => ({ ...m, isDefault: m.id === id })));
    };

    const maskNumber = (num: string) => num.slice(0, 3) + ' *** ' + num.slice(-3);

    const inputClass = "w-full px-4 py-3 rounded-lg border outline-none transition-all text-[11px] font-black uppercase tracking-widest bg-surface-card border-border-standard text-content-primary focus:border-brand-emerald placeholder:text-content-secondary";

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Wallet Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Payment Methods</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        Payment Methods
                    </h2>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-brand-emerald transition-all active:scale-95 shadow-xl"
                    >
                        Add Method
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleAddMomo} className="p-10 rounded-2xl border border-slate-900 bg-slate-900 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                            <Plus size={16} className="text-brand-emerald" />
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Add Mobile Money</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Momo Number</label>
                            <input
                                type="tel"
                                placeholder="024 XXX XXXX"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-brand-emerald focus:bg-white/10 transition-all placeholder:text-white/20"
                                required
                            />
                        </div>
                        <div className="flex gap-4 mt-10">
                            <button type="submit" className="flex-1 py-5 bg-brand-emerald text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-emerald-400 transition-all shadow-xl">
                                Save Method
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-8 text-[11px] font-black uppercase tracking-[0.4em] rounded-xl text-white/40 hover:text-white transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03]" />
                </form>
            )}

            {paymentMethods.length === 0 && !showForm ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No payment methods</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="p-6 rounded-2xl border border-slate-100 bg-white group hover:border-slate-300 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">Mobile Money</p>
                                        {method.isDefault && (
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Primary</span>
                                        )}
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 tabular-nums">{maskNumber(method.number)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:border-l border-slate-100 sm:pl-8">
                                {!method.isDefault && (
                                    <button 
                                        onClick={() => setDefault(method.id)} 
                                        className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(method.id)} 
                                    className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-400 hover:text-rose-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WalletView;
