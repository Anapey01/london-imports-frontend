'use client';

import { MapPin } from 'lucide-react';

interface DeliveryDetailsProps {
    orderNumberParam: string | null;
    delivery: {
        address: string;
        city: string;
        region: string;
        notes: string;
    };
    setDelivery: (delivery: any) => void;
}

const DeliveryDetails = ({ orderNumberParam, delivery, setDelivery }: DeliveryDetailsProps) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h2 className="text-xl font-light text-gray-900 tracking-tight">Delivery Details</h2>
                </div>
                {orderNumberParam && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Locked</span>
                )}
            </div>

            {orderNumberParam ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Shipping Address</label>
                        <p className="text-sm font-light text-gray-900">{delivery.address}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Destination</label>
                        <p className="text-sm font-light text-gray-900">{delivery.city}, {delivery.region}</p>
                    </div>
                    {delivery.notes && (
                        <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Delivery Notes</label>
                            <p className="text-sm font-light text-gray-600 italic">&quot;{delivery.notes}&quot;</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Address</label>
                        <textarea
                            value={delivery.address}
                            onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                            required
                            rows={2}
                            className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none transition-all font-light resize-none placeholder-gray-400 px-0"
                            placeholder="Enter your full street address"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">City</label>
                            <input
                                type="text"
                                value={delivery.city}
                                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                required
                                className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:ring-0 transition-all font-light placeholder-gray-400 px-0"
                                placeholder="Accra"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Region</label>
                            <div className="relative">
                                <select
                                    value={delivery.region}
                                    onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                    required
                                    title="Select Region"
                                    className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:ring-0 transition-all font-light appearance-none px-0 cursor-pointer"
                                >
                                    <option value="">Select Region</option>
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
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Notes (Optional)</label>
                        <textarea
                            value={delivery.notes}
                            onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                            rows={2}
                            className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:ring-0 transition-all font-light resize-none placeholder-gray-400 px-0"
                            placeholder="Special delivery instructions..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDetails;
