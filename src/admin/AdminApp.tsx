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
  ChevronRight
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
import { getDefaultCMSData, CMSData } from '../data/defaultCMSData';
import { fetchAdminContent, saveAdminContent } from '../services/api';

type AdminTab = 
  | 'dashboard' 
  | 'pages' 
  | 'packages' 
  | 'fleet' 
  | 'media' 
  | 'navigation' 
  | 'settings' 
  | 'revisions';

export const AdminApp = () => {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [cmsData, setCmsData] = useState<CMSData>(getDefaultCMSData());
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsFetchingData(true);
    try {
      const data = await fetchAdminContent();
      if (data && data.settings) {
        setCmsData(data);
      }
    } catch (err) {
      console.warn('Could not fetch server CMS, using defaults:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleSaveCMS = async (updated: CMSData, summary: string = 'Updated CMS content') => {
    setIsSaving(true);
    try {
      await saveAdminContent(updated, summary);
      setCmsData(updated);
      setHasUnsavedChanges(false);
      showToast(`Saved: ${summary}`);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#86868b]">Loading Spiky Cabs CMS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const navMenuItems: { id: AdminTab; label: string; icon: any; count?: number }[] = [
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
        <div className="p-5 space-y-6">
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                SC
              </div>
              <div>
                <span className="font-semibold text-sm text-[#1d1d1f] tracking-tight block">
                  Spiky Cabs CMS
                </span>
                <span className="text-[10px] text-[#86868b] block">
                  Admin Control Panel
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

          {/* Nav List */}
          <nav className="space-y-1 text-xs">
            {navMenuItems.map((item) => {
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
                      ? 'bg-[#0071e3] text-white font-medium shadow-xs'
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

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#f5f5f7] space-y-2 text-xs">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-normal cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Device Preview</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f] font-normal cursor-pointer transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
          </a>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#86868b]">
            <div className="truncate pr-2">
              <span className="font-medium text-[#1d1d1f] block truncate">{user?.username}</span>
              <span className="text-[10px] text-[#a1a1a6] block truncate">{user?.email}</span>
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
        <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.85)] backdrop-blur-2xl border-b border-[#e5e5ea] px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider block">
                Spiky Cabs CMS · /admin
              </span>
              <h1 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">
                {navMenuItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-xs text-[#1d1d1f] cursor-pointer border border-[#d2d2d7]"
            >
              <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleSaveCMS(cmsData, 'Quick publish from top bar')}
              disabled={isSaving}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-1.5 text-xs font-normal transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
            </button>
          </div>
        </header>

        {/* View Component Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
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
              isSaving={isSaving} 
            />
          )}

          {activeTab === 'packages' && (
            <PackagesView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSaving} 
            />
          )}

          {activeTab === 'fleet' && (
            <FleetView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSaving} 
            />
          )}

          {activeTab === 'media' && (
            <MediaLibraryView 
              cmsData={cmsData} 
              onRefreshCMS={loadData}
              onSaveCMS={handleSaveCMS}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'navigation' && (
            <NavigationFooterView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSaving} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSeoView 
              cmsData={cmsData} 
              onSaveCMS={handleSaveCMS} 
              isSaving={isSaving} 
            />
          )}

          {activeTab === 'revisions' && (
            <AuditRevisionsView 
              cmsData={cmsData} 
              onRefreshCMS={loadData}
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
    </div>
  );
};
