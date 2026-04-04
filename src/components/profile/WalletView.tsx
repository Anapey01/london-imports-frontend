'use client';

import { useState, useEffect } from 'react';

// Wallet View
const WalletView = ({ theme }: { theme: string }) => {
    const isDark = theme === 'dark';
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

    return (
        <div className="space-y-8">
            <div className="border-b pb-4 border-primary-surface">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-light tracking-tight nuclear-text">
                        Payment Methods
                    </h2>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="text-xs font-light border-b pb-0.5 border-emerald-500 text-emerald-500 transition-colors">
                            + Add MoMo
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleAddMomo} className="p-6 rounded-xl border border-primary-surface bg-primary-surface/40">
                    <h3 className="text-sm font-medium uppercase tracking-wide mb-4 nuclear-text opacity-50">Add Mobile Money</h3>
                    <input
                        type="tel"
                        placeholder="Mobile Money Number (e.g., 024 XXX XXXX)"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm bg-primary-surface border-primary-surface nuclear-text focus:border-emerald-500"
                        required
                    />
                    <div className="flex gap-3 mt-4">
                        <button type="submit" className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors shadow-lg">Save</button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg nuclear-text opacity-50 hover:opacity-100">Cancel</button>
                    </div>
                </form>
            )}

            {paymentMethods.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <svg className="w-12 h-12 mx-auto mb-4 nuclear-text opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <p className="text-sm font-light nuclear-text opacity-50">No payment methods saved</p>
                    <button onClick={() => setShowForm(true)} className="mt-4 text-xs border-b pb-0.5 border-emerald-500 text-emerald-500">
                        Add Mobile Money
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-primary-surface">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="py-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/10">
                                    <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-light nuclear-text">Mobile Money</p>
                                        {method.isDefault && (
                                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-light nuclear-text opacity-40">{maskNumber(method.number)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!method.isDefault && (
                                    <button onClick={() => setDefault(method.id)} className="text-xs font-light nuclear-text opacity-40 hover:opacity-100 transition-opacity">Set default</button>
                                )}
                                <button onClick={() => handleDelete(method.id)} className="text-xs font-light text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WalletView;
