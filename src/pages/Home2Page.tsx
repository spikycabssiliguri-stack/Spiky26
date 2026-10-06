import { useState } from 'react';
import { 
  ChevronRight, 
  ArrowRight, 
  Eye, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Sparkles,
  Users,
  Compass,
  Car,
  Building2,
  Star,
  Phone,
  CheckCircle2,
  FileCheck,
  Headphones,
  Award,
  BedDouble,
  Bath,
  Clock
} from 'lucide-react';
import { 
  PACKAGES_DATA, 
  FLEET_DATA, 
  COMPANY_INFO, 
  CabPackage 
} from '../data/packagesData';
import { HOTELS_DATA, RecommendedHotel } from '../data/hotelsData';
import { HotelInquiryModal } from '../components/HotelInquiryModal';
import { useCMS } from '../context/CMSContext';

interface Home2PageProps {
  onViewPackage: (pkg: CabPackage) => void;
  onNavigateContact: () => void;
  onNavigateHotels?: () => void;
  onSelectHotel?: (slug: string) => void;
  onNavigatePackages?: () => void;
}

export const Home2Page = ({ 
  onViewPackage, 
  onNavigateContact, 
  onNavigateHotels, 
  onSelectHotel,
  onNavigatePackages
}: Home2PageProps) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'darjeeling' | 'sikkim' | 'bhutan'>('all');
  const [selectedHotelForModal, setSelectedHotelForModal] = useState<RecommendedHotel | null>(null);
  
  // Interactive Trip Planner State
  const [destination, setDestination] = useState('darjeeling-gangtok');
  const [travelDuration, setTravelDuration] = useState('5D/4N');
  const [travelerCount, setTravelerCount] = useState('4 Pax (Family / Friends)');
  const [hotelStandard, setHotelStandard] = useState('Boutique & 4-Star Premium');
  const [travelMonth, setTravelMonth] = useState('Next Month');

  const { cmsData } = useCMS();
  const packages = cmsData.packages && cmsData.packages.length > 0 ? cmsData.packages : PACKAGES_DATA;
  const settings = cmsData.settings || COMPANY_INFO;

  // Curated showcase hotels with verified photos & restrooms
  const featuredHotels = HOTELS_DATA.filter(h => 
    h.id === 'hotel-taj-chia-kutir' || 
    h.id === 'hotel-summit-swiss-heritage' || 
    h.id === 'hotel-sumi-yashshree-suites-gangtok' ||
    h.id === 'hotel-the-elgin-darjeeling'
  );

  const filteredPackages = packages.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'darjeeling') return pkg.destination === 'darjeeling' || pkg.destination === 'kalimpong';
    if (selectedFilter === 'sikkim') return pkg.destination === 'gangtok' || pkg.destination === 'north-sikkim';
    if (selectedFilter === 'bhutan') return pkg.destination === 'bhutan';
    return true;
  });

  // Dynamic WhatsApp quick quote query generator for planner
  const getCustomPlannerWhatsappUrl = () => {
    const text = encodeURIComponent(
      `Hi Spiky Himalayan Travel Agency,\n\nI would like to get a customized holiday package quote with hotels and private cab:\n` +
      `• Destination Circuit: ${destination.replace('-', ' & ').toUpperCase()}\n` +
      `• Duration: ${travelDuration}\n` +
      `• Travelers: ${travelerCount}\n` +
      `• Hotel Category: ${hotelStandard}\n` +
      `• Travel Window: ${travelMonth}\n\n` +
      `Please share a day-by-day plan with verified hotel options and your best seasonal package price on WhatsApp.`
    );
    return `https://wa.me/${settings.rawPhone}?text=${text}`;
  };

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] font-sans">
      {/* 1. Flagship Travel Agency Hero Stage */}
      <section className="bg-white pt-14 pb-12 sm:pt-20 sm:pb-16 text-center px-4 overflow-hidden border-b border-[#e5e5ea]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Authorized Himalayan Travel Agency · Siliguri · Bagdogra (IXB) & NJP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Complete Himalayan holidays. Crafted by locals.
          </h1>

          <p className="text-lg sm:text-2xl text-[#515154] font-normal max-w-3xl mx-auto pt-1 leading-relaxed text-balance">
            Tailor-made itineraries, handpicked mountain stays with <strong className="text-[#1d1d1f] font-semibold">verified clean ensuite restrooms</strong>, and dedicated private chauffeurs who treat you like family. No middlemen, no rigid bus tours—just pure mountain wonder.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-3 pt-3 flex-wrap text-sm sm:text-base">
            <a
              href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                'Hi Spiky Himalayan Travel Agency, I am planning a holiday in Sikkim & Darjeeling. Please share your custom package options and best seasonal prices on WhatsApp.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 transition-all font-medium inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Check Price</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('trip-planner');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3.5 transition-colors font-medium cursor-pointer shadow-sm"
            >
              Custom Trip Planner
            </button>

            {onNavigateHotels && (
              <button
                onClick={onNavigateHotels}
                className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-6 py-3.5 transition-colors font-medium cursor-pointer shadow-sm inline-flex items-center gap-2 border border-[#d2d2d7]"
              >
                <Building2 className="w-4 h-4 text-[#0071e3]" />
                <span>Hotels & Toilet Photos</span>
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="text-[12px] text-emerald-800 pt-2 font-mono flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Complete Cab + Stay Packages</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Free Sikkim Border Permits (PAP/RAP)</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Transparent Rates on WhatsApp</span>
          </div>
        </div>

        {/* Hero Banner Visual Asset */}
        <div className="max-w-[1180px] mx-auto mt-10 px-2 sm:px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl border border-black/5">
            <img
              src="/images/travel_agency_hero_1791218178760.jpg"
              alt="Himalayan Travel Agency Scenic Journey"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white text-left gap-3">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Himalayan Vacation Specialists
                </span>
                <div className="text-xl sm:text-3xl font-bold tracking-tight">
                  Darjeeling · Gangtok · North Sikkim · Pelling · Kalimpong · Bhutan
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                  Private tourist vehicle, handpicked premium accommodations, sightseeing & permit paperwork handled end-to-end.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                    'Hi Spiky Travels, I would like to plan a complete custom tour package for Darjeeling & Sikkim. Please share rates and day plan.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Value Proposition Stats */}
      <section className="bg-white border-b border-[#e5e5ea] py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] font-mono">1,800+</div>
            <div className="text-xs text-[#86868b] mt-0.5">Trips Planned Smoothly</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] font-mono">100%</div>
            <div className="text-xs text-[#86868b] mt-0.5">Verified Ensuite Stays</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] font-mono">0 Hidden</div>
            <div className="text-xs text-[#86868b] mt-0.5">Costs or Commission Traps</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] font-mono">24 / 7</div>
            <div className="text-xs text-[#86868b] mt-0.5">Local WhatsApp Support</div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Holiday Customizer Widget (Trip Planner) */}
      <section id="trip-planner" className="py-14 sm:py-20 px-4 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Tailor-Made Vacation Estimator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
              Design Your Perfect Himalayan Getaway
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73]">
              Select your vacation preferences below to request an exact day-by-day plan and personalized discount quote directly on WhatsApp.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#e5e5ea] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                  1. Destination Circuit
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="darjeeling-gangtok">Darjeeling & Gangtok (5-6 Days)</option>
                  <option value="north-sikkim-special">North Sikkim, Lachung & Yumthang (5 Days)</option>
                  <option value="darjeeling-mirik">Classic Darjeeling & Mirik (3-4 Days)</option>
                  <option value="pelling-west-sikkim">Pelling & Glass Skywalk Scenic (4 Days)</option>
                  <option value="grand-sikkim-complete">Grand Sikkim: Gangtok + Pelling + North Sikkim (8 Days)</option>
                  <option value="bhutan-cultural">Kingdom of Bhutan Cultural (6 Days)</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                  2. Trip Duration
                </label>
                <select
                  value={travelDuration}
                  onChange={(e) => setTravelDuration(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="3D/2N">3 Days / 2 Nights (Quick Mountain Break)</option>
                  <option value="4D/3N">4 Days / 3 Nights (Standard Long Weekend)</option>
                  <option value="5D/4N">5 Days / 4 Nights (Most Popular Circuit)</option>
                  <option value="6D/5N">6 Days / 5 Nights (Relaxed Explorer)</option>
                  <option value="7D/6N+">7+ Days (Complete In-Depth Circuit)</option>
                </select>
              </div>

              {/* Group Size */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                  3. Travelers / Party Size
                </label>
                <select
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="2 Pax (Honeymoon / Couple)">2 Pax (Honeymoon / Couple · Sedan Cab)</option>
                  <option value="4 Pax (Family / Friends)">4 Pax (Small Family · Sedan / Ertiga)</option>
                  <option value="6-7 Pax (Innova Crysta / SUV)">6-7 Pax (Family Group · Innova Crysta / Scorpio)</option>
                  <option value="8+ Pax (Tempo Traveller / Multi-Cab)">8+ Pax (Large Family · Multi-Car Convoy)</option>
                </select>
              </div>

              {/* Hotel Standard */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                  4. Stay Category (Ensuite Restrooms)
                </label>
                <select
                  value={hotelStandard}
                  onChange={(e) => setHotelStandard(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="Luxury 5-Star & Heritage (Taj / Elgin)">5-Star Luxury & Heritage (Taj Chia Kutir, Elgin)</option>
                  <option value="Boutique & 4-Star Premium">Boutique & 4-Star Mountain View (Summit, Yashshree)</option>
                  <option value="Deluxe 3-Star Comfort">Deluxe 3-Star Comfort (Clean, Heating, Verified)</option>
                  <option value="Cab Only (I Have Already Booked Hotels)">Cab Only (Dedicated Private Chauffeur & Transfers)</option>
                </select>
              </div>

              {/* Travel Window */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                  5. Travel Window
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="This Week (Urgent Booking)">This Week (Urgent Booking)</option>
                  <option value="This Month">This Month</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Summer Season (April - June)">Summer Season (April - June)</option>
                  <option value="Autumn & Winter (October - January)">Autumn & Winter (October - January)</option>
                </select>
              </div>

              {/* WhatsApp Instant Quote Trigger */}
              <div className="flex flex-col justify-end space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  6. Instant Tariff & Itinerary
                </label>
                <a
                  href={getCustomPlannerWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Get Custom Quote on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Inclusions summary strip */}
            <div className="pt-4 border-t border-[#e5e5ea] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6e6e73]">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bagdogra / NJP Pickup Included
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Sikkim Permit Formalities Covered
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  All Fuel & Mountain Driver Allowances
                </span>
              </div>

              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Direct WhatsApp Quote · No Obligation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Complete Holiday Circuits (Packages Catalog) */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-b border-[#e5e5ea]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
                Curated Travel Agency Packages
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mt-1">
                Our Signature Himalayan Circuits
              </h2>
              <p className="text-xs sm:text-sm text-[#6e6e73] mt-1">
                Handcrafted day-by-day itineraries with private car, fuel, driver, and optional hotel accommodation.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-full border border-[#d2d2d7] self-start sm:self-auto text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedFilter === 'all' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                All Circuits
              </button>
              <button
                onClick={() => setSelectedFilter('darjeeling')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedFilter === 'darjeeling' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Darjeeling
              </button>
              <button
                onClick={() => setSelectedFilter('sikkim')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedFilter === 'sikkim' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Sikkim
              </button>
              <button
                onClick={() => setSelectedFilter('bhutan')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedFilter === 'bhutan' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Bhutan
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#d2d2d7] hover:border-[#86868b] transition-all hover:shadow-xl flex flex-col"
              >
                {/* Photo Header */}
                <div 
                  className="relative aspect-[16/10] bg-[#f5f5f7] overflow-hidden cursor-pointer"
                  onClick={() => onViewPackage(pkg)}
                >
                  <img
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    {pkg.badge || `${pkg.durationNights}N / ${pkg.durationDays}D`}
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>Price on WhatsApp</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#0071e3] tracking-wider">
                      <span>{pkg.destination} Tour</span>
                      <span>·</span>
                      <span>{pkg.durationNights}N / {pkg.durationDays}D</span>
                    </div>

                    <h3 
                      onClick={() => onViewPackage(pkg)}
                      className="text-lg font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer leading-snug"
                    >
                      {pkg.title}
                    </h3>

                    <p className="text-xs text-[#86868b] line-clamp-2">
                      {pkg.subtitle}
                    </p>

                    {/* Highlights */}
                    <div className="pt-3 border-t border-[#f5f5f7] space-y-1.5">
                      {pkg.keyHighlights.slice(0, 3).map((hl, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#515154]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#f5f5f7] space-y-2">
                    <button
                      onClick={() => onViewPackage(pkg)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Full Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                        `Hi Spiky Himalayan Travel Agency, I am interested in the ${pkg.title} (${pkg.durationNights}N/${pkg.durationDays}D). Please share the seasonal price quote and hotel options.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Check Price</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all packages banner */}
          {onNavigatePackages && (
            <div className="text-center pt-4">
              <button
                onClick={onNavigatePackages}
                className="px-6 py-3 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-semibold border border-[#d2d2d7] inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Browse All Himalayan Packages Catalog</span>
                <ChevronRight className="w-4 h-4 text-[#0071e3]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Curated Accommodations & Verified Restrooms Showcase */}
      <section className="py-16 sm:py-24 px-4 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                <BedDouble className="w-4 h-4" />
                <span>Zero Dirty Bathrooms Guarantee</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mt-1">
                Handpicked Stays with Verified Toilet Photos
              </h2>
              <p className="text-xs sm:text-sm text-[#6e6e73] mt-1 max-w-2xl">
                We inspect every property in person. See real photos of bedrooms, tea valley views, and sparkling clean ensuite restrooms before booking.
              </p>
            </div>

            {onNavigateHotels && (
              <button
                onClick={onNavigateHotels}
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-semibold transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
              >
                <span>View Full Hotels Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hotels Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredHotels.map((hotel) => (
              <div 
                key={hotel.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#d2d2d7] hover:border-neutral-400 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer group"
                  onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                >
                  <img
                    src={hotel.featuredImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    ★ {hotel.starRating} Star
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Bath className="w-3 h-3" />
                      Ensuite Toilet Verified
                    </span>
                    <span className="text-neutral-300">5 Photos</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">
                      {hotel.brand} · {hotel.destination}
                    </span>
                    <h4 
                      onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                      className="text-sm font-bold text-neutral-900 hover:text-[#0071e3] transition-colors cursor-pointer line-clamp-1"
                    >
                      {hotel.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {hotel.locationAddress}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Tariff on WhatsApp
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Cab Combo Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                        className="w-full py-1.5 px-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold transition-colors text-center cursor-pointer"
                      >
                        5 Photos & Toilet
                      </button>

                      <a
                        href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                          `Hi Spiky Travels, I would like to get hotel tariff and a Cab + Stay Quote for ${hotel.name} in ${hotel.regionLabel}. Please share seasonal rates on WhatsApp.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Check Price</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Book with Spiky Himalayan Travel Agency? */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-[#e5e5ea]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Local Excellence & Accountability
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
              Why Travelers Trust Our Travel Agency
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73]">
              Unlike online travel portals operating out of call centers thousands of miles away, our team is right here in Siliguri and Gangtok.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f5f5f7] p-8 rounded-3xl space-y-3 border border-[#e5e5ea]">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#0071e3]">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">Private Fleet, No Intermediaries</h3>
              <p className="text-xs text-[#515154] leading-relaxed">
                You get polite, non-smoking local mountain drivers who know every turn, landslide workaround, and scenic tea stall. No taxi union hassles.
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-8 rounded-3xl space-y-3 border border-[#e5e5ea]">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-emerald-600">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">Sikkim & Border Permit Experts</h3>
              <p className="text-xs text-[#515154] leading-relaxed">
                Tsomgo Lake, Nathula Pass, and North Sikkim require military & administrative clearances. We submit your documents and arrange passes seamlessly.
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-8 rounded-3xl space-y-3 border border-[#e5e5ea]">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-amber-600">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">Direct WhatsApp Pricing & Concierge</h3>
              <p className="text-xs text-[#515154] leading-relaxed">
                Receive honest, real-time quotes without hidden platform markups. We stay connected with you 24/7 on WhatsApp from airport pickup to drop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Easy 4-Step Booking Process */}
      <section className="py-14 sm:py-20 px-4 bg-[#f5f5f7] border-t border-[#e5e5ea]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
              How Planning with Us Works
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73]">
              Simple, transparent, and completely personalized to your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-sm text-[#1d1d1f]">Say Hello on WhatsApp</h4>
              <p className="text-xs text-[#6e6e73]">
                Share your dates, flight timing, and group size with our hill specialist.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-sm text-[#1d1d1f]">Custom Itinerary & Tariff</h4>
              <p className="text-xs text-[#6e6e73]">
                We send a clear day-by-day plan with verified hotel options and best rate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-sm text-[#1d1d1f]">Permit Paperwork Done</h4>
              <p className="text-xs text-[#6e6e73]">
                Send ID copies over WhatsApp for protected border permits arrangement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="font-bold text-sm text-[#1d1d1f]">Arrive & Enjoy</h4>
              <p className="text-xs text-[#6e6e73]">
                Your dedicated driver meets you at Bagdogra or NJP with your name placard.
              </p>
            </div>
          </div>

          {/* Central Call to Action */}
          <div className="p-8 rounded-3xl bg-neutral-900 text-white text-center space-y-4 max-w-3xl mx-auto shadow-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Start Your Mountain Adventure
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready for Fresh Mountain Air & Kanchenjunga Sunrises?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
              Our travel specialists are online right now to craft your itinerary and offer transparent seasonal pricing.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <a
                href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                  'Hi Spiky Himalayan Travels, I would like to check prices and plan my vacation in Darjeeling and Sikkim. Please assist me on WhatsApp.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Check Price</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {settings.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <HotelInquiryModal
        hotel={selectedHotelForModal}
        isOpen={Boolean(selectedHotelForModal)}
        onClose={() => setSelectedHotelForModal(null)}
      />
    </div>
  );
};
