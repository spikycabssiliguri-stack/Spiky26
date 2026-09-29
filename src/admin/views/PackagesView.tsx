import { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Save, 
  X, 
  Check, 
  Calendar, 
  MapPin, 
  Compass, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { CabPackage } from '../../data/packagesData';
import { CMSData } from '../../data/defaultCMSData';

interface PackagesViewProps {
  cmsData: CMSData;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

export const PackagesView = ({ cmsData, onSaveCMS, isSaving }: PackagesViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [editingPackage, setEditingPackage] = useState<CabPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPackages = cmsData.packages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || p.destination === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const handleEditClick = (pkg: CabPackage) => {
    setEditingPackage(JSON.parse(JSON.stringify(pkg)));
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    const newPkg: CabPackage = {
      id: `pkg-${Date.now()}`,
      slug: `new-circuit-${Date.now()}`,
      title: 'New Himalayan Tour',
      subtitle: 'NJP / IXB – Destination – NJP / IXB',
      destination: 'darjeeling',
      durationNights: 3,
      durationDays: 4,
      badge: 'Special Package',
      featuredImage: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
      startingPrice: {
        sedan: 9999,
        suv: 13999,
        innova: 16999
      },
      offerValidity: cmsData.settings.offerValidity,
      pickupDrop: 'Bagdogra Airport (IXB) or New Jalpaiguri (NJP)',
      overview: 'Comprehensive private cab circuit with mountain chauffeur and fuel included.',
      bestTime: 'October to May',
      idealFor: 'Families and couples',
      recommendedVehicles: ['Toyota Innova Crysta', 'Maruti Ertiga', 'Swift Dzire'],
      permitRequired: false,
      keyHighlights: ['Scenic mountain drive', 'Local viewpoints', 'Comfortable transfers'],
      days: [
        {
          dayNumber: 1,
          title: 'Arrival & Scenic Climb',
          routeTitle: 'NJP / IXB to Destination',
          description: 'Arrival at Bagdogra / NJP and private transfer into the hills.',
          highlights: ['Scenic tea garden view', 'Arrival at hotel'],
          stayLocation: 'Hill Station',
          sightseeingPoints: ['Coronation Bridge', 'Viewpoint']
        },
        {
          dayNumber: 2,
          title: 'Sightseeing Excursion',
          routeTitle: 'Local Sightseeing Tour',
          description: 'Full day excursion covering local monasteries and viewpoints.',
          highlights: ['Panoramic Himalayan vistas', 'Local handicraft shopping'],
          stayLocation: 'Hill Station',
          sightseeingPoints: ['Main Monastery', 'Lake Viewpoint']
        },
        {
          dayNumber: 3,
          title: 'Return Descent',
          routeTitle: 'Drop to NJP / IXB',
          description: 'Descent transfer back to Bagdogra Airport or NJP railway station.',
          highlights: ['Smooth return journey'],
          stayLocation: 'Departure',
          sightseeingPoints: ['Plains Gateway']
        }
      ]
    };
    setEditingPackage(newPkg);
    setIsCreating(true);
  };

  const handleDuplicateClick = (pkg: CabPackage) => {
    const duplicated: CabPackage = {
      ...JSON.parse(JSON.stringify(pkg)),
      id: `pkg-${Date.now()}`,
      slug: `${pkg.slug}-copy-${Date.now()}`,
      title: `${pkg.title} (Copy)`
    };

    const updatedPackages = [duplicated, ...cmsData.packages];
    onSaveCMS({ ...cmsData, packages: updatedPackages }, `Duplicated package: ${pkg.title}`);
  };

  const handleDelete = (id: string) => {
    const target = cmsData.packages.find(p => p.id === id);
    const updatedPackages = cmsData.packages.filter(p => p.id !== id);
    setDeleteConfirmId(null);
    onSaveCMS({ ...cmsData, packages: updatedPackages }, `Deleted package: ${target?.title || id}`);
  };

  const handleSaveModal = async () => {
    if (!editingPackage) return;

    let updatedPackages: CabPackage[];
    if (isCreating) {
      updatedPackages = [editingPackage, ...cmsData.packages];
    } else {
      updatedPackages = cmsData.packages.map(p => p.id === editingPackage.id ? editingPackage : p);
    }

    await onSaveCMS(
      { ...cmsData, packages: updatedPackages },
      isCreating ? `Created new package: ${editingPackage.title}` : `Updated package: ${editingPackage.title}`
    );
    setEditingPackage(null);
  };

  const handleAddDay = () => {
    if (!editingPackage) return;
    const nextDayNum = editingPackage.days.length + 1;
    const newDay = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Itinerary`,
      routeTitle: `Route ${nextDayNum}`,
      description: 'Day schedule description and activities.',
      highlights: ['Scenic stops'],
      stayLocation: 'Hotel',
      sightseeingPoints: ['Sightseeing Point']
    };
    setEditingPackage({
      ...editingPackage,
      durationDays: nextDayNum,
      durationNights: nextDayNum - 1,
      days: [...editingPackage.days, newDay]
    });
  };

  const handleRemoveDay = (index: number) => {
    if (!editingPackage || editingPackage.days.length <= 1) return;
    const updatedDays = editingPackage.days.filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      dayNumber: i + 1
    }));
    setEditingPackage({
      ...editingPackage,
      durationDays: updatedDays.length,
      durationNights: Math.max(1, updatedDays.length - 1),
      days: updatedDays
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e5ea]">
        <div>
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
            Catalog Management
          </span>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            Cab Packages & Itineraries ({cmsData.packages.length})
          </h2>
          <p className="text-xs text-[#6e6e73] mt-1">
            Manage day-by-day schedules, vehicle tariffs, permits, and route highlights.
          </p>
        </div>

        <button
          onClick={handleCreateClick}
          className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-normal transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e5e5ea] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search packages by title or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
          />
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'darjeeling', label: 'Darjeeling' },
            { id: 'gangtok', label: 'Gangtok' },
            { id: 'north-sikkim', label: 'North Sikkim' },
            { id: 'kalimpong', label: 'Kalimpong' },
            { id: 'bhutan', label: 'Bhutan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSectorFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                sectorFilter === tab.id
                  ? 'bg-[#1d1d1f] text-white font-medium'
                  : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-[#e5e5ea] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/75 backdrop-blur-md text-[11px] font-mono text-white rounded">
                  {pkg.durationNights}N / {pkg.durationDays}D
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#0071e3] text-white text-[10px] uppercase font-bold rounded">
                  {pkg.destination}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-base text-[#1d1d1f] leading-snug">
                  {pkg.title}
                </h3>
                <p className="text-xs text-[#86868b] truncate">
                  {pkg.subtitle}
                </p>
                <div className="pt-2 flex items-baseline justify-between border-t border-[#f5f5f7] text-xs">
                  <span className="text-[#86868b]">Starting Fare:</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">
                    ₹{pkg.startingPrice.sedan.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[11px] text-[#86868b]">
                  {pkg.days.length} days scheduled · {pkg.permitRequired ? 'Permit required' : 'No permit needed'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex items-center justify-between gap-2">
              <button
                onClick={() => handleEditClick(pkg)}
                className="flex-1 py-1.5 px-3 bg-white hover:bg-neutral-100 text-[#1d1d1f] rounded-xl text-xs font-medium transition-colors border border-[#d2d2d7] inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDuplicateClick(pkg)}
                className="p-1.5 bg-white hover:bg-neutral-100 text-[#6e6e73] rounded-xl border border-[#d2d2d7] transition-colors cursor-pointer"
                title="Duplicate Package"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(pkg.id)}
                className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-[#d2d2d7] hover:border-rose-300 transition-colors cursor-pointer"
                title="Delete Package"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#e5e5ea]">
            <h3 className="font-semibold text-lg text-[#1d1d1f]">Confirm Deletion</h3>
            <p className="text-xs text-[#6e6e73]">
              Are you sure you want to permanently remove this cab package? This will update the public website.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e5e5ea] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1d1d1f] text-white p-6 sm:p-8 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                  {isCreating ? 'New Package' : 'Edit Itinerary'}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-white mt-0.5">
                  {editingPackage.title || 'Untitled Package'}
                </h3>
              </div>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6 text-xs bg-white">
              {/* General Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-[#1d1d1f] border-b border-[#f5f5f7] pb-2">
                  General Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Package Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.title}
                      onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Route Subtitle *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.subtitle}
                      onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Sector / Destination</label>
                    <select
                      value={editingPackage.destination}
                      onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value as any })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                    >
                      <option value="darjeeling">Darjeeling</option>
                      <option value="gangtok">Gangtok & East Sikkim</option>
                      <option value="north-sikkim">North Sikkim</option>
                      <option value="kalimpong">Kalimpong</option>
                      <option value="bhutan">Bhutan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Duration (Nights / Days)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        value={editingPackage.durationNights}
                        onChange={(e) => setEditingPackage({ ...editingPackage, durationNights: Number(e.target.value) })}
                        placeholder="Nights"
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f]"
                      />
                      <input
                        type="number"
                        min="1"
                        value={editingPackage.durationDays}
                        onChange={(e) => setEditingPackage({ ...editingPackage, durationDays: Number(e.target.value) })}
                        placeholder="Days"
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={editingPackage.featuredImage}
                      onChange={(e) => setEditingPackage({ ...editingPackage, featuredImage: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editingPackage.badge}
                      onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1d1d1f] font-medium mb-1">Package Overview</label>
                  <textarea
                    rows={3}
                    value={editingPackage.overview}
                    onChange={(e) => setEditingPackage({ ...editingPackage, overview: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl p-3 text-[#1d1d1f]"
                  ></textarea>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-[#1d1d1f] border-b border-[#f5f5f7] pb-2">
                  Vehicle Tariffs (Starting Prices)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Sedan Price (₹)</label>
                    <input
                      type="number"
                      value={editingPackage.startingPrice.sedan}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        startingPrice: { ...editingPackage.startingPrice, sedan: Number(e.target.value) }
                      })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">MUV / SUV Price (₹)</label>
                    <input
                      type="number"
                      value={editingPackage.startingPrice.suv}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        startingPrice: { ...editingPackage.startingPrice, suv: Number(e.target.value) }
                      })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1d1d1f] font-medium mb-1">Innova Crysta Price (₹)</label>
                    <input
                      type="number"
                      value={editingPackage.startingPrice.innova}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        startingPrice: { ...editingPackage.startingPrice, innova: Number(e.target.value) }
                      })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Permits */}
              <div className="space-y-3 bg-[#f5f5f7] p-4 rounded-2xl border border-[#e5e5ea]">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1d1d1f]">
                  <input
                    type="checkbox"
                    checked={editingPackage.permitRequired}
                    onChange={(e) => setEditingPackage({ ...editingPackage, permitRequired: e.target.checked })}
                    className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-0"
                  />
                  <span>Permit Required for this Route (e.g. Sikkim PAP, North Sikkim RAP, Bhutan)</span>
                </label>
                {editingPackage.permitRequired && (
                  <input
                    type="text"
                    placeholder="Describe permit requirements (e.g. 2 passport photos, Voter ID card)..."
                    value={editingPackage.permitDetails || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, permitDetails: e.target.value })}
                    className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f]"
                  />
                )}
              </div>

              {/* Day-by-Day Schedule */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-2">
                  <h4 className="font-semibold text-sm text-[#1d1d1f]">
                    Day-by-Day Schedule ({editingPackage.days.length} Days)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="text-[#0071e3] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editingPackage.days.map((day, idx) => (
                    <div key={idx} className="border border-[#e5e5ea] rounded-2xl p-4 bg-[#fbfbfd] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1d1d1f] font-mono">
                          Day {day.dayNumber}
                        </span>
                        {editingPackage.days.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(idx)}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove Day
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#86868b] mb-1">Route Title</label>
                          <input
                            type="text"
                            value={day.routeTitle}
                            onChange={(e) => {
                              const updatedDays = [...editingPackage.days];
                              updatedDays[idx].routeTitle = e.target.value;
                              setEditingPackage({ ...editingPackage, days: updatedDays });
                            }}
                            className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5"
                          />
                        </div>

                        <div>
                          <label className="block text-[#86868b] mb-1">Stay Location</label>
                          <input
                            type="text"
                            value={day.stayLocation}
                            onChange={(e) => {
                              const updatedDays = [...editingPackage.days];
                              updatedDays[idx].stayLocation = e.target.value;
                              setEditingPackage({ ...editingPackage, days: updatedDays });
                            }}
                            className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#86868b] mb-1">Day Narrative / Description</label>
                        <textarea
                          rows={2}
                          value={day.description}
                          onChange={(e) => {
                            const updatedDays = [...editingPackage.days];
                            updatedDays[idx].description = e.target.value;
                            setEditingPackage({ ...editingPackage, days: updatedDays });
                          }}
                          className="w-full bg-white border border-[#d2d2d7] rounded-xl p-2.5"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[#86868b] mb-1">Sightseeing Points (comma separated)</label>
                        <input
                          type="text"
                          value={day.sightseeingPoints.join(', ')}
                          onChange={(e) => {
                            const updatedDays = [...editingPackage.days];
                            updatedDays[idx].sightseeingPoints = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setEditingPackage({ ...editingPackage, days: updatedDays });
                          }}
                          className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-[#f5f5f7] border-t border-[#e5e5ea] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 rounded-full text-xs text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveModal}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-2 text-xs font-normal transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save & Publish Package'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
