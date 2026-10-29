import { useState } from 'react';
import { 
  Building2, 
  Car, 
  MapPin, 
  Compass, 
  Percent, 
  Users, 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Lock,
  Save,
  Sparkles
} from 'lucide-react';
import { 
  CRMMasterData, 
  CRMHotel, 
  CRMVehicle, 
  CRMServiceRate, 
  CRMDayWiseOption, 
  CRMViaRoute, 
  CRMDestination, 
  CRMSightseeingPlace, 
  CRMItineraryTemplate,
  CRMUser
} from '../../types/crm';
import { 
  saveCRMMaster, 
  saveCRMSectionItem, 
  deleteCRMSectionItem, 
  toggleCRMSectionItem 
} from '../../services/api';

interface MasterDataViewProps {
  masterData: CRMMasterData;
  onRefreshMaster: () => void;
  userRole: 'admin' | 'agent';
}

type MasterTab = 
  | 'services' 
  | 'hotels' 
  | 'vehicles' 
  | 'routes' 
  | 'destinations' 
  | 'sightseeing' 
  | 'templates' 
  | 'pricing' 
  | 'users';

export const MasterDataView = ({ masterData, onRefreshMaster, userRole }: MasterDataViewProps) => {
  const [activeTab, setActiveTab] = useState<MasterTab>('services');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit / Add Modal state
  const [editingItem, setEditingItem] = useState<{ section: string; data: any } | null>(null);

  const isAdmin = userRole === 'admin';

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleActive = async (section: string, id: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Admins can modify active status.');
      return;
    }
    try {
      await toggleCRMSectionItem(section, id);
      onRefreshMaster();
      showSuccess('Option status toggled');
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteItem = async (section: string, id: string, name?: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Admins can delete master options.');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${name || 'this item'}?`)) return;

    try {
      await deleteCRMSectionItem(section, id);
      onRefreshMaster();
      showSuccess('Item deleted from master data');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete item');
    }
  };

  const handleSaveModalItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!editingItem) return;

    setIsSaving(true);
    try {
      await saveCRMSectionItem(editingItem.section, editingItem.data);
      setEditingItem(null);
      onRefreshMaster();
      showSuccess(`Saved ${editingItem.section} item successfully!`);
    } catch (err: any) {
      alert(err?.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  // Pricing rules save
  const handleSavePricingRules = async (updatedRules: typeof masterData.pricingRules) => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await saveCRMSectionItem('pricingRules', updatedRules);
      onRefreshMaster();
      showSuccess('Pricing rules and default margin saved successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to update pricing rules');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: MasterTab; label: string; icon: any; count?: number }[] = [
    { id: 'services', label: 'Service & Cab Rates', icon: Car, count: masterData.serviceRates.length },
    { id: 'hotels', label: 'Hotels & Rooms', icon: Building2, count: masterData.hotels.length },
    { id: 'vehicles', label: 'Vehicles', icon: Car, count: masterData.vehicles.length },
    { id: 'routes', label: 'Via Routes & Days', icon: Compass, count: masterData.viaRoutes.length },
    { id: 'destinations', label: 'Destinations', icon: MapPin, count: masterData.destinations.length },
    { id: 'sightseeing', label: 'Sightseeing Points', icon: MapPin, count: masterData.sightseeingPlaces.length },
    { id: 'templates', label: 'Itinerary Templates', icon: FileText, count: masterData.templates.length },
    { id: 'pricing', label: 'Margin & Terms', icon: Percent },
    { id: 'users', label: 'Users & Agents', icon: Users, count: masterData.users.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </span>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Master Data & CRM Configuration
            </h2>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isAdmin ? 'Admin Full Control' : 'Agent (View-Only)'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Centrally control hotels, room categories, exact service rates, vehicles, day options, and agency margin.
          </p>
        </div>

        {/* View-Only Banner for Agents */}
        {!isAdmin && (
          <div className="p-3 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Agent View-Only Mode: All master tariffs and CRM options are locked by Admin.</span>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Service Rates (Preloaded Exact User Rates) */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Preloaded Service & Cab Rates</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Official tariffs for Pickups, Sightseeing, Mirik, Lamahatta, Drops, Gangtok, Pelling, and North Sikkim.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setEditingItem({
                  section: 'serviceRates',
                  data: {
                    id: `srv-${Date.now()}`,
                    destination: 'Darjeeling',
                    serviceName: '',
                    serviceType: 'Transfer',
                    fourSeaterRate: 3500,
                    sixSeaterRate: 5000,
                    notes: '',
                    durationHours: 4,
                    isActive: true
                  }
                })}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service Rate</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Service Name</th>
                  <th className="py-2.5 px-3">Circuit</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">4-Seater Rate</th>
                  <th className="py-2.5 px-3">6-Seater Rate</th>
                  <th className="py-2.5 px-3">Per Person / Note</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  {isAdmin && <th className="py-2.5 px-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {masterData.serviceRates.map((srv) => (
                  <tr key={srv.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900">{srv.serviceName}</div>
                      <div className="text-[10px] text-neutral-500 line-clamp-1">{srv.notes}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-neutral-700">{srv.destination}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        {srv.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      ₹{srv.fourSeaterRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      ₹{srv.sixSeaterRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-neutral-600">
                      {srv.perPersonRate ? (
                        <span className="text-[11px] font-bold text-amber-700">
                          ₹{srv.perPersonRate.toLocaleString('en-IN')} / person
                        </span>
                      ) : (
                        <span>{srv.durationHours || 4} hrs</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleActive('serviceRates', srv.id)}
                        disabled={!isAdmin}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                          srv.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {srv.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingItem({ section: 'serviceRates', data: srv })}
                            className="p-1 rounded-md hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('serviceRates', srv.id, srv.serviceName)}
                            className="p-1 rounded-md hover:bg-red-100 text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Hotels & Rooms */}
      {activeTab === 'hotels' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Hotels & Room Categories</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Verified luxury & boutique hill properties across Darjeeling, Gangtok, Pelling, and North Sikkim.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setEditingItem({
                  section: 'hotels',
                  data: {
                    id: `hotel-${Date.now()}`,
                    name: '',
                    destination: 'Darjeeling',
                    destinationId: 'dest-darjeeling',
                    starRating: 4,
                    locationAddress: '',
                    phone: '',
                    email: '',
                    featuredImage: '/images/hotel_taj_chia_kutir_1791198283277.jpg',
                    amenities: ['Valley View', 'Free WiFi', 'Breakfast Included'],
                    roomCategories: [
                      { id: `room-${Date.now()}`, hotelId: '', hotelName: '', name: 'Deluxe Room', mealPlan: 'CP', baseOccupancy: 2, isActive: true }
                    ],
                    rates: [
                      { id: `rate-${Date.now()}`, hotelId: '', roomCategoryId: '', season: 'Regular', rackRate: 5000, b2bRate: 3800, extraBedRate: 1200, childRate: 600 }
                    ],
                    isActive: true
                  }
                })}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hotel</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterData.hotels.map((hotel) => (
              <div 
                key={hotel.id}
                className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-neutral-900 text-sm">{hotel.name}</h4>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                        {hotel.starRating}★
                      </span>
                    </div>
                    <span className="text-xs text-blue-700 font-semibold">{hotel.destination}</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{hotel.locationAddress}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive('hotels', hotel.id)}
                      disabled={!isAdmin}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                        hotel.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {hotel.isActive ? 'Active' : 'Inactive'}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setEditingItem({ section: 'hotels', data: hotel })}
                        className="p-1 rounded-md hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Room Categories preview */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-200/80">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Room Categories & B2B Rates:
                  </span>
                  <div className="space-y-1">
                    {hotel.roomCategories.map((room) => {
                      const rate = hotel.rates.find(r => r.roomCategoryId === room.id);
                      return (
                        <div key={room.id} className="p-2 rounded-xl bg-white border border-neutral-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-neutral-900">{room.name}</span>
                            <span className="text-[10px] text-neutral-500 ml-1.5">({room.mealPlan})</span>
                          </div>
                          <span className="font-bold text-emerald-700">
                            B2B: ₹{(rate?.b2bRate || 4000).toLocaleString('en-IN')}/night
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Fleet Categories & Passenger Capacity</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Commercial tourist vehicles assigned for hill tours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {masterData.vehicles.map((veh) => (
              <div key={veh.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-neutral-900 text-sm">{veh.name}</h4>
                  <button
                    onClick={() => handleToggleActive('vehicles', veh.id)}
                    disabled={!isAdmin}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                      veh.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {veh.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="text-xs text-blue-700 font-semibold">{veh.category}</div>
                <div className="text-xs text-neutral-600 space-y-0.5 pt-1">
                  <div>Capacity: <strong>Up to {veh.seatingCapacity} Pax</strong></div>
                  <div>Luggage: <strong>{veh.luggageCapacity} Bags</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Via Routes & Day-wise Options */}
      {activeTab === 'routes' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
          {/* Via Routes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Scenic Via Routes & Add-on Rates</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Optional scenic diversions with Lamahatta, Lovers Meet, Ravangla Buddha Park, Namchi Chardham.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {masterData.viaRoutes.map((via) => (
                <div key={via.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-neutral-900">{via.from} → {via.to}</span>
                    <button
                      onClick={() => handleToggleActive('viaRoutes', via.id)}
                      disabled={!isAdmin}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                        via.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {via.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="text-blue-700 font-semibold">{via.viaName}</div>
                  <div className="pt-1 text-neutral-700 space-y-0.5">
                    <div>4-Seater Supplement: <strong>+₹{via.additionalRate4Seater.toLocaleString('en-IN')}</strong></div>
                    <div>6-Seater Supplement: <strong>+₹{via.additionalRate6Seater.toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day-wise Options */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900">
              Reusable Day-wise Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masterData.dayWiseOptions.map((opt) => (
                <div key={opt.id} className="p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-neutral-900 text-sm">{opt.title}</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      {opt.destination}
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">{opt.morningActivity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Destinations */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Master Destinations & Tourism Circuits</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterData.destinations.map((dest) => (
              <div key={dest.id} className="p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-neutral-900 text-sm">{dest.name}</h4>
                  <button
                    onClick={() => handleToggleActive('destinations', dest.id)}
                    disabled={!isAdmin}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                      dest.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {dest.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="text-neutral-500">{dest.state} ({dest.region})</div>
                <p className="text-neutral-600 text-[11px] leading-relaxed line-clamp-2">{dest.description}</p>
                <div className="text-[10px] text-blue-700 font-semibold pt-1">Best time: {dest.bestTimeToVisit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Sightseeing Points */}
      {activeTab === 'sightseeing' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Sightseeing Points & Monument Tickets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {masterData.sightseeingPlaces.map((sight) => (
              <div key={sight.id} className="p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-neutral-900 text-sm">{sight.name}</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    {sight.destination}
                  </span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed">{sight.description}</p>
                <div className="flex justify-between items-center text-[11px] text-neutral-500 pt-1">
                  <span>Entry Fee: <strong>{sight.entryTicketFee ? `₹${sight.entryTicketFee}` : 'Free'}</strong></span>
                  <span>Timings: {sight.timings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Itinerary Templates */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Pre-configured Itinerary Templates</span>
          </h3>

          <div className="space-y-3">
            {masterData.templates.map((tmpl) => (
              <div key={tmpl.id} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{tmpl.title}</h4>
                    <span className="text-blue-700 font-semibold">{tmpl.destinationCircuit} · {tmpl.durationNights}N/{tmpl.durationDays}D</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Vehicle: {tmpl.suggestedVehicleCategory}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {tmpl.dayWiseTemplates.map((d) => (
                    <div key={d.dayNumber} className="flex items-center gap-2 text-[11px] text-neutral-700">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 font-bold flex items-center justify-center shrink-0">
                        {d.dayNumber}
                      </span>
                      <span className="font-semibold text-neutral-900">{d.title}</span>
                      <span className="text-neutral-400">({d.destination})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Margin & Terms */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Percent className="w-4 h-4 text-blue-600" />
            <span>Agency Margin, Taxes & Booking Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 block">Default Agency Margin (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                disabled={!isAdmin}
                defaultValue={masterData.pricingRules.defaultMarginPercent}
                onBlur={(e) => handleSavePricingRules({
                  ...masterData.pricingRules,
                  defaultMarginPercent: Number(e.target.value)
                })}
                className="w-full text-sm font-bold p-2.5 rounded-xl border border-neutral-300 bg-white"
              />
              <span className="text-[10px] text-neutral-500">Auto-applied in Itinerary Builder pricing engine</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 block">GST on Tour Packages (%)</label>
              <input
                type="number"
                min={0}
                max={28}
                disabled={!isAdmin}
                defaultValue={masterData.pricingRules.gstPercent}
                onBlur={(e) => handleSavePricingRules({
                  ...masterData.pricingRules,
                  gstPercent: Number(e.target.value)
                })}
                className="w-full text-sm font-bold p-2.5 rounded-xl border border-neutral-300 bg-white"
              />
              <span className="text-[10px] text-neutral-500">Government approved 5% tour operator GST rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 block">Agent Discretionary Discount Cap (%)</label>
              <input
                type="number"
                min={0}
                max={20}
                disabled={!isAdmin}
                defaultValue={masterData.pricingRules.maxAgentDiscountPercent}
                onBlur={(e) => handleSavePricingRules({
                  ...masterData.pricingRules,
                  maxAgentDiscountPercent: Number(e.target.value)
                })}
                className="w-full text-sm font-bold p-2.5 rounded-xl border border-neutral-300 bg-white"
              />
              <span className="text-[10px] text-neutral-500">Maximum discount an agent can offer on a quotation</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-4 pt-2 text-xs">
            <div>
              <label className="text-xs font-bold text-neutral-900 block mb-1">Standard Payment Terms</label>
              <textarea
                rows={2}
                disabled={!isAdmin}
                defaultValue={masterData.pricingRules.paymentTerms}
                onBlur={(e) => handleSavePricingRules({
                  ...masterData.pricingRules,
                  paymentTerms: e.target.value
                })}
                className="w-full p-3 rounded-2xl border border-neutral-300 bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-900 block mb-1">Cancellation Policy</label>
              <textarea
                rows={2}
                disabled={!isAdmin}
                defaultValue={masterData.pricingRules.cancellationPolicy}
                onBlur={(e) => handleSavePricingRules({
                  ...masterData.pricingRules,
                  cancellationPolicy: e.target.value
                })}
                className="w-full p-3 rounded-2xl border border-neutral-300 bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Users & Agents */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>CRM Users & Agent Accounts</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Manage roles (Admin vs Agent) and credentials.
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {masterData.users.map((u) => (
              <div key={u.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role === 'admin' ? 'A' : 'Ag'}
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900">{u.name}</span>
                    <span className="text-[11px] text-neutral-500 block">
                      @{u.username} · {u.email} · {u.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    u.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {u.role}
                  </span>
                  <button
                    onClick={() => handleToggleActive('users', u.id)}
                    disabled={!isAdmin || u.username === 'admin'}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer disabled:cursor-default ${
                      u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Item Modal for Admin */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Edit {editingItem.section}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="space-y-4 text-xs">
              {editingItem.section === 'serviceRates' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.serviceName}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, serviceName: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">4-Seater Tariff (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingItem.data.fourSeaterRate}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, fourSeaterRate: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">6-Seater Tariff (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingItem.data.sixSeaterRate}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, sixSeaterRate: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Service Notes & Inclusions</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.notes || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, notes: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                </>
              )}

              {editingItem.section === 'hotels' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Hotel Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.name}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, name: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Destination</label>
                      <select
                        value={editingItem.data.destination}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, destination: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white"
                      >
                        {masterData.destinations.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Star Rating</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editingItem.data.starRating}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, starRating: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Location Address</label>
                    <input
                      type="text"
                      value={editingItem.data.locationAddress || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, locationAddress: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
