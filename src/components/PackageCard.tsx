import { MapPin, Calendar, Users, Eye, MessageCircle, FileText } from 'lucide-react';
import { CabPackage, COMPANY_INFO } from '../data/packagesData';

interface PackageCardProps {
  pkg: CabPackage;
  onViewItinerary: (pkg: CabPackage) => void;
  onSelectBooking: (pkg: CabPackage) => void;
}

export const PackageCard = ({ pkg, onViewItinerary, onSelectBooking }: PackageCardProps) => {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
    `Hi Spiky Cabs, I would like to inquire/book the "${pkg.title}" (${pkg.durationNights}N/${pkg.durationDays}D). Please share cab availability and final quotation.`
  )}`;

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-300 transition-all flex flex-col h-full group shadow-sm hover:shadow-md">
      {/* Visual Slot with Resilient Fallback */}
      <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
        <img
          src={pkg.featuredImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-transparent"></div>

        {/* Clean badge & duration */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
          <span className="font-semibold text-sky-300 drop-shadow-sm">{pkg.badge}</span>
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] drop-shadow-sm font-medium">
            {pkg.durationNights}N / {pkg.durationDays}D
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Unboxed clean metadata line */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <span>{pkg.pickupDrop.split('or')[0].trim()}</span>
          <span aria-hidden="true">·</span>
          <span>Valid till {pkg.offerValidity}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-900 leading-snug mb-1 group-hover:text-[#0071e3] transition-colors">
          {pkg.title}
        </h3>

        {/* Route Subtitle */}
        <p className="text-xs font-medium text-neutral-600 mb-3 truncate" title={pkg.subtitle}>
          {pkg.subtitle}
        </p>

        {/* Brief storytelling overview */}
        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
          {pkg.overview}
        </p>

        {/* Day-by-Day Route Snapshot */}
        <div className="border-t border-b border-neutral-100 py-3 my-auto space-y-1.5">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Route Schedule
          </div>
          {pkg.days.slice(0, 3).map((day) => (
            <div key={day.dayNumber} className="flex items-start gap-2 text-xs text-neutral-700">
              <span className="font-bold text-[#0071e3] shrink-0">D{day.dayNumber}:</span>
              <span className="truncate">{day.routeTitle}</span>
            </div>
          ))}
          {pkg.days.length > 3 && (
            <div className="text-xs text-[#0071e3] font-medium">
              +{pkg.days.length - 3} more days in complete itinerary
            </div>
          )}
        </div>

        {/* Pricing & Vehicle Options */}
        <div className="pt-4 pb-2 space-y-2">
          <div className="bg-[#f5f5f7] p-3 rounded-xl border border-neutral-200/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Tariff</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>Best Price on WhatsApp</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 pt-1 border-t border-neutral-200/60">
              <div>
                <span className="font-semibold block text-neutral-900">4 Seater</span>
                <span className="text-[11px] text-neutral-500">Swift Dzire / WagonR</span>
              </div>
              <div className="border-l border-neutral-300/60 pl-2">
                <span className="font-semibold block text-neutral-900">6–7 Seater</span>
                <span className="text-[11px] text-neutral-500">Innova Crysta / Ertiga</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-between pt-0.5">
            <span>✓ Dedicated Private Cab</span>
            <span>Fuel + Chauffeur Included</span>
          </div>
        </div>

        {/* Working Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-100">
          <button
            onClick={() => onViewItinerary(pkg)}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 py-2.5 px-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            <span>Day-by-Day Plan</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 py-2.5 px-3 rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Check Price</span>
          </a>
        </div>
      </div>
    </div>
  );
};
