import { useState } from 'react';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Save, 
  X, 
  Check, 
  Users, 
  Briefcase, 
  Shield, 
  Sparkles, 
  AlertCircle,
  Search
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';
import { FleetItem } from '../../data/packagesData';

interface FleetViewProps {
  cmsData: CMSData;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

const CATEGORIES: FleetItem['category'][] = [
  'Premium SUV',
  'Comfort MUV',
  'Mountain 4x4 / High Clearance',
  'Executive Sedan'
];

export const FleetView = ({ cmsData, onSaveCMS, isSaving }: FleetViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<FleetItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [routeInput, setRouteInput] = useState('');

  const filteredFleet = cmsData.fleet.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (v: FleetItem) => {
    setEditingVehicle(JSON.parse(JSON.stringify(v)));
    setIsCreating(false);
  };

  const handleCreate = () => {
    const newV: FleetItem = {
      id: `fleet-${Date.now()}`,
      category: 'Premium SUV',
      name: 'Toyota Fortuner 4x4',
      capacity: '6 Guests + Driver',
      luggage: '4 Large Bags + 2 Small',
      idealRoutes: ['North Sikkim', 'Zero Point', 'Bhutan Grand Circuit'],
      baseRatePerDay: 6500,
      image: '/src/assets/images/fleet_innova_crysta_1790679963418.jpg',
      features: [
        'Dedicated Hill Chauffeur',
        'Dual AC & Mountain Heating',
        'Clean Sanitized Cabin',
        'All Inter-state Taxes & Fuel'
      ]
    };
    setEditingVehicle(newV);
    setIsCreating(true);
  };

  const handleDuplicate = (v: FleetItem) => {
    const dup: FleetItem = {
      ...JSON.parse(JSON.stringify(v)),
      id: `fleet-${Date.now()}`,
      name: `${v.name} (Copy)`
    };
    const updatedFleet = [...cmsData.fleet, dup];
    onSaveCMS({ ...cmsData, fleet: updatedFleet }, `Duplicated vehicle: ${v.name}`);
  };

  const handleDelete = (id: string) => {
    const updatedFleet = cmsData.fleet.filter(v => v.id !== id);
    onSaveCMS({ ...cmsData, fleet: updatedFleet }, `Deleted vehicle ID: ${id}`);
    setDeleteConfirmId(null);
  };

  const handleSave = async () => {
    if (!editingVehicle) return;
    if (!editingVehicle.name.trim()) {
      alert('Please provide a vehicle model name.');
      return;
    }

    let updatedFleet = [...cmsData.fleet];
    const idx = updatedFleet.findIndex(v => v.id === editingVehicle.id);
    if (idx >= 0) {
      updatedFleet[idx] = editingVehicle;
    } else {
      updatedFleet.push(editingVehicle);
    }

    await onSaveCMS({ ...cmsData, fleet: updatedFleet }, `Saved vehicle: ${editingVehicle.name}`);
    setEditingVehicle(null);
    setIsCreating(false);
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingVehicle) return;
    setEditingVehicle({
      ...editingVehicle,
      features: [...(editingVehicle.features || []), featureInput.trim()]
    });
    setFeatureInput('');
  };

  const removeFeature = (featIndex: number) => {
    if (!editingVehicle) return;
    setEditingVehicle({
      ...editingVehicle,
      features: editingVehicle.features.filter((_, i) => i !== featIndex)
    });
  };

  const addRoute = () => {
    if (!routeInput.trim() || !editingVehicle) return;
    setEditingVehicle({
      ...editingVehicle,
      idealRoutes: [...(editingVehicle.idealRoutes || []), routeInput.trim()]
    });
    setRouteInput('');
  };

  const removeRoute = (routeIndex: number) => {
    if (!editingVehicle) return;
    setEditingVehicle({
      ...editingVehicle,
      idealRoutes: editingVehicle.idealRoutes.filter((_, i) => i !== routeIndex)
    });
  };

  return (
    <div className="space-y-6">
      {editingVehicle ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f5f5f7]">
            <div>
              <button
                onClick={() => setEditingVehicle(null)}
                className="text-xs text-[#0071e3] hover:underline cursor-pointer block mb-1"
              >
                ← Back to Fleet List
              </button>
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                {isCreating ? 'Add New Vehicle' : `Edit: ${editingVehicle.name}`}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-4 py-2 text-xs transition-colors cursor-pointer border border-[#d2d2d7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Vehicle'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Model Name</label>
                <input
                  type="text"
                  value={editingVehicle.name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Category</label>
                <select
                  value={editingVehicle.category}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as FleetItem['category'] })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Passenger Capacity</label>
                  <input
                    type="text"
                    value={editingVehicle.capacity}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Luggage Allowance</label>
                  <input
                    type="text"
                    value={editingVehicle.luggage}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, luggage: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Daily Starting Base Rate (₹)</label>
                <input
                  type="number"
                  value={editingVehicle.baseRatePerDay}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, baseRatePerDay: Number(e.target.value) })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Vehicle Image URL</label>
                <input
                  type="text"
                  value={editingVehicle.image}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Ideal Mountain Routes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={routeInput}
                    onChange={(e) => setRouteInput(e.target.value)}
                    placeholder="Add a route (e.g. Darjeeling, Gangtok)..."
                    className="flex-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRoute();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addRoute}
                    className="px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-xs cursor-pointer hover:bg-neutral-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editingVehicle.idealRoutes?.map((r, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f5f5f7] rounded-lg text-[11px] text-[#1d1d1f]">
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => removeRoute(i)}
                        className="text-[#86868b] hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Features / Inclusions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature (e.g. Dual Climate Control)..."
                    className="flex-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-xs cursor-pointer hover:bg-neutral-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editingVehicle.features?.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f5f5f7] rounded-lg text-[11px] text-[#1d1d1f]">
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-[#86868b] hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                Fleet Management
              </h2>
              <p className="text-xs text-[#86868b]">
                Manage tourist taxi models, seat capacities, luggage allowances, and day rates.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 text-xs font-normal transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFleet.map((v) => (
              <div key={v.id} className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#0071e3] tracking-wider block">
                        {v.category}
                      </span>
                      <h3 className="text-base font-semibold text-[#1d1d1f]">
                        {v.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#1d1d1f] bg-white border border-[#e5e5ea] px-2.5 py-1 rounded-full">
                      ₹{v.baseRatePerDay.toLocaleString('en-IN')}/day
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6e6e73]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>{v.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>{v.luggage}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#86868b]">
                    <strong>Ideal for:</strong> {v.idealRoutes?.join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e5ea]">
                  <button
                    onClick={() => handleDuplicate(v)}
                    className="p-1.5 text-[#86868b] hover:bg-[#f5f5f7] rounded-lg cursor-pointer"
                    title="Duplicate vehicle"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(v)}
                    className="px-3 py-1.5 bg-white border border-[#d2d2d7] rounded-xl text-xs text-[#1d1d1f] hover:border-[#0071e3] cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(v.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#e5e5ea] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[#6e6e73]">
              Are you sure you want to remove this vehicle from your fleet directory?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-[#f5f5f7] text-xs text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
              >
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
