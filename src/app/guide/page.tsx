/**
 * London's Imports — The Ultimate Importation Guide (Redesigned)
 * Editorial, asymmetrical layout with a focus on 'Mastery' and 'Logic'.
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, Wallet, TrendingUp, HelpCircle, Package, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: "How to Start Mini-Importation in Ghana 2026 | Ultimate Beginner's Guide",
    description: "Learn how to import goods from China (1688, Alibaba) to Ghana. Step-by-step guide on sourcing, paying with Momo, and consolidated shipping. Start your profitable business today.",
    keywords: ["How to start mini importation in Ghana", "Buy from 1688 to Ghana guide", "Profitable items to import from China", "Mobile Money to China payments", "Ghana mini importation training"],
};

export default function GuidePage() {
    const steps = [
        {
            title: "Find Winning Products",
            desc: "Use platforms like 1688.com (the factory of the world) or Taobao. Look for light, high-value items like electronics, fashion, or gadgets.",
            icon: Search,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            align: "start"
        },
        {
            title: "Calculate Your Landed Cost",
            desc: "Factor in the product price, shipping fees, and customs. Use our Duty Estimator to ensure your profit margins stay healthy.",
            icon: TrendingUp,
            color: "text-slate-900",
            bg: "bg-slate-50",
            align: "end"
        },
        {
            title: "Pay with Ease (Momo)",
            desc: "No need for international cards. We help you convert Cedis to Yuan and pay Chinese suppliers securely via Mobile Money.",
            icon: Wallet,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            align: "start"
        },
        {
            title: "Consolidated Shipping",
            desc: "Ship to our China warehouse. We'll batch your orders and bring them to Accra or Tema. After landing, clearing and local delivery takes just 7-14 days.",
            icon: Package,
            color: "text-slate-900",
            bg: "bg-slate-50",
            align: "end"
        }
    ];

    return (
        <div className="min-h-screen bg-white relative pb-32">
            {/* 1. LAYERED BACKGROUND TYPOGRAPHY */}
            <div className="absolute top-10 right-0 pointer-events-none select-none overflow-hidden aria-hidden opacity-[0.07]">
                <span className="text-[15rem] md:text-[30rem] font-black text-slate-100 uppercase leading-none tracking-tighter block -mr-20 italic">
                    MASTER
                </span>
            </div>

            {/* 2. SUBTLE NOISE OVERLAY */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24">
                {/* Header Context */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-10">
                        <span className="h-px w-10 bg-emerald-700/30" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-800">
                            Educational Core <span className="text-slate-200 mx-1">/</span> Strategic Sourcing 2026
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-5xl md:text-8xl font-serif font-black leading-[0.9] tracking-tighter text-slate-900 mb-10">
                                Global <br />
                                <span className="italic font-light text-slate-400 opacity-40">Sourcing Manual</span>.
                            </h1>
                            <p className="max-w-xl text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
                                Everything you need to know to start sourcing from China and building a profitable business in Accra & beyond.
                            </p>
                        </div>
                        <div className="lg:col-span-4 lg:flex flex-col items-end pb-4 hidden">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center -rotate-12 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <BookOpen className="w-10 h-10 text-white relative z-10" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Block (Editorial Style) */}
                <div className="grid md:grid-cols-4 gap-12 bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 mb-40">
                    {[
                        { label: "Market Size", value: "$2B+" },
                        { label: "Local Handling", value: "7-14 Days*" },
                        { label: "Starting Capital", value: "₵500+" },
                        { label: "Success Rate", value: "98%" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-1 border-l-2 border-slate-200 pl-6 first:border-none">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
                                {stat.label}
                                {stat.label === "Local Handling" && (
                                    <span className="block text-[8px] normal-case font-medium text-slate-400 mt-1 opacity-60">*(After landing in GH)</span>
                                )}
                            </p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* ASYMMETRICAL ROADMAP */}
                <div className="mb-40">
                    <div className="flex flex-col items-center text-center mb-32">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-800 mb-6 underline decoration-emerald-200 decoration-4 underline-offset-8">THE 4-STEP ROADMAP</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter max-w-2xl">From Guangzhou factory to Accra doorstep.</h2>
                    </div>

                    <div className="space-y-4 md:space-y-0">
                        {steps.map((step, i) => (
                            <div 
                                key={i} 
                                className={`flex flex-col ${step.align === 'end' ? 'md:items-end' : 'md:items-start'} mb-16 md:mb-32 group`}
                            >
                                <div className="max-w-2xl relative">
                                    <div className="absolute -top-12 -left-12 lg:-left-20 text-[6rem] lg:text-[10rem] font-sans font-black text-slate-100 select-none opacity-0 group-hover:opacity-100 transition-opacity aria-hidden">
                                        0{i+1}
                                    </div>
                                    <div className={`relative z-10 w-24 h-24 ${step.bg} rounded-[2.5rem] flex items-center justify-center mb-10 border border-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                                        <step.icon className={`w-10 h-10 ${step.color}`} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter underline lg:no-underline decoration-emerald-100 decoration-8 underline-offset-8">{step.title}</h3>
                                    <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed mb-8">{step.desc}</p>
                                    <div className="h-px w-20 bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pro Tips Grid (Editorial Cards) */}
                <div className="grid md:grid-cols-2 gap-12 mb-32">
                    <div className="bg-slate-900 p-12 lg:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="flex items-center gap-3 mb-10">
                            <Globe className="w-5 h-5 text-emerald-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Inventory Secret</h4>
                         </div>
                         <h3 className="text-2xl lg:text-4xl font-serif font-black italic mb-6 leading-tight">Skip Alibaba. <br />Go Factory Direct.</h3>
                         <p className="text-slate-400 font-medium leading-relaxed mb-8">Most Alibaba suppliers are middlemen. Use 1688.com for direct factory prices. We translate the Chinese interface and negotiate the MOQ for you.</p>
                         <Link href="/sourcing" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white border-b border-white pb-2 hover:gap-6 transition-all duration-300">
                             AI Sourcing System <ArrowRight className="w-4 h-4" />
                         </Link>
                    </div>

                    <div className="bg-emerald-50 p-12 lg:p-16 rounded-[4rem] border border-emerald-100 group relative">
                         <div className="flex items-center gap-3 mb-10">
                            <ShieldCheck className="w-5 h-5 text-emerald-700" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700">Risk Mitigation</h4>
                         </div>
                         <h3 className="text-2xl lg:text-4xl font-black mb-6 leading-tight tracking-tighter">Inspect Before <br />Departure.</h3>
                         <p className="text-emerald-900/60 font-medium leading-relaxed mb-8">Never pay for poor quality. We offer high-res photos and physical inspections at our GZ Hub before your items ever touch a plane or ship.</p>
                         <Link href="/customs" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-emerald-700 border-b border-emerald-700 pb-2 hover:gap-6 transition-all duration-300">
                             Customs Knowledge <ArrowRight className="w-4 h-4" />
                         </Link>
                    </div>
                </div>

                {/* Final CTA (Centered Impact) */}
                <div className="text-center py-32 bg-slate-50/50 rounded-[5rem] border border-slate-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/50" />
                    <div className="relative z-10">
                        <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-10" />
                        <h2 className="text-5xl md:text-8xl font-black mb-16 tracking-tighter text-slate-900 leading-[0.9]">Start Your <br />Empire Today.</h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto px-6">
                            <Link href="/register" className="h-20 bg-slate-900 text-white flex items-center justify-center rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex-1">
                                Join Now
                            </Link>
                            <Link href="/sourcing" className="h-20 bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center rounded-[2rem] font-black uppercase tracking-widest text-xs hover:border-slate-300 transition-all flex-1">
                                Sourcing Desk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
