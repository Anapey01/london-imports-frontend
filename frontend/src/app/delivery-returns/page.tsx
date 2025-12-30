/**
 * Delivery & Returns Page
 * Mimicking Jumia's delivery timeline and zone information
 */
import React from 'react';

export default function DeliveryReturnsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Jumia-style Banner Replica */}
                <div className="bg-[#262626] rounded-xl p-8 text-center text-white shadow-lg overflow-hidden relative">
                    <h1 className="text-3xl font-extrabold mb-8 tracking-wide font-sans">Delivery Timelines</h1>

                    <div className="relative max-w-2xl mx-auto mt-12 mb-4">
                        {/* Connecting Line */}
                        <div className="absolute top-[13px] left-0 w-full h-[2px] bg-gray-600 -z-0"></div>

                        <div className="grid grid-cols-4 gap-2 relative z-10">

                            {/* Step 1: ORDER */}
                            <div className="flex flex-col items-center group">
                                {/* Dot */}
                                <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center mb-1">
                                    <div className="w-3 h-3 rounded-full bg-[#ff3b96]"></div>
                                </div>
                                {/* Subtitle */}
                                <span className="text-[10px] sm:text-xs font-bold text-[#ff3b96] mb-3 uppercase tracking-wider">Order</span>
                                {/* Icon Box */}
                                <div className="w-16 h-14 sm:w-20 sm:h-16 bg-gradient-to-b from-[#ff3b96] to-[#d6006e] rounded-lg shadow-lg flex items-center justify-center border-b-4 border-[#a30052] transform hover:-translate-y-1 transition-transform">
                                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Step 2: CONFIRM */}
                            <div className="flex flex-col items-center group">
                                {/* Dot */}
                                <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center mb-1">
                                    <div className="w-3 h-3 rounded-full bg-[#f68b1e]"></div>
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-[#f68b1e] mb-3 uppercase tracking-wider">Confirm</span>
                                {/* Icon Box */}
                                <div className="w-16 h-14 sm:w-20 sm:h-16 bg-gradient-to-b from-[#f68b1e] to-[#c96600] rounded-lg shadow-lg flex items-center justify-center border-b-4 border-[#8f4800] transform hover:-translate-y-1 transition-transform">
                                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Step 3: SHIP */}
                            <div className="flex flex-col items-center group">
                                {/* Dot */}
                                <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center mb-1">
                                    <div className="w-3 h-3 rounded-full bg-[#ffcd05]"></div>
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-[#ffcd05] mb-3 uppercase tracking-wider">Ship</span>
                                {/* Icon Box */}
                                <div className="w-16 h-14 sm:w-20 sm:h-16 bg-gradient-to-b from-[#ffcd05] to-[#cca300] rounded-lg shadow-lg flex items-center justify-center border-b-4 border-[#997a00] transform hover:-translate-y-1 transition-transform">
                                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                            </div>

                            {/* Step 4: DELIVER */}
                            <div className="flex flex-col items-center group">
                                {/* Dot */}
                                <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center mb-1">
                                    <div className="w-3 h-3 rounded-full bg-[#46b31e]"></div>
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-[#46b31e] mb-3 uppercase tracking-wider">Deliver</span>
                                {/* Icon Box */}
                                <div className="w-16 h-14 sm:w-20 sm:h-16 bg-gradient-to-b from-[#46b31e] to-[#368a17] rounded-lg shadow-lg flex items-center justify-center border-b-4 border-[#266110] transform hover:-translate-y-1 transition-transform">
                                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Zones */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Zone 1 */}
                    <div className="bg-gray-800 text-white p-3 font-bold flex items-center gap-3">
                        <span className="text-xl">🚚</span> Zone 1 (General)
                    </div>
                    <div className="p-4 grid gap-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="font-semibold text-gray-700">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">1 - 2</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="font-semibold text-gray-700">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">2 - 4</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-2 bg-gray-50"></div>

                    {/* Zone 2 */}
                    <div className="bg-gray-800 text-white p-3 font-bold flex items-center gap-3">
                        <span className="text-xl">🚛</span> Zone 2 (Regional)
                    </div>
                    <div className="p-4 grid gap-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="font-semibold text-gray-700">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">3 - 4</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="font-semibold text-gray-700">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">5 - 7</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-2 bg-gray-50"></div>

                    {/* Zone 3 */}
                    <div className="bg-gray-800 text-white p-3 font-bold flex items-center gap-3">
                        <span className="text-xl">✈️</span> Zone 3 (Remote)
                    </div>
                    <div className="p-4 grid gap-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="font-semibold text-gray-700">Express Delivery</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">5 - 6</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="font-semibold text-gray-700">Standard Shipping</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-gray-900">6 - 8</span>
                                <span className="text-xs text-gray-500">Business Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Examples Table */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Affected Locations (Zones 2 & 3)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-yellow-50 text-gray-900 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Zone 2 Examples</th>
                                    <th className="px-4 py-3">Zone 3 Examples</th>
                                    <th className="px-4 py-3">Zone 4 Examples</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-3">Amasaman</td>
                                    <td className="px-4 py-3">Ahafo</td>
                                    <td className="px-4 py-3">Bono East</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Dawhenya</td>
                                    <td className="px-4 py-3">Ashanti</td>
                                    <td className="px-4 py-3">North East</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Dodowa</td>
                                    <td className="px-4 py-3">Bono</td>
                                    <td className="px-4 py-3">Northern</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Kasoa</td>
                                    <td className="px-4 py-3">Central</td>
                                    <td className="px-4 py-3">Savannah</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 italic">
                        * Timelines quoted are business days (Monday to Friday), excluding weekends and holidays.
                    </p>
                </div>

                {/* Delivery Methods Info */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b pb-2">Delivery Methods</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                1. Door Delivery 🚪
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                Delivery time starts from the day you place your order to the day one of our delivery associates makes a first attempt to deliver to you.
                                <strong> Delivery will be attempted 3 times over 3 business days</strong> (7.00 am to 5.30pm) after which the item will be cancelled.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                2. Pickup Stations 🏬
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                Delivery time starts from the day you place your order to when you receive the first SMS to pick up your order from our pickup station.
                                <strong> Ensure you pickup your item within 5 days</strong>, otherwise it will be cancelled.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
