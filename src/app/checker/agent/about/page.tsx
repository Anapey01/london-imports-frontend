import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Reseller Agent Program | London's Imports",
  description: "Become a WAEC results checker reseller agent. Partner with us, resell WASSCE & BECE checkers at wholesale prices (GHS 16.50), set your own price, and withdraw your commissions anytime.",
};

export default function AgentAboutPage() {
  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative font-sans">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-content-primary mb-2 tracking-tight">
            Reseller Agent Program
          </h1>
          <p className="text-content-secondary font-normal text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
            Partner with London's Imports to sell results checkers
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-surface border border-border-standard rounded-none p-6 sm:p-10 shadow-diffusion-md space-y-8">
          
          {/* Section 1: Overview */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-content-primary uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
              Program Overview
            </h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              We offer school owners, internet café operators, student leaders, and independent resellers the opportunity to buy WAEC Results Checkers (BECE & WASSCE) at wholesale rates and sell them directly to their clients, students, or community members for profit.
            </p>
          </div>

          {/* Section 2: What is/is not */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-emerald">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary">
                  What an Agent Is
                </h3>
              </div>
              <ul className="text-xs text-content-secondary space-y-2 list-disc pl-4 leading-relaxed">
                <li>An independent reseller buying results checkers at a discount.</li>
                <li>A partner using their custom store URL to brand their business.</li>
                <li>An entrepreneur setting their own profit margins and prices.</li>
                <li>A manager tracking their sales, earnings, and MoMo payouts.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xs font-black uppercase tracking-wider text-content-primary">
                  What an Agent Is Not
                </h3>
              </div>
              <ul className="text-xs text-content-secondary space-y-2 list-disc pl-4 leading-relaxed">
                <li>An employee or legal representative of London's Imports.</li>
                <li>Entitled to fixed salaries, wages, or employment benefits.</li>
                <li>Authorized to collect funds outside of our secure payment portal.</li>
                <li>A credit buyer (all checkers are paid for instantly at checkout).</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Financial Terms */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-content-primary uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
              Financial Terms & Rules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-content-secondary uppercase tracking-widest mb-1">
                    Wholesale Checker Rate
                  </h4>
                  <p className="text-2xl font-black text-brand-emerald">
                    GH₵ 16.50
                  </p>
                </div>
                <p className="text-[10px] text-content-secondary leading-relaxed mt-2 uppercase tracking-wide">
                  Standard retail is GH₵ 17.00. You buy at GH₵ 16.50, keep the markup difference!
                </p>
              </div>

              <div className="border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-content-secondary uppercase tracking-widest mb-1">
                    Withdrawal Limit
                  </h4>
                  <p className="text-2xl font-black text-content-primary">
                    GH₵ 100.00
                  </p>
                </div>
                <p className="text-[10px] text-content-secondary leading-relaxed mt-2 uppercase tracking-wide">
                  Withdraw accumulated earnings to your MoMo account at any time!
                </p>
              </div>

            </div>

            {/* Note on Smaller balances */}
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 text-xs text-content-secondary leading-relaxed">
              <span className="font-bold text-content-primary uppercase tracking-wider block mb-1">
                Notice Regarding Smaller Balances:
              </span>
              If your total commission is less than <strong>GH₵ 100.00</strong>, you are not locked out of your money! You will be allowed to withdraw any smaller amount starting exactly <strong>1 week after the checker sales cycle officially ends</strong> (which is typically one week after the release window closes).
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
            <Link
              href="/checker/agent/register"
              className="flex-1 bg-content-primary text-surface py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-emerald hover:text-white transition-all duration-200 text-center cursor-pointer"
            >
              Sign Up As Reseller
            </Link>
            <Link
              href="/checker/agent/login"
              className="flex-1 border border-content-primary text-content-primary py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-[0.2em] hover:bg-content-primary hover:text-surface transition-all duration-200 text-center cursor-pointer"
            >
              Log In to Portal
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/checker" className="text-xs font-bold text-content-secondary uppercase tracking-widest hover:text-brand-emerald transition-colors">
            ← Back to Checker Center
          </Link>
        </div>
      </div>
    </div>
  );
}
