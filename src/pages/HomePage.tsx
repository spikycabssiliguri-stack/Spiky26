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
  Car
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
import { useCMS } from '../context/CMSContext';

interface HomePageProps {
  onViewPackage: (pkg: CabPackage) => void;
  onNavigateContact: () => void;
}

export const HomePage = ({ onViewPackage, onNavigateContact }: HomePageProps) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'darjeeling' | 'sikkim' | 'bhutan'>('all');
  const { cmsData } = useCMS();

  const packages = cmsData.packages && cmsData.packages.length > 0 ? cmsData.packages : PACKAGES_DATA;
  const settings = cmsData.settings || COMPANY_INFO;

  const filteredPackages = packages.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'darjeeling') return pkg.destination === 'darjeeling' || pkg.destination === 'kalimpong';
    if (selectedFilter === 'sikkim') return pkg.destination === 'gangtok' || pkg.destination === 'north-sikkim';
    if (selectedFilter === 'bhutan') return pkg.destination === 'bhutan';
    return true;
  });

  const darjeelingPackage = packages.find((p) => p.id === 'darjeeling-2n-3d') || packages[0];
  const northSikkimPackage = packages.find((p) => p.id === 'north-sikkim-4n-5d') || packages[3] || packages[0];
  const gangtokPackage = packages.find((p) => p.id === 'gangtok-3n-4d') || packages[2] || packages[0];
  const bhutanPackage = packages.find((p) => p.id === 'bhutan-5n-6d') || packages[5] || packages[0];
  const darjeelingExtended = packages.find((p) => p.id === 'darjeeling-4n-5d') || packages[1] || packages[0];
  const kalimpongPackage = packages.find((p) => p.id === 'kalimpong-2n-3d') || packages[4] || packages[0];

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f]">
      {/* 1. Flagship Hero Stage (Apple Keynote Style) */}
      <section className="bg-white pt-16 pb-12 sm:pt-24 sm:pb-20 text-center px-4 overflow-hidden border-b border-[#e5e5ea]">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-[13px] sm:text-[14px] font-semibold text-[#86868b] tracking-normal uppercase">
            Spiky Cabs Taxi Services
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Himalayas. Uncompromised.
          </h1>

          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto pt-1 leading-relaxed text-balance">
            Dedicated private tourist cabs for Darjeeling, Sikkim, Kalimpong & Bhutan. From Bagdogra & NJP.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap text-sm sm:text-base">
            <button
              onClick={() => {
                const el = document.getElementById('itineraries-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 transition-colors font-normal cursor-pointer"
            >
              Explore Packages
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20planning%20a%20mountain%20trip.%20Please%20send%20cab%20rates.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0071e3] hover:underline inline-flex items-center font-normal"
            >
              <span>Instant WhatsApp quote</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>

          <div className="text-[11px] text-[#86868b] pt-2 font-mono">
            100% Cab-Only Packages · Zero hotel markups · Valid till April 2027
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="max-w-[1180px] mx-auto mt-10 px-2 sm:px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-100 shadow-xl border border-black/5">
            <img
              src="/src/assets/images/hero_himalayan_cab_1790679944443.jpg"
              alt="Himalayan mountain highway with Mount Kanchenjunga"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white text-left gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">Eastern Himalayan Route</span>
                <div className="text-lg sm:text-2xl font-semibold">Teesta River & Kanchenjunga Corridors</div>
              </div>
              <div className="text-xs text-neutral-200">
                Pick-up at Bagdogra Airport (IXB) & New Jalpaiguri (NJP)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Apple Second Hero Feature: North Sikkim (Dark Keynote Stage) */}
      <section className="bg-[#161617] text-white pt-20 pb-16 sm:pt-28 sm:pb-24 text-center px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-[12px] sm:text-[13px] font-semibold text-[#86868b] tracking-wider uppercase">
            High Altitude Expedition · 4 Nights | 5 Days
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight text-balance">
            North Sikkim. Pure alpine drama.
          </h2>

          <p className="text-base sm:text-xl text-[#a1a1a6] font-normal max-w-2xl mx-auto leading-relaxed text-balance">
            Traverse ancient pine gorges to Lachung, the blooming rhododendrons of Yumthang Valley, and high-altitude snow peaks at Zero Point (15,300 ft).
          </p>

          <div className="flex items-center justify-center gap-4 pt-3 flex-wrap text-sm sm:text-base">
            <button
              onClick={() => onViewPackage(northSikkimPackage)}
              className="rounded-full bg-white hover:bg-neutral-200 text-[#161617] px-5 py-2.5 transition-colors font-medium cursor-pointer"
            >
              View Day-by-Day Itinerary
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20book%20the%20North%20Sikkim%204N%2F5D%20package.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2997ff] hover:underline inline-flex items-center font-normal"
            >
              <span>Book with Permits</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>

          <div className="text-xs text-[#86868b] pt-1">
            From ₹17,999 / complete cab package · Restricted Area Permits (PAP) arranged
          </div>
        </div>

        {/* Cinematic Stage Graphic */}
        <div className="max-w-[1080px] mx-auto mt-10 px-2 sm:px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
            <img
              src="/src/assets/images/north_sikkim_yumthang_1790679981868.jpg"
              alt="Yumthang Valley North Sikkim"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-neutral-300 text-left">
              <span>Yumthang Valley (11,693 ft) & Zero Point (15,300 ft)</span>
              <span className="font-mono">Mahindra Scorpio / Bolero 4x4</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Apple 2x2 Bento Product Grid */}
      <section id="itineraries-section" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
            Curated Circuits
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            Explore the Collection.
          </h2>
        </div>

        {/* 2-Column Side-by-Side Product Cards (Apple Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* Card 1: Darjeeling Classic */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6 sm:px-8 group hover:shadow-lg transition-all">
            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Weekend Favorite · 2 Nights | 3 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Darjeeling Classic
              </h3>
              <p className="text-sm sm:text-base text-[#6e6e73] font-normal leading-relaxed">
                4:00 AM Tiger Hill Sunrise over Kanchenjunga, Ghoom, Batasia Loop, and return via Mirik Lake & Nepal border.
              </p>
              <div className="text-xs text-[#86868b]">
                Starting from <span className="font-mono font-semibold text-[#1d1d1f]">₹7,999</span> / private cab
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(darjeelingPackage)}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20book%20the%20Darjeeling%202N%2F3D%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline inline-flex items-center"
                >
                  <span>Book now</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/src/assets/images/darjeeling_tea_mirik_1790680004464.jpg"
                alt="Darjeeling tea gardens and Mirik"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Gangtok & Glacial Tsomgo */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6 sm:px-8 group hover:shadow-lg transition-all">
            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                East Sikkim · 3 Nights | 4 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Gangtok & Changu Lake
              </h3>
              <p className="text-sm sm:text-base text-[#6e6e73] font-normal leading-relaxed">
                Glacial Tsomgo Lake at 12,310 ft, Baba Mandir, pedestrian MG Marg, and Teesta river highway.
              </p>
              <div className="text-xs text-[#86868b]">
                Starting from <span className="font-mono font-semibold text-[#1d1d1f]">₹11,999</span> / private cab
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(gangtokPackage)}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20book%20the%20Gangtok%203N%2F4D%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline inline-flex items-center"
                >
                  <span>Book now</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/src/assets/images/gallery_tsomgo_lake_1790680958082.jpg"
                alt="Tsomgo Glacial Lake East Sikkim"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 3: Darjeeling & Surrounding Offbeat */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6 sm:px-8 group hover:shadow-lg transition-all">
            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Leisure & Offbeat · 4 Nights | 5 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Darjeeling & Offbeat Hamlets
              </h3>
              <p className="text-sm sm:text-base text-[#6e6e73] font-normal leading-relaxed">
                Lamahatta pine sanctuary, Triveni river confluence, Lepchajagat ridges, and Gopaldhara Tea Estate.
              </p>
              <div className="text-xs text-[#86868b]">
                Starting from <span className="font-mono font-semibold text-[#1d1d1f]">₹14,500</span> / private cab
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(darjeelingExtended)}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20book%20the%20Darjeeling%204N%2F5D%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline inline-flex items-center"
                >
                  <span>Book now</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/src/assets/images/gallery_tiger_hill_1790680945212.jpg"
                alt="Tiger Hill Kanchenjunga sunrise"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 4: Bhutan Western Circuit */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6 sm:px-8 group hover:shadow-lg transition-all">
            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Cross-Border · 5 Nights | 6 Days
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Bhutan Western Valley
              </h3>
              <p className="text-sm sm:text-base text-[#6e6e73] font-normal leading-relaxed">
                Phuentsholing, Dochula Pass (3,100 m), Thimphu Buddha Point, Punakha Dzong & Paro Tiger's Nest base.
              </p>
              <div className="text-xs text-[#86868b]">
                Starting from <span className="font-mono font-semibold text-[#1d1d1f]">₹26,000</span> / tourist cab
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
                <button
                  onClick={() => onViewPackage(bhutanPackage)}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Itinerary
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20book%20the%20Bhutan%205N%2F6D%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline inline-flex items-center"
                >
                  <span>Book now</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/src/assets/images/hero_himalayan_cab_1790679944443.jpg"
                alt="Bhutan mountain pass road"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
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
                  <div className="font-mono font-semibold text-lg text-[#1d1d1f]">
                    From ₹{p.startingPrice.sedan.toLocaleString('en-IN')}
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
                <div className="flex items-baseline justify-between text-xs mb-3">
                  <span className="text-[#86868b]">Est. Daily Rate</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">
                    ~₹{fleet.baseRatePerDay.toLocaleString('en-IN')}/day
                  </span>
                </div>

                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs, I would like to inquire about booking the ${fleet.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#0071e3] py-2 text-xs font-normal transition-colors"
                >
                  Inquire for {fleet.name.split(' ')[0]}
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
    </div>
  );
};
