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
  destination: 'darjeeling' | 'gangtok' | 'north-sikkim' | 'kalimpong' | 'bhutan' | 'pelling';
  durationNights: number;
  durationDays: number;
  badge: string;
  featuredImage: string;
  startingPrice: {
    sedan: number;
    suv: number;
    innova: number;
  };
  pricingTier?: {
    fourSeaterRate?: number;
    sixSeaterRate?: number;
    nathulaExtra?: string;
    optionalExcursions?: string;
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
  itineraryNote?: string;
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
    image: '/images/fleet_innova_crysta_1790679963418.jpg'
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
    image: '/images/fleet_innova_crysta_1790679963418.jpg'
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
    image: '/images/north_sikkim_yumthang_1790679981868.jpg'
  },
  {
    id: 'swift-dzire',
    name: '4 seater WagonR / Swift Dzire',
    category: 'Executive Sedan',
    capacity: '3–4 Passengers',
    luggage: '2 Large Bags + 2 Small',
    features: ['Chauffeured Comfort for Couples & Small Groups', 'Clean Sanitized Interiors', 'Agile Mountain Maneuvering', 'Most Economical'],
    idealRoutes: ['Darjeeling Sightseeing', 'Gangtok Drop & Pickup', 'Kalimpong Day Trips', 'Mirik Excursion'],
    baseRatePerDay: 3000,
    image: '/images/darjeeling_tea_mirik_1790680004464.jpg'
  }
];

export interface MountainDropItem {
  id: string;
  destination: string;
  title: string;
  route: string;
  fourSeaterRate: number;
  sixSeaterRate: number;
  fourSeaterVehicle: string;
  sixSeaterVehicle: string;
  image: string;
  travelTime: string;
}

