export type LeadSource = 
  | 'Website Form' 
  | 'WhatsApp' 
  | 'Google Ads' 
  | 'Facebook/Instagram' 
  | 'Manual' 
  | 'Referral';

export type LeadStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Proposal Sent' 
  | 'Follow Up' 
  | 'Confirmed' 
  | 'Lost';

export type LeadPriority = 'Hot' | 'Warm' | 'Cold';

export interface LeadHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  note: string;
  author: string;
}

export interface CRMLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  travelStartDate: string;
  durationNights: number;
  durationDays: number;
  adults: number;
  children: number;
  infants: number;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  budget?: string | number;
  assignedAgentId: string;
  assignedAgentName: string;
  destinationInterest: string;
  notes: string;
  itineraryId?: string;
  createdAt: string;
  updatedAt: string;
  history: LeadHistoryItem[];
}

export interface CRMUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent';
  salt: string;
  hash: string;
  isActive: boolean;
  createdAt: string;
}

export interface CRMDestination {
  id: string;
  name: string;
  state: string;
  region: string;
  description: string;
  bestTimeToVisit: string;
  isActive: boolean;
}

export interface CRMRoomCategory {
  id: string;
  hotelId: string;
  hotelName: string;
  name: string;
  mealPlan: 'EP' | 'CP' | 'MAP' | 'AP';
  baseOccupancy: number;
  isActive: boolean;
}

export interface CRMHotelRate {
  id: string;
  hotelId: string;
  roomCategoryId: string;
  season: 'Regular' | 'Peak';
  rackRate: number;
  b2bRate: number;
  extraBedRate: number;
  childRate: number;
}

export interface CRMHotel {
  id: string;
  name: string;
  destination: string;
  destinationId: string;
  starRating: number;
  locationAddress: string;
  phone: string;
  email: string;
  featuredImage: string;
  amenities: string[];
  roomCategories: CRMRoomCategory[];
  rates: CRMHotelRate[];
  isActive: boolean;
}

export interface CRMVehicle {
  id: string;
  name: string;
  category: '4-Seater' | '6-Seater' | 'Luxury Crysta' | 'Tempo Traveller';
  seatingCapacity: number;
  luggageCapacity: number;
  image: string;
  isActive: boolean;
}

export type CRMServiceType = 
  | 'Pickup' 
  | 'Sightseeing' 
  | 'Excursion' 
  | 'Drop' 
  | 'Transfer' 
  | 'Half Day Sightseeing' 
  | 'High Altitude Pass';

export interface CRMServiceRate {
  id: string;
  destination: string;
  serviceName: string;
  serviceType: CRMServiceType;
  fourSeaterRate: number;
  sixSeaterRate: number;
  perPersonRate?: number;
  notes?: string;
  durationHours?: number;
  isActive: boolean;
}

export interface CRMDayWiseOption {
  id: string;
  title: string;
  destination: string;
  defaultServiceId?: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  recommendedMeals: string;
  suggestedHotelDestination: string;
  highlights: string[];
  isActive: boolean;
}

export interface CRMViaRoute {
  id: string;
  from: string;
  to: string;
  viaName: string;
  attractions: string[];
  additionalRate4Seater: number;
  additionalRate6Seater: number;
  distanceKm: number;
  durationHours: number;
  isActive: boolean;
}

export interface CRMSightseeingPlace {
  id: string;
  destination: string;
  name: string;
  timings: string;
  entryTicketFee: number;
  description: string;
  photographyTip?: string;
  isActive: boolean;
}

export interface CRMItineraryTemplateDay {
  dayNumber: number;
  title: string;
  destination: string;
  serviceId?: string;
  viaRouteId?: string;
  morning: string;
  afternoon: string;
  evening: string;
  defaultHotelDestination?: string;
  sightseeingPoints?: string[];
}

export interface CRMItineraryTemplate {
  id: string;
  title: string;
  destinationCircuit: string;
  durationNights: number;
  durationDays: number;
  suggestedVehicleCategory: '4-Seater' | '6-Seater';
  dayWiseTemplates: CRMItineraryTemplateDay[];
  isActive: boolean;
}

export interface CRMPricingRules {
  defaultMarginPercent: number;
  gstPercent: number;
  maxAgentDiscountPercent: number;
  currencySymbol: string;
  paymentTerms: string;
  cancellationPolicy: string;
  defaultInclusions: string[];
  defaultExclusions: string[];
  termsAndConditions: string;
}

export interface CRMItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  destination: string;
  serviceId?: string;
  serviceName?: string;
  serviceCost: number;
  viaRouteId?: string;
  viaRouteName?: string;
  viaRouteCost: number;
  sightseeingPoints: string[];
  hotelId?: string;
  hotelName?: string;
  roomCategoryId?: string;
  roomCategoryName?: string;
  mealPlan?: string;
  numberOfRooms: number;
  roomCostPerNight: number;
  hotelTotalCost: number;
  description: string;
}

export interface CRMItineraryAddon {
  id: string;
  name: string;
  rate: number;
  unit: 'per_person' | 'per_vehicle' | 'fixed';
  quantity: number;
  total: number;
}

export interface CRMItineraryPricing {
  vehicleTotal: number;
  hotelTotal: number;
  addonsTotal: number;
  subtotal: number;
  marginPercent: number;
  marginAmount: number;
  agentDiscount: number;
  taxableAmount: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
}

export interface CRMItinerary {
  id: string;
  leadId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  city?: string;
  travelStartDate: string;
  durationNights: number;
  durationDays: number;
  adults: number;
  children: number;
  infants: number;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: '4-Seater' | '6-Seater' | 'Luxury Crysta' | 'Tempo Traveller';
  days: CRMItineraryDay[];
  addons: CRMItineraryAddon[];
  pricing: CRMItineraryPricing;
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string;
  assignedAgentName: string;
  createdBy: string;
  createdByName: string;
  status: 'Draft' | 'Shared' | 'Confirmed' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface CRMMasterData {
  destinations: CRMDestination[];
  hotels: CRMHotel[];
  vehicles: CRMVehicle[];
  serviceRates: CRMServiceRate[];
  dayWiseOptions: CRMDayWiseOption[];
  viaRoutes: CRMViaRoute[];
  sightseeingPlaces: CRMSightseeingPlace[];
  templates: CRMItineraryTemplate[];
  pricingRules: CRMPricingRules;
  users: CRMUser[];
}
