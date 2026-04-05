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
                            <label htmlFor="ship-address" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.3em] mb-2">Full Street Address</label>
                            <input
                                id="ship-address"
                                type="text"
                                name="address"
                                autoComplete="shipping street-address"
                                value={delivery.address}
                                onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                                placeholder="E.G. HOUSE NUMBER / STREET NAME"
                                required
                                className="w-full bg-transparent border-0 border-b border-border-standard py-2 focus:border-content-primary outline-none transition-all text-content-primary font-black text-sm placeholder:opacity-40 tracking-wider institutional-focus"
                            />
                        </div>

                        <div>
                            <label htmlFor="ship-city" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.3em] mb-2">City / Town</label>
                            <input
                                id="ship-city"
                                type="text"
                                name="city"
                                autoComplete="shipping address-level2"
                                value={delivery.city}
                                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                placeholder="ACCRA"
                                required
                                className="w-full bg-transparent border-0 border-b border-border-standard py-2 focus:border-content-primary outline-none transition-all text-content-primary font-black text-sm placeholder:opacity-40 tracking-wider institutional-focus"
                            />
                        </div>

                        <div>
                            <label htmlFor="ship-region" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.3em] mb-2">Region</label>
                            <select
                                id="ship-region"
                                name="region"
                                autoComplete="shipping address-level1"
                                value={delivery.region}
                                onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                required
                                title="Select Delivery Region"
                                className="w-full bg-transparent border-0 border-b border-border-standard py-2 focus:border-content-primary outline-none transition-all nuclear-text font-black text-sm tracking-wider appearance-none cursor-pointer institutional-focus"
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
                        </div>

                        <div>
                            <label htmlFor="ship-gps" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.3em] mb-2">GHANA POST GPS (OPTIONAL)</label>
                            <input
                                id="ship-gps"
                                type="text"
                                name="delivery_gps"
                                value={delivery.delivery_gps || ''}
                                onChange={(e) => setDelivery({ ...delivery, delivery_gps: e.target.value })}
                                placeholder="GA-183-9023"
                                className="w-full bg-transparent border-0 border-b border-border-standard py-2 focus:border-content-primary outline-none transition-all text-content-primary font-black text-sm placeholder:opacity-40 tracking-wider font-mono uppercase institutional-focus"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="ship-notes" className="block text-[8px] font-black text-content-secondary uppercase tracking-[0.3em] mb-2">Delivery Notes</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <textarea
                                        id="ship-notes"
                                        name="notes"
                                        value={delivery.notes}
                                        onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                                        rows={1}
                                        className="w-full bg-transparent border-0 border-b border-border-standard py-2 focus:border-content-primary outline-none transition-all text-content-primary font-black text-sm placeholder:opacity-40 tracking-wider resize-none italic institutional-focus"
                                        placeholder="LEAVE WITH SECURITY / CALL ON ARRIVAL..."
                                    />
                                {hasAddress && (
                                    <button 
                                        type="button"
                                        onClick={() => setActiveStep(2)}
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
