import { 
  CRMMasterData, 
  CRMLead, 
  CRMItinerary,
  CRMHotel,
  CRMVehicle,
  CRMServiceRate,
  CRMDayWiseOption,
  CRMViaRoute,
  CRMSightseeingPlace,
  CRMItineraryTemplate,
  CRMDestination,
  CRMPricingRules,
  CRMUser
} from '../types/crm';

export const DEFAULT_DESTINATIONS: CRMDestination[] = [
  {
    id: 'dest-darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    region: 'Darjeeling Hills',
    description: 'Queen of the Hills, famous for Tiger Hill sunrise, heritage Himalayan Railway, and sprawling tea estates.',
    bestTimeToVisit: 'March to June & October to December',
    isActive: true
  },
  {
    id: 'dest-gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    region: 'East Sikkim',
    description: 'Capital city of Sikkim perched at 5,410 ft with views of Kanchenjunga, vibrant MG Marg, and monastic culture.',
    bestTimeToVisit: 'September to June',
    isActive: true
  },
  {
    id: 'dest-pelling',
    name: 'Pelling',
    state: 'Sikkim',
    region: 'West Sikkim',
    description: 'Panoramic views of Mt. Kanchenjunga, ancient monasteries, Rabdentse ruins, and the Glass Skywalk.',
    bestTimeToVisit: 'October to May',
    isActive: true
  },
  {
    id: 'dest-north-sikkim',
    name: 'North Sikkim (Lachen & Lachung)',
    state: 'Sikkim',
    region: 'North Sikkim',
    description: 'Pristine Himalayan valleys, high-altitude Gurudongmar Lake at 17,800 ft, Yumthang Valley, and Zero Point snow fields.',
    bestTimeToVisit: 'March to June & October to December',
    isActive: true
  },
  {
    id: 'dest-kalimpong',
    name: 'Kalimpong',
    state: 'West Bengal',
    region: 'Kalimpong Hills',
    description: 'Tranquil hill station known for exotic orchid nurseries, Deolo Hill panoramic viewpoints, and colonial heritage.',
    bestTimeToVisit: 'October to May',
    isActive: true
  },
  {
    id: 'dest-bhutan',
    name: 'Bhutan (Thimphu & Paro)',
    state: 'Bhutan',
    region: 'Western Bhutan',
    description: 'The Land of the Thunder Dragon, Tigers Nest monastery, Punakha Dzong, and serene mountain valleys.',
    bestTimeToVisit: 'March to May & September to November',
    isActive: true
  }
];

export const DEFAULT_VEHICLES: CRMVehicle[] = [
  {
    id: 'veh-sedan',
    name: 'Swift Dzire / WagonR',
    category: '4-Seater',
    seatingCapacity: 4,
    luggageCapacity: 2,
    image: '/images/fleet_wagonr_1790680327329.jpg',
    isActive: true
  },
  {
    id: 'veh-suv',
    name: 'Ertiga / Bolero (4x4)',
    category: '6-Seater',
    seatingCapacity: 6,
    luggageCapacity: 4,
    image: '/images/fleet_bolero_1790680327329.jpg',
    isActive: true
  },
  {
    id: 'veh-crysta',
    name: 'Toyota Innova Crysta',
    category: 'Luxury Crysta',
    seatingCapacity: 7,
    luggageCapacity: 5,
    image: '/images/fleet_innova_1790680327329.jpg',
    isActive: true
  },
  {
    id: 'veh-tempo',
    name: 'Force Tempo Traveller (13 Seater)',
    category: 'Tempo Traveller',
    seatingCapacity: 13,
    luggageCapacity: 10,
    image: '/images/hero_himalayan_cab_1790679944443.jpg',
    isActive: true
  }
];

