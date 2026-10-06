import { useState } from 'react';
import { Phone, MessageCircle, Menu, X, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export type PageId = string;

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenChecklist: () => void;
}

export const Navbar = ({ currentPage, onNavigate, onOpenChecklist }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cmsData } = useCMS();

  // Dynamic navigation items from CMS (ensuring Hotels and Travel Agency / Home2 are included)
  const rawNavItems = (cmsData.navigation || []).filter(item => item.isPublished);
  const hasHotels = rawNavItems.some(item => item.path === 'hotels' || item.label.toLowerCase().includes('hotel'));
  const hasHome2 = rawNavItems.some(item => item.path === 'home2');

  const itemsToAdd = [];
  if (!hasHome2) {
    itemsToAdd.push({ id: 'nav-home2', label: 'Travel Agency', path: 'home2', isPublished: true, order: 0.8, openInNewTab: false, isSystem: true });
  }
  if (!hasHotels) {
    itemsToAdd.push({ id: 'nav-hotels', label: 'Hotels', path: 'hotels', isPublished: true, order: 1.5, openInNewTab: false, isSystem: true });
  }

  const allNavItems = [...rawNavItems, ...itemsToAdd];
  const navItems = allNavItems.sort((a, b) => a.order - b.order);

  const handleNavClick = (path: string, openInNewTab?: boolean) => {
    if (openInNewTab || path.startsWith('http')) {
      window.open(path, '_blank');
      return;
    }
    onNavigate(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const settings = cmsData.settings;

  const isItemActive = (path: string) => {
    if (currentPage === path) return true;
    if (path === 'home' && (currentPage === 'home' || currentPage === '')) return true;
    if (path === 'home2' && currentPage === 'home2') return true;
    if (path === 'hotels' && (currentPage === 'hotels' || currentPage.startsWith('hotel/') || currentPage.startsWith('hotels/'))) return true;
    if (path === 'packages' && (currentPage === 'packages' || currentPage.startsWith('package/') || currentPage.startsWith('packages/'))) return true;
    return false;
  };

  return (
    <>
      {/* Apple Ribbon Announcement */}
      {settings.ribbonText && (
        <div className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[12px] text-[#1d1d1f] py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span>{settings.ribbonText}</span>
            {settings.ribbonLinkText && (
              <a
                href={settings.ribbonLinkUrl || `https://wa.me/${settings.rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0071e3] hover:underline font-normal inline-flex items-center"
              >
                <span>{settings.ribbonLinkText}</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Apple Global Nav Bar */}
      <header className="sticky top-0 z-50 bg-[rgba(255,255,255,0.82)] backdrop-blur-2xl border-b border-[rgba(0,0,0,0.08)] transition-all">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-[12px] text-[#1d1d1f]">
          {/* Brand Mark */}
          <button
            onClick={() => handleNavClick('home')}
            className="font-semibold tracking-tight text-[15px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer"
          >
            <span>{settings.siteName || 'Spiky Cabs'}</span>
          </button>

          {/* Navigation Items (Centered Apple Style) */}
          <nav className="hidden md:flex items-center gap-8 text-[12px] text-[#1d1d1f]/80">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path, item.openInNewTab)}
                className={`transition-colors cursor-pointer py-1 ${
                  isItemActive(item.path)
                    ? 'text-[#1d1d1f] font-semibold'
                    : 'hover:text-[#1d1d1f]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="hidden lg:inline-block text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            >
              {settings.phone}
            </a>

            <a
              href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20am%20interested%20in%20booking%20a%20cab%20package.`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-normal px-3.5 py-1.5 transition-colors whitespace-nowrap"
            >
              Book Cab
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-[#1d1d1f] focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-[#e5e5ea] px-6 pt-4 pb-8 space-y-4 animate-in fade-in duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path, item.openInNewTab)}
                className={`block w-full text-left py-2 text-base cursor-pointer ${
                  isItemActive(item.path) ? 'font-semibold text-[#0071e3]' : 'text-[#1d1d1f]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#e5e5ea] flex flex-col gap-2 text-xs text-[#6e6e73]">
              <a href={`tel:${settings.phone}`} className="text-[#1d1d1f] font-medium">
                Call: {settings.phone}
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenChecklist();
                }}
                className="text-left text-[#0071e3] hover:underline cursor-pointer"
              >
                Owner Information Checklist
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
