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
        // eslint-disable-next-line
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
            <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-end justify-between">
                    <h2 className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Payment Methods
                    </h2>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className={`text-xs font-light border-b pb-0.5 transition-colors ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                            + Add MoMo
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleAddMomo} className={`p-6 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Add Mobile Money</h3>
                    <input
                        type="tel"
                        placeholder="Mobile Money Number (e.g., 024 XXX XXXX)"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500' : 'bg-white border-gray-200 text-gray-900 focus:border-pink-500'}`}
                        required
                    />
                    <div className="flex gap-3 mt-4">
                        <button type="submit" className="px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">Save</button>
                        <button type="button" onClick={() => setShowForm(false)} className={`px-5 py-2.5 text-sm font-medium rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Cancel</button>
                    </div>
                </form>
            )}

            {paymentMethods.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No payment methods saved</p>
                    <button onClick={() => setShowForm(true)} className={`mt-4 text-xs border-b pb-0.5 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`}>
                        Add Mobile Money
                    </button>
                </div>
            ) : (
                <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                    {paymentMethods.map(method => (
                        <div key={method.id} className="py-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                                    <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Mobile Money</p>
                                        {method.isDefault && (
                                            <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>Default</span>
                                        )}
                                    </div>
                                    <p className={`text-sm font-light ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{maskNumber(method.number)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!method.isDefault && (
                                    <button onClick={() => setDefault(method.id)} className={`text-xs font-light ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Set default</button>
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
