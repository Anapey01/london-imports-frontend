/**
 * London's Imports — AI Sourcing
 * Clean, editorial black & white design with professional SVG icons.
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    X,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com';

interface AIAnalysis {
    product_name: string;
    category: string;
    description: string;
    estimated_price_usd: string;
    colors: string[];
    materials: string[];
    keywords: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface SourcingResult {
    id: string;
    image_url: string;
    description: string;
    ai_analysis: AIAnalysis | null;
    status: string;
    created_at: string;
}

export default function SourcingPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<SourcingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (PNG, JPG, WEBP).');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be under 10MB.');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setResult(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
            setResult(null);
        }
    }, []);

    const handleSubmit = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/login?redirect=/sourcing');
                return;
            }

            const formData = new FormData();
            formData.append('image', selectedFile);
            if (description.trim()) {
                formData.append('description', description.trim());
            }

            const res = await fetch(`${API_BASE}/api/v1/sourcing/requests/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (res.status === 429) {
                setError("You've reached your daily limit of 5 requests. Try again tomorrow.");
                return;
            }
            if (res.status === 401) {
                router.push('/login?redirect=/sourcing');
                return;
            }

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.detail || data.error || `Server Error (${res.status})`);
                }
                setResult(data);
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error(`Server returned non-JSON response (${res.status}). Check backend logs.`);
            }
        } catch (err: any) {
            console.error('Sourcing upload error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setDescription('');
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero — Clean black bar */}
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

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                {!result ? (
                    <>
                        {/* Upload Card */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className={`relative p-10 sm:p-14 text-center cursor-pointer transition-colors
                                    ${previewUrl
                                        ? 'bg-gray-50'
                                        : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    aria-label="Upload product screenshot"
                                />

                                {previewUrl ? (
                                    <div className="space-y-5">
                                        <div className="relative w-full max-w-[240px] mx-auto aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                                                aria-label="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5 text-white" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {selectedFile?.name} · {((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 mx-auto rounded-full border-2 border-gray-200 flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Drop your screenshot here</p>
                                            <p className="text-xs text-gray-400 mt-1">or click to browse · PNG, JPG, WEBP · Max 10 MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {previewUrl && (
                                <div className="border-t border-gray-200 p-6">
                                    <label htmlFor="sourcing-desc" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Additional context <span className="text-gray-300 font-normal normal-case">(optional)</span>
                                    </label>
                                    <textarea
                                        id="sourcing-desc"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g. Saw this on TikTok, it's a portable charger..."
                                        rows={2}
                                        maxLength={500}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:ring-1 focus:ring-black focus:border-black resize-none"
                                    />
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="border-t border-gray-200 px-6 py-4 bg-red-50 text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            {previewUrl && (
                                <div className="border-t border-gray-200 p-6">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isUploading}
                                        className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4" />
                                                Analyze with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
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
                        {/* Success header */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Analysis complete</p>
                                <p className="text-xs text-gray-400">Your product has been identified</p>
                            </div>
                        </div>

                        {/* Result card */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Product header */}
                            <div className="p-6 flex gap-5 items-start border-b border-gray-100">
                                {result.image_url && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <Image src={result.image_url} alt="Uploaded" fill className="object-cover" unoptimized />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                        {result.ai_analysis?.product_name || 'Product Detected'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {result.ai_analysis?.description}
                                    </p>
                                    {result.ai_analysis?.confidence && (
                                        <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border
                                            ${result.ai_analysis.confidence === 'HIGH'
                                                ? 'text-gray-900 bg-gray-100 border-gray-200'
                                                : result.ai_analysis.confidence === 'MEDIUM'
                                                    ? 'text-gray-600 bg-gray-50 border-gray-200'
                                                    : 'text-gray-400 bg-gray-50 border-gray-100'
                                            }`}>
                                            {result.ai_analysis.confidence} match
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            {result.ai_analysis && (
                                <div className="divide-y divide-gray-100">
                                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Tag className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{result.ai_analysis.category}</p>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Est. Price</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">${result.ai_analysis.estimated_price_usd}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Palette className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Colors</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {result.ai_analysis.colors?.join(', ') || '—'}
                                            </p>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Layers className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Materials</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {result.ai_analysis.materials?.join(', ') || '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    {result.ai_analysis.keywords?.length > 0 && (
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Search className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Search Keywords</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {result.ai_analysis.keywords.map((kw, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                onClick={resetForm}
                                className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                Upload Another
                            </button>
                            <Link
                                href="/"
                                className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
