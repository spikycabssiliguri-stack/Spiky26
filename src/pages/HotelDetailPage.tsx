import { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Car, 
  Compass, 
  Check, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Coffee, 
  Sparkles,
  Plane,
  Train,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Bath,
  Maximize2,
  X,
  Eye
} from 'lucide-react';
import { getHotelBySlug, RecommendedHotel, HOTELS_DATA, getHotelGalleryPhotos, HotelGalleryPhoto } from '../data/hotelsData';
import { HotelInquiryModal } from '../components/HotelInquiryModal';
import { useCMS } from '../context/CMSContext';

interface HotelDetailPageProps {
  hotelSlug: string;
  onNavigateBack: () => void;
  onNavigateHotel: (slug: string) => void;
  onNavigatePackage?: (slug: string) => void;
}

export const HotelDetailPage = ({
  hotelSlug,
  onNavigateBack,
  onNavigateHotel,
  onNavigatePackage
}: HotelDetailPageProps) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings;
  const hotel = getHotelBySlug(hotelSlug);

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!hotel) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Hotel Not Found</h2>
        <p className="text-xs text-neutral-600 mb-6">
          The requested Himalayan hotel could not be located in our curated recommendations.
        </p>
        <button
          onClick={onNavigateBack}
          className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          Back to Hotel Directory
        </button>
      </div>
    );
  }

  const galleryPhotos = getHotelGalleryPhotos(hotel);
  const currentDisplayImage = activeImage || galleryPhotos[0]?.url || hotel.featuredImage;

  // Direct WhatsApp quote redirection generator
  const getCabStayQuoteWhatsappUrl = (roomName?: string) => {
    const selectedRoom = roomName || (hotel.roomTypes[0]?.name) || 'Deluxe Room';
    const quoteMsg = encodeURIComponent(
      `Hi Spiky Cabs, I would like to check prices and request a Cab + Stay Quote for ${hotel.name} in ${hotel.regionLabel}.\n\n` +
      `• Hotel: ${hotel.name}\n` +
      `• Destination: ${hotel.destination.toUpperCase()}\n` +
      `• Preferred Room: ${selectedRoom}\n` +
      `• Circuit Combo: ${hotel.spikyCabsCombo.circuitTitle}\n\n` +
      `Please share the best tariff, room availability, and dedicated private cab package quote.`
    );
    return `https://wa.me/${settings.rawPhone}?text=${quoteMsg}`;
  };

  const handleRequestCabStayQuote = (roomName?: string) => {
    const url = getCabStayQuoteWhatsappUrl(roomName);
    window.location.href = url;
  };

  // WhatsApp quick link
  const whatsappUrl = `https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(
    `Hi Spiky Cabs, I am interested in booking a Cab + Stay package for ${hotel.name} in ${hotel.regionLabel}. Please assist with availability and custom cab pricing.`
  )}`;

  // Related hotels in the same region
  const relatedHotels = HOTELS_DATA.filter(h => h.id !== hotel.id && (h.destination === hotel.destination || h.brand === hotel.brand)).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Top Breadcrumb & Back Bar */}
      <div className="border-b border-neutral-100 bg-neutral-50/70 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Recommended Hotels</span>
          </button>

          {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <span>{hotel.brand} Hotels</span>
            <span>·</span>
            <span className="capitalize">{hotel.destination}</span>
            <span>·</span>
            <span className="text-amber-600 font-semibold font-mono tabular-nums">★ {hotel.starRating} Star</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Section */}
      <section className="relative bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header Info */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <span className="text-amber-400 font-semibold tracking-wide uppercase text-[11px]">
                  {hotel.brand} Collection
                </span>
                <span>·</span>
                <span className="capitalize text-neutral-300">{hotel.regionLabel}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {hotel.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {hotel.tagline}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{hotel.locationAddress}</span>
              </div>

              {/* Price & CTA Block */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm sm:text-base font-bold text-white bg-emerald-600/30 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-emerald-300 inline-flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Get Best Tariff on WhatsApp</span>
                </span>
                <span className="text-xs text-neutral-300">
                  Direct local hotel rate · Zero booking fee
                </span>
              </div>

              <div className="pt-4 flex flex-wrap gap-2.5">
                <a
                  href={getCabStayQuoteWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Request Cab + Stay Quote (WhatsApp)</span>
                </a>

                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="px-5 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Customize Itinerary</span>
                </button>

                <a
                  href={`tel:${settings.phone}`}
                  className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Spiky Cabs</span>
                </a>
              </div>
            </div>

            {/* Right Media Carousel / Display */}
            <div className="lg:col-span-6 space-y-3">
              <div 
                onClick={() => {
                  const currIdx = galleryPhotos.findIndex(p => p.url === currentDisplayImage);
                  setLightboxIndex(currIdx >= 0 ? currIdx : 0);
                }}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 cursor-pointer"
              >
                <img
                  src={currentDisplayImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium truncate">{hotel.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>{galleryPhotos.find(p => p.url === currentDisplayImage)?.badge || 'Photo 1 of 5'}</span>
                    </span>
                    <span className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                      Enlarge
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 Photo Thumbnails with Toilet/Bathroom Included */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 px-0.5">
                  <span className="font-semibold text-neutral-300">5 Verified Photos:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const toiletIdx = galleryPhotos.findIndex(p => p.category === 'toilet');
                        if (toiletIdx >= 0) {
                          setActiveImage(galleryPhotos[toiletIdx].url);
                          setLightboxIndex(toiletIdx);
                        }
                      }}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Bath className="w-3 h-3" />
                      <span>View Toilet / Restroom Photo</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setLightboxIndex(0)}
                      className="text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>All 5 Photos</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {galleryPhotos.map((photo, i) => {
                    const isToilet = photo.category === 'toilet';
                    const isCurrent = currentDisplayImage === photo.url;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveImage(photo.url)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex flex-col justify-end text-left ${
                          isCurrent 
                            ? 'border-emerald-400 scale-102 ring-2 ring-emerald-400/40' 
                            : isToilet
                            ? 'border-emerald-700/60 opacity-80 hover:opacity-100'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover absolute inset-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        
                        {isToilet && (
                          <div className="absolute top-1 left-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                            <Bath className="w-2.5 h-2.5" />
                          </div>
                        )}

                        <span className="relative z-10 text-[9px] text-white font-medium px-1 py-0.5 truncate drop-shadow-sm flex items-center gap-0.5">
                          {isToilet ? 'Toilet & Bath' : photo.category === 'bedroom' ? 'Suite' : photo.category === 'exterior' ? 'Exterior' : photo.category === 'dining' ? 'Dining' : 'View'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details & Room Types */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* Overview & Key Highlights Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Property Overview
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                About the Stay Experience
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {hotel.overview}
            </p>

            {/* Experience Highlights */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Signature Experiences & Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hotel.experienceHighlights.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-2.5 text-xs text-neutral-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="pt-4 space-y-3">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Property Amenities & Comforts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded-lg bg-neutral-50 text-[11px] text-neutral-700 font-medium border border-neutral-100 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Spiky Cabs Combo Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-xl border border-neutral-800 space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  Spiky Cabs Curated Package
                </span>
                <span className="text-neutral-400 text-[11px]">Private Chauffeur Included</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Book {hotel.name} with Dedicated Private Cab
                </h3>
                <p className="text-xs text-neutral-300">
                  {hotel.spikyCabsCombo.bundleAdvantage}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-200 font-semibold">
                  <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Recommended Circuit: {hotel.spikyCabsCombo.circuitTitle}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {hotel.spikyCabsCombo.chauffeurNotes}
                </p>
              </div>

              <div className="space-y-2 text-xs text-neutral-300 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Airport Transfer:</span>
                  </span>
                  <span className="text-right text-[11px] text-neutral-200">
                    {hotel.airportTransferInfo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Railway Station:</span>
                  </span>
                  <span className="text-right text-[11px] text-neutral-200">
                    {hotel.railwayTransferInfo}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={getCabStayQuoteWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request Cab + Stay Quote (WhatsApp)</span>
                </a>
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Detailed Custom Booking Form</span>
                </button>
              </div>
            </div>

            {/* Quick Property Fact Box */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-500">Check-in Time:</span>
                <span className="font-semibold text-neutral-800">{hotel.checkInTime}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-500">Check-out Time:</span>
                <span className="font-semibold text-neutral-800">{hotel.checkOutTime}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-500">Ideal For:</span>
                <span className="font-medium text-neutral-800 text-right max-w-[200px] truncate">
                  {hotel.bestSuitedFor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Photo Property Showcase (Including Modern Ensuite Toilet & Restroom) */}
        <div className="space-y-6 pt-6 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified 5-Photo Property Showcase</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                5 Complete Property Views (Including Ensuite Toilet & Restroom)
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Inspect authentic photos of the property grounds, bedroom suites, dining lounge, mountain views, and modern clean restrooms before you book.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium bg-neutral-100 px-3.5 py-1.5 rounded-full">
              <Bath className="w-4 h-4 text-emerald-600" />
              <span>Sanitized Ensuite Restroom Assured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {galleryPhotos.map((photo, pIdx) => {
              const isToilet = photo.category === 'toilet';
              return (
                <div
                  key={pIdx}
                  onClick={() => {
                    setActiveImage(photo.url);
                    setLightboxIndex(pIdx);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 flex flex-col justify-between ${
                    currentDisplayImage === photo.url
                      ? 'border-neutral-950 ring-2 ring-neutral-950/20 shadow-lg'
                      : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge */}
                    <div className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                      isToilet ? 'bg-emerald-600 text-white' : 'bg-black/75 text-white'
                    }`}>
                      {isToilet ? 'Ensuite Toilet & Bath' : `Photo ${pIdx + 1}`}
                    </div>

                    <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 bg-white space-y-1">
                    <div className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1.5">
                      {isToilet && <Bath className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span className="truncate">{photo.title}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                      {photo.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cleanliness Guarantee Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hygienic modern western toilet (EWC)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>24/7 running hot water & geysers</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fresh sterilized towels & toiletries</span>
            </div>
          </div>
        </div>

        {/* Room Categories & Transparent Pricing */}
        <div className="space-y-6 pt-6 border-t border-neutral-200">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Accommodation Options
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              Room Categories & Tariffs
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Direct property rates verified with hotel management. Rates may vary during peak tourist season (April–June & October–December).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotel.roomTypes.map((room, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all p-5 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {room.name}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                    <div><strong>Bedding:</strong> {room.bedType}</div>
                    <div><strong>View:</strong> {room.view}</div>
                    <div><strong>Capacity:</strong> {room.capacity}</div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md block">
                      Tariff on Request
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">Seasonal direct rate</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getCabStayQuoteWhatsappUrl(room.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Check Price</span>
                    </a>

                    <button
                      onClick={() => setIsInquiryOpen(true)}
                      className="px-2.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Book Form
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Hotels In Region */}
        {relatedHotels.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  More Options in {hotel.regionLabel}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight">
                  Similar Curated Stays
                </h2>
              </div>

              <button
                onClick={onNavigateBack}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Hotels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedHotels.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateHotel(rel.slug)}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-900 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img
                      src={rel.featuredImage}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold">
                      {rel.brand}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mb-1">
                        <span className="capitalize">{rel.destination}</span>
                        <span>·</span>
                        <span className="text-amber-600 font-semibold font-mono">★ {rel.starRating}</span>
                      </div>
                      <h3 className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {rel.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                        {rel.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 text-[11px] flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>Price on WhatsApp</span>
                      </span>
                      <span className="text-[11px] text-neutral-700 font-semibold flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5-Photo Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between text-white pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white truncate max-w-[200px] sm:max-w-md">{hotel.name}</span>
                <span className="text-neutral-400">·</span>
                <span className="text-amber-400 font-mono">★ {hotel.starRating} Star</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Photo {lightboxIndex + 1} of 5 · {galleryPhotos[lightboxIndex].badge}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getCabStayQuoteWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Request Cab + Stay Quote</span>
              </a>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Area with Navigation */}
          <div 
            className="relative flex-1 flex items-center justify-center py-2 sm:py-4 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={() => setLightboxIndex(prev => (prev !== null ? (prev > 0 ? prev - 1 : 4) : 0))}
              className="absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-lg cursor-pointer transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Photo Container */}
            <div className="relative max-h-[68vh] max-w-[92vw] flex flex-col items-center">
              <img
                src={galleryPhotos[lightboxIndex].url}
                alt={galleryPhotos[lightboxIndex].title}
                className="max-h-[64vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/15"
                referrerPolicy="no-referrer"
              />

              {galleryPhotos[lightboxIndex].category === 'toilet' && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Bath className="w-4 h-4" />
                  <span>Ensuite Modern Western Toilet & Bathroom</span>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex(prev => (prev !== null ? (prev < 4 ? prev + 1 : 0) : 0))}
              className="absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-lg cursor-pointer transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Bar & Thumbnail Strip */}
          <div 
            className="pt-3 border-t border-white/10 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
              <div>
                <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  {galleryPhotos[lightboxIndex].category === 'toilet' && <Bath className="w-4 h-4 text-emerald-400" />}
                  <span>{galleryPhotos[lightboxIndex].title}</span>
                </h4>
                <p className="text-[11px] text-neutral-300 max-w-3xl leading-snug">
                  {galleryPhotos[lightboxIndex].description}
                </p>
              </div>

              <div className="sm:hidden">
                <a
                  href={getCabStayQuoteWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Request Quote on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Thumbnails row */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
              {galleryPhotos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-14 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    lightboxIndex === idx ? 'border-emerald-400 scale-105 ring-2 ring-emerald-400/40' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {p.category === 'toilet' && (
                    <div className="absolute top-0.5 left-0.5 bg-emerald-600 text-white p-0.5 rounded-full">
                      <Bath className="w-2 h-2" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <HotelInquiryModal
        hotel={hotel}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </div>
  );
};
