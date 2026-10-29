import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Car, 
  Image as ImageIcon, 
  Compass, 
  Settings, 
  History, 
  LogOut, 
  ExternalLink, 
  Save, 
  Eye, 
  Menu, 
  X, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  Users,
  Sliders,
  DollarSign,
  Send,
  Briefcase,
  Lock
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { DashboardView } from './views/DashboardView';
import { PagesView } from './views/PagesView';
import { PackagesView } from './views/PackagesView';
import { FleetView } from './views/FleetView';
import { MediaLibraryView } from './views/MediaLibraryView';
import { NavigationFooterView } from './views/NavigationFooterView';
import { SettingsSeoView } from './views/SettingsSeoView';
import { AuditRevisionsView } from './views/AuditRevisionsView';
import { PreviewModal } from './PreviewModal';
import { AIAssistantModal } from './AIAssistantModal';

// CRM Views & Types
import { LeadsView } from './crm/LeadsView';
import { ItineraryBuilderView } from './crm/ItineraryBuilderView';
import { MasterDataView } from './crm/MasterDataView';
import { QuotationsListView } from './crm/QuotationsListView';
import { CRMLead, CRMMasterData } from '../types/crm';
import { getDefaultCRMMasterData, DEFAULT_CRM_LEADS } from '../data/defaultCRMData';
import { getDefaultCMSData, CMSData } from '../data/defaultCMSData';
import { 
  fetchAdminContent, 
  saveAdminContent,
  fetchCRMMaster,
  fetchCRMLeads
} from '../services/api';

export type AdminTab = 
  // CRM Tabs:
  | 'crm-leads' 
  | 'crm-builder' 
  | 'crm-quotations' 
  | 'crm-master'
  // CMS Tabs:
  | 'dashboard' 
  | 'pages' 
  | 'packages' 
  | 'fleet' 
  | 'media' 
  | 'navigation' 
  | 'settings' 
  | 'revisions';

interface AdminAppProps {
  initialCrmMode?: boolean;
}

