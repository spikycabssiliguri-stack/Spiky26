export interface DayPlan {
  dayNumber: number;
  title: string;
  routeTitle: string;
  description: string;
  highlights: string[];
  altitude?: string;
  stayLocation: string;
  sightseeingPoints: string[];
}

export interface CabPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: 'darjeeling' | 'gangtok' | 'north-sikkim' | 'kalimpong' | 'bhutan';
  durationNights: number;
  durationDays: number;
  badge: string;
  featuredImage: string;
  startingPrice: {
    sedan: number;
    suv: number;
    innova: number;
  };
  offerValidity: string;
  pickupDrop: string;
  overview: string;
  keyHighlights: string[];
  days: DayPlan[];
  bestTime: string;
  idealFor: string;
  recommendedVehicles: string[];
  permitRequired: boolean;
  permitDetails?: string;
}

export interface FleetItem {
  id: string;
  name: string;
  category: 'Premium SUV' | 'Comfort MUV' | 'Mountain 4x4 / High Clearance' | 'Executive Sedan';
  capacity: string;
  luggage: string;
  features: string[];
  idealRoutes: string[];
  baseRatePerDay: number;
  image: string;
}

export const FLEET_DATA: FleetItem[] = [
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    category: 'Premium SUV',
    capacity: '6–7 Passengers',
    luggage: '4 Large Bags + 3 Small',
    features: ['Plush Captain Seats', 'Dual Zone Climate Control', 'Ultra-Smooth Mountain Suspension', 'Certified Hill Driver'],
    idealRoutes: ['Darjeeling', 'Gangtok', 'Kalimpong', 'Bhutan Grand Tour', 'Airport Transfers'],
    baseRatePerDay: 4800,
    image: '/src/assets/images/fleet_innova_crysta_1790679963418.jpg'
  },
  {
    id: 'maruti-ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: 'Comfort MUV',
    capacity: '5–6 Passengers',
    luggage: '3 Large Bags + 2 Small',
    features: ['High Fuel Efficiency', 'Flexible Seating', 'AC & USB Charging', 'Pocket-Friendly Family Travel'],
    idealRoutes: ['Darjeeling 3D/5D', 'Gangtok City & Changu Lake', 'Kalimpong Sightseeing'],
    baseRatePerDay: 3800,
    image: '/src/assets/images/fleet_innova_crysta_1790679963418.jpg'
  },
  {
    id: 'bolero-scorpio',
    name: 'Mahindra Scorpio / Bolero / Sumo',
    category: 'Mountain 4x4 / High Clearance',
    capacity: '6–7 Passengers',
    luggage: '4 Large Bags',
    features: ['High Ground Clearance', 'All-Terrain Rugged 4x4 Power', 'Special Lachung / Lachen Route Approved', 'Sub-Zero Weather Prepared'],
    idealRoutes: ['North Sikkim (Lachung & Yumthang)', 'Zero Point & Mt. Katao', 'Gurudongmar Lake', 'Silk Route'],
    baseRatePerDay: 5200,
    image: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg'
  },
  {
    id: 'swift-dzire',
    name: 'Maruti Swift Dzire / Etios',
    category: 'Executive Sedan',
    capacity: '3–4 Passengers',
    luggage: '2 Large Bags + 2 Small',
    features: ['Chauffeured Comfort for Couples', 'Clean Sanitized Interiors', 'Agile Mountain Maneuvering', 'Most Economical'],
    idealRoutes: ['Darjeeling Sightseeing', 'Gangtok Drop & Pickup', 'Kalimpong Day Trips', 'Mirik Excursion'],
    baseRatePerDay: 3000,
    image: '/src/assets/images/darjeeling_tea_mirik_1790680004464.jpg'
  }
];

export const INCLUSIONS_LIST = [
  'Comfortable and well-maintained vehicle as selected at the time of booking',
  'Experienced and verified professional mountain driver',
  'Pickup and drop-off as per the confirmed itinerary (NJP Railway Station / IXB Bagdogra Airport / Siliguri)',
  'Fuel charges for the confirmed complete route',
  'Driver daily charges, night food & stay allowances for the agreed journey',
  'Interstate vehicle permits and applicable road taxes for the confirmed route',
  'One-way or round-trip service as specified in the voucher',
  'Airport / railway station pickup and drop facilities where applicable',
  'Local hill route assistance, mountain timing advice & travel guidance',
  'All applicable transport taxes included as mentioned in the final quotation'
];

export const EXCLUSIONS_LIST = [
  'Personal expenses of passengers (shopping, personal calls, laundry)',
  'Food, meals and beverages for passengers',
  'Entry fees to sightseeing attractions, monuments, museums, sanctuaries',
  'Local licensed tour guide charges (optional upon request)',
  'Parking charges where not specifically included in the confirmed quotation',
  'Additional sightseeing or extra vehicle usage beyond the agreed itinerary',
  'Additional waiting charges beyond the complimentary waiting period',
  'Charges for route diversions or detours requested by the passenger',
  'Charges arising from additional mileage or extra travel time',
  'Adventure activities such as paragliding, river rafting, rock climbing, ropeway tickets, toy train rides',
  'Porterage and luggage handling at stations/hotels',
  'Hotel accommodation (Spiky Cabs is a specialized Cab-Only operator, giving you total freedom over your stays)',
  'Travel insurance',
  'Any extra expense arising due to natural calamities, landslides, road blockages, strikes or unforeseen weather conditions',
  'Any increase in government taxes, tolls, permits or fuel-related costs applicable after booking',
  'Anything not specifically mentioned under Inclusions'
];

export const ROUTE_CHANGE_POLICY = 
  'In the event of a route change caused by landslides, road closures, strikes, political disturbances, weather conditions or other unforeseen circumstances, an alternate route may be used depending on road conditions and local authorities guidelines. Any additional distance or state tax incurred on diverted routes will be charged at transparent actuals.';

