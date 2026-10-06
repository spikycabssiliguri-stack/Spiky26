import { useState } from 'react';
import { X, Phone, MessageCircle, Calendar, Users, Car, Check, Shield, MapPin, Sparkles } from 'lucide-react';
import { RecommendedHotel } from '../data/hotelsData';
import { useCMS } from '../context/CMSContext';

interface HotelInquiryModalProps {
  hotel: RecommendedHotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HotelInquiryModal = ({ hotel, isOpen, onClose }: HotelInquiryModalProps) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [cabPreference, setCabPreference] = useState('innova');
  const [roomCategory, setRoomCategory] = useState(hotel?.roomTypes[0]?.name || 'Standard Deluxe');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !hotel) return null;

  const whatsappMessage = encodeURIComponent(
    `Hi Spiky Cabs, I would like to inquire about booking a Cab + Hotel package for ${hotel.name} (${hotel.regionLabel}).\n\n` +
    `• Hotel: ${hotel.name}\n` +
    `• Location: ${hotel.locationAddress}\n` +
    `• Room Preference: ${roomCategory}\n` +
    `• Check-in: ${checkInDate || 'Flexible'}\n` +
    `• Check-out: ${checkOutDate || 'Flexible'}\n` +
    `• Guests: ${guests}\n` +
    `• Cab Preference: ${cabPreference.toUpperCase()}\n` +
    (notes ? `• Special Requests: ${notes}\n` : '') +
    `\nPlease share the combined cab + hotel rate and availability.`
  );

  const whatsappUrl = `https://wa.me/${settings.rawPhone}?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send lead to server API
      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone,
          packageTitle: `Hotel & Cab Combo: ${hotel.name} (${hotel.destination})`,
          packageId: hotel.id,
          format: `Cab: ${cabPreference}, Dates: ${checkInDate} to ${checkOutDate}, Guests: ${guests}, Notes: ${notes}`
        })
      }).catch(() => {});
    } catch (e) {
      console.warn('Lead capture notice:', e);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect to WhatsApp with full details immediately
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-8">
        {/* Header Bar */}
        <div className="bg-neutral-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-1">
            <span>{hotel.brand} Hotels</span>
            <span>·</span>
            <span className="capitalize">{hotel.destination}</span>
            <span>·</span>
            <span className="text-amber-400 font-semibold">★ {hotel.starRating} Star</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {hotel.name}
          </h3>

          <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{hotel.locationAddress}</span>
          </p>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Tariff & Availability:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Check Price</span>
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-neutral-900">
                  Inquiry Received for {hotel.name}!
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Our Spiky Cabs concierge will connect with you on <strong className="text-neutral-900">{phone}</strong> within 15 minutes with verified room availability and dedicated cab combo pricing.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  >
                    <option value="1-2">1–2 Adults (Couple)</option>
                    <option value="3-4">3–4 Guests (Family)</option>
                    <option value="5-7">5–7 Guests (Large Group)</option>
                    <option value="8+">8+ Guests (Multiple Cabs)</option>
                  </select>
                </div>
              </div>

              {/* Room Type & Cab Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Preferred Room
                  </label>
                  <select
                    value={roomCategory}
                    onChange={(e) => setRoomCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  >
                    {hotel.roomTypes.map((rt, idx) => (
                      <option key={idx} value={rt.name}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Spiky Cab Vehicle
                  </label>
                  <select
                    value={cabPreference}
                    onChange={(e) => setCabPreference(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                  >
                    <option value="innova">Toyota Innova Crysta (Luxury 6-7 Seater)</option>
                    <option value="suv">Mahindra Scorpio / Ertiga (Mountain SUV)</option>
                    <option value="sedan">Swift Dzire (Comfort 4 Seater)</option>
                    <option value="none">Cab Not Needed (Hotel Only)</option>
                  </select>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Pickup Location & Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pickup from Bagdogra Airport (IXB) flight arrival at 1:30 PM, need Kanchenjunga view room..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Trust Badge */}
              <div className="bg-amber-50/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2 border border-amber-200/60">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Spiky Cabs Direct Booking Guarantee:</strong> Zero middlemen markups. Verified local hotel rates + private chauffeur airport/railway transfers bundled seamlessly.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors text-center cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'Request Cab + Stay Quote (WhatsApp)'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