export const AdminApp = ({ initialCrmMode = false }: AdminAppProps) => {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  
  // App Mode: 'crm' for Travel Agency CRM or 'cms' for Website CMS
  const isAgent = user?.role === 'agent';
  const [appMode, setAppMode] = useState<'crm' | 'cms'>(() => {
    if (initialCrmMode || isAgent) return 'crm';
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#crm')) return 'crm';
    return 'cms';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#crm-builder') return 'crm-builder';
    if (hash === '#crm-quotations') return 'crm-quotations';
    if (hash === '#crm-master') return 'crm-master';
    if (hash === '#crm-leads' || hash === '#crm' || hash.startsWith('#/crm')) return 'crm-leads';
    if (initialCrmMode || isAgent) return 'crm-leads';
    return 'dashboard';
  });

  // CMS State
  const [cmsData, setCmsData] = useState<CMSData>(getDefaultCMSData());
  const [isFetchingCMS, setIsFetchingCMS] = useState(true);
  const [isSavingCMS, setIsSavingCMS] = useState(false);

  // CRM State
  const [crmMasterData, setCrmMasterData] = useState<CRMMasterData>(getDefaultCRMMasterData());
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(DEFAULT_CRM_LEADS);
  const [selectedLeadForBuilder, setSelectedLeadForBuilder] = useState<CRMLead | null>(null);
  const [isFetchingCRM, setIsFetchingCRM] = useState(true);

  // UI State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync mode if agent signs in
  useEffect(() => {
    if (isAgent && appMode !== 'crm') {
      setAppMode('crm');
      setActiveTab('crm-leads');
    }
  }, [isAgent, appMode]);

  // Load CMS Data
  const loadCMSData = async () => {
    setIsFetchingCMS(true);
    try {
      const data = await fetchAdminContent();
      if (data && data.settings) {
        setCmsData(prev => ({
          ...prev,
          ...data,
          settings: { ...prev.settings, ...(data.settings || {}) },
          media: Array.isArray(data.media) && data.media.length > 0 ? data.media : (prev.media || []),
          auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs : (prev.auditLogs || []),
          revisions: Array.isArray(data.revisions) ? data.revisions : (prev.revisions || []),
          packages: Array.isArray(data.packages) && data.packages.length > 0 ? data.packages : prev.packages,
          fleet: Array.isArray(data.fleet) && data.fleet.length > 0 ? data.fleet : prev.fleet,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch server CMS, using defaults:', err);
    } finally {
      setIsFetchingCMS(false);
    }
  };

  // Load CRM Data (Master Data & Leads)
  const loadCRMData = async () => {
    setIsFetchingCRM(true);
    try {
      const [master, leads] = await Promise.all([
        fetchCRMMaster().catch(() => null),
        fetchCRMLeads().catch(() => null)
      ]);
      if (master && master.destinations) {
        setCrmMasterData(master);
      }
      if (Array.isArray(leads) && leads.length > 0) {
        setCrmLeads(leads);
      }
    } catch (err) {
      console.warn('Could not fetch server CRM data, using defaults:', err);
    } finally {
      setIsFetchingCRM(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCMSData();
      loadCRMData();
    }
  }, [isAuthenticated]);

  const handleSaveCMS = async (updated: CMSData, summary: string = 'Updated CMS content') => {
    setIsSavingCMS(true);
    try {
      await saveAdminContent(updated, summary);
      setCmsData(updated);
      showToast(`Saved: ${summary}`);
    } catch (err: any) {
      console.error('Save CMS error:', err);
      alert(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSavingCMS(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#86868b]">Loading Spiky Cabs Admin & CRM...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const userRole = (user?.role === 'agent' ? 'agent' : 'admin') as 'admin' | 'agent';

  // Navigation Menus
  const crmMenuItems: { id: AdminTab; label: string; icon: any; count?: number; adminOnly?: boolean }[] = [
    { id: 'crm-leads', label: 'Lead Management', icon: Users, count: crmLeads.length },
    { id: 'crm-builder', label: 'Itinerary Builder', icon: Compass },
    { id: 'crm-quotations', label: 'Quotations & Rates', icon: FileText },
    { id: 'crm-master', label: 'CRM Master Data', icon: Sliders, adminOnly: true },
  ];

  const cmsMenuItems: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pages', label: 'Pages & Blocks', icon: FileText, count: cmsData.pages.length },
    { id: 'packages', label: 'Cab Packages', icon: Package, count: cmsData.packages.length },
    { id: 'fleet', label: 'Fleet Vehicles', icon: Car, count: cmsData.fleet.length },
    { id: 'media', label: 'Media Library', icon: ImageIcon, count: cmsData.media.length },
    { id: 'navigation', label: 'Menu & Footer', icon: Compass },
    { id: 'settings', label: 'Settings & SEO', icon: Settings },
    { id: 'revisions', label: 'Audit & History', icon: History, count: cmsData.revisions?.length }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1d1f] text-white px-5 py-3 rounded-full text-xs font-normal shadow-2xl flex items-center gap-2.5 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-[#e5e5ea] flex flex-col justify-between z-40 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                appMode === 'crm' ? 'bg-[#0071e3] text-white' : 'bg-[#1d1d1f] text-white'
              }`}>
                {appMode === 'crm' ? 'CRM' : 'SC'}
              </div>
              <div>
                <span className="font-semibold text-sm text-[#1d1d1f] tracking-tight block">
                  {appMode === 'crm' ? 'Spiky Travel CRM' : 'Spiky Cabs CMS'}
                </span>
                <span className="text-[10px] text-[#86868b] block flex items-center gap-1">
                  {userRole === 'admin' ? (
                    <span className="text-blue-600 font-medium">Administrator</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Agent Portal</span>
                  )}
                  <span>· {user?.username}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-[#86868b] hover:text-[#1d1d1f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Pill (Admins only; agents locked to CRM) */}
          {!isAgent ? (
            <div className="bg-[#f5f5f7] p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => {
                  setAppMode('crm');
                  setActiveTab('crm-leads');
                  window.location.hash = 'crm-leads';
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  appMode === 'crm'
                    ? 'bg-white text-[#0071e3] shadow-xs'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Travel CRM</span>
              </button>
              <button
                onClick={() => {
                  setAppMode('cms');
                  setActiveTab('dashboard');
                  window.location.hash = 'admin';
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  appMode === 'cms'
                    ? 'bg-white text-[#1d1d1f] shadow-xs'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Website CMS</span>
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">Agent Access Active</p>
                <p className="text-[10px] text-emerald-700">Pre-approved rates & quotes enabled</p>
              </div>
            </div>
          )}

          {/* CRM Navigation Group */}
          {appMode === 'crm' && (
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#86868b] uppercase">
                Travel Operations
              </div>
              <nav className="space-y-1 text-xs">
                {crmMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        window.location.hash = item.id;
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#0071e3] text-white font-medium shadow-xs'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.adminOnly && userRole === 'agent' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono">
                            View
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span 
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Direct Link to Master Rates for Fast Access */}
              <div className="pt-3 border-t border-[#f5f5f7]">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-blue-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Preloaded Rates Active</span>
                  </div>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Darjeeling (₹3.5k/₹5k), Sikkim (₹4k/₹6k), Nathula (₹1k/₹3k pp), Half Day (₹2.5k/₹3.5k).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CMS Navigation Group */}
          {appMode === 'cms' && !isAgent && (
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#86868b] uppercase">
                Content Management
              </div>
              <nav className="space-y-1 text-xs">
                {cmsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#1d1d1f] text-white font-medium shadow-xs'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span 
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#f5f5f7] space-y-2 text-xs">
          {appMode === 'cms' && !isAgent && (
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50/80 hover:bg-sky-100 text-sky-800 font-medium cursor-pointer transition-colors border border-sky-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Gemini AI Assistant</span>
            </button>
          )}

          {appMode === 'cms' && !isAgent && (
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-normal cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Device Preview</span>
            </button>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f] font-normal cursor-pointer transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
          </a>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#86868b]">
            <div className="truncate pr-2">
              <span className="font-medium text-[#1d1d1f] block truncate">{user?.username}</span>
              <span className="text-[10px] text-[#a1a1a6] block truncate capitalize">{user?.role || 'Admin'}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl border-b border-[#e5e5ea] px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">
                  {appMode === 'crm' ? 'Travel Agency CRM · /crm' : 'Spiky Cabs CMS · /admin'}
                </span>
                {appMode === 'crm' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Live Rates & Booking Engine
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">
                {appMode === 'crm' 
                  ? crmMenuItems.find(i => i.id === activeTab)?.label 
                  : cmsMenuItems.find(i => i.id === activeTab)?.label
                }
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Top Switcher in header for convenience */}
            {!isAgent && (
              <div className="hidden md:flex items-center bg-[#f5f5f7] p-1 rounded-full border border-[#e5e5ea] text-xs">
                <button
                  onClick={() => {
                    setAppMode('crm');
                    setActiveTab('crm-leads');
                    window.location.hash = 'crm-leads';
                  }}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    appMode === 'crm'
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  💼 CRM & Itinerary
                </button>
                <button
                  onClick={() => {
                    setAppMode('cms');
                    setActiveTab('dashboard');
                    window.location.hash = 'admin';
                  }}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    appMode === 'cms'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  🌐 Website CMS
                </button>
              </div>
            )}

            {appMode === 'crm' && activeTab !== 'crm-builder' && (
              <button
                onClick={() => {
                  setSelectedLeadForBuilder(null);
                  setActiveTab('crm-builder');
                }}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-3.5 py-1.5 text-xs font-normal transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Itinerary</span>
              </button>
            )}

            {appMode === 'cms' && !isAgent && (
              <>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-xs text-[#1d1d1f] cursor-pointer border border-[#d2d2d7]"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleSaveCMS(cmsData, 'Quick publish from top bar')}
                  disabled={isSavingCMS}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 text-xs font-normal transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingCMS ? 'Publishing...' : 'Save & Publish'}</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* View Component Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {/* CRM Views */}
          {activeTab === 'crm-leads' && (
            <LeadsView 
              leads={crmLeads}
              masterData={crmMasterData}
              onCreateItineraryFromLead={(lead) => {
                setSelectedLeadForBuilder(lead);
                setActiveTab('crm-builder');
                window.location.hash = 'crm-builder';
              }}
              onRefreshLeads={loadCRMData}
              userRole={userRole}
              userName={user?.username || ''}
            />
          )}

          {activeTab === 'crm-builder' && (
            <ItineraryBuilderView 
              masterData={crmMasterData}
              initialLead={selectedLeadForBuilder}
              onClearInitialLead={() => setSelectedLeadForBuilder(null)}
              onItinerarySaved={(itinerary) => {
                showToast(`Quotations ready for ${itinerary.guestName}`);
                setActiveTab('crm-quotations');
                window.location.hash = 'crm-quotations';
              }}
              userRole={userRole}
              userName={user?.username || ''}
            />
          )}

          {activeTab === 'crm-quotations' && (
            <QuotationsListView 
              onOpenBuilder={() => {
                setSelectedLeadForBuilder(null);
                setActiveTab('crm-builder');
                window.location.hash = 'crm-builder';
              }}
              userRole={userRole}
            />
          )}

          {activeTab === 'crm-master' && (
            <MasterDataView 
              masterData={crmMasterData}
              onRefreshMaster={loadCRMData}
              userRole={userRole}
            />
          )}

          {/* CMS Views */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              cmsData={cmsData} 
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
              onOpenNewPackage={() => setActiveTab('packages')}
            />
          )}

          {activeTab === 'pages' && (
            <PagesView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSavingCMS} 
            />
          )}

          {activeTab === 'packages' && (
            <PackagesView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSavingCMS} 
            />
          )}

          {activeTab === 'fleet' && (
            <FleetView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSavingCMS} 
            />
          )}

          {activeTab === 'media' && (
            <MediaLibraryView 
              cmsData={cmsData} 
              onRefreshCMS={loadCMSData}
              onSaveCMS={handleSaveCMS}
              isSaving={isSavingCMS}
            />
          )}

          {activeTab === 'navigation' && (
            <NavigationFooterView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSavingCMS} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSeoView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSavingCMS} 
            />
          )}

          {activeTab === 'revisions' && (
            <AuditRevisionsView 
              cmsData={cmsData} 
              onRefreshCMS={loadCMSData}
            />
          )}
        </main>
      </div>

      {/* Device Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        cmsData={cmsData}
      />

      {/* AI Assistant Modal for CMS */}
      <AIAssistantModal 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};
