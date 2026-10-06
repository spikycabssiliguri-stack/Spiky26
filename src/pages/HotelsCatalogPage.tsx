import { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  Filter, 
  ArrowRight, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Phone, 
  MessageCircle,
  SlidersHorizontal
} from 'lucide-react';
import { HOTELS_DATA, RecommendedHotel } from '../data/hotelsData';
import { HotelInquiryModal } from '../components/HotelInquiryModal';
import { useCMS } from '../context/CMSContext';

interface HotelsCatalogPageProps {
  onSelectHotel: (slug: string) => void;
  onNavigateContact?: () => void;
}

export const HotelsCatalogPage = ({ onSelectHotel, onNavigateContact }: HotelsCatalogPageProps) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [activeHotelForModal, setActiveHotelForModal] = useState<RecommendedHotel | null>(null);

  // Filtered hotels list
  const filteredHotels = useMemo(() => {
    return HOTELS_DATA.filter((hotel) => {
      // Brand match
      const matchesBrand = selectedBrand === 'all' || hotel.brand.toLowerCase() === selectedBrand.toLowerCase();

      // Destination match
      const matchesDestination = selectedDestination === 'all' || 
        (selectedDestination === 'darjeeling' && (hotel.destination === 'darjeeling' || hotel.destination === 'kurseong')) ||
        (selectedDestination === 'gangtok' && hotel.destination === 'gangtok') ||
        (selectedDestination === 'pelling' && (hotel.destination === 'pelling' || hotel.destination === 'rinchenpong')) ||
        (selectedDestination === 'lachung' && hotel.destination === 'lachung') ||
        (selectedDestination === 'kalimpong' && hotel.destination === 'kalimpong');

      // Budget tier match
      let matchesBudget = true;
      if (selectedBudget === 'luxury') matchesBudget = hotel.startingPrice >= 10000;
      else if (selectedBudget === 'premium') matchesBudget = hotel.startingPrice >= 4500 && hotel.startingPrice < 10000;
      else if (selectedBudget === 'budget') matchesBudget = hotel.startingPrice < 4500;

      // Text search match
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        hotel.name.toLowerCase().includes(query) ||
        hotel.brand.toLowerCase().includes(query) ||
        hotel.locationAddress.toLowerCase().includes(query) ||
        hotel.destination.toLowerCase().includes(query) ||
        hotel.tagline.toLowerCase().includes(query);

      return matchesBrand && matchesDestination && matchesBudget && matchesSearch;
    });
  }, [searchTerm, selectedBrand, selectedDestination, selectedBudget]);

  const brandsList = [
    { id: 'all', label: 'All Brands' },
    { id: 'summit', label: 'Summit Hotels' },
    { id: 'yashshree', label: 'Sumi Yashshree' },
    { id: 'taj', label: 'Taj Hotels' },
    { id: 'rare himalayas', label: 'Rare Himalayas' }
  ];

  const destinationsList = [
    { id: 'all', label: 'All Locations' },
    { id: 'darjeeling', label: 'Darjeeling & Kurseong' },
    { id: 'gangtok', label: 'Gangtok' },
    { id: 'pelling', label: 'Pelling (West Sikkim)' },
    { id: 'lachung', label: 'Lachung (North Sikkim)' },
    { id: 'kalimpong', label: 'Kalimpong' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-14 sm:py-20 px-4 sm:px-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/images/hotel_hero_luxury_resort_1791198161227.jpg"
            alt="Himalayan Mountain Resort"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Himalayan Hospitality</span>
            <span>·</span>
            <span>Darjeeling & Sikkim</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Recommended Hotels & Mountain Retreats
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Handpicked properties from <strong>Summit Hotels</strong>, <strong>Sumi Yashshree</strong>, the iconic <strong>Taj Chia Kutir</strong>, and <strong>Rare Himalayas</strong> heritage estates. Paired with private Spiky Cabs chauffeur transfers with zero booking markups.
          </p>

          {/* Key Value Pillars */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Verified Direct Hotel Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Door-to-Door Private Chauffeur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Free Sikkim Permit Coordination</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-12 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hotel name, location, or amenity (e.g. Taj, Summit, Kanchenjunga view, Lachung)..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/80 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-2.5 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Destination Dropdown */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full md:w-auto text-xs px-3.5 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 focus:bg-white focus:outline-none cursor-pointer"
              >
                {destinationsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full md:w-auto text-xs px-3.5 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Stay Categories</option>
                <option value="luxury">Luxury & 5-Star Heritage</option>
                <option value="premium">Boutique & Mountain Views</option>
                <option value="budget">Comfort & Deluxe Stays</option>
              </select>
            </div>
          </div>

          {/* Brand Filter Tabs (Segmented Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Brand:
            </span>
            {brandsList.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedBrand === brand.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {brand.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Results Count Header */}
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div>
            Showing <strong className="text-neutral-950 font-mono tabular-nums">{filteredHotels.length}</strong> verified properties in Darjeeling & Sikkim
          </div>
          {(selectedBrand !== 'all' || selectedDestination !== 'all' || selectedBudget !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedDestination('all');
                setSelectedBudget('all');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200 p-8 space-y-3">
            <Building2 className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No hotels match your current filters</h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Try adjusting your destination, brand filter, or search query to explore other properties.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedDestination('all');
                setSelectedBudget('all');
                setSearchTerm('');
              }}
              className="mt-2 px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold cursor-pointer"
            >
              View All Hotels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group bg-white rounded-3xl border border-neutral-200 hover:border-neutral-900 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Section */}
                <div 
                  onClick={() => onSelectHotel(hotel.slug)}
                  className="relative aspect-[16/10] bg-neutral-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={hotel.featuredImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Brand Tag Top Left */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                    {hotel.brand}
                  </div>

                  {/* Star Rating Top Right */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold flex items-center gap-1 shadow-sm font-mono">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{hotel.starRating}</span>
                  </div>

                  {/* Location Label Bottom Left */}
                  <div className="absolute bottom-2.5 left-3 text-xs text-white flex items-center gap-1 font-medium drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    <span className="truncate">{hotel.regionLabel}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => onSelectHotel(hotel.slug)}
                      className="text-base font-bold text-neutral-950 hover:text-blue-600 transition-colors leading-snug cursor-pointer line-clamp-1"
                    >
                      {hotel.name}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {hotel.tagline}
                    </p>

                    {/* Highlights bullet points */}
                    <div className="pt-2 space-y-1">
                      {hotel.experienceHighlights.slice(0, 2).map((exp, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-700 leading-snug">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="pt-3 border-t border-neutral-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Best Tariff on WhatsApp</span>
                      </span>

                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Cab Combo Ready
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectHotel(hotel.slug)}
                        className="w-full py-2 px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold transition-colors text-center cursor-pointer"
                      >
                        Details & Toilet Photo
                      </button>

                      <a
                        href={`https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
                          `Hi Spiky Cabs, I would like to check prices and get a Cab + Stay Quote for ${hotel.name} in ${hotel.regionLabel}. Please share the current seasonal tariff.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Check Price</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informational Combo Feature Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-neutral-700 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                The Spiky Cabs Advantage
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Combine Verified Hotel Reservations with Dedicated Mountain Chauffeurs
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                We coordinate with properties across Summit, Sumi Yashshree, Taj Chia Kutir, and Rare Himalayas to secure your preferred room while providing an experienced private chauffeur throughout your journey from Bagdogra Airport or NJP railway station.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
              <a
                href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20plan%20a%20complete%20Cab%20%2B%20Hotel%20vacation%20in%20Darjeeling%20and%20Sikkim.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Custom Cab + Hotel Itinerary</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="w-full py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-center"
              >
                Call: {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <HotelInquiryModal
        hotel={activeHotelForModal}
        isOpen={Boolean(activeHotelForModal)}
        onClose={() => setActiveHotelForModal(null)}
      />
    </div>
  );
};
