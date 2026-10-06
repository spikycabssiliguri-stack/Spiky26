import { useState } from 'react';
import { Calculator, Check, ArrowRight, MessageCircle, MapPin, Users, Calendar, Sparkles } from 'lucide-react';
import { COMPANY_INFO, FLEET_DATA } from '../data/packagesData';

export const CustomPackageBuilder = () => {
  const [pickupHub, setPickupHub] = useState('Bagdogra Airport (IXB)');
  const [destinations, setDestinations] = useState<string[]>(['Darjeeling', 'Gangtok']);
  const [selectedVehicleId, setSelectedVehicleId] = useState('innova-crysta');
  const [nights, setNights] = useState(4);
  const [passengers, setPassengers] = useState(4);
  const [travelMonth, setTravelMonth] = useState('April 2026');

  const availablePlaces = [
    { id: 'Darjeeling', name: 'Darjeeling & Tiger Hill', baseDays: 2 },
    { id: 'Gangtok', name: 'Gangtok & Changu Lake', baseDays: 2 },
    { id: 'North Sikkim', name: 'North Sikkim (Lachung/Yumthang)', baseDays: 2 },
    { id: 'Kalimpong', name: 'Kalimpong & Deolo', baseDays: 1 },
    { id: 'Mirik', name: 'Mirik Lake & Tea Gardens', baseDays: 1 },
    { id: 'Bhutan', name: 'Bhutan Western Circuit', baseDays: 4 },
  ];

  const toggleDestination = (destId: string) => {
    if (destinations.includes(destId)) {
      if (destinations.length > 1) {
        setDestinations(destinations.filter((d) => d !== destId));
      }
    } else {
      setDestinations([...destinations, destId]);
    }
  };

  // Calculate estimated cab cost
  const selectedVehicle = FLEET_DATA.find((v) => v.id === selectedVehicleId) || FLEET_DATA[0];
  const days = nights + 1;
  const estimatedCabCost = Math.round(selectedVehicle.baseRatePerDay * days * 0.95);

  const whatsappMessage = `Hi Spiky Cabs, I used your website Custom Cab Builder to design an itinerary:
- Pickup Hub: ${pickupHub}
- Destinations: ${destinations.join(' + ')}
- Duration: ${nights} Nights / ${days} Days
- Passengers: ${passengers} Pax
- Vehicle Choice: ${selectedVehicle.name} (${selectedVehicle.category})
- Tariff Quote: Please share best seasonal price quote on WhatsApp
- Planned Travel Date: ${travelMonth}

Please review this customized route and send me an official cab itinerary quote.`;

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="builder" className="py-16 md:py-24 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12">
          {/* Editorial natural numbering / kicker */}
          <div className="text-xs font-semibold text-sky-400 tracking-wider uppercase mb-2">
            Interactive Cab Planner
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-white mb-4">
            Build Your Custom Himalayan Cab Route
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Need a mixed itinerary like 2 nights Darjeeling followed by 3 nights Sikkim or a cross-border Bhutan tour? Pick your destinations and preferred vehicle below to calculate an instant cab budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Pickup */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-5 sm:p-6">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                01. Pickup & Drop Gateway
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Bagdogra Airport (IXB)',
                  'New Jalpaiguri (NJP)',
                  'Siliguri Town',
                ].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => setPickupHub(hub)}
                    className={`p-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      pickupHub === hub
                        ? 'border-[#0071e3] bg-blue-600/10 text-white font-bold'
                        : 'border-neutral-700 text-neutral-300 hover:border-neutral-600 bg-neutral-850'
                    }`}
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Destinations */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  02. Select Destinations to Combine
                </label>
                <span className="text-[11px] text-sky-400">
                  {destinations.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availablePlaces.map((place) => {
                  const isChecked = destinations.includes(place.id);
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => toggleDestination(place.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#0071e3] bg-blue-600/15 text-white'
                          : 'border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-xs font-medium">{place.name}</span>
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                          isChecked ? 'bg-[#0071e3] text-white' : 'border border-neutral-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Vehicle Preference */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-5 sm:p-6">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                03. Choose Cab / Vehicle Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FLEET_DATA.map((fleet) => (
                  <button
                    key={fleet.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(fleet.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedVehicleId === fleet.id
                        ? 'border-[#0071e3] bg-blue-600/15 ring-1 ring-[#0071e3]'
                        : 'border-neutral-700 hover:border-neutral-600 bg-neutral-850'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span>{fleet.category}</span>
                      <span>{fleet.capacity}</span>
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{fleet.name}</div>
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Best Rate on WhatsApp</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Nights & Travelers */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Trip Duration
                </label>
                <select
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0071e3]"
                >
                  <option value={2}>2 Nights / 3 Days</option>
                  <option value={3}>3 Nights / 4 Days</option>
                  <option value={4}>4 Nights / 5 Days</option>
                  <option value={5}>5 Nights / 6 Days</option>
                  <option value={6}>6 Nights / 7 Days</option>
                  <option value={7}>7 Nights / 8 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0071e3]"
                >
                  <option value={2}>2 Passengers (Couple)</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers (Family)</option>
                  <option value={5}>5 Passengers</option>
                  <option value={6}>6–7 Passengers (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Travel Month
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="April 2026">April 2026 (Spring)</option>
                  <option value="May 2026">May 2026 (Summer)</option>
                  <option value="June 2026">June 2026</option>
                  <option value="October 2026">October 2026 (Puja Peak)</option>
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026 (Winter Snow)</option>
                  <option value="March 2027">March 2027</option>
                  <option value="April 2027">April 2027</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Card */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 lg:p-7 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
              <div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  Custom Quotation Summary
                </div>
                <div className="font-heading font-bold text-lg text-white mt-0.5">
                  Spiky Cabs Hill Package
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            {/* Breakdown items */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Pickup Gateway:</span>
                <span className="font-medium text-white text-right">{pickupHub}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Circuit Destinations:</span>
                <span className="font-medium text-sky-400 text-right max-w-[200px] truncate">
                  {destinations.join(' → ')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Package Duration:</span>
                <span className="font-medium text-white">{nights} Nights / {days} Days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Vehicle Type:</span>
                <span className="font-medium text-white">{selectedVehicle.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Party Size:</span>
                <span className="font-medium text-white">{passengers} Travelers</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-850">
                <span className="text-neutral-400">Fuel & Chauffeur:</span>
                <span className="text-emerald-400 font-semibold">Included 100%</span>
              </div>
            </div>

            {/* Price Estimate */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
              <div className="text-xs text-neutral-400 mb-1">Custom Package Tariff</div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                  Best Price on WhatsApp
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 mt-1">
                Seasonal hill discounts applied. Includes private cab, hill chauffeur, fuel, parking & Sikkim permits.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Check Price</span>
              </a>

              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl transition-all"
              >
                <span>Call Hill Specialist ({COMPANY_INFO.phone})</span>
              </a>
            </div>

            <p className="text-[10px] text-neutral-500 text-center mt-4">
              Final quote subject to seasonal peak dates & high altitude army permits. No advance needed for quotation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
