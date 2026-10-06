import { Users, Briefcase, Shield, Check, MessageCircle } from 'lucide-react';
import { FLEET_DATA, COMPANY_INFO } from '../data/packagesData';

export const FleetSection = () => {
  return (
    <section id="fleet" className="py-16 md:py-24 bg-neutral-50 border-t border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-[#0071e3] tracking-wider uppercase mb-2">
            Sanitized & Mountain-Ready Fleet
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-neutral-900 mb-4">
            Vehicles Built for Himalayan Mountain Curves
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            Hairpin bends, steep inclines, and sudden cloudbursts require more than just four wheels. Every Spiky Cabs car comes thoroughly pre-serviced with mountain brakes, high-traction tires, pristine sanitized cabins, and a driver who has navigated these valleys since childhood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLEET_DATA.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-[#0071e3] transition-all flex flex-col shadow-xs hover:shadow-md group"
            >
              {/* Image slot with resilient fallback */}
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={fleet.image}
                  alt={fleet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-xs text-white flex items-center justify-between">
                  <span className="font-semibold text-sky-300 drop-shadow-sm">{fleet.category}</span>
                  <span className="text-[11px] font-semibold drop-shadow-sm bg-emerald-700/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-white" />
                    <span>Price on WhatsApp</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2 group-hover:text-[#0071e3] transition-colors">
                  {fleet.name}
                </h3>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-4 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{fleet.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{fleet.luggage}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-4 text-xs text-neutral-700 flex-1">
                  {fleet.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Routes */}
                <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 mb-4">
                  <span className="font-semibold text-neutral-700">Best for: </span>
                  <span>{fleet.idealRoutes.join(', ')}</span>
                </div>

                {/* Book this vehicle button */}
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs, I would like to check prices and rent the ${fleet.name} (${fleet.category}). Please share current daily tariffs.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