export const MOUNTAIN_DROPS_DATA: MountainDropItem[] = [
  {
    id: 'darjeeling-drop',
    destination: 'Darjeeling',
    title: 'Darjeeling Drop',
    route: 'Bagdogra (IXB) / NJP Station / Siliguri → Darjeeling',
    fourSeaterRate: 3500,
    sixSeaterRate: 4500,
    fourSeaterVehicle: '4 seater WagonR / Swift Dzire',
    sixSeaterVehicle: '6 Seater (Ertiga / Innova)',
    image: '/images/darjeeling_toy_train_1790684713643.jpg',
    travelTime: '~3 to 3.5 Hours'
  },
  {
    id: 'gangtok-drop',
    destination: 'Gangtok',
    title: 'Gangtok Drop',
    route: 'Bagdogra (IXB) / NJP Station / Siliguri → Gangtok',
    fourSeaterRate: 4000,
    sixSeaterRate: 5000,
    fourSeaterVehicle: '4 seater WagonR / Swift Dzire',
    sixSeaterVehicle: '6 Seater (Ertiga / Innova)',
    image: '/images/gangtok_city_view_1790684782649.jpg',
    travelTime: '~4 to 4.5 Hours'
  },
  {
    id: 'kalimpong-drop',
    destination: 'Kalimpong',
    title: 'Kalimpong Drop',
    route: 'Bagdogra (IXB) / NJP Station / Siliguri → Kalimpong',
    fourSeaterRate: 3500,
    sixSeaterRate: 4500,
    fourSeaterVehicle: '4 seater WagonR / Swift Dzire',
    sixSeaterVehicle: '6 Seater (Ertiga / Innova)',
    image: '/images/deolo_hill_kalimpong_1790685166158.jpg',
    travelTime: '~2.5 to 3 Hours'
  },
  {
    id: 'namchi-drop',
    destination: 'Namchi',
    title: 'Namchi Drop',
    route: 'Bagdogra (IXB) / NJP Station / Siliguri → Namchi (South Sikkim)',
    fourSeaterRate: 4500,
    sixSeaterRate: 5500,
    fourSeaterVehicle: '4 seater WagonR / Swift Dzire',
    sixSeaterVehicle: '6 Seater (Ertiga / Innova)',
    image: '/images/ravangla_buddha_park_1790684746815.jpg',
    travelTime: '~3.5 to 4 Hours'
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

export const ITINERARY_DISCLAIMER_NOTE =
  'Please Note: This is an indicative route itinerary. The actual final itinerary, detailed schedule, and driver coordination sent to you manually by our operations team upon booking confirmation will be the official itinerary, customized to your arrival times and real-time mountain road conditions.';

export const PACKAGES_DATA: CabPackage[] = [
  {
    id: 'darjeeling-2n-3d',
    slug: 'darjeeling-2nights-3days',
    title: 'Darjeeling Classic Cab Package',
    subtitle: 'NJP / IXB – Kurseong – Darjeeling – Tiger Hill – Mirik – NJP / IXB',
    destination: 'darjeeling',
    durationNights: 2,
    durationDays: 3,
    badge: 'Popular Weekend Trip',
    featuredImage: '/images/darjeeling_tea_mirik_1790680004464.jpg',
    startingPrice: {
      sedan: 11999,
      suv: 15999,
      innova: 18999
    },
    pricingTier: {
      fourSeaterRate: 11999,
      sixSeaterRate: 15999
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'The Queen of the Hills the way she was meant to be experienced. No haggling with station touts, no cramped shared jeeps. You land at Bagdogra or pull into NJP, and your Spiky Cabs chauffeur greets you with a warm smile, loads your luggage, and steers you up into the cool misty hills. Sip roadside ginger tea while looking down at the emerald Kurseong tea slopes, wake up to watch the first golden rays of sunlight paint Mt. Kanchenjunga at Tiger Hill (2,590 m), stroll Darjeeling’s iconic Mall Road with warm pastries from Glenary\'s, and take the scenic road back via pine-fringed Mirik Lake and the Nepal border. Pure mountain bliss from start to finish.',
    bestTime: 'October to May (Clear mountain views & pleasant weather)',
    idealFor: 'Couples, short weekend breaks, first-time Darjeeling travelers',
    recommendedVehicles: ['4 seater WagonR / Swift Dzire', 'Maruti Ertiga / Innova (6-Seater)'],
    permitRequired: false,
    keyHighlights: [
      'Dedicated 4-Seater & 6-Seater SUV: Best Price on WhatsApp (All Inclusive)',
      'Early 4:00 AM Tiger Hill Sunrise over Mt. Kanchenjunga (2,590 m)',
      'Batasia Loop War Memorial with Toy Train spiral view',
      'Historic Ghoom Monastery & Japanese Peace Pagoda',
      'Darjeeling Himalayan Mountaineering Institute (HMI) & Zoo (Snow Leopards & Red Pandas)',
      'Return via Tingling View Point, Mirik Boating & Pashupati Market (Nepal Border)'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Scenic Mountain Drive to Darjeeling',
        routeTitle: 'NJP / IXB to Darjeeling',
        description: 'Your smiling driver meets you at NJP Station or Bagdogra Airport. Within 30 minutes, the humid plains vanish behind you as you climb past green tea bushes and misty pine trees along the historic Hill Cart Road. Stop for piping hot momos and Darjeeling chai at Kurseong. Check into your hotel, and spend a leisurely evening strolling Darjeeling’s Mall Road with fresh baked croissants from Glenary’s.',
        highlights: ['Scenic Hill Climb through Kurseong / Rohini route', 'Roadside chai stop amidst emerald tea slopes', 'Evening stroll at Darjeeling Mall Road & Chowrasta', 'Taste pastries & dinner at legendary Glenary’s'],
        altitude: '2,042 m (6,700 ft)',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Rohini Viewpoint', 'Kurseong Hills', 'Darjeeling Mall Road', 'Glenary’s Bakery & Cafe']
      },
      {
        dayNumber: 2,
        title: 'Iconic Darjeeling 7-Point Sightseeing & Tiger Hill Sunrise',
        routeTitle: 'Darjeeling Local Sightseeing',
        description: 'Wake up before the stars fade at 4:00 AM. Your cab whisks you up to Tiger Hill (2,590 m) to witness Mt. Kanchenjunga glow in molten gold. On the way down, stop at Batasia Loop where the Toy Train loops 360 degrees, and visit the serene Ghoom Monastery. After a hearty breakfast, continue to the Himalayan Mountaineering Institute, Padmaja Naidu Zoo (say hello to the Red Pandas!), Tenzing Rock, and the tranquil Peace Pagoda.',
        highlights: ['Golden sunrise hitting Kanchenjunga peaks at 2,590 m', 'Batasia Loop with heritage 360-degree mountain panorama', 'Padmaja Naidu Himalayan Zoo (Red Pandas & Snow Leopards)', 'Japanese Peace Pagoda spiritual sanctuary'],
        altitude: '2,590 m at Tiger Hill',
        stayLocation: 'Darjeeling',
        sightseeingPoints: ['Tiger Hill', 'Ghoom Monastery', 'Batasia Loop', 'Darjeeling Ropeway', 'Darjeeling Zoo & HMI', 'Tenzing Rock', 'Chitrey Tea Garden', 'Peace Pagoda']
      },
      {
        dayNumber: 3,
        title: 'Transfer to NJP / IXB via Tingling Tea Gardens & Mirik Lake',
        routeTitle: 'Transfer to NJP / IXB via Mirik',
        description: 'Bid goodbye to Darjeeling along the undulating border ridges of Mirik. Stop at the breathtaking Tingling Viewpoint overlooking miles of carpeted tea gardens. Enjoy a peaceful paddle-boat ride in Sumendu (Mirik) Lake framed by weeping willows and pine forests. Make a quick crossing into the Indo-Nepal Pashupati Market for imported teas and souvenirs before your driver drops you right at your terminal at NJP or Bagdogra.',
        highlights: ['Tingling Viewpoint with sweeping tea plantation panoramas', 'Mirik Lake boating and lakeside pine forest walks', 'Visit Pashupati Market at Nepal border for souvenirs', 'Smooth downhill transfer back to Siliguri / IXB / NJP'],
        altitude: '1,495 m at Mirik down to 130 m at plains',
        stayLocation: 'Return Journey / Departure',
        sightseeingPoints: ['Tingling View Point', 'Mirik Lake (Sumendu Lake)', 'Pashupati Market (Nepal Border)', 'Pine Grove', 'NJP / IXB Drop']
      }
    ]
  },
  {
    id: 'gangtok-3n-4d',
    slug: 'gangtok-3nights-4days',
    title: 'Gangtok & Changu Lake Cab Package',
    subtitle: 'NJP / IXB – River Teesta – Gangtok – Tsomgo Lake & Baba Mandir – Sightseeing – NJP / IXB',
    destination: 'gangtok',
    durationNights: 3,
    durationDays: 4,
    badge: 'Best-Seller Sikkim Tour',
    featuredImage: '/images/gangtok_city_view_1790684782649.jpg',
    startingPrice: {
      sedan: 16999,
      suv: 24999,
      innova: 28999
    },
    pricingTier: {
      fourSeaterRate: 16999,
      sixSeaterRate: 24999,
      nathulaExtra: 'Nominal Army pass fee on WhatsApp'
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'There is something surreal about driving along the roaring, turquoise Teesta River and watching the air turn crisp and cold. Welcome to Gangtok, India\'s cleanest hill city where cars aren\'t allowed on the cobblestones of MG Marg and flowers bloom in window boxes. On Day 2, we take you climbing high above the clouds to the sacred, glacier-fed Tsomgo (Changu) Lake at 12,310 ft and the legendary Baba Harbhajan Mandir. Want to reach the historic Indo-China trade border at Nathula Pass? Just give us a heads-up — we take care of all the military and Sikkim tourism paperwork so you only have to think about keeping your hands warm in the snow.',
    bestTime: 'March to June (Flowers) & October to February (Clear skies & winter snow at Tsomgo)',
    idealFor: 'Families, friends, honeymooners looking for clean mountain city vibe & snow lake adventure',
    recommendedVehicles: ['4 seater WagonR / Swift Dzire', 'Mahindra Scorpio / Innova / Ertiga (6-Seater)'],
    permitRequired: true,
    permitDetails: 'Protected Area Permit (PAP) for Tsomgo Lake & Baba Mandir included. Requires 2 passport photos + valid Govt ID per person. (Nathula Pass is an optional add-on subject to Army clearance).',
    keyHighlights: [
      'Dedicated 4-Seater & 6-Seater: Best Price on WhatsApp (Fuel & Driver Included)',
      'Nathula Pass Border Add-on: Army Clearance & Permit Assistance',
      'Scenic 4-hour mountain drive following the mighty Teesta River',
      'Evenings on pedestrian-only clean cobblestone MG Marg',
      'High-altitude glacial Tsomgo (Changu) Lake (3,753 m / 12,313 ft)',
      'Historic Baba Harbhajan Singh Mandir & Kyongnosla Alpine Sanctuary',
      'Gangtok Cable Car Ropeway with aerial valley views & Banjhakri Cascades'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Transfer along River Teesta to Gangtok',
        routeTitle: 'NJP / IXB to Gangtok',
        description: 'Meet your Spiky Cabs driver at NJP or Bagdogra. Wind along the turquoise waters of the wild Teesta River, crossing the iconic Sevoke Coronation Bridge. Stop at Rangpo checkpost where we stamp your Sikkim permits. Reach Gangtok by afternoon and spend the evening enjoying MG Marg—no cars, no pollution, just cozy cafes, momo bars, and friendly hill locals.',
        highlights: ['Picturesque NH10 Teesta river highway drive', 'Coronation Bridge / Sevoke views', 'Evening stroll along vehicle-free MG Marg Gangtok'],
        altitude: '1,650 m (5,410 ft)',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Sevoke Bridge', 'Teesta River valley', 'Rangpo Border Checkpost', 'MG Marg Gangtok']
      },
      {
        dayNumber: 2,
        title: 'High-Altitude Excursion to Tsomgo Lake & Baba Mandir (Optional Nathula)',
        routeTitle: 'Tsomgo Lake & New Baba Mandir Excursion',
        description: 'Head into the high Himalayas! Climb through dramatic hairpin bends to the glacial oval Tsomgo (Changu) Lake, sitting at 12,310 ft. Sip hot maggi with steam blowing in the sub-zero chill, ride a colorfully dressed Yak, and visit Baba Harbhajan Mandir. If you have opted for Nathula Pass (optional border pass), your cab drives straight to the Indo-China border outpost where Indian and Chinese soldiers stand face to face across the barbed wire.',
        highlights: ['Tsomgo Lake (Changu) high-altitude glacial beauty at 12,310 ft', 'Decorated Yak rides and snow photography', 'Revered Baba Harbhajan Mandir at 13,123 ft', 'Thrilling mountain zigzag roads of East Sikkim', 'Nathula Pass border post (optional add-on)'],
        altitude: '3,753 m (12,313 ft)',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Tsomgo Glacial Lake', 'New Baba Mandir', 'Kyongnosla Alpine Sanctuary view', 'Optional: Nathula Pass Border Post']
      },
      {
        dayNumber: 3,
        title: 'Gangtok Full-Day City & Cultural Sightseeing',
        routeTitle: 'Gangtok Sightseeing',
        description: 'A relaxed day exploring the cultural heartbeat of Sikkim. Catch the morning light on Kanchenjunga from Tashi Viewpoint, spin the giant prayer wheels at Do Drul Chorten, visit the peaceful 200-year-old Enchey Monastery, marvel at Banjhakri Waterfalls set amidst lush shamanic gardens, and glide across Gangtok on the thrilling bi-cable aerial Ropeway.',
        highlights: ['Tashi View Point sunrise panorama over Kanchenjunga', 'Banjhakri Falls lush landscaped water park & ethnic statues', '200-year-old Enchey Monastery serene prayers', 'Gangtok Ropeway dual cable car crossing'],
        altitude: '1,650 m',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Tashi View Point', 'Ganesh Tok', 'Hanuman Tok', 'Banjhakri Falls', 'Enchey Monastery', 'Gangtok Ropeway', 'Do Drul Chorten']
      },
      {
        dayNumber: 4,
        title: 'Check-out & Descent Drive to NJP / IXB',
        routeTitle: 'Gangtok to IXB / NJP',
        description: 'Enjoy a leisurely breakfast overlooking the Gangtok valleys. Check out and begin your smooth descent along the river valley. Your driver ensures you reach Bagdogra Airport or NJP station comfortably on time, carrying a heart full of Sikkimese warmth and crisp mountain memories.',
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
    subtitle: 'NJP / IXB – Gangtok – Lachung – Yumthang Valley – Zero Point / Katao – NJP / IXB',
    destination: 'north-sikkim',
    durationNights: 4,
    durationDays: 5,
    badge: 'Snow & Valley of Flowers',
    featuredImage: '/images/north_sikkim_yumthang_1790679981868.jpg',
    startingPrice: {
      sedan: 31999,
      suv: 31999,
      innova: 36999
    },
    pricingTier: {
      sixSeaterRate: 31999,
      optionalExcursions: 'Mt. Katao & Zero Point (Yumesamdong)'
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'This isn\'t just a holiday; it\'s an expedition into the crown of the Eastern Himalayas. You\'ll cross deep emerald river gorges, chase gargantuan cascades like Bhim Nala (the Amitabh Bachchan waterfall), and sleep in the fairytale wooden hamlet of Lachung nestled beneath towering sheer granite cliffs. Next morning, drive into the heavenly Yumthang Valley (11,693 ft) where twenty-four species of rhododendrons carpet the alpine meadows and natural sulfur hot springs bubble peacefully. Craving real snow and razor-sharp Himalayan peaks? Opt for the thrilling drive to Zero Point (15,300 ft) or Mt. Katao. North Sikkim roads require real mountain masters behind the wheel — our local chauffeurs have navigated these bends in all seasons. You are safe, comfortable, and in for the journey of a lifetime.',
    bestTime: 'March to June (Blooming Rhododendrons & snow fields) & October to December (Crystal snow peaks)',
    idealFor: 'Adventure lovers, nature enthusiasts, couples & groups seeking real alpine wilderness',
    recommendedVehicles: ['Mahindra Scorpio / Bolero / Maxx 4x4 (Mandatory High Clearance 6-Seater)'],
    permitRequired: true,
    permitDetails: 'North Sikkim Restricted Area Permit (RAP/PAP) processed by Spiky Cabs. Requires 4 passport photos and voter ID/passport per person. (Aadhaar not accepted for Sikkim international border sectors).',
    keyHighlights: [
      'Dedicated 6-Seater Mountain SUV: Best Price on WhatsApp (Complete 5-Day Circuit)',
      'Optional Excursions: Mt. Katao & Zero Point (15,300 ft Snow Fields)',
      'Gangtok city acclimation & scenic Teesta valley climb',
      'Chasing colossal mountain cascades: Naga Falls & Amitabh Bachchan Falls',
      'Lachung alpine hamlet situated among pine-clad cliffs',
      'Yumthang Valley of Flowers at 11,693 ft (Shingba Rhododendron Sanctuary)',
      'Natural medicinal hot sulfur springs of Yumthang'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Transfer to Gangtok',
        routeTitle: 'NJP / IXB to Gangtok',
        description: 'Arrival at NJP or Bagdogra Airport and transfer to Gangtok through the Teesta River gorge. Evening stroll along pedestrian MG Marg while our team pre-processes your North Sikkim military border permits for the next morning.',
        highlights: ['Scenic hill climb along Teesta River', 'MG Marg clean pedestrian atmosphere', 'Briefing on North Sikkim permit protocols'],
        altitude: '1,650 m',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Coronation Bridge', 'Teesta River valley', 'MG Marg Gangtok']
      },
      {
        dayNumber: 2,
        title: 'Expedition to North Sikkim: Gangtok to Lachung',
        routeTitle: 'Gangtok to Lachung Transfer',
        description: 'After breakfast, your rugged mountain 4x4 heads north into wild terrain. Pass Singhik Viewpoint with distant views of Kanchenjunga, and stop at the thundering cascades of Seven Sisters, Naga Falls, and Bhim Nala (Amitabh Bachchan Falls). Cross the sacred river confluence at Chungthang and enter the high alpine valley of Lachung by late afternoon.',
        highlights: ['Passing Singhik viewpoint with Kanchenjunga vistas', 'Majestic cascading Bhim Nala (Amitabh Bachchan) waterfalls', 'Chungthang confluence of Lachen & Lachung rivers', 'Traditional wooden cottages and apple orchards of Lachung'],
        altitude: '2,700 m (8,858 ft)',
        stayLocation: 'Lachung',
        sightseeingPoints: ['Singhik Viewpoint', 'Seven Sisters Waterfall view', 'Naga Waterfall', 'Bhim Nala Waterfall', 'Chungthang Confluence', 'Lachung Monastery']
      },
      {
        dayNumber: 3,
        title: 'Yumthang Valley of Flowers & Optional Zero Point Excursion',
        routeTitle: 'Yumthang Valley Sightseeing',
        description: 'Start early for Yumthang Valley (11,693 ft), surrounded by snow-covered summits and blooming alpine rhododendrons. Visit the natural hot spring with therapeutic sulfur water. Want more snow? Take the optional thrilling drive to Zero Point (Yumesamdong at 15,300 ft) or Mt. Katao where the civilian road ends right near the Tibetan border ridge. Evening back in Lachung by a warm hearth.',
        highlights: ['Yumthang Valley alpine meadow surrounded by snowy peaks', 'Shingba Rhododendron Sanctuary with 24 species in bloom', 'Natural sulfur hot springs bath', 'Snow play at Zero Point (15,300 ft) right near the border ridge (Optional)'],
        altitude: '3,564 m (11,693 ft) at Yumthang, 4,660 m at Zero Point',
        stayLocation: 'Lachung',
        sightseeingPoints: ['Yumthang Valley', 'Yumthang Hot Springs', 'Shingba Rhododendron Sanctuary', 'Optional: Zero Point (Yumesamdong)', 'Optional: Mt. Katao']
      },
      {
        dayNumber: 4,
        title: 'Lachung to Gangtok Return Journey',
        routeTitle: 'Lachung to Gangtok Transfer',
        description: 'Wake up to the sound of the Lachung Chu river rushing past pine forests. Enjoy breakfast and journey back down towards Gangtok, soaking in the dramatic shifts in vegetation and climate. Arrive in Gangtok by late afternoon for souvenir shopping on MG Marg.',
        highlights: ['Scenic daytime descent through North Sikkim mountain valleys', 'Relaxing evening at Gangtok cafes & handicraft emporiums'],
        altitude: '1,650 m at Gangtok',
        stayLocation: 'Gangtok',
        sightseeingPoints: ['Mangan Bazaar', 'Chungthang Dam', 'MG Marg Gangtok']
      },
      {
        dayNumber: 5,
        title: 'Gangtok to NJP / IXB Departure',
        routeTitle: 'Gangtok to NJP / IXB',
        description: 'After breakfast, start your return journey back down to Bagdogra Airport (IXB) or NJP Railway Station. Your driver bids you farewell like family, leaving you with memories of snowy peaks that will call you back for years to come.',
        highlights: ['Punctual downhill transfer to airport / railway platform', 'Spiky Cabs dedicated farewell assistance'],
        altitude: '130 m at plains',
        stayLocation: 'Departure',
        sightseeingPoints: ['Rangpo Checkpost', 'Sevoke', 'IXB / NJP Junction']
      }
    ]
  },
  {
    id: 'pelling-3n-4d',
    slug: 'pelling-3nights-4days',
    title: 'Pelling & West Sikkim Scenic Heritage Cab Package',
    subtitle: 'NJP / IXB – Pelling – Skywalk & Chenrezig – Khecheopalri – Rabdentse – NJP / IXB',
    destination: 'pelling',
    durationNights: 3,
    durationDays: 4,
    badge: 'Kanchenjunga Close-Up',
    featuredImage: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
    startingPrice: {
      sedan: 16999,
      suv: 24999,
      innova: 28999
    },
    pricingTier: {
      fourSeaterRate: 16999,
      sixSeaterRate: 24999
    },
    offerValidity: '30th April 2027',
    pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP)',
    overview: 'If you want to feel like Mt. Kanchenjunga is sitting in your front yard, Pelling is where your heart belongs. Drive along the scenic Rangit River valley up into the quiet serenity of West Sikkim. Step out onto the thrill of India’s first Glass Skywalk right beneath the colossal golden statue of Chenrezig, walk amidst the moss-covered 17th-century stone ruins of Rabdentse Palace where Sikkim\'s kings once ruled, and whisper a secret wish at the sacred wishing lake of Khecheopalri—where birds miraculously pick up every fallen leaf from the water. Sip hot cardamom tea by the thunderous Kanchenjunga Falls. Pelling is quiet, deeply spiritual, and will stay in your soul forever.',
    bestTime: 'October to May (Crystal-clear close-up views of Mount Kanchenjunga)',
    idealFor: 'Families, photographers, couples, peace-seekers desiring mountain majesty without crowd',
    recommendedVehicles: ['4 seater WagonR / Swift Dzire', 'Maruti Ertiga / Toyota Innova Crysta (6-Seater)'],
    permitRequired: false,
    keyHighlights: [
      'Dedicated 4-Seater & 6-Seater: Best Price on WhatsApp (Complete Private Cab Circuit)',
      'India\'s 1st Glass Skywalk & 137-ft Chenrezig Statue at Sangachoeling',
      'Sacred wish-fulfilling Khecheopalri Lake (surrounded by pristine prayer flags)',
      'Historic 17th-century Rabdentse Palace royal stone ruins',
      'Thunderous Kanchenjunga Waterfall & Rimbi Orange Gardens',
      'Pemayangtse Monastery (one of Sikkim\'s oldest Buddhist monasteries)'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Scenic Mountain Drive to Pelling',
        routeTitle: 'NJP / IXB to Pelling',
        description: 'Meet your Spiky Cabs driver at NJP Railway Station or Bagdogra Airport. Drive along the foothills through Jorethang and the Rangit River valley, climbing steadily towards Pelling (2,150 m). Check in to your hotel and be welcomed by the jaw-dropping, close-up panorama of Mount Kanchenjunga glowing in the evening sunset.',
        highlights: ['Scenic drive along the Rangit River', 'Spectacular sunset glow over Mt. Kanchenjunga from Pelling', 'Quiet and peaceful hill station atmosphere'],
        altitude: '2,150 m (7,200 ft)',
        stayLocation: 'Pelling',
        sightseeingPoints: ['Jorethang Valley', 'Legship', 'Pelling Helipad Viewpoint']
      },
      {
        dayNumber: 2,
        title: 'Pelling Iconic Sights: Glass Skywalk, Chenrezig & Rabdentse',
        routeTitle: 'Pelling Sightseeing Tour',
        description: 'Begin your morning with sunrise views over Kanchenjunga right from your balcony. Head to the thrilling Glass Skywalk perched high on the cliff opposite the 137-foot golden Chenrezig statue. Next, walk through chestnut and pine woods to the historic Rabdentse Ruins—the ancient second capital of Sikkim. Visit the 300-year-old Pemayangtse Monastery, renowned for its intricate wooden sculptures.',
        highlights: ['Thrilling walk on the transparent Glass Skywalk', 'Colossal 137-ft Chenrezig Statue', 'Ancient royal palace ruins of Rabdentse', 'Sacred Pemayangtse Monastery heritage'],
        altitude: '2,150 m',
        stayLocation: 'Pelling',
        sightseeingPoints: ['Pelling Glass Skywalk', 'Chenrezig Statue', 'Rabdentse Ruins', 'Pemayangtse Monastery', 'Pelling Helipad']
      },
      {
        dayNumber: 3,
        title: 'Wonders of West Sikkim: Khecheopalri Lake & Kanchenjunga Falls',
        routeTitle: 'Khecheopalri & Waterfalls Excursion',
        description: 'Drive towards the mystical Khecheopalri Lake, sacred to both Buddhists and Hindus. Tradition holds that not a single leaf remains floating on its surface as birds pick them up immediately. Walk the serene wooden pier lined with colorful prayer wheels. Continue to the roaring Kanchenjunga Waterfalls, Rimbi Orange Gardens, and Rimbi River waterfall.',
        highlights: ['Sacred leaf-free wishing lake of Khecheopalri', 'Massive cascading Kanchenjunga Waterfalls', 'Lush Rimbi Orange Gardens and riverbed'],
        altitude: '1,980 m at Khecheopalri Lake',
        stayLocation: 'Pelling',
        sightseeingPoints: ['Khecheopalri Sacred Lake', 'Kanchenjunga Waterfalls', 'Rimbi Waterfall', 'Rimbi Orange Gardens', 'Darap Eco Village']
      },
      {
        dayNumber: 4,
        title: 'Pelling to NJP / IXB Return Departure',
        routeTitle: 'Pelling to IXB / NJP',
        description: 'Enjoy one last piping hot cup of tea while admiring the morning peaks. Check out and embark on your return descent towards Bagdogra Airport (IXB) or NJP Railway Station. Carry home memories of clear blue skies, fluttering prayer flags, and the warmth of the mountain folk.',
        highlights: ['Smooth downhill transfer through scenic valleys', 'Prompt terminal drop matching train/flight timings'],
        altitude: '130 m at plains',
        stayLocation: 'Departure',
        sightseeingPoints: ['Legship Teesta Confluence', 'Siliguri', 'IXB / NJP Terminal Drop']
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
    featuredImage: '/images/deolo_hill_kalimpong_1790685166158.jpg',
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
    recommendedVehicles: ['4 seater WagonR / Swift Dzire', 'Toyota Innova Crysta', 'Maruti Ertiga'],
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
    featuredImage: '/images/hero_himalayan_cab_1790679944443.jpg',
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
    image: '/images/gallery_tiger_hill_1790680945212.jpg',
    caption: 'Golden morning light illuminating the world’s third highest peak over prayer flags.'
  },
  {
    id: 'g-tsomgo',
    title: 'Glacial Tsomgo Lake',
    location: 'East Sikkim (12,310 ft)',
    category: 'sikkim',
    image: '/images/gallery_tsomgo_lake_1790680958082.jpg',
    caption: 'High-altitude turquoise waters surrounded by snow-draped alpine ridges on the route to Baba Mandir.'
  },
  {
    id: 'g-yumthang',
    title: 'Yumthang Valley of Flowers',
    location: 'North Sikkim (11,693 ft)',
    category: 'sikkim',
    image: '/images/north_sikkim_yumthang_1790679981868.jpg',
    caption: 'A paradise of blooming rhododendrons, pristine alpine meadows, and glacier-fed rivers.'
  },
  {
    id: 'g-tea-mirik',
    title: 'Gopaldhara & Tingling Tea Slopes',
    location: 'Mirik Highway, Darjeeling',
    category: 'darjeeling',
    image: '/images/darjeeling_tea_mirik_1790680004464.jpg',
    caption: 'Emerald rolling hills of high-elevation Darjeeling orthodox tea gardens.'
  },
  {
    id: 'g-fleet-crysta',
    title: 'Toyota Innova Crysta Mountain Service',
    location: 'Himalayan Ridge Highway',
    category: 'fleet',
    image: '/images/fleet_innova_crysta_1790679963418.jpg',
    caption: 'Premium sanitized tourist cab tailored for comfort on hill station hairpin turns.'
  },
  {
    id: 'g-bhutan-dochula',
    title: 'Himalayan Mountain Route & Passes',
    location: 'Indo-Bhutan Border & Foothills',
    category: 'bhutan',
    image: '/images/hero_himalayan_cab_1790679944443.jpg',
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
    thumbnail: '/images/traveler_video_thumb_1_1790680969197.jpg',
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
    thumbnail: '/images/traveler_video_thumb_2_1790680980964.jpg',
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
    thumbnail: '/images/traveler_video_thumb_1_1790680969197.jpg',
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
    image: '/images/darjeeling_toy_train_1790684713643.jpg',
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
    image: '/images/gallery_tiger_hill_1790680945212.jpg',
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
    image: '/images/darjeeling_tea_mirik_1790680004464.jpg',
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
    image: '/images/lamahatta_eco_park_1790685151618.jpg',
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
    image: '/images/nathula_pass_sikkim_1790684731915.jpg',
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
    image: '/images/gallery_tsomgo_lake_1790680958082.jpg',
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
    image: '/images/gangtok_city_view_1790684782649.jpg',
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
    image: '/images/north_sikkim_yumthang_1790679981868.jpg',
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
    image: '/images/gurudongmar_lake_1790685179623.jpg',
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
    image: '/images/ravangla_buddha_park_1790684746815.jpg',
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
    image: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
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
    image: '/images/deolo_hill_kalimpong_1790685166158.jpg',
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
    image: '/images/hero_himalayan_cab_1790679944443.jpg',
    description: 'A mountain pass on the road from Thimphu to Punakha where 108 memorial stupas known as "Druk Wangyal Chortens" stand against the snow-clad peaks of the Bhutan Himalayas.',
    highlights: ['108 Druk Wangyal Memorial Chortens', 'Panoramic Snow Views of Eastern Himalayas', 'Scenic Rhododendron Forest Descent', 'International Route with Spiky Cabs Permits']
  }
];