// Preloaded Service Rates strictly complying with user requirement #5:
export const DEFAULT_SERVICE_RATES: CRMServiceRate[] = [
  // Darjeeling Circuit
  {
    id: 'srv-darj-pickup',
    destination: 'Darjeeling',
    serviceName: 'Darjeeling Pickup (IXB Airport / NJP Station)',
    serviceType: 'Pickup',
    fourSeaterRate: 3500,
    sixSeaterRate: 5000,
    notes: 'Airport / Railway transfer up to Darjeeling town hotel. Tolls & parking included.',
    durationHours: 3.5,
    isActive: true
  },
  {
    id: 'srv-darj-sightseeing',
    destination: 'Darjeeling',
    serviceName: 'Darjeeling Full Day Sightseeing (Tiger Hill 3-Point + 7-Point City)',
    serviceType: 'Sightseeing',
    fourSeaterRate: 3500,
    sixSeaterRate: 5000,
    notes: 'Tiger Hill sunrise (4:00 AM), Ghoom Monastery, Batasia Loop, HMI, Zoo, Ropeway, Tea Garden.',
    durationHours: 8,
    isActive: true
  },
  {
    id: 'srv-darj-mirik',
    destination: 'Darjeeling',
    serviceName: 'Mirik Excursion & Pashupati Indo-Nepal Border',
    serviceType: 'Excursion',
    fourSeaterRate: 3500,
    sixSeaterRate: 5000,
    notes: 'Full day excursion to Sumendu Mirik Lake, pine orchards, Simana border viewpoint, and Pashupati market.',
    durationHours: 7,
    isActive: true
  },
  {
    id: 'srv-darj-lamahatta',
    destination: 'Darjeeling',
    serviceName: 'Lamahatta Eco Park & Takdah Tea Estate Excursion',
    serviceType: 'Excursion',
    fourSeaterRate: 3500,
    sixSeaterRate: 5000,
    notes: 'Dense pine walking trails, sacred lake, Lovers Meet Teesta river viewpoint, and heritage tea gardens.',
    durationHours: 6,
    isActive: true
  },
  {
    id: 'srv-darj-drop',
    destination: 'Darjeeling',
    serviceName: 'Darjeeling Drop (IXB Airport / NJP Station)',
    serviceType: 'Drop',
    fourSeaterRate: 3500,
    sixSeaterRate: 5000,
    notes: 'Downhill private transfer from Darjeeling hotel to Bagdogra Airport (IXB) or NJP Railway Station.',
    durationHours: 3.5,
    isActive: true
  },

  // Sikkim Circuit
  {
    id: 'srv-sikkim-gangtok-drop',
    destination: 'Gangtok',
    serviceName: 'Gangtok Drop (Transfer from NJP/IXB or Darjeeling)',
    serviceType: 'Drop',
    fourSeaterRate: 4000,
    sixSeaterRate: 6000,
    notes: 'Scenic drive along the Teesta River via Sevoke, Rangpo checkpost to Gangtok hotel.',
    durationHours: 4.5,
    isActive: true
  },
  {
    id: 'srv-sikkim-gangtok-sightseeing',
    destination: 'Gangtok',
    serviceName: 'Gangtok Full Day Sightseeing (Tashi Viewpoint, Rumtek & Waterfalls)',
    serviceType: 'Sightseeing',
    fourSeaterRate: 4000,
    sixSeaterRate: 6000,
    notes: 'Tashi Viewpoint, Ganesh Tok, Hanuman Tok, Bakthang Waterfall, Enchey Monastery, Do Drul Chorten & Ropeway.',
    durationHours: 7,
    isActive: true
  },
  {
    id: 'srv-sikkim-pelling-transfer',
    destination: 'Pelling',
    serviceName: 'Pelling Transfer (from Gangtok or Darjeeling)',
    serviceType: 'Transfer',
    fourSeaterRate: 4000,
    sixSeaterRate: 6000,
    notes: 'Transfer across West Sikkim ridges via Ravangla, Buddha Park or Legship to Pelling.',
    durationHours: 4.5,
    isActive: true
  },
  {
    id: 'srv-sikkim-changu-baba',
    destination: 'Gangtok',
    serviceName: 'Changu (Tsomgo) Lake & Baba Mandir Excursion',
    serviceType: 'Excursion',
    fourSeaterRate: 4000,
    sixSeaterRate: 6000,
    notes: 'High-altitude glacial oval lake at 12,310 ft and historic Baba Harbhajan Mandir. Protected Area Permit included.',
    durationHours: 7,
    isActive: true
  },

  // Half Day Sightseeing
  {
    id: 'srv-half-day-sightseeing',
    destination: 'Gangtok',
    serviceName: 'Half Day City Sightseeing (Darjeeling or Gangtok)',
    serviceType: 'Half Day Sightseeing',
    fourSeaterRate: 2500,
    sixSeaterRate: 3500,
    notes: '4-hour compact city tour covering main viewpoints, handicraft center, and local monastery.',
    durationHours: 4,
    isActive: true
  },

  // Nathula Pass (Optional add-on per person)
  {
    id: 'srv-nathula-pass',
    destination: 'Gangtok',
    serviceName: 'Nathula Pass Indo-China Border (Optional Add-on)',
    serviceType: 'High Altitude Pass',
    fourSeaterRate: 4000,
    sixSeaterRate: 6000,
    perPersonRate: 1000, // 4-Seater ₹1,000 per person; 6-Seater ₹3,000 per person
    notes: 'Nathula Pass (14,140 ft) Army permit fee and supplemental vehicle fuel. Subject to military approval and road clearance.',
    durationHours: 3,
    isActive: true
  },

  // North Sikkim Circuit
  {
    id: 'srv-north-sikkim-lachen',
    destination: 'North Sikkim (Lachen & Lachung)',
    serviceName: 'Lachen Transfer & Gurudongmar Lake (17,800 ft) Excursion',
    serviceType: 'Excursion',
    fourSeaterRate: 12000,
    sixSeaterRate: 16000,
    notes: 'Drive to high alpine Lachen (8,838 ft) and pre-dawn expedition to holy turquoise Gurudongmar Lake.',
    durationHours: 24,
    isActive: true
  },
  {
    id: 'srv-north-sikkim-lachung',
    destination: 'North Sikkim (Lachen & Lachung)',
    serviceName: 'Lachung Transfer, Yumthang Valley & Zero Point Excursion',
    serviceType: 'Excursion',
    fourSeaterRate: 12000,
    sixSeaterRate: 16000,
    notes: 'Valley of Flowers Yumthang and snow-laden Yumesamdong (Zero Point at 15,300 ft).',
    durationHours: 24,
    isActive: true
  },
  {
    id: 'srv-north-sikkim-circuit-3d2n',
    destination: 'North Sikkim (Lachen & Lachung)',
    serviceName: 'North Sikkim 3D/2N Complete SUV Circuit (Lachen + Lachung + Gurudongmar + Yumthang)',
    serviceType: 'Excursion',
    fourSeaterRate: 24000,
    sixSeaterRate: 32000,
    notes: 'Exclusive mountain 4x4 Bolero/Scorpio SUV for 3 full days including driver hill charges and military permits.',
    durationHours: 72,
    isActive: true
  }
];

