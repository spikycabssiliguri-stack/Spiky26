import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  KeyRound, 
  Check, 
  FileCode, 
  Download, 
  Eye, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';
import { useAdminAuth } from '../AdminAuthContext';
import { ImagePicker } from '../../components/ImagePicker';

interface SettingsSeoViewProps {
  cmsData: CMSData;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

export const SettingsSeoView = ({ cmsData, onSaveCMS, isSaving }: SettingsSeoViewProps) => {
  const { changePassword } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'security'>('general');

  // General settings state
  const [settings, setSettings] = useState(cmsData.settings);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sitemap preview modal state
  const [showSitemap, setShowSitemap] = useState(false);

  const handleSaveSettings = async () => {
    await onSaveCMS({
      ...cmsData,
      settings
    }, 'Updated general website settings and SEO tags');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Generate sitemap XML string
  const generateSitemapXml = () => {
    const baseUrl = 'https://spikycabs.in';
    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      ...cmsData.pages
        .filter(p => p.status === 'published')
        .map(p => ({
          loc: `${baseUrl}/#${p.slug}`,
          priority: '0.8',
          changefreq: 'weekly'
        })),
      ...cmsData.packages.map(p => ({
        loc: `${baseUrl}/#packages`,
        priority: '0.9',
        changefreq: 'weekly'
      }))
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach(u => {
      xml += `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  };

  const downloadSitemap = () => {
    const xml = generateSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Settings & SEO Configuration
            </h2>
            <p className="text-xs text-[#86868b]">
              Configure contact numbers, Siliguri hub address, default metadata, and security.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f5f7] p-1 rounded-2xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'general' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              General & Contacts
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'seo' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              SEO & Social Cards
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'security' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              Admin Security
            </button>
          </div>
        </div>

        {/* Tab 1: General & Contacts */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f5f7]">
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Brand Identity & Booking Desk
              </h3>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Website Brand Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Primary Booking Phone</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1d1d1f]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">WhatsApp Target Phone (Numeric)</label>
                  <input
                    type="text"
                    value={settings.rawPhone}
                    onChange={(e) => setSettings({ ...settings, rawPhone: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] font-mono"
                    placeholder="917586047996"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Primary Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1d1d1f]"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Alternate Inquiries Email</label>
                  <input
                    type="email"
                    value={settings.altEmail}
                    onChange={(e) => setSettings({ ...settings, altEmail: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Physical Office Address</label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1d1d1f] resize-none"
                    />
                    <MapPin className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Current Package Rates Validity</label>
                  <input
                    type="text"
                    value={settings.offerValidity}
                    onChange={(e) => setSettings({ ...settings, offerValidity: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                    placeholder="e.g. April 30, 2027"
                  />
                </div>

                {/* Announcement Ribbon Settings */}
                <div className="p-4 bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl space-y-3">
                  <h4 className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>Top Announcement Ribbon Banner</span>
                  </h4>
                  <div>
                    <label className="block text-[#86868b] mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      value={settings.ribbonText}
                      onChange={(e) => setSettings({ ...settings, ribbonText: e.target.value })}
                      className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#86868b] mb-1">Action Link Label</label>
                      <input
                        type="text"
                        value={settings.ribbonLinkText}
                        onChange={(e) => setSettings({ ...settings, ribbonLinkText: e.target.value })}
                        className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#86868b] mb-1">Action Link URL</label>
                      <input
                        type="text"
                        value={settings.ribbonLinkUrl}
                        onChange={(e) => setSettings({ ...settings, ribbonLinkUrl: e.target.value })}
                        className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs font-mono text-[#1d1d1f]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SEO & Social Cards */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f5f7]">
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Global SEO & OpenGraph Meta
              </h3>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save SEO'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Default Site SEO Title</label>
                  <input
                    type="text"
                    value={settings.defaultSeoTitle}
                    onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1d1d1f] mb-1">Default Meta Description</label>
                  <textarea
                    rows={4}
                    value={settings.defaultSeoDescription}
                    onChange={(e) => setSettings({ ...settings, defaultSeoDescription: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] resize-none"
                  />
                </div>

                <div>
                  <ImagePicker
                    label="OpenGraph Social Share Image"
                    value={settings.ogImage}
                    onChange={(newUrl) => setSettings({ ...settings, ogImage: newUrl })}
                    cmsData={cmsData}
                  />
                </div>
              </div>

              {/* Sitemap & Robots generation tools */}
              <div className="space-y-4">
                <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-5 space-y-3">
                  <h4 className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0071e3]" />
                    <span>Search Engine Sitemap & Robots</span>
                  </h4>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    Sitemap dynamically indexes all published pages and cab itineraries for Google Search indexing.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSitemap(true)}
                      className="px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] text-xs text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Preview sitemap.xml</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadSitemap}
                      className="px-4 py-2 rounded-xl bg-[#1d1d1f] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:bg-neutral-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download XML</span>
                    </button>
                  </div>
                </div>

                {/* Google Search Snippet Simulation */}
                <div className="bg-[#f5f5f7] rounded-2xl p-5 border border-[#e5e5ea] space-y-2">
                  <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block">
                    Google Search Preview
                  </span>
                  <div className="bg-white p-3 rounded-xl border border-[#e5e5ea] space-y-1">
                    <div className="text-[11px] text-[#202124]">https://spikycabs.in</div>
                    <div className="text-sm font-medium text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                      {settings.defaultSeoTitle}
                    </div>
                    <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                      {settings.defaultSeoDescription}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Credentials */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mb-1">
                Admin Authentication Credentials
              </h3>
              <p className="text-xs text-[#86868b]">
                Change the password used to access the private CMS dashboard at <code>/admin</code>.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admin password updated successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-medium cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Sitemap Modal */}
      {showSitemap && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#e5e5ea] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f5f7]">
              <h3 className="font-semibold text-sm text-[#1d1d1f] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#0071e3]" />
                <span>Generated XML Sitemap</span>
              </h3>
              <button
                onClick={() => setShowSitemap(false)}
                className="text-[#86868b] hover:text-[#1d1d1f] cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
            <pre className="flex-1 bg-[#1d1d1f] text-[#a1a1a6] p-4 rounded-2xl text-[11px] font-mono overflow-auto leading-relaxed">
              {generateSitemapXml()}
            </pre>
            <div className="flex justify-end pt-2">
              <button
                onClick={downloadSitemap}
                className="px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-medium cursor-pointer"
              >
                Download XML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
