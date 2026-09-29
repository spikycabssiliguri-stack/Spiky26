import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Car, 
  Clock, 
  Shield, 
  Check, 
  X, 
  Download, 
  MessageCircle, 
  Phone, 
  ArrowLeft, 
  ChevronRight, 
  Compass, 
  AlertCircle,
  Sparkles,
  Users,
  Send,
  CheckCircle2,
  FileText,
  Eye,
  Camera,
  Maximize2
} from 'lucide-react';
import { CabPackage, TOURIST_ATTRACTIONS, TouristAttraction } from '../data/packagesData';
import { useCMS } from '../context/CMSContext';
import { DownloadBrochureModal } from '../components/DownloadBrochureModal';

interface PackageDetailPageProps {
  packageIdOrSlug: string;
  onNavigateBack: () => void;
  onNavigatePackage: (slug: string) => void;
}

export const PackageDetailPage = ({
  packageIdOrSlug,
  onNavigateBack,
  onNavigatePackage
}: PackageDetailPageProps) => {
  const { cmsData } = useCMS();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedAttractionCategory, setSelectedAttractionCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; subtitle?: string; altitude?: string } | null>(null);

  // Find target package by slug or id
  const pkg: CabPackage | undefined = cmsData.packages.find(
    p => p.slug === packageIdOrSlug || p.id === packageIdOrSlug
  ) || cmsData.packages[0];

  const settings = cmsData.settings;

  // Reset category filter when switching package
  useEffect(() => {
    setSelectedAttractionCategory('all');
  }, [packageIdOrSlug]);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    travelDate: '',
    vehicleType: 'Toyota Innova Crysta',
    passengers: '2-4 Guests',
    notes: ''
  });

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Package Not Found</h2>
        <p className="text-sm text-[#86868b]">The requested cab package does not exist.</p>
        <button
          onClick={onNavigateBack}
          className="rounded-full bg-[#0071e3] text-white px-5 py-2 text-xs font-normal cursor-pointer"
        >
          View All Packages
        </button>
      </div>
    );
  }

  // Determine geographic circuit/region strictly:
  // Darjeeling package -> only points in Darjeeling, Mirik, Lamahatta etc.
  // Sikkim package -> only points in Sikkim (East/Gangtok, North Sikkim, Ravangla, Pelling)
  // Kalimpong package -> only points in Kalimpong & adjacent valleys
  // Bhutan package -> only points in Bhutan
  const packageRegion: 'darjeeling' | 'sikkim' | 'kalimpong' | 'bhutan' = (() => {
    if (pkg.destination === 'darjeeling') return 'darjeeling';
    if (pkg.destination === 'kalimpong') return 'kalimpong';
    if (pkg.destination === 'bhutan') return 'bhutan';
    if (pkg.destination === 'gangtok' || pkg.destination === 'north-sikkim') {
      return 'sikkim';
    }
    return 'darjeeling';
  })();

  // 1. Strictly filter base attractions for this specific circuit / region
  const regionAttractions = TOURIST_ATTRACTIONS.filter(item => {
    if (packageRegion === 'darjeeling') {
      return item.region === 'darjeeling';
    }
    if (packageRegion === 'sikkim') {
      return item.region === 'sikkim';
    }
    if (packageRegion === 'kalimpong') {
      return item.region === 'kalimpong' || item.id === 'lamahatta-eco-park';
    }
    if (packageRegion === 'bhutan') {
      return item.region === 'bhutan';
    }
    return item.region === packageRegion;
  });

  // 2. Dynamic sub-filter tabs customized for this region
  interface RegionTab {
    id: string;
    label: string;
    filterFn: (item: TouristAttraction) => boolean;
  }

  const getTabsForRegion = (region: 'darjeeling' | 'sikkim' | 'kalimpong' | 'bhutan'): RegionTab[] => {
    if (region === 'darjeeling') {
      return [
        { id: 'all', label: 'All Darjeeling & Foothills', filterFn: () => true },
        { id: 'toy-train', label: 'Toy Train & Batasia Loop', filterFn: (item) => item.id === 'toy-train' },
        { id: 'tiger-hill', label: 'Tiger Hill Sunrise', filterFn: (item) => item.id === 'tiger-hill' },
        { id: 'mirik', label: 'Mirik Lake & Tea Slopes', filterFn: (item) => item.id === 'mirik-tea-lake' },
        { id: 'lamahatta', label: 'Lamahatta Pine Trails', filterFn: (item) => item.id === 'lamahatta-eco-park' }
      ];
    }
    
    if (region === 'sikkim') {
      return [
        { id: 'all', label: 'All Sikkim Points', filterFn: () => true },
        { id: 'gangtok', label: 'Gangtok & High Passes (Nathu La)', filterFn: (item) => item.category === 'gangtok' },
        { id: 'north-sikkim', label: 'North Sikkim (Yumthang & Gurudongmar)', filterFn: (item) => item.category === 'north-sikkim' },
        { id: 'ravangla', label: 'Ravangla Buddha Park', filterFn: (item) => item.category === 'ravangla' },
        { id: 'pelling', label: 'Pelling Glass Skywalk', filterFn: (item) => item.category === 'pelling' }
      ];
    }

    if (region === 'kalimpong') {
      return [
        { id: 'all', label: 'All Kalimpong Points', filterFn: () => true },
        { id: 'deolo', label: 'Deolo Hill & Paragliding', filterFn: (item) => item.id === 'deolo-hill' },
        { id: 'lamahatta', label: 'Lamahatta & Teesta Valley', filterFn: (item) => item.id === 'lamahatta-eco-park' }
      ];
    }

    return [
      { id: 'all', label: 'All Bhutan Highlights', filterFn: () => true },
      { id: 'dochula', label: 'Dochula Pass & 108 Chortens', filterFn: (item) => item.id === 'dochula-pass' }
    ];
  };

  const currentTabs = getTabsForRegion(packageRegion);
  const activeTab = currentTabs.find(t => t.id === selectedAttractionCategory) || currentTabs[0];
  const filteredAttractions = regionAttractions.filter(activeTab.filterFn);

  // Showcase header content tailored to destination
  const getShowcaseHeader = () => {
    if (packageRegion === 'darjeeling') {
      return {
        tag: 'Darjeeling Hills & Foothills Showcase',
        title: 'Iconic Attractions & Tourist Spots in Darjeeling',
        desc: 'Explore sightseeing points strictly in Darjeeling, Mirik, and Lamahatta: the UNESCO Toy Train, Tiger Hill sunrise, Mirik Lake & Tingling tea slopes, and tranquil pine trails of Lamahatta.'
      };
    }
    if (packageRegion === 'sikkim') {
      return {
        tag: 'Sikkim Himalayan Circuit Showcase',
        title: 'Iconic Attractions & Tourist Spots in Sikkim',
        desc: 'Explore sightseeing points strictly across Sikkim: Nathu La Pass, glacial Tsomgo Lake, Gangtok MG Marg, Yumthang Valley & Zero Point, 17,800-ft Gurudongmar Lake, Ravangla Buddha Park, and Pelling Glass Skywalk.'
      };
    }
    if (packageRegion === 'kalimpong') {
      return {
        tag: 'Kalimpong Ridge Showcase',
        title: 'Iconic Attractions & Tourist Spots in Kalimpong',
        desc: 'Explore scenic ridge viewpoints in Kalimpong: Deolo Hill, Teesta valley lookouts, and serene pine forests.'
      };
    }
    return {
      tag: 'Kingdom of Bhutan Showcase',
      title: 'Iconic Attractions & Tourist Spots in Bhutan',
      desc: 'Witness Dochula Pass with 108 memorial stupas, majestic Punakha Dzong, and the mountain wonders of Bhutan.'
    };
  };

  const showcaseHeader = getShowcaseHeader();

  // Get primary highlight image for this package
  const getPackageHeroImage = () => {
    if (pkg.destination === 'darjeeling' || pkg.destination === 'kalimpong') {
      return {
        url: '/src/assets/images/darjeeling_toy_train_1790684713643.jpg',
        caption: 'Darjeeling Himalayan Heritage Toy Train at Batasia Loop',
        tag: 'Iconic Heritage Railway'
      };
    }
    if (pkg.destination === 'north-sikkim') {
      return {
        url: '/src/assets/images/north_sikkim_yumthang_1790679981868.jpg',
        caption: 'Yumthang Alpine Valley & Zero Point (15,300 ft)',
        tag: 'Valley of Flowers & Snow'
      };
    }
    if (pkg.destination === 'gangtok') {
      return {
        url: '/src/assets/images/nathula_pass_sikkim_1790684731915.jpg',
        caption: 'Nathu La Pass Mountain Highway (14,140 ft)',
        tag: 'High Altitude Border Pass'
      };
    }
    return {
      url: pkg.featuredImage || '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
      caption: pkg.title,
      tag: 'Scenic Mountain Highway'
    };
  };

  const heroImageMeta = getPackageHeroImage();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;
    setFormSubmitted(true);
  };

  const getWhatsAppInquiryUrl = () => {
    const text = `Hi Spiky Cabs, I would like to inquire about the cab package:
- Package: ${pkg.title} (${pkg.durationNights}N/${pkg.durationDays}D)
- Name: ${bookingForm.name || 'Traveler'}
- Phone: ${bookingForm.phone || 'N/A'}
- Preferred Date: ${bookingForm.travelDate || 'Flexible'}
- Vehicle: ${bookingForm.vehicleType}
- Guests: ${bookingForm.passengers}
${bookingForm.notes ? `- Notes: ${bookingForm.notes}` : ''}

Please share tariff availability and confirmation details.`;
    return `https://wa.me/${settings.rawPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleAddAttractionToNotes = (attractionName: string) => {
    setBookingForm(prev => {
      const existing = prev.notes ? `${prev.notes}, ` : '';
      return {
        ...prev,
        notes: `${existing}Include stop at ${attractionName}`
      };
    });
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* 1. Sub-Header Navigation & Breadcrumbs */}
      <div className="bg-[#f5f5f7] border-b border-[#e5e5ea] sticky top-12 z-30 backdrop-blur-md">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs text-[#6e6e73]">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center gap-1 text-[#0071e3] hover:underline cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Packages</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] font-medium truncate max-w-[200px] sm:max-w-md">
              {pkg.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Download PDF</span>
            </button>

            <a
              href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20interested%20in%20${encodeURIComponent(pkg.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-3.5 py-1.5 text-xs font-normal transition-colors inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Hero Stage (Apple Product Page Style) */}
      <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 bg-white border-b border-[#e5e5ea] px-4 sm:px-6">
        <div className="max-w-[1120px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#f5f5f7] font-medium text-[#1d1d1f]">
              {pkg.destination.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-medium">
              {pkg.badge || 'Official Tourist Cab Circuit'}
            </span>
            <span className="text-[#86868b]">
              Offer valid till {pkg.offerValidity || settings.offerValidity}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
              {pkg.title}
            </h1>
            <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal leading-relaxed text-balance">
              {pkg.subtitle}
            </p>
          </div>

          {/* Key Specs Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#f5f5f7] space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">Duration</span>
              <div className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0071e3]" />
                <span>{pkg.durationNights}N / {pkg.durationDays}D</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">Pickup & Drop</span>
              <div className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0071e3]" />
                <span className="truncate">{pkg.pickupDrop}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">Starting Tariff</span>
              <div className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-1 font-mono">
                <span>From ₹{pkg.startingPrice.sedan.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">Best Season</span>
              <div className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0071e3]" />
                <span>{pkg.bestTime}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-6 py-3 text-xs sm:text-sm font-normal transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-[#2997ff]" />
              <span>Download PDF Itinerary</span>
            </button>

            <a
              href="#booking-section"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 text-xs sm:text-sm font-normal transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Book This Cab Circuit</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-5 py-3 text-xs sm:text-sm font-normal transition-colors inline-flex items-center gap-2 border border-[#d2d2d7]"
            >
              <Phone className="w-4 h-4 text-[#6e6e73]" />
              <span>Call Desk: {settings.phone}</span>
            </a>
          </div>

          {/* 2b. Featured Scenic Attraction Hero Banner */}
          <div className="pt-4">
            <div 
              className="relative aspect-21/9 sm:aspect-24/9 rounded-3xl overflow-hidden bg-neutral-900 group cursor-pointer shadow-md border border-[#e5e5ea]"
              onClick={() => setLightboxImage({
                url: heroImageMeta.url,
                title: heroImageMeta.caption,
                subtitle: `Included on ${pkg.title}`
              })}
            >
              <img
                src={heroImageMeta.url}
                alt={heroImageMeta.caption}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 opacity-95 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#2997ff] uppercase tracking-wider block">
                      {heroImageMeta.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                      {heroImageMeta.caption}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tariff Breakdown by Vehicle Category */}
      <section className="py-16 sm:py-20 bg-[#fbfbfd] border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-1">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block">
              Transparent Package Rates
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Choose Your Vehicle Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73]">
              All quotes are total cab package rates including complete route fuel, certified hill driver, and inter-state permit clearances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sedan */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] flex flex-col justify-between space-y-6 hover:border-[#0071e3] transition-colors shadow-xs">
              <div className="space-y-4">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                  Executive Sedan
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Swift Dzire / Toyota Etios
                </h3>
                <div className="pt-2 border-t border-[#f5f5f7]">
                  <span className="text-3xl font-semibold font-mono text-[#1d1d1f]">
                    ₹{pkg.startingPrice.sedan.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#86868b] block mt-0.5">complete tour package</span>
                </div>
                <ul className="text-xs text-[#6e6e73] space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 4 Guests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2 Large Bags + Small Backpacks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ideal for couples & small families</span>
                  </li>
                </ul>
              </div>

              <a
                href="#booking-section"
                onClick={() => setBookingForm(prev => ({ ...prev, vehicleType: 'Swift Dzire (Sedan)' }))}
                className="w-full text-center py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-normal transition-colors border border-[#d2d2d7]"
              >
                Select Sedan
              </a>
            </div>

            {/* MUV */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] flex flex-col justify-between space-y-6 hover:border-[#0071e3] transition-colors shadow-xs">
              <div className="space-y-4">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                  Comfort MUV
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Maruti Suzuki Ertiga
                </h3>
                <div className="pt-2 border-t border-[#f5f5f7]">
                  <span className="text-3xl font-semibold font-mono text-[#1d1d1f]">
                    ₹{pkg.startingPrice.suv.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#86868b] block mt-0.5">complete tour package</span>
                </div>
                <ul className="text-xs text-[#6e6e73] space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 6 Guests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3 Large Bags + 2 Small</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Comfortable suspension on curves</span>
                  </li>
                </ul>
              </div>

              <a
                href="#booking-section"
                onClick={() => setBookingForm(prev => ({ ...prev, vehicleType: 'Maruti Ertiga (MUV)' }))}
                className="w-full text-center py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-normal transition-colors border border-[#d2d2d7]"
              >
                Select Ertiga
              </a>
            </div>

            {/* Premium Innova */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0071e3] flex flex-col justify-between space-y-6 shadow-md relative">
              <div className="absolute -top-3 right-6 bg-[#0071e3] text-white text-[10px] font-semibold uppercase px-3 py-0.5 rounded-full">
                Most Popular Mountain Choice
              </div>
              <div className="space-y-4">
                <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider block">
                  Premium Mountain SUV
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Toyota Innova Crysta
                </h3>
                <div className="pt-2 border-t border-[#f5f5f7]">
                  <span className="text-3xl font-semibold font-mono text-[#0071e3]">
                    ₹{pkg.startingPrice.innova.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#86868b] block mt-0.5">complete tour package</span>
                </div>
                <ul className="text-xs text-[#6e6e73] space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 6–7 Guests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4 Large Trolley Bags + Handbags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Plush captain seats & powerful hill torque</span>
                  </li>
                </ul>
              </div>

              <a
                href="#booking-section"
                onClick={() => setBookingForm(prev => ({ ...prev, vehicleType: 'Toyota Innova Crysta (Premium)' }))}
                className="w-full text-center py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors"
              >
                Select Innova Crysta
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Day-by-Day Route Itinerary Timeline */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block">
                Day-by-Day Schedule
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                The Journey Unfolds.
              </h2>
            </div>

            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-5 py-2 text-xs font-normal transition-colors inline-flex items-center gap-2 border border-[#d2d2d7] self-start md:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Download PDF Schedule</span>
            </button>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-5 sm:before:left-7 before:w-0.5 before:bg-[#e5e5ea]">
            {pkg.days.map((day) => (
              <div key={day.dayNumber} className="relative pl-12 sm:pl-16 space-y-3">
                {/* Timeline Dot */}
                <div className="absolute left-3 sm:left-5 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-mono text-[10px] font-semibold ring-4 ring-white shadow-xs">
                  {day.dayNumber}
                </div>

                <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e5ea]">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#0071e3] tracking-wider block">
                        Day {day.dayNumber}
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1d1d1f]">
                        {day.title}
                      </h3>
                    </div>

                    <div className="text-xs text-[#86868b] flex items-center gap-3">
                      <span>Stay: <strong className="text-[#1d1d1f]">{day.stayLocation}</strong></span>
                      {day.altitude && (
                        <span>Altitude: <strong className="text-[#1d1d1f]">{day.altitude}</strong></span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                    {day.description}
                  </p>

                  {day.sightseeingPoints && day.sightseeingPoints.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                        Key Sightseeing Stops
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {day.sightseeingPoints.map((point, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#d2d2d7] text-xs text-[#1d1d1f]"
                          >
                            <MapPin className="w-3 h-3 text-[#0071e3]" />
                            <span>{point}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Geographic Region-Specific Sightseeing Showcase (Only places in that circuit area) */}
      <section className="py-16 sm:py-24 bg-[#fbfbfd] border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider">
                <Camera className="w-4 h-4 text-[#0071e3]" />
                <span>{showcaseHeader.tag}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                {showcaseHeader.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6e6e73] max-w-2xl">
                {showcaseHeader.desc}
              </p>
            </div>

            {/* Dynamic Circuit Sub-Filter Pills (Customized to this region) */}
            {currentTabs.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto text-xs">
                {currentTabs.map((tab) => {
                  const isSelected = (selectedAttractionCategory === 'all' && tab.id === 'all') || selectedAttractionCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedAttractionCategory(tab.id)}
                      className={`rounded-full px-3.5 py-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1d1d1f] text-white font-medium shadow-xs'
                          : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-[#d2d2d7]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attraction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between hover:border-[#0071e3] hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Photo Container with Lightbox Trigger */}
                  <div 
                    className="relative aspect-16/10 bg-neutral-900 overflow-hidden cursor-pointer"
                    onClick={() => setLightboxImage({
                      url: attraction.image,
                      title: attraction.name,
                      subtitle: `${attraction.location} · ${attraction.regionLabel}`,
                      altitude: attraction.altitude
                    })}
                  >
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Region Pill */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                      {attraction.regionLabel}
                    </div>

                    {/* Altitude Pill if available */}
                    {attraction.altitude && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1d1d1f] text-[10px] font-mono font-medium px-2.5 py-1 rounded-full shadow-xs">
                        {attraction.altitude}
                      </div>
                    )}

                    {/* Zoom Icon on Hover */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-[#1d1d1f] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#0071e3] uppercase tracking-wider block">
                        {attraction.location}
                      </span>
                      <h3 
                        onClick={() => setLightboxImage({
                          url: attraction.image,
                          title: attraction.name,
                          subtitle: `${attraction.location} · ${attraction.regionLabel}`,
                          altitude: attraction.altitude
                        })}
                        className="text-lg font-semibold text-[#1d1d1f] leading-snug cursor-pointer hover:text-[#0071e3] transition-colors"
                      >
                        {attraction.name}
                      </h3>
                      <p className="text-xs text-[#86868b] font-medium">
                        {attraction.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#424245] leading-relaxed">
                      {attraction.description}
                    </p>

                    {/* Highlights bullet tags */}
                    <div className="pt-2 border-t border-[#f5f5f7] space-y-1.5">
                      {attraction.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#6e6e73]">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleAddAttractionToNotes(attraction.name)}
                    className="flex-1 py-2 px-3 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-normal transition-colors cursor-pointer text-center"
                  >
                    + Add to My Route Plan
                  </button>

                  <a
                    href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20include%20${encodeURIComponent(attraction.name)}%20in%20my%20cab%20package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors"
                    title="Inquire via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Inclusions vs Exclusions */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#e5e5ea]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-1">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block">
              Terms & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Included in Every Cab Package
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="bg-[#fbfbfd] rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-4">
              <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Package Inclusions</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#424245]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated, sanitized private tourist cab exclusively for your family.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Certified local Himalayan driver with native experience on mountain curves.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Complete route fuel, oil, and scheduled itinerary distance included.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>All state road taxes, toll plaza taxes, and standard parking fees.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Driver night stay, lodging, and food allowances included.</span>
                </li>
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-[#fbfbfd] rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-4">
              <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Exclusions (Clear Policy)</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#424245]">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Hotel room accommodations and lodging charges (you choose your own hotel).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Daily meals, beverages, and personal snacks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Attraction entry tickets (Darjeeling Zoo, Ropeway, Toy Train, monasteries).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Army restricted pass supplements (Nathu La Pass / Zero Point permit vehicles).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Personal expenses, laundry, and optional driver tips.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Booking Inquiry Form & Contact Desk Section */}
      <section id="booking-section" className="py-16 sm:py-24 bg-[#fbfbfd]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Booking Form */}
            <div className="lg:col-span-7 bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider block">
                  Reserve This Circuit
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                  Request Cab Availability & Tariff
                </h3>
                <p className="text-xs sm:text-sm text-[#6e6e73] mt-1">
                  Fill in your travel dates below. Our Siliguri operations desk will confirm driver assignment and exact route tariff.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-semibold text-base text-emerald-950">Inquiry Received!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Thank you, {bookingForm.name}. Our Siliguri booking team is preparing your cab quotation for <strong>{pkg.title}</strong> and will reach out to <strong>{bookingForm.phone}</strong> shortly.
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] text-white px-5 py-2.5 text-xs font-normal shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Speed Up via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="e.g. Ananya Das"
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1.5">
                        Phone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="e.g. +91 98320 12345"
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1.5">
                        Travel / Arrival Date
                      </label>
                      <input
                        type="date"
                        value={bookingForm.travelDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1.5">
                        Vehicle Preference
                      </label>
                      <select
                        value={bookingForm.vehicleType}
                        onChange={(e) => setBookingForm({ ...bookingForm, vehicleType: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                      >
                        <option value="Toyota Innova Crysta">Toyota Innova Crysta (Most Popular)</option>
                        <option value="Swift Dzire (Sedan)">Swift Dzire / Sedan (Up to 4 Pax)</option>
                        <option value="Maruti Ertiga (MUV)">Maruti Ertiga / MUV (Up to 6 Pax)</option>
                        <option value="Scorpio / 4x4">Scorpio / 4x4 (High Altitude)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1.5">
                      Number of Passengers & Luggage
                    </label>
                    <input
                      type="text"
                      value={bookingForm.passengers}
                      onChange={(e) => setBookingForm({ ...bookingForm, passengers: e.target.value })}
                      placeholder="e.g. 4 Adults + 1 Child, 3 Trolleys"
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1.5">
                      Special Requests / Sightseeing Stops & Pickup Flight Details
                    </label>
                    <textarea
                      rows={3}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="e.g. Include toy train ride, arriving at Bagdogra at 11:30 AM..."
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3] resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#1d1d1f] hover:bg-black text-white py-3 px-5 text-xs font-normal transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Booking Request</span>
                    </button>

                    <a
                      href={getWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 px-5 text-xs font-normal transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Instant WhatsApp Quote</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Details & Direct Help Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-[#e5e5ea] shadow-xs">
                <h4 className="font-semibold text-base text-[#1d1d1f]">
                  Siliguri Operations Desk
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#86868b] uppercase tracking-wider text-[10px] font-semibold block">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-lg font-mono font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors block"
                    >
                      {settings.phone}
                    </a>
                    <span className="text-[11px] text-[#86868b]">Desk Active: 6:00 AM – 11:00 PM IST daily</span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#f5f5f7]">
                    <span className="text-[#86868b] uppercase tracking-wider text-[10px] font-semibold block">
                      Email Inquiries
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors block"
                    >
                      {settings.email}
                    </a>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#f5f5f7]">
                    <span className="text-[#86868b] uppercase tracking-wider text-[10px] font-semibold block">
                      Physical Siliguri Office
                    </span>
                    <p className="text-[#424245] leading-relaxed">
                      {settings.address}
                    </p>
                    <p className="text-[11px] text-[#86868b]">
                      Near Haiderpara Sporting Club, Siliguri, West Bengal
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f5f5f7]">
                  <button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f] text-xs font-normal transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>Download Brochure (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Other Related Circuits */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-4">
                <h4 className="font-semibold text-sm text-[#1d1d1f]">
                  Explore Other Himalayan Circuits
                </h4>
                <div className="space-y-2 text-xs">
                  {cmsData.packages
                    .filter(p => p.id !== pkg.id)
                    .slice(0, 3)
                    .map(otherPkg => (
                      <button
                        key={otherPkg.id}
                        onClick={() => onNavigatePackage(otherPkg.slug || otherPkg.id)}
                        className="w-full text-left p-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] transition-colors cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-[#1d1d1f] block truncate">{otherPkg.title}</span>
                          <span className="text-[11px] text-[#86868b]">{otherPkg.durationNights}N/{otherPkg.durationDays}D · from ₹{otherPkg.startingPrice.sedan.toLocaleString('en-IN')}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#86868b] shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Fullscreen Image Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden border border-white/20 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 bg-black overflow-hidden flex items-center justify-center">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-white space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.altitude && (
                  <span className="px-3 py-1 rounded-full bg-[#f5f5f7] text-xs font-mono font-medium text-[#1d1d1f]">
                    {lightboxImage.altitude}
                  </span>
                )}
              </div>
              {lightboxImage.subtitle && (
                <p className="text-xs text-[#86868b]">
                  {lightboxImage.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Brochure Lead Modal */}
      <DownloadBrochureModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        pkg={pkg}
        companyPhone={settings.phone}
      />
    </div>
  );
};
