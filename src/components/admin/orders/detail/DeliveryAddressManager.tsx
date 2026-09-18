'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface DeliveryAddressManagerProps {
    order: OrderDetail;
    isDark: boolean;
    isEditingDelivery: boolean;
    editForm: {
        delivery_address: string;
        delivery_city: string;
        delivery_region: string;
        delivery_gps: string;
        customer_notes: string;
    };
    setEditForm: (form: any) => void;
    setIsEditingDelivery: (editing: boolean) => void;
    handleSaveDelivery: () => void;
}

export function DeliveryAddressManager({
    order,
    isDark,
    isEditingDelivery,
    editForm,
    setEditForm,
    setIsEditingDelivery,
    handleSaveDelivery
}: DeliveryAddressManagerProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsExpanded(true);
        }
    }, []);

    return (
        <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            {/* Clickable Accordion Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 sm:p-6 md:p-8 border-b border-inherit flex items-center justify-between text-left cursor-pointer select-none group/header hover:bg-slate-500/5 transition-colors"
            >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <MapPin className="w-5 h-5 opacity-40 shrink-0" />
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Delivery Address</h2>
                        {!isExpanded && !isEditingDelivery && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[200px] sm:max-w-none">
                                • {order.delivery_city || 'City'}, {order.delivery_region || 'Region'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isEditingDelivery) {
                                handleSaveDelivery();
                            } else {
                                setEditForm({
                                    delivery_address: order.delivery_address || '',
                                    delivery_city: order.delivery_city || '',
                                    delivery_region: order.delivery_region || '',
                                    delivery_gps: order.delivery_gps || '',
                                    customer_notes: order.customer_notes || ''
                                });
                                setIsEditingDelivery(true);
                                setIsExpanded(true);
                            }
                        }}
                        className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity py-1 cursor-pointer"
                    >
                        {isEditingDelivery ? 'Save Changes' : 'Edit Address'}
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 lg:hidden ml-1">
                        {isExpanded || isEditingDelivery ? 'Compress' : 'Expand'}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded || isEditingDelivery ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {(isExpanded || isEditingDelivery) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 sm:p-6 md:p-10">

            {!isEditingDelivery ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-2">Street Address</span>
                            <p className="text-xl sm:text-2xl font-serif font-bold tracking-tight leading-tight">{order.delivery_address}</p>
                        </div>
                        <div className="flex flex-wrap gap-6 sm:gap-12">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-1">City</span>
                                <p className="text-sm font-bold uppercase tracking-widest">{order.delivery_city}</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-1">Region</span>
                                <p className="text-sm font-bold uppercase tracking-widest">{order.delivery_region}</p>
                            </div>
                        </div>
                        {order.delivery_gps && (
                            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-slate-500/5 border border-inherit font-mono text-[9px] sm:text-[10px] tracking-widest break-all">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                COORD: {order.delivery_gps}
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-500/5 p-4 sm:p-6 md:p-8 border-l-2 border-pink-500">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-3 sm:mb-4">Shipping Notes</span>
                        <p className="text-xs sm:text-sm font-medium italic opacity-60 leading-relaxed">
                            &quot;{order.customer_notes || 'No special delivery notes for this shipment.'}&quot;
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <input
                        value={editForm.delivery_address}
                        onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                        className={`col-span-1 sm:col-span-2 p-3.5 sm:p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-xs sm:text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all`}
                        placeholder="STREET & LANDMARKS"
                    />
                    <input
                        value={editForm.delivery_city}
                        onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                        className="p-3.5 sm:p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-xs sm:text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                        placeholder="CITY HUB"
                    />
                    <input
                        value={editForm.delivery_region}
                        onChange={(e) => setEditForm({ ...editForm, delivery_region: e.target.value })}
                        className="p-3.5 sm:p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-xs sm:text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                        placeholder="REGION"
                    />
                </div>
            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
