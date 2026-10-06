import { useState } from 'react';
import { X, Printer, MessageCircle, Phone, Check, AlertCircle, Shield, Compass, ChevronRight } from 'lucide-react';
import { CabPackage, COMPANY_INFO, INCLUSIONS_LIST, EXCLUSIONS_LIST, ROUTE_CHANGE_POLICY } from '../data/packagesData';

interface ItineraryModalProps {
  pkg: CabPackage | null;
  onClose: () => void;
}

export const ItineraryModal = ({ pkg, onClose }: ItineraryModalProps) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'fleet'>('itinerary');
  const [selectedVehicle, setSelectedVehicle] = useState<'sedan' | 'suv' | 'innova'>('innova');

  if (!pkg) return null;

  const getVehiclePrice = () => {
    if (selectedVehicle === 'sedan') return pkg.startingPrice.sedan;
    if (selectedVehicle === 'suv') return pkg.startingPrice.suv;
    return pkg.startingPrice.innova;
  };

  const getVehicleName = () => {
    if (selectedVehicle === 'sedan') return 'Sedan (Swift Dzire / Etios)';
    if (selectedVehicle === 'suv') return 'MUV (Maruti Ertiga / Bolero)';
    return 'Premium SUV (Toyota Innova Crysta)';
  };

  const whatsappText = `Hi Spiky Cabs, I would like to check prices and book the "${pkg.title}" (${pkg.durationNights}N/${pkg.durationDays}D) with ${getVehicleName()}. Please share current seasonal rates, cab availability, and quotation.`;
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(whatsappText)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xl overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e5e5ea] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Apple Sheet Header */}
        <div className="relative bg-[#1d1d1f] text-white p-6 sm:p-8 overflow-hidden">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                <span>Spiky Cabs Official Tour Itinerary</span>
                <span aria-hidden="true">·</span>
                <span>Valid Till {pkg.offerValidity}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-1">
                {pkg.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a1a1a6]">
                <span className="font-medium text-white">{pkg.durationNights} Nights | {pkg.durationDays} Days</span>
                <span aria-hidden="true">·</span>
                <span>Gateway: {pkg.pickupDrop}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Apple Segmented Bar */}
          <div className="relative z-10 flex items-center gap-2 mt-6 border-b border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`pb-3 px-3 transition-colors border-b-2 font-medium cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'border-[#0071e3] text-white font-semibold'
                  : 'border-transparent text-[#86868b] hover:text-white'
              }`}
            >
              Day Schedule
            </button>
            <button
              onClick={() => setActiveTab('inclusions')}
              className={`pb-3 px-3 transition-colors border-b-2 font-medium cursor-pointer ${
                activeTab === 'inclusions'
                  ? 'border-[#0071e3] text-white font-semibold'
                  : 'border-transparent text-[#86868b] hover:text-white'
              }`}
            >
              Inclusions & Exclusions
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`pb-3 px-3 transition-colors border-b-2 font-medium cursor-pointer ${
                activeTab === 'fleet'
                  ? 'border-[#0071e3] text-white font-semibold'
                  : 'border-transparent text-[#86868b] hover:text-white'
              }`}
            >
              Vehicle Fares & Booking
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6 print:max-h-none bg-white">
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Route Summary */}
              <div className="bg-[#f5f5f7] rounded-2xl p-5 text-xs text-[#1d1d1f] flex items-start gap-3 border border-[#e5e5ea]">
                <Compass className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-[#1d1d1f]">Route: {pkg.subtitle}</div>
                  <p className="text-[#6e6e73] leading-relaxed">{pkg.overview}</p>
                  {pkg.permitRequired && (
                    <div className="mt-2 pt-2 border-t border-[#d2d2d7] text-[#1d1d1f] font-normal">
                      <strong className="font-semibold text-[#0071e3]">Permit Note:</strong> {pkg.permitDetails}
                    </div>
                  )}
                </div>
              </div>

              {/* Day by Day Cards */}
              <div className="space-y-4">
                {pkg.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="border border-[#e5e5ea] rounded-2xl p-5 hover:border-[#d2d2d7] transition-colors bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f5f5f7] pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#1d1d1f] text-white font-semibold text-xs flex items-center justify-center shrink-0 font-mono">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="font-semibold text-base text-[#1d1d1f]">
                            {day.routeTitle}
                          </h4>
                          <span className="text-xs text-[#86868b] font-normal">
                            {day.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#86868b] shrink-0">
                        {day.altitude && (
                          <span className="bg-[#f5f5f7] px-2.5 py-1 rounded-full text-[11px] font-mono text-[#1d1d1f]">
                            Alt: {day.altitude}
                          </span>
                        )}
                        <span>
                          Stay: <strong className="text-[#1d1d1f] font-medium">{day.stayLocation}</strong>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#424245] leading-relaxed mb-4 whitespace-pre-line font-normal">
                      {day.description}
                    </p>

                    <div>
                      <div className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                        Key Sights Covered
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {day.sightseeingPoints.map((pt, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-3 py-1 rounded-full border border-[#e5e5ea]"
                          >
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="bg-[#f5f5f7] rounded-2xl p-6 border border-[#e5e5ea]">
                  <h4 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2 mb-4">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Inclusions (Included in Cab Package)</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#424245]">
                    {INCLUSIONS_LIST.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-[#f5f5f7] rounded-2xl p-6 border border-[#e5e5ea]">
                  <h4 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-[#86868b]" />
                    <span>Exclusions (Not Included)</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#424245]">
                    {EXCLUSIONS_LIST.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#86868b] font-bold shrink-0 mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Route Change Policy */}
              <div className="border border-[#e5e5ea] bg-white rounded-2xl p-5 text-xs text-[#1d1d1f]">
                <div className="font-semibold text-[#1d1d1f] mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0071e3]" />
                  <span>Mountain Road & Route Change Policy</span>
                </div>
                <p className="text-[#6e6e73] leading-relaxed">
                  {ROUTE_CHANGE_POLICY}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-base text-[#1d1d1f] mb-1">
                  Select Vehicle Category
                </h4>
                <p className="text-xs text-[#86868b] mb-4">
                  Includes sanitized car, verified hill chauffeur, and fuel for agreed itinerary.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedVehicle('sedan')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedVehicle === 'sedan'
                        ? 'border-[#0071e3] bg-[#f5f5f7] ring-1 ring-[#0071e3]'
                        : 'border-[#e5e5ea] hover:border-[#d2d2d7]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold text-[#86868b] uppercase">Executive Sedan</div>
                    <div className="font-semibold text-[#1d1d1f] text-sm mt-0.5">Swift Dzire / Etios</div>
                    <div className="text-xs text-[#86868b] mt-1">Up to 4 Pax · 2 Bags</div>
                    <div className="mt-3 pt-3 border-t border-[#e5e5ea] font-semibold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                      Price on WhatsApp
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedVehicle('suv')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedVehicle === 'suv'
                        ? 'border-[#0071e3] bg-[#f5f5f7] ring-1 ring-[#0071e3]'
                        : 'border-[#e5e5ea] hover:border-[#d2d2d7]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold text-[#86868b] uppercase">Comfort MUV / 4x4</div>
                    <div className="font-semibold text-[#1d1d1f] text-sm mt-0.5">Ertiga / Bolero</div>
                    <div className="text-xs text-[#86868b] mt-1">Up to 6 Pax · 4 Bags</div>
                    <div className="mt-3 pt-3 border-t border-[#e5e5ea] font-semibold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                      Price on WhatsApp
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedVehicle('innova')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedVehicle === 'innova'
                        ? 'border-[#0071e3] bg-[#f5f5f7] ring-1 ring-[#0071e3]'
                        : 'border-[#e5e5ea] hover:border-[#d2d2d7]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold text-[#0071e3] uppercase">Premium Hill Ride</div>
                    <div className="font-semibold text-[#1d1d1f] text-sm mt-0.5">Innova Crysta</div>
                    <div className="text-xs text-[#86868b] mt-1">6–7 Pax · Luxury Seats</div>
                    <div className="mt-3 pt-3 border-t border-[#e5e5ea] font-semibold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                      Price on WhatsApp
                    </div>
                  </button>
                </div>
              </div>

              {/* Direct Booking Summary */}
              <div className="bg-[#1d1d1f] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#86868b]">Selected Itinerary</div>
                  <div className="font-semibold text-lg text-white">
                    {pkg.title} · {getVehicleName()}
                  </div>
                  <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Seasonal Discount Available · Get Best Rate on WhatsApp</span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 text-xs font-semibold transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Check Price</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-[#f5f5f7] border-t border-[#e5e5ea] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rounded-full bg-white border border-[#d2d2d7] hover:bg-neutral-100 text-[#1d1d1f] px-4 py-2 text-xs font-normal transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] font-mono ml-2 hidden sm:inline-block"
            >
              {COMPANY_INFO.phone}
            </a>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] py-2 px-3 cursor-pointer"
            >
              Close
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-2 px-5 text-xs font-normal transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
            >
              <span>Confirm on WhatsApp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
