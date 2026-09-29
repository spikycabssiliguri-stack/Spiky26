import { Check, X, ShieldAlert, Award, AlertTriangle, FileText } from 'lucide-react';
import { INCLUSIONS_LIST, EXCLUSIONS_LIST, ROUTE_CHANGE_POLICY } from '../data/packagesData';

export const InclusionsExclusions = () => {
  return (
    <section id="inclusions" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">
            Transparent Pricing Policy
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-neutral-900 mb-4">
            Complete Inclusions & Transparent Terms
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            At Spiky Cabs, we believe in 100% upfront clarity. We are a specialized Cab Package operator—you have full autonomy to select your own hotels while we manage all mountain transport, permits, fuel, and driver allowances.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
          {/* Inclusions Card */}
          <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-200/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-emerald-950">
                  Standard Inclusions
                </h3>
                <span className="text-xs text-emerald-800">
                  Covered in all Spiky Cabs confirmed packages
                </span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-neutral-800">
              {INCLUSIONS_LIST.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions Card */}
          <div className="bg-rose-50/30 border border-rose-200/80 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-200/60">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-rose-950">
                  Standard Exclusions
                </h3>
                <span className="text-xs text-rose-800">
                  Direct client out-of-pocket expenses
                </span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-neutral-800">
              {EXCLUSIONS_LIST.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Change of Route Notice (Word for word from PDF) */}
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 mb-2">
                Himalayan Change of Route & Natural Advisory Policy
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                {ROUTE_CHANGE_POLICY}
              </p>
              <div className="mt-3 text-[11px] text-amber-800">
                Official policy registered by Spiky Cabs Taxi Services · Siliguri, West Bengal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
