import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Car, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  Compass, 
  MessageCircle, 
  Phone,
  Sparkles,
  Check,
  ShieldCheck,
  Users,
  Building2
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { CabPackage } from '../data/packagesData';
import { DownloadBrochureModal } from '../components/DownloadBrochureModal';

interface PackagesCatalogPageProps {
  onSelectPackage: (pkg: CabPackage) => void;
  onNavigateContact: () => void;
  onNavigateHotels?: () => void;
}

export const PackagesCatalogPage = ({
  onSelectPackage,
  onNavigateContact,
  onNavigateHotels
}: PackagesCatalogPageProps) => {
  const { cmsData } = useCMS();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'darjeeling' | 'gangtok' | 'north-sikkim' | 'kalimpong' | 'bhutan'>('all');
  const [downloadModalPkg, setDownloadModalPkg] = useState<CabPackage | null>(null);

  const packages = cmsData.packages;
  const settings = cmsData.settings;

  const filteredPackages = packages.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    return pkg.destination === selectedFilter;
  });

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* 1. Page Header (Apple Keynote Style) */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            Official Cab Packages
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Find the right circuit for you.
          </h1>
          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed text-balance pt-2">
            Every package is 100% cab-only with certified native mountain chauffeurs, complete route fuel, and inter-state permits.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 pt-8 flex-wrap">
            {[
              { id: 'all', label: 'All Circuits' },
              { id: 'darjeeling', label: 'Darjeeling' },
              { id: 'gangtok', label: 'Gangtok & Changu' },
              { id: 'north-sikkim', label: 'North Sikkim' },
              { id: 'kalimpong', label: 'Kalimpong' },
              { id: 'bhutan', label: 'Bhutan Western' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#1d1d1f] text-white font-medium shadow-xs'
                    : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-[#d2d2d7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Products Grid */}
      <section className="py-16 sm:py-24 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between hover:shadow-xl hover:border-[#0071e3] transition-all group duration-300"
            >
              <div>
                {/* Photo Header */}
                <div 
                  className="relative aspect-16/10 bg-[#f5f5f7] overflow-hidden cursor-pointer"
                  onClick={() => onSelectPackage(pkg)}
                >
                  <img
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    {pkg.badge || `${pkg.durationNights}N / ${pkg.durationDays}D`}
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>Price on WhatsApp</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#0071e3] tracking-wider block">
                      {pkg.destination} Circuit
                    </span>
                    <h3 
                      onClick={() => onSelectPackage(pkg)}
                      className="text-xl font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer leading-snug"
                    >
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-[#86868b] line-clamp-1">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#6e6e73] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>{pkg.durationNights}N/{pkg.durationDays}D</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>{pkg.pickupDrop}</span>
                    </span>
                  </div>

                  {/* Highlights Bullet List */}
                  <ul className="text-xs text-[#6e6e73] space-y-1.5 pt-2 border-t border-[#f5f5f7]">
                    {pkg.keyHighlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 sm:p-7 pt-0 space-y-2">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="w-full rounded-full bg-[#1d1d1f] hover:bg-black text-white py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>View Day Plan & Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setDownloadModalPkg(pkg)}
                    className="flex-1 py-2 px-3 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-normal transition-colors flex items-center justify-center gap-1.5 border border-[#d2d2d7] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>PDF Itinerary</span>
                  </button>

                  <a
                    href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20interested%20in%20${encodeURIComponent(pkg.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-normal transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hotel Recommendation Banner CTA */}
        {onNavigateHotels && (
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-800 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Himalayan Hospitality</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pair Your Cab Circuit with Handpicked Hotels & Resorts
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Looking for verified properties? Explore our curated stays across Summit Hotels, Sumi Yashshree, Taj Chia Kutir, and Rare Himalayas with verified direct rates and dedicated door-to-door cab pickups.
              </p>
            </div>

            <button
              onClick={onNavigateHotels}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0 inline-flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Explore Recommended Hotels</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 3. Bottom Banner CTA */}
      <section className="py-20 bg-white border-t border-[#e5e5ea] text-center px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            Need a custom multi-destination route?
          </h2>
          <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            Our Siliguri route planners can create a personalized circuit combining Darjeeling, Gangtok, Pelling, and Kalimpong.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onNavigateContact}
              className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-6 py-3 text-xs font-normal cursor-pointer"
            >
              Contact Booking Desk
            </button>
            <a
              href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20need%20a%20custom%20cab%20package`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 text-xs font-normal"
            >
              Chat on WhatsApp (+91 75860 47996)
            </a>
          </div>
        </div>
      </section>

      {/* Download Brochure Lead Modal */}
      <DownloadBrochureModal
        isOpen={!!downloadModalPkg}
        onClose={() => setDownloadModalPkg(null)}
        pkg={downloadModalPkg}
        companyPhone={settings.phone}
      />
    </div>
  );
};