export const DEFAULT_VIA_ROUTES: CRMViaRoute[] = [
  {
    id: 'via-teesta-lovers-meet',
    from: 'Darjeeling',
    to: 'Gangtok',
    viaName: 'via Lamahatta Eco Park & Lovers Meet Viewpoint',
    attractions: ['Lamahatta Pine Forest', 'Lovers Meet (Rangeet & Teesta Confluence)', 'Peshok Tea Garden'],
    additionalRate4Seater: 1000,
    additionalRate6Seater: 1500,
    distanceKm: 110,
    durationHours: 4.5,
    isActive: true
  },
  {
    id: 'via-ravangla-buddha-park',
    from: 'Gangtok',
    to: 'Pelling',
    viaName: 'via Ravangla Buddha Park & Temi Tea Garden',
    attractions: ['130-ft Tathagata Tsal Buddha Statue', 'Temi Tea Estate', 'Samdruptse'],
    additionalRate4Seater: 1500,
    additionalRate6Seater: 2000,
    distanceKm: 135,
    durationHours: 5.5,
    isActive: true
  },
  {
    id: 'via-namchi-char-dham',
    from: 'Darjeeling',
    to: 'Pelling',
    viaName: 'via Namchi Chardham (Siddheshwar Dham) & Jorethang',
    attractions: ['108-ft Shiva Statue Chardham', 'Samdruptse Hill', 'Jorethang Market'],
    additionalRate4Seater: 1200,
    additionalRate6Seater: 1800,
    distanceKm: 115,
    durationHours: 5,
    isActive: true
  }
];

export const DEFAULT_HOTELS: CRMHotel[] = [
  {
    id: 'hotel-taj-chia-kutir',
    name: 'Taj Chia Kutir Resort & Spa, Darjeeling',
    destination: 'Darjeeling',
    destinationId: 'dest-darjeeling',
    starRating: 5,
    locationAddress: 'Makaibari Tea Estate, Kurseong & Darjeeling Hills, WB',
    phone: '+91 354 2346000',
    email: 'chiakutir.darjeeling@ihcltata.com',
    featuredImage: '/images/hotel_taj_chia_kutir_1791198283277.jpg',
    amenities: ['Makaibari Tea Balcony', 'Heated Indoor Glass Pool', 'Jiva Luxury Spa', 'Sonargaon Fine Dining', 'Free High Speed WiFi'],
    roomCategories: [
      {
        id: 'room-taj-deluxe',
        hotelId: 'hotel-taj-chia-kutir',
        hotelName: 'Taj Chia Kutir Resort & Spa',
        name: 'Deluxe Valley View Room',
        mealPlan: 'CP',
        baseOccupancy: 2,
        isActive: true
      },
      {
        id: 'room-taj-suite',
        hotelId: 'hotel-taj-chia-kutir',
        hotelName: 'Taj Chia Kutir Resort & Spa',
        name: 'Executive Tea Terrace Suite',
        mealPlan: 'MAP',
        baseOccupancy: 2,
        isActive: true
      }
    ],
    rates: [
      {
        id: 'rate-taj-deluxe-reg',
        hotelId: 'hotel-taj-chia-kutir',
        roomCategoryId: 'room-taj-deluxe',
        season: 'Regular',
        rackRate: 26000,
        b2bRate: 21500,
        extraBedRate: 4500,
        childRate: 2000
      },
      {
        id: 'rate-taj-suite-reg',
        hotelId: 'hotel-taj-chia-kutir',
        roomCategoryId: 'room-taj-suite',
        season: 'Regular',
        rackRate: 38000,
        b2bRate: 32000,
        extraBedRate: 6000,
        childRate: 3000
      }
    ],
    isActive: true
  },
  {
    id: 'hotel-summit-hermes',
    name: 'Summit Hermes Hotel & Spa, Darjeeling',
    destination: 'Darjeeling',
    destinationId: 'dest-darjeeling',
    starRating: 4,
    locationAddress: 'Gandhi Road, Near Mall Road & Clock Tower, Darjeeling 734101',
    phone: '+91 354 2254300',
    email: 'reservations@summithotels.in',
    featuredImage: '/images/hotel_summit_hermes_darjeeling_1791198283277.jpg',
    amenities: ['Kanchenjunga Facing Balcony', 'Metta Spa', 'Buffet Restaurant', 'Mall Road 2 Min Walk', 'Room Heater'],
    roomCategories: [
      {
        id: 'room-hermes-deluxe',
        hotelId: 'hotel-summit-hermes',
        hotelName: 'Summit Hermes Hotel & Spa',
        name: 'Deluxe Room (Mountain View)',
        mealPlan: 'CP',
        baseOccupancy: 2,
        isActive: true
      },
      {
        id: 'room-hermes-family',
        hotelId: 'hotel-summit-hermes',
        hotelName: 'Summit Hermes Hotel & Spa',
        name: 'Premium Family Valley Suite',
        mealPlan: 'MAP',
        baseOccupancy: 3,
        isActive: true
      }
    ],
    rates: [
      {
        id: 'rate-hermes-deluxe-reg',
        hotelId: 'hotel-summit-hermes',
        roomCategoryId: 'room-hermes-deluxe',
        season: 'Regular',
        rackRate: 5500,
        b2bRate: 4200,
        extraBedRate: 1500,
        childRate: 800
      },
      {
        id: 'rate-hermes-family-reg',
        hotelId: 'hotel-summit-hermes',
        roomCategoryId: 'room-hermes-family',
        season: 'Regular',
        rackRate: 8500,
        b2bRate: 6800,
        extraBedRate: 2000,
        childRate: 1000
      }
    ],
    isActive: true
  },
  {
    id: 'hotel-sumi-yashshree-gangtok',
    name: 'Sumi Yashshree Suites & Spa, Gangtok',
    destination: 'Gangtok',
    destinationId: 'dest-gangtok',
    starRating: 4,
    locationAddress: 'Kazi Road, Near MG Marg Promenade, Gangtok, Sikkim 737101',
    phone: '+91 3592 201200',
    email: 'gangtok@yashshreehotels.com',
    featuredImage: '/images/hotel_sumi_yashshree_gangtok_1791198283277.jpg',
    amenities: ['Near MG Marg Walkway', 'Panoramic Valley View', 'Multi-Cuisine Dining', 'Elevator', 'Free High Speed WiFi'],
    roomCategories: [
      {
        id: 'room-yashshree-deluxe',
        hotelId: 'hotel-sumi-yashshree-gangtok',
        hotelName: 'Sumi Yashshree Suites & Spa',
        name: 'Superior Valley View Room',
        mealPlan: 'CP',
        baseOccupancy: 2,
        isActive: true
      },
      {
        id: 'room-yashshree-suite',
        hotelId: 'hotel-sumi-yashshree-gangtok',
        hotelName: 'Sumi Yashshree Suites & Spa',
        name: 'Executive Kanchenjunga Suite',
        mealPlan: 'MAP',
        baseOccupancy: 2,
        isActive: true
      }
    ],
    rates: [
      {
        id: 'rate-yashshree-deluxe-reg',
        hotelId: 'hotel-sumi-yashshree-gangtok',
        roomCategoryId: 'room-yashshree-deluxe',
        season: 'Regular',
        rackRate: 5800,
        b2bRate: 4400,
        extraBedRate: 1600,
        childRate: 900
      },
      {
        id: 'rate-yashshree-suite-reg',
        hotelId: 'hotel-sumi-yashshree-gangtok',
        roomCategoryId: 'room-yashshree-suite',
        season: 'Regular',
        rackRate: 9200,
        b2bRate: 7200,
        extraBedRate: 2200,
        childRate: 1200
      }
    ],
    isActive: true
  },
  {
    id: 'hotel-elgin-mount-pandim',
    name: 'The Elgin Mount Pandim, Pelling',
    destination: 'Pelling',
    destinationId: 'dest-pelling',
    starRating: 5,
    locationAddress: 'Monastery Road, Adjacent to Pemayangtse Monastery, Pelling 737113',
    phone: '+91 3595 250756',
    email: 'pelling@elginhotels.com',
    featuredImage: '/images/hotel_summit_new_continental_gangtok_1791198283277.jpg',
    amenities: ['Virgin Oak Forest 8 Acres', 'Unobstructed Kanchenjunga View', 'Colonial Tea Lounge', 'Heritage Fireplaces', 'Walk to Pemayangtse Monastery'],
    roomCategories: [
      {
        id: 'room-elgin-heritage',
        hotelId: 'hotel-elgin-mount-pandim',
        hotelName: 'The Elgin Mount Pandim',
        name: 'Heritage Deluxe Room',
        mealPlan: 'MAP',
        baseOccupancy: 2,
        isActive: true
      }
    ],
    rates: [
      {
        id: 'rate-elgin-heritage-reg',
        hotelId: 'hotel-elgin-mount-pandim',
        roomCategoryId: 'room-elgin-heritage',
        season: 'Regular',
        rackRate: 14500,
        b2bRate: 11800,
        extraBedRate: 3500,
        childRate: 1800
      }
    ],
    isActive: true
  }
];