export const PACKAGES_DATA: CabPackage[] = [
  {
    id: 'darjeeling-2n-3d',
    slug: 'darjeeling-2nights-3days',
    title: 'Darjeeling Classic Cab Package',
    subtitle: 'NJP / IXB – Darjeeling – Mirik – NJP / IXB',
    destination: 'darjeeling',
    durationNights: 2,
    durationDays: 3,
    badge: 'Popular Weekend Trip',
    featuredImage: '/src/assets/images/darjeeling_tea_mirik_1790680004464.jpg',
    startingPrice: {
      sedan: 7999,
      suv: 10999,
      innova: 12999
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'The definitive short Himalayan escape covering tea gardens, heritage colonial landmarks, world-famous Tiger Hill sunrise over Mount Kanchenjunga, and scenic return via picturesque Mirik Lake & Nepal border.',
    bestTime: 'October to May (Clear mountain views & pleasant weather)',
    idealFor: 'Couples, short weekend breaks, first-time Darjeeling travelers',
    recommendedVehicles: ['Maruti Swift Dzire', 'Toyota Innova Crysta', 'Maruti Ertiga'],
    permitRequired: false,
    keyHighlights: [
      'Early 4:00 AM Tiger Hill Sunrise over Mt. Kanchenjunga (2,590 m)',
      'Batasia Loop War Memorial with Toy Train spiral view',
      'Historic Ghoom Monastery & Peace Pagoda',
      'Darjeeling Himalayan Mountaineering Institute (HMI) & Zoo',
      'Return via Tingling View Point, Mirik Boating & Pashupati Market (Nepal Border)'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Scenic Mountain Drive to Darjeeling',
        routeTitle: 'NJP / IXB to Darjeeling',
        description: 'Arrival at New Jalpaiguri Railway Station (NJP) or Bagdogra Airport (IXB) & transfer to Darjeeling, a favoured tourist destination noted for its scenic beauty, ancient forests, quaint houses, friendly people and the mountain panorama that it provides. Enjoy the view from famous Mall Road, taste the food of Glenary\'s Bakery & Cafe. Overnight stay at Darjeeling.',
        highlights: ['Scenic Hill Climb through Kurseong / Rohini route', 'Evening stroll at Darjeeling Mall Road & Chowrasta', 'Taste pastries & dinner at legendary Glenary’s'],
        altitude: '2,042 m (6,700 ft)',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Rohini Viewpoint', 'Kurseong Hills', 'Darjeeling Mall Road', 'Glenary’s Bakery & Cafe']
      },
      {
        dayNumber: 2,
        title: 'Iconic Darjeeling 7-Point Sightseeing & Tiger Hill Sunrise',
        routeTitle: 'Darjeeling Local Sightseeing',
        description: 'Begin the journey early morning (around 4:00 AM) and drive to the famous Tiger Hill (2,590 m) to treat your senses with mind-blowing views of the sunrise over Mt. Kanchenjunga. Other attractions covered: Ghoom Monastery, Batasia Loop, Darjeeling Ropeway, Padmaja Naidu Himalayan Zoological Park (HMI & Snow Leopard Museum), Tenzing Rock, Chitrey Tea Garden, Tibetan Refugee Self-Help Camp, and Japanese Peace Pagoda. Evening is free to roam around any of the hundred nurseries or the local market area. Night stay at Darjeeling.',
        highlights: ['Golden sunrise hitting Kanchenjunga peaks at 2,590 m', 'Batasia Loop with heritage 360-degree mountain panorama', 'Padmaja Naidu Himalayan Zoo (Red Pandas & Snow Leopards)', 'Japanese Peace Pagoda spiritual sanctuary'],
        altitude: '2,590 m at Tiger Hill',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Tiger Hill', 'Ghoom Monastery', 'Batasia Loop', 'Darjeeling Ropeway', 'Darjeeling Zoo & HMI', 'Tenzing Rock', 'Chitrey Tea Garden', 'Peace Pagoda']
      },
      {
        dayNumber: 3,
        title: 'Transfer to NJP / IXB via Tingling Tea Gardens & Mirik Lake',
        routeTitle: 'Transfer to NJP / IXB via Mirik',
        description: 'The drive is through scenic roads with occasional stoppages for photography. Head towards Tingling Viewpoint from where a great panorama of the luxuriant tea gardens in the mountain slopes, entire Mirik, and breathtaking views can be enjoyed. Activities like Horse riding & Boating in the Sumendu Lake (Mirik Lake) are on the cards for guests. You can also make a quick visit to the Indo-Nepal Pashupati Market border. Drive onwards to NJP / IXB for your forwarding journey with memories to cherish for long!',
        highlights: ['Tingling Viewpoint with sweeping tea plantation panoramas', 'Mirik Lake boating and lakeside pine forest walks', 'Visit Pashupati Market at Nepal border for souvenirs', 'Smooth downhill transfer back to Siliguri / IXB / NJP'],
        altitude: '1,495 m at Mirik down to 130 m at plains',
        stayLocation: 'Return Journey / Departure',
        sightseeingPoints: ['Tingling View Point', 'Mirik Lake (Sumendu Lake)', 'Pashupati Market (Nepal Border)', 'Pine Grove', 'NJP / IXB Drop']
      }
    ]
  },
  {
    id: 'darjeeling-4n-5d',
    slug: 'darjeeling-4nights-5days',
    title: 'Darjeeling & Surrounding Offbeat Cab Package',
    subtitle: 'NJP / IXB – Darjeeling – Lamahatta & Triveni – Lepchajagat & Mirik – NJP / IXB',
    destination: 'darjeeling',
    durationNights: 4,
    durationDays: 5,
    badge: 'Extended Leisure & Nature',
    featuredImage: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
    startingPrice: {
      sedan: 14500,
      suv: 18999,
      innova: 22500
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'An immersive 5-day mountain journey combining the classic sights of Darjeeling town with untouched pine hamlets of Lamahatta, Tinchuley, river confluence at Triveni, quiet pine ridges of Lepchajagat, and the Gopaldhara Tea Estate.',
    bestTime: 'September to June (Magnificent rhododendrons in spring, crisp winter snow views)',
    idealFor: 'Families, photographers, travelers who desire calm nature off the beaten track',
    recommendedVehicles: ['Toyota Innova Crysta', 'Maruti Ertiga', 'Mahindra Scorpio'],
    permitRequired: false,
    keyHighlights: [
      'Comprehensive Tiger Hill sunrise & Darjeeling city heritage',
      'Lamahatta Eco Park with towering dhupi pines & prayer flags',
      'Triveni Confluence (River Teesta & Rangeet meeting point)',
      'Tinchuley orange orchards & tea valley viewpoints',
      'Offbeat pine forest haven of Lepchajagat & Gopaldhara Tea Estate',
      'Mirik Lake, Simana Viewpoint & Pashupati Indo-Nepal Border'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Transfer to Darjeeling',
        routeTitle: 'NJP / IXB To Darjeeling',
        description: 'Arrival at New Jalpaiguri Railway Station (NJP) or Bagdogra Airport (IXB) & transfer to Darjeeling. Enjoy the scenic mountain road climb, panoramic valley views, ancient pine trees, and fresh mountain air. Relax on Mall Road and visit Glenary’s. Overnight stay at Darjeeling.',
        highlights: ['Scenic mountain highway drive', 'Mall Road promenade & sunset over town', 'Iconic bakery experience at Glenary’s'],
        altitude: '2,042 m',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Kurseong Valley', 'Ghum Railway Station', 'Darjeeling Mall Road']
      },
      {
        dayNumber: 2,
        title: 'Darjeeling Local Sightseeing & Tiger Hill Sunrise',
        routeTitle: 'Darjeeling Local Sightseeing',
        description: 'Begin early morning (~4:00 AM) to Tiger Hill (2,590 m) for the world-famous Kanchenjunga sunrise. Visit Ghoom Monastery, Batasia Loop, Darjeeling Ropeway, Zoological Park & Himalayan Mountaineering Institute, Tenzing Rock, Chitrey Tea Garden, Tibetan Refugee Camp, and Japanese Peace Pagoda. Evening free for local markets and nurseries.',
        highlights: ['Spectacular Tiger Hill Kanchenjunga panoramic sunrise', 'Historic Batasia Loop War Memorial', 'Darjeeling Ropeway cable car ride across tea estates', 'Peace Pagoda serene meditation gardens'],
        altitude: '2,590 m',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Tiger Hill', 'Ghoom Monastery', 'Batasia Loop', 'Darjeeling Ropeway', 'HMI & Zoo', 'Tenzing Rock', 'Peace Pagoda']
      },
      {
        dayNumber: 3,
        title: 'Darjeeling Surrounding Offbeat (Lamahatta & Triveni)',
        routeTitle: 'Darjeeling Surrounding Offbeat',
        description: 'Explore the peaceful offbeat wonders around Darjeeling: Lamahatta Eco Park with towering cedar and pine trees, Tinchuley viewpoint located ~6 km away offering tranquil village charm, and Triveni viewpoint where the majestic emerald Teesta meets the foaming Rangeet river. Fluttering Buddhist prayer flags and fresh pine aroma will refresh your soul. Return to hotel & overnight stay.',
        highlights: ['Lamahatta Eco Park manicured forest pathways & Sacred Lake', 'Tinchuley View Point panoramic Himalayan vistas', 'Triveni Sangam confluence of Teesta & Rangeet rivers', 'Peaceful offbeat atmosphere away from commercial crowds'],
        altitude: '1,760 m',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Lamahatta Eco Park', 'Tinchuley Viewpoint', 'Triveni River Confluence', 'Takdah Forest Heritage']
      },
      {
        dayNumber: 4,
        title: 'Excursion to Lepchajagat, Gopaldhara Tea & Mirik Lake',
        routeTitle: 'Lepchajagat, Tea Estates & Mirik Excursion',
        description: 'After breakfast, proceed for a scenic full day excursion covering Lepchajagat, followed by a visit to the rolling tea gardens of Gopaldhara Tea Estate. Continue towards Simana View Point for panoramic views along the Nepal border and enjoy shopping at Pashupati Market. Later visit serene Mirik Lake with a leisurely walk around the lakeside and Tingling View Point. Evening drive back to Darjeeling hotel.',
        highlights: ['Dense oak and pine canopy of Lepchajagat', 'World-class gourmet tea gardens of Gopaldhara', 'Simana View Point on the international border ridge', 'Mirik Sumendu Lake walk & boating'],
        altitude: '2,123 m at Lepchajagat',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Lepchajagat Pine Forest', 'Gopaldhara Tea Estate', 'Simana Viewpoint', 'Pashupati Market (Nepal)', 'Mirik Lake', 'Tingling View Point']
      },
      {
        dayNumber: 5,
        title: 'Farewell Darjeeling – Drive to Bagdogra / NJP',
        routeTitle: 'Darjeeling to IXB / NJP',
        description: 'After breakfast, drive down through the winding mountain roads back to Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP). Guests are advised to start early to comfortably catch train/flight connections. Forwarding journey with everlasting Himalayan memories!',
        highlights: ['Scenic descent overlooking tea gardens and the North Bengal plains', 'Drop at IXB Airport / NJP Station with punctual hill driver'],
        altitude: '130 m at plains',
        stayLocation: 'Departure / Plains',
        sightseeingPoints: ['Pankhabari / Rohini scenic bypass', 'Siliguri Junction', 'IXB / NJP Terminal Drop']
      }
    ]
  },
  {
    id: 'gangtok-3n-4d',
    slug: 'gangtok-3nights-4days',
    title: 'Gangtok & Changu Lake Cab Package',
    subtitle: 'NJP / IXB – Gangtok – Tsomgo Lake & Baba Mandir – Gangtok Sightseeing – NJP / IXB',
    destination: 'gangtok',
    durationNights: 3,
    durationDays: 4,
    badge: 'Best-Seller Sikkim Tour',
    featuredImage: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg',
    startingPrice: {
      sedan: 11999,
      suv: 15499,
      innova: 18500
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'The definitive Sikkim package featuring the Teesta river drive, Gangtok city landmarks, high-altitude glacial Tsomgo (Changu) Lake at 12,400 ft, and the revered New Baba Mandir near the Old Silk Route.',
    bestTime: 'March to June (Flowers) & October to February (Clear skies & winter snow at Tsomgo)',
    idealFor: 'Families, friends, honeymooners looking for clean mountain city vibe & snow lake adventure',
    recommendedVehicles: ['Toyota Innova Crysta', 'Mahindra Scorpio', 'Maruti Ertiga'],
    permitRequired: true,
    permitDetails: 'Protected Area Permit (PAP) for Tsomgo Lake & Baba Mandir. Requires 2 passport photos + valid Govt ID per person. (Nathula Pass subject to Indian Army approval & additional permit cost).',
    keyHighlights: [
      'Scenic 4-hour mountain drive following the mighty Teesta River',
      'Evenings on pedestrian-only clean cobblestone MG Marg',
      'High-altitude glacial Tsomgo (Changu) Lake (3,753 m / 12,313 ft)',
      'Historic Baba Harbhajan Singh Mandir',
      'Gangtok Cable Car Ropeway with aerial valley views',
      'Banjhakri Cascading Waterfalls & Tashi Viewpoint'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Transfer along River Teesta to Gangtok',
        routeTitle: 'NJP / IXB to Gangtok',
        description: 'Arrival at New Jalpaiguri Railway Station (NJP) or Bagdogra Airport (IXB) & transfer to Gangtok. The drive takes about 4 hours through scenic mountain roads along the roaring Teesta River. Check into your hotel. In the evening, enjoy the beauty of MG Marg, a quaint pedestrian-only promenade in the heart of Gangtok with cafes, souvenir shops, and vibrant mountain culture.',
        highlights: ['Picturesque NH10 Teesta river highway drive', 'Coronation Bridge / Sevoke views', 'Evening stroll along vehicle-free MG Marg Gangtok'],
        altitude: '1,650 m (5,410 ft)',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Sevoke Bridge', 'Teesta River valley', 'Rangpo Border Checkpost', 'MG Marg Gangtok']
      },
      {
        dayNumber: 2,
        title: 'High-Altitude Excursion to Tsomgo Lake & Baba Mandir',
        routeTitle: 'Tsomgo Lake & New Baba Mandir Excursion',
        description: 'Excursion to Tsomgo Lake (Changu Lake) & New Baba Mandir. The sacred lake is oval-shaped, nearly 50 ft deep, and generally covered in snow for most of the year. Sikkimese believe the lake to be a Jhakris healing place. Nearby is the sacred Baba Harbhajan Singh Mandir, dedicated to the revered soldier of the Indian Army. (Optional visit to Nathula Pass on Indo-China border subject to permit availability and army clearance). Return to Gangtok for overnight stay.',
        highlights: ['Tsomgo Lake (Changu) high-altitude glacial beauty at 12,310 ft', 'Decorated Yak rides and snow photography', 'Revered Baba Harbhajan Mandir at 13,123 ft', 'Thrilling mountain zigzag roads of East Sikkim'],
        altitude: '3,753 m (12,313 ft)',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Tsomgo Glacial Lake', 'New Baba Mandir', 'Kyongnosla Alpine Sanctuary view', 'Optional Nathula Pass border']
      },
      {
        dayNumber: 3,
        title: 'Gangtok Full-Day City & Cultural Sightseeing',
        routeTitle: 'Gangtok Sightseeing',
        description: 'After breakfast, start your day with a sightseeing tour of Gangtok. Visit some of the city’s top attractions: Tashi View Point, Ganesh Tok, Hanuman Tok, Banjhakri Waterfalls & Energy Park, and Enchey Monastery. Enjoy breathtaking views of the surrounding mountains and peaceful Buddhist shrines. Experience the Gangtok Ropeway for panoramic aerial views of the city. Evening free to explore local markets. Overnight stay at Gangtok.',
        highlights: ['Tashi View Point sunrise panorama over Kanchenjunga', 'Banjhakri Falls lush landscaped water park & ethnic statues', '200-year-old Enchey Monastery serene prayers', 'Gangtok Ropeway dual cable car crossing'],
        altitude: '1,650 m',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Tashi View Point', 'Ganesh Tok', 'Hanuman Tok', 'Banjhakri Falls', 'Enchey Monastery', 'Gangtok Ropeway', 'Do Drul Chorten']
      },
      {
        dayNumber: 4,
        title: 'Check-out & Descent Drive to NJP / IXB',
        routeTitle: 'Gangtok to IXB / NJP',
        description: 'After breakfast, check out from the hotel and drive towards NJP Railway Station / Bagdogra Airport (IXB). Enjoy the scenic drive along winding mountain roads, passing lush green hills, rivers, and picturesque hamlets. Proceed for your flight or train back home with wonderful memories of Sikkim!',
        highlights: ['Smooth descent down NH10 Teesta corridor', 'Comfortable transfers matching flight/train departure slots'],
        altitude: '130 m at plains',
        stayLocation: 'Departure / Return Home',
        sightseeingPoints: ['Singtam', 'Rangpo', 'Siliguri', 'IXB Bagdogra / NJP Junction']
      }
    ]
  },
  {
    id: 'north-sikkim-4n-5d',
    slug: 'north-sikkim-4nights-5days',
    title: 'North Sikkim Alpine Odyssey (Lachung & Yumthang)',
    subtitle: 'NJP / IXB – Gangtok – Lachung – Yumthang Valley – Gangtok – NJP / IXB',
    destination: 'north-sikkim',
    durationNights: 4,
    durationDays: 5,
    badge: 'Snow & Valley of Flowers',
    featuredImage: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg',
    startingPrice: {
      sedan: 17999,
      suv: 24999,
      innova: 29500
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'The ultimate high-altitude adventure into the pristine Himalayas of North Sikkim. Travel to the fairy-tale village of Lachung, marvel at the vibrant Valley of Flowers in Yumthang, soak in therapeutic hot springs, and explore snow-clad Zero Point / Mt. Katao.',
    bestTime: 'March to June (Blooming Rhododendrons & snow fields) & October to December (Crystal snow peaks)',
    idealFor: 'Adventure lovers, nature enthusiasts, couples & groups seeking real alpine wilderness',
    recommendedVehicles: ['Mahindra Scorpio / Bolero (Mandatory for North Sikkim terrain)', 'Toyota Innova Crysta'],
    permitRequired: true,
    permitDetails: 'North Sikkim Restricted Area Permit (RAP/PAP) processed by Spiky Cabs. Requires 4 passport photos and voter ID/passport per person. (Aadhaar not accepted for Sikkim international border sectors).',
    keyHighlights: [
      'Gangtok city acclimation & scenic Teesta valley climb',
      'Chasing colossal mountain cascades: Naga Falls & Amitabh Bachchan Falls',
      'Lachung alpine hamlet situated among pine-clad cliffs',
      'Yumthang Valley at 11,693 ft (Shingba Rhododendron Sanctuary)',
      'Natural medicinal hot sulfur springs of Yumthang',
      'Optional excursion to Zero Point (Yumesamdong at 15,300 ft) & Mt. Katao snow bowls'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Transfer to Gangtok',
        routeTitle: 'NJP / IXB to Gangtok',
        description: 'Arrival at New Jalpaiguri Railway Station (NJP) or Bagdogra Airport (IXB) and transfer to Gangtok. Drive is about 4 hours depending on road conditions along the scenic Teesta River. Check in, and in the evening, enjoy the beauty of MG Marg, the no-traffic quaint pedestrian road in the middle of Gangtok.',
        highlights: ['Scenic hill climb along Teesta River', 'MG Marg clean pedestrian atmosphere', 'Briefing on North Sikkim permit protocols'],
        altitude: '1,650 m',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Coronation Bridge', 'Teesta River valley', 'MG Marg Gangtok']
      },
      {
        dayNumber: 2,
        title: 'Expedition to North Sikkim: Gangtok to Lachung',
        routeTitle: 'Gangtok to Lachung Transfer',
        description: 'Lachung is popularly known as the "Valley of Flowers" and is home to the Shingba Rhododendron Sanctuary. It stands on a grassy flat land separated by deep gorges where rise pine-clad mountains with snowy peaks and black cliffs. On the way, enjoy the beauty of wonderful cascades including Naga Waterfalls and Amitabh Bachchan Waterfall (Bhim Nala). Overnight stay at Lachung.',
        highlights: ['Passing Singhik viewpoint with Kanchenjunga vistas', 'Majestic cascading Bhim Nala (Amitabh Bachchan) waterfalls', 'Chungthang confluence of Lachen & Lachung rivers', 'Traditional wooden cottages and apple orchards of Lachung'],
        altitude: '2,700 m (8,858 ft)',
        stayLocation: 'Lachung',
        sightseeingPoints: ['Singhik Viewpoint', 'Seven Sisters Waterfall view', 'Naga Waterfall', 'Bhim Nala Waterfall', 'Chungthang Confluence', 'Lachung Monastery']
      },
      {
        dayNumber: 3,
        title: 'Yumthang Valley of Flowers & Optional Zero Point Excursion',
        routeTitle: 'Yumthang Valley Sightseeing',
        description: 'Drive towards Yumthang situated at an elevation of nearly 11,693 feet, which has over twenty-four species of rhododendron (the state flower). On the way, visit the famous hot spring known for its curative properties for skin conditions. Night stay at Lachung.\n\nOptional Excursions: Visit Mt. Katao and Zero Point (Yumesamdong at 15,300 ft) offering breathtaking views of snow-covered Himalayan peaks, frozen rivers, and pristine mountain landscapes. These visits are optional and available at an additional vehicle cost.',
        highlights: ['Yumthang Valley alpine meadow surrounded by snowy peaks', 'Shingba Rhododendron Sanctuary with 24 species in bloom', 'Natural sulfur hot springs bath', 'Snow play at Zero Point (15,300 ft) right near the border ridge'],
        altitude: '3,564 m (11,693 ft) at Yumthang, 4,660 m at Zero Point',
        stayLocation: 'Lachung',
        sightseeingPoints: ['Yumthang Valley', 'Yumthang Hot Springs', 'Shingba Rhododendron Sanctuary', 'Optional: Zero Point (Yumesamdong)', 'Optional: Mt. Katao']
      },
      {
        dayNumber: 4,
        title: 'Lachung to Gangtok Return Journey',
        routeTitle: 'Lachung to Gangtok Transfer',
        description: 'After breakfast, remembering the magical time spent in the lap of Kanchenjunga and hoping to witness it again soon, leave towards Gangtok. Transfer to Gangtok, check into your hotel, and relax. Evening is at your leisure for shopping Tibetan handicrafts and tea on MG Marg.',
        highlights: ['Scenic daytime descent through North Sikkim mountain valleys', 'Relaxing evening at Gangtok cafes & handicraft emporiums'],
        altitude: '1,650 m at Gangtok',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Mangan Bazaar', 'Chungthang Dam', 'MG Marg Gangtok']
      },
      {
        dayNumber: 5,
        title: 'Gangtok to NJP / IXB Departure',
        routeTitle: 'Gangtok to NJP / IXB',
        description: 'After breakfast, drive to Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP). Guests are advised to start early and not rush. Forwarding journey with everlasting Himalayan memories to cherish for long!',
        highlights: ['Punctual downhill transfer to airport / railway platform', 'Spiky Cabs dedicated farewell assistance'],
        altitude: '130 m at plains',
        stayLocation: 'Departure',
        sightseeingPoints: ['Rangpo Checkpost', 'Sevoke', 'IXB / NJP Junction']
      }
    ]
  },
  {
    id: 'kalimpong-2n-3d',
    slug: 'kalimpong-2nights-3days',
    title: 'Kalimpong Heritage & Hilltop Retreat',
    subtitle: 'NJP / IXB – Kalimpong – Deolo & Durpin – NJP / IXB',
    destination: 'kalimpong',
    durationNights: 2,
    durationDays: 3,
    badge: 'Colonial Charm & Orchids',
    featuredImage: '/src/assets/images/darjeeling_tea_mirik_1790679944443.jpg',
    startingPrice: {
      sedan: 7500,
      suv: 9999,
      innova: 12000
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'A tranquil hill station journey known for colonial bungalows, lush flower nurseries, spectacular views of Kanchenjunga from Deolo Hill, and Buddhist monasteries perched atop Durpin Dara.',
    bestTime: 'All year round (especially March to May & September to December)',
    idealFor: 'Peace seekers, elderly travelers, flower & orchid enthusiasts, history buffs',
    recommendedVehicles: ['Maruti Swift Dzire', 'Toyota Innova Crysta', 'Maruti Ertiga'],
    permitRequired: false,
    keyHighlights: [
      'Deolo Hill (highest point of Kalimpong at 1,704 m) with 360-degree mountain views',
      'Durpin Monastery (Zang Dhok Palri Phodang) blessed by the Dalai Lama',
      'Pine View Cactus Nursery featuring rare Himalayan species',
      'Historic Morgan House British colonial estate'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'NJP / IXB to Kalimpong Drive',
        routeTitle: 'Transfer to Kalimpong',
        description: 'Pick up from NJP Railway Station or Bagdogra Airport and drive through the Teesta River valley towards Kalimpong. Check in to your hotel or boutique colonial homestay. Relax in the serene climate.',
        highlights: ['Drive through Teesta Bazar & Sevoke', 'Pleasant sub-tropical hill weather'],
        altitude: '1,247 m',
        stayLocation: 'Kalimpong',
        sightseeingPoints: ['Teesta Viewpoint', 'Kalimpong Town', 'Local Market']
      },
      {
        dayNumber: 2,
        title: 'Kalimpong Full Day Sightseeing',
        routeTitle: 'Deolo, Durpin & Nurseries',
        description: 'Full day excursion visiting Deolo Hill Park, Science City, Dr. Graham’s Homes school heritage campus, Durpin Monastery, Pine View Nursery, and Mangal Dham temple.',
        highlights: ['Deolo Hill paragliding takeoff spot', 'Dr. Graham’s Homes 1900 colonial heritage', 'Rare cactus nursery collections'],
        altitude: '1,704 m at Deolo',
        stayLocation: 'Kalimpong',
        sightseeingPoints: ['Deolo Hill', 'Dr. Graham’s Homes', 'Durpin Monastery', 'Pine View Cactus Nursery', 'Mangal Dham']
      },
      {
        dayNumber: 3,
        title: 'Kalimpong to NJP / IXB Drop',
        routeTitle: 'Descent to Plains',
        description: 'After breakfast, start your descent down to Bagdogra Airport (IXB) or NJP Railway Station for your onward flight or train.',
        highlights: ['Smooth return transfer with scenic views'],
        altitude: '130 m at plains',
        stayLocation: 'Departure',
        sightseeingPoints: ['Teesta Bridge', 'Siliguri', 'IXB / NJP']
      }
    ]
  },
  {
    id: 'bhutan-5n-6d',
    slug: 'bhutan-5nights-6days',
    title: 'Bhutan Western Valley Cab Package',
    subtitle: 'Phuentsholing / Hasimara / NJP – Thimphu – Punakha – Paro',
    destination: 'bhutan',
    durationNights: 5,
    durationDays: 6,
    badge: 'International Mountain Permit Package',
    featuredImage: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
    startingPrice: {
      sedan: 26000,
      suv: 34000,
      innova: 42000
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Hasimara Railway Station / New Alipurduar / NJP / Bagdogra / Phuentsholing Border',
    overview: 'Complete cross-border cab logistics with certified Indo-Bhutan vehicle entry permits, experienced bilingual mountain drivers, and seamless transport covering the capital Thimphu, scenic Punakha Dzong, Dochula Pass, and Paro Tiger’s Nest base.',
    bestTime: 'March to May & September to November',
    idealFor: 'International cultural travelers, spiritual seekers, scenic road trip enthusiasts',
    recommendedVehicles: ['Toyota Innova Crysta (Recommended for Bhutan)', 'Mahindra Scorpio'],
    permitRequired: true,
    permitDetails: 'Vehicle Entry Permit from RSTA (Road Safety & Transport Authority Bhutan) and Immigration Permit at Phuentsholing/Gelephu border. Handled with Spiky Cabs border logistics.',
    keyHighlights: [
      'Phuentsholing Indo-Bhutan border clearance and scenic ascent',
      'Dochula Pass (3,100 m) with 108 Druk Wangyal Chortens and Himalayan panorama',
      'Punakha Dzong at the confluence of Pho Chhu and Mo Chhu rivers',
      'Buddha Dordenma (Giant Buddha point) overlooking Thimphu valley',
      'Paro Taktsang (Tiger’s Nest Monastery) trailhead transfer'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival at Phuentsholing Border & Drive to Thimphu',
        routeTitle: 'Phuentsholing to Thimphu (165 km / 5 hrs)',
        description: 'Immigration clearance and vehicle permit verification at Phuentsholing. Drive through pristine mountain gorges, Gedu pine forests, and Chuzom confluence towards Thimphu.',
        highlights: ['Bhutan Gate entry', 'Chuzom river junction stupas', 'Evening in Thimphu Clock Tower square'],
        altitude: '2,320 m at Thimphu',
        stayLocation: 'Thimphu',
        sightseeingPoints: ['Bhutan Gate', 'Gedu Valleys', 'Chuzom', 'Thimphu Town']
      },
      {
        dayNumber: 2,
        title: 'Thimphu Sightseeing & Transfer to Punakha via Dochula',
        routeTitle: 'Thimphu to Punakha (75 km / 2.5 hrs)',
        description: 'Visit Buddha Dordenma (51-meter bronze Buddha) and National Memorial Chorten. Drive across scenic Dochula Pass (3,100 m) with 108 memorial stupas and views of snow-capped Bhutanese Himalayas. Descend into Punakha valley.',
        highlights: ['Massive Buddha Dordenma statue', 'Dochula Pass 108 stupas panorama', 'Lush sub-tropical Punakha valley'],
        altitude: '3,100 m at Dochula, 1,200 m at Punakha',
        stayLocation: 'Punakha',
        sightseeingPoints: ['Buddha Dordenma', 'National Memorial Chorten', 'Dochula Pass', 'Chimi Lhakhang']
      },
      {
        dayNumber: 3,
        title: 'Punakha Dzong & Transfer to Paro Valley',
        routeTitle: 'Punakha to Paro (125 km / 3.5 hrs)',
        description: 'Visit majestic Punakha Dzong, the palace of great happiness at the confluence of Pho Chhu and Mo Chhu rivers. Walk the long suspension bridge. Proceed onwards along mountain roads to the historic Paro valley.',
        highlights: ['Architectural wonder of Punakha Dzong', 'Longest wooden suspension bridge in Bhutan', 'Arrival in picturesque Paro valley'],
        altitude: '2,200 m at Paro',
        stayLocation: 'Paro',
        sightseeingPoints: ['Punakha Dzong', 'Punakha Suspension Bridge', 'Paro Chhu', 'Paro Town']
      },
      {
        dayNumber: 4,
        title: 'Excursion to Paro Taktsang (Tiger’s Nest) Base & Museum',
        routeTitle: 'Tiger\'s Nest Excursion & Paro Sights',
        description: 'Early morning drive to the base of legendary Tiger’s Nest Monastery (Paro Taktsang), cliff-hanging at 3,120 m. Later visit Ta Dzong (National Museum) and Rinpung Dzong.',
        highlights: ['Trailhead transfer for Tiger\'s Nest pilgrimage', 'National Museum of Bhutan (Ta Dzong)', 'Rinpung Dzong fortress'],
        altitude: '2,200 m – 3,120 m',
        stayLocation: 'Paro',
        sightseeingPoints: ['Taktsang Base', 'Ta Dzong', 'Rinpung Dzong', 'Drukgyel Dzong ruins']
      },
      {
        dayNumber: 5,
        title: 'Paro to Phuentsholing Border Transfer',
        routeTitle: 'Paro to Phuentsholing (160 km / 4.5 hrs)',
        description: 'Scenic return drive along high mountain highways from Paro down to Phuentsholing border. Enjoy duty-free shopping and relaxation.',
        highlights: ['Scenic descent with valley views', 'Evening border market shopping'],
        altitude: '300 m at border',
        stayLocation: 'Phuentsholing / Jaigaon',
        sightseeingPoints: ['Chapcha', 'Dantak canteen view', 'Phuentsholing']
      },
      {
        dayNumber: 6,
        title: 'Phuentsholing to Hasimara / NJP / IXB Drop',
        routeTitle: 'Border to Railway / Airport Drop',
        description: 'After breakfast, final drop to Hasimara Railway Station (25 km), New Alipurduar, or NJP / Bagdogra Airport (IXB) for your journey forward with memorable Bhutanese happiness!',
        highlights: ['Timely station / airport drop', 'Vast tea gardens of Dooars on the plains'],
        altitude: '130 m',
        stayLocation: 'Departure',
        sightseeingPoints: ['Dooars tea gardens', 'Hasimara / NJP / IXB']
      }
    ]
  }
];

