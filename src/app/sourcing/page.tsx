/**
 * London's Imports — Premium AI Sourcing (Redesigned)
 * Editorial, asymmetrical layout with a focus on 'Human-First' logistics.
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import {
    Camera,
    Sparkles,
    ArrowRight,
    X,
    Briefcase,
    ShieldCheck,
} from 'lucide-react';

const API_BASE = siteConfig.apiUrl.replace(/\/api\/v1$/, '');

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

            // Robust URL construction
            let baseUrl = API_BASE.replace(/\/$/, ""); // Strip trailing slash
            if (baseUrl.endsWith('/api/v1')) {
                baseUrl = baseUrl.substring(0, baseUrl.length - 7);
            }
            const fetchUrl = `${baseUrl}/api/v1/sourcing/requests/`;

            const formData = new FormData();
            formData.append('image', selectedFile);
            if (description) {
                formData.append('description', description);
            }

            const res = await fetch(fetchUrl, {
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
                throw new Error(`Server returned non-JSON response (${res.status}).`);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Something went wrong. Please try again.');
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
        <div className="min-h-screen bg-white selection:bg-emerald-100 relative">
            {/* 1. LAYERED BACKGROUND TYPOGRAPHY */}
            <div className="absolute top-10 right-0 pointer-events-none select-none overflow-hidden aria-hidden opacity-10">
                <span className="text-[15rem] md:text-[30rem] font-black text-slate-100 uppercase leading-none tracking-tighter block -mr-20">
                    SOURCE
                </span>
            </div>

            {/* 2. SUBTLE NOISE OVERLAY */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

            {/* Header Content */}
            <section className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT COLUMN: Editorial Context (5 cols) */}
                    <div className="lg:col-span-12 flex flex-col items-start mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-px w-10 bg-emerald-700/30" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-800">
                                Beyond Simple Search <span className="text-slate-200 mx-1">/</span> Direct Factory Access
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black leading-[0.9] tracking-tighter text-slate-900 mb-8 max-w-4xl">
                            The Sourcing <br />
                            <span className="italic font-light text-slate-400 opacity-40">Intelligence</span> Engine.
                        </h1>
                        <p className="max-w-xl text-xl text-slate-600 font-medium leading-relaxed">
                            Upload a single screenshot from TikTok, Instagram, or 1688. 
                            Our Vision AI extracts the DNA, while our Guangzhou team handles the human negotiation.
                        </p>
                    </div>

                    {/* MAIN UPLOAD INTERFACE (Asymmetrical Split) */}
                    <div className="lg:col-span-7 relative">
                        {!result ? (
                            <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                {/* Glassmorphism accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150 duration-700" />
                                
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`relative z-10 border-2 border-dashed rounded-3xl p-10 md:p-16 text-center cursor-pointer transition-all duration-300
                                        ${previewUrl
                                            ? 'bg-slate-50/50 border-emerald-200'
                                            : 'bg-white border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20'
                                        }`}
                                >
                                    <input 
                                        ref={fileInputRef} 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileSelect} 
                                        className="hidden" 
                                        title="Upload product image" 
                                        aria-label="Upload product image"
                                    />

                                    {previewUrl ? (
                                        <div className="space-y-6">
                                            <div className="relative w-full max-w-[280px] mx-auto aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                                <Image src={previewUrl} alt="Product Preview" fill className="object-cover" unoptimized />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); resetForm(); }}
                                                    title="Remove image"
                                                    aria-label="Remove image"
                                                    className="absolute top-4 right-4 w-10 h-10 bg-slate-900/90 text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black uppercase text-emerald-800 tracking-widest">Image Loaded Sucessfully</span>
                                                <span className="text-[10px] text-slate-400">{selectedFile?.name}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Camera className="w-6 h-6 text-white" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-lg font-bold text-slate-900">Drop your reference here</h3>
                                                <p className="text-sm text-slate-500 max-w-[240px] mx-auto">Upload a screenshot from Instagram, 1688, or TikTok.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {previewUrl && (
                                    <div className="mt-10 space-y-8 relative z-10">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Manual Context (Optional)</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="e.g. 'I'm looking for the 2026 version with the gold trim...'"
                                                rows={3}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 animate-shake">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isUploading}
                                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <span className="animate-pulse">Deep Matching in Progress...</span>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    Initiate AI Sourcing
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* RESULTS DESIGN (Premium Card) */
                            <div className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className={`w-3 h-3 rounded-full ${result.status === 'ANALYZED' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Analysis Fragment #{result.id.slice(-4)}</span>
                                </div>

                                <div className="flex gap-8 items-start mb-12">
                                     <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-white shadow-xl flex-shrink-0">
                                        <Image src={result.image_url} alt="Uploaded" fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1">
                                         <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                                            {result.ai_analysis?.product_name || 'Manual Review Pending'}
                                        </h2>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                                            {result.ai_analysis?.description || 'Our logistics team is currently verifying this product match with our trusted GZ supplier network.'}
                                        </p>
                                        <div className="flex gap-4">
                                             <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-widest">Est. Market Price</span>
                                                <span className="text-lg font-bold">${result.ai_analysis?.estimated_price_usd || '—'}</span>
                                            </div>
                                             <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-widest">Category ID</span>
                                                <span className="text-lg font-bold">{result.ai_analysis?.category || 'Sourcing'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 mb-10">
                                    <h4 className="text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Our Global Verdict</h4>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        Status: <span className="text-slate-900 font-bold ml-1">{result.status}</span>. 
                                        {result.status === 'ANALYZED' 
                                            ? ' Our sourcing desk has confirmed this item is available. We will contact you on WhatsApp with the direct factory quote.' 
                                            : ' Received. Our human agents in China are checking availability with secondary suppliers.'}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={resetForm} className="flex-1 h-14 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">New Search</button>
                                    <Link href="/" className="flex-1 h-14 bg-slate-900 text-white flex items-center justify-center rounded-xl font-bold text-xs hover:opacity-90 transition-all">Home</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Service Value (5 cols) */}
                    <div className="lg:col-span-12 mt-20">
                         <div className="grid md:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
                            {[
                                { icon: Briefcase, title: "Expert Negotiation", text: "Our staff in Guangzhou doesn't just find links—they negotiate bulk MOQs for you." },
                                { icon: ShieldCheck, title: "Fraud Protection", text: "We verify the factory's physical existence before a single Cent is paid." },
                                { icon: ArrowRight, title: "Momo Conversion", text: "Forget USD/CNY rates. Pay entirely in Cedis via Mobile Money at fixed rates." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 tracking-tight underline decoration-emerald-100 decoration-4 underline-offset-4">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
