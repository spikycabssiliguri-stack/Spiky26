import { useState } from 'react';
import { ShieldCheck, MapPin, Calendar, Compass, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/packagesData';

interface HeroProps {
  onSelectDestination: (dest: string) => void;
  onOpenChecklist: () => void;
}

export const Hero = ({ onSelectDestination, onOpenChecklist }: HeroProps) => {
  const [selectedDest, setSelectedDest] = useState('all');
  const [pickupPoint, setPickupPoint] = useState('IXB');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectDestination(selectedDest);
    const target = document.getElementById('packages');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background Image with Optical Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_himalayan_cab_1790679944443.jpg"
          alt="Spiky Cabs driving along Himalayan mountain route with Kanchenjunga backdrop"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/75 to-neutral-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          {/* Natural human editorial kicker - no mechanical code comments */}
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 tracking-wider uppercase mb-3">
            <span>Specialized Himalayan Cab Packages</span>
            <span aria-hidden="true">·</span>
            <span>Darjeeling · Sikkim · Kalimpong · Bhutan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white max-w-2xl mb-5">
            Your Mountain Journey, Driven by Local Hill Experts.
          </h1>

          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl mb-8 font-normal">
            Spiky Cabs delivers dedicated tourist cab packages across the Eastern Himalayas. We specialize exclusively in cab travel—transparent point-to-point itineraries, fuel & interstate permits included, with pick-up right from Bagdogra Airport (IXB) & NJP Railway Station.
          </p>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-600/30"
            >
              <span>Browse Cab Packages</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20planning%20a%20trip%20to%20Darjeeling%2FSikkim.%20Please%20share%20cab%20package%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm text-sm font-medium rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Quote</span>
            </a>

            <button
              onClick={onOpenChecklist}
              className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 px-2 py-1 transition-colors"
            >
              Owner Checklist & Info Requests
            </button>
          </div>

          {/* Quick Package Search Box */}
          <div className="bg-neutral-900/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>Destination Sector</span>
                </label>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="all">All Packages</option>
                  <option value="darjeeling">Darjeeling (2N/3D & 4N/5D)</option>
                  <option value="gangtok">Gangtok & Changu Lake (3N/4D)</option>
                  <option value="north-sikkim">North Sikkim (4N/5D Lachung & Yumthang)</option>
                  <option value="kalimpong">Kalimpong (2N/3D)</option>
                  <option value="bhutan">Bhutan Western Valley (5N/6D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>Pickup Location</span>
                </label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="IXB">Bagdogra Airport (IXB)</option>
                  <option value="NJP">New Jalpaiguri Station (NJP)</option>
                  <option value="Siliguri">Siliguri Town / Junction</option>
                  <option value="Gangtok">Gangtok City Hotel</option>
                  <option value="Hasimara">Hasimara / Phuentsholing Border</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors h-10 shadow-sm"
                >
                  <span>Find Cab Itineraries</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Social Proof & Value Props */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-orange-400 font-bold text-sm">100% Dedicated</div>
              <div className="text-neutral-400">Cab-Only Packages</div>
            </div>
            <div>
              <div className="text-orange-400 font-bold text-sm">All Permits Handled</div>
              <div className="text-neutral-400">Sikkim & Bhutan PAP</div>
            </div>
            <div>
              <div className="text-orange-400 font-bold text-sm">Verified Drivers</div>
              <div className="text-neutral-400">Himalayan Route Pros</div>
            </div>
            <div>
              <div className="text-orange-400 font-bold text-sm">Offer Till Apr 2027</div>
              <div className="text-neutral-400">Guaranteed Validity</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