export const COMPANY_INFO = {
  name: 'Spiky Cabs',
  tagline: 'Premier Tourist Cab Packages across the Eastern Himalayas',
  phone: '+91 75860 47996',
  rawPhone: '917586047996',
  email: 'hello@spikycabs.in',
  altEmail: 'info@spikycabs.in',
  address: 'Himachal Sarani, Opp Janki apt, Haiderpara, Siliguri, WB India',
  website: 'www.spikycabs.in',
  offerValidity: '30th April 2027',
  hubs: [
    'Bagdogra International Airport (IXB)',
    'New Jalpaiguri Railway Station (NJP)',
    'Siliguri Junction & Tenzing Norgay Bus Terminus',
    'Gangtok MG Marg Hub',
    'Phuentsholing / Indo-Bhutan Border'
  ]
};

export const PARTNERSHIP_INFO_CHECKLIST = [
  {
    category: '1. Seasonal Cab Pricing Grid',
    details: 'While we set up starting base rates, please confirm your peak season (May-June summer holidays & Durga Puja / Diwali in Oct-Nov) surge rate percentages, standard season rates, and off-season discounts.'
  },
  {
    category: '2. High-Altitude Permit Surcharges',
    details: 'Exact local vehicle add-on charges for Nathu La Pass (Gangtok), Zero Point & Mt. Katao (Lachung), and Gurudongmar Lake (Lachen).'
  },
  {
    category: '3. Bhutan Cross-Border Transport Specifics',
    details: 'Do your cabs have RSTA Bhutan tourist vehicle permits directly, or do you coordinate trans-shipment at Phuentsholing border? Also confirm if foreign national passenger handling is supported.'
  },
  {
    category: '4. Driver Night Allowances & Luggage Policy',
    details: 'Confirm complimentary luggage bag limit per cab type and driver night halt allowance policy if guests request extra unscheduled halts.'
  },
  {
    category: '5. Booking Advance & Payment Terms',
    details: 'Percentage of advance payment required (e.g. 20% / 30% advance on booking, balance on arrival or split per day) and accepted modes (UPI, Bank Transfer, Card).'
  }
];

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: 'darjeeling' | 'sikkim' | 'bhutan' | 'fleet';
  image: string;
  caption: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'g-tiger-hill',
    title: 'Mount Kanchenjunga at Dawn',
    location: 'Tiger Hill, Darjeeling (2,590 m)',
    category: 'darjeeling',
    image: '/src/assets/images/gallery_tiger_hill_1790680945212.jpg',
    caption: 'Golden morning light illuminating the world’s third highest peak over prayer flags.'
  },
  {
    id: 'g-tsomgo',
    title: 'Glacial Tsomgo Lake',
    location: 'East Sikkim (12,310 ft)',
    category: 'sikkim',
    image: '/src/assets/images/gallery_tsomgo_lake_1790680958082.jpg',
    caption: 'High-altitude turquoise waters surrounded by snow-draped alpine ridges on the route to Baba Mandir.'
  },
  {
    id: 'g-yumthang',
    title: 'Yumthang Valley of Flowers',
    location: 'North Sikkim (11,693 ft)',
    category: 'sikkim',
    image: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg',
    caption: 'A paradise of blooming rhododendrons, pristine alpine meadows, and glacier-fed rivers.'
  },
  {
    id: 'g-tea-mirik',
    title: 'Gopaldhara & Tingling Tea Slopes',
    location: 'Mirik Highway, Darjeeling',
    category: 'darjeeling',
    image: '/src/assets/images/darjeeling_tea_mirik_1790680004464.jpg',
    caption: 'Emerald rolling hills of high-elevation Darjeeling orthodox tea gardens.'
  },
  {
    id: 'g-fleet-crysta',
    title: 'Toyota Innova Crysta Mountain Service',
    location: 'Himalayan Ridge Highway',
    category: 'fleet',
    image: '/src/assets/images/fleet_innova_crysta_1790679963418.jpg',
    caption: 'Premium sanitized tourist cab tailored for comfort on hill station hairpin turns.'
  },
  {
    id: 'g-bhutan-dochula',
    title: 'Himalayan Mountain Route & Passes',
    location: 'Indo-Bhutan Border & Foothills',
    category: 'bhutan',
    image: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
    caption: 'Scenic cross-border journey connecting North Bengal tea estates to the Dragon Kingdom.'
  }
];

