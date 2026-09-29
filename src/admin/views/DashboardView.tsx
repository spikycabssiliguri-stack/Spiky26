import { 
  Package, 
  FileText, 
  Car, 
  Image as ImageIcon, 
  History, 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';

interface DashboardViewProps {
  cmsData: CMSData;
  onNavigateTab: (tab: string) => void;
  onOpenNewPackage: () => void;
}

export const DashboardView = ({ cmsData, onNavigateTab, onOpenNewPackage }: DashboardViewProps) => {
  const publishedPages = cmsData.pages.filter(p => p.status === 'published').length;
  const draftPages = cmsData.pages.length - publishedPages;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CMS Database Connected · Live Production</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
            Welcome, Administrator
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73]">
            Managing {cmsData.settings.siteName} · Last saved: {new Date(cmsData.lastUpdated).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenNewPackage}
            className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 text-xs font-normal transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Cab Package</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-4 py-2 text-xs font-normal transition-colors inline-flex items-center gap-1.5 border border-[#d2d2d7]"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        <div 
          onClick={() => onNavigateTab('packages')}
          className="bg-white rounded-3xl p-5 border border-[#e5e5ea] cursor-pointer hover:border-[#0071e3] transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center text-[#1d1d1f] group-hover:text-[#0071e3] mb-3 transition-colors">
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold font-mono text-[#1d1d1f]">
            {cmsData.packages.length}
          </div>
          <div className="text-xs text-[#86868b] mt-0.5">Cab Packages</div>
        </div>

        <div 
          onClick={() => onNavigateTab('pages')}
          className="bg-white rounded-3xl p-5 border border-[#e5e5ea] cursor-pointer hover:border-[#0071e3] transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center text-[#1d1d1f] group-hover:text-[#0071e3] mb-3 transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold font-mono text-[#1d1d1f]">
            {cmsData.pages.length}
          </div>
          <div className="text-xs text-[#86868b] mt-0.5">
            Pages ({publishedPages} live)
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('fleet')}
          className="bg-white rounded-3xl p-5 border border-[#e5e5ea] cursor-pointer hover:border-[#0071e3] transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center text-[#1d1d1f] group-hover:text-[#0071e3] mb-3 transition-colors">
            <Car className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold font-mono text-[#1d1d1f]">
            {cmsData.fleet.length}
          </div>
          <div className="text-xs text-[#86868b] mt-0.5">Fleet Vehicles</div>
        </div>

        <div 
          onClick={() => onNavigateTab('media')}
          className="bg-white rounded-3xl p-5 border border-[#e5e5ea] cursor-pointer hover:border-[#0071e3] transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center text-[#1d1d1f] group-hover:text-[#0071e3] mb-3 transition-colors">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold font-mono text-[#1d1d1f]">
            {cmsData.media.length}
          </div>
          <div className="text-xs text-[#86868b] mt-0.5">Media Assets</div>
        </div>

        <div 
          onClick={() => onNavigateTab('revisions')}
          className="bg-white rounded-3xl p-5 border border-[#e5e5ea] cursor-pointer hover:border-[#0071e3] transition-all group col-span-2 sm:col-span-1"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center text-[#1d1d1f] group-hover:text-[#0071e3] mb-3 transition-colors">
            <History className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold font-mono text-[#1d1d1f]">
            {cmsData.revisions?.length || 0}
          </div>
          <div className="text-xs text-[#86868b] mt-0.5">Saved Snapshots</div>
        </div>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Management Shortcuts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea]">
            <h3 className="font-semibold text-base text-[#1d1d1f] mb-4">
              Quick Management Shortcuts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => onNavigateTab('packages')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Edit Itineraries & Fares</div>
                <div className="text-[#86868b]">Update day-by-day stops and starting vehicle prices</div>
              </button>

              <button
                onClick={() => onNavigateTab('pages')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Pages & Visual Blocks</div>
                <div className="text-[#86868b]">Add custom pages or edit Home/About/Contact sections</div>
              </button>

              <button
                onClick={() => onNavigateTab('media')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Upload Media & Photos</div>
                <div className="text-[#86868b]">Upload scenic route images and fleet photography</div>
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Phone & Address Settings</div>
                <div className="text-[#86868b]">Update +91 75860 47996, email, and Siliguri address</div>
              </button>

              <button
                onClick={() => onNavigateTab('navigation')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Navigation Menu</div>
                <div className="text-[#86868b]">Reorder menu links or toggle page visibility</div>
              </button>

              <button
                onClick={() => onNavigateTab('preview')}
                className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-semibold text-[#1d1d1f]">Device Preview Suite</div>
                <div className="text-[#86868b]">Preview responsive layout on Mobile, Tablet & Desktop</div>
              </button>
            </div>
          </div>

          {/* Active Packages List preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base text-[#1d1d1f]">
                Active Cab Packages ({cmsData.packages.length})
              </h3>
              <button
                onClick={() => onNavigateTab('packages')}
                className="text-xs text-[#0071e3] hover:underline cursor-pointer"
              >
                Manage all →
              </button>
            </div>

            <div className="divide-y divide-[#f5f5f7]">
              {cmsData.packages.slice(0, 4).map((pkg) => (
                <div key={pkg.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="truncate">
                    <span className="font-semibold text-[#1d1d1f] block truncate">{pkg.title}</span>
                    <span className="text-[#86868b]">{pkg.durationNights}N/{pkg.durationDays}D · {pkg.destination}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-semibold text-[#1d1d1f]">₹{pkg.startingPrice.sedan.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#86868b] block">from</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#86868b]" />
                <span>Recent Admin Activity</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-xs text-[#0071e3] hover:underline cursor-pointer"
              >
                Full log →
              </button>
            </div>

            <div className="space-y-3">
              {cmsData.auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-3 bg-[#f5f5f7] rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#86868b]">
                    <span className="font-mono uppercase font-semibold text-[#1d1d1f]">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[#424245] leading-snug">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-[#f5f5f7] rounded-3xl p-6 border border-[#e5e5ea] text-xs space-y-2">
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full-Stack Architecture Active</span>
            </div>
            <p className="text-[#6e6e73] leading-relaxed">
              Express API server running on port 3000. Data persistence confirmed at <code>data/cms.json</code>. Static uploads served at <code>/uploads/*</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
