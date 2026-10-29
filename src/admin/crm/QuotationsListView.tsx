import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  Car, 
  Printer, 
  MessageCircle, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Plus,
  FileDown
} from 'lucide-react';
import { CRMItinerary } from '../../types/crm';
import { fetchCRMItineraries, deleteCRMItinerary } from '../../services/api';
import { QuotationModal } from './QuotationModal';
import { downloadQuotationPDF } from '../../utils/quotationPdf';

interface QuotationsListViewProps {
  onOpenBuilder: () => void;
  userRole: 'admin' | 'agent';
}

export const QuotationsListView = ({ onOpenBuilder, userRole }: QuotationsListViewProps) => {
  const [itineraries, setItineraries] = useState<CRMItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState<CRMItinerary | null>(null);

  const loadItineraries = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCRMItineraries();
      setItineraries(data || []);
    } catch (err) {
      console.warn('Failed to fetch itineraries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItineraries();
  }, []);

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete quotation for ${guestName}?`)) return;
    try {
      await deleteCRMItinerary(id);
      setItineraries(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    }
  };

  const filtered = itineraries.filter(i => 
    i.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.guestPhone.includes(searchTerm) ||
    (i.assignedAgentName && i.assignedAgentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Generated Quotations & Proposals</span>
            <span className="text-xs bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full">
              {itineraries.length}
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            View, share to guest WhatsApp, or print/export PDF quotations.
          </p>
        </div>

        <button
          onClick={onOpenBuilder}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create New Quotation</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest name, phone, or agent..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-3xl border border-neutral-200">
          Loading quotations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
          <FileText className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="text-sm font-semibold text-neutral-700">No quotations found.</p>
          <p className="text-xs text-neutral-400">Click "+ Create New Quotation" to build your first client proposal.</p>
          <button
            onClick={onOpenBuilder}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            Open Itinerary Builder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((itin) => {
            const cleanPhone = itin.guestPhone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Hi ${itin.guestName}, here is your Spiky Cabs & Himalayan Travels tour quotation for ${itin.durationNights}N/${itin.durationDays}D: ₹${itin.pricing.grandTotal.toLocaleString('en-IN')} (All inclusive). Please let us know if you would like any customizations!`
            )}`;

            return (
              <div 
                key={itin.id}
                className="bg-white rounded-3xl p-5 border border-neutral-200 hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{itin.guestName}</h3>
                      <span className="text-xs text-neutral-500">{itin.guestPhone}</span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {itin.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <strong className="text-neutral-900">{itin.durationNights}N / {itin.durationDays}D</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <strong className="text-neutral-900 line-clamp-1">{itin.vehicleName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Travel Date:</span>
                      <strong className="text-neutral-900">{itin.travelStartDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-neutral-500">Quotation Total:</span>
                    <span className="text-xl font-black text-emerald-600">
                      ₹{itin.pricing.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                      title="Send on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => downloadQuotationPDF(itin)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Download PDF Quotation directly"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedItinerary(itin)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </div>

                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(itin.id, itin.guestName)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete quotation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quotation Preview Modal */}
      {selectedItinerary && (
        <QuotationModal
          itinerary={selectedItinerary}
          isOpen={Boolean(selectedItinerary)}
          onClose={() => setSelectedItinerary(null)}
          onStatusChange={(id, status) => {
            setItineraries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
          }}
        />
      )}
    </div>
  );
};
