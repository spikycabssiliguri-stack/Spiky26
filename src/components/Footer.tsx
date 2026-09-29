import { useCMS } from '../context/CMSContext';
import { PageId } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenChecklist: () => void;
}

export const Footer = ({ onNavigate, onOpenChecklist }: FooterProps) => {
  const { cmsData } = useCMS();
  const footer = cmsData.footer;
  const settings = cmsData.settings;

  const handleNav = (target: string) => {
    if (target.startsWith('http')) {
      window.open(target, '_blank');
      return;
    }
    onNavigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f5f5f7] text-[#6e6e73] text-[11px] sm:text-[12px] pt-12 pb-16 border-t border-[#d2d2d7]">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Footnotes & Disclaimers */}
        {footer.footnotes && footer.footnotes.length > 0 && (
          <div className="space-y-2 border-b border-[#d2d2d7] pb-8 text-[#86868b] leading-relaxed">
            {footer.footnotes.map((note, index) => (
              <p key={index}>
                {index + 1}. {note}
              </p>
            ))}
          </div>
        )}

        {/* Directory Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {footer.columns && footer.columns.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-[#1d1d1f]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button 
                      onClick={() => handleNav(link.url)} 
                      className="hover:text-[#1d1d1f] hover:underline text-left cursor-pointer transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Desk Column */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1d1d1f]">Contact & Desk</h4>
            <ul className="space-y-2">
              <li className="text-[#1d1d1f] font-medium">{settings.phone}</li>
              <li>{settings.email}</li>
              <li className="leading-snug">{settings.address}</li>
              <li className="pt-1">
                <button onClick={() => handleNav('contact')} className="text-[#0071e3] hover:underline cursor-pointer">
                  Contact Support Desk →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="pt-6 border-t border-[#d2d2d7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#86868b]">
          <div>
            {footer.copyright || `Copyright © ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleNav('privacy')} className="hover:text-[#1d1d1f] hover:underline cursor-pointer">
              Privacy Policy
            </button>
            <span>|</span>
            <button onClick={() => handleNav('contact')} className="hover:text-[#1d1d1f] hover:underline cursor-pointer">
              Contact Desk
            </button>
            <span>|</span>
            <a
              href={`https://wa.me/${settings.rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1d1d1f] hover:underline"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
