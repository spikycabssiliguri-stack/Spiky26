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
  Star
} from 'lucide-react';
import { 
  PACKAGES_DATA, 
  FLEET_DATA, 
  INCLUSIONS_LIST, 
  EXCLUSIONS_LIST, 
  ROUTE_CHANGE_POLICY,
  COMPANY_INFO, 
  CabPackage 
} from '../data/packagesData';
import { HOTELS_DATA, RecommendedHotel } from '../data/hotelsData';
import { HotelInquiryModal } from '../components/HotelInquiryModal';
import { useCMS } from '../context/CMSContext';

interface HomePageProps {
  onViewPackage: (pkg: CabPackage) => void;
  onNavigateContact: () => void;
  onNavigateHotels?: () => void;
  onSelectHotel?: (slug: string) => void;
}

export const HomePage = ({ onViewPackage, onNavigateContact, onNavigateHotels, onSelectHotel }: HomePageProps) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'darjeeling' | 'sikkim' | 'bhutan'>('all');
  const [selectedHotelForModal, setSelectedHotelForModal] = useState<RecommendedHotel | null>(null);
  const { cmsData } = useCMS();

  const packages = cmsData.packages && cmsData.packages.length > 0 ? cmsData.packages : PACKAGES_DATA;
  const settings = cmsData.settings || COMPANY_INFO;

  // Selected top featured hotels for Home Page showcase
  const homeFeaturedHotels = HOTELS_DATA.filter(h => 
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

  const darjeelingPackage = packages.find((p) => p.id === 'darjeeling-2n-3d') || packages[0];
  const gangtokPackage = packages.find((p) => p.id === 'gangtok-3n-4d') || packages[1] || packages[0];
  const northSikkimPackage = packages.find((p) => p.id === 'north-sikkim-4n-5d') || packages[2] || packages[0];
  const pellingPackage = packages.find((p) => p.id === 'pelling-3n-4d') || packages[3] || packages[0];
  const bhutanPackage = packages.find((p) => p.id === 'bhutan-5n-6d') || packages[4] || packages[0];

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f]">
      {/* 1. Flagship Hero Stage */}
      <section className="bg-white pt-16 pb-12 sm:pt-24 sm:pb-20 text-center px-4 overflow-hidden border-b border-[#e5e5ea]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Born & Raised in the Hills · Bagdogra (IXB) & NJP Station</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            The Himalayas, driven with love.
          </h1>

          <p className="text-lg sm:text-2xl text-[#515154] font-normal max-w-3xl mx-auto pt-1 leading-relaxed text-balance">
            Ever stepped off the train at NJP at 6:00 AM into the cool morning fog, only to be swarmed by 20 shouting taxi agents? <strong className="text-[#1d1d1f] font-semibold">Take a deep breath.</strong> With Spiky Cabs, your polite hill driver is already waiting by the gate with your name card, a clean pine-scented cab, and a warm smile: <em>"Namaste! Chai pi li? Chalo, pahad bula rahe hain!"</em>
          </p>

          <div className="flex items-center justify-center gap-4 pt-3 flex-wrap text-sm sm:text-base">
            <button
              onClick={() => {
                const el = document.getElementById('itineraries-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-7 py-3.5 transition-colors font-medium cursor-pointer shadow-sm"
            >
              See All 4 Signature Circuits
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs!%20We%20are%20planning%20a%20mountain%20holiday%20and%20would%20love%20to%20know%20cab%20rates.`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 transition-colors font-medium inline-flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Us on WhatsApp (Friendly Hill Locals)</span>
            </a>

            {onNavigateHotels && (
              <button
                onClick={onNavigateHotels}
                className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-6 py-3.5 transition-colors font-medium cursor-pointer shadow-sm inline-flex items-center gap-2 border border-[#d2d2d7]"
              >
                <Building2 className="w-4 h-4 text-[#0071e3]" />
                <span>Recommended Hotels</span>
              </button>
            )}
          </div>

          <div className="text-[12px] text-emerald-800 pt-2 font-mono flex items-center justify-center gap-3 flex-wrap">
            <span>✓ 100% Dedicated Private Cabs</span>
            <span>·</span>
            <span>✓ Zero Shady Hotel Traps</span>
            <span>·</span>
            <span>✓ Complete Fuel, Driver Allowance & Sikkim Permits Included</span>
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="max-w-[1180px] mx-auto mt-10 px-2 sm:px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-100 shadow-xl border border-black/5">
            <img
              src="/images/hero_himalayan_cab_1790679944443.jpg"
              alt="Spiky Cabs mountain route with Mount Kanchenjunga"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/darjeeling_tea_mirik_1790680004464.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white text-left gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-sky-300 font-medium">Eastern Himalayan Corridors</span>
                <div className="text-lg sm:text-2xl font-semibold">Siliguri · Darjeeling · Gangtok · North Sikkim · Pelling</div>
              </div>
              <div className="text-xs text-neutral-200">
                Punctual, smiling pickups at Bagdogra (IXB) & New Jalpaiguri (NJP)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. North Sikkim Highlight Stage */}
      <section className="bg-[#161617] text-white pt-20 pb-16 sm:pt-28 sm:pb-24 text-center px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-[12px] sm:text-[13px] font-semibold text-sky-400 tracking-wider uppercase">
            High Altitude Alpine Odyssey · 4 Nights | 5 Days
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight text-balance">
            North Sikkim. Real snow, wild waterfalls, and hot momos.
          </h2>

          <p className="text-base sm:text-xl text-[#a1a1a6] font-normal max-w-2xl mx-auto leading-relaxed text-balance">
            Where the roads turn into pure adventure. Sleep in fairytale wooden cottages in Lachung, warm your hands in Yumthang’s medicinal hot springs, and play in thick snow at 15,300 ft Zero Point & Mt. Katao.
          </p>

          <div className="flex items-center justify-center gap-4 pt-3 flex-wrap text-sm sm:text-base">
            <button
              onClick={() => onViewPackage(northSikkimPackage)}
              className="rounded-full bg-white hover:bg-neutral-200 text-[#161617] px-6 py-2.5 transition-colors font-medium cursor-pointer"
            >
              View Full 5-Day Plan
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs!%20I%20am%20interested%20in%20the%20North%20Sikkim%204N%2F5D%20package.%20Please%20share%20the%20best%20discounted%20rates.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2997ff] hover:underline inline-flex items-center font-semibold"
            >
              <MessageCircle className="w-4 h-4 mr-1 text-emerald-400" />
              <span>Check Price</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>

          <div className="text-xs text-[#a1a1a6] pt-1">
            Dedicated 4x4 Mountain SUV | Optional Excursions: Mt. Katao & Zero Point | All Army permits arranged by our Siliguri desk
          </div>
        </div>

        {/* Cinematic Stage Graphic */}
        <div className="max-w-[1080px] mx-auto mt-10 px-2 sm:px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
            <img
              src="/images/north_sikkim_yumthang_1790679981868.jpg"
              alt="Yumthang Valley North Sikkim"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-neutral-300 text-left">
              <span>Yumthang Valley of Flowers (11,693 ft) & Zero Point (15,300 ft)</span>
              <span className="font-mono text-sky-400">6-Seater High Clearance SUV Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Bento Product Grid with Exact Updated Packages */}
      <section id="itineraries-section" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <span>Guaranteed Fixed Tariffs · Valid till April 2027</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            Four Handcrafted Mountain Circuits
          </h2>
          <p className="text-xs sm:text-sm text-[#515154] max-w-xl mx-auto mt-2 leading-relaxed">
            No surprise surcharges or mid-route negotiations. Dedicated private car, certified local hill chauffeur, complete fuel, and route permits included.
          </p>
        </div>

        {/* 2-Column Side-by-Side Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* Card 1: Darjeeling Classic 2N/3D */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-8 sm:pt-10 px-6 sm:px-8 group hover:shadow-lg hover:border-[#0071e3] transition-all">
            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                Weekend Favorite · 2 Nights | 3 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Darjeeling Classic
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] font-normal leading-relaxed">
                Golden 4:00 AM Tiger Hill sunrise over Mt. Kanchenjunga, Ghoom Monastery, the heritage Toy Train spiral at Batasia Loop, hot pastries at Glenary's on Mall Road, and a scenic drive home past Mirik’s tea hills and the Nepal border.
              </p>
              
              <div className="pt-2 pb-1">
                <div className="inline-flex items-center gap-3 bg-[#f5f5f7] px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">VEHICLE OPTIONS</span>
                    <strong className="text-xs font-semibold text-neutral-800">4-Seater Sedan & 6-Seater SUV</strong>
                  </div>
                  <div className="w-px h-7 bg-neutral-300"></div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">CAB TARIFF</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Best Price on WhatsApp</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium pt-1.5 flex items-center justify-center gap-1">
                  <span>✓ Private Cab</span>
                  <span>·</span>
                  <span>Driver Allowance & Fuel Included</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(darjeelingPackage)}
                  className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Day-by-Day Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs! I would like to check prices and book the Darjeeling 2N/3D package. Please share current seasonal rates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 font-medium shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/images/darjeeling_tea_mirik_1790680004464.jpg"
                alt="Darjeeling tea gardens and Mirik"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Gangtok & Changu Lake 3N/4D */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-8 sm:pt-10 px-6 sm:px-8 group hover:shadow-lg hover:border-[#0071e3] transition-all">
            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                East Sikkim Bestseller · 3 Nights | 4 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Gangtok & Changu Lake
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] font-normal leading-relaxed">
                Drive along the turquoise Teesta river to vehicle-free MG Marg, climb above the clouds to 12,310 ft glacial Tsomgo (Changu) Lake & Baba Mandir, and take aerial cable car ropeway rides with waterfalls.
              </p>
              
              <div className="pt-2 pb-1 space-y-1.5">
                <div className="inline-flex items-center gap-3 bg-[#f5f5f7] px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">VEHICLE OPTIONS</span>
                    <strong className="text-xs font-semibold text-neutral-800">4-Seater Sedan & 6-Seater SUV</strong>
                  </div>
                  <div className="w-px h-7 bg-neutral-300"></div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">CAB TARIFF</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Best Price on WhatsApp</span>
                    </span>
                  </div>
                </div>
                <div className="inline-block text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                  ✦ Nathula Pass Permit Assistance Included
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(gangtokPackage)}
                  className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Day-by-Day Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs! I would like to check prices and book the Gangtok 3N/4D package. Please share current seasonal rates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 font-medium shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/images/gangtok_city_view_1790684782649.jpg"
                alt="Gangtok city viewpoint"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 3: North Sikkim 4N/5D */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-8 sm:pt-10 px-6 sm:px-8 group hover:shadow-lg hover:border-[#0071e3] transition-all">
            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                High Snow & Alpine Flowers · 4 Nights | 5 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                North Sikkim Alpine Odyssey
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] font-normal leading-relaxed">
                Fairytale pine hamlet of Lachung, roaring Bhim Nala cascades, wild blooming Yumthang Valley, hot sulfur springs, and optional snow play at Zero Point (15,300 ft) & Mt. Katao.
              </p>
              
              <div className="pt-2 pb-1 space-y-1.5">
                <div className="inline-flex items-center gap-3 bg-[#f5f5f7] px-5 py-2.5 rounded-2xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">VEHICLE CLASS</span>
                    <strong className="text-xs font-semibold text-neutral-800">Dedicated 4x4 Mountain SUV</strong>
                  </div>
                  <div className="w-px h-7 bg-neutral-300"></div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">CAB TARIFF</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Best Price on WhatsApp</span>
                    </span>
                  </div>
                </div>
                <div className="inline-block text-[11px] text-sky-800 bg-sky-50 px-3 py-1 rounded-full font-medium">
                  ✦ Optional Excursion: Mt. Katao & Zero Point (15,300 ft Snow)
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(northSikkimPackage)}
                  className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Day-by-Day Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs! I would like to check prices and book the North Sikkim 4N/5D package. Please share current seasonal rates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 font-medium shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/images/north_sikkim_yumthang_1790679981868.jpg"
                alt="North Sikkim alpine valleys"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 4: Pelling 3N/4D */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-8 sm:pt-10 px-6 sm:px-8 group hover:shadow-lg hover:border-[#0071e3] transition-all">
            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                West Sikkim Majesty · 3 Nights | 4 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Pelling & Glass Skywalk
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] font-normal leading-relaxed">
                Close-up Mount Kanchenjunga panoramas, India’s first Glass Skywalk beneath the golden Chenrezig statue, sacred wishing lake Khecheopalri, 17th-century Rabdentse royal ruins, and waterfalls.
              </p>
              
              <div className="pt-2 pb-1">
                <div className="inline-flex items-center gap-3 bg-[#f5f5f7] px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">VEHICLE OPTIONS</span>
                    <strong className="text-xs font-semibold text-neutral-800">4-Seater Sedan & 6-Seater SUV</strong>
                  </div>
                  <div className="w-px h-7 bg-neutral-300"></div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] font-medium">CAB TARIFF</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Best Price on WhatsApp</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium pt-1.5 flex items-center justify-center gap-1">
                  <span>✓ Private Cab</span>
                  <span>·</span>
                  <span>Complete Fuel & Certified Driver Included</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(pellingPackage)}
                  className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Day-by-Day Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs! I would like to check prices and book the Pelling 3N/4D package. Please share current seasonal rates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 font-medium shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/images/pelling_skywalk_sikkim_1790684762658.jpg"
                alt="Pelling Glass Skywalk Sikkim"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3b. Curated Himalayan Stays & Cab Combos Showcase */}
      <section className="py-14 sm:py-20 bg-neutral-900 text-white px-4 sm:px-6 overflow-hidden">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Middlemen Markups · Verified Mountain Stays</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Recommended Stays & Resort Combos
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We partner with <strong>Summit Hotels</strong>, <strong>Sumi Yashshree</strong>, the iconic <strong>Taj Chia Kutir</strong>, and <strong>Rare Himalayas</strong> heritage estates across Darjeeling & Sikkim. Combine your stay with dedicated private chauffeur transfers from IXB Airport or NJP Station.
              </p>
            </div>

            {onNavigateHotels && (
              <button
                onClick={onNavigateHotels}
                className="rounded-full bg-white hover:bg-neutral-100 text-neutral-950 px-6 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 inline-flex items-center gap-2"
              >
                <span>View All Recommended Hotels</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 4-Card Hotel Spotlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {homeFeaturedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/60 transition-all flex flex-col justify-between"
              >
                <div 
                  onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                  className="relative aspect-[16/10] bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={hotel.featuredImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold">
                    {hotel.brand}
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 text-neutral-900 text-[10px] font-bold flex items-center gap-1 font-mono">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{hotel.starRating}</span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 text-[11px] text-neutral-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{hotel.regionLabel}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 
                      onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                      className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {hotel.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-snug">
                      {hotel.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 block">Tariff on Request</span>
                      <span className="text-[9px] text-neutral-400 block">Best price via WhatsApp</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectHotel && onSelectHotel(hotel.slug)}
                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Details & Toilet Photo
                      </button>

                      <a
                        href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                          `Hi Spiky Cabs, I would like to check prices and get a Cab + Stay Quote for ${hotel.name} in ${hotel.regionLabel}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
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

      {/* 4. Warm Storytelling Feature Section: Why Spiky Cabs */}
      <section className="py-16 sm:py-20 bg-white border-t border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Like Having a Trusted Brother in the Hills</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] leading-snug">
                Why your mountain trip starts with a smile.
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#515154] leading-relaxed">
                <p>
                  <strong>No 6:00 AM station stress:</strong> Ever arrived at NJP with sleepy kids, heavy bags, and twenty shouting drivers tugging at your sleeve? We believe holidays should never start with high blood pressure. Your Spiky Cabs driver is standing right by the gate with your name card, ready with a genuine smile and a helping hand.
                </p>
                <p>
                  <strong>The "Secret Chai & Momo" stopovers:</strong> We stay far away from tourist traps with overpriced, stale buffets. Instead, our drivers pull over at that tiny cliffside wooden shack in Kurseong or Singtam where an authentic Pahadi family steams juicy momos with spicy fermented <em>Dalle</em> chutney.
                </p>
                <p>
                  <strong>Gentle mountain driving:</strong> Mountain bends shouldn't feel like a roller coaster. Our local drivers were born on these hills. They steer smoothly, brake with care, and gladly pull over so you can catch the clouds parting over Kanchenjunga or take in the eucalyptus scent.
                </p>
                <p>
                  <strong>Honest, upfront pricing:</strong> No surprise "mountain hill charges" or "driver dinner cess" demanded on a dark road at 9 PM. Your package price is fixed, all-inclusive, and guaranteed.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Call {COMPANY_INFO.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs!%20Can%20you%20help%20me%20plan%20my%20Sikkim%2FDarjeeling%20trip%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-xs sm:text-sm font-medium inline-flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
              <img
                src="/images/darjeeling_toy_train_1790684713643.jpg"
                alt="Darjeeling Heritage Mountain Drive"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 text-white">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-sky-300 font-semibold">Clean Cars · Gentle Mountain Driving</div>
                  <div className="text-base font-semibold">From Siliguri plains to the high Himalayan snow peaks.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Which package is right for you?" (The Apple Comparison Matrix) */}
      <section className="py-16 sm:py-24 bg-white border-t border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
              Side by Side
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              Which tour is right for you?
            </h2>
          </div>

          {/* Apple Spec Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {PACKAGES_DATA.slice(0, 4).map((p) => (
              <div key={p.id} className="flex flex-col justify-between space-y-4 pb-4">
                <div className="space-y-2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                    <img
                      src={p.featuredImage}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-semibold text-base sm:text-lg text-[#1d1d1f] leading-snug">
                    {p.title}
                  </h4>
                  <div className="text-xs font-mono text-[#86868b]">
                    {p.durationNights}N / {p.durationDays}D
                  </div>
                  <div className="font-semibold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>Best Rate on WhatsApp</span>
                  </div>
                </div>

                <div className="border-t border-[#e5e5ea] pt-4 space-y-3 text-xs text-[#6e6e73]">
                  <div>
                    <span className="text-[10px] text-[#86868b] uppercase block font-semibold">Gateway</span>
                    <span>IXB / NJP</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#86868b] uppercase block font-semibold">Altitude</span>
                    <span>{p.days[1]?.altitude || 'Himalayan Ridge'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#86868b] uppercase block font-semibold">Permit Processing</span>
                    <span>{p.permitRequired ? 'Included by Desk' : 'No Permit Needed'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#86868b] uppercase block font-semibold">Best Vehicle</span>
                    <span className="truncate block">{p.recommendedVehicles[0]}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onViewPackage(p)}
                    className="w-full rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#0071e3] py-2 text-xs font-medium transition-colors cursor-pointer"
                  >
                    View Day Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Mountain Fleet (Apple Hardware Lineup Style) */}
      <section className="py-16 sm:py-24 max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
            Engineered for the Hills
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            The Mountain Fleet.
          </h2>
          <p className="text-sm text-[#6e6e73] mt-2">
            Every vehicle undergoes strict pre-trip safety checks and is commanded by a verified local chauffeur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLEET_DATA.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-white rounded-3xl p-6 border border-[#e5e5ea] flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  {fleet.category}
                </div>
                <h3 className="font-semibold text-lg text-[#1d1d1f] mb-1">
                  {fleet.name}
                </h3>
                <div className="text-xs text-[#86868b] mb-4">
                  {fleet.capacity} · {fleet.luggage}
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 mb-4">
                  <img
                    src={fleet.image}
                    alt={fleet.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <ul className="text-xs text-[#6e6e73] space-y-1.5 font-normal">
                  {fleet.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#0071e3] font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#f5f5f7]">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[#86868b]">Daily Rental Tariff</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>Rate on Request</span>
                  </span>
                </div>

                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs, I would like to check daily rental rates and availability for the ${fleet.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-semibold transition-colors shadow-xs"
                >
                  Check Price
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Apple Values: Why Spiky Cabs (Clean 4-Card Stage) */}
      <section className="py-16 sm:py-24 bg-white border-t border-[#e5e5ea]">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
              Peace of Mind
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              The Spiky Cabs Difference.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#f5f5f7] space-y-3">
              <span className="text-xs font-mono font-semibold text-[#0071e3]">01 / INDEPENDENCE</span>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                100% Dedicated Cab Packages
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                We never force you into pre-selected hotels. Choose your own luxury boutique or authentic homestay, while we guarantee pristine vehicle logistics.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f5f5f7] space-y-3">
              <span className="text-xs font-mono font-semibold text-[#0071e3]">02 / SAFETY</span>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                Himalayan Chauffeur Expertise
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                Mountain hairpins, monsoon fog, and high-altitude weather windows require native road instincts. All drivers are licensed local professionals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f5f5f7] space-y-3">
              <span className="text-xs font-mono font-semibold text-[#0071e3]">03 / CLARITY</span>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                All Fuel & Road Taxes Included
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                Every confirmed itinerary includes complete route fuel, vehicle permits, and driver food/stay allowances. Zero surprise demands on the road.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f5f5f7] space-y-3">
              <span className="text-xs font-mono font-semibold text-[#0071e3]">04 / ADVISORY</span>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                Change of Route Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                In case of unforeseen landslides or weather closures, our Siliguri desk coordinates alternate routes dynamically to keep your family safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Apple Keynote Call to Action */}
      <section className="py-20 sm:py-28 text-center px-4 bg-[#f5f5f7]">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            Ready to explore?
          </h2>
          <p className="text-base sm:text-lg text-[#6e6e73] font-normal leading-relaxed">
            Let our team plan your Darjeeling, Sikkim, or Bhutan cab package. Reach us directly in Siliguri.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <button
              onClick={onNavigateContact}
              className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-6 py-3 text-sm font-normal transition-colors cursor-pointer"
            >
              Contact Support Desk
            </button>
            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20ready%20to%20book%20my%20cab%20package.`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 text-sm font-normal transition-colors"
            >
              WhatsApp Us (+91 75860 47996)
            </a>
          </div>
        </div>
      </section>

      {/* Hotel Inquiry Modal */}
      <HotelInquiryModal
        hotel={selectedHotelForModal}
        isOpen={Boolean(selectedHotelForModal)}
        onClose={() => setSelectedHotelForModal(null)}
      />
    </div>
  );
};
