/**
 * Delivery & Returns Page
 * Mimicking Jumia's delivery timeline and zone information
 */
import React from 'react';
import { ShoppingCart, Check, Truck, Package, MapPin, Clock, Info } from 'lucide-react';

export default function DeliveryReturnsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Dark 3D Timeline Banner */}
                <div className="bg-[#1f1f1f] rounded-2xl p-8 pt-10 text-center shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-16 tracking-wider font-sans uppercase">
                        Delivery Timelines
                    </h1>

                    <div className="relative max-w-3xl mx-auto mb-8">
                        {/* Connecting Line */}
                        <div className="absolute top-[28px] left-4 right-4 h-[3px] bg-gray-700 -z-0 rounded-full"></div>

                        <div className="grid grid-cols-4 gap-4 relative z-10">

                            {/* Step 1: ORDER */}
                            <div className="flex flex-col items-center group">
                                <span className="text-[11px] md:text-xs font-black text-[#ff3385] mb-2 uppercase tracking-widest">Order</span>
                                {/* Dot */}
                                <div className="w-5 h-5 rounded-full bg-[#ff3385] border-4 border-[#1f1f1f] shadow-sm mb-4"></div>
                                {/* Icon Box */}
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#ff3385] to-[#cc0052] rounded-2xl shadow-[0_8px_0_#99003d] flex items-center justify-center transform group-hover:translate-y-1 group-hover:shadow-[0_4px_0_#99003d] transition-all duration-200 border-t border-white/20">
                                    <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
                                </div>
                            </div>

                            {/* Step 2: CONFIRM */}
                            <div className="flex flex-col items-center group">
                                <span className="text-[11px] md:text-xs font-black text-[#ff9933] mb-2 uppercase tracking-widest">Confirm</span>
                                {/* Dot */}
                                <div className="w-5 h-5 rounded-full bg-[#ff9933] border-4 border-[#1f1f1f] shadow-sm mb-4"></div>
                                {/* Icon Box */}
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#ff9933] to-[#cc6600] rounded-2xl shadow-[0_8px_0_#994d00] flex items-center justify-center transform group-hover:translate-y-1 group-hover:shadow-[0_4px_0_#994d00] transition-all duration-200 border-t border-white/20">
                                    <Check className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
                                </div>
                            </div>

                            {/* Step 3: SHIP */}
                            <div className="flex flex-col items-center group">
                                <span className="text-[11px] md:text-xs font-black text-[#ffcc00] mb-2 uppercase tracking-widest">Ship</span>
                                {/* Dot */}
                                <div className="w-5 h-5 rounded-full bg-[#ffcc00] border-4 border-[#1f1f1f] shadow-sm mb-4"></div>
                                {/* Icon Box */}
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#ffcc00] to-[#b38f00] rounded-2xl shadow-[0_8px_0_#806600] flex items-center justify-center transform group-hover:translate-y-1 group-hover:shadow-[0_4px_0_#806600] transition-all duration-200 border-t border-white/20">
                                    <Truck className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
                                </div>
                            </div>

                            {/* Step 4: DELIVER */}
                            <div className="flex flex-col items-center group">
                                <span className="text-[11px] md:text-xs font-black text-[#33cc33] mb-2 uppercase tracking-widest">Deliver</span>
                                {/* Dot */}
                                <div className="w-5 h-5 rounded-full bg-[#33cc33] border-4 border-[#1f1f1f] shadow-sm mb-4"></div>
                                {/* Icon Box */}
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#33cc33] to-[#248f24] rounded-2xl shadow-[0_8px_0_#196619] flex items-center justify-center transform group-hover:translate-y-1 group-hover:shadow-[0_4px_0_#196619] transition-all duration-200 border-t border-white/20">
                                    <Package className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Zones */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700">
                    {/* Zone 1 */}
                    <div className="bg-gray-800 text-white p-4 font-bold flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-gray-400" />
                        <span className="text-lg">Zone 1 (Greater Accra)</span>
                    </div>
                    <div className="p-6 grid gap-6">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">1 - 2</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">2 - 4</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-3 bg-gray-50 dark:bg-slate-900 border-y border-gray-100 dark:border-slate-700"></div>

                    {/* Zone 2 */}
                    <div className="bg-gray-800 text-white p-4 font-bold flex items-center gap-3">
                        <Truck className="w-6 h-6 text-gray-400" />
                        <span className="text-lg">Zone 2 (Regional Capitals)</span>
                    </div>
                    <div className="p-6 grid gap-6">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">3 - 4</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">5 - 7</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-3 bg-gray-50 dark:bg-slate-900 border-y border-gray-100 dark:border-slate-700"></div>

                    {/* Zone 3 */}
                    <div className="bg-gray-800 text-white p-4 font-bold flex items-center gap-3">
                        <Clock className="w-6 h-6 text-gray-400" />
                        <span className="text-lg">Zone 3 (Remote Areas)</span>
                    </div>
                    <div className="p-6 grid gap-6">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">5 - 6</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">6 - 8</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Business Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Examples Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Affected Locations
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-slate-700">
                        <table className="w-full text-sm text-left text-gray-600 dark:text-slate-300">
                            <thead className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Zone 2 Examples</th>
                                    <th className="px-6 py-4">Zone 3 Examples</th>
                                    <th className="px-6 py-4">Zone 4 Examples</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">Amasaman</td>
                                    <td className="px-6 py-4">Ahafo</td>
                                    <td className="px-6 py-4">Bono East</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">Dawhenya</td>
                                    <td className="px-6 py-4">Ashanti</td>
                                    <td className="px-6 py-4">North East</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">Dodowa</td>
                                    <td className="px-6 py-4">Bono</td>
                                    <td className="px-6 py-4">Northern</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">Kasoa</td>
                                    <td className="px-6 py-4">Central</td>
                                    <td className="px-6 py-4">Savannah</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 dark:text-slate-500 italic">
                        * Timelines quoted are business days (Monday to Friday), excluding weekends and holidays.
                    </p>
                </div>

                {/* Delivery Methods Info */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide border-b border-gray-100 dark:border-slate-700 pb-4">
                        Delivery Methods
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-3 text-lg">
                                <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-500 flex items-center justify-center font-bold">1</div>
                                Door Delivery
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed ml-11">
                                Delivery time starts from the day you place your order to the day one of our delivery associates makes a first attempt to deliver to you.
                                <strong className="text-gray-900 dark:text-white block mt-1">Delivery will be attempted 3 times over 3 business days (7.00 am to 5.30pm) after which the item will be cancelled.</strong>
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-3 text-lg">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center font-bold">2</div>
                                Pickup Stations
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed ml-11">
                                Delivery time starts from the day you place your order to when you receive the first SMS to pick up your order from our pickup station.
                                <strong className="text-gray-900 dark:text-white block mt-1">Ensure you pickup your item within 5 days, otherwise it will be cancelled.</strong>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