export const DEFAULT_DAY_WISE_OPTIONS: CRMDayWiseOption[] = [
  {
    id: 'dayopt-darj-arrival',
    title: 'Bagdogra / NJP to Darjeeling Hill Transfer',
    destination: 'Darjeeling',
    defaultServiceId: 'srv-darj-pickup',
    morningActivity: 'Pickup at Bagdogra Airport (IXB) or NJP Railway Station with warm welcome.',
    afternoonActivity: 'Scenic mountain climb via Kurseong and Rohini tea gardens. Refreshing tea stop.',
    eveningActivity: 'Check-in to Darjeeling hotel. Free evening to stroll along historic Mall Road (Chowrasta) & Glenarys bakery.',
    recommendedMeals: 'Welcome mountain tea & evening snacks at Mall Road',
    suggestedHotelDestination: 'Darjeeling',
    highlights: ['Rohini Valley Views', 'Darjeeling Himalayan Toy Train crossings', 'Sunset at Chowrasta'],
    isActive: true
  },
  {
    id: 'dayopt-darj-tiger-hill',
    title: 'Tiger Hill 4:00 AM Sunrise & 7-Point Darjeeling City Tour',
    destination: 'Darjeeling',
    defaultServiceId: 'srv-darj-sightseeing',
    morningActivity: '4:00 AM excursion to Tiger Hill (8,482 ft) to witness golden sunrise over Mt. Kanchenjunga. Visit Ghoom Monastery and Batasia Loop war memorial.',
    afternoonActivity: 'Breakfast at hotel. Visit Himalayan Mountaineering Institute (HMI), Padmaja Naidu Himalayan Zoo (Red Pandas & Snow Leopards), Tenzing Rock, and Happy Valley Tea Estate.',
    eveningActivity: 'Visit Japanese Peace Pagoda. Evening leisure for souvenir shopping on Nehru Road.',
    recommendedMeals: 'Breakfast included at hotel, dinner with panoramic valley lights',
    suggestedHotelDestination: 'Darjeeling',
    highlights: ['Golden Kanchenjunga Sunrise', 'Rare Himalayan Red Pandas', 'Peace Pagoda Chanting'],
    isActive: true
  },
  {
    id: 'dayopt-darj-to-gangtok',
    title: 'Darjeeling to Gangtok Scenic Ridge Drive',
    destination: 'Gangtok',
    defaultServiceId: 'srv-sikkim-gangtok-drop',
    morningActivity: 'Leisurely breakfast overlooking the hills. Depart Darjeeling towards Sikkim.',
    afternoonActivity: 'Drive along Teesta River valley with optional stop at Lamahatta pine forest or Lovers Meet viewpoint. Cross Rangpo Sikkim border post.',
    eveningActivity: 'Arrive in Gangtok and check in. Stroll along pedestrian MG Marg illuminated with evening cafes and shopping.',
    recommendedMeals: 'Fresh Tibetan Momos and Thukpa on MG Marg',
    suggestedHotelDestination: 'Gangtok',
    highlights: ['Teesta & Rangeet River Confluence', 'Pedestrian MG Marg shopping', 'Orchid Street'],
    isActive: true
  },
  {
    id: 'dayopt-gangtok-tsomgo',
    title: 'Glacial Tsomgo (Changu) Lake & Baba Mandir Excursion',
    destination: 'Gangtok',
    defaultServiceId: 'srv-sikkim-changu-baba',
    morningActivity: 'Morning departure climbing through alpine hairpin bends to sacred Tsomgo Lake (12,310 ft). Experience Yak rides around the turquoise water.',
    afternoonActivity: 'Continue to Baba Harbhajan Singh Memorial Mandir (13,123 ft). Optional visit to Nathula Indo-China Border (subject to military permit).',
    eveningActivity: 'Descend back to Gangtok. Evening at leisure for authentic Sikkim cuisine and spa massage.',
    recommendedMeals: 'Hot Maggi & steaming butter tea by the freezing glacial lake',
    suggestedHotelDestination: 'Gangtok',
    highlights: ['Glacial Oval Lake', 'Historic Border Memorial', 'Dramatic High Alpine Snow Peaks'],
    isActive: true
  },
  {
    id: 'dayopt-gangtok-to-pelling',
    title: 'Gangtok to Pelling via Ravangla Buddha Park',
    destination: 'Pelling',
    defaultServiceId: 'srv-sikkim-pelling-transfer',
    morningActivity: 'Breakfast and check-out from Gangtok hotel. Drive into West Sikkim.',
    afternoonActivity: 'Visit the magnificent 130-ft golden Buddha statue at Tathagata Tsal (Buddha Park) in Ravangla with mist rolling over Himalayan ranges.',
    eveningActivity: 'Arrive in Pelling (6,800 ft) right facing Mt. Kanchenjunga. Relax by the fireplace.',
    recommendedMeals: 'Organic traditional Sikkimese thali at Pelling',
    suggestedHotelDestination: 'Pelling',
    highlights: ['130-ft Buddha Park', 'Closest Views of Kanchenjunga massif', 'Pine forests'],
    isActive: true
  },
  {
    id: 'dayopt-gangtok-departure',
    title: 'Gangtok to Bagdogra (IXB) / NJP Departure Transfer',
    destination: 'Gangtok',
    defaultServiceId: 'srv-sikkim-gangtok-drop',
    morningActivity: 'Breakfast at hotel with morning view of the Kanchenjunga range. Final packing.',
    afternoonActivity: 'Downhill private transfer via Teesta valley and Coronation Bridge to Bagdogra Airport (IXB) or New Jalpaiguri (NJP) with memories of the Himalayas.',
    eveningActivity: 'Departure on onward flight/train.',
    recommendedMeals: 'Breakfast included at hotel',
    suggestedHotelDestination: 'None',
    highlights: ['Coronation Bridge', 'Teesta River Vistas', 'Memorable Himalayan Farewell'],
    isActive: true
  }
];

