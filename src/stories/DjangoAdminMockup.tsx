import React, { useState } from 'react';
import { Search, MessageCircle, Clock, ExternalLink } from 'lucide-react';

import Image from 'next/image';


/**
 * A mockup component that visually demonstrates the simplified 
 * Django Admin layout I implemented in the backend + the new Sourcing Dashboard.
 */
export const DjangoAdminMockup: React.FC = () => {
    const [view, setView] = useState<'product' | 'sourcing'>('product');

    return (
        <div className="bg-[#f8f9fa] min-h-screen p-6 font-sans text-[#333]">
            {/* Header */}
            <header className="bg-[#79aec8] text-white p-4 flex justify-between items-center rounded-t-lg mb-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold italic tracking-wide">
                        Django administration
                    </h1>
                    <nav className="flex gap-4 text-xs font-bold uppercase tracking-widest text-[#d5e1e8]">
                        <button onClick={() => setView('product')} className={`hover:text-white transition-colors ${view === 'product' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Products</button>
                        <button onClick={() => setView('sourcing')} className={`hover:text-white transition-colors ${view === 'sourcing' ? 'text-white border-b-2 border-white pb-1' : ''}`}>AI Sourcing Requests</button>
                    </nav>
                </div>
                <div className="text-sm">
                    Welcome, <strong>Admin</strong>. <span className="underline cursor-pointer">View site</span> / <span className="underline cursor-pointer">Log out</span>
                </div>
            </header>

            {view === 'product' ? <ProductEditorView /> : <SourcingDashboardView />}

            {/* Hint Box */}
            <div className="mt-12 max-w-5xl mx-auto bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-6 items-center shadow-inner">
                <div className="text-4xl">💡</div>
                <div>
                    <h4 className="font-bold text-blue-900 mb-1 italic">Agent&apos;s Note: Admin Hub</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        {view === 'product'
                            ? "I've simplified the product forms so you only see what matters for pre-orders."
                            : "AI Sourcing requests land here! You get the user's screenshot, the AI's best finding, and a direct button to WhatsApp the user."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

const ProductEditorView = () => (
    <>
        {/* Breadcrumbs */}
        <div className="text-xs text-[#666] mb-4">
            HOME › PRODUCTS › PRODUCTS › SNEAKERS...
        </div>

        <main className="bg-white border border-[#eee] rounded-lg shadow-md p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-2xl font-light text-[#444]">Change Product</h2>
                <div className="flex gap-2 text-xs">
                    <span className="bg-[#79aec8] text-white px-3 py-1.5 rounded cursor-pointer hover:bg-[#6090a8] transition-colors font-medium">HISTORY</span>
                    <span className="bg-[#ba2121] text-white px-3 py-1.5 rounded cursor-pointer hover:bg-[#a11a1a] transition-colors font-medium underline">VIEW ON SITE</span>
                </div>
            </div>

            <div className="space-y-12">
                {/* Section 1: Basic Information */}
                <section>
                    <div className="bg-[#f2f2f2] px-4 py-2 border-l-4 border-[#79aec8] mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#666] uppercase tracking-wider">📦 1. Basic Information</h3>
                        <span className="text-[10px] text-gray-500 italic">Main product identity and description.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Name:</label>
                            <input type="text" value="Air Max 2026 Limited" readOnly title="Product name" className="w-full border p-2 bg-gray-50 rounded" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Slug:</label>
                            <input type="text" value="air-max-2026-limited" readOnly title="Product slug" className="w-full border p-2 bg-gray-100 italic rounded text-gray-500" />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Description:</label>
                            <textarea rows={2} readOnly title="Product description" className="w-full border p-2 bg-gray-50 rounded italic text-gray-500 text-sm">A premium sneaker designed for comfort and speed...</textarea>
                        </div>
                        <div className="col-span-full grid grid-cols-2 gap-8 items-start">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#666]">Main Image:</label>
                                <div className="border border-dashed border-[#ccc] p-4 text-center rounded bg-gray-50">
                                    <div className="text-xs text-gray-400 mb-2">cloudinary/products/sneaker-main.jpg</div>
                                    <button className="text-xs bg-white border px-3 py-1 rounded shadow-sm">Change Image</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#666]">Image Preview:</label>
                                <div className="border border-[#eee] p-2 rounded bg-white shadow-sm inline-block relative w-32 h-32">
                                    <Image src="https://placehold.co/150" alt="Preview" fill className="object-cover rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Financials */}
                <section>
                    <div className="bg-[#f2f2f2] px-4 py-2 border-l-4 border-[#79aec8] mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#666] uppercase tracking-wider">💰 2. Pricing & Financials</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-8 px-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Price (GH₵):</label>
                            <input type="text" value="1,200.00" readOnly title="Price in GH₵" className="w-full border p-2 bg-gray-50 rounded font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Deposit (GH₵):</label>
                            <input type="text" value="400.00" readOnly title="Deposit in GH₵" className="w-full border p-2 bg-gray-50 rounded" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">SKU:</label>
                            <div className="flex items-center gap-2">
                                <input type="text" value="SNK-AM2026-X" readOnly title="Product SKU" className="flex-1 border p-2 bg-gray-100 rounded text-gray-600" />
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">AUTO</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Group Buy (The Feature We Added!) */}
                <section className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                    <div className="bg-white/80 px-4 py-2 border-l-4 border-pink-400 mb-6 flex items-center justify-between rounded-r">
                        <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wider italic">📊 3. Pre-order & Group Buy (Enhanced)</h3>
                        <span className="text-[10px] text-pink-500 font-bold">Building Social Proof</span>
                    </div>
                    <div className="grid grid-cols-3 gap-8 px-4 pb-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-pink-900">Target Quantity:</label>
                            <input type="number" value="20" readOnly title="Target quantity" className="w-full border-pink-200 border p-2 bg-white rounded-lg focus:ring-pink-500 shadow-sm font-bold text-center text-pink-600" />
                            <span className="block text-[10px] text-pink-400 italic">This powers the progress bar!</span>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Current Reservations:</label>
                            <div className="w-full border p-2 bg-gray-100 rounded-lg text-center font-bold text-lg text-gray-500">4</div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Pre-order Status:</label>
                            <select disabled title="Pre-order status" className="w-full border p-2 bg-purple-600 text-white rounded-lg font-bold">
                                <option>PRE-ORDER</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Section 4: Variants (Innovation!) */}
                <section>
                    <div className="bg-[#f2f2f2] px-4 py-2 border-l-4 border-emerald-500 mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#666] uppercase tracking-wider">🎨 4. Variants & Media</h3>
                        <span className="text-[10px] text-emerald-600 font-bold italic">💡 Simply type values separated by commas!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8 px-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Available Sizes:</label>
                            <input type="text" placeholder="e.g. 40, 41, 42, 43" value="40, 41, 42, 43, 44, 45" readOnly className="w-full border p-2 bg-emerald-50 border-emerald-100 rounded shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Available Colors:</label>
                            <input type="text" placeholder="e.g. Red, Blue, White" value="Infrared Red, Stealth Black, Arctic White" readOnly className="w-full border p-2 bg-emerald-50 border-emerald-100 rounded shadow-inner" />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="block text-sm font-bold text-[#666]">Video URL (Optional):</label>
                            <input type="text" placeholder="https://youtube.com/..." readOnly className="w-full border p-2 bg-gray-50 rounded italic text-gray-400" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer Buttons */}
            <div className="mt-12 pt-8 border-t flex justify-between items-center bg-[#f8f9fa] -mx-8 -mb-8 p-6 rounded-b-lg">
                <button className="bg-[#ba2121] text-white px-6 py-2 rounded shadow hover:bg-[#a11a1a] transition-all font-bold">DELETE</button>
                <div className="flex gap-4">
                    <button className="bg-white border text-[#333] px-6 py-2 rounded shadow-sm hover:bg-gray-50 transition-all font-medium border-gray-300">SAVE AND ADD ANOTHER</button>
                    <button className="bg-[#79aec8] text-white px-8 py-2 rounded shadow hover:bg-[#6090a8] transition-all font-bold">SAVE ALL CHANGES</button>
                </div>
            </div>
        </main>
    </>
);

const SourcingDashboardView = () => (
    <>
        {/* Breadcrumbs */}
        <div className="text-xs text-[#666] mb-4">
            HOME › SOURCING › SOURCING REQUESTS › SELECT SOURCING REQUEST TO CHANGE
        </div>

        <main className="bg-white border border-[#eee] rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
            <div className="bg-[#f8f9fa] p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#444]">Select Sourcing Request to change</h2>
                <button className="bg-[#79aec8] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#6090a8] transition-colors">
                    + ADD SOURCING REQUEST
                </button>
            </div>

            {/* List Table */}
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[#666] border-b">
                    <tr>
                        <th className="p-4 w-10"><input type="checkbox" readOnly title="Select all" /></th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">User Image</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">User Detail</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]" title="AI Finding Results">AI Best Match</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {[
                        {
                            user: 'Abena Mensah',
                            phone: '+233 24xxx',
                            status: 'New',
                            color: '#7c3aed',
                            finding: 'LV Twist Bag (Guangzhou OEM)',
                            price: '₵ 1,200',
                            date: '2 mins ago'
                        },
                        {
                            user: 'Kwesi Appiah',
                            phone: '+233 55xxx',
                            status: 'Finding',
                            color: '#f59e0b',
                            finding: 'Jordan 4 Black Cat',
                            price: '₵ 850',
                            date: '15 mins ago'
                        },
                    ].map((req, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-4"><input type="checkbox" readOnly title="Select row" /></td>
                            <td className="p-4">
                                <div className="w-16 h-16 bg-slate-100 rounded border p-1 shadow-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-zoom-in">
                                        <Search size={16} className="text-white" />
                                    </div>
                                    <Image src="https://placehold.co/100" alt="User Shot" fill className="object-cover rounded" />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-bold text-[#444]">{req.user}</div>
                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} /> {req.date}</div>
                            </td>
                            <td className="p-4">
                                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-3">
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <Image src="https://placehold.co/60" alt="Finding" fill className="rounded object-cover border border-emerald-200" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-emerald-700 font-black italic uppercase">AI MATCH FOUND</div>
                                        <div className="text-xs font-bold text-slate-800">{req.finding}</div>
                                        <div className="text-xs font-black text-emerald-600">{req.price}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${req.status === 'New' ? 'bg-violet-600' : 'bg-amber-500'}`}>
                                    {req.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors shadow-sm" title="WhatsApp User">
                                        <MessageCircle size={16} />
                                    </button>
                                    <button className="bg-white border border-slate-200 p-2 rounded hover:bg-slate-50 transition-colors shadow-sm" title="Convert to Product">
                                        <ExternalLink size={16} className="text-slate-400" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="p-4 bg-slate-50 text-xs text-slate-500 font-medium">
                2 sourcing requests
            </div>
        </main>
    </>
);