export interface VideoTestimonial {
  id: string;
  travelerName: string;
  city: string;
  routeTaken: string;
  duration: string;
  rating: number;
  thumbnail: string;
  videoDuration: string;
  videoHighlightQuote: string;
  fullReview: string;
  travelDate: string;
  vehicleUsed: string;
}

export const TESTIMONIALS_DATA: VideoTestimonial[] = [
  {
    id: 'v1',
    travelerName: 'Ananya & Debanjan Mukherjee',
    city: 'Kolkata, West Bengal',
    routeTaken: 'Darjeeling & Mirik 2N/3D',
    duration: '2 Nights / 3 Days',
    rating: 5,
    thumbnail: '/src/assets/images/traveler_video_thumb_1_1790680969197.jpg',
    videoDuration: '1:45 min',
    videoHighlightQuote: '“Our driver reached Bagdogra Airport 20 minutes before our flight landed. The car was spotless and the Tiger Hill 4:00 AM trip was flawlessly managed.”',
    fullReview: 'We booked the Darjeeling 2N/3D cab package with Spiky Cabs. What stood out was the complete absence of pushy behavior or hidden parking demands. Our driver, Norden, drove with extraordinary care on the narrow Kurseong slopes and knew the exact timing for Tiger Hill to beat the traffic. Best cab service in Siliguri!',
    travelDate: 'November 2025',
    vehicleUsed: 'Toyota Innova Crysta'
  },
  {
    id: 'v2',
    travelerName: 'Rohan Verma & Friends (4 Travelers)',
    city: 'Bengaluru, Karnataka',
    routeTaken: 'North Sikkim (Lachung & Yumthang) 4N/5D',
    duration: '4 Nights / 5 Days',
    rating: 5,
    thumbnail: '/src/assets/images/traveler_video_thumb_2_1790680980964.jpg',
    videoDuration: '2:12 min',
    videoHighlightQuote: '“They arranged our North Sikkim Restricted Area permits without us having to stand in any line. Zero Point at 15,300 ft was unbelievable!”',
    fullReview: 'North Sikkim roads can be challenging, but our Mahindra Scorpio was powerful and handled the snow near Zero Point effortlessly. Spiky Cabs coordinated our permits seamlessly from Siliguri. You only pay for the cab and have total freedom to pick whatever homestays you want in Lachung.',
    travelDate: 'January 2026',
    vehicleUsed: 'Mahindra Scorpio 4x4'
  },
  {
    id: 'v3',
    travelerName: 'Sanjay & Sunita Aggarwal',
    city: 'Delhi NCR',
    routeTaken: 'Gangtok & Tsomgo Lake 3N/4D',
    duration: '3 Nights / 4 Days',
    rating: 5,
    thumbnail: '/src/assets/images/traveler_video_thumb_1_1790680969197.jpg',
    videoDuration: '1:30 min',
    videoHighlightQuote: '“Very polite, non-smoking local driver who gave us brilliant recommendations for local Sikkim food on MG Marg.”',
    fullReview: 'Traveling with elderly parents, safe and gentle hill driving was our top priority. The Spiky Cabs team in Siliguri took special care to assign a senior driver who drove smoothly along the Teesta gorge. Highly recommend their cab-only packages.',
    travelDate: 'October 2025',
    vehicleUsed: 'Maruti Ertiga'
  }
];