export const DEFAULT_SIGHTSEEING_PLACES: CRMSightseeingPlace[] = [
  {
    id: 'sight-tiger-hill',
    destination: 'Darjeeling',
    name: 'Tiger Hill Sunrise Point',
    timings: '04:00 AM - 07:00 AM',
    entryTicketFee: 100,
    description: 'World-famous 2,590m peak with 360-degree views of Mt. Kanchenjunga and Mt. Everest in early morning hues.',
    photographyTip: 'Arrive by 4:15 AM with telephoto lens or wide-angle tripod for the 5:15 AM sunburst.',
    isActive: true
  },
  {
    id: 'sight-batasia-loop',
    destination: 'Darjeeling',
    name: 'Batasia Loop & War Memorial',
    timings: '05:00 AM - 06:30 PM',
    entryTicketFee: 30,
    description: 'Spiral railway loop where the Toy Train loops 360 degrees, surrounded by manicured flower gardens and Gurkha war memorial.',
    photographyTip: 'Capture the Toy Train puffing steam with Kanchenjunga framing the background.',
    isActive: true
  },
  {
    id: 'sight-tsomgo-lake',
    destination: 'Gangtok',
    name: 'Tsomgo (Changu) Lake',
    timings: '07:30 AM - 03:00 PM',
    entryTicketFee: 0,
    description: 'Sacred glacial oval alpine lake sitting at 12,310 ft with reflections of towering peaks, snow during winter and rhododendrons in spring.',
    photographyTip: 'Photograph decorated Yaks on the lakeside walkway.',
    isActive: true
  },
  {
    id: 'sight-pelling-skywalk',
    destination: 'Pelling',
    name: 'Pelling Glass Skywalk & Chenrezig Statue',
    timings: '08:30 AM - 05:00 PM',
    entryTicketFee: 100,
    description: 'Indias first glass skywalk perched on a mountain ridge leading to the 137-ft towering golden statue of Chenrezig.',
    photographyTip: 'Walk bare-feet on the glass panels with the valley floor visible hundreds of feet below.',
    isActive: true
  }
];

