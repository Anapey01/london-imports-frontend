/**
 * AI Sourcing Page Mockup — Storybook
 * Clean black & white editorial design with professional SVG icons.
 */
import { useState } from 'react';
import {
    Upload,
    Camera,
    Sparkles,
    Search,
    ArrowRight,
    CheckCircle2,
    Tag,
    Palette,
    DollarSign,
    Layers,
} from 'lucide-react';

const mockAnalysis = {
    product_name: 'Nike Air Max 95 OG "Neon"',
    category: 'Footwear / Sneakers',
    description: 'Iconic retro running shoe with visible Air Max cushioning, gradient side panels in neon yellow/green, and wolf grey upper.',
    estimated_price_usd: '45 – 65',
    colors: ['Neon Yellow', 'Wolf Grey', 'Black', 'White'],
    materials: ['Mesh', 'Synthetic Leather', 'Rubber Sole'],
    keywords: ['nike air max 95', 'neon sneaker', 'retro running shoe', '复古跑鞋', '气垫运动鞋'],
    confidence: 'HIGH' as const,
};

export function SourcingPageMockup() {
    const [view, setView] = useState<'upload' | 'results'>('upload');

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Story toggle */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-2">
                <button
                    onClick={() => setView('upload')}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${view === 'upload' ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
                >
                    Upload State
                </button>
                <button
                    onClick={() => setView('results')}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${view === 'results' ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
                >
                    Results State
                </button>
            </div>

            {/* Hero */}
            <section className="bg-black text-white">
                <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
                    <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI-Powered Sourcing
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                        See it. Screenshot it.
                        <br />
                        <span className="text-gray-400">We&apos;ll find it for you.</span>
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-lg leading-relaxed">
                        Upload a product screenshot from any platform. Our AI identifies it,
                        and our team sources the best supplier.
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                {view === 'upload' ? (
                    <>
                        {/* Upload Card */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-10 sm:p-14 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 mx-auto rounded-full border-2 border-gray-200 flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Drop your screenshot here</p>
                                        <p className="text-xs text-gray-400 mt-1">or click to browse · PNG, JPG, WEBP · Max 10 MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 p-6">
                                <label htmlFor="mock-desc" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Additional context <span className="text-gray-300 font-normal normal-case">(optional)</span>
                                </label>
                                <textarea
                                    id="mock-desc"
                                    placeholder="e.g. Saw this on TikTok, it's a portable charger..."
                                    rows={2}
                                    readOnly
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 resize-none"
                                />
                            </div>

                            <div className="border-t border-gray-200 p-6">
                                <button className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Analyze with AI
                                </button>
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="mt-16">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">How it works</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {[
                                    { icon: Camera, title: 'Screenshot', desc: 'Capture the product from Instagram, TikTok, or any platform.' },
                                    { icon: Sparkles, title: 'AI Analysis', desc: 'Our AI identifies the product, colors, materials, and price range.' },
                                    { icon: ArrowRight, title: 'We Source It', desc: 'Our team finds the best supplier and ships directly to Ghana.' },
                                ].map((item, i) => (
                                    <div key={i} className="group">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mb-4 group-hover:bg-black group-hover:border-black transition-colors">
                                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Results */
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Analysis complete</p>
                                <p className="text-xs text-gray-400">Your product has been identified</p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Product header */}
                            <div className="p-6 flex gap-5 items-start border-b border-gray-100">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-gray-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                        {mockAnalysis.product_name}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {mockAnalysis.description}
                                    </p>
                                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border text-gray-900 bg-gray-100 border-gray-200">
                                        {mockAnalysis.confidence} match
                                    </span>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="divide-y divide-gray-100">
                                <div className="grid grid-cols-2 divide-x divide-gray-100">
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Tag className="w-3.5 h-3.5 text-gray-300" />
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{mockAnalysis.category}</p>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <DollarSign className="w-3.5 h-3.5 text-gray-300" />
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Est. Price</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">${mockAnalysis.estimated_price_usd}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-gray-100">
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Palette className="w-3.5 h-3.5 text-gray-300" />
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Colors</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{mockAnalysis.colors.join(', ')}</p>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Layers className="w-3.5 h-3.5 text-gray-300" />
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Materials</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{mockAnalysis.materials.join(', ')}</p>
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Search className="w-3.5 h-3.5 text-gray-300" />
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Search Keywords</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mockAnalysis.keywords.map((kw, i) => (
                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Next steps */}
                            <div className="border-t border-gray-200 bg-gray-50 p-5">
                                <p className="text-xs font-semibold text-gray-500 mb-1">What happens next?</p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Our sourcing team will review this request and find the best supplier. We&apos;ll notify you when it&apos;s available.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setView('upload')}
                                className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                Upload Another
                            </button>
                            <button className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors">
                                Browse Products
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
