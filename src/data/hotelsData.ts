export interface HotelRoomType {
  name: string;
  price: number;
  description: string;
  bedType: string;
  view: string;
  capacity: string;
}

export interface RecommendedHotel {
  id: string;
  slug: string;
  name: string;
  brand: 'Summit' | 'Yashshree' | 'Taj' | 'Rare Himalayas';
  destination: 'darjeeling' | 'gangtok' | 'pelling' | 'lachung' | 'kalimpong' | 'kurseong' | 'rinchenpong';
  regionLabel: string;
  locationAddress: string;
  starRating: number;
  startingPrice: number;
  maxPrice: number;
  tagline: string;
  overview: string;
  featuredImage: string;
  gallery: string[];
  experienceHighlights: string[];
  amenities: string[];
  roomTypes: HotelRoomType[];
  bestSuitedFor: string;
  checkInTime: string;
  checkOutTime: string;
  airportTransferInfo: string;
  railwayTransferInfo: string;
  spikyCabsCombo: {
    circuitSlug: string;
    circuitTitle: string;
    chauffeurNotes: string;
    bundleAdvantage: string;
  };
}

export const HOTELS_DATA: RecommendedHotel[] = [
  // -------------------------------------------------------------
  // TAJ HOTELS
  // -------------------------------------------------------------
  {
    id: 'hotel-taj-chia-kutir',
    slug: 'taj-chia-kutir-resort-darjeeling',
    name: 'Taj Chia Kutir Resort & Spa, Darjeeling',
    brand: 'Taj',
    destination: 'darjeeling',
    regionLabel: 'Kurseong & Darjeeling Hills',
    locationAddress: 'Makaibari Tea Estate, Pankhabari Road, Kurseong, Darjeeling, West Bengal 734203',
    starRating: 5,
    startingPrice: 24500,
    maxPrice: 42000,
    tagline: 'World-Class 5-Star Luxury Amidst Century-Old Organic Makaibari Tea Terraces',
    overview: 'Perched gracefully on the dramatic terraced slopes of the famed Makaibari Tea Estate, Taj Chia Kutir Resort & Spa is the ultimate benchmark of bespoke luxury in the Eastern Himalayas. Spanning 22 acres of mist-kissed organic tea bush gardens, the resort features 72 timber-accented rooms and suites with glass balconies overlooking rolling mountain valleys. Guests indulge in the signature Jiva Spa tea therapies, an all-glass indoor heated pool, curated tea tastings, and royal North-Eastern & Bengali culinary journeys at Sonargaon and Chia Verandah.',
    featuredImage: '/images/hotel_taj_chia_kutir_1791198283277.jpg',
    gallery: [
      '/images/hotel_taj_chia_kutir_1791198283277.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/darjeeling_tea_mirik_1790680004464.jpg'
    ],
    experienceHighlights: [
      'Private guided Makaibari tea sommelier masterclass and estate walks',
      'Award-winning Jiva Spa with bespoke Himalayan green tea wraps and treatments',
      'Temperature-controlled indoor mountain-view heated swimming pool',
      'Fine dining at Sonargaon (royal Bengali specialties) & Chia Verandah all-day tea pavilion',
      'Panoramic sunrise vistas of the Kanchenjunga range and Mirik valley'
    ],
    amenities: [
      'Indoor Heated Pool',
      'Jiva Wellness Spa & Sauna',
      '24/7 In-Room Dining',
      'High-Speed Wi-Fi',
      'Private Forest Balconies',
      'Tea Sommelier Lounge',
      'Fitness Centre',
      'Dedicated Chauffeur Valet & Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Room Tea Garden View',
        price: 24500,
        description: 'Warm timber interiors, king bedding, marble bath with rain shower, and a private balcony directly overlooking Makaibari plantation terraces.',
        bedType: '1 King Bed',
        view: 'Organic Tea Garden & Valley View',
        capacity: '2 Adults + 1 Child'
      },
      {
        name: 'Luxury Room with Valley Balcony',
        price: 31000,
        description: 'Expansive 550 sq.ft suite with plush window divans, freestanding soaking tub with mountain vista, and personalized butler service.',
        bedType: '1 King Bed',
        view: 'Panoramic Himalayan Valley',
        capacity: '2 Adults + 1 Child'
      },
      {
        name: 'Chia Kutir Presidential Suite',
        price: 42000,
        description: 'Lavish multi-room estate suite featuring a private dining salon, expansive sundeck terrace, fireplace, and personal tea sommelier.',
        bedType: '1 Royal King Bed',
        view: '360° Mountain & Tea Terrace Vista',
        capacity: '3 Adults'
      }
    ],
    bestSuitedFor: 'Luxury honeymooners, discerning connoisseurs, executive retreats, and celebratory family vacations.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 42 km · ~1 hr 20 min via Spiky Cabs Pankhabari scenic route.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 46 km · ~1 hr 30 min via dedicated mountain chauffeur.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-mirik-3n-4d',
      circuitTitle: 'Darjeeling & Mirik Luxury Circuit (3N/4D)',
      chauffeurNotes: 'Your private Spiky Cabs chauffeur remains on standby at the estate for scenic day excursions to Kurseong Eagle’s Crag, Tiger Hill sunrise, and Mirik Lake.',
      bundleAdvantage: 'Save up to 18% on private chauffeur transfers with complimentary airport welcome and priority luggage assistance.'
    }
  },
  {
    id: 'hotel-taj-guras-kutir',
    slug: 'taj-guras-kutir-resort-gangtok',
    name: 'Taj Guras Kutir Resort & Spa, Gangtok',
    brand: 'Taj',
    destination: 'gangtok',
    regionLabel: 'Pangthang & Gangtok Valley',
    locationAddress: 'Pangthang, Near Kabi Lungchok Road, Gangtok, Sikkim 737103',
    starRating: 5,
    startingPrice: 22000,
    maxPrice: 38000,
    tagline: '5-Star Himalayan Sanctuary Overlooking Mystical Rhododendron Valleys & Kanchenjunga',
    overview: 'Surrounded by pristine high-altitude forests of alpine oak and blooming rhododendrons in Pangthang, Taj Guras Kutir is Taj’s flagship 5-star mountain sanctuary in Sikkim. Featuring traditional Sikkimese wooden craftsmanship, contemporary glass walls with 180-degree panoramas of Mount Kanchenjunga, and signature Jiva wellness rituals, the retreat is designed for discerning travelers seeking tranquil luxury and world-class hospitality.',
    featuredImage: '/images/hotel_hero_luxury_resort_1791198161227.jpg',
    gallery: [
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/hotel_taj_chia_kutir_1791198283277.jpg',
      '/images/gangtok_city_view_1790684782649.jpg'
    ],
    experienceHighlights: [
      'Breathtaking unobstructed views of Mount Kanchenjunga and the Sikkim valley',
      'Award-winning Jiva Spa with bespoke Himalayan salt and herbal restorative therapies',
      'Authentic Sikkimese, Tibetan, and contemporary global gastronomy',
      'Private nature walks, birdwatching trails, and village monastery visits'
    ],
    amenities: [
      'Heated Indoor Pool',
      'Jiva Wellness & Ayurvedic Spa',
      'All-Day Fine Dining',
      'High-Speed Wi-Fi',
      'Heated Wooden Floors & Room Heating',
      'Fitness Centre',
      '24/7 Concierge & Valet Chauffeur Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Valley View Room',
        price: 22000,
        description: 'Elegantly appointed room with panoramic balcony framing Sikkim hills and alpine greenery, king bedding, and luxury marble bathroom.',
        bedType: '1 King Bed',
        view: 'Forest & Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Luxury Kanchenjunga View Suite',
        price: 31000,
        description: 'Spacious suite with floor-to-ceiling glass windows, private fireplace sitting salon, and panoramic vista of Mount Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga Range',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Luxury honeymooners, family retreats, and travelers seeking five-star tranquility away from city congestion.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 130 km · ~4.5 hrs via Spiky Cabs dedicated Innova Crysta.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 125 km · ~4 hrs 15 min.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-darjeeling-4n-5d',
      circuitTitle: 'Taj Dual-Estate Luxury Mountain Circuit',
      chauffeurNotes: 'Seamless chauffeur connection between Taj Chia Kutir (Darjeeling) and Taj Guras Kutir (Gangtok) with zero luggage hassle.',
      bundleAdvantage: 'Special discounted round-trip luxury Innova Crysta charter for your entire Sikkim stay.'
    }
  },

  // -------------------------------------------------------------
  // SUMMIT HOTELS & RESORTS (DARJEELING & SIKKIM)
  // -------------------------------------------------------------
  {
    id: 'hotel-summit-swiss-heritage',
    slug: 'summit-swiss-heritage-resort-darjeeling',
    name: 'Summit Swiss Heritage Resort & Spa, Darjeeling',
    brand: 'Summit',
    destination: 'darjeeling',
    regionLabel: 'Darjeeling Town & Gandhi Road',
    locationAddress: 'Mall Road Extension, Near Raj Bhavan & Gandhi Road, Darjeeling, West Bengal 734101',
    starRating: 4.5,
    startingPrice: 4600,
    maxPrice: 8500,
    tagline: '1914 British Colonial Heritage Architecture with Flower-Laden Terraced Lawns',
    overview: 'Established in 1914, Summit Swiss Heritage Resort & Spa transports travelers back to the golden era of British mountain residences. Situated just a gentle walk from Darjeeling Mall (Chowrasta) along tranquil Gandhi Road, this heritage property features sloping timber roofs, historic stone masonry, manicured lawn gardens, and classic British bay windows facing the snow-crowned Kanchenjunga peak. Modern comforts like the signature Metta Spa, multi-cuisine Alpine Restaurant, and heated rooms ensure cozy mountain stays.',
    featuredImage: '/images/hotel_summit_darjeeling_1791198303099.jpg',
    gallery: [
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/darjeeling_toy_train_1790679944443.jpg',
      '/images/gallery_tiger_hill_1790680945212.jpg'
    ],
    experienceHighlights: [
      'Strolling along 100-year-old colonial wood-paneled corridors and cozy library',
      'Evening bonfire gatherings on the lawn with traditional Darjeeling tea and folk music',
      'Metta Spa holistic ayurvedic and Himalayan herbal relaxation therapies',
      'Walkable 10-minute access to Chowrasta Mall, Glenary’s, and the Darjeeling Ropeway',
      'Direct sunrise viewpoints of Mount Kanchenjunga from upper floor heritage suites'
    ],
    amenities: [
      'Metta Ayurvedic Spa',
      'Heated Rooms & Electric Blankets',
      'Lawn Gardens & Bonfire Deck',
      'Alpine Multi-Cuisine Restaurant',
      'Complimentary Wi-Fi',
      'Children Play Area',
      'In-House Bakery & Tea Lounge',
      'Secure Private Car Parking'
    ],
    roomTypes: [
      {
        name: 'Heritage Deluxe Room',
        price: 4600,
        description: 'Classic timber flooring, antique furnishings, modern en-suite heated bath, and charming pine tree valley views.',
        bedType: '1 Queen Bed',
        view: 'Valley & Pine Forest View',
        capacity: '2 Adults'
      },
      {
        name: 'Premium Kanchenjunga View Room',
        price: 6200,
        description: 'Large colonial bay window opening to unobstructed sunrise vistas of Mount Kanchenjunga, sofa sitting area, and tea maker.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga Vista',
        capacity: '2 Adults + 1 Child'
      },
      {
        name: 'Swiss Heritage Family Suite',
        price: 8500,
        description: 'Two interconnected bedroom chambers with wooden ceilings, fireplace decor, and expansive valley views for family comfort.',
        bedType: '2 Double Beds',
        view: 'Darjeeling Valley & Town Lights',
        capacity: '4 Adults'
      }
    ],
    bestSuitedFor: 'Heritage enthusiasts, families seeking walking proximity to Mall Road, and couples desiring authentic colonial charm.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 68 km · ~2 hrs 45 min via Spiky Cabs Rohini / Hill Cart Road route.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 70 km · ~2 hrs 40 min with Spiky Cabs dedicated hill chauffeur.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-classic-2n-3d',
      circuitTitle: 'Darjeeling Classic Sunrise Circuit (2N/3D)',
      chauffeurNotes: 'Includes early morning 3:45 AM private transfer to Tiger Hill for sunrise over Everest & Kanchenjunga, followed by Batasia Loop, Ghoom Monastery, and Peace Pagoda.',
      bundleAdvantage: 'Seamless door-to-door cab pickup directly from the hotel courtyard without steep uphill luggage hauling.'
    }
  },

  {
    id: 'hotel-summit-hermon-darjeeling',
    slug: 'summit-hermon-hotel-darjeeling',
    name: 'Summit Hermon Hotel & Spa, Darjeeling',
    brand: 'Summit',
    destination: 'darjeeling',
    regionLabel: 'Singamari & Ropeway Ridge',
    locationAddress: 'Lebong Cart Road, Near Singamari, Darjeeling, West Bengal 734104',
    starRating: 4,
    startingPrice: 3800,
    maxPrice: 6500,
    tagline: 'Modern Contemporary Hill Resort Near Happy Valley Tea Estate & Ropeway',
    overview: 'Located perched along the picturesque Lebong ridge near the Darjeeling Ropeway and Happy Valley Tea Estate, Summit Hermon Hotel & Spa is tailored for travelers who appreciate sleek modern mountain aesthetics. Rooms are outfitted with private panoramic glass balconies overlooking the lush Lebong Valley and snow peaks. Featuring a rooftop restaurant, Metta Spa, and prompt room service, it offers quiet rejuvenation away from town center congestion.',
    featuredImage: '/images/hotel_summit_darjeeling_1791198303099.jpg',
    gallery: [
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/darjeeling_tea_mirik_1790680004464.jpg'
    ],
    experienceHighlights: [
      'Walking proximity to the Darjeeling Rangeet Valley Passenger Ropeway',
      'Panoramic balcony breakfasts facing the rolling Lebong tea gardens',
      'Sleek modern baths with continuous 24-hour geyser hot water',
      'Convenient drop & pickup access on Lebong Cart Road with ample parking'
    ],
    amenities: [
      'Rooftop View Restaurant',
      'Metta Spa Center',
      'Private Glass Balconies',
      'Room Heaters & Tea Kettles',
      'Elevator Access',
      'Free Parking',
      'High-Speed Wi-Fi'
    ],
    roomTypes: [
      {
        name: 'Deluxe Valley View',
        price: 3800,
        description: 'Modern room with large viewing window, hardwood accents, workspace desk, and valley view.',
        bedType: '1 King Bed',
        view: 'Lebong Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Executive Balcony Room',
        price: 5200,
        description: 'Private open-air sitout balcony facing morning clouds and green hills, plush duvets, and HD television.',
        bedType: '1 King Bed',
        view: 'Tea Garden & Mountain Range',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples, young families, and road trippers looking for modern comfort with hassle-free vehicle access.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 72 km · ~3 hrs private drive.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 74 km · ~2 hrs 50 min drive.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-classic-2n-3d',
      circuitTitle: 'Darjeeling & Valley Ropeway Circuit',
      chauffeurNotes: 'Your Spiky Cabs driver can seamlessly shuttle you to Mall Road for evening shopping and pick you up post-dinner.',
      bundleAdvantage: 'Zero parking hassles on Darjeeling narrow hills with scheduled local transfers.'
    }
  },

  {
    id: 'hotel-summit-golden-crescent-gangtok',
    slug: 'summit-golden-crescent-resort-gangtok',
    name: 'Summit Golden Crescent Resort & Spa, Gangtok',
    brand: 'Summit',
    destination: 'gangtok',
    regionLabel: 'Deorali & South Gangtok',
    locationAddress: 'Deorali, Below Forest Secretariat, Gangtok, Sikkim 737102',
    starRating: 4.5,
    startingPrice: 4800,
    maxPrice: 8900,
    tagline: 'Scenic Hillside Luxury Resort with Sprawling Valley Views Near Gangtok Cable Car',
    overview: 'Strategically positioned in the tranquil Deorali neighborhood of Gangtok, Summit Golden Crescent Resort & Spa combines urban connectivity with peaceful mountain seclusion. The resort boasts spacious rooms with floor-to-ceiling panoramic glass windows capturing the dramatic silhouette of Gangtok hillside and Rumtek hill. Enjoy authentic Sikkimese and pan-Asian dining at the signature in-house restaurant, unwind at the Metta Wellness Spa, and take advantage of the convenient 5-minute drive to the Deorali Gangtok Ropeway.',
    featuredImage: '/images/hotel_hero_luxury_resort_1791198161227.jpg',
    gallery: [
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/gangtok_city_view_1790684782649.jpg',
      '/images/gallery_tsomgo_lake_1790680958082.jpg'
    ],
    experienceHighlights: [
      'Sunset views of the illuminated Gangtok valley from the scenic dining deck',
      'Rejuvenating hot stone and herbal oil massages at Metta Spa',
      'Close proximity to Namgyal Institute of Tibetology and Do Drul Chorten Stupa',
      'Smooth drive-in access for SUVs and spacious vehicle parking'
    ],
    amenities: [
      'Metta Luxury Spa',
      'Multi-Cuisine Restaurant & Bar',
      'Central Heating System',
      'Free High-Speed Wi-Fi',
      'Elevator / Lift',
      'Valet & Tour Desk',
      'Conference & Banquet Hall'
    ],
    roomTypes: [
      {
        name: 'Deluxe Valley Room',
        price: 4800,
        description: 'Warm earth-toned decor, plush spring bedding, panoramic viewing window, and hot shower bath.',
        bedType: '1 King Bed',
        view: 'Gangtok Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Suite with Private Balcony',
        price: 7400,
        description: 'Separate living sitting room, private open-air mountain balcony, minibar, and complimentary fruit basket.',
        bedType: '1 King Bed',
        view: '360° Valley & Hill Vista',
        capacity: '2 Adults + 2 Children'
      }
    ],
    bestSuitedFor: 'Tourists seeking a premium base for Tsomgo Lake, Nathula Pass, and Gangtok local sightseeing.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Pakyong Airport (PYG): 24 km · ~50 min | Bagdogra Airport (IXB): 120 km · ~4.5 hrs via Spiky Cabs.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 115 km · ~4 hrs along scenic Teesta River highway.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-tsomgo-nathula-3n-4d',
      circuitTitle: 'Gangtok & High-Altitude Nathula Pass Circuit (3N/4D)',
      chauffeurNotes: 'Spiky Cabs handles restricted area permits (PAP) for Tsomgo Lake, Baba Mandir, and Nathula Pass with private Innova/SUV right from the hotel entrance.',
      bundleAdvantage: 'Pre-arranged Sikkim tourism permit documentation and seamless morning departure.'
    }
  },

  {
    id: 'hotel-summit-denzong-gangtok',
    slug: 'summit-denzong-hotel-gangtok',
    name: 'Summit Denzong Hotel & Spa, Gangtok',
    brand: 'Summit',
    destination: 'gangtok',
    regionLabel: 'Kazi Road & MG Marg Vicinity',
    locationAddress: 'Kazi Road, Near Power House, Gangtok, Sikkim 737101',
    starRating: 4,
    startingPrice: 4200,
    maxPrice: 7200,
    tagline: 'Warm Wooden Interiors and Kanchenjunga Vistas Just Minutes from MG Marg',
    overview: 'Perched on Kazi Road in the heart of Gangtok, Summit Denzong Hotel & Spa pays homage to Sikkim’s cultural architecture through handcrafted wooden paneling, Sikkimese motifs, and large view windows that gaze across at Mount Kanchenjunga on clear days. Within a comfortable 7-minute walk to the bustling pedestrian MG Marg, it is ideal for travelers who want easy evening dining and shopping while relaxing in a peaceful resort environment.',
    featuredImage: '/images/hotel_summit_darjeeling_1791198303099.jpg',
    gallery: [
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/gangtok_city_view_1790684782649.jpg'
    ],
    experienceHighlights: [
      'Walking access to MG Marg cafes, souvenir shops, and bakeries',
      'Authentic Sikkimese Thali and local momos at the Denzong Restaurant',
      'Rooftop observation terrace capturing Kanchenjunga morning sunlight'
    ],
    amenities: [
      'Metta Spa Center',
      'Restaurant & Lounge',
      'Room Heating',
      'Free Wi-Fi',
      '24/7 Front Desk',
      'Travel Assistance'
    ],
    roomTypes: [
      {
        name: 'Executive Mountain View',
        price: 4200,
        description: 'Rich teakwood paneling, bay window overlooking the snow crest, and plush warm bedding.',
        bedType: '1 Queen Bed',
        view: 'Mountain & City Vista',
        capacity: '2 Adults'
      },
      {
        name: 'Denzong Heritage Suite',
        price: 6500,
        description: 'Spacious suite with sitting area, sofa-cum-bed, and unobstructed views of Mount Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Panoramic Kanchenjunga',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples and families who want immediate walkable access to MG Marg without hill climbing.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 122 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 118 km · ~4 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-tsomgo-nathula-3n-4d',
      circuitTitle: 'Complete Gangtok Explorer Circuit',
      chauffeurNotes: 'Your driver picks you up right on Kazi Road for local sightseeing to Tashi Viewpoint, Ban Jhakri Falls, and Rumtek Monastery.',
      bundleAdvantage: 'Dedicated local permit desk and guaranteed mountain chauffeurs with clean, sanitized vehicles.'
    }
  },

  {
    id: 'hotel-summit-barsana-kalimpong',
    slug: 'summit-barsana-resort-kalimpong',
    name: 'Summit Barsana Resort & Spa, Kalimpong',
    brand: 'Summit',
    destination: 'kalimpong',
    regionLabel: 'Upper Cart Road, Kalimpong',
    locationAddress: 'Upper Cart Road, Near Dr. Graham’s Homes, Kalimpong, West Bengal 734301',
    starRating: 4.5,
    startingPrice: 4000,
    maxPrice: 7500,
    tagline: 'Quiet Botanical Hilltop Haven with Lush Gardens and Himalayan Vistas',
    overview: 'Surrounded by Kalimpong’s famous orchid nurseries and pine valleys, Summit Barsana Resort & Spa is a peaceful sanctuary designed for slow mountain living. Featuring manicured lawn gardens overflowing with exotic flowers, an outdoor amphitheater, Metta Spa, and private cottage balconies facing Mount Kanchenjunga, it offers an idyllic respite between Darjeeling and Gangtok circuits.',
    featuredImage: '/images/deolo_hill_kalimpong_1790685166158.jpg',
    gallery: [
      '/images/deolo_hill_kalimpong_1790685166158.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Private garden cottages surrounded by camellias and seasonal mountain flowers',
      'Sunset tea on the open lawn with panoramic Kanchenjunga views',
      'Short 10-minute drive to Deolo Hill, Science City, and Durpin Monastery',
      'Peaceful non-commercial atmosphere with pure mountain air'
    ],
    amenities: [
      'Metta Wellness Spa',
      'Manicured Botanical Lawns',
      'Multi-Cuisine Garden Restaurant',
      'Cottage Style Balconies',
      'Free Parking',
      'Outdoor Bonfire Deck',
      'Free High-Speed Wi-Fi'
    ],
    roomTypes: [
      {
        name: 'Garden View Deluxe',
        price: 4000,
        description: 'Airy room with direct lawn access, wooden floors, sitting chairs, and tea amenities.',
        bedType: '1 King Bed',
        view: 'Floral Gardens View',
        capacity: '2 Adults'
      },
      {
        name: 'Barsana Cottage Suite',
        price: 6800,
        description: 'Stand-alone cottage suite with high timber ceilings, private wooden balcony, and direct views of Mount Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga & Pine Valley',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Nature lovers, peace seekers, couples, and family reunions looking for scenic tranquility.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 78 km · ~2 hrs 45 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 72 km · ~2 hrs 30 min via Coronation Bridge.',
    spikyCabsCombo: {
      circuitSlug: 'kalimpong-darjeeling-combo',
      circuitTitle: 'Kalimpong & Deolo Hill Excursion',
      chauffeurNotes: 'Your Spiky Cabs chauffeur guides you through Pine View Cactus Nursery, Deolo Hill paragliding points, and Morgan House.',
      bundleAdvantage: 'Combined inter-city transfer between Gangtok/Darjeeling and Kalimpong with scenic river stopovers.'
    }
  },

  {
    id: 'hotel-summit-newa-regency-pelling',
    slug: 'summit-newa-regency-pelling',
    name: 'Summit Newa Regency, Pelling',
    brand: 'Summit',
    destination: 'pelling',
    regionLabel: 'Lower Pelling, West Sikkim',
    locationAddress: 'Pelling-Rimbi Road, Lower Pelling, West Sikkim 737113',
    starRating: 4,
    startingPrice: 3600,
    maxPrice: 6200,
    tagline: 'Front-Row Sunrise Panorama of Kanchenjunga in Picturesque West Sikkim',
    overview: 'Standing proud on the sun-kissed ridges of Pelling, Summit Newa Regency provides one of the most uninterrupted front-row panoramas of the Kanchenjunga massif anywhere in West Sikkim. The hotel blends traditional Sikkimese hospitality with cozy contemporary amenities including heated bedding, in-house Metta Spa services, and a warm wooden dining hall serving fresh mountain delicacies.',
    featuredImage: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
    gallery: [
      '/images/pelling_skywalk_sikkim_1790684762658.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Unobstructed sunrise photography of Mount Kanchenjunga directly from your room window',
      'Short 15-minute drive to Pelling Glass Skywalk and Chenrezig statue',
      'Visits to the sacred Khecheopalri Wish-Fulfilling Lake and Rabdentse Ruins'
    ],
    amenities: [
      'Metta Spa Facility',
      'Panoramic Dining Hall',
      'Room Heaters & Geysers',
      'Free Parking',
      'Wi-Fi in Public Areas',
      'Tour & Sightseeing Desk'
    ],
    roomTypes: [
      {
        name: 'Deluxe Valley View',
        price: 3600,
        description: 'Cozy mountain room with large window facing the morning mist and pine valley.',
        bedType: '1 Double Bed',
        view: 'Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Premium Kanchenjunga View',
        price: 5200,
        description: 'Wide view window facing the snow-capped Kanchenjunga peaks, timber finishes, and hot tea service.',
        bedType: '1 King Bed',
        view: 'Kanchenjunga Snow Range',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Photographers, spiritual explorers, and mountain lovers touring West Sikkim.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 135 km · ~4.5 hrs.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 130 km · ~4.5 hrs via Jorethang.',
    spikyCabsCombo: {
      circuitSlug: 'pelling-west-sikkim-3n-4d',
      circuitTitle: 'Pelling & West Sikkim Heritage Circuit',
      chauffeurNotes: 'Private Spiky Cabs transfer covering Pelling Skywalk, Pemayangtse Monastery, Rimbi Falls, and Kanchenjunga Falls.',
      bundleAdvantage: 'Rugged SUV vehicles (Innova / Scorpio) tailored for West Sikkim mountain terrain.'
    }
  },

  {
    id: 'hotel-summit-grace-darjeeling',
    slug: 'summit-grace-hotel-darjeeling',
    name: 'Summit Grace Hotel & Spa, Darjeeling',
    brand: 'Summit',
    destination: 'darjeeling',
    regionLabel: 'Jalapahar & Dr. Zakir Hussain Road, Darjeeling',
    locationAddress: 'Dr. Zakir Hussain Road, Jalapahar, Darjeeling, West Bengal 734101',
    starRating: 4,
    startingPrice: 3800,
    maxPrice: 6500,
    tagline: 'Quaint Pine-Cottage Retreat Nestled in the Serene Heights of Jalapahar',
    overview: 'Tucked away from the bustling town center on the tranquil forested slopes of Jalapahar, Summit Grace Hotel & Spa offers charming stone-and-timber cottage architecture with sweeping views of the rolling Darjeeling valley. Featuring wood-paneled duplex attic rooms, landscaped lawn sit-outs, Metta Spa wellness therapies, and quiet pine forest walking trails, it is an idyllic haven for travelers seeking peace and mountain air.',
    featuredImage: '/images/hotel_summit_darjeeling_1791198303099.jpg',
    gallery: [
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/darjeeling_tea_mirik_1790680004464.jpg'
    ],
    experienceHighlights: [
      'Peaceful high-elevation location surrounded by aromatic cedar and pine trees',
      'Duplex attic rooms with timber beams and mountain view balconies',
      'Metta Spa rejuvenating massages and herbal steam therapies',
      'Panoramic tea lawn with bonfire arrangements under starry mountain skies'
    ],
    amenities: [
      'Metta Wellness Spa',
      'Multi-Cuisine Restaurant',
      'Room Heaters & Heated Blankets',
      'Lawn Tea Sit-out',
      'High-Speed Wi-Fi',
      'Dedicated Chauffeur Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Valley View Room',
        price: 3800,
        description: 'Pinewood finish, cozy double bed, modern bathroom with hot water, and window framing the misty valley.',
        bedType: '1 Double Bed',
        view: 'Darjeeling Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Grace Duplex Family Suite',
        price: 6200,
        description: 'Two-tier attic wooden suite with loft bed, living lounge, and private balcony overlooking pine forests.',
        bedType: '1 King Bed + 1 Loft Queen',
        view: 'Pine Forest & Valley',
        capacity: '4 Adults'
      }
    ],
    bestSuitedFor: 'Couples seeking quiet romance, artists, writers, and families wanting a relaxed retreat.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 72 km · ~2 hrs 45 min via Hill Cart Road.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 75 km · ~2 hrs 45 min.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-mirik-3n-4d',
      circuitTitle: 'Darjeeling Scenic Ridge Chauffeur Transfer',
      chauffeurNotes: 'Your Spiky Cabs driver coordinates smooth pickups on Dr. Zakir Hussain Road and drives to Batasia Loop and Peace Pagoda.',
      bundleAdvantage: 'Avoid town-center taxi confusion with dedicated gate-to-gate chauffeured transfers.'
    }
  },

  {
    id: 'hotel-summit-ttakshang-gangtok',
    slug: 'summit-ttakshang-residency-gangtok',
    name: 'Summit Ttakshang Residency Hotel & Spa, Gangtok',
    brand: 'Summit',
    destination: 'gangtok',
    regionLabel: 'Paljor Stadium Road & MG Marg, Gangtok',
    locationAddress: 'Paljor Stadium Road, Near MG Marg, Gangtok, Sikkim 737101',
    starRating: 4,
    startingPrice: 3400,
    maxPrice: 5800,
    tagline: 'Vibrant Central Location Minutes from MG Marg with Modern Alpine Comfort',
    overview: 'Located just a brief 5-minute stroll from Gangtok’s bustling pedestrian Mall (MG Marg) on Paljor Stadium Road, Summit Ttakshang Residency is one of Gangtok’s most convenient and reliable upscale hotels. It combines contemporary mountain aesthetics with cozy wooden furnishings, an in-house Metta Spa, and the rooftop Tsheykhang Restaurant serving local Sikkimese and Indian dishes with skyline views.',
    featuredImage: '/images/gangtok_city_view_1790684782649.jpg',
    gallery: [
      '/images/gangtok_city_view_1790684782649.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Effortless walking access to MG Marg cafes, souvenir shops, and bakeries',
      'Rooftop Tsheykhang Restaurant with panoramic town and valley views',
      'Metta Spa relaxing therapies after high-altitude excursions',
      'Spacious heated rooms with prompt mountain room service'
    ],
    amenities: [
      'Rooftop Restaurant & Bar',
      'Metta Wellness Spa',
      'Elevator / Lift Access',
      'Central Room Heating',
      'High-Speed Wi-Fi',
      'Secure Vehicle Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe City View Room',
        price: 3400,
        description: 'Contemporary wood finishes, king bed, flat-screen TV, and hot running shower.',
        bedType: '1 King Bed',
        view: 'Gangtok Town Skyline',
        capacity: '2 Adults'
      },
      {
        name: 'Executive Mountain Balcony Room',
        price: 5200,
        description: 'Upper floor room with private glass balcony facing green Sikkim ridges and mountain mist.',
        bedType: '1 King Bed',
        view: 'Mountain Valley View',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Shopping enthusiasts, families, and leisure travelers who want to be steps from MG Marg.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 124 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 120 km · ~4 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-darjeeling-4n-5d',
      circuitTitle: 'Gangtok Local & Tsomgo Lake Cab Combo',
      chauffeurNotes: 'Your Spiky Cabs driver picks you up right at the hotel porch for day tours to Tsomgo Lake, Baba Mandir, and Nathula Pass.',
      bundleAdvantage: 'All Sikkim tourist permits and vehicle passes handled in advance by Spiky Cabs.'
    }
  },

  {
    id: 'hotel-summit-mount-himalayan-gangtok',
    slug: 'summit-mount-himalayan-resort-gangtok',
    name: 'Summit Mount Himalayan Resort & Spa, Gangtok',
    brand: 'Summit',
    destination: 'gangtok',
    regionLabel: 'Upper Sichey & Gangtok Hills, Sikkim',
    locationAddress: 'Upper Sichey, Near Tamang Gumpa, Gangtok, Sikkim 737101',
    starRating: 4,
    startingPrice: 3200,
    maxPrice: 5400,
    tagline: 'Serene Valley Retreat Overlooking Terraced Slopes & Snow Peaks',
    overview: 'Perched in the quieter residential quarter of Upper Sichey in Gangtok, Summit Mount Himalayan Resort & Spa is surrounded by lush green flora and terraced slopes. Designed for those who value quiet evenings without traffic noise, the resort features well-appointed rooms with large windows, multi-cuisine dining, and easy cab connectivity to Gangtok attractions.',
    featuredImage: '/images/hotel_hero_luxury_resort_1791198161227.jpg',
    gallery: [
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/gangtok_city_view_1790684782649.jpg'
    ],
    experienceHighlights: [
      'Quiet and peaceful ambiance away from commercial street noise',
      'Sweeping views of lush forested ridges and morning sun',
      'Metta Spa holistic massages and hot oil relaxation',
      'Authentic local Sikkimese momos and thukpa prepared fresh'
    ],
    amenities: [
      'Metta Spa Facility',
      'In-House Restaurant',
      'Room Heating',
      'Free Parking',
      'Wi-Fi Connectivity',
      'Travel Desk Support'
    ],
    roomTypes: [
      {
        name: 'Deluxe Room',
        price: 3200,
        description: 'Cozy mountain room with double bed, tea/coffee maker, warm lighting, and private bath.',
        bedType: '1 Double Bed',
        view: 'Garden & Ridge View',
        capacity: '2 Adults'
      },
      {
        name: 'Suite with Valley View',
        price: 4900,
        description: 'Spacious suite featuring separate seating lounge and panoramic mountain view window.',
        bedType: '1 King Bed',
        view: 'Gangtok Valley Vista',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Budget-conscious luxury travelers, families with children, and peaceful vacationers.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 122 km · ~4 hrs.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 118 km · ~3 hrs 45 min.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-darjeeling-4n-5d',
      circuitTitle: 'Gangtok Central & South Sikkim Link',
      chauffeurNotes: 'Comfortable dedicated cab transfers between Upper Sichey and Gangtok ropeway, flower exhibition, and Ban Jhakri Falls.',
      bundleAdvantage: 'Guaranteed sanitized cabs with local mountain chauffeurs.'
    }
  },

  {
    id: 'hotel-summit-alpine-lachung',
    slug: 'summit-alpine-resort-lachung',
    name: 'Summit Alpine Resort, Lachung',
    brand: 'Summit',
    destination: 'lachung',
    regionLabel: 'Lachung Valley, North Sikkim',
    locationAddress: 'Katao Road, Near Apple Orchards, Lachung, North Sikkim 737120',
    starRating: 4,
    startingPrice: 5500,
    maxPrice: 9000,
    tagline: 'Cozy Timber Alpine Haven in the High-Altitude Wonderland of North Sikkim',
    overview: 'Standing amidst the dramatic snow-capped alpine mountains of Lachung at 8,600 feet, Summit Alpine Resort offers modern warmth and cozy hospitality in the remote wilderness of North Sikkim. With insulated wood-paneled walls, heavy duvets, electric mattress warmers, and a central dining room serving hot nourishing Himalayan meals, it provides the ideal basecamp for your expeditions to Yumthang Valley and Zero Point.',
    featuredImage: '/images/north_sikkim_yumthang_1790679981868.jpg',
    gallery: [
      '/images/north_sikkim_yumthang_1790679981868.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Premier comfortable stay in the rugged alpine landscape of North Sikkim',
      'Electric bed heaters and radiant room warmers ensuring complete cozy comfort',
      'Fresh hot buffet dining with vegetarian and non-vegetarian selections',
      'Prime location for early morning departures to Yumthang Valley (24 km)'
    ],
    amenities: [
      'Radiant Room Heaters & Bed Warmers',
      '24/7 Hot Running Water',
      'Alpine Buffet Dining Hall',
      'Medical Oxygen Support',
      'High-Clearance Vehicle Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Alpine Wood Room',
        price: 5500,
        description: 'Pinewood insulated room with electric heated mattress, thick thermal duvets, and view of rugged peaks.',
        bedType: '1 Double Bed',
        view: 'Lachung Alpine Peaks',
        capacity: '2 Adults'
      },
      {
        name: 'Alpine Premium Suite',
        price: 8200,
        description: 'Spacious suite with wood-paneled living corner, enhanced heating, and panoramic snow-mountain views.',
        bedType: '1 King Bed',
        view: 'Panoramic Glacial Valley',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Nature enthusiasts, adventure couples, and families journeying through North Sikkim.',
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    airportTransferInfo: 'Transfers originate from Gangtok: 112 km · ~5.5 hrs drive along Teesta River.',
    railwayTransferInfo: 'From NJP: 230 km · 2-Day itinerary with Gangtok overnight.',
    spikyCabsCombo: {
      circuitSlug: 'north-sikkim-4n-5d',
      circuitTitle: 'North Sikkim 4WD Expeditions (Yumthang & Zero Point)',
      chauffeurNotes: 'Spiky Cabs experienced high-altitude drivers provide dedicated 4WD Scorpio / Innova vehicles with pre-arranged Sikkim Protected Area Permits.',
      bundleAdvantage: 'Zero permit hassles; our chauffeurs manage military checkpost documentation.'
    }
  },

  // -------------------------------------------------------------
  // SUMI YASHSHREE HOTELS & RESORTS (DARJEELING & SIKKIM)
  // -------------------------------------------------------------
  {
    id: 'hotel-yashshree-mall-road-darjeeling',
    slug: 'yashshree-mall-road-hotel-darjeeling',
    name: 'Yashshree Mall Road, Darjeeling',
    brand: 'Yashshree',
    destination: 'darjeeling',
    regionLabel: 'Chowrasta Mall Road, Darjeeling',
    locationAddress: 'H.D. Lama Road, 50 Metres from Chowrasta Mall, Darjeeling, West Bengal 734101',
    starRating: 4.5,
    startingPrice: 4200,
    maxPrice: 8200,
    tagline: 'Premier Boutique Luxury Literally Steps from Chowrasta & Glenary’s',
    overview: 'Unrivaled in location, Yashshree Mall Road sits just 50 meters from Darjeeling’s world-famous Chowrasta Mall square. Featuring warm wooden colonial interiors, fine handwoven fabrics, and the acclaimed Blue Jade Multi-Cuisine Restaurant, this boutique gem provides an exclusive retreat right in the vibrant cultural core of the hill station. Guests enjoy leisurely strolls along the Mall without negotiating long uphill stairs.',
    featuredImage: '/images/hotel_summit_darjeeling_1791198303099.jpg',
    gallery: [
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/darjeeling_toy_train_1790684713643.jpg'
    ],
    experienceHighlights: [
      'Step directly outside onto Darjeeling Mall Road for evening horse rides and bakery visits',
      'Savor North Indian and Oriental delicacies at the Blue Jade Restaurant',
      'Elegantly appointed rooms with plush carpeting and modern heated bathrooms',
      'Complimentary evening tea and cookie service in the boutique lounge'
    ],
    amenities: [
      'Blue Jade Multi-Cuisine Restaurant',
      'Centralized Room Heating',
      'Free High-Speed Wi-Fi',
      '24/7 Room Service',
      'Elevator / Lift',
      'Luggage Porters Available'
    ],
    roomTypes: [
      {
        name: 'Deluxe Heritage Room',
        price: 4200,
        description: 'Boutique wood-accented room with queen bed, HD TV, premium linens, and modern rain shower.',
        bedType: '1 Queen Bed',
        view: 'Darjeeling Town & Hill View',
        capacity: '2 Adults'
      },
      {
        name: 'Executive Kanchenjunga Suite',
        price: 6800,
        description: 'Corner suite with wide panoramic bay window, comfortable sitting couch, and breakfast included.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga & Chowrasta',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples, families with elderly parents, and shoppers who prioritize prime Mall Road convenience.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 68 km · ~2 hrs 45 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 70 km · ~2 hrs 40 min.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-classic-2n-3d',
      circuitTitle: 'Darjeeling City & Tea Garden Combo',
      chauffeurNotes: 'Your Spiky Cabs driver arranges smooth luggage porterage at the Chowrasta junction so you can walk into the hotel effortlessly.',
      bundleAdvantage: 'Dedicated drop-off point coordination with zero luggage stress.'
    }
  },

  {
    id: 'hotel-sumi-yashshree-suites-gangtok',
    slug: 'sumi-yashshree-suites-gangtok',
    name: 'Sumi Yashshree Suites & Spa, Gangtok',
    brand: 'Yashshree',
    destination: 'gangtok',
    regionLabel: 'Development Area, Gangtok',
    locationAddress: 'Development Area, Above High Court, Gangtok, Sikkim 737101',
    starRating: 4.5,
    startingPrice: 4600,
    maxPrice: 8800,
    tagline: 'Sophisticated Modern Mountain Suites with Spa Near Gangtok High Court',
    overview: 'Located in the peaceful Development Area overlooking Gangtok city and the distant pine ridges, Sumi Yashshree Suites & Spa delivers modern boutique luxury with genuine Sikkimese hospitality. Featuring tastefully decorated suites with wood finishes, large private balconies, an in-house luxury wellness spa, and an upscale multi-cuisine restaurant, this property is a favorite among executive travelers and families seeking serene luxury.',
    featuredImage: '/images/gangtok_city_view_1790684782649.jpg',
    gallery: [
      '/images/gangtok_city_view_1790684782649.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Panoramic valley and city light views from upper floor suites',
      'Relaxing traditional Sikkimese herbal spa sessions',
      'Short 5-minute drive to pedestrian MG Marg',
      'Spacious covered parking area for comfortable cab boarding'
    ],
    amenities: [
      'Full-Service Wellness Spa',
      'Multi-Cuisine Fine Dining',
      'Private Scenic Balconies',
      'Elevator / Lift Access',
      'Central Room Heating',
      'Free Parking',
      'Wi-Fi Throughout'
    ],
    roomTypes: [
      {
        name: 'Deluxe Suite',
        price: 4600,
        description: 'Modern suite featuring premium King bed, living area, and valley view.',
        bedType: '1 King Bed',
        view: 'Valley & City View',
        capacity: '2 Adults'
      },
      {
        name: 'Royal Penthouse Suite',
        price: 8800,
        description: 'Top-floor presidential suite with wrap-around balcony, dining table, and luxury marble bathroom with bathtub.',
        bedType: '1 King Bed',
        view: 'Panoramic Kanchenjunga & Gangtok Valley',
        capacity: '2 Adults + 2 Children'
      }
    ],
    bestSuitedFor: 'Discerning couples, business travelers, and families looking for quiet luxury near town.',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 120 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 116 km · ~4 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-tsomgo-nathula-3n-4d',
      circuitTitle: 'Gangtok & North Sikkim Luxury Tour',
      chauffeurNotes: 'Private pickup right from the hotel entrance for early morning Tsomgo Lake / Nathula excursions.',
      bundleAdvantage: 'Direct hotel pickup with vehicle heated cabin warm-up before early winter starts.'
    }
  },

  {
    id: 'hotel-yashshree-lacewing-lachung',
    slug: 'yashshree-lacewing-resort-lachung',
    name: 'Yashshree Lacewing Resort, Lachung',
    brand: 'Yashshree',
    destination: 'lachung',
    regionLabel: 'Lachung Valley, North Sikkim',
    locationAddress: 'Lachung Village, On Road to Yumthang Valley, North Sikkim 737120',
    starRating: 4,
    startingPrice: 5500,
    maxPrice: 9200,
    tagline: 'Cozy Heated Alpine Haven on the Gateway to Yumthang Valley & Zero Point',
    overview: 'Nestled in the breathtaking alpine valley of Lachung (8,600 ft) in North Sikkim, Yashshree Lacewing Resort is one of the highest-rated luxury properties in the region. Crafted with high-grade pine wood interiors, specialized room heating, heavy down duvets, and 24-hour hot water, it provides a warm haven amidst freezing alpine temperatures. An essential stop for travelers heading to the Valley of Flowers at Yumthang and the snowfields of Zero Point (15,300 ft).',
    featuredImage: '/images/north_sikkim_yumthang_1790679981868.jpg',
    gallery: [
      '/images/north_sikkim_yumthang_1790679981868.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Witnessing towering snow-draped pine mountains and waterfalls directly from your bed',
      'Comfortable heated rooms with electric blankets and specialized mountain geysers',
      'Hearty buffet meals featuring hot soups, Sikkimese curries, and warm desserts',
      'Convenient starting point for the morning excursion to Yumthang Valley & Zero Point'
    ],
    amenities: [
      'Heavy Room Heating & Electric Warmers',
      '24/7 Hot Running Water',
      'Alpine Restaurant & Buffet',
      'Oxygen Cylinder On Standby',
      'Ample 4x4 / SUV Parking',
      'Backup Power Generator'
    ],
    roomTypes: [
      {
        name: 'Alpine Deluxe Wood Room',
        price: 5500,
        description: 'Pinewood insulated walls, electric heated bed, warm timber flooring, and private mountain view window.',
        bedType: '1 Double Bed',
        view: 'Snow Peak & Pine Forest',
        capacity: '2 Adults'
      },
      {
        name: 'Lacewing Premium Suite',
        price: 7800,
        description: 'Spacious chalet-style suite with dedicated sitting area, panoramic glass view of Lachung River gorge, and premium heater.',
        bedType: '1 King Bed',
        view: 'Lachung River & Waterfalls',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Adventurers, couples, and nature photographers exploring North Sikkim’s alpine wonders.',
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    airportTransferInfo: 'Transfers originated from Gangtok: 110 km · ~5.5 hrs scenic mountain drive.',
    railwayTransferInfo: 'From NJP: 230 km · 2-Day itinerary with mandatory Gangtok overnight.',
    spikyCabsCombo: {
      circuitSlug: 'north-sikkim-4n-5d',
      circuitTitle: 'North Sikkim Alpine Expedition (4N/5D)',
      chauffeurNotes: 'Spiky Cabs provides dedicated 4WD / high-clearance mountain vehicles (Innova / Scorpio) with seasoned high-altitude mountain chauffeurs experienced in snow terrain.',
      bundleAdvantage: 'All North Sikkim permits (PAP), police checkpost verifications, and environmental fees pre-cleared by Spiky Cabs.'
    }
  },

  {
    id: 'hotel-yashshree-kanchendzonga-falls-pelling',
    slug: 'yashshree-kanchendzonga-falls-resort-pelling',
    name: 'Yashshree Kanchendzonga Falls Resort, Pelling',
    brand: 'Yashshree',
    destination: 'pelling',
    regionLabel: 'Rimbi Road & Waterfall Valley, Pelling',
    locationAddress: 'Rimbi Waterfall Road, Near Kanchenjunga Falls, Pelling, West Sikkim 737113',
    starRating: 4,
    startingPrice: 3900,
    maxPrice: 6900,
    tagline: 'Riverside Wilderness Retreat Beside Gushing Mountain Streams in Pelling',
    overview: 'Located close to the majestic Kanchenjunga Waterfall in West Sikkim, Yashshree Kanchendzonga Falls Resort immerses guests in pure mountain nature. The resort features rustic stone and wood chalets, landscaped green terraces, an outdoor barbecue lawn, and private balconies listening to the soothing sound of the Rimbi River stream. It offers a cooler, greener escape with easy access to Pelling’s top sights.',
    featuredImage: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
    gallery: [
      '/images/pelling_skywalk_sikkim_1790684762658.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Falling asleep to the gentle melody of the natural Rimbi mountain stream',
      'Short drive to the historic Rabdentse Ruins and Sacred Khecheopalri Lake',
      'Evening bonfires with warm cardamom tea and roasted local snacks'
    ],
    amenities: [
      'River-Facing Balconies',
      'Multi-Cuisine Dining',
      'Bonfire & BBQ Deck',
      'Room Heaters',
      'Free Parking',
      'Wi-Fi in Public Areas'
    ],
    roomTypes: [
      {
        name: 'Deluxe Stream View',
        price: 3900,
        description: 'Charming wood-paneled room with balcony facing the mountain forest and stream.',
        bedType: '1 Double Bed',
        view: 'River Stream & Forest',
        capacity: '2 Adults'
      },
      {
        name: 'Waterfall View Cottage',
        price: 5800,
        description: 'Detached cottage with high ceilings, private veranda, and views toward the cascading valley.',
        bedType: '1 King Bed',
        view: 'Valley & Forest Waterfall',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Nature lovers, peace seekers, and families wanting an authentic secluded mountain lodge.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 138 km · ~4.5 hrs.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 132 km · ~4.5 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'pelling-west-sikkim-3n-4d',
      circuitTitle: 'West Sikkim Nature & Waterfall Tour',
      chauffeurNotes: 'Your Spiky Cabs driver takes you across the Singshore Suspension Bridge (second highest in Asia) and Rimbi Orange Gardens.',
      bundleAdvantage: 'Expert mountain drivers trained on steep West Sikkim winding roads.'
    }
  },

  {
    id: 'hotel-sumi-yashshree-silver-oaks-kalimpong',
    slug: 'sumi-yashshree-silver-oaks-kalimpong',
    name: 'Sumi Yashshree Silver Oaks, Kalimpong',
    brand: 'Yashshree',
    destination: 'kalimpong',
    regionLabel: 'Ringkingpong Road, Kalimpong',
    locationAddress: 'Ringkingpong Road, Upper Kalimpong, West Bengal 734301',
    starRating: 4,
    startingPrice: 3800,
    maxPrice: 6500,
    tagline: 'Colonial Hilltop Ambience with Sprawling Garden Lawns in Kalimpong',
    overview: 'Sitting gracefully on Ringkingpong Road in Kalimpong, Sumi Yashshree Silver Oaks is reminiscent of British country homes. Filled with flowering garden patches, wide sun verandas, oak furniture, and clear views across the Teesta River valley towards Kanchenjunga, it provides a peaceful, dignified mountain holiday with authentic home-cooked flavors.',
    featuredImage: '/images/deolo_hill_kalimpong_1790685166158.jpg',
    gallery: [
      '/images/deolo_hill_kalimpong_1790685166158.jpg',
      '/images/hotel_summit_darjeeling_1791198303099.jpg'
    ],
    experienceHighlights: [
      'Afternoon tea on the sunlit lawn surrounded by silver oak trees',
      'Panoramic viewpoints of the Kanchenjunga range and Teesta valley',
      'Convenient proximity to Kalimpong town center and local craft markets'
    ],
    amenities: [
      'Garden Veranda Restaurant',
      'Bonfire Corner',
      'Room Heaters',
      'Wi-Fi',
      'Free Parking',
      'Doctor on Call'
    ],
    roomTypes: [
      {
        name: 'Deluxe Garden Room',
        price: 3800,
        description: 'Classic colonial style room with oak finishes, warm rugs, and garden vista.',
        bedType: '1 Double Bed',
        view: 'Lawn & Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Silver Oaks Suite',
        price: 5800,
        description: 'Spacious suite with sitting parlor, fireplace decor, and sweeping views of Mount Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga Vista',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples, writers, and senior travelers who appreciate quiet colonial relaxation.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 76 km · ~2 hrs 40 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 70 km · ~2 hrs 30 min.',
    spikyCabsCombo: {
      circuitSlug: 'kalimpong-darjeeling-combo',
      circuitTitle: 'Kalimpong Orchid & Heritage Tour',
      chauffeurNotes: 'Direct chauffeur transfers between Kalimpong, Darjeeling, and Bagdogra Airport.',
      bundleAdvantage: 'Fixed-price cab guarantee with no surprise hill surcharges.'
    }
  },

  {
    id: 'hotel-sumi-yashshree-suites-darjeeling',
    slug: 'sumi-yashshree-suites-darjeeling',
    name: 'Sumi Yashshree Suites & Spa, Darjeeling',
    brand: 'Yashshree',
    destination: 'darjeeling',
    regionLabel: 'Gandhi Road & Clock Tower, Darjeeling',
    locationAddress: 'Gandhi Road, Near Darjeeling Clock Tower, Darjeeling, West Bengal 734101',
    starRating: 4,
    startingPrice: 3800,
    maxPrice: 6800,
    tagline: 'Contemporary Hill Suite Comfort with Rejuvenating Spa and Panoramic Dining',
    overview: 'Located along the gentler slope of Gandhi Road near the iconic Clock Tower, Sumi Yashshree Suites & Spa offers contemporary mountain living in the heart of Darjeeling. Featuring plush suite-style rooms with wooden paneling, a dedicated Ayurvedic spa, and an all-day multi-cuisine restaurant serving piping hot thukpa, momos, and Continental delicacies, this hotel provides a relaxing retreat with quick walking access to Chowrasta.',
    featuredImage: '/images/hotel_yashshree_resort_1791198764618.jpg',
    gallery: [
      '/images/hotel_yashshree_resort_1791198764618.jpg',
      '/images/darjeeling_tea_mirik_1790680004464.jpg'
    ],
    experienceHighlights: [
      'Prime location on Gandhi Road with easy vehicle drop-off at the hotel lobby',
      'In-house Ayurvedic wellness spa offering warm oil therapies after chilly hill walks',
      'Panoramic glass dining hall serving regional North-Eastern and Indian specialties',
      'Heated rooms with electric blankets and hot running water 24/7'
    ],
    amenities: [
      'Ayurvedic Wellness Spa',
      'Multi-Cuisine Restaurant',
      'Room Heaters & Heated Mattress',
      'Elevator / Lift Access',
      'High-Speed Wi-Fi',
      'Dedicated Chauffeur Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Suite Room',
        price: 3800,
        description: 'Cozy suite with timber wall panelling, comfortable king bed, and modern bathroom with hot rain shower.',
        bedType: '1 King Bed',
        view: 'Darjeeling Valley View',
        capacity: '2 Adults'
      },
      {
        name: 'Executive Kanchenjunga Balcony Suite',
        price: 5800,
        description: 'Upper floor suite with private sit-out balcony offering views of the mountain slopes and snow peaks.',
        bedType: '1 King Bed',
        view: 'Mountain & Valley Vista',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples, corporate retreats, and families who prioritize elevator access and easy road approach in Darjeeling.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 70 km · ~2 hrs 40 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 74 km · ~2 hrs 45 min.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-mirik-3n-4d',
      circuitTitle: 'Darjeeling 7-Point Sightseeing Chauffeur Link',
      chauffeurNotes: 'Your Spiky Cabs driver coordinates convenient doorstep pickups on Gandhi Road for Tiger Hill 4:00 AM sunrise and Ghoom Monastery tours.',
      bundleAdvantage: 'Direct hotel gate pick and drop without hauling heavy luggage up steep Darjeeling hill pathways.'
    }
  },

  {
    id: 'hotel-yashshree-eco-heritage-darjeeling',
    slug: 'yashshree-eco-heritage-darjeeling',
    name: 'Yashshree Eco Heritage Resort, Darjeeling',
    brand: 'Yashshree',
    destination: 'darjeeling',
    regionLabel: 'Birch Hill & Zoo Road, Darjeeling',
    locationAddress: 'Near Birch Hill Road & Himalayan Mountaineering Institute, Darjeeling, West Bengal 734104',
    starRating: 4,
    startingPrice: 3500,
    maxPrice: 6200,
    tagline: 'Eco-Friendly Heritage Haven Surrounded by Rhododendrons & Mountain Air',
    overview: 'Perched in the lush green canopy near Birch Hill and the Himalayan Mountaineering Institute (HMI), Yashshree Eco Heritage Resort combines eco-friendly hospitality with colonial hill station architecture. Wooden verandas, manicured terrace gardens, and crisp high-altitude air provide a serene sanctuary away from the hustle of urban traffic.',
    featuredImage: '/images/hotel_yashshree_resort_1791198764618.jpg',
    gallery: [
      '/images/hotel_yashshree_resort_1791198764618.jpg',
      '/images/darjeeling_toy_train_1790684713643.jpg'
    ],
    experienceHighlights: [
      'Walking distance to the Himalayan Zoo, HMI, and Darjeeling Ropeway',
      'Eco-conscious solar water heating and locally sourced organic farm ingredients',
      'Lush green botanical gardens filled with seasonal Himalayan orchids and lilies',
      'Cozy wooden fireplace lounge for evening reading and tea conversations'
    ],
    amenities: [
      'Terrace Garden Sit-out',
      'In-House Multi-Cuisine Dining',
      'Fireplace Lounge',
      'Room Heaters',
      'Free Parking',
      'High-Speed Wi-Fi'
    ],
    roomTypes: [
      {
        name: 'Deluxe Heritage Room',
        price: 3500,
        description: 'Wooden parquet flooring, double bed with warm duvets, and window overlooking lush pine canopy.',
        bedType: '1 Double Bed',
        view: 'Forest Canopy View',
        capacity: '2 Adults'
      },
      {
        name: 'Eco Heritage Family Room',
        price: 5200,
        description: 'Spacious family room with two double beds and open private balcony facing the tea garden valley.',
        bedType: '2 Queen Beds',
        view: 'Valley & Tea Garden',
        capacity: '4 Adults'
      }
    ],
    bestSuitedFor: 'Nature lovers, eco-conscious travelers, birdwatchers, and families visiting with children.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 73 km · ~2 hrs 45 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 76 km · ~2 hrs 50 min.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-mirik-3n-4d',
      circuitTitle: 'Darjeeling Tea Garden & Ropeway Excursion',
      chauffeurNotes: 'Private Spiky Cabs chauffeur takes you smoothly to Lebong Race Course, Happy Valley Tea Estate, and Japanese Peace Pagoda.',
      bundleAdvantage: 'Hassle-free parking at all top attractions handled entirely by your dedicated driver.'
    }
  },

  {
    id: 'hotel-yashshree-apple-tree-gangtok',
    slug: 'yashshree-de-apple-tree-gangtok',
    name: 'Yashshree De Apple Tree, Gangtok',
    brand: 'Yashshree',
    destination: 'gangtok',
    regionLabel: 'Enchey Compound & Tibet Road, Gangtok',
    locationAddress: 'Enchey Compound, Near Historic Enchey Monastery, Gangtok, Sikkim 737103',
    starRating: 4,
    startingPrice: 3300,
    maxPrice: 5600,
    tagline: 'Peaceful Hillside Retreat Overlooking Gangtok Ridge with Warm Hospitality',
    overview: 'Located on the quiet slopes near the historic 200-year-old Enchey Monastery, Yashshree De Apple Tree offers a calm and soothing mountain stay overlooking the Gangtok cityscape and the rolling hills of East Sikkim. It features comfortable timber-accented rooms, attentive personalized service, and easy cab access to MG Marg and Ganesh Tok.',
    featuredImage: '/images/gangtok_city_view_1790684782649.jpg',
    gallery: [
      '/images/gangtok_city_view_1790684782649.jpg',
      '/images/hotel_yashshree_resort_1791198764618.jpg'
    ],
    experienceHighlights: [
      'Tranquil location near Enchey Monastery and the fluttering prayer flags of Gangtok hills',
      'Breathtaking night views of Gangtok city lights illuminating the mountain ridge',
      'Fresh Sikkimese delicacies and customized vegetarian / Jain meal preparations',
      'Quick 10-minute drive to Ganesh Tok, Hanuman Tok, and Tashi View Point'
    ],
    amenities: [
      'Multi-Cuisine Restaurant',
      'Room Heaters & Geysers',
      'Free Vehicle Parking',
      'Wi-Fi Connectivity',
      '24/7 Front Desk',
      'Travel Desk Support'
    ],
    roomTypes: [
      {
        name: 'Deluxe Pine Room',
        price: 3300,
        description: 'Warm pine wood finishes, double bed with clean duvets, and window framing the green valley.',
        bedType: '1 Double Bed',
        view: 'Valley & Hillside View',
        capacity: '2 Adults'
      },
      {
        name: 'Apple Tree Luxury Suite',
        price: 5100,
        description: 'Upper floor suite with seating parlor, large panoramic window, and complimentary tea bar.',
        bedType: '1 King Bed',
        view: 'Gangtok Valley & Mountain Ridge',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Couples, pilgrims, and families looking for peace and quiet with close proximity to Gangtok’s viewpoints.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 125 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 120 km · ~4 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-darjeeling-4n-5d',
      circuitTitle: 'East Sikkim Monastery & Viewpoint Tour',
      chauffeurNotes: 'Your Spiky Cabs chauffeur whisks you to Rumtek Monastery, Tashi Viewpoint for Kanchenjunga sunrise, and Ban Jhakri Falls.',
      bundleAdvantage: 'Dedicated chauffeur stays with your group throughout the day with zero waiting charges.'
    }
  },

  // -------------------------------------------------------------
  // RARE HIMALAYAS (HERITAGE & BOUTIQUE RETREATS)
  // -------------------------------------------------------------
  {
    id: 'hotel-the-elgin-darjeeling',
    slug: 'the-elgin-heritage-hotel-darjeeling',
    name: 'The Elgin, Darjeeling (Heritage 1887)',
    brand: 'Rare Himalayas',
    destination: 'darjeeling',
    regionLabel: 'Near Mall Road & Raj Bhavan, Darjeeling',
    locationAddress: '18 H.D. Lama Road, Near Chowrasta Mall, Darjeeling, West Bengal 734101',
    starRating: 5,
    startingPrice: 12500,
    maxPrice: 22000,
    tagline: '1887 Royal Summer Residence of the Maharaja of Cooch Behar',
    overview: 'Once the opulent summer residence of the Maharaja of Cooch Behar, The Elgin Darjeeling is a legendary heritage landmark standing in the heart of Darjeeling for over 135 years. Adorned with original Burma teak flooring, glowing brass fireplaces, antique lithographs by Daniell, and crystal chandeliers, this Rare Himalayas property celebrates the romance of a bygone era. Guests enjoy formal afternoon high teas, evening piano performances in the gazebo lounge, and warm candle-lit dining surrounded by antique silver service.',
    featuredImage: '/images/hotel_hero_luxury_resort_1791198161227.jpg',
    gallery: [
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/hotel_summit_darjeeling_1791198303099.jpg',
      '/images/darjeeling_toy_train_1790684713643.jpg'
    ],
    experienceHighlights: [
      'Afternoon silver service high tea with fresh Darjeeling First Flush tea and scones',
      'Evening log fireplace gatherings with vintage piano music and fine malts',
      'Private library filled with rare Himalayan travel memoirs and mountaineering chronicles',
      'Walking 5-minute access to the Viceroy’s Walk and Chowrasta Mall'
    ],
    amenities: [
      'The Elgin Spa & Wellness',
      'Working Fireplaces in Suites',
      'Silver Service Dining Room',
      'The Gazebo Garden Lounge',
      'Complimentary Afternoon High Tea',
      '24/7 Butler & Room Service',
      'Valet Parking & Wi-Fi'
    ],
    roomTypes: [
      {
        name: 'Deluxe Heritage Room',
        price: 12500,
        description: 'Original Burma teak furnishings, antique colonial portraits, heated brass hot water bottles, and pine valley views.',
        bedType: '1 King Bed',
        view: 'Garden & Mountain Valley',
        capacity: '2 Adults'
      },
      {
        name: 'Maharaja Heritage Suite',
        price: 18500,
        description: 'Aristocratic suite once frequented by royal dignitaries, featuring a working wood fireplace, clawfoot tub, and dressing parlor.',
        bedType: '1 Royal Four-Poster Bed',
        view: 'Mount Kanchenjunga & Estate Lawn',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Discerning heritage travelers, honeymooners, history buffs, and luxury lovers.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 68 km · ~2 hrs 45 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 70 km · ~2 hrs 40 min.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-classic-2n-3d',
      circuitTitle: 'Darjeeling Royal Heritage Tour',
      chauffeurNotes: 'Your Spiky Cabs chauffeur welcomes you in a premium Innova Crysta with luggage escort right into The Elgin grand reception hall.',
      bundleAdvantage: 'Complimentary early check-in coordination and private chauffeur on-call during your entire stay.'
    }
  },

  {
    id: 'hotel-the-elgin-nor-khill-gangtok',
    slug: 'the-elgin-nor-khill-gangtok',
    name: 'The Elgin Nor-Khill, Gangtok',
    brand: 'Rare Himalayas',
    destination: 'gangtok',
    regionLabel: 'Paljor Stadium Road, Gangtok',
    locationAddress: 'Paljor Stadium Road, Gangtok, Sikkim 737101',
    starRating: 5,
    startingPrice: 11000,
    maxPrice: 20000,
    tagline: 'Historic Royal Guesthouse with Tibetan Frescoes and Dragon Bar',
    overview: 'Built in 1932 by the King of Sikkim (Chogyal) to host visiting royalty, heads of state, and international dignitaries, The Elgin Nor-Khill translates poetically as the "House of Jewels". Every corner of this Rare Himalayas property is bathed in Sikkimese heritage, from hand-painted dragon frescoes and flame-carved wooden pillars to authentic Tibetan thangkas. The legendary Dragon Bar and the Shangri-La dining hall serve refined traditional Himalayan delicacies amidst royal grace.',
    featuredImage: '/images/hotel_hero_luxury_resort_1791198161227.jpg',
    gallery: [
      '/images/hotel_hero_luxury_resort_1791198161227.jpg',
      '/images/gangtok_city_view_1790684782649.jpg'
    ],
    experienceHighlights: [
      'Sipping vintage cocktails at the legendary Dragon Bar under hand-painted ceilings',
      'Authentic Sikkimese royal banquet with Gya-thuk, Momos, and Ningro churpi',
      'Manicured lawn overlooking the Kanchenjunga crest and the Royal Palace',
      'Walkable 5-minute stroll to the central MG Marg promenade'
    ],
    amenities: [
      'The Elgin Spa',
      'The Dragon Bar',
      'Shangri-La Royal Restaurant',
      'Lawn Gardens & Mountain Deck',
      'Centrally Heated Rooms',
      'High-Speed Wi-Fi',
      'Valet Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Royal Heritage Room',
        price: 11000,
        description: 'Traditional Sikkimese woodwork, richly patterned Tibetan rugs, modern bathroom with heating, and mountain vistas.',
        bedType: '1 King Bed',
        view: 'Garden & Mountain View',
        capacity: '2 Adults'
      },
      {
        name: 'Chogyal Royal Suite',
        price: 17500,
        description: 'Magnificent royal suite featuring antique carved furniture, separate parlor salon, and clear view of Mount Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Panoramic Mount Kanchenjunga',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Luxury travelers, cultural connoisseurs, and couples seeking authentic royal Sikkimese charm.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 120 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 116 km · ~4 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'gangtok-tsomgo-nathula-3n-4d',
      circuitTitle: 'Sikkim Royal Heritage & Pass Circuit',
      chauffeurNotes: 'Your Spiky Cabs chauffeur coordinates high-altitude permit clearance so your trip to Tsomgo Lake is completely effortless.',
      bundleAdvantage: 'Luxury Innova Crysta vehicle guarantee with seasoned royal circuit drivers.'
    }
  },

  {
    id: 'hotel-glenburn-tea-estate',
    slug: 'glenburn-tea-estate-boutique-darjeeling',
    name: 'Glenburn Tea Estate & Boutique Hotel, Darjeeling',
    brand: 'Rare Himalayas',
    destination: 'darjeeling',
    regionLabel: 'Rangli Rangliot & River Rungeet, Darjeeling',
    locationAddress: 'Glenburn Tea Estate, Near Rangli Rangliot, Darjeeling, West Bengal 734123',
    starRating: 5,
    startingPrice: 35000,
    maxPrice: 52000,
    tagline: 'World-Renowned Private Tea Plantation Lodge Overlooking River Rungeet',
    overview: 'Established by Scottish tea planters in 1859, Glenburn Tea Estate is consistently rated among the world’s most enchanting boutique hotel retreats. Situated on a 1,600-acre private working tea estate sprawling from mountain ridges down to the River Rungeet, Glenburn offers just a handful of bespoke luxury suites across The Water Lily Bungalow and The Burra Bungalow. All-inclusive luxury hospitality includes private tea tastings, riverbank picnics, candle-lit four-course dinners, and birdwatching treks.',
    featuredImage: '/images/darjeeling_tea_mirik_1790680004464.jpg',
    gallery: [
      '/images/darjeeling_tea_mirik_1790680004464.jpg',
      '/images/hotel_taj_chia_kutir_1791198283277.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Gourmet riverbank barbecue lunch by the banks of the emerald River Rungeet',
      'Private factory tour and interactive tea plucking alongside generational tea masters',
      'Evening high teas on the flower-decked veranda with Mount Kanchenjunga as backdrop',
      'Fully personalized menus prepared with organic produce from the estate farm'
    ],
    amenities: [
      'All-Inclusive Gourmet Dining & High Teas',
      'Private Veranda with Kanchenjunga View',
      'Fireplaces & Antique Clawfoot Tubs',
      'Dedicated Estate Guide & Butler',
      'River Campsite & Hiking Trails',
      'High-Speed Wi-Fi in Bungalows'
    ],
    roomTypes: [
      {
        name: 'The Planter’s Suite',
        price: 35000,
        description: 'Colonial luxury suite with four-poster bed, wood-burning fireplace, hand-embroidered linens, and private veranda overlooking tea valleys.',
        bedType: '1 King Four-Poster Bed',
        view: 'Tea Terraces & River Gorge',
        capacity: '2 Adults'
      },
      {
        name: 'The Kanchenjunga Suite',
        price: 48000,
        description: 'The estate’s crown jewel suite featuring floor-to-ceiling French windows framing Mount Kanchenjunga, freestanding roll-top bath, and private sun terrace.',
        bedType: '1 Royal King Bed',
        view: 'Direct Mount Kanchenjunga Panorama',
        capacity: '2 Adults'
      }
    ],
    bestSuitedFor: 'Ultra-luxury travelers, romantic getaways, international visitors, and connoisseurs of tea culture.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 85 km · ~3 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 82 km · ~3 hrs.',
    spikyCabsCombo: {
      circuitSlug: 'darjeeling-mirik-3n-4d',
      circuitTitle: 'Glenburn Private Estate Chauffeur Transfer',
      chauffeurNotes: 'Estate access requires skilled mountain drivers familiar with private plantation roads. Spiky Cabs drivers are specially certified for Glenburn estate routing.',
      bundleAdvantage: 'Dedicated 4WD Innova Crysta for effortless navigation of scenic unpaved tea trails.'
    }
  },

  {
    id: 'hotel-yangsum-farm-rinchenpong',
    slug: 'yangsum-farm-heritage-rinchenpong',
    name: 'Yangsum Farm, Rinchenpong (West Sikkim)',
    brand: 'Rare Himalayas',
    destination: 'rinchenpong',
    regionLabel: 'Rinchenpong, West Sikkim',
    locationAddress: 'Yangsum Village, Near Rinchenpong, West Sikkim 737111',
    starRating: 4.5,
    startingPrice: 7500,
    maxPrice: 11000,
    tagline: '44-Acre Organic Working Heritage Farm Retreat Facing Kanchenjunga',
    overview: 'A celebrated jewel in the Rare Himalayas collection, Yangsum Farm is a 44-acre organic working farm retreat dating back to 1833. Surrounded by cardamom, avocado, and orange orchards, the heritage lodge is run by a warm Sikkimese host family. Guests reside in traditionally crafted pine cottages, savor home-grown organic Sikkimese meals cooked on earthen hearths, and wake up to 180-degree unobstructed panoramas of the snow-clad Kanchenjunga range.',
    featuredImage: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
    gallery: [
      '/images/pelling_skywalk_sikkim_1790684762658.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Authentic farm-to-table culinary experiences using heirloom vegetables and native herbs',
      'Guided farm walks through cardamom groves, orange orchards, and bamboo forests',
      'Unbroken views of Mount Kanchenjunga, Pandim, and Narsing peaks from the farm veranda',
      'Visits to the ancient 1730 AD Rinchenpong and Reesum Monasteries'
    ],
    amenities: [
      'Organic Farm-to-Table Dining',
      'Traditional Heritage Wooden Cottages',
      'Cozy Wood Heating',
      'Orchard Walks & Birdwatching',
      'Free Parking',
      'Personalized Family Hospitality'
    ],
    roomTypes: [
      {
        name: 'Heritage Farm Cottage',
        price: 7500,
        description: 'Handcrafted local wood architecture, handwoven woolen rugs, modern western en-suite bathroom, and balcony overlooking Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Organic Orchards & Kanchenjunga',
        capacity: '2 Adults'
      }
    ],
    bestSuitedFor: 'Slow travelers, organic food lovers, peace seekers, and birdwatchers wanting deep immersion in authentic Sikkim culture.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 125 km · ~4 hrs 15 min.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 120 km · ~4 hrs via Jorethang.',
    spikyCabsCombo: {
      circuitSlug: 'pelling-west-sikkim-3n-4d',
      circuitTitle: 'Offbeat West Sikkim & Organic Farm Route',
      chauffeurNotes: 'Your Spiky Cabs chauffeur connects Yangsum Farm with Pelling, Ravangla Buddha Park, and Bagdogra Airport seamlessly.',
      bundleAdvantage: 'Hassle-free transfers through rural West Sikkim scenic back-roads.'
    }
  },

  {
    id: 'hotel-yarlam-resort-lachung',
    slug: 'yarlam-resort-lachung',
    name: 'Yarlam Resort, Lachung (North Sikkim)',
    brand: 'Rare Himalayas',
    destination: 'lachung',
    regionLabel: 'Lachung Valley, North Sikkim',
    locationAddress: 'Lachung, Near Apple Orchards, North Sikkim 737120',
    starRating: 4.5,
    startingPrice: 8500,
    maxPrice: 14500,
    tagline: 'High-Altitude Luxury Boutique Resort in the Alpine Paradise of Lachung',
    overview: 'Perched in the majestic alpine amphitheater of Lachung at 8,850 feet, Yarlam Resort is the pioneer of luxury mountain hospitality in North Sikkim. Member of the prestigious Rare Himalayas portfolio, Yarlam features centrally heated wooden suites, an intimate fire lounge, multi-cuisine dining serving steaming delicacies, and floor-to-ceiling glass windows framing towering granite spires and pine forests.',
    featuredImage: '/images/north_sikkim_yumthang_1790679981868.jpg',
    gallery: [
      '/images/north_sikkim_yumthang_1790679981868.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Premier luxury hospitality in the remote wilderness of North Sikkim',
      'Centralized heating and heated mattress warmers ensuring supreme warmth',
      'Curated dining menu featuring fresh hot Himalayan meals, soups, and desserts',
      'Early access to Yumthang Valley (Valley of Flowers) and Zero Point'
    ],
    amenities: [
      'Centralized Radiant Heating',
      'Fireplace Lounge Bar',
      'Multi-Cuisine Gourmet Dining',
      'Medical Oxygen Backup',
      'Hot Running Water 24/7',
      'Ample High-Clearance Vehicle Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Alpine Room',
        price: 8500,
        description: 'Pinewood paneling, radiant heating, down feather duvets, hot shower, and views of Lachung snowy crags.',
        bedType: '1 King Bed',
        view: 'Snow Peaks & Pine Forests',
        capacity: '2 Adults'
      },
      {
        name: 'Yarlam Luxury Suite',
        price: 13500,
        description: 'Spacious alpine suite with living sitting room, panoramic floor-to-ceiling glass walls, and complimentary high-altitude warm beverage service.',
        bedType: '1 King Bed',
        view: '360° Alpine Valley & Glaciers',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Discerning couples, luxury families, and travelers wanting maximum comfort in remote North Sikkim.',
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    airportTransferInfo: 'Transfers originated from Gangtok: 110 km · ~5.5 hrs scenic drive.',
    railwayTransferInfo: 'From NJP: 230 km · 2-Day itinerary with Gangtok stopover.',
    spikyCabsCombo: {
      circuitSlug: 'north-sikkim-4n-5d',
      circuitTitle: 'North Sikkim Luxury Expedition (Yumthang & Zero Point)',
      chauffeurNotes: 'Includes dedicated Innova Crysta / 4WD SUV with Spiky Cabs experienced mountain driver, all North Sikkim permit handling, and snow chain support.',
      bundleAdvantage: 'High-altitude emergency oxygen kit in the vehicle and pre-arranged checkpost clearances.'
    }
  },

  {
    id: 'hotel-elgin-silver-oaks-kalimpong',
    slug: 'the-elgin-silver-oaks-kalimpong',
    name: 'The Elgin Silver Oaks, Kalimpong',
    brand: 'Rare Himalayas',
    destination: 'kalimpong',
    regionLabel: 'Rinkingpong Road & Deolo Ridge, Kalimpong',
    locationAddress: 'Rinkingpong Road, Kalimpong, West Bengal 734301',
    starRating: 5,
    startingPrice: 9500,
    maxPrice: 16500,
    tagline: '1930 British Jute Magnate Manor Overlooking Teesta Valley & Kanchenjunga',
    overview: 'Set amidst lush terraced gardens with weeping willows, silver oak trees, and vibrant orchids in Kalimpong, The Elgin Silver Oaks was originally built in 1930 as the private hill residence of a British architect. Now preserved by the Elgin collection of Rare Himalayas, the manor features glowing teak furniture, classical lithographs, period brass fittings, and a glass-enclosed gazebo lounge looking out across the deep Teesta River valley and snow-clad Himalayan ridges.',
    featuredImage: '/images/hotel_rare_heritage_1791198781910.jpg',
    gallery: [
      '/images/hotel_rare_heritage_1791198781910.jpg',
      '/images/deolo_hill_kalimpong_1790685166158.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Afternoon tea on manicured lawns with views of weeping willows and orchids',
      'The Oak Room dining hall serving traditional British roasts, Himalayan trout, and pies',
      'Intimate library bar with vintage single malts and roaring fireplace',
      'Guided walks to Pine View Cactus Nursery and Deolo Hill viewpoint'
    ],
    amenities: [
      'Heritage Gazebo Lounge',
      'Oak Room Fine Dining',
      'Log Fireplaces',
      'Manicured Tea Gardens',
      'High-Speed Wi-Fi',
      'Dedicated Chauffeur Parking'
    ],
    roomTypes: [
      {
        name: 'Deluxe Heritage Room',
        price: 9500,
        description: 'Teakwood flooring, queen-size bed, period writing desk, and window framing the garden and Teesta valley.',
        bedType: '1 Queen Bed',
        view: 'Garden & Mountain Valley',
        capacity: '2 Adults'
      },
      {
        name: 'Silver Oaks Luxury Suite',
        price: 15500,
        description: 'Gracious manor suite with separate drawing room, working stone fireplace, and panoramic views of Kanchenjunga.',
        bedType: '1 King Bed',
        view: 'Mount Kanchenjunga Range',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Discerning heritage enthusiasts, romantic couples, and travelers wanting serene colonial charm.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 75 km · ~2 hrs 35 min via Coronation Bridge.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 70 km · ~2 hrs 30 min.',
    spikyCabsCombo: {
      circuitSlug: 'kalimpong-darjeeling-combo',
      circuitTitle: 'Kalimpong Heritage & Teesta Chauffeur Drive',
      chauffeurNotes: 'Your Spiky Cabs chauffeur connects Kalimpong with Darjeeling and Gangtok along the picturesque Teesta scenic river highway.',
      bundleAdvantage: 'Round-trip flat-rate mountain chauffeur guarantee with zero hidden taxes.'
    }
  },

  {
    id: 'hotel-elgin-mount-pandim-pelling',
    slug: 'the-elgin-mount-pandim-pelling',
    name: 'The Elgin Mount Pandim, Pelling (West Sikkim)',
    brand: 'Rare Himalayas',
    destination: 'pelling',
    regionLabel: 'Pemayangtse Monastery Ridge, Pelling, West Sikkim',
    locationAddress: 'Monastery Road, Adjacent to Pemayangtse Monastery, Pelling, West Sikkim 737113',
    starRating: 5,
    startingPrice: 11500,
    maxPrice: 19500,
    tagline: '8-Acre Virgin Oak Forest Estate with Sacred Kanchenjunga Views & Monastic Bells',
    overview: 'Spread over 8 acres of virgin pine and oak forest adjacent to the sacred 300-year-old Pemayangtse Monastery, The Elgin Mount Pandim is the crown jewel of luxury heritage in West Sikkim. Facing the magnificent Mount Pandim and Kanchenjunga summits, each room features royal Sikkimese woodwork, antique carpets, crackling log fireplaces, and tranquil walking trails where monk chants echo softly through the morning mountain mist.',
    featuredImage: '/images/hotel_rare_heritage_1791198781910.jpg',
    gallery: [
      '/images/hotel_rare_heritage_1791198781910.jpg',
      '/images/pelling_skywalk_sikkim_1790684762658.jpg',
      '/images/hotel_hero_luxury_resort_1791198161227.jpg'
    ],
    experienceHighlights: [
      'Unbroken views of Mount Pandim and Kanchenjunga peaks from bedroom windows and gazebos',
      'Private forest trail leading directly to the 1705 AD Pemayangtse Monastery',
      'Evening gatherings around the glowing log fireplace with traditional tea and warm conversation',
      'Walking access to the historic royal Rabdentse Ruins palace complex'
    ],
    amenities: [
      'Gazebo Tea Garden',
      'Log Fireplaces in Suites',
      'Gourmet Multi-Cuisine Dining',
      'Private Forest Nature Trails',
      'Free Vehicle Parking',
      'High-Speed Wi-Fi'
    ],
    roomTypes: [
      {
        name: 'Deluxe Heritage Room',
        price: 11500,
        description: 'Authentic Sikkimese timber finishes, royal dragon hand-carvings, en-suite modern bath, and mountain view window.',
        bedType: '1 King Bed',
        view: 'Oak Forest & Valley',
        capacity: '2 Adults'
      },
      {
        name: 'Pandim Royal Suite',
        price: 18500,
        description: 'Palatial suite featuring a working log fireplace, sitting parlor with antique upholstery, and direct panorama of Mount Pandim and Kanchenjunga.',
        bedType: '1 Royal King Bed',
        view: 'Direct Mount Pandim & Kanchenjunga',
        capacity: '2 Adults + 1 Child'
      }
    ],
    bestSuitedFor: 'Luxury seekers, cultural travelers, spiritual retreats, and high-end honeymooners in West Sikkim.',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    airportTransferInfo: 'Bagdogra Airport (IXB): 136 km · ~4.5 hrs via Jorethang.',
    railwayTransferInfo: 'New Jalpaiguri (NJP): 132 km · ~4 hrs 30 min.',
    spikyCabsCombo: {
      circuitSlug: 'pelling-west-sikkim-3n-4d',
      circuitTitle: 'West Sikkim Royal & Heritage Expedition',
      chauffeurNotes: 'Your Spiky Cabs chauffeur remains exclusively assigned for day trips to Khecheopalri Lake, Singshore Bridge, and Ravangla Buddha Park.',
      bundleAdvantage: 'High-clearance premium SUV vehicles (Innova Crysta) ensuring absolute mountain comfort.'
    }
  }
];

export function getHotelBySlug(slug: string): RecommendedHotel | undefined {
  return HOTELS_DATA.find(h => h.slug === slug || h.id === slug);
}

export function getHotelsByDestination(dest: string): RecommendedHotel[] {
  if (dest === 'all') return HOTELS_DATA;
  return HOTELS_DATA.filter(h => h.destination === dest);
}

export function getHotelsByBrand(brand: string): RecommendedHotel[] {
  if (brand === 'all') return HOTELS_DATA;
  return HOTELS_DATA.filter(h => h.brand.toLowerCase() === brand.toLowerCase());
}

export interface HotelGalleryPhoto {
  url: string;
  title: string;
  category: 'exterior' | 'bedroom' | 'toilet' | 'dining' | 'view';
  badge: string;
  description: string;
}

export function getHotelGalleryPhotos(hotel: RecommendedHotel): HotelGalleryPhoto[] {
  const isLuxury = hotel.brand === 'Taj' || hotel.starRating === 5;
  const toiletImg = isLuxury 
    ? '/images/hotel_luxury_bathroom_1791218139919.jpg' 
    : '/images/hotel_heritage_bathroom_1791218162434.jpg';
  
  const exteriorImg = hotel.featuredImage || '/images/hotel_hero_luxury_resort_1791198161227.jpg';
  const bedroomImg = (hotel.gallery && hotel.gallery[1]) || (
    hotel.brand === 'Summit' ? '/images/hotel_summit_darjeeling_1791198303099.jpg' :
    hotel.brand === 'Yashshree' ? '/images/hotel_yashshree_resort_1791198764618.jpg' :
    hotel.brand === 'Rare Himalayas' ? '/images/hotel_rare_heritage_1791198781910.jpg' :
    '/images/hotel_hero_luxury_resort_1791198161227.jpg'
  );

  const diningImg = hotel.brand === 'Rare Himalayas' 
    ? '/images/hotel_rare_heritage_1791198781910.jpg' 
    : '/images/hotel_hero_luxury_resort_1791198161227.jpg';

  const viewImg = 
    hotel.destination === 'darjeeling' ? '/images/darjeeling_tea_mirik_1790680004464.jpg' :
    hotel.destination === 'gangtok' ? '/images/gangtok_city_view_1790684782649.jpg' :
    hotel.destination === 'pelling' ? '/images/pelling_skywalk_sikkim_1790684762658.jpg' :
    hotel.destination === 'lachung' ? '/images/north_sikkim_yumthang_1790679981868.jpg' :
    '/images/deolo_hill_kalimpong_1790685166158.jpg';

  return [
    {
      url: exteriorImg,
      title: 'Resort Architecture & Grounds',
      category: 'exterior',
      badge: 'Photo 1 of 5: Facade & Grounds',
      description: 'Scenic mountain architecture, manicured grounds, and main guest entrance.'
    },
    {
      url: bedroomImg,
      title: 'Deluxe Suite & Bedroom',
      category: 'bedroom',
      badge: 'Photo 2 of 5: Deluxe Bedroom',
      description: 'Plush bedding, wood-paneled walls, radiant heating / electric blankets, and mountain decor.'
    },
    {
      url: toiletImg,
      title: 'Ensuite Modern Toilet & Bathroom',
      category: 'toilet',
      badge: 'Photo 3 of 5: Ensuite Restroom & Toilet',
      description: 'Hygienic modern ceramic toilet (EWC), glass shower enclosure with hot rain shower, marble vanity, and fresh sanitized towels.'
    },
    {
      url: diningImg,
      title: 'Signature Dining & Tea Lounge',
      category: 'dining',
      badge: 'Photo 4 of 5: Dining Pavilion',
      description: 'Multi-cuisine dining hall, tea sommelier lounge, and warm fireplace sitting area.'
    },
    {
      url: viewImg,
      title: 'Balcony & Panoramic Mountain Vista',
      category: 'view',
      badge: 'Photo 5 of 5: Balcony Mountain View',
      description: 'Unobstructed scenic panorama overlooking Himalayan pine forests and snow-capped peaks.'
    }
  ];
}