export const DEFAULT_ITINERARY_TEMPLATES: CRMItineraryTemplate[] = [
  {
    id: 'tmpl-darjeeling-gangtok-4n5d',
    title: 'Darjeeling & Gangtok Classical Hill Circuit',
    destinationCircuit: 'Darjeeling (2N) + Gangtok (2N)',
    durationNights: 4,
    durationDays: 5,
    suggestedVehicleCategory: '4-Seater',
    dayWiseTemplates: [
      {
        dayNumber: 1,
        title: 'Arrival at IXB/NJP & Scenic Drive to Darjeeling',
        destination: 'Darjeeling',
        serviceId: 'srv-darj-pickup',
        morning: 'Pickup at Bagdogra Airport (IXB) or NJP Railway Station.',
        afternoon: 'Mountain climb through Kurseong tea hills to Darjeeling.',
        evening: 'Check in and explore Chowrasta & Mall Road.',
        defaultHotelDestination: 'Darjeeling'
      },
      {
        dayNumber: 2,
        title: 'Tiger Hill 4 AM Sunrise & 7-Point Darjeeling City Tour',
        destination: 'Darjeeling',
        serviceId: 'srv-darj-sightseeing',
        morning: 'Early morning Tiger Hill sunrise, Batasia Loop, Ghoom Monastery.',
        afternoon: 'Visit Zoo, HMI, Tea Garden, Japanese Peace Pagoda.',
        evening: 'Leisure evening for tea tasting and shopping.',
        defaultHotelDestination: 'Darjeeling'
      },
      {
        dayNumber: 3,
        title: 'Darjeeling to Gangtok via Teesta River Confluence',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-gangtok-drop',
        viaRouteId: 'via-teesta-lovers-meet',
        morning: 'Breakfast and scenic drive towards Sikkim.',
        afternoon: 'Stop at Lamahatta pine park & Teesta river viewpoints.',
        evening: 'Arrive in Gangtok, evening stroll on illuminated MG Marg.',
        defaultHotelDestination: 'Gangtok'
      },
      {
        dayNumber: 4,
        title: 'Excursion to Glacial Tsomgo Lake & Baba Mandir',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-changu-baba',
        morning: 'Drive to Tsomgo Lake at 12,310 ft with Yak rides.',
        afternoon: 'Visit holy Baba Mandir & optional Nathula border.',
        evening: 'Return to Gangtok for dinner and relaxation.',
        defaultHotelDestination: 'Gangtok'
      },
      {
        dayNumber: 5,
        title: 'Gangtok to Bagdogra / NJP Departure Transfer',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-gangtok-drop',
        morning: 'Breakfast and check out.',
        afternoon: 'Downhill private cab transfer to IXB Airport or NJP Station.',
        evening: 'Departure with unforgettable memories of Sikkim and Darjeeling.',
        defaultHotelDestination: 'None'
      }
    ],
    isActive: true
  },
  {
    id: 'tmpl-north-sikkim-5n6d',
    title: 'Complete Sikkim & North Sikkim High Altitude Explorer',
    destinationCircuit: 'Gangtok (3N) + Lachen (1N) + Lachung (1N)',
    durationNights: 5,
    durationDays: 6,
    suggestedVehicleCategory: '6-Seater',
    dayWiseTemplates: [
      {
        dayNumber: 1,
        title: 'IXB/NJP to Gangtok Hill Transfer',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-gangtok-drop',
        morning: 'Pickup and transfer to Gangtok hotel.',
        afternoon: 'Mountain climb along Teesta.',
        evening: 'Evening on MG Marg.',
        defaultHotelDestination: 'Gangtok'
      },
      {
        dayNumber: 2,
        title: 'Tsomgo Glacial Lake & Baba Mandir Excursion',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-changu-baba',
        morning: 'Tsomgo lake and high alpine snow vistas.',
        afternoon: 'Baba Mandir excursion.',
        evening: 'Rest in Gangtok hotel before North Sikkim journey.',
        defaultHotelDestination: 'Gangtok'
      },
      {
        dayNumber: 3,
        title: 'Gangtok to Lachen (North Sikkim Expedition)',
        destination: 'North Sikkim (Lachen & Lachung)',
        serviceId: 'srv-north-sikkim-lachen',
        morning: 'Early morning pickup in dedicated 4x4 Mountain SUV.',
        afternoon: 'Seven Sisters Waterfalls, Singhik Viewpoint, Chungthang.',
        evening: 'Check into alpine homestay/hotel in Lachen (8,838 ft). Early rest.',
        defaultHotelDestination: 'North Sikkim (Lachen & Lachung)'
      },
      {
        dayNumber: 4,
        title: 'Gurudongmar Lake (17,800 ft) & Transfer to Lachung',
        destination: 'North Sikkim (Lachen & Lachung)',
        serviceId: 'srv-north-sikkim-lachen',
        morning: '04:00 AM expedition across Tibetan plateau to holy turquoise Gurudongmar Lake.',
        afternoon: 'Return to Lachen for hot lunch, transfer to Lachung (8,610 ft).',
        evening: 'Leisure evening in Lachung village surrounded by snow walls.',
        defaultHotelDestination: 'North Sikkim (Lachen & Lachung)'
      },
      {
        dayNumber: 5,
        title: 'Yumthang Valley & Zero Point to Gangtok',
        destination: 'North Sikkim (Lachen & Lachung)',
        serviceId: 'srv-north-sikkim-lachung',
        morning: 'Valley of Flowers Yumthang & Zero Point (15,300 ft).',
        afternoon: 'Hot springs visit and return drive to Gangtok.',
        evening: 'Arrive in Gangtok for celebration dinner.',
        defaultHotelDestination: 'Gangtok'
      },
      {
        dayNumber: 6,
        title: 'Gangtok to IXB / NJP Departure Transfer',
        destination: 'Gangtok',
        serviceId: 'srv-sikkim-gangtok-drop',
        morning: 'Breakfast and check out.',
        afternoon: 'Transfer to Bagdogra / NJP.',
        evening: 'Board return flight/train.',
        defaultHotelDestination: 'None'
      }
    ],
    isActive: true
  }
];

