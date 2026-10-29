import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Car, 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Share2, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ChevronDown, 
  Compass, 
  RefreshCw, 
  FileText,
  DollarSign,
  ShieldCheck,
  Send,
  MessageCircle,
  Copy
} from 'lucide-react';
import { 
  CRMMasterData, 
  CRMLead, 
  CRMItinerary, 
  CRMItineraryDay, 
  CRMItineraryAddon,
  CRMVehicle,
  CRMServiceRate,
  CRMHotel,
  CRMRoomCategory
} from '../../types/crm';
import { saveCRMItinerary, generateWithGemini } from '../../services/api';
import { QuotationModal } from './QuotationModal';

interface ItineraryBuilderViewProps {
  masterData: CRMMasterData;
  initialLead?: CRMLead | null;
  onClearInitialLead?: () => void;
  onItinerarySaved?: (itinerary: CRMItinerary) => void;
  userRole: 'admin' | 'agent';
  userName: string;
}

export const ItineraryBuilderView = ({
  masterData,
  initialLead,
  onClearInitialLead,
  onItinerarySaved,
  userRole,
  userName
}: ItineraryBuilderViewProps) => {
  // Client & Tour basic info
  const [guestName, setGuestName] = useState(initialLead?.name || '');
  const [guestPhone, setGuestPhone] = useState(initialLead?.phone || '');
  const [guestEmail, setGuestEmail] = useState(initialLead?.email || '');
  const [guestCity, setGuestCity] = useState(initialLead?.city || '');
  const [travelStartDate, setTravelStartDate] = useState(
    initialLead?.travelStartDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [durationNights, setDurationNights] = useState<number>(initialLead?.durationNights || 4);
  const [adults, setAdults] = useState<number>(initialLead?.adults || 2);
  const [children, setChildren] = useState<number>(initialLead?.children || 0);
  const [infants, setInfants] = useState<number>(initialLead?.infants || 0);

  // Vehicle selection
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<'4-Seater' | '6-Seater' | 'Luxury Crysta' | 'Tempo Traveller'>(
    (initialLead?.adults || 2) > 4 ? '6-Seater' : '4-Seater'
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-sedan');

  // Days list
  const [days, setDays] = useState<CRMItineraryDay[]>([]);
  // Add-ons (e.g. Nathula Pass, Zero Point)
  const [addons, setAddons] = useState<CRMItineraryAddon[]>([]);

  // Margin and Pricing rules
  const [marginPercent, setMarginPercent] = useState<number>(masterData.pricingRules.defaultMarginPercent || 15);
  const [agentDiscount, setAgentDiscount] = useState<number>(0);
  const gstPercent = masterData.pricingRules.gstPercent || 5;

  // Inclusions, exclusions and terms
  const [inclusions, setInclusions] = useState<string[]>(masterData.pricingRules.defaultInclusions || []);
  const [exclusions, setExclusions] = useState<string[]>(masterData.pricingRules.defaultExclusions || []);
  const [terms, setTerms] = useState<string>(masterData.pricingRules.termsAndConditions || '');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState<number | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<CRMItinerary | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Sync when initialLead changes
  useEffect(() => {
    if (initialLead) {
      setGuestName(initialLead.name);
      setGuestPhone(initialLead.phone);
      setGuestEmail(initialLead.email || '');
      setGuestCity(initialLead.city || '');
      if (initialLead.travelStartDate) setTravelStartDate(initialLead.travelStartDate);
      if (initialLead.durationNights) setDurationNights(initialLead.durationNights);
      if (initialLead.adults) setAdults(initialLead.adults);
      if (initialLead.children) setChildren(initialLead.children);

      const category = initialLead.adults > 4 ? '6-Seater' : '4-Seater';
      setSelectedVehicleCategory(category);
      setSelectedVehicleId(category === '6-Seater' ? 'veh-suv' : 'veh-sedan');

      // Auto-load matching template or initialize default days
      loadDefaultDaysForDuration(initialLead.durationNights || 4, category);
    } else if (days.length === 0) {
      loadDefaultDaysForDuration(4, '4-Seater');
    }
  }, [initialLead]);

  // Update vehicle ID when category changes
  const handleCategoryChange = (cat: '4-Seater' | '6-Seater' | 'Luxury Crysta' | 'Tempo Traveller') => {
    setSelectedVehicleCategory(cat);
    const found = masterData.vehicles.find(v => v.category === cat && v.isActive);
    if (found) {
      setSelectedVehicleId(found.id);
    }

    // Re-evaluate day service costs for the new vehicle
    setDays(prevDays => prevDays.map(day => {
      if (!day.serviceId) return day;
      const srv = masterData.serviceRates.find(s => s.id === day.serviceId);
      if (!srv) return day;
      const cost = (cat === '6-Seater' || cat === 'Luxury Crysta') ? srv.sixSeaterRate : srv.fourSeaterRate;
      return { ...day, serviceCost: cost };
    }));
  };

  const getVehicleName = () => {
    const v = masterData.vehicles.find(veh => veh.id === selectedVehicleId);
    return v ? v.name : (selectedVehicleCategory === '6-Seater' ? 'Ertiga / Bolero (4x4)' : 'Swift Dzire / WagonR');
  };

  // Helper to initialize days from scratch or duration
  const loadDefaultDaysForDuration = (nights: number, vehicleCat: '4-Seater' | '6-Seater') => {
    const totalDays = nights + 1;
    const is6Seater = vehicleCat === '6-Seater';

    // Try finding template with matching nights
    const template = masterData.templates.find(t => t.durationNights === nights && t.isActive) || masterData.templates[0];
    if (template) {
      loadFromTemplate(template);
      return;
    }

    // Fallback: build default days
    const newDays: CRMItineraryDay[] = [];
    for (let i = 1; i <= totalDays; i++) {
      let title = `Day ${i}: Scenic Himalayan Mountain Tour`;
      let destination = i <= 2 ? 'Darjeeling' : 'Gangtok';
      let serviceId = i === 1 ? 'srv-darj-pickup' : i === totalDays ? 'srv-sikkim-gangtok-drop' : 'srv-darj-sightseeing';
      const srv = masterData.serviceRates.find(s => s.id === serviceId);
      const serviceCost = srv ? (is6Seater ? srv.sixSeaterRate : srv.fourSeaterRate) : 3500;

      // Default hotel
      const defaultHotel = masterData.hotels.find(h => h.destination.toLowerCase() === destination.toLowerCase() && h.isActive) || masterData.hotels[0];
      const defaultRoom = defaultHotel?.roomCategories?.[0];
      const roomCost = defaultHotel?.rates?.[0]?.b2bRate || 4500;

      newDays.push({
        dayNumber: i,
        title,
        destination,
        serviceId,
        serviceName: srv?.serviceName || 'Mountain Transfer',
        serviceCost,
        viaRouteId: '',
        viaRouteName: '',
        viaRouteCost: 0,
        sightseeingPoints: [],
        hotelId: i < totalDays ? defaultHotel?.id : undefined,
        hotelName: i < totalDays ? defaultHotel?.name : undefined,
        roomCategoryId: i < totalDays ? defaultRoom?.id : undefined,
        roomCategoryName: i < totalDays ? defaultRoom?.name : undefined,
        mealPlan: 'CP',
        numberOfRooms: 1,
        roomCostPerNight: i < totalDays ? roomCost : 0,
        hotelTotalCost: i < totalDays ? roomCost : 0,
        description: `Explore the breathtaking vistas of ${destination} with private mountain chauffeur.`
      });
    }
    setDays(newDays);
  };

  const loadFromTemplate = (template: typeof masterData.templates[0]) => {
    const is6Seater = selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta';
    setDurationNights(template.durationNights);

    const mappedDays: CRMItineraryDay[] = template.dayWiseTemplates.map((tDay) => {
      const srv = tDay.serviceId ? masterData.serviceRates.find(s => s.id === tDay.serviceId) : undefined;
      const srvCost = srv ? (is6Seater ? srv.sixSeaterRate : srv.fourSeaterRate) : 0;

      const via = tDay.viaRouteId ? masterData.viaRoutes.find(v => v.id === tDay.viaRouteId) : undefined;
      const viaCost = via ? (is6Seater ? via.additionalRate6Seater : via.additionalRate4Seater) : 0;

      // Find hotel in destination
      const hotelDest = tDay.defaultHotelDestination || tDay.destination;
      const hotel = masterData.hotels.find(h => h.destination.toLowerCase() === hotelDest.toLowerCase() && h.isActive);
      const room = hotel?.roomCategories?.[0];
      const roomCost = hotel?.rates?.[0]?.b2bRate || 4200;
      const isLastDay = tDay.dayNumber === template.durationDays;

      return {
        dayNumber: tDay.dayNumber,
        title: tDay.title,
        destination: tDay.destination,
        serviceId: tDay.serviceId,
        serviceName: srv?.serviceName,
        serviceCost: srvCost,
        viaRouteId: tDay.viaRouteId,
        viaRouteName: via?.viaName,
        viaRouteCost: viaCost,
        sightseeingPoints: tDay.sightseeingPoints || [],
        hotelId: !isLastDay ? hotel?.id : undefined,
        hotelName: !isLastDay ? hotel?.name : undefined,
        roomCategoryId: !isLastDay ? room?.id : undefined,
        roomCategoryName: !isLastDay ? room?.name : undefined,
        mealPlan: 'CP',
        numberOfRooms: 1,
        roomCostPerNight: !isLastDay ? roomCost : 0,
        hotelTotalCost: !isLastDay ? roomCost : 0,
        description: `${tDay.morning}\n\n${tDay.afternoon}\n\n${tDay.evening}`
      };
    });

    setDays(mappedDays);
    setTemplateModalOpen(false);
  };

  // Add / Remove Day
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const is6Seater = selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta';
    const lastDay = days[days.length - 1];
    const destination = lastDay?.destination || 'Gangtok';
    const srv = masterData.serviceRates.find(s => s.destination.toLowerCase() === destination.toLowerCase()) || masterData.serviceRates[0];
    const srvCost = srv ? (is6Seater ? srv.sixSeaterRate : srv.fourSeaterRate) : 4000;

    const newDay: CRMItineraryDay = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing in ${destination}`,
      destination,
      serviceId: srv?.id,
      serviceName: srv?.serviceName,
      serviceCost: srvCost,
      viaRouteId: '',
      viaRouteName: '',
      viaRouteCost: 0,
      sightseeingPoints: [],
      numberOfRooms: 1,
      roomCostPerNight: 0,
      hotelTotalCost: 0,
      description: `Leisure day and local sightseeing in ${destination}.`
    };

    setDays([...days, newDay]);
    setDurationNights(days.length); // updates nights
  };

  const handleRemoveDay = (dayIndex: number) => {
    if (days.length <= 1) return;
    const updated = days.filter((_, idx) => idx !== dayIndex).map((d, i) => ({
      ...d,
      dayNumber: i + 1
    }));
    setDays(updated);
    setDurationNights(updated.length - 1);
  };

  // Update day details
  const updateDayField = (index: number, field: keyof CRMItineraryDay, value: any) => {
    setDays(prev => {
      const next = [...prev];
      const day = { ...next[index], [field]: value };

      // If service changed, update cost automatically
      if (field === 'serviceId') {
        const srv = masterData.serviceRates.find(s => s.id === value);
        if (srv) {
          const is6Seater = selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta';
          day.serviceName = srv.serviceName;
          day.serviceCost = is6Seater ? srv.sixSeaterRate : srv.fourSeaterRate;
          day.destination = srv.destination;
        } else {
          day.serviceName = '';
          day.serviceCost = 0;
        }
      }

      // If viaRoute changed, update via cost
      if (field === 'viaRouteId') {
        const via = masterData.viaRoutes.find(v => v.id === value);
        if (via) {
          const is6Seater = selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta';
          day.viaRouteName = via.viaName;
          day.viaRouteCost = is6Seater ? via.additionalRate6Seater : via.additionalRate4Seater;
        } else {
          day.viaRouteName = '';
          day.viaRouteCost = 0;
        }
      }

      // If hotel changed, update hotel room categories & default cost
      if (field === 'hotelId') {
        const hotel = masterData.hotels.find(h => h.id === value);
        if (hotel) {
          day.hotelName = hotel.name;
          const firstRoom = hotel.roomCategories?.[0];
          day.roomCategoryId = firstRoom?.id;
          day.roomCategoryName = firstRoom?.name;
          const rate = hotel.rates?.[0]?.b2bRate || 4000;
          day.roomCostPerNight = rate;
          day.hotelTotalCost = rate * (day.numberOfRooms || 1);
        } else {
          day.hotelName = '';
          day.roomCategoryId = '';
          day.roomCategoryName = '';
          day.roomCostPerNight = 0;
          day.hotelTotalCost = 0;
        }
      }

      // If room category changed
      if (field === 'roomCategoryId') {
        const hotel = masterData.hotels.find(h => h.id === day.hotelId);
        const room = hotel?.roomCategories.find(r => r.id === value);
        if (room && hotel) {
          day.roomCategoryName = room.name;
          day.mealPlan = room.mealPlan;
          const rateObj = hotel.rates.find(r => r.roomCategoryId === room.id);
          const rate = rateObj?.b2bRate || 4000;
          day.roomCostPerNight = rate;
          day.hotelTotalCost = rate * (day.numberOfRooms || 1);
        }
      }

      // If room count or cost per night changed
      if (field === 'numberOfRooms' || field === 'roomCostPerNight') {
        const rooms = field === 'numberOfRooms' ? Number(value) : day.numberOfRooms;
        const cost = field === 'roomCostPerNight' ? Number(value) : day.roomCostPerNight;
        day.hotelTotalCost = rooms * cost;
      }

      next[index] = day;
      return next;
    });
  };

  // Preloaded Addon Toggle (e.g. Nathula Pass requirement)
  const toggleNathulaAddon = () => {
    const exists = addons.find(a => a.id === 'addon-nathula');
    if (exists) {
      setAddons(addons.filter(a => a.id !== 'addon-nathula'));
    } else {
      // 4 Seater: ₹1,000 per person; 6 Seater: ₹3,000 per person as per requirement #5
      const is6Seater = selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta';
      const perPersonRate = is6Seater ? 3000 : 1000;
      const totalPax = adults + children;
      const total = perPersonRate * totalPax;

      setAddons([
        ...addons,
        {
          id: 'addon-nathula',
          name: `Nathula Pass Indo-China Border Permit (${is6Seater ? '6-Seater' : '4-Seater'} @ ₹${perPersonRate.toLocaleString('en-IN')}/pax)`,
          rate: perPersonRate,
          unit: 'per_person',
          quantity: totalPax,
          total
        }
      ]);
    }
  };

  const toggleZeroPointAddon = () => {
    const exists = addons.find(a => a.id === 'addon-zeropoint');
    if (exists) {
      setAddons(addons.filter(a => a.id !== 'addon-zeropoint'));
    } else {
      setAddons([
        ...addons,
        {
          id: 'addon-zeropoint',
          name: 'Zero Point (Yumesamdong 15,300 ft Snow Field) Excursion',
          rate: 3500,
          unit: 'per_vehicle',
          quantity: 1,
          total: 3500
        }
      ]);
    }
  };

  // Google AI Studio Gemini Polish Assistant for a specific Day
  const handleAiPolishDay = async (dayIndex: number) => {
    const targetDay = days[dayIndex];
    setIsAiLoading(dayIndex);
    try {
      const prompt = `Write a vivid, engaging, professional travel itinerary description for Day ${targetDay.dayNumber}: "${targetDay.title}" in ${targetDay.destination}.
Service: ${targetDay.serviceName || 'Mountain Tour'}
Stay Hotel: ${targetDay.hotelName || 'Himalayan Boutique Hotel'}
Vehicle: ${getVehicleName()}
Include morning departure highlights, scenic stops, photography tips, and evening tea/leisure recommendations. Keep it under 140 words, broken into Morning, Afternoon, and Evening.`;

      const data = await generateWithGemini(prompt);
      if (data && data.text) {
        updateDayField(dayIndex, 'description', data.text.trim());
      }
    } catch (err: any) {
      alert(`AI Assistant notice: ${err?.message || 'Could not connect to Gemini'}`);
    } finally {
      setIsAiLoading(null);
    }
  };

  // Calculate Prices Automatically
  const calculatePricing = () => {
    const vehicleTotal = days.reduce((sum, d) => sum + (Number(d.serviceCost) || 0) + (Number(d.viaRouteCost) || 0), 0);
    const hotelTotal = days.reduce((sum, d) => sum + (Number(d.hotelTotalCost) || 0), 0);
    const addonsTotal = addons.reduce((sum, a) => sum + (Number(a.total) || 0), 0);

    const subtotal = vehicleTotal + hotelTotal + addonsTotal;
    const marginAmount = Math.round(subtotal * (marginPercent / 100));
    const taxableAmount = Math.max(0, subtotal + marginAmount - (Number(agentDiscount) || 0));
    const gstAmount = Math.round(taxableAmount * (gstPercent / 100));
    const grandTotal = taxableAmount + gstAmount;

    return {
      vehicleTotal,
      hotelTotal,
      addonsTotal,
      subtotal,
      marginPercent,
      marginAmount,
      agentDiscount,
      taxableAmount,
      gstPercent,
      gstAmount,
      grandTotal
    };
  };

  const pricing = calculatePricing();

  // Save Itinerary
  const handleSaveItinerary = async () => {
    if (!guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    setIsSaving(true);
    setSavedSuccessMsg(null);

    const itineraryPayload: Partial<CRMItinerary> = {
      leadId: initialLead?.id,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim(),
      city: guestCity.trim(),
      travelStartDate,
      durationNights,
      durationDays: days.length,
      adults,
      children,
      infants,
      vehicleId: selectedVehicleId,
      vehicleName: getVehicleName(),
      vehicleCategory: selectedVehicleCategory,
      days,
      addons,
      pricing,
      inclusions,
      exclusions,
      termsAndConditions: terms,
      assignedAgentName: userName,
      status: 'Draft'
    };

    try {
      const res = await saveCRMItinerary(itineraryPayload);
      if (res && res.itinerary) {
        setCurrentQuotation(res.itinerary);
        onItinerarySaved?.(res.itinerary);
        setSavedSuccessMsg(`Itinerary quotation #${res.itinerary.id.slice(-6).toUpperCase()} saved successfully!`);
        setTimeout(() => setSavedSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPreview = () => {
    const quotationSnapshot: CRMItinerary = {
      id: `itin-preview-${Date.now()}`,
      leadId: initialLead?.id,
      guestName: guestName || 'Guest Traveler',
      guestPhone: guestPhone || '+91 98000 00000',
      guestEmail,
      city: guestCity,
      travelStartDate,
      durationNights,
      durationDays: days.length,
      adults,
      children,
      infants,
      vehicleId: selectedVehicleId,
      vehicleName: getVehicleName(),
      vehicleCategory: selectedVehicleCategory,
      days,
      addons,
      pricing,
      inclusions,
      exclusions,
      termsAndConditions: terms,
      assignedAgentName: userName,
      createdBy: 'current-user',
      createdByName: userName,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentQuotation(quotationSnapshot);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Tour Itinerary & Quotation Builder
            </h2>
            {initialLead && (
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Lead #{initialLead.id.slice(-4)}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Build custom day-wise Himalayan packages using preloaded master rates, verified stays, and real-time auto pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setTemplateModalOpen(true)}
            className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Template</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPreview}
            className="px-4 py-2 rounded-full bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            <span>Preview & Share</span>
          </button>

          <button
            type="button"
            onClick={handleSaveItinerary}
            disabled={isSaving}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Quotation</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedSuccessMsg}</span>
          </div>
          <button
            onClick={() => setPreviewModalOpen(true)}
            className="underline text-emerald-900 font-bold hover:text-black cursor-pointer"
          >
            View / Send WhatsApp
          </button>
        </div>
      )}

      {/* Guest & Trip Details Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>1. Guest & Traveling Party Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Guest Full Name *</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">WhatsApp / Phone *</label>
            <input
              type="text"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="e.g. +91 98301 23456"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="e.g. guest@gmail.com"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">City / Origin</label>
            <input
              type="text"
              value={guestCity}
              onChange={(e) => setGuestCity(e.target.value)}
              placeholder="e.g. Kolkata, Mumbai, Delhi"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Tour Start Date</label>
            <input
              type="date"
              value={travelStartDate}
              onChange={(e) => setTravelStartDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Adults (12+ yrs)</label>
            <input
              type="number"
              min={1}
              max={25}
              value={adults}
              onChange={(e) => {
                const val = Math.max(1, Number(e.target.value));
                setAdults(val);
                if (val > 4 && selectedVehicleCategory === '4-Seater') {
                  handleCategoryChange('6-Seater');
                }
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Children (5-11 yrs)</label>
            <input
              type="number"
              min={0}
              max={15}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Infants (&lt;5 yrs)</label>
            <input
              type="number"
              min={0}
              max={5}
              value={infants}
              onChange={(e) => setInfants(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>
        </div>

        {/* Vehicle Selection Segment */}
        <div className="pt-2">
          <label className="text-[11px] font-bold text-neutral-700 block mb-2">
            Dedicated Tourist Vehicle Category (All service rates auto-adjust)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: '4-Seater', name: '4-Seater Sedan / Hatchback', desc: 'Swift Dzire / WagonR', pax: 'Up to 4 Pax' },
              { id: '6-Seater', name: '6-Seater MUV / 4x4 Bolero', desc: 'Ertiga / Bolero', pax: 'Up to 6 Pax' },
              { id: 'Luxury Crysta', name: 'Luxury Hill SUV', desc: 'Toyota Innova Crysta', pax: 'Up to 7 Pax' },
              { id: 'Tempo Traveller', name: 'Group Tempo (13 Seater)', desc: 'Force Tempo Traveller', pax: '8 to 13 Pax' }
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleCategoryChange(v.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedVehicleCategory === v.id
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/30'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-neutral-900">{v.name}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{v.desc}</div>
                <div className="text-[10px] text-blue-700 font-semibold mt-1">{v.pax}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day-by-Day Itinerary Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              2. Day-by-Day Itinerary & Master Rate Selection
            </h3>
            <p className="text-xs text-neutral-500">
              Select Admin-approved transfers, via routes, sightseeing points, and hotels.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDay}
            className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day {days.length + 1}</span>
          </button>
        </div>

        <div className="space-y-5">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-4 transition-all hover:border-neutral-300"
            >
              {/* Day Header Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    D{day.dayNumber}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => updateDayField(idx, 'title', e.target.value)}
                      placeholder="Day Title e.g. Darjeeling to Gangtok Scenic Drive"
                      className="text-sm font-bold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-blue-600 focus:outline-none w-full sm:w-96"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleAiPolishDay(idx)}
                    disabled={isAiLoading === idx}
                    className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold border border-sky-200 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Let Google AI Studio Gemini draft engaging copy for this day"
                  >
                    <Sparkles className={`w-3 h-3 ${isAiLoading === idx ? 'animate-spin text-sky-600' : 'text-sky-600'}`} />
                    <span>{isAiLoading === idx ? 'Drafting with AI...' : 'AI Polish Plan'}</span>
                  </button>

                  {days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete this day"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Destination */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Destination</label>
                  <select
                    value={day.destination}
                    onChange={(e) => updateDayField(idx, 'destination', e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    {masterData.destinations.filter(d => d.isActive).map(dest => (
                      <option key={dest.id} value={dest.name}>{dest.name}</option>
                    ))}
                  </select>
                </div>

                {/* Service & Rate */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Cab Service Rate (Preloaded)
                  </label>
                  <select
                    value={day.serviceId || ''}
                    onChange={(e) => updateDayField(idx, 'serviceId', e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="">-- No Vehicle Service --</option>
                    {masterData.serviceRates.filter(s => s.isActive).map(srv => {
                      const rate = (selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta')
                        ? srv.sixSeaterRate 
                        : srv.fourSeaterRate;
                      return (
                        <option key={srv.id} value={srv.id}>
                          {srv.serviceName} (₹{rate.toLocaleString('en-IN')})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Via Route */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Via Route (Optional Scenic Add-on)
                  </label>
                  <select
                    value={day.viaRouteId || ''}
                    onChange={(e) => updateDayField(idx, 'viaRouteId', e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="">-- Direct Route (No extra) --</option>
                    {masterData.viaRoutes.filter(v => v.isActive).map(via => {
                      const rate = (selectedVehicleCategory === '6-Seater' || selectedVehicleCategory === 'Luxury Crysta')
                        ? via.additionalRate6Seater 
                        : via.additionalRate4Seater;
                      return (
                        <option key={via.id} value={via.id}>
                          {via.viaName} (+₹{rate.toLocaleString('en-IN')})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Day Vehicle Cost summary */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Day Cab Tariff</label>
                  <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 flex items-center justify-between">
                    <span>Cab + Route:</span>
                    <span className="text-blue-700">₹{((day.serviceCost || 0) + (day.viaRouteCost || 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Hotel & Stay Section */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hotel Stay & Room Type</span>
                  </span>
                  {day.hotelTotalCost > 0 && (
                    <span className="text-emerald-700 font-bold">
                      Night Stay: ₹{day.hotelTotalCost.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Hotel Selector */}
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">Select Hotel</label>
                    <select
                      value={day.hotelId || ''}
                      onChange={(e) => updateDayField(idx, 'hotelId', e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                    >
                      <option value="">-- No Hotel (Departure / Free Day) --</option>
                      {masterData.hotels.filter(h => h.isActive).map(hotel => (
                        <option key={hotel.id} value={hotel.id}>
                          {hotel.name} ({hotel.destination})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Room Category */}
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">Room Category</label>
                    <select
                      value={day.roomCategoryId || ''}
                      onChange={(e) => updateDayField(idx, 'roomCategoryId', e.target.value)}
                      disabled={!day.hotelId}
                      className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium disabled:bg-neutral-100"
                    >
                      <option value="">-- Select Room Category --</option>
                      {masterData.hotels.find(h => h.id === day.hotelId)?.roomCategories.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} ({room.mealPlan})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Rooms */}
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">Number of Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={day.numberOfRooms || 1}
                      onChange={(e) => updateDayField(idx, 'numberOfRooms', Math.max(1, Number(e.target.value)))}
                      disabled={!day.hotelId}
                      className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium disabled:bg-neutral-100"
                    />
                  </div>

                  {/* Room Cost per night */}
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">Rate / Room / Night (₹)</label>
                    <input
                      type="number"
                      value={day.roomCostPerNight || 0}
                      onChange={(e) => updateDayField(idx, 'roomCostPerNight', Number(e.target.value))}
                      disabled={!day.hotelId}
                      className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-bold text-neutral-900 disabled:bg-neutral-100"
                    />
                  </div>
                </div>
              </div>

              {/* Day Narrative Description */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Day Narrative & Traveler Notes
                </label>
                <textarea
                  rows={3}
                  value={day.description}
                  onChange={(e) => updateDayField(idx, 'description', e.target.value)}
                  placeholder="Detail the morning sunrise point, sightseeing stops, and evening leisure..."
                  className="w-full text-xs p-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-sans resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Optional Add-ons & Permits (Requirement #5) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>3. Special Mountain Permits & Excursion Add-ons</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nathula Pass Toggle */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-amber-50/40 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-900 block">
                Nathula Pass Indo-China Border (14,140 ft)
              </span>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Preloaded Rate: <strong>₹{selectedVehicleCategory === '6-Seater' ? '3,000' : '1,000'} per person</strong>. Includes Army permit fees and supplement vehicle fuel.
              </p>
              <div className="text-[10px] text-amber-700 font-semibold">
                Calculation: {adults + children} Passengers × ₹{selectedVehicleCategory === '6-Seater' ? '3,000' : '1,000'} = ₹{((selectedVehicleCategory === '6-Seater' ? 3000 : 1000) * (adults + children)).toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNathulaAddon}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                addons.some(a => a.id === 'addon-nathula')
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {addons.some(a => a.id === 'addon-nathula') ? 'Included ✓' : '+ Add Nathula'}
            </button>
          </div>

          {/* Zero Point Yumesamdong Toggle */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-900 block">
                Zero Point (Yumesamdong 15,300 ft Snow Fields)
              </span>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Excursion beyond Yumthang Valley where the civilian road ends into pristine snow glaciers.
              </p>
              <div className="text-[10px] text-neutral-700 font-semibold">
                Flat Rate: ₹3,500 / Vehicle
              </div>
            </div>

            <button
              type="button"
              onClick={toggleZeroPointAddon}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                addons.some(a => a.id === 'addon-zeropoint')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {addons.some(a => a.id === 'addon-zeropoint') ? 'Included ✓' : '+ Add Zero Point'}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Rules, Margin & Final Calculation */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-5">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Automated Pricing Engine
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              4. Quotation Breakdown & Agency Margin
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Agency Margin:</span>
              <input
                type="number"
                min={0}
                max={50}
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                disabled={userRole !== 'admin'}
                className="w-16 p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-bold text-white disabled:opacity-50"
              />
              <span className="text-neutral-400">%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Discount (₹):</span>
              <input
                type="number"
                min={0}
                value={agentDiscount}
                onChange={(e) => setAgentDiscount(Number(e.target.value))}
                className="w-20 p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-bold text-white"
              />
            </div>
          </div>
        </div>

        {/* Calculation Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Cab Services Total:</span>
            <span className="text-lg font-bold text-white block mt-1">
              ₹{pricing.vehicleTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-neutral-500">{days.length} Days Circuit</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Hotels & Stays Total:</span>
            <span className="text-lg font-bold text-white block mt-1">
              ₹{pricing.hotelTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-neutral-500">{durationNights} Nights Room Charge</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Permits & Add-ons:</span>
            <span className="text-lg font-bold text-white block mt-1">
              ₹{pricing.addonsTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-neutral-500">{addons.length} Add-on items</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/50">
            <span className="text-blue-300 block text-[11px]">Subtotal (Direct Cost):</span>
            <span className="text-lg font-bold text-blue-200 block mt-1">
              ₹{pricing.subtotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-blue-400">Margin: +₹{pricing.marginAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Grand Total Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-neutral-800">
          <div className="text-xs text-neutral-400">
            Includes GST ({gstPercent}%) of ₹{pricing.gstAmount.toLocaleString('en-IN')} · Government Approved Tourist Cab Quotation
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-300">Grand Total Quote:</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              ₹{pricing.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-full p-3 px-6 border border-neutral-300 shadow-xl flex items-center justify-between">
        <div className="text-xs font-semibold text-neutral-800 flex items-center gap-2">
          <span>{guestName || 'New Traveler'}</span>
          <span>·</span>
          <span>{durationNights}N/{days.length}D</span>
          <span>·</span>
          <span className="text-emerald-700 font-bold">₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Preview Quote
          </button>

          <button
            type="button"
            onClick={handleSaveItinerary}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & Finish'}
          </button>
        </div>
      </div>

      {/* Template Chooser Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Pre-built Itinerary Templates</span>
              </h3>
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Select an Admin-defined itinerary circuit to immediately populate all days, transfers, and sightseeing:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {masterData.templates.filter(t => t.isActive).map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => loadFromTemplate(tmpl)}
                  className="p-4 rounded-2xl border border-neutral-200 hover:border-blue-600 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-blue-700">
                      {tmpl.title}
                    </h4>
                    <span className="text-xs text-neutral-600 font-medium block">
                      {tmpl.destinationCircuit} · {tmpl.durationNights}N/{tmpl.durationDays}D
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      Suggested vehicle: {tmpl.suggestedVehicleCategory}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-neutral-100 group-hover:bg-blue-600 group-hover:text-white text-neutral-700 text-xs font-bold transition-colors">
                    Load
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && currentQuotation && (
        <QuotationModal
          itinerary={currentQuotation}
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
        />
      )}
    </div>
  );
};
