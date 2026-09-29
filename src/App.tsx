import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Navbar, PageId } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PackagesCatalogPage } from './pages/PackagesCatalogPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { DynamicPage } from './pages/DynamicPage';
import { InformationChecklistModal } from './components/InformationChecklistModal';
import { CabPackage } from './data/packagesData';
import { CMSProvider, useCMS } from './context/CMSContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminApp } from './admin/AdminApp';

function PublicWebsite() {
  const { cmsData } = useCMS();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // Sync hash with page navigation
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '') as PageId;
      if (!rawHash || rawHash === '') {
        setCurrentPage('home');
      } else {
        setCurrentPage(rawHash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const settings = cmsData.settings;

  // Check if current route is an individual package detail page (e.g. package/darjeeling-2n-3d)
  const isPackageDetail = currentPage.startsWith('package/') || currentPage.startsWith('packages/');
  const packageSlug = isPackageDetail ? currentPage.replace(/^(packages?)\//, '') : '';

  // Core system pages
  const isCorePage = ['home', 'packages', 'about', 'gallery', 'testimonials', 'contact', 'privacy'].includes(currentPage);

  return (
    <div className="min-h-screen bg-white flex flex-col text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white pb-14 sm:pb-0">
      {/* 1. Header (CMS Controlled) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* 2. Active Page Content */}
      <main className="flex-1">
        {/* Individual Package Detail Page */}
        {isPackageDetail && (
          <PackageDetailPage
            packageIdOrSlug={packageSlug}
            onNavigateBack={() => handleNavigate('packages')}
            onNavigatePackage={(slug) => handleNavigate(`package/${slug}`)}
          />
        )}

        {/* Home Landing Page */}
        {(currentPage === 'home' || currentPage === '') && (
          <HomePage
            onViewPackage={(pkg) => handleNavigate(`package/${pkg.slug || pkg.id}`)}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {/* Dedicated Packages Product / Catalog Page (/#packages) */}
        {currentPage === 'packages' && (
          <PackagesCatalogPage
            onSelectPackage={(pkg) => handleNavigate(`package/${pkg.slug || pkg.id}`)}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {/* Static Content Pages */}
        {currentPage === 'about' && (
          <AboutPage
            onNavigateContact={() => handleNavigate('contact')}
            onNavigatePackages={() => handleNavigate('packages')}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage />
        )}

        {currentPage === 'testimonials' && (
          <TestimonialsPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicyPage />
        )}

        {/* Dynamic CMS Page for admin created custom pages */}
        {!isCorePage && !isPackageDetail && (
          <DynamicPage 
            slug={currentPage} 
            onNavigateContact={() => handleNavigate('contact')} 
          />
        )}
      </main>

      {/* 3. Footer (CMS Controlled) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* 4. Modal: Information Needed from Owner Checklist */}
      <InformationChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      {/* 5. Apple Mobile Bottom Sticky Bar (< 15% mobile viewport cap) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl border-t border-[rgba(0,0,0,0.08)] p-2.5 flex items-center justify-between gap-2 shadow-lg">
        <a
          href={`tel:${settings.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#f5f5f7] active:bg-[#e5e5ea] text-[#1d1d1f] font-normal text-xs transition-colors border border-[#d2d2d7]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Spiky Cabs</span>
        </a>

        <a
          href={`https://wa.me/${settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20I%20would%20like%20to%20inquire%20about%20a%20cab%20package.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#0071e3] active:bg-[#0077ed] text-white font-normal text-xs transition-colors shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const isAdmin = 
        pathname.startsWith('/admin') || 
        pathname === '/admin/' ||
        hash === '#admin' || 
        hash.startsWith('#/admin');
      
      setIsAdminRoute(isAdmin);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Protected Admin Portal
  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <AdminApp />
      </AdminAuthProvider>
    );
  }

  // Public Facing Website
  return (
    <CMSProvider>
      <PublicWebsite />
    </CMSProvider>
  );
}
