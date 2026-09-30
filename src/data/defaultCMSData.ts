import { 
  PACKAGES_DATA, 
  FLEET_DATA, 
  GALLERY_DATA, 
  TESTIMONIALS_DATA, 
  INCLUSIONS_LIST, 
  EXCLUSIONS_LIST, 
  ROUTE_CHANGE_POLICY, 
  COMPANY_INFO 
} from './packagesData';

export interface CMSData {
  version: number;
  lastUpdated: string;
  _revisionSummary?: string;
  settings: {
    siteName: string;
    tagline: string;
    phone: string;
    rawPhone: string;
    email: string;
    altEmail: string;
    address: string;
    offerValidity: string;
    logoUrl: string;
    faviconUrl: string;
    ribbonText: string;
    ribbonLinkText: string;
    ribbonLinkUrl: string;
    defaultSeoTitle: string;
    defaultSeoDescription: string;
    ogImage: string;
    analyticsId: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
    };
  };
  navigation: Array<{
    id: string;
    label: string;
    path: string;
    isPublished: boolean;
    order: number;
    openInNewTab: boolean;
    isSystem: boolean;
  }>;
  pages: Array<{
    id: string;
    slug: string;
    title: string;
    seoTitle: string;
    metaDescription: string;
    status: 'published' | 'draft';
    updatedAt: string;
    isSystem: boolean;
    sections: Array<{
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      content?: string;
      image?: string;
      buttonText?: string;
      buttonLink?: string;
      order: number;
      isVisible: boolean;
    }>;
  }>;
  packages: typeof PACKAGES_DATA;
  fleet: typeof FLEET_DATA;
  gallery: typeof GALLERY_DATA;
  testimonials: typeof TESTIMONIALS_DATA;
  inclusions: string[];
  exclusions: string[];
  routeChangePolicy: string;
  footer: {
    footnotes: string[];
    columns: Array<{
      title: string;
      links: Array<{ label: string; url: string }>;
    }>;
    copyright: string;
  };
  media: Array<{
    id: string;
    filename: string;
    originalName: string;
    url: string;
    altText: string;
    caption: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
  }>;
  auditLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    details: string;
    user: string;
  }>;
  revisions: Array<{
    id: string;
    timestamp: string;
    summary: string;
    snapshotData: any;
  }>;
}

