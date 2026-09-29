import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  X, 
  Save, 
  Search, 
  Sparkles, 
  Layout, 
  Image as ImageIcon,
  Type,
  HelpCircle,
  MessageSquare,
  Layers,
  ArrowRight,
  Globe,
  Settings,
  AlertCircle
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';

interface Section {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isVisible: boolean;
}

interface PageItem {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  status: 'published' | 'draft';
  updatedAt: string;
  isSystem: boolean;
  sections: Section[];
}

interface PagesViewProps {
  cmsData: CMSData;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

export const PagesView = ({ cmsData, onSaveCMS, isSaving }: PagesViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPages = cmsData.pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditPage = (page: PageItem) => {
    setEditingPage(JSON.parse(JSON.stringify(page)));
    setIsCreatingPage(false);
  };

  const handleCreatePageClick = () => {
    const newPage: PageItem = {
      id: `page-${Date.now()}`,
      slug: `custom-${Date.now().toString().slice(-4)}`,
      title: 'New Custom Page',
      seoTitle: 'New Page – Spiky Cabs',
      metaDescription: 'Description of the newly created page on Spiky Cabs.',
      status: 'draft',
      updatedAt: new Date().toISOString(),
      isSystem: false,
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: 'hero',
          title: 'Welcome to Our New Page',
          subtitle: 'Discover private cab circuits across Darjeeling, Sikkim and Bhutan.',
          content: 'Book reliable mountain cabs with certified local chauffeurs.',
          image: '/src/assets/images/hero_himalayan_cab_1790679944443.jpg',
          buttonText: 'Inquire Now',
          buttonLink: '#contact',
          order: 1,
          isVisible: true
        }
      ]
    };
    setEditingPage(newPage);
    setIsCreatingPage(true);
  };

  const handleDuplicatePage = (page: PageItem) => {
    const duplicated: PageItem = {
      ...JSON.parse(JSON.stringify(page)),
      id: `page-${Date.now()}`,
      slug: `${page.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${page.title} (Copy)`,
      status: 'draft',
      isSystem: false,
      updatedAt: new Date().toISOString()
    };

    const updatedPages = [...cmsData.pages, duplicated];
    const updatedCMS = { ...cmsData, pages: updatedPages };
    onSaveCMS(updatedCMS, `Duplicated page: ${page.title}`);
    showToast(`Page "${page.title}" duplicated.`);
  };

  const handleDeletePage = (pageId: string) => {
    const target = cmsData.pages.find(p => p.id === pageId);
    if (target?.isSystem) {
      alert('System core pages cannot be deleted, but you can unpublish or edit their content.');
      return;
    }

    const updatedPages = cmsData.pages.filter(p => p.id !== pageId);
    const updatedCMS = { ...cmsData, pages: updatedPages };
    onSaveCMS(updatedCMS, `Deleted page ID: ${pageId}`);
    setDeleteConfirmId(null);
    showToast('Page deleted.');
  };

  const handleTogglePublish = (page: PageItem) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    const updatedPages = cmsData.pages.map(p => 
      p.id === page.id ? { ...p, status: newStatus as 'published' | 'draft', updatedAt: new Date().toISOString() } : p
    );
    const updatedCMS = { ...cmsData, pages: updatedPages };
    onSaveCMS(updatedCMS, `Changed status of ${page.title} to ${newStatus}`);
    showToast(`Page is now ${newStatus}.`);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    if (!editingPage.title.trim()) {
      alert('Please enter a page title.');
      return;
    }
    if (!editingPage.slug.trim()) {
      alert('Please enter a valid URL slug.');
      return;
    }

    let updatedPages = [...cmsData.pages];
    const existsIndex = updatedPages.findIndex(p => p.id === editingPage.id);

    const savedPage = {
      ...editingPage,
      updatedAt: new Date().toISOString()
    };

    if (existsIndex >= 0) {
      updatedPages[existsIndex] = savedPage;
    } else {
      updatedPages.push(savedPage);
    }

    const updatedCMS = { ...cmsData, pages: updatedPages };
    await onSaveCMS(updatedCMS, `Saved page: ${savedPage.title}`);
    setEditingPage(null);
    setIsCreatingPage(false);
    showToast(`Page "${savedPage.title}" saved successfully.`);
  };

  // Section Management within Editing Page
  const handleAddSection = (type: string) => {
    if (!editingPage) return;

    let defaultTitle = 'New Section';
    let defaultSubtitle = '';
    let defaultContent = '';
    let defaultImage = '';
    let defaultBtn = '';

    if (type === 'hero') {
      defaultTitle = 'Scenic Himalayan Tour';
      defaultSubtitle = 'Private cab packages tailored for your family';
      defaultContent = 'Comfortable sedans, SUVs, and certified mountain drivers.';
      defaultImage = '/src/assets/images/hero_himalayan_cab_1790679944443.jpg';
      defaultBtn = 'View Packages';
    } else if (type === 'text') {
      defaultTitle = 'Important Mountain Travel Advisory';
      defaultSubtitle = 'Permits, Altitude & Preparation';
      defaultContent = 'Remember to carry original voter ID cards or passports with 4 passport-size photographs for Nathu La Pass and North Sikkim permits.';
    } else if (type === 'cards') {
      defaultTitle = 'Why Book Spiky Cabs';
      defaultSubtitle = 'The Cab-Only Advantage';
      defaultContent = '100% Dedicated Vehicles · Verified Hill Drivers · Transparent Distance Charges · 24/7 Siliguri Operations Desk';
    } else if (type === 'faq') {
      defaultTitle = 'Frequently Asked Questions';
      defaultSubtitle = 'Everything you need to know about our cab packages';
      defaultContent = 'Q: Are fuel, tolls, and driver allowances included? A: Yes, all our package quotes include vehicle rent, certified driver allowance, fuel, and standard road parking.';
    } else if (type === 'cta') {
      defaultTitle = 'Ready to Plan Your Himalayan Circuit?';
      defaultSubtitle = 'Speak directly with our Siliguri route coordinators.';
      defaultContent = 'Instant WhatsApp quotes and customized day-by-day stops.';
      defaultBtn = 'Message on WhatsApp';
    }

    const newSec: Section = {
      id: `sec-${Date.now()}`,
      type,
      title: defaultTitle,
      subtitle: defaultSubtitle,
      content: defaultContent,
      image: defaultImage,
      buttonText: defaultBtn,
      buttonLink: '#contact',
      order: editingPage.sections.length + 1,
      isVisible: true
    };

    setEditingPage({
      ...editingPage,
      sections: [...editingPage.sections, newSec]
    });
    setEditingSection(newSec);
    setIsAddingSection(false);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!editingPage) return;
    const sections = [...editingPage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // Reassign order
    sections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setEditingPage({
      ...editingPage,
      sections
    });
  };

  const handleToggleSectionVisibility = (secId: string) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      sections: editingPage.sections.map(s => 
        s.id === secId ? { ...s, isVisible: !s.isVisible } : s
      )
    });
  };

  const handleDeleteSection = (secId: string) => {
    if (!editingPage) return;
    const sections = editingPage.sections
      .filter(s => s.id !== secId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setEditingPage({
      ...editingPage,
      sections
    });
    if (editingSection?.id === secId) {
      setEditingSection(null);
    }
  };

  const handleDuplicateSection = (sec: Section) => {
    if (!editingPage) return;
    const dup: Section = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec-${Date.now()}`,
      title: `${sec.title} (Copy)`,
      order: editingPage.sections.length + 1
    };
    setEditingPage({
      ...editingPage,
      sections: [...editingPage.sections, dup]
    });
  };

  const handleUpdateEditingSection = (updated: Section) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      sections: editingPage.sections.map(s => s.id === updated.id ? updated : s)
    });
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1d1f] text-white px-4 py-2.5 rounded-full text-xs shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* If editing a page */}
      {editingPage ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-8 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f5f5f7]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPage(null)}
                  className="text-xs text-[#0071e3] hover:underline cursor-pointer"
                >
                  ← Back to Pages List
                </button>
                <span className="text-xs text-[#86868b]">/</span>
                <span className="text-xs text-[#86868b]">{editingPage.title}</span>
              </div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                {isCreatingPage ? 'Create New Page' : `Edit: ${editingPage.title}`}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-4 py-2 text-xs transition-colors cursor-pointer border border-[#d2d2d7]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePage}
                disabled={isSaving}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Page'}</span>
              </button>
            </div>
          </div>

          {/* Page Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f5f5f7]/60 p-5 rounded-2xl border border-[#e5e5ea]">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                  placeholder="e.g. Sikkim Monasteries Tour"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  URL Slug (URL path)
                </label>
                <div className="flex items-center">
                  <span className="bg-[#e5e5ea] border border-r-0 border-[#d2d2d7] rounded-l-xl px-3 py-2 text-xs text-[#86868b]">
                    /
                  </span>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                    className="w-full bg-white border border-[#d2d2d7] rounded-r-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                    placeholder="my-custom-page"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Publication Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, status: 'published' })}
                    className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                      editingPage.status === 'published'
                        ? 'bg-emerald-600 text-white font-medium shadow-xs'
                        : 'bg-white text-[#1d1d1f] border border-[#d2d2d7]'
                    }`}
                  >
                    ● Published (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, status: 'draft' })}
                    className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                      editingPage.status === 'draft'
                        ? 'bg-amber-600 text-white font-medium shadow-xs'
                        : 'bg-white text-[#1d1d1f] border border-[#d2d2d7]'
                    }`}
                  >
                    ● Draft (Private)
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  SEO Title (Browser & Search Snippet)
                </label>
                <input
                  type="text"
                  value={editingPage.seoTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                  className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                  placeholder="e.g. Best Sikkim Cab Packages | Spiky Cabs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Meta Description (Search Engines)
                </label>
                <textarea
                  rows={2}
                  value={editingPage.metaDescription}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  className="w-full bg-white border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] resize-none"
                  placeholder="Concise summary under 160 characters..."
                />
              </div>

              <div className="text-[11px] text-[#86868b] flex items-center gap-1.5 pt-1">
                <Globe className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Search engines preview: <strong className="text-[#1d1d1f]">{editingPage.seoTitle || editingPage.title}</strong></span>
              </div>
            </div>
          </div>

          {/* Visual Sections & Blocks Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0071e3]" />
                  <span>Visual Content Blocks ({editingPage.sections.length})</span>
                </h3>
                <p className="text-xs text-[#86868b]">
                  Add, reorder, edit, and toggle layout sections on this page.
                </p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAddingSection(!isAddingSection)}
                  className="rounded-full bg-[#1d1d1f] hover:bg-[#333336] text-white px-3.5 py-1.5 text-xs font-normal transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Block</span>
                </button>

                {isAddingSection && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#e5e5ea] rounded-2xl shadow-xl p-2 z-30 text-xs space-y-1">
                    <div className="text-[10px] font-semibold text-[#86868b] px-2 py-1 uppercase tracking-wider">
                      Select Block Type
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSection('hero')}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f5f5f7] flex items-center gap-2 cursor-pointer"
                    >
                      <Layout className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Hero Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSection('text')}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f5f5f7] flex items-center gap-2 cursor-pointer"
                    >
                      <Type className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Rich Text / Notice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSection('cards')}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f5f5f7] flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Feature Cards Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSection('faq')}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f5f5f7] flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>FAQ Accordion</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSection('cta')}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f5f5f7] flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Call to Action Banner</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* List of blocks */}
            {editingPage.sections.length === 0 ? (
              <div className="p-8 text-center bg-[#f5f5f7] rounded-2xl border border-dashed border-[#d2d2d7] text-xs text-[#86868b] space-y-2">
                <p>No content blocks added to this page yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddingSection(true)}
                  className="text-[#0071e3] hover:underline cursor-pointer"
                >
                  + Add your first content block
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {editingPage.sections.map((sec, index) => (
                  <div
                    key={sec.id}
                    className={`bg-white border rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      sec.isVisible ? 'border-[#e5e5ea]' : 'border-[#e5e5ea] opacity-60 bg-[#f5f5f7]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveSection(index, 'up')}
                          className="p-1 rounded-md text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === editingPage.sections.length - 1}
                          onClick={() => handleMoveSection(index, 'down')}
                          className="p-1 rounded-md text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] text-xs font-mono font-semibold shrink-0">
                        {index + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73]">
                            {sec.type}
                          </span>
                          {!sec.isVisible && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-[#1d1d1f]">
                          {sec.title || 'Untitled Section'}
                        </h4>
                        {sec.subtitle && (
                          <p className="text-xs text-[#86868b] line-clamp-1">
                            {sec.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility(sec.id)}
                        className="p-2 rounded-xl text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer"
                        title={sec.isVisible ? 'Hide block from visitors' : 'Show block'}
                      >
                        {sec.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateSection(sec)}
                        className="p-2 rounded-xl text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer"
                        title="Duplicate block"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingSection(JSON.parse(JSON.stringify(sec)))}
                        className="px-3 py-1.5 rounded-xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-xs text-[#1d1d1f] font-normal cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>Edit Block</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Edit Modal */}
          {editingSection && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#e5e5ea] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#f5f5f7]">
                  <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#0071e3]" />
                    <span>Edit {editingSection.type.toUpperCase()} Block</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="p-1 rounded-full text-[#86868b] hover:bg-[#f5f5f7] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={editingSection.title}
                      onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1">
                      Subheading / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingSection.subtitle || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1">
                      Content / Body Copy
                    </label>
                    <textarea
                      rows={4}
                      value={editingSection.content || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1d1d1f] mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={editingSection.image || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, image: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                      placeholder="/uploads/... or image link"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={editingSection.buttonText || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, buttonText: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                        placeholder="e.g. Inquire on WhatsApp"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1d1d1f] mb-1">
                        Button Action Link
                      </label>
                      <input
                        type="text"
                        value={editingSection.buttonLink || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, buttonLink: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3]"
                        placeholder="e.g. #contact or /packages"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f5f5f7]">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateEditingSection(editingSection)}
                    className="px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-medium cursor-pointer"
                  >
                    Apply Block Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pages List Table View */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                Pages Management
              </h2>
              <p className="text-xs text-[#86868b]">
                Manage website pages, SEO tags, publish status, and content blocks.
              </p>
            </div>

            <button
              onClick={handleCreatePageClick}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 text-xs font-normal transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Page</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search pages by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-[#f5f5f7] p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === 'all' ? 'bg-white shadow-xs font-medium text-[#1d1d1f]' : 'text-[#86868b]'
                }`}
              >
                All ({cmsData.pages.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === 'published' ? 'bg-white shadow-xs font-medium text-emerald-700' : 'text-[#86868b]'
                }`}
              >
                Published ({cmsData.pages.filter(p => p.status === 'published').length})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === 'draft' ? 'bg-white shadow-xs font-medium text-amber-700' : 'text-[#86868b]'
                }`}
              >
                Drafts ({cmsData.pages.filter(p => p.status === 'draft').length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#f5f5f7] rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f5f5f7] text-[#86868b] font-medium border-b border-[#e5e5ea]">
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Blocks</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f7]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#fbfbfd] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                        <span>{page.title}</span>
                        {page.isSystem && (
                          <span className="text-[10px] bg-[#f5f5f7] text-[#86868b] px-1.5 py-0.5 rounded font-normal">
                            System
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#6e6e73]">
                      /{page.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(page)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-colors ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{page.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-[#86868b]">
                      {page.sections?.length || 0} blocks
                    </td>

                    <td className="py-3.5 px-4 text-[#86868b]">
                      {new Date(page.updatedAt || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditPage(page)}
                          className="p-1.5 text-[#0071e3] hover:bg-[#0071e3]/10 rounded-lg cursor-pointer"
                          title="Edit page content"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDuplicatePage(page)}
                          className="p-1.5 text-[#86868b] hover:bg-[#f5f5f7] rounded-lg cursor-pointer"
                          title="Duplicate page"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {!page.isSystem && (
                          <button
                            onClick={() => setDeleteConfirmId(page.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#e5e5ea] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              Are you sure you want to permanently delete this page? This action will remove all associated content blocks.
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
                onClick={() => handleDeletePage(deleteConfirmId)}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
