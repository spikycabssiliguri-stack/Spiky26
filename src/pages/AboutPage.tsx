import { Shield, MapPin, Award, CheckCircle2, Phone, MessageCircle, HeartHandshake, Compass, ChevronRight, Building2, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/packagesData';

interface AboutPageProps {
  onNavigateContact: () => void;
  onNavigatePackages: () => void;
  onNavigateHotels?: () => void;
}

export const AboutPage = ({ onNavigateContact, onNavigatePackages, onNavigateHotels }: AboutPageProps) => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      {/* Apple Keynote Stage Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            About Spiky Cabs
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Dedicated to the Journey.
          </h1>
          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed text-balance pt-2">
            We provide specialized tourist cab packages for Darjeeling, Sikkim, Kalimpong & Bhutan. Without the clutter of forced hotel markups.
          </p>
        </div>
      </section>

      {/* Philosophy (Apple Story Card) */}
      <section className="py-16 sm:py-24 max-w-[1080px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#e5e5ea] space-y-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider">
              The Pure Cab Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Why We Only Provide Cab Packages.
            </h2>
            <p className="text-base sm:text-lg text-[#6e6e73] font-normal leading-relaxed pt-2">
              For decades, hill tourism forced travelers into rigid bundled packages: an inflexible hotel room, fixed buffets, and a shared or rushed taxi.
            </p>
            <p className="text-sm sm:text-base text-[#6e6e73] font-normal leading-relaxed">
              At <strong className="text-[#1d1d1f] font-semibold">Spiky Cabs</strong>, based at Himachal Sarani, Siliguri, we built a modern alternative. You pick your own accommodations—from a colonial tea estate in Darjeeling to a boutique hotel overlooking Kanchenjunga or an authentic homestay in Lachung—while we take care of the entire road journey.
            </p>
          </div>

          {/* Visual Asset */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-100 border border-[#e5e5ea]">
            <img
              src="/images/hero_himalayan_cab_1790679944443.jpg"
              alt="Himalayan highway route"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white">
              <span>Siliguri · Kurseong · Gangtok · North Sikkim Highway</span>
              <span className="font-mono">Local Mountain Chauffeurs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Commitments (Apple 3-Tile Row) */}
      <section className="py-12 sm:py-16 max-w-[1080px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
            Standard of Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
            Our Commitments.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-3">
            <span className="text-xs font-mono font-semibold text-[#0071e3]">01</span>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              Punctual Gateway Sync
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              We monitor flight schedules at Bagdogra Airport (IXB) and train arrivals at NJP. Your private cab is parked and ready the moment you exit the terminal.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-3">
            <span className="text-xs font-mono font-semibold text-[#0071e3]">02</span>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              Native Mountain Drivers
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              Hairpin bends, mountain fogs, and high passes (15,300 ft Zero Point) require specialized hill drivers with verified records and calm demeanor.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-3">
            <span className="text-xs font-mono font-semibold text-[#0071e3]">03</span>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              Transparent Pricing
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              Every confirmed package voucher includes fuel for the agreed route, interstate road taxes, and driver stay/food allowances. Zero hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* Hotel & Resort Partner Network Section */}
      <section className="py-12 sm:py-16 max-w-[1080px] mx-auto px-4 sm:px-6">
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Hospitality Transfers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Trusted Transfers to the Region’s Finest Resorts
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We provide verified, seamless chauffeur connections to <strong>Summit Hotels & Resorts</strong>, <strong>Sumi Yashshree</strong>, the 5-star <strong>Taj Chia Kutir</strong> in Makaibari, and <strong>Rare Himalayas</strong> heritage properties across Darjeeling, Gangtok, Pelling, and Lachung.
              </p>
            </div>

            {onNavigateHotels && (
              <button
                onClick={onNavigateHotels}
                className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0 inline-flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>View Recommended Hotels</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Headquarters & Call to Action (Apple Style) */}
      <section className="py-16 sm:py-24 bg-white border-t border-[#e5e5ea]">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6">
          <div className="bg-[#f5f5f7] rounded-3xl p-8 sm:p-12 border border-[#e5e5ea] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-lg">
              <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">
                Siliguri Desk
              </span>
              <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                Spiky Cabs Taxi Services
              </h3>
              <p className="text-sm text-[#6e6e73]">
                {COMPANY_INFO.address}
              </p>
              <div className="text-xs text-[#86868b] pt-1">
                Phone: <strong className="text-[#1d1d1f] font-mono">{COMPANY_INFO.phone}</strong> · Email: <strong className="text-[#1d1d1f]">{COMPANY_INFO.email}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={onNavigatePackages}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs sm:text-sm font-normal transition-colors cursor-pointer"
              >
                Browse Packages
              </button>

              <button
                onClick={onNavigateContact}
                className="rounded-full bg-white hover:bg-neutral-100 text-[#1d1d1f] border border-[#d2d2d7] px-5 py-2.5 text-xs sm:text-sm font-normal transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
