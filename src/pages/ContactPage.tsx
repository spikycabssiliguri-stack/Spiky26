import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, ChevronRight, Clock, Building2, Sparkles } from 'lucide-react';
import { COMPANY_INFO, PACKAGES_DATA } from '../data/packagesData';
import { useCMS } from '../context/CMSContext';

interface ContactPageProps {
  onNavigateHotels?: () => void;
}

export const ContactPage = ({ onNavigateHotels }: ContactPageProps) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings || COMPANY_INFO;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: 'Darjeeling',
    travelDate: '',
    passengers: '2',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const getDirectWhatsAppUrl = () => {
    const text = `Hi Spiky Cabs, I am contacting you regarding a cab package:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Destination: ${formData.destination}
- Planned Date: ${formData.travelDate || 'Flexible'}
- Travelers: ${formData.passengers} Pax
- Notes: ${formData.notes || 'None'}

Please share cab availability and tariff.`;
    return `https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      {/* Apple Keynote Stage Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            Direct Communications
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            We’re Here to Help.
          </h1>
          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed text-balance pt-2">
            Reach our Siliguri operations desk directly for cab bookings, airport pickups at Bagdogra (IXB), or customized Sikkim itineraries.
          </p>
        </div>
      </section>

      {/* Main Grid (Apple Store / Support Cards) */}
      <section className="py-16 sm:py-24 max-w-[1080px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Direct Details Card */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5ea] space-y-8">
            <div className="space-y-6">
              <div className="border-b border-[#f5f5f7] pb-6">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
                  Telephone & WhatsApp
                </span>
                <a
                  href={`tel:${settings.phone}`}
                  className="font-semibold text-2xl text-[#1d1d1f] hover:text-[#0071e3] transition-colors block font-mono"
                >
                  {settings.phone}
                </a>
                <p className="text-xs text-[#86868b] mt-1">
                  Desk hours: 6:00 AM – 11:00 PM IST daily
                </p>
                <div className="mt-3">
                  <a
                    href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20have%20an%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-normal text-[#0071e3] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Chat on WhatsApp</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              </div>

              <div className="border-b border-[#f5f5f7] pb-6">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
                  Email Desk
                </span>
                <a
                  href={`mailto:${settings.email}`}
                  className="font-semibold text-lg text-[#1d1d1f] hover:text-[#0071e3] transition-colors block"
                >
                  {settings.email}
                </a>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Secondary: {settings.altEmail}
                </p>
              </div>

              <div className="border-b border-[#f5f5f7] pb-6">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
                  Headquarters
                </span>
                <p className="font-medium text-sm text-[#1d1d1f] leading-snug">
                  {settings.address}
                </p>
                <p className="text-xs text-[#86868b] mt-1">
                  Opposite Janki Apartment, Haiderpara, Siliguri, West Bengal 734001
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                  Transit Gateways
                </span>
                <ul className="text-xs text-[#6e6e73] space-y-1.5 font-normal">
                  <li>• Bagdogra International Airport (IXB)</li>
                  <li>• New Jalpaiguri Railway Station (NJP)</li>
                  <li>• Siliguri Junction / Tenzing Norgay Stand</li>
                  <li>• Indo-Bhutan Phuentsholing Border Gate</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Card (Apple Clean Inputs) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5ea]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-2xl text-[#1d1d1f]">
                  Inquiry Received.
                </h3>
                <p className="text-sm text-[#6e6e73] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#1d1d1f]">{formData.name}</strong>. Our Siliguri dispatch team has registered your cab request.
                </p>
                <div className="pt-3">
                  <a
                    href={getDirectWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-normal transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Continue to WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-[#f5f5f7] pb-4 mb-4">
                  <h3 className="font-semibold text-xl text-[#1d1d1f]">
                    Request a Cab Package Quote
                  </h3>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    We respond within 15–30 minutes during desk hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                      Target Sector
                    </label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                    >
                      <option value="Darjeeling">Darjeeling (2N/3D or 4N/5D)</option>
                      <option value="Gangtok">Gangtok & Tsomgo Lake (3N/4D)</option>
                      <option value="North Sikkim">North Sikkim (Lachung & Yumthang)</option>
                      <option value="Kalimpong">Kalimpong (2N/3D)</option>
                      <option value="Bhutan">Bhutan Western Circuit (5N/6D)</option>
                      <option value="Custom">Custom Multi-Sector Itinerary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                      Tentative Date
                    </label>
                    <input
                      type="text"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      placeholder="e.g. 15th October 2026"
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                    Number of Travelers
                  </label>
                  <select
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                  >
                    <option value="1-2">1–2 Travelers (Executive Sedan / Swift Dzire)</option>
                    <option value="3-4">3–4 Travelers (Ertiga / Innova)</option>
                    <option value="5-6">5–6 Travelers (Innova Crysta / Scorpio 4x4)</option>
                    <option value="7+">7+ Travelers (Multiple Cabs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                    Route Notes or Flight Details
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide arrival flight/train numbers or special requests (e.g. Nathula permit)..."
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl p-3.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 text-xs font-normal transition-colors cursor-pointer"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Hotel Recommendations & Cab Pairing Banner */}
        {onNavigateHotels && (
          <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-800 shadow-xl">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Need Accommodation Guidance?</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Browse Our Curated Stays Across Darjeeling & Sikkim
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Not sure which property best suits your circuit? View our verified hotel guide featuring Summit Hotels, Sumi Yashshree, Taj Chia Kutir, and Rare Himalayas heritage estates with transparent tariffs and guaranteed private chauffeur drop-offs.
              </p>
            </div>

            <button
              onClick={onNavigateHotels}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0 inline-flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Explore Recommended Hotels</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
