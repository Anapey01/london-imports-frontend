import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400; // 24 hours static edge caching

export const metadata: Metadata = {
  title: "Reseller Agent Program | London's Imports",
  description: "Become a WAEC results checker reseller agent. Share your link and earn commissions on every purchase.",
};

export default function AgentAboutPage() {
  return (
    <div className="min-h-screen bg-transparent py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans text-content-primary">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 border-b border-black pb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 uppercase">
            Reseller Agent Program
          </h1>
          <p className="text-content-secondary font-mono text-[10px] tracking-widest uppercase">
            London's Imports Results Checker Reseller Partnership
          </p>
        </div>

        {/* Section: Overview */}
        <div className="space-y-6 mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 pb-2 text-content-secondary">
            01 / Program Overview
          </h2>
          <p className="text-md text-content-secondary leading-relaxed font-serif text-lg italic border-l-2 border-black pl-4">
            "An agent is simply someone who decides to have a link to share and earn commission when someone makes a purchase using their link. That is the whole idea."
          </p>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-normal">
            There is no upfront capital required, no stock to manage, and no registration fee. You register for a free account, receive a unique micro-store link, customize your retail price, and share it. When someone purchases a BECE or WASSCE results checker using your link, we instantly handle the code delivery and credit the commission to your wallet.
          </p>
        </div>

        {/* Section: What an Agent is / is not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-slate-200">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-wider border-b border-slate-200 pb-2 text-content-secondary">
              What an Agent Is
            </h3>
            <ul className="text-xs text-content-secondary space-y-2 list-none pl-0 leading-relaxed font-mono">
              <li>• A partner sharing their unique link to earn money.</li>
              <li>• An independent reseller setting their own retail markups.</li>
              <li>• A dashboard manager tracking sales and requesting MoMo payouts.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-wider border-b border-slate-200 pb-2 text-content-secondary">
              What an Agent Is Not
            </h3>
            <ul className="text-xs text-content-secondary space-y-2 list-none pl-0 leading-relaxed font-mono">
              <li>• An employee or representative of London's Imports.</li>
              <li>• Required to invest capital or buy vouchers in advance.</li>
              <li>• Responsible for customer support or delivery logistics.</li>
            </ul>
          </div>
        </div>

        {/* Section: Terms */}
        <div className="space-y-6 mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 pb-2 text-content-secondary">
            02 / Financial Terms & Payouts
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-black p-6 bg-white">
              <span className="text-[9px] font-mono uppercase tracking-widest text-content-secondary block mb-1">
                Wholesale Platform Cost
              </span>
              <span className="text-3xl font-black block text-content-primary">
                GH₵ 16.50
              </span>
              <p className="text-[11px] text-content-secondary leading-relaxed mt-3 uppercase tracking-wide">
                Both BECE and WASSCE checkers are supplied at GH₵ 16.50. You keep everything you charge above this price.
              </p>
            </div>

            <div className="border border-black p-6 bg-white">
              <span className="text-[9px] font-mono uppercase tracking-widest text-content-secondary block mb-1">
                Withdrawal Threshold
              </span>
              <span className="text-3xl font-black block text-content-primary">
                GH₵ 100.00
              </span>
              <p className="text-[11px] text-content-secondary leading-relaxed mt-3 uppercase tracking-wide">
                Earnings of GH₵ 100.00 or more can be requested to Mobile Money (MTN, Telecel, AT) at any time.
              </p>
            </div>
          </div>

          <div className="border-l-2 border-black pl-4 py-1 text-xs text-content-secondary leading-relaxed">
            <span className="font-bold text-content-primary uppercase tracking-wider block mb-1">
              Note on smaller balances:
            </span>
            If your accumulated commission is under GH₵ 100.00, your funds are fully accessible. You can request a payout of any smaller balance starting exactly 1 week after the checker sales cycle ends.
          </div>
        </div>

        {/* Section: FAQ */}
        <div className="space-y-6 mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 pb-2 text-content-secondary">
            03 / Frequently Asked Questions
          </h2>
          
          <div className="space-y-6 divide-y divide-slate-200">
            <div className="pt-4 first:pt-0">
              <h3 className="text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">How do I earn commission?</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                When you sign up, you get a custom store link. You set your custom price (e.g. GH₵ 17.50). When someone uses your link to buy a checker, they pay your custom price. We automatically deduct the GH₵ 16.50 wholesale price, deliver the code, and credit the GH₵ 1.00 profit into your wallet instantly.
              </p>
            </div>
            <div className="pt-4">
              <h3 className="text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">Do I need to buy checkers upfront?</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                No. You do not purchase results checkers in advance. Checkers are pulled automatically from the platform stock only when a customer pays via your link.
              </p>
            </div>
            <div className="pt-4">
              <h3 className="text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">Is there any registration fee?</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                No, joining the program is completely free. There are no startup costs, hidden fees, or subscriptions.
              </p>
            </div>
            <div className="pt-4">
              <h3 className="text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">Who handles customer support?</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Our team does. We handle all voucher deliveries, transaction disputes, and technical support. Your only task is sharing your link.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 border-t border-black pt-8">
          <Link
            href="/checker/agent/register"
            className="flex-1 bg-black text-white py-4 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all text-center cursor-pointer font-mono"
          >
            Create Free Account
          </Link>
          <Link
            href="/checker/agent/login"
            className="flex-1 border border-black text-black py-4 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all text-center cursor-pointer font-mono"
          >
            Agent Portal Sign In
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/checker" className="text-xs font-bold text-content-secondary uppercase tracking-widest hover:text-black transition-colors font-mono">
            ← Back to Checker Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
