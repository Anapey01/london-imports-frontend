import { MapPin } from 'lucide-react';
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
    return (
        <section className={`p-6 sm:p-10 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0 mb-10">
                <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 opacity-20" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Delivery Address</h2>
                </div>
                <button
                    onClick={isEditingDelivery ? handleSaveDelivery : () => {
                        setEditForm({
                            delivery_address: order.delivery_address || '',
                            delivery_city: order.delivery_city || '',
                            delivery_region: order.delivery_region || '',
                            delivery_gps: order.delivery_gps || '',
                            customer_notes: order.customer_notes || ''
                        });
                        setIsEditingDelivery(true);
                    }}
                    className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity w-fit"
                >
                    {isEditingDelivery ? 'Save Changes' : 'Edit Address'}
                </button>
            </div>

            {!isEditingDelivery ? (
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-2">Street Address</span>
                            <p className="text-2xl font-serif font-bold tracking-tight leading-tight">{order.delivery_address}</p>
                        </div>
                        <div className="flex gap-12">
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
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-500/5 border border-inherit font-mono text-[10px] tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                COORD: {order.delivery_gps}
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-500/5 p-8 border-l-2 border-pink-500">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-4">Shipping Notes</span>
                        <p className="text-sm font-medium italic opacity-60 leading-relaxed">
                            &quot;{order.customer_notes || 'No special directives logged for this shipment.'}&quot;
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <input
                        value={editForm.delivery_address}
                        onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                        className={`col-span-2 p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all`}
                        placeholder="STREET & LANDMARKS"
                    />
                    <input
                        value={editForm.delivery_city}
                        onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                        className="p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                        placeholder="CITY HUB"
                    />
                    <input
                        value={editForm.delivery_region}
                        onChange={(e) => setEditForm({ ...editForm, delivery_region: e.target.value })}
                        className="p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                        placeholder="REGION"
                    />
                </div>
            )}
        </section>
    );
}