export const DEFAULT_PRICING_RULES: CRMPricingRules = {
  defaultMarginPercent: 15,
  gstPercent: 5,
  maxAgentDiscountPercent: 5,
  currencySymbol: '₹',
  paymentTerms: '30% advance on booking confirmation to block private cab & hotel vouchers. Remaining 70% payable upon pickup / day 1 of the tour.',
  cancellationPolicy: '15+ days prior to travel: 100% refund (less nominal permit fees). 7-14 days prior: 50% refund. Within 7 days: Non-refundable due to mountain vehicle & hotel reservations.',
  defaultInclusions: [
    'Dedicated private non-shared commercial tourist vehicle as per selected category (Swift Dzire / Bolero / Innova Crysta)',
    'Experienced mountain chauffeur well-versed in hill roads and high altitudes',
    'Chauffeur daily hill allowance, night halting charges, fuel, state road taxes & parking fees',
    'Verified hotel accommodation on selected room category & meal plan (CP / MAP)',
    'Sikkim Protected Area Permits (PAP) for Tsomgo Lake, Baba Mandir & North Sikkim',
    '24/7 dedicated local travel desk coordination and on-ground support'
  ],
  defaultExclusions: [
    'Airfare / Train tickets to Bagdogra (IXB) or New Jalpaiguri (NJP)',
    'Personal expenses: laundry, tips, phone calls, heater charges if billed separately by hotels',
    'Optional excursions: Nathula Pass (subject to Army clearance), Zero Point, Mt. Katao',
    'Sightseeing entry monument tickets, ropeway / yak ride fees',
    'Emergency evacuation or costs arising from natural landslides, road blocks or force majeure'
  ],
  termsAndConditions: 'All itineraries are subject to weather conditions and military border regulations in Sikkim. Rates quoted are strictly valid for 7 days from the quotation date.'
};

export const DEFAULT_CRM_USERS: CRMUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    name: 'Spiky Master Admin',
    email: 'spikycabssiliguri@gmail.com',
    phone: '+91 75860 47996',
    role: 'admin',
    salt: '7a0d2a29e529501e58dc2a8903e5c2b1',
    hash: '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897',
    isActive: true,
    createdAt: '2026-09-30T00:00:00.000Z'
  },
  {
    id: 'user-agent-1',
    username: 'agent_rahul',
    name: 'Rahul Sharma (Travel Specialist)',
    email: 'rahul.spikycabs@gmail.com',
    phone: '+91 98320 12345',
    role: 'agent',
    salt: '7a0d2a29e529501e58dc2a8903e5c2b1',
    hash: '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897', // same password "Sudip@123" for demo ease
    isActive: true,
    createdAt: '2026-10-01T00:00:00.000Z'
  },
  {
    id: 'user-agent-2',
    username: 'agent_priya',
    name: 'Priya Chhetri (Sikkim Specialist)',
    email: 'priya.spikycabs@gmail.com',
    phone: '+91 98320 67890',
    role: 'agent',
    salt: '7a0d2a29e529501e58dc2a8903e5c2b1',
    hash: '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897',
    isActive: true,
    createdAt: '2026-10-05T00:00:00.000Z'
  }
];

