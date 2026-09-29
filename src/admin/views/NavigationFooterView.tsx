import { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronUp, 
  ChevronDown, 
  Save, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Layers,
  Check,
  Globe,
  Share2
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';

interface NavigationFooterViewProps {
  cmsData: CMSData;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

export const NavigationFooterView = ({ cmsData, onSaveCMS, isSaving }: NavigationFooterViewProps) => {
  const [activeTab, setActiveTab] = useState<'navigation' | 'footer'>('navigation');

  // Navigation state
  const [navItems, setNavItems] = useState(cmsData.navigation || []);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavPath, setNewNavPath] = useState('');
  const [newNavNewTab, setNewNavNewTab] = useState(false);

  // Footer state
  const [footerData, setFooterData] = useState(cmsData.footer || {
    footnotes: [],
    columns: [],
    copyright: ''
  });
  const [socialLinks, setSocialLinks] = useState(cmsData.settings.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  });

  const [newFootnote, setNewFootnote] = useState('');
  const [editingColumnIdx, setEditingColumnIdx] = useState<number | null>(null);

  // Navigation handlers
  const handleMoveNav = (index: number, direction: 'up' | 'down') => {
    const items = [...navItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    items.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setNavItems(items);
  };

  const handleToggleNavPublish = (id: string) => {
    setNavItems(navItems.map(item => 
      item.id === id ? { ...item, isPublished: !item.isPublished } : item
    ));
  };

  const handleRemoveNav = (id: string) => {
    const target = navItems.find(n => n.id === id);
    if (target?.isSystem) {
      if (!confirm('This is a primary site link. Are you sure you want to remove it?')) return;
    }
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const handleAddNav = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim() || !newNavPath.trim()) return;

    const newItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      path: newNavPath.trim(),
      isPublished: true,
      order: navItems.length + 1,
      openInNewTab: newNavNewTab,
      isSystem: false
    };

    setNavItems([...navItems, newItem]);
    setNewNavLabel('');
    setNewNavPath('');
    setNewNavNewTab(false);
  };

  const handleSaveNavigation = async () => {
    await onSaveCMS({ ...cmsData, navigation: navItems }, 'Updated top navigation menu');
  };

  // Footer handlers
  const handleAddFootnote = () => {
    if (!newFootnote.trim()) return;
    setFooterData({
      ...footerData,
      footnotes: [...footerData.footnotes, newFootnote.trim()]
    });
    setNewFootnote('');
  };

  const handleRemoveFootnote = (idx: number) => {
    setFooterData({
      ...footerData,
      footnotes: footerData.footnotes.filter((_, i) => i !== idx)
    });
  };

  const handleAddFooterColumn = () => {
    setFooterData({
      ...footerData,
      columns: [
        ...footerData.columns,
        {
          title: 'New Column',
          links: [{ label: 'Example Link', url: 'packages' }]
        }
      ]
    });
  };

  const handleRemoveFooterColumn = (idx: number) => {
    setFooterData({
      ...footerData,
      columns: footerData.columns.filter((_, i) => i !== idx)
    });
  };

  const handleAddColumnLink = (colIdx: number) => {
    const cols = [...footerData.columns];
    cols[colIdx].links.push({ label: 'New Link', url: '#' });
    setFooterData({ ...footerData, columns: cols });
  };

  const handleRemoveColumnLink = (colIdx: number, linkIdx: number) => {
    const cols = [...footerData.columns];
    cols[colIdx].links = cols[colIdx].links.filter((_, i) => i !== linkIdx);
    setFooterData({ ...footerData, columns: cols });
  };

  const handleSaveFooter = async () => {
    await onSaveCMS({
      ...cmsData,
      footer: footerData,
      settings: {
        ...cmsData.settings,
        socialLinks
      }
    }, 'Updated website footer and social links');
  };

  return (
    <div className="space-y-6">
      {/* Switcher Tab */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Navigation & Footer Structure
            </h2>
            <p className="text-xs text-[#86868b]">
              Control top header navigation menu, footer columns, legal disclaimers, and social links.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f5f7] p-1 rounded-2xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'navigation' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              Header Navigation
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'footer' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              Footer & Social
            </button>
          </div>
        </div>

        {activeTab === 'navigation' ? (
          /* Header Navigation Manager */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Top Menu Links ({navItems.length})
              </h3>
              <button
                onClick={handleSaveNavigation}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Navigation'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {navItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`bg-[#fbfbfd] border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    item.isPublished ? 'border-[#e5e5ea]' : 'border-[#e5e5ea] opacity-60 bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveNav(index, 'up')}
                        className="p-1 text-[#86868b] hover:text-[#1d1d1f] disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === navItems.length - 1}
                        onClick={() => handleMoveNav(index, 'down')}
                        className="p-1 text-[#86868b] hover:text-[#1d1d1f] disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] flex items-center justify-center font-mono font-semibold text-[#86868b] shrink-0">
                      {index + 1}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...navItems];
                          updated[index].label = e.target.value;
                          setNavItems(updated);
                        }}
                        className="bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        placeholder="Link Label"
                      />
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => {
                          const updated = [...navItems];
                          updated[index].path = e.target.value;
                          setNavItems(updated);
                        }}
                        className="bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs font-mono text-[#6e6e73] focus:outline-none focus:border-[#0071e3]"
                        placeholder="Path / Anchor (e.g. packages)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <label className="flex items-center gap-1.5 text-[11px] text-[#86868b] cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={item.openInNewTab}
                        onChange={(e) => {
                          const updated = [...navItems];
                          updated[index].openInNewTab = e.target.checked;
                          setNavItems(updated);
                        }}
                        className="rounded"
                      />
                      <span>New Tab</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleToggleNavPublish(item.id)}
                      className="p-1.5 rounded-lg text-[#86868b] hover:bg-[#f5f5f7] cursor-pointer"
                      title={item.isPublished ? 'Visible in menu' : 'Hidden from menu'}
                    >
                      {item.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveNav(item.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new nav item form */}
            <form onSubmit={handleAddNav} className="bg-[#f5f5f7] p-5 rounded-2xl border border-[#e5e5ea] space-y-3">
              <h4 className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Add Navigation Item</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Label (e.g. Bhutan Circuit)"
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                  className="bg-white border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0071e3]"
                />
                <input
                  type="text"
                  placeholder="URL or Page ID (e.g. packages or /about)"
                  value={newNavPath}
                  onChange={(e) => setNewNavPath(e.target.value)}
                  className="bg-white border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0071e3]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#1d1d1f] hover:bg-neutral-800 text-white px-4 py-2 font-medium cursor-pointer"
                >
                  + Add to Menu
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Footer & Social Media Manager */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Footer Configuration
              </h3>
              <button
                onClick={handleSaveFooter}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Footer Settings'}</span>
              </button>
            </div>

            {/* Copyright Notice */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-medium text-[#1d1d1f]">
                Copyright Line
              </label>
              <input
                type="text"
                value={footerData.copyright}
                onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f]"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Social Media Links</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#86868b] mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={socialLinks.facebook || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={socialLinks.instagram || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1">Twitter / X URL</label>
                  <input
                    type="text"
                    value={socialLinks.twitter || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs"
                    placeholder="https://x.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={socialLinks.youtube || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-1.5 text-xs"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Footer Columns */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#1d1d1f]">
                  Footer Columns ({footerData.columns.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddFooterColumn}
                  className="text-xs text-[#0071e3] hover:underline cursor-pointer"
                >
                  + Add Column
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {footerData.columns.map((col, cIdx) => (
                  <div key={cIdx} className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={col.title}
                        onChange={(e) => {
                          const cols = [...footerData.columns];
                          cols[cIdx].title = e.target.value;
                          setFooterData({ ...footerData, columns: cols });
                        }}
                        className="font-semibold bg-white border border-[#d2d2d7] rounded-lg px-2.5 py-1 text-xs text-[#1d1d1f]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFooterColumn(cIdx)}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {col.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const cols = [...footerData.columns];
                              cols[cIdx].links[lIdx].label = e.target.value;
                              setFooterData({ ...footerData, columns: cols });
                            }}
                            className="w-1/2 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[11px]"
                            placeholder="Link label"
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => {
                              const cols = [...footerData.columns];
                              cols[cIdx].links[lIdx].url = e.target.value;
                              setFooterData({ ...footerData, columns: cols });
                            }}
                            className="w-1/2 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[11px] font-mono"
                            placeholder="Target"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveColumnLink(cIdx, lIdx)}
                            className="text-[#86868b] hover:text-rose-600 p-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddColumnLink(cIdx)}
                      className="text-[11px] text-[#0071e3] hover:underline cursor-pointer block pt-1"
                    >
                      + Add Link
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footnotes / Disclaimers */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#1d1d1f]">
                Legal Disclaimers & Footnotes ({footerData.footnotes.length})
              </h4>
              <div className="space-y-2 text-xs">
                {footerData.footnotes.map((fn, idx) => (
                  <div key={idx} className="p-3 bg-[#f5f5f7] rounded-xl flex items-start justify-between gap-3 text-xs text-[#6e6e73]">
                    <div className="flex gap-2">
                      <span className="font-mono text-[#86868b]">{idx + 1}.</span>
                      <p>{fn}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFootnote(idx)}
                      className="text-rose-600 hover:text-rose-700 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newFootnote}
                    onChange={(e) => setNewFootnote(e.target.value)}
                    placeholder="Add a new disclaimer note..."
                    className="flex-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFootnote();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFootnote}
                    className="px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
