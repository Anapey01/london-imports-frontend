import React, { useState } from 'react';
import { MessageCircle, Upload, Search, CheckCircle, Smartphone, ArrowRight, Zap, ShoppingBag, CreditCard } from 'lucide-react';
import Image from 'next/image';

/**
 * 💡 Innovative feature mockups to demonstrate future possibilities
 */
export const InnovationMockups: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'ai' | 'checkout'>('whatsapp');

    return (
        <div className="bg-slate-50 min-h-screen p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        London&apos;s Imports <span className="text-pink-600">Innovation Lab</span> ✨
                    </h1>
                    <p className="text-slate-500 max-w-lg mx-auto italic">
                        Mocking up future-forward features to make importation as easy as sending a message.
                    </p>
                </header>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border flex gap-1">
                        <button
                            onClick={() => setActiveTab('whatsapp')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'whatsapp' ? 'bg-green-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Smartphone size={18} /> WhatsApp Momo
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Zap size={18} /> AI Visual Sourcing
                        </button>
                        <button
                            onClick={() => setActiveTab('checkout')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'checkout' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <ShoppingBag size={18} /> Full Checkout Flow
                        </button>
                    </div>
                </div>

                {activeTab === 'whatsapp' ? <WhatsAppMomoDemo /> : (activeTab === 'ai' ? <AIVisualSourcingDemo /> : <FullCheckoutFlowDemo />)}

                {/* Integration Note */}
                <div className="mt-20 border-t pt-12">
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <CheckCircle className="text-emerald-500" /> Proposed Checkout Journey
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            {/* Line connecting items */}
                            <div className="hidden md:block absolute top-[1.75rem] left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10"></div>

                            {[
                                { title: '1. Shipping Info', desc: 'User enters Accra/Kumasi delivery address.', icon: <ShoppingBag /> },
                                { title: '2. Payment Choice', desc: 'Pick "Paystack" for speed or "WhatsApp" for help.', icon: <Zap className="text-pink-500" /> },
                                { title: '3. Final Action', desc: 'Automatic payment or personal chat confirmation.', icon: <MessageCircle className="text-green-500" /> }
                            ].map((s, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-6 rounded-2xl text-center space-y-3">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border text-slate-400">
                                        {s.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed italic">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhatsAppMomoDemo = () => {
    const [step, setStep] = useState(1); // 1: Card, 2: Choice, 3: WhatsApp Mockup
    const [momoMode, setMomoMode] = useState<'manual' | 'automated'>('automated');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left: Product Card with the new button */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
                    <div className="absolute top-4 right-4 bg-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg rotate-3">
                        FLASH PRE-ORDER
                    </div>
                    <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
                        <Image src="https://placehold.co/400" alt="Product" fill className="object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Nike Air Max &apos;Glow&apos; Edition</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-2xl font-black text-slate-900">GH₵ 1,450</span>
                        <span className="text-sm text-slate-400 line-through">GH₵ 2,200</span>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-3">
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-slate-200 group"
                            >
                                <ShoppingBag size={20} /> PRE-ORDER NOW
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 animate-in fade-in zoom-in-95">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2 italic">Choose Checkout Method</div>
                            <button
                                className="w-full border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-2xl flex items-center gap-4 transition-all group"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black italic">P</div>
                                <div className="text-left flex-1">
                                    <div className="text-sm font-black text-slate-800">Pay Online (Paystack)</div>
                                    <div className="text-[10px] text-slate-500">Fast, automated check-out</div>
                                </div>
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="w-full border-2 border-green-200 bg-green-50 hover:border-green-500 p-4 rounded-2xl flex items-center gap-4 transition-all group"
                            >
                                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                    <MessageCircle size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="text-sm font-black text-green-800">WhatsApp Momo</div>
                                    <div className="text-[10px] text-green-600">{momoMode === 'manual' ? 'Personal help & direct pay' : '⚡ Instant Pay Link via WhatsApp'}</div>
                                </div>
                            </button>
                            <button onClick={() => setStep(1)} className="w-full text-[10px] text-slate-400 hover:underline pt-2">← Back to product</button>
                        </div>
                    )}
                </div>

                {/* Automation Controller */}
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-700 shadow-2xl">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-pink-500" /> Automation Strategy
                    </h4>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
                        <button
                            onClick={() => setMomoMode('manual')}
                            className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${momoMode === 'manual' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Manual Help
                        </button>
                        <button
                            onClick={() => setMomoMode('automated')}
                            className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${momoMode === 'automated' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Instant Link
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">
                        {momoMode === 'manual'
                            ? "Admin manually sends payment details on WhatsApp."
                            : "System auto-generates a pre-filled WhatsApp link with the Order ID and Paystack URL."}
                    </p>
                </div>
            </div>

            {/* Right: The WhatsApp Mockup */}
            <div className={`relative mx-auto w-full max-w-[300px] transition-all duration-500 ${step === 3 ? 'opacity-100 scale-100' : 'opacity-30 scale-95 grayscale pointer-events-none'}`}>
                {/* Phone Frame */}
                <div className="bg-slate-900 p-3 rounded-[3rem] shadow-2xl border-4 border-slate-800 aspect-[9/19] flex flex-col overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-6 flex justify-between px-6 pt-2 items-center text-[10px] text-white/40">
                        <span>9:41</span>
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-white/20"></span>
                            <span className="w-3 h-3 rounded-full bg-white/40"></span>
                        </div>
                    </div>

                    {/* WhatsApp Header */}
                    <div className="bg-[#075e54] text-white p-4 pt-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">L</div>
                        <div>
                            <div className="text-sm font-bold leading-tight">London&apos;s Imports</div>
                            <div className="text-[10px] text-white/60">Business Account</div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-[#e5ddd5] p-3 space-y-4 overflow-y-auto pattern-diagonal-stripes">
                        {momoMode === 'automated' ? (
                            <>
                                <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm text-[11px] max-w-[85%] ml-auto animate-in fade-in slide-in-from-right-2 duration-700">
                                    Hello! I want to pre-order the **Nike Air Max &apos;Glow&apos;** (Order #LI-9921). My shipping address is East Legon.
                                </div>
                                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[85%] animate-in fade-in slide-in-from-left-2 delay-500 duration-1000">
                                    <div className="font-bold text-slate-900 border-b pb-1 mb-1">AUTO-REPLY 🤖</div>
                                    Thanks Kwame! 💫 We&apos;ve reserved 1 unit of **Nike Air Max &apos;Glow&apos;** for you.
                                    <div className="mt-2 bg-slate-50 p-2 rounded border border-blue-100 flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-blue-600 uppercase">Paystack Secure Link</span>
                                        <span className="text-emerald-600 font-bold">GH₵ 1,450.00</span>
                                        <div className="text-blue-500 underline font-medium truncate">paystack.com/pay/liq9921</div>
                                    </div>
                                    <div className="mt-2 text-[9px] text-slate-400 italic">
                                        Once paid, you&apos;ll get a confirmation here instantly!
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[85%] animate-in fade-in slide-in-from-left-2 duration-1000">
                                    Hello Kwame! 👋 I see you&apos;re looking at the **Nike Air Max &apos;Glow&apos; Edition**. Do you need help with the payment or sizing?
                                </div>
                                <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm text-[11px] max-w-[85%] ml-auto animate-in fade-in slide-in-from-right-2 delay-1000 duration-1000">
                                    Yes please! Can I pay via Momo?
                                </div>
                                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[85%] animate-in fade-in slide-in-from-left-2 delay-2000 duration-1000">
                                    Absolutely! You can send GH₵ 1,450 to our merchant number: **0541234567** (London&apos;s Imports).
                                    <div className="mt-2 text-[9px] text-slate-400 italic">Please send a screenshot once done! 📸</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Input Bar */}
                    <div className="p-2 bg-white flex items-center gap-2">
                        <div className="flex-1 h-8 bg-slate-100 rounded-full px-4 text-[10px] flex items-center text-slate-400 italic">Type a message...</div>
                        <div className="w-8 h-8 bg-[#128c7e] rounded-full flex items-center justify-center text-white">
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>

                {/* Visual Connector Description */}
                <div className="mt-6 text-center space-y-2">
                    <h4 className="font-bold text-slate-800">Checkout in 1 Click</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                        By integrating WhatsApp, users never have to leave their favorite app to buy.
                    </p>
                </div>
            </div>
        </div>
    );
};

const AIVisualSourcingDemo = () => {
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'found' | 'sent'>('idle');

    const handleUpload = () => {
        setStatus('analyzing');
        setTimeout(() => setStatus('found'), 2500);
    };

    const handleConfirm = () => {
        setStatus('sent');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Interactive Upload Zone */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-xs font-black mb-4 italic tracking-wider">
                                <Zap size={14} /> AI POWERED
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 leading-tight">
                                Saw something on IG <br />that you <span className="text-pink-600">LOVE?</span>
                            </h2>
                            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
                                Drag any screenshot here. Our AI will scan thousands of Chinese manufacturers to find the best price for you.
                            </p>
                        </div>

                        {status === 'idle' && (
                            <div
                                onClick={handleUpload}
                                className="border-4 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-pink-300 transition-all cursor-pointer group group-hover:scale-[1.01]"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Upload size={32} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                                </div>
                                <span className="font-bold text-slate-600">Click to Upload Screenshot</span>
                                <span className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</span>
                            </div>
                        )}

                        {status === 'analyzing' && (
                            <div className="bg-slate-900 rounded-[2rem] p-12 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-blue-600/20 animate-pulse"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_30px_rgba(219,39,119,0.4)]"></div>
                                    <h3 className="text-white font-black text-lg mb-2">Analyzing Image...</h3>
                                    <p className="text-white/60 text-xs font-medium italic">Sourcing best manufacturers in Guangzhou & Shenzhen</p>
                                </div>
                            </div>
                        )}

                        {status === 'found' && (
                            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-8 animate-in zoom-in-95">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-emerald-800 font-black text-xl">Sourcing Successful!</span>
                                        <span className="text-emerald-600 text-sm font-bold">3 Direct Sources Found</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-emerald-50 mb-1">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                                        <Image src="https://placehold.co/100" alt="Result" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-xs font-black text-slate-500 uppercase italic">BEST MATCH</span>
                                        <span className="block font-bold text-slate-800">Designer Bag V2</span>
                                        <span className="text-lg font-black text-emerald-600">GH₵ 850</span>
                                    </div>
                                    <button
                                        onClick={handleConfirm}
                                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800"
                                    >
                                        IMPORT NOW
                                    </button>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="w-full mt-4 text-emerald-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                                >
                                    Try Another Search
                                </button>
                            </div>
                        )}

                        {status === 'sent' && (
                            <div className="bg-slate-900 rounded-[2rem] p-10 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-[#128c7e] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <MessageCircle size={32} />
                                </div>
                                <h3 className="text-white font-black text-2xl mb-2">Request Sent!</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium italic">
                                    We&apos;ve sent your sourcing request to our <br />team. You&apos;ll get a WhatsApp message <br />shortly with final shipping details.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-[#128c7e] text-xs font-black uppercase tracking-widest hover:underline"
                                >
                                    Search for something else
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Visual Mockup for Context */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Decorative element (The "Vision") */}
                            <div className="bg-slate-50 p-6 rounded-[2rem] border rotate-6 shadow-xl relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Search size={18} className="text-pink-500" />
                                    <span className="text-xs font-bold text-slate-500">AI Visual Analysis Report #1024</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                                    <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="aspect-[4/3] bg-pink-100 rounded-lg flex items-center justify-center text-pink-300 py-2 italic font-black text-[10px]">PATTERN DETECTED</div>
                                        <div className="aspect-[4/3] bg-blue-100 rounded-lg flex items-center justify-center text-blue-300 py-2 italic font-black text-[10px]">VENDOR VERIFIED</div>
                                    </div>
                                </div>
                            </div>
                            {/* Secondary decorative element */}
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl border shadow-lg -rotate-12 w-40">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold">China Direct Rate</span>
                                </div>
                                <div className="text-xl font-black text-slate-900 leading-none mb-1">-45%</div>
                                <div className="text-[10px] text-slate-400 italic font-medium">vs Retail Ghana</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer / Goal */}
            <div className="mt-12 max-w-2xl mx-auto text-center">
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                    This is a **High-Fidelity Concept**. Implementing this would bridge the gap between social discovery and importation,
                    positioning London&apos;s Imports as a tech-first leader in the region.
                </p>
            </div>
        </div>
    );
};

const FullCheckoutFlowDemo = () => {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-2xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Steps Progress */}
            <div className="flex justify-between mb-10 px-6">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                            {step > s ? <CheckCircle size={16} /> : s}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                            {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Success'}
                        </span>
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="mock-name" className="text-[10px] font-black text-slate-400 uppercase">Full Name</label>
                            <input id="mock-name" type="text" value="Kwame Mensah" readOnly className="w-full border p-3 rounded-xl bg-slate-50 font-bold text-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="mock-phone" className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
                            <input id="mock-phone" type="text" value="+233 54 524 7009" readOnly className="w-full border p-3 rounded-xl bg-slate-50 font-bold text-slate-800" />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label htmlFor="mock-address" className="text-[10px] font-black text-slate-400 uppercase">Delivery Address</label>
                            <textarea id="mock-address" rows={2} readOnly className="w-full border p-3 rounded-xl bg-slate-50 font-bold text-slate-800 italic">East Legon, near the Shell station, Accra</textarea>
                        </div>
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                        CONTINUE TO PAYMENT <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-black text-slate-800 text-center">How would you like to pay?</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => setStep(3)}
                            className="bg-green-50 border-2 border-green-500 p-5 rounded-[2rem] flex items-center gap-6 hover:scale-[1.02] transition-all group"
                        >
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                                <Zap size={28} />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    WhatsApp Momo Checkout
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">RECOMMENDED</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium italic truncate">Instant chat with Admin for Momo details</p>
                            </div>
                            <ArrowRight size={20} className="ml-auto text-green-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            onClick={() => setStep(3)}
                            className="bg-blue-50 border-2 border-blue-100 p-5 rounded-[2rem] flex items-center gap-6 hover:scale-[1.02] transition-all group grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-blue-500"
                        >
                            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <CreditCard size={28} />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <div className="text-lg font-black text-slate-800">Paystack (Card/Bank)</div>
                                <p className="text-xs text-slate-500 font-medium">Standard automated payment</p>
                            </div>
                            <ArrowRight size={20} className="ml-auto text-blue-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-6 py-10 animate-in zoom-in-95">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900">Order Placed!</h3>
                        <p className="text-slate-500 font-medium italic mt-2 leading-relaxed">
                            Thank you, Kwame. <br />We have received your pre-order for the <strong>Nike Air Max &apos;Glow&apos;</strong>.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 font-bold">MODE:</span>
                            <span className="text-green-600 font-black">WHATSAPP MOMO</span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-relaxed italic">
                            💡 Our team will contact you on WhatsApp in 5-10 mins with the payment details.
                        </div>
                    </div>
                    <button
                        onClick={() => setStep(1)}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg"
                    >
                        RETURN TO SHOP
                    </button>
                </div>
            )}
        </div>
    );
};