export function getDefaultCMSData(): CMSData {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    settings: {
      siteName: COMPANY_INFO.name,
      tagline: COMPANY_INFO.tagline,
      phone: COMPANY_INFO.phone,
      rawPhone: COMPANY_INFO.rawPhone,
      email: COMPANY_INFO.email,
      altEmail: COMPANY_INFO.altEmail,
      address: COMPANY_INFO.address,
      offerValidity: COMPANY_INFO.offerValidity,
      logoUrl: '',
      faviconUrl: '',
      ribbonText: 'Explore Himalayan tourist cab packages with private mountain chauffeur and fuel included.',
      ribbonLinkText: 'Inquire on WhatsApp',
      ribbonLinkUrl: `https://wa.me/${COMPANY_INFO.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20a%20cab%20package.`,
      defaultSeoTitle: 'Spiky Cabs – Darjeeling, Sikkim & Bhutan Cab Packages',
      defaultSeoDescription: 'Dedicated tourist cab packages across Darjeeling, Gangtok, North Sikkim, Kalimpong and Bhutan. Experienced mountain drivers, customized itineraries, airport transfers from IXB and NJP.',
      ogImage: '/images/hero_himalayan_cab_1790679944443.jpg',
      analyticsId: '',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://x.com',
        youtube: 'https://youtube.com',
      }
    },
    navigation: [
      { id: 'nav-packages', label: 'Cab Packages', path: 'packages', isPublished: true, order: 1, openInNewTab: false, isSystem: true },
      { id: 'nav-about', label: 'About', path: 'about', isPublished: true, order: 2, openInNewTab: false, isSystem: true },
      { id: 'nav-gallery', label: 'Gallery', path: 'gallery', isPublished: true, order: 3, openInNewTab: false, isSystem: true },
      { id: 'nav-testimonials', label: 'Testimonials', path: 'testimonials', isPublished: true, order: 4, openInNewTab: false, isSystem: true },
      { id: 'nav-contact', label: 'Contact', path: 'contact', isPublished: true, order: 5, openInNewTab: false, isSystem: true }
    ],
    pages: [
      {
        id: 'page-packages',
        slug: 'packages',
        title: 'Cab Packages & Circuits',
        seoTitle: 'Spiky Cabs – Darjeeling, Sikkim & Bhutan Cab Packages',
        metaDescription: 'Explore our complete list of tourist cab packages for Darjeeling, Gangtok, North Sikkim, Kalimpong, and Bhutan.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: [
          {
            id: 'sec-hero-1',
            type: 'hero',
            title: 'Himalayas. Uncompromised.',
            subtitle: 'Dedicated private tourist cabs for Darjeeling, Sikkim, Kalimpong & Bhutan. From Bagdogra & NJP.',
            content: '100% Cab-Only Packages · Zero hotel markups · Valid till April 2027',
            image: '/images/hero_himalayan_cab_1790679944443.jpg',
            buttonText: 'Explore Packages',
            buttonLink: '#itineraries-section',
            order: 1,
            isVisible: true
          },
          {
            id: 'sec-feature-sikkim',
            type: 'feature',
            title: 'North Sikkim. Pure alpine drama.',
            subtitle: 'Traverse ancient pine gorges to Lachung, the blooming rhododendrons of Yumthang Valley, and high-altitude snow peaks at Zero Point (15,300 ft).',
            content: 'From ₹17,999 / complete cab package · Restricted Area Permits (PAP) arranged',
            image: '/images/north_sikkim_yumthang_1790679981868.jpg',
            buttonText: 'View Day-by-Day Itinerary',
            buttonLink: 'north-sikkim-4n-5d',
            order: 2,
            isVisible: true
          }
        ]
      },
      {
        id: 'page-about',
        slug: 'about',
        title: 'About Spiky Cabs',
        seoTitle: 'About Spiky Cabs – Himalayan Cab Package Specialists',
        metaDescription: 'Learn about Spiky Cabs, our cab-only philosophy, and our experienced mountain driver fleet based in Siliguri.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: [
          {
            id: 'sec-about-story',
            type: 'story',
            title: 'Dedicated to the Journey.',
            subtitle: 'We provide specialized tourist cab packages for Darjeeling, Sikkim, Kalimpong & Bhutan. Without the clutter of forced hotel markups.',
            content: 'At Spiky Cabs, based at Himachal Sarani, Siliguri, we built a modern alternative. You pick your own accommodations while we take care of the entire road journey.',
            image: '/images/hero_himalayan_cab_1790679944443.jpg',
            order: 1,
            isVisible: true
          }
        ]
      },
      {
        id: 'page-gallery',
        slug: 'gallery',
        title: 'Photo Gallery',
        seoTitle: 'Himalayan Photo Archive – Spiky Cabs Gallery',
        metaDescription: 'Capturing misty passes, golden Kanchenjunga dawn, and glacial lakes across our Himalayan routes.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: []
      },
      {
        id: 'page-testimonials',
        slug: 'testimonials',
        title: 'Traveler Video Reviews',
        seoTitle: 'Customer Testimonials & Video Stories – Spiky Cabs',
        metaDescription: 'Hear real trip feedback from travelers who toured Darjeeling, Gangtok, and North Sikkim with Spiky Cabs.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: []
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact Support & Booking Desk',
        seoTitle: 'Contact Spiky Cabs Siliguri – Phone & WhatsApp',
        metaDescription: 'Get in touch with Spiky Cabs in Siliguri for bookings, airport transfers from Bagdogra, or custom itineraries.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: []
      },
      {
        id: 'page-privacy',
        slug: 'privacy',
        title: 'Privacy Policy',
        seoTitle: 'Privacy Policy – Spiky Cabs',
        metaDescription: 'Privacy and data protection policy for Spiky Cabs tourist taxi services and permit handling.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        isSystem: true,
        sections: []
      }
    ],
    packages: PACKAGES_DATA,
    fleet: FLEET_DATA,
    gallery: GALLERY_DATA,
    testimonials: TESTIMONIALS_DATA,
    inclusions: INCLUSIONS_LIST,
    exclusions: EXCLUSIONS_LIST,
    routeChangePolicy: ROUTE_CHANGE_POLICY,
    footer: {
      footnotes: [
        'All cab package rates are starting estimates based on standard season travel for executive sedans, comfort MUVs, and premium SUVs. Actual pricing varies with seasonal holidays (Puja, Diwali, Summer peak) and high-altitude army permits (Nathu La Pass, Zero Point).',
        'Spiky Cabs specializes exclusively in private tourist cab packages (vehicle, certified driver, fuel, route taxes). Hotel accommodation, meals, attraction entry tickets, and personal expenses are excluded.',
        'In the event of mountain landslides, weather closures, or political strikes, alternate routes may be coordinated dynamically by our Siliguri desk subject to local road safety authorities.',
        `Offer valid till ${COMPANY_INFO.offerValidity}. Service area: Bagdogra Airport (IXB), New Jalpaiguri (NJP), Darjeeling, Sikkim, Kalimpong, and Bhutan.`
      ],
      columns: [
        {
          title: 'Circuits & Packages',
          links: [
            { label: 'Darjeeling Classic (2N/3D)', url: 'packages' },
            { label: 'Darjeeling Offbeat (4N/5D)', url: 'packages' },
            { label: 'Gangtok & Changu (3N/4D)', url: 'packages' },
            { label: 'North Sikkim & Yumthang (4N/5D)', url: 'packages' },
            { label: 'Bhutan Western Valley (5N/6D)', url: 'packages' }
          ]
        },
        {
          title: 'Explore Spiky Cabs',
          links: [
            { label: 'About Spiky Cabs', url: 'about' },
            { label: 'Gallery', url: 'gallery' },
            { label: 'Testimonials (Video)', url: 'testimonials' },
            { label: 'Privacy Policy', url: 'privacy' }
          ]
        },
        {
          title: 'Gateways & Transit',
          links: [
            { label: 'Bagdogra Airport (IXB)', url: 'contact' },
            { label: 'New Jalpaiguri Station (NJP)', url: 'contact' },
            { label: 'Siliguri Junction', url: 'contact' },
            { label: 'Sevoke Teesta Corridor', url: 'contact' },
            { label: 'Phuentsholing Border Gate', url: 'contact' }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Spiky Cabs Taxi Services. All rights reserved. Siliguri, West Bengal, India.`
    },
    media: [
      {
        id: 'med-hero-1',
        filename: 'hero_himalayan_cab_1790679944443.jpg',
        originalName: 'hero_himalayan_cab.jpg',
        url: '/images/hero_himalayan_cab_1790679944443.jpg',
        altText: 'Himalayan mountain highway with Mount Kanchenjunga',
        caption: 'Spiky Cabs vehicle driving through scenic Sikkim highway',
        fileSize: 420000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-innova-1',
        filename: 'fleet_innova_crysta_1790679963418.jpg',
        originalName: 'fleet_innova_crysta.jpg',
        url: '/images/fleet_innova_crysta_1790679963418.jpg',
        altText: 'Toyota Innova Crysta Mountain Service',
        caption: 'Premium sanitized tourist cab tailored for mountain curves',
        fileSize: 380000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-yumthang-1',
        filename: 'north_sikkim_yumthang_1790679981868.jpg',
        originalName: 'north_sikkim_yumthang.jpg',
        url: '/images/north_sikkim_yumthang_1790679981868.jpg',
        altText: 'Yumthang Valley North Sikkim',
        caption: 'Valley of flowers at 11,693 ft elevation',
        fileSize: 450000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-mirik-1',
        filename: 'darjeeling_tea_mirik_1790680004464.jpg',
        originalName: 'darjeeling_tea_mirik.jpg',
        url: '/images/darjeeling_tea_mirik_1790680004464.jpg',
        altText: 'Darjeeling tea gardens and Mirik',
        caption: 'Lush green tea estate slopes in Darjeeling',
        fileSize: 390000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-tigerhill-1',
        filename: 'gallery_tiger_hill_1790680945212.jpg',
        originalName: 'gallery_tiger_hill.jpg',
        url: '/images/gallery_tiger_hill_1790680945212.jpg',
        altText: 'Mount Kanchenjunga at Dawn from Tiger Hill',
        caption: 'Dawn sunrise hitting snowy peaks at 2,590 m',
        fileSize: 410000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-tsomgo-1',
        filename: 'gallery_tsomgo_lake_1790680958082.jpg',
        originalName: 'gallery_tsomgo_lake.jpg',
        url: '/images/gallery_tsomgo_lake_1790680958082.jpg',
        altText: 'Glacial Tsomgo Lake East Sikkim',
        caption: 'High-altitude turquoise lake at 12,310 ft',
        fileSize: 430000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-toytrain-1',
        filename: 'darjeeling_toy_train_1790684713643.jpg',
        originalName: 'darjeeling_toy_train.jpg',
        url: '/images/darjeeling_toy_train_1790684713643.jpg',
        altText: 'Darjeeling Himalayan Toy Train Batasia Loop',
        caption: 'Heritage steam locomotive puffing through Darjeeling tea estates',
        fileSize: 450000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-nathula-1',
        filename: 'nathula_pass_sikkim_1790684731915.jpg',
        originalName: 'nathula_pass_sikkim.jpg',
        url: '/images/nathula_pass_sikkim_1790684731915.jpg',
        altText: 'Nathu La Pass 14140 ft Indo-China Border Highway',
        caption: 'High-altitude alpine pass on the historic Silk Route in East Sikkim',
        fileSize: 460000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-ravangla-1',
        filename: 'ravangla_buddha_park_1790684746815.jpg',
        originalName: 'ravangla_buddha_park.jpg',
        url: '/images/ravangla_buddha_park_1790684746815.jpg',
        altText: 'Buddha Park of Ravangla 130-foot statue',
        caption: 'Golden Gautama Buddha statue at Tathagata Tsal facing Kanchenjunga',
        fileSize: 440000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-pelling-1',
        filename: 'pelling_skywalk_sikkim_1790684762658.jpg',
        originalName: 'pelling_skywalk_sikkim.jpg',
        url: '/images/pelling_skywalk_sikkim_1790684762658.jpg',
        altText: 'Pelling Glass Skywalk and Chenrezig Statue',
        caption: 'Transparent glass skywalk overlooking Kanchenjunga mountain ridge',
        fileSize: 470000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'med-gangtok-1',
        filename: 'gangtok_city_view_1790684782649.jpg',
        originalName: 'gangtok_city_view.jpg',
        url: '/images/gangtok_city_view_1790684782649.jpg',
        altText: 'Gangtok Himalayan Capital City View',
        caption: 'Picturesque valley overview of Gangtok capital with Mount Kanchenjunga',
        fileSize: 480000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      }
    ],
    auditLogs: [
      {
        id: 'audit-init',
        timestamp: new Date().toISOString(),
        action: 'system_initialized',
        details: 'CMS database seeded with initial Spiky Cabs content & itineraries',
        user: 'system'
      }
    ],
    revisions: []
  };
}
