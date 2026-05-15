/**
 * London's Imports - Delivery Details (Checkout)
 * Hardened for WCAG 'Understandable' & 'Operable' Compliance
 */
'use client';

import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface DeliveryDetailsProps {
    orderNumberParam: string | null;
    delivery: {
        address: string;
        city: string;
        region: string;
        delivery_gps: string;
        notes: string;
    };
    setDelivery: (delivery: { address: string; city: string; region: string; delivery_gps: string; notes: string; }) => void;
    saveAddress: boolean;
    setSaveAddress: (val: boolean) => void;
    activeStep: number;
    setActiveStep: (step: number) => void;
}

const DeliveryDetails = ({ orderNumberParam, delivery, setDelivery, saveAddress, setSaveAddress, activeStep, setActiveStep }: DeliveryDetailsProps) => {
    const [localDelivery, setLocalDelivery] = React.useState(delivery);

    // Sync from parent if parent changes (e.g., loaded from session/API)
    React.useEffect(() => {
        setLocalDelivery(delivery);
    }, [delivery.address, delivery.city, delivery.region, delivery.delivery_gps, delivery.notes]);

    const handleBlur = () => {
        setDelivery(localDelivery);
    };
    const isExpanded = activeStep === 1;
    const hasAddress = delivery.address && delivery.city && delivery.region;

    return (
        <div className={`bg-surface-card rounded-2xl border transition-all duration-500 overflow-hidden ${isExpanded ? 'border-brand-emerald/30 shadow-diffusion-lg ring-1 ring-brand-emerald/10' : 'border-border-standard opacity-90'}`}>
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 sm:p-7 border-b border-border-standard/50">
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${isExpanded ? 'bg-content-primary text-surface scale-110 shadow-lg' : 'bg-surface text-content-secondary'}`}>
                        1
                    </div>
                    <div>
                        <h2 className={`font-black uppercase tracking-widest text-[11px] transition-colors ${isExpanded ? 'text-content-primary' : 'text-content-secondary'}`}>
                            Shipping Address
                        </h2>
                        {!isExpanded && hasAddress && (
                            <p className="text-[10px] font-medium text-content-secondary mt-0.5 truncate max-w-[250px]">
                                {delivery.address}, {delivery.city}
                            </p>
                        )}
                    </div>
                </div>
                
                {!isExpanded && hasAddress && !orderNumberParam && (
                    <button 
                        onClick={() => setActiveStep(1)}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-emerald hover:opacity-80 transition-all px-4 py-2 bg-brand-emerald/10 rounded-lg institutional-focus"
                    >
                        Change Address
                    </button>
                )}
            </div>

            {/* Expandable Content Body */}
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-6 sm:p-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <div>
                            <label htmlFor="ship-address" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.4em] mb-2 px-1">Full Street Address</label>
                            <input
                                id="ship-address"
                                type="text"
                                name="address"
                                autoComplete="shipping street-address"
                                value={localDelivery.address}
                                onChange={(e) => setLocalDelivery({ ...localDelivery, address: e.target.value })}
                                onBlur={handleBlur}
                                placeholder="E.G. HOUSE NUMBER / STREET NAME"
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-content-primary placeholder:text-slate-300 focus:bg-white focus:border-brand-emerald/30 focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none tracking-tight"
                            />
                        </div>

                        <div>
                            <label htmlFor="ship-city" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.4em] mb-2 px-1">City / Town</label>
                            <input
                                id="ship-city"
                                type="text"
                                name="city"
                                autoComplete="shipping address-level2"
                                value={localDelivery.city}
                                onChange={(e) => setLocalDelivery({ ...localDelivery, city: e.target.value })}
                                onBlur={handleBlur}
                                placeholder="ACCRA"
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-content-primary placeholder:text-slate-300 focus:bg-white focus:border-brand-emerald/30 focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none tracking-tight"
                            />
                        </div>

                        <div>
                            <label htmlFor="ship-region" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.4em] mb-2 px-1">Region</label>
                            <div className="relative">
                                <select
                                    id="ship-region"
                                    name="region"
                                    autoComplete="shipping address-level1"
                                    value={localDelivery.region}
                                    onChange={(e) => {
                                        const newLocal = { ...localDelivery, region: e.target.value };
                                        setLocalDelivery(newLocal);
                                        setDelivery(newLocal); // Select changes should propagate immediately
                                    }}
                                    required
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-content-primary focus:bg-white focus:border-brand-emerald/30 focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none tracking-tight appearance-none cursor-pointer"
                                >
                                    <option value="">SELECT REGION</option>
                                    <option value="Greater Accra">Greater Accra</option>
                                    <option value="Ashanti">Ashanti</option>
                                    <option value="Western">Western</option>
                                    <option value="Central">Central</option>
                                    <option value="Eastern">Eastern</option>
                                    <option value="Northern">Northern</option>
                                    <option value="Volta">Volta</option>
                                    <option value="Upper East">Upper East</option>
                                    <option value="Upper West">Upper West</option>
                                    <option value="Bono">Bono</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="ship-gps" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.4em] mb-2 px-1">Ghana Post GPS (Optional)</label>
                            <input
                                id="ship-gps"
                                type="text"
                                name="delivery_gps"
                                value={localDelivery.delivery_gps || ''}
                                onChange={(e) => setLocalDelivery({ ...localDelivery, delivery_gps: e.target.value })}
                                onBlur={handleBlur}
                                placeholder="GA-183-9023"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-content-primary placeholder:text-slate-300 focus:bg-white focus:border-brand-emerald/30 focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none tracking-[0.2em] font-mono uppercase"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="ship-notes" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.4em] mb-2 px-1">Delivery Notes</label>
                            <div className="flex flex-col gap-4">
                                <textarea
                                    id="ship-notes"
                                    name="notes"
                                    value={localDelivery.notes}
                                    onChange={(e) => setLocalDelivery({ ...localDelivery, notes: e.target.value })}
                                    onBlur={handleBlur}
                                    rows={3}
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-content-primary placeholder:text-slate-300 focus:bg-white focus:border-brand-emerald/30 focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none tracking-tight resize-none italic"
                                    placeholder="Leave with security / Call on arrival..."
                                />
                                {hasAddress && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setDelivery(localDelivery);
                                            setActiveStep(2);
                                        }}
                                        className="px-8 py-3 bg-content-primary text-surface text-[10px] uppercase tracking-[0.2em] font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all h-fit shadow-lg institutional-focus"
                                    >
                                        Use address
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {!orderNumberParam && (
                        <div className="pt-4 border-t border-border-standard">
                            <label htmlFor="save-address" className="flex items-center gap-3 cursor-pointer group/save w-fit">
                                <div className="relative flex items-center">
                                    <input
                                        id="save-address"
                                        type="checkbox"
                                        checked={saveAddress}
                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center institutional-focus ${saveAddress ? 'bg-content-primary border-content-primary' : 'bg-transparent border-border-standard'}`}>
                                        {saveAddress && <CheckCircle2 className="w-2.5 h-2.5 text-surface" />}
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-content-secondary uppercase tracking-widest transition-opacity">Save as default address</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetails;
