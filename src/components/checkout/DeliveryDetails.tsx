'use client';

import { MapPin, Edit2, CheckCircle2, Navigation } from 'lucide-react';
import { useState } from 'react';

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
}

const DeliveryDetails = ({ orderNumberParam, delivery, setDelivery, saveAddress, setSaveAddress }: DeliveryDetailsProps) => {
    const [isEditing, setIsEditing] = useState(!delivery.address);

    const hasAddress = delivery.address && delivery.city && delivery.region;

    return (
        <div className="bg-primary-surface/40 p-6 sm:p-7 rounded-2xl shadow-diffusion-xl border border-primary-surface/40 backdrop-blur-3xl transition-all duration-300 relative overflow-hidden group/details">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-surface/20">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center opacity-10">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-[10px] font-black nuclear-text uppercase tracking-[0.4em] opacity-40">Delivery Details</h2>
                </div>
                {!orderNumberParam && hasAddress && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-[9px] font-black uppercase tracking-widest nuclear-text opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 group/edit"
                    >
                        <Edit2 className="w-3 h-3 group-hover/edit:scale-110 transition-transform" />
                        Modify
                    </button>
                )}
                {orderNumberParam && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Manifest Locked</span>
                    </div>
                )}
            </div>

            {orderNumberParam ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                        <label className="block text-[8px] uppercase tracking-[0.4em] nuclear-text opacity-20 font-black mb-1.5">Destination Sourcing Node</label>
                        <p className="text-sm font-black nuclear-text leading-relaxed">{delivery.address}</p>
                    </div>
                    <div>
                        <label className="block text-[8px] uppercase tracking-[0.4em] nuclear-text opacity-20 font-black mb-1.5">Logistics Hub</label>
                        <p className="text-sm font-black nuclear-text leading-relaxed tracking-tight">{delivery.city}, {delivery.region}</p>
                        {delivery.delivery_gps && (
                            <p className="text-[9px] nuclear-text opacity-40 mt-2 font-mono uppercase bg-primary-surface/10 px-2 py-0.5 rounded inline-block">GPS: {delivery.delivery_gps}</p>
                        )}
                    </div>
                    {delivery.notes && (
                        <div className="sm:col-span-2">
                            <label className="block text-[8px] uppercase tracking-[0.4em] nuclear-text opacity-20 font-black mb-1.5">Sourcing Brief</label>
                            <p className="text-xs font-black nuclear-text opacity-60 italic tracking-wider leading-relaxed">&quot;{delivery.notes}&quot;</p>
                        </div>
                    )}
                </div>
            ) : hasAddress && !isEditing ? (
                <div className="bg-primary-surface/10 rounded-xl p-5 border border-primary-surface/20 relative overflow-hidden group/card hover:bg-primary-surface/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-10 transition-all rotate-12 -mr-2 -mt-2">
                        <Navigation className="w-12 h-12 nuclear-text" />
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-8">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black nuclear-text leading-relaxed tracking-tight">
                                    {delivery.address}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                    <p className="text-[10px] font-black nuclear-text opacity-40 uppercase tracking-widest">
                                        {delivery.city} • {delivery.region}
                                    </p>
                                    {delivery.delivery_gps && (
                                        <p className="text-[9px] font-mono nuclear-text opacity-40 bg-primary-surface/40 px-1.5 py-0.5 rounded border border-primary-surface/40">
                                            {delivery.delivery_gps}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {delivery.notes && (
                            <div className="pt-3 border-t border-primary-surface/10">
                                <p className="text-[9px] font-black nuclear-text opacity-40 italic tracking-widest">
                                    BRIEF: &quot;{delivery.notes}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <div>
                            <label className="block text-[8px] font-black nuclear-text uppercase tracking-[0.3em] mb-2 opacity-30">Destination Node</label>
                            <input
                                type="text"
                                value={delivery.address}
                                onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                                placeholder="ENTER SHIPPING ADDRESS"
                                required
                                className="w-full bg-transparent border-0 border-b border-slate-900/10 dark:border-white/10 py-2 focus:border-slate-900 dark:focus:border-white outline-none transition-all nuclear-text font-black text-sm placeholder:opacity-10 tracking-wider"
                            />
                        </div>

                        <div>
                            <label className="block text-[8px] font-black nuclear-text uppercase tracking-[0.3em] mb-2 opacity-30">Logistics Hub (City)</label>
                            <input
                                type="text"
                                value={delivery.city}
                                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                placeholder="CITY / TOWN"
                                required
                                className="w-full bg-transparent border-0 border-b border-slate-900/10 dark:border-white/10 py-2 focus:border-slate-900 dark:focus:border-white outline-none transition-all nuclear-text font-black text-sm placeholder:opacity-10 tracking-wider"
                            />
                        </div>

                        <div>
                            <label className="block text-[8px] font-black nuclear-text uppercase tracking-[0.3em] mb-2 opacity-30">Administrative Region</label>
                            <select
                                value={delivery.region}
                                onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                required
                                title="Select Delivery Region"
                                className="w-full bg-transparent border-0 border-b border-slate-900/10 dark:border-white/10 py-2 focus:border-slate-900 dark:focus:border-white outline-none transition-all nuclear-text font-black text-sm tracking-wider appearance-none cursor-pointer"
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
                            <label className="block text-[8px] font-black nuclear-text uppercase tracking-[0.3em] mb-2 opacity-30">Precise GPS (Optional)</label>
                            <input
                                type="text"
                                value={delivery.delivery_gps || ''}
                                onChange={(e) => setDelivery({ ...delivery, delivery_gps: e.target.value })}
                                placeholder="GA-183-9023"
                                className="w-full bg-transparent border-0 border-b border-slate-900/10 dark:border-white/10 py-2 focus:border-slate-900 dark:focus:border-white outline-none transition-all nuclear-text font-black text-sm placeholder:opacity-10 tracking-wider font-mono uppercase"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[8px] font-black nuclear-text uppercase tracking-[0.3em] mb-2 opacity-30">Sourcing Brief / Notes</label>
                            <div className="flex items-center gap-6">
                                <textarea
                                    value={delivery.notes}
                                    onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                                    rows={1}
                                    className="w-full bg-transparent border-0 border-b border-slate-900/10 dark:border-white/10 py-2 focus:border-slate-900 dark:focus:border-white outline-none transition-all nuclear-text font-black text-sm placeholder:opacity-10 tracking-wider resize-none italic"
                                    placeholder="SPECIAL HANDLING INSTRUCTIONS..."
                                />
                                {hasAddress && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] uppercase tracking-[0.3em] font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all h-fit shadow-diffusion-lg"
                                    >
                                        Execute
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {!orderNumberParam && (
                        <div className="pt-4 border-t border-primary-surface/10">
                            <label className="flex items-center gap-3 cursor-pointer group/save w-fit">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={saveAddress}
                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${saveAddress ? 'bg-slate-950 border-slate-950 dark:bg-white dark:border-white' : 'bg-transparent border-slate-900/20'}`}>
                                        {saveAddress && <CheckCircle2 className="w-2.5 h-2.5 text-white dark:text-slate-950" />}
                                    </div>
                                </div>
                                <span className="text-[9px] font-black nuclear-text opacity-40 group-hover/save:opacity-100 uppercase tracking-widest transition-opacity">Save to Manifest Profile</span>
                            </label>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DeliveryDetails;