export const DEFAULT_CRM_LEADS: CRMLead[] = [
  {
    id: 'lead-1001',
    name: 'Amitabh Sengupta',
    phone: '+91 98301 44552',
    email: 'amitabh.sengupta@gmail.com',
    city: 'Kolkata',
    travelStartDate: '2026-11-14',
    durationNights: 4,
    durationDays: 5,
    adults: 3,
    children: 1,
    infants: 0,
    source: 'Website Form',
    status: 'Proposal Sent',
    priority: 'Hot',
    budget: '₹45,000 - ₹55,000',
    assignedAgentId: 'user-agent-1',
    assignedAgentName: 'Rahul Sharma (Travel Specialist)',
    destinationInterest: 'Darjeeling & Gangtok Classical Circuit',
    notes: 'Family trip with senior citizen. Prefers Innova Crysta for smoother hill ride. Needs ground floor room in Darjeeling.',
    createdAt: '2026-10-24T10:30:00.000Z',
    updatedAt: '2026-10-25T14:20:00.000Z',
    history: [
      {
        id: 'hist-1',
        timestamp: '2026-10-24T10:30:00.000Z',
        action: 'Lead Captured',
        note: 'Submitted package inquiry form from Darjeeling & Gangtok page.',
        author: 'Website Form'
      },
      {
        id: 'hist-2',
        timestamp: '2026-10-24T11:15:00.000Z',
        action: 'Assigned to Agent',
        note: 'Assigned lead to Rahul Sharma.',
        author: 'Spiky Master Admin'
      },
      {
        id: 'hist-3',
        timestamp: '2026-10-25T14:20:00.000Z',
        action: 'Quotation Generated',
        note: 'Created 4N/5D proposal with Innova Crysta and Summit hotels. Shared quotation on WhatsApp.',
        author: 'Rahul Sharma'
      }
    ]
  },
  {
    id: 'lead-1002',
    name: 'Dr. Vivek Mehra',
    phone: '+91 98110 99882',
    email: 'vivek.mehra@aiims.edu',
    city: 'New Delhi',
    travelStartDate: '2026-12-05',
    durationNights: 5,
    durationDays: 6,
    adults: 4,
    children: 0,
    infants: 0,
    source: 'Google Ads',
    status: 'Contacted',
    priority: 'Hot',
    budget: '₹75,000',
    assignedAgentId: 'user-agent-2',
    assignedAgentName: 'Priya Chhetri (Sikkim Specialist)',
    destinationInterest: 'North Sikkim (Gurudongmar & Yumthang)',
    notes: 'Keen on Gurudongmar Lake and Zero Point snow adventure. Wants verified heated rooms in Lachen/Lachung.',
    createdAt: '2026-10-26T08:15:00.000Z',
    updatedAt: '2026-10-26T09:40:00.000Z',
    history: [
      {
        id: 'hist-4',
        timestamp: '2026-10-26T08:15:00.000Z',
        action: 'Lead Captured',
        note: 'Arrived via Google Ads campaign: North Sikkim Luxury SUV.',
        author: 'Google Ads'
      },
      {
        id: 'hist-5',
        timestamp: '2026-10-26T09:40:00.000Z',
        action: 'Called Guest',
        note: 'Called guest to verify dates. 4 adults, doctor group from Delhi. Requested 5N/6D circuit with Bolero 4x4.',
        author: 'Priya Chhetri'
      }
    ]
  },
  {
    id: 'lead-1003',
    name: 'Sunita & Rohan Deshmukh',
    phone: '+91 97654 33210',
    email: 'rohan.deshmukh@tcs.com',
    city: 'Pune',
    travelStartDate: '2026-11-20',
    durationNights: 3,
    durationDays: 4,
    adults: 2,
    children: 0,
    infants: 0,
    source: 'WhatsApp',
    status: 'New',
    priority: 'Warm',
    budget: '₹35,000',
    assignedAgentId: 'user-agent-1',
    assignedAgentName: 'Rahul Sharma (Travel Specialist)',
    destinationInterest: 'Darjeeling Honeymoon & Tea Resort',
    notes: 'Honeymoon couple. Inquired via WhatsApp regarding Taj Chia Kutir & private sedan cab with flower bed decoration.',
    createdAt: '2026-10-27T16:00:00.000Z',
    updatedAt: '2026-10-27T16:00:00.000Z',
    history: [
      {
        id: 'hist-6',
        timestamp: '2026-10-27T16:00:00.000Z',
        action: 'WhatsApp Inquiry Captured',
        note: 'Auto-captured from WhatsApp link click with custom honeymoon query.',
        author: 'WhatsApp'
      }
    ]
  },
  {
    id: 'lead-1004',
    name: 'Ananya Roy',
    phone: '+91 94330 88712',
    email: 'ananya.roy@outlook.com',
    city: 'Siliguri',
    travelStartDate: '2026-11-08',
    durationNights: 2,
    durationDays: 3,
    adults: 6,
    children: 2,
    infants: 0,
    source: 'Facebook/Instagram',
    status: 'New',
    priority: 'Warm',
    budget: '₹25,000',
    assignedAgentId: '',
    assignedAgentName: 'Unassigned',
    destinationInterest: 'Pelling Glass Skywalk & Ravangla Weekend',
    notes: 'Weekend getaway for 8 pax family from Siliguri. Need 1 Bolero or Tempo Traveller.',
    createdAt: '2026-10-28T05:30:00.000Z',
    updatedAt: '2026-10-28T05:30:00.000Z',
    history: [
      {
        id: 'hist-7',
        timestamp: '2026-10-28T05:30:00.000Z',
        action: 'Ad Lead Captured',
        note: 'Captured from Facebook/Instagram reel ad: Pelling Skywalk Weekend.',
        author: 'Facebook/Instagram'
      }
    ]
  }
];

export function getDefaultCRMMasterData(): CRMMasterData {
  return {
    destinations: DEFAULT_DESTINATIONS,
    hotels: DEFAULT_HOTELS,
    vehicles: DEFAULT_VEHICLES,
    serviceRates: DEFAULT_SERVICE_RATES,
    dayWiseOptions: DEFAULT_DAY_WISE_OPTIONS,
    viaRoutes: DEFAULT_VIA_ROUTES,
    sightseeingPlaces: DEFAULT_SIGHTSEEING_PLACES,
    templates: DEFAULT_ITINERARY_TEMPLATES,
    pricingRules: DEFAULT_PRICING_RULES,
    users: DEFAULT_CRM_USERS
  };
}
