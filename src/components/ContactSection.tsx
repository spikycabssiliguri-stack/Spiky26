import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, Send, Car, Shield } from 'lucide-react';
import { COMPANY_INFO, FLEET_DATA, PACKAGES_DATA } from '../data/packagesData';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    packageId: 'darjeeling-2n-3d',
    travelDate: '',
    paxCount: '2',
    vehiclePreference: 'Innova Crysta',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitted(true);
  };

  const getWhatsAppForwardUrl = () => {
    const pkg = PACKAGES_DATA.find((p) => p.id === formData.packageId);
    const text = `Hi Spiky Cabs, I submitted a booking enquiry:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email || 'N/A'}
- Selected Package: ${pkg ? pkg.title : formData.packageId}
- Travel Date: ${formData.travelDate || 'Flexible'}
- Travelers: ${formData.paxCount} Pax
- Vehicle: ${formData.vehiclePreference}
- Notes: ${formData.notes || 'None'}

Please confirm availability and share quote.`;
    return `https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-neutral-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Company Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-semibold text-orange-400 tracking-wider uppercase mb-2">
                Get In Touch
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-white mb-4">
                Let's Make Your Next Himalayan Adventure Unforgettable
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                Headquartered in Siliguri—the gateway to North Bengal, Sikkim, and Bhutan. We monitor incoming trains at NJP and flights at Bagdogra Airport to ensure seamless, punctual pickups.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 hover:border-orange-500/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Direct Call & Urgent Support</div>
                  <div className="font-heading font-bold text-base text-white mt-0.5">
                    {COMPANY_INFO.phone}
                  </div>
                  <div className="text-[11px] text-neutral-400">Available 6:00 AM – 11:00 PM daily</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20have%20an%20inquiry%20regarding%20cab%20packages.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 hover:border-emerald-500/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Official WhatsApp Dispatch</div>
                  <div className="font-heading font-bold text-base text-white mt-0.5">
                    +91 75860 47996
                  </div>
                  <div className="text-[11px] text-neutral-400">Instant quotes, itinerary PDFs & driver contact</div>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 hover:border-orange-500/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Email Inquiries</div>
                  <div className="font-heading font-bold text-sm text-white mt-0.5">
                    {COMPANY_INFO.email}
                  </div>
                  <div className="text-[11px] text-neutral-400">Secondary: {COMPANY_INFO.altEmail}</div>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
                <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Office Location</div>
                  <div className="font-semibold text-sm text-white mt-0.5">
                    {COMPANY_INFO.address}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Siliguri Hub covering IXB Airport, NJP Station & Dooars Gateway
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Request Form Column */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Cab Enquiry Registered!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our dispatch desk has received your request for <strong className="text-white">{formData.paxCount} travelers</strong>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppForwardUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open Direct in WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-neutral-400 hover:text-white py-2 px-4"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-neutral-800 pb-3 mb-4">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Request Cab Package Quotation
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Get fixed, transparent cab pricing with no hidden driver or fuel fees.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Select Package Itinerary
                    </label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {PACKAGES_DATA.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.title} ({pkg.durationNights}N/{pkg.durationDays}D)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Travel Date / Month
                    </label>
                    <input
                      type="text"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      placeholder="e.g. 15th April 2026"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      No. of Travelers
                    </label>
                    <select
                      value={formData.paxCount}
                      onChange={(e) => setFormData({ ...formData, paxCount: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="1-2">1–2 Pax (Couple)</option>
                      <option value="3-4">3–4 Pax (Small Family)</option>
                      <option value="5-6">5–6 Pax</option>
                      <option value="7+">7+ Pax (Group / 2 Cabs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Preferred Vehicle
                    </label>
                    <select
                      value={formData.vehiclePreference}
                      onChange={(e) => setFormData({ ...formData, vehiclePreference: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Toyota Innova Crysta">Innova Crysta (Premium)</option>
                      <option value="Maruti Ertiga">Maruti Ertiga (MUV)</option>
                      <option value="Mahindra Scorpio / Bolero">Bolero / Scorpio (Rugged)</option>
                      <option value="Swift Dzire">Swift Dzire (Sedan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Special Requests or Flight/Train Details
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Flight arriving at Bagdogra at 1:30 PM, need Nathula Pass permit included, child on board..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Cab Booking Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
