import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Compass, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { CRMLead, LeadStatus, LeadSource, LeadPriority, CRMMasterData } from '../../types/crm';
import { updateCRMLead, deleteCRMLead, createCRMLead } from '../../services/api';

interface LeadsViewProps {
  leads: CRMLead[];
  masterData: CRMMasterData;
  onCreateItineraryFromLead: (lead: CRMLead) => void;
  onRefreshLeads: () => void;
  userRole: 'admin' | 'agent';
  userName: string;
}

export const LeadsView = ({
  leads,
  masterData,
  onCreateItineraryFromLead,
  onRefreshLeads,
  userRole,
  userName
}: LeadsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Lead modal state
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<CRMLead | null>(null);

  // New lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('');
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>('Manual');
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>('New');
  const [newLeadPriority, setNewLeadPriority] = useState<LeadPriority>('Warm');
  const [newLeadStartDate, setNewLeadStartDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newLeadNights, setNewLeadNights] = useState(4);
  const [newLeadAdults, setNewLeadAdults] = useState(2);
  const [newLeadChildren, setNewLeadChildren] = useState(0);
  const [newLeadBudget, setNewLeadBudget] = useState('');
  const [newLeadDestination, setNewLeadDestination] = useState('Darjeeling & Gangtok Classical Circuit');
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [newLeadAgent, setNewLeadAgent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick note state in detail modal
  const [quickNote, setQuickNote] = useState('');

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.destinationInterest && lead.destinationInterest.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  // Pipeline stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const inProgressLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Proposal Sent').length;
  const confirmedLeads = leads.filter(l => l.status === 'Confirmed').length;

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) {
      alert('Guest name and phone number are required');
      return;
    }

    setIsSubmitting(true);
    const assignedAgentObj = masterData.users.find(u => u.id === newLeadAgent);

    try {
      await createCRMLead({
        name: newLeadName.trim(),
        phone: newLeadPhone.trim(),
        email: newLeadEmail.trim(),
        city: newLeadCity.trim(),
        source: newLeadSource,
        status: newLeadStatus,
        priority: newLeadPriority,
        travelStartDate: newLeadStartDate,
        durationNights: newLeadNights,
        durationDays: newLeadNights + 1,
        adults: newLeadAdults,
        children: newLeadChildren,
        infants: 0,
        budget: newLeadBudget,
        destinationInterest: newLeadDestination,
        notes: newLeadNotes,
        assignedAgentId: assignedAgentObj?.id || '',
        assignedAgentName: assignedAgentObj?.name || 'Unassigned'
      });

      setIsNewLeadModalOpen(false);
      onRefreshLeads();
      // Reset form
      setNewLeadName('');
      setNewLeadPhone('');
      setNewLeadEmail('');
      setNewLeadCity('');
      setNewLeadNotes('');
      setNewLeadBudget('');
    } catch (err: any) {
      alert(err?.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateCRMLead(leadId, { status: newStatus });
      onRefreshLeads();
      if (selectedLeadForDetail?.id === leadId) {
        setSelectedLeadForDetail(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleAddTimelineNote = async (leadId: string) => {
    if (!quickNote.trim()) return;
    try {
      const res = await updateCRMLead(leadId, {
        newHistoryNote: quickNote.trim(),
        newHistoryAction: 'Note Added'
      });
      setQuickNote('');
      if (res && res.lead) {
        setSelectedLeadForDetail(res.lead);
      }
      onRefreshLeads();
    } catch (err: any) {
      alert(err?.message || 'Failed to add note');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead? This action is strictly restricted to Admin.')) return;
    try {
      await deleteCRMLead(leadId);
      setSelectedLeadForDetail(null);
      onRefreshLeads();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete lead');
    }
  };

  const getSourceBadgeColor = (source: LeadSource) => {
    switch (source) {
      case 'WhatsApp': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Google Ads': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Facebook/Instagram': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Website Form': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusBadgeColor = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-600 text-white';
      case 'Contacted': return 'bg-sky-100 text-sky-800';
      case 'Proposal Sent': return 'bg-indigo-100 text-indigo-800';
      case 'Follow Up': return 'bg-amber-100 text-amber-800';
      case 'Confirmed': return 'bg-emerald-600 text-white';
      case 'Lost': return 'bg-neutral-200 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Travel Agency Lead Pipeline</span>
            <span className="text-xs bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full">
              {totalLeads} Total
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time inquiries captured from Website Forms, WhatsApp clicks, Google Ads, FB/Insta, and Manual Agent entry.
          </p>
        </div>

        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add New Lead</span>
        </button>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">New Inquiries</span>
            <span className="text-2xl font-black text-blue-600 block mt-0.5">{newLeads}</span>
          </div>
          <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            ★
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-black text-amber-600 block mt-0.5">{inProgressLeads}</span>
          </div>
          <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
            ⚡
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Confirmed Tours</span>
            <span className="text-2xl font-black text-emerald-600 block mt-0.5">{confirmedLeads}</span>
          </div>
          <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
            ✓
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Assigned To</span>
            <span className="text-sm font-bold text-neutral-900 block mt-1 line-clamp-1">{userName}</span>
            <span className="text-[10px] text-neutral-400 capitalize">{userRole} view</span>
          </div>
          <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
            👤
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest name, phone, city, or destination..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 px-3 rounded-xl border border-neutral-200 bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="p-1.5 px-3 rounded-xl border border-neutral-200 bg-white font-medium"
          >
            <option value="all">All Sources</option>
            <option value="Website Form">Website Form</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Facebook/Instagram">FB/Instagram</option>
            <option value="Manual">Manual</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-1.5 px-3 rounded-xl border border-neutral-200 bg-white font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
        </div>
      </div>

      {/* Leads List / Cards */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-2">
            <Users className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No leads match your filter criteria.</p>
            <p className="text-xs text-neutral-400">Clear filters or click "+ Add New Lead" to create a manual lead.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Hi ${lead.name}, greetings from Spiky Cabs & Himalayan Travels! I am following up on your tour query for ${lead.destinationInterest}. When would be a good time to share your customized itinerary?`
            )}`;

            return (
              <div 
                key={lead.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 hover:border-blue-400 transition-all shadow-xs space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="font-bold text-neutral-950 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {lead.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSourceBadgeColor(lead.source)}`}>
                          {lead.source}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        {lead.priority === 'Hot' && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-md">
                            🔥 Hot
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{lead.phone}</span>
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            <span>{lead.email}</span>
                          </span>
                        )}
                        {lead.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            <span>{lead.city}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this lead */}
                  <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onCreateItineraryFromLead(lead)}
                      className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Create Itinerary</span>
                    </button>

                    <button
                      onClick={() => setSelectedLeadForDetail(lead)}
                      className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lead Summary Row */}
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{lead.destinationInterest}</span>
                    <span>·</span>
                    <span>{lead.durationNights}N/{lead.durationDays}D</span>
                    <span>·</span>
                    <span>{lead.adults} Adults {lead.children > 0 ? `+ ${lead.children} Kids` : ''}</span>
                    <span>·</span>
                    <span>Start: {lead.travelStartDate}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                    <span>Assigned: <strong>{lead.assignedAgentName || 'Unassigned'}</strong></span>
                    <span>·</span>
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* "+ New Lead" Manual Creation Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Manual Lead Entry</span>
              </h3>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="e.g. Rahul Mukherjee"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="e.g. +91 98320 12345"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="e.g. guest@outlook.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Origin City</label>
                  <input
                    type="text"
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="e.g. Mumbai, Kolkata, Bengaluru"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Lead Source</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="Manual">Manual</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook/Instagram">FB/Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Priority</label>
                  <select
                    value={newLeadPriority}
                    onChange={(e) => setNewLeadPriority(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Warm">⚡ Warm</option>
                    <option value="Cold">❄ Cold</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Status</label>
                  <select
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeadStartDate}
                    onChange={(e) => setNewLeadStartDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Nights</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newLeadNights}
                    onChange={(e) => setNewLeadNights(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={newLeadAdults}
                    onChange={(e) => setNewLeadAdults(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Destination Circuit Interest</label>
                <input
                  type="text"
                  value={newLeadDestination}
                  onChange={(e) => setNewLeadDestination(e.target.value)}
                  placeholder="e.g. Darjeeling 2N + Gangtok 2N + North Sikkim 2N"
                  className="w-full text-xs p-2 rounded-xl border border-neutral-300"
                />
              </div>

              {userRole === 'admin' && (
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Assign Agent</label>
                  <select
                    value={newLeadAgent}
                    onChange={(e) => setNewLeadAgent(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white font-medium"
                  >
                    <option value="">-- Unassigned --</option>
                    {masterData.users.filter(u => u.isActive).map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Guest Notes & Special Requests</label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="e.g. Needs child car seat, ground floor hotel room, interested in paragliding"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail & Timeline Modal */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{selectedLeadForDetail.name}</h3>
                <p className="text-xs text-neutral-500">Lead #{selectedLeadForDetail.id} · Source: {selectedLeadForDetail.source}</p>
              </div>
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-600">Update Status:</span>
              {(['New', 'Contacted', 'Proposal Sent', 'Follow Up', 'Confirmed', 'Lost'] as LeadStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(selectedLeadForDetail.id, st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedLeadForDetail.status === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Tour & Contact Info */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 text-xs">
              <div>
                <span className="text-neutral-500 block">Phone:</span>
                <span className="font-bold text-neutral-900">{selectedLeadForDetail.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Email:</span>
                <span className="font-semibold text-neutral-900">{selectedLeadForDetail.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Travel Date:</span>
                <span className="font-bold text-neutral-900">{selectedLeadForDetail.travelStartDate} ({selectedLeadForDetail.durationNights}N/{selectedLeadForDetail.durationDays}D)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Assigned Agent:</span>
                <span className="font-bold text-blue-700">{selectedLeadForDetail.assignedAgentName || 'Unassigned'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block">Interest:</span>
                <span className="font-semibold text-neutral-800">{selectedLeadForDetail.destinationInterest}</span>
              </div>
              {selectedLeadForDetail.notes && (
                <div className="col-span-2 pt-1 border-t border-neutral-200">
                  <span className="text-neutral-500 block">Initial Notes:</span>
                  <p className="text-neutral-700 mt-0.5">{selectedLeadForDetail.notes}</p>
                </div>
              )}
            </div>

            {/* Timeline & Activity History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Activity History & Agent Notes</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedLeadForDetail.history || []).map((h) => (
                  <div key={h.id} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-0.5">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500">
                      <span className="font-bold text-neutral-800">{h.action} · by {h.author}</span>
                      <span>{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-700 leading-snug">{h.note}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Log a call, WhatsApp reply, or client request..."
                  className="flex-1 text-xs p-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTimelineNote(selectedLeadForDetail.id);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddTimelineNote(selectedLeadForDetail.id)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              {userRole === 'admin' ? (
                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLeadForDetail.id)}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Lead</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const lead = selectedLeadForDetail;
                    setSelectedLeadForDetail(null);
                    onCreateItineraryFromLead(lead);
                  }}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Build Itinerary for {selectedLeadForDetail.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