export interface TouristAttraction {
  id: string;
  name: string;
  subtitle: string;
  category: 'darjeeling' | 'gangtok' | 'north-sikkim' | 'pelling' | 'ravangla' | 'kalimpong' | 'bhutan';
  region: 'darjeeling' | 'sikkim' | 'kalimpong' | 'bhutan';
  regionLabel: string;
  location: string;
  altitude?: string;
  image: string;
  description: string;
  highlights: string[];
}

export const TOURIST_ATTRACTIONS: TouristAttraction[] = [
  // --- DARJEELING & FOOTHILLS ---
  {
    id: 'toy-train',
    name: 'Darjeeling Himalayan Toy Train',
    subtitle: 'UNESCO World Heritage Heritage Steam Locomotive',
    category: 'darjeeling',
    region: 'darjeeling',
    regionLabel: 'Darjeeling Hills',
    location: 'Batasia Loop & Ghoom, Darjeeling',
    altitude: '2,258 m (7,407 ft)',
    image: '/src/assets/images/darjeeling_toy_train_1790684713643.jpg',
    description: 'The legendary 140-year-old narrow gauge railway that meanders past tea gardens, misty pine forests, and the dramatic Batasia Loop spiral overlooking Mount Kanchenjunga.',
    highlights: ['Batasia Loop 360° Spiral', 'India Highest Railway Station at Ghoom', 'Original British B-Class Steam Locomotives', 'Joy Ride Ticket Assistance']
  },
  {
    id: 'tiger-hill',
    name: 'Tiger Hill Sunrise',
    subtitle: 'Golden Kanchenjunga & Mt. Everest Dawn Spectacle',
    category: 'darjeeling',
    region: 'darjeeling',
    regionLabel: 'Darjeeling',
    location: 'Senchal Wildlife Sanctuary, Darjeeling',
    altitude: '8,482 ft (2,590 m)',
    image: '/src/assets/images/gallery_tiger_hill_1790680945212.jpg',
    description: 'The legendary early morning 4:00 AM excursion where the sun casts its first golden amber light across the snow crown of Kanchenjunga and the Everest horizon.',
    highlights: ['3:30 AM Early Morning Mountain Transfer', 'Twin Peaks of Kanchenjunga Illuminated', 'Everest & Makalu Silhouette View', 'Batasia Loop en route return']
  },
  {
    id: 'mirik-tea-lake',
    name: 'Mirik Lake & Tingling Tea Gardens',
    subtitle: 'Scenic Lake Boating & Rolling Tea Slopes',
    category: 'darjeeling',
    region: 'darjeeling',
    regionLabel: 'Darjeeling Foothills (Mirik)',
    location: 'Mirik Valley, Darjeeling Border',
    altitude: '4,905 ft (1,495 m)',
    image: '/src/assets/images/darjeeling_tea_mirik_1790680004464.jpg',
    description: 'A tranquil hill station nestled around Sumendu Lake with a wooden arch bridge (Indreni Pool), boating, horse riding, and miles of lush emerald tea bushes at Tingling.',
    highlights: ['Sumendu Lake Boating & Horse Riding', 'Tingling Tea Viewpoint Photo Stop', 'Pashupati Indo-Nepal Border Market', 'Scenic Return Route to IXB / NJP']
  },
  {
    id: 'lamahatta-eco-park',
    name: 'Lamahatta Eco Park & Pine Trail',
    subtitle: 'Towering Dhupi Pines, Manicured Steps & Sacred Lake',
    category: 'darjeeling',
    region: 'darjeeling',
    regionLabel: 'Darjeeling Offbeat (Lamahatta)',
    location: 'Lamahatta, Darjeeling (23 km from town)',
    altitude: '6,800 ft (2,072 m)',
    image: '/src/assets/images/lamahatta_eco_park_1790685151618.jpg',
    description: 'A tranquil eco-tourism destination famous for towering cedar & dhupi pines, wooden garden gazebos, hanging prayer flags, and a sacred hilltop lake reached by a stone pathway.',
    highlights: ['High-Altitude Pine Canopy Walking Trails', 'Sacred Hilltop Lake (Lamahatta Pokhri)', 'Panoramic Mount Kanchenjunga Viewpoints', 'Peaceful Homestay Valley & Flower Gardens']
  },

  // --- SIKKIM (EAST, NORTH, SOUTH, WEST) ---
  {
    id: 'nathula-pass',
    name: 'Nathu La Pass & Old Silk Route',
    subtitle: 'High-Altitude Indo-China Border Highway',
    category: 'gangtok',
    region: 'sikkim',
    regionLabel: 'East Sikkim',
    location: 'Indo-China Border, 54 km from Gangtok',
    altitude: '14,140 ft (4,310 m)',
    image: '/src/assets/images/nathula_pass_sikkim_1790684731915.jpg',
    description: 'An ancient trade corridor on the legendary Silk Route. Serpentine alpine road carved through snow-clad mountain passes, international border posts, and prayer flag corridors.',
    highlights: ['International Border Observation Post', 'War Memorial of 1967', 'Snow-covered Alpine Road', 'Protected Area Permit (PAP) Arranged']
  },
  {
    id: 'tsomgo-lake',
    name: 'Tsomgo Lake & Baba Mandir',
    subtitle: 'Sacred High-Altitude Turquoise Glacial Lake',
    category: 'gangtok',
    region: 'sikkim',
    regionLabel: 'East Sikkim',
    location: 'Jawaharlal Nehru Road, East Sikkim',
    altitude: '12,310 ft (3,753 m)',
    image: '/src/assets/images/gallery_tsomgo_lake_1790680958082.jpg',
    description: 'A sacred high-altitude glacial lake fed by snowmelt, revered by Buddhist monks. Famous for colorful Tibetan decorated yak rides and Baba Harbhajan Singh Memorial Mandir.',
    highlights: ['Glacial Turquoise Water Reflections', 'Traditional Decorated Yak Rides', 'Ropeway to Peak Viewpoint', 'Baba Mandir Legend & Memorial']
  },
  {
    id: 'gangtok-city',
    name: 'Gangtok Valley & MG Marg',
    subtitle: 'The Clean Himalayan Mountain Capital',
    category: 'gangtok',
    region: 'sikkim',
    regionLabel: 'East Sikkim',
    location: 'Gangtok, Sikkim',
    altitude: '5,410 ft (1,650 m)',
    image: '/src/assets/images/gangtok_city_view_1790684782649.jpg',
    description: 'Sikkim’s vibrant mountain capital, famous for the smoke-free pedestrian mall at MG Marg, Deorali Ropeway cable cars, Ganesh Tok, and ancient Rumtek & Enchey monasteries.',
    highlights: ['MG Marg Pedestrian Boulevard', 'Deorali Cable Car Ropeway', 'Ban Jhakri Waterfall & Energy Park', 'Panoramic Kanchenjunga Viewpoints']
  },
  {
    id: 'yumthang-valley',
    name: 'Yumthang Valley & Zero Point',
    subtitle: 'The Himalayan Valley of Flowers & Perpetual Snow',
    category: 'north-sikkim',
    region: 'sikkim',
    regionLabel: 'North Sikkim',
    location: 'Lachung, North Sikkim',
    altitude: '11,800 ft to 15,300 ft',
    image: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg',
    description: 'An alpine paradise where mountain rivers flow through meadows of 24 rhododendron species, hot sulphur springs, and the snow boundary at Zero Point (Yumesamdong).',
    highlights: ['Valley of Flowers Alpine Meadows', 'Zero Point Perpetual Snowfield (15,300 ft)', 'Sulfur Hot Springs at Yumthang', 'Lachung Village & Pine Gorges']
  },
  {
    id: 'gurudongmar-lake',
    name: 'Gurudongmar Sacred Lake',
    subtitle: 'One of the Highest Altitude Lakes in the World (17,800 ft)',
    category: 'north-sikkim',
    region: 'sikkim',
    regionLabel: 'North Sikkim',
    location: 'Lachen Plateau, North Sikkim',
    altitude: '17,800 ft (5,430 m)',
    image: '/src/assets/images/gurudongmar_lake_1790685179623.jpg',
    description: 'A breathtaking sacred glacial lake blessed by Guru Padmasambhava, framed by colossal snow-clad Himalayan mountain peaks near the Tibetan plateau.',
    highlights: ['Sacred Lake with Part Never Freezing in Sub-Zero Winter', '17,800 ft Extreme Altitude Plateau Drive', 'Lachen Base Camp & Chopta Valley en route', 'Army Protected Area Special Permit Required']
  },
  {
    id: 'ravangla-buddha',
    name: 'Buddha Park of Ravangla',
    subtitle: 'Tathagata Tsal · 130-Foot Golden Colossus',
    category: 'ravangla',
    region: 'sikkim',
    regionLabel: 'South Sikkim',
    location: 'Rabong / Ravangla, South Sikkim',
    altitude: '7,000 ft (2,134 m)',
    image: '/src/assets/images/ravangla_buddha_park_1790684746815.jpg',
    description: 'A spiritual masterpiece featuring a 130-foot tall golden Gautama Buddha statue consecrated by the 14th Dalai Lama, surrounded by manicured prayer gardens facing Mount Narsing and Mount Kanchenjunga.',
    highlights: ['130-Foot Majestic Seated Buddha', 'Consecrated by the Dalai Lama', 'Spiritual Gallery & Murals', 'Unobstructed Himalayan Panoramic Views']
  },
  {
    id: 'pelling-skywalk',
    name: 'Pelling Glass Skywalk & Chenrezig',
    subtitle: 'First Glass Skywalk in India Facing Mt. Kanchenjunga',
    category: 'pelling',
    region: 'sikkim',
    regionLabel: 'West Sikkim',
    location: 'Sanga Choeling Ridge, Pelling',
    altitude: '7,200 ft (2,195 m)',
    image: '/src/assets/images/pelling_skywalk_sikkim_1790684762658.jpg',
    description: 'Perched on a dramatic hilltop ridge opposite Kanchenjunga, this transparent glass skywalk leads to the towering 137-foot golden statue of Chenrezig (Avalokiteshvara), offering dizzying views into the mist below.',
    highlights: ['India’s Premier Transparent Glass Skywalk', '137-Foot Golden Chenrezig Statue', 'Direct Facing Kanchenjunga Overlook', 'Sanga Choeling Monastery Trek']
  },

  // --- KALIMPONG ---
  {
    id: 'deolo-hill',
    name: 'Deolo Hill & Paragliding Viewpoint',
    subtitle: 'Highest Point of Kalimpong with 360° Himalayan Vista',
    category: 'kalimpong',
    region: 'kalimpong',
    regionLabel: 'Kalimpong Hills',
    location: 'Deolo Ridge, Kalimpong',
    altitude: '5,590 ft (1,704 m)',
    image: '/src/assets/images/deolo_hill_kalimpong_1790685166158.jpg',
    description: 'The apex summit of Kalimpong town offering sweeping views of the Relli River valley, Teesta River gorge, and snow peaks of Mount Kanchenjunga.',
    highlights: ['Tandem Paragliding Over Kalimpong Valleys', 'Manicured Botanical Gardens & Fountains', 'Direct View of Kanchenjunga and Relli Valley', 'Science Centre & Tourist Complex']
  },

  // --- BHUTAN ---
  {
    id: 'dochula-pass',
    name: 'Dochula Pass (3,100 m) & 108 Chortens',
    subtitle: 'Himalayan Ridge Highway with 108 Memorial Stupas',
    category: 'bhutan',
    region: 'bhutan',
    regionLabel: 'Bhutan Himalayas',
    location: 'Thimphu – Punakha Highway, Bhutan',
    altitude: '10,170 ft (3,100 m)',
    image: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
    description: 'A mountain pass on the road from Thimphu to Punakha where 108 memorial stupas known as "Druk Wangyal Chortens" stand against the snow-clad peaks of the Bhutan Himalayas.',
    highlights: ['108 Druk Wangyal Memorial Chortens', 'Panoramic Snow Views of Eastern Himalayas', 'Scenic Rhododendron Forest Descent', 'International Route with Spiky Cabs Permits']
  }
];


