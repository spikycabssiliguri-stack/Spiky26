import { useState } from 'react';
import { 
  ChevronRight, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Sparkles, 
  MapPin, 
  MessageCircle, 
  Phone,
  Building2
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface DynamicPageProps {
  slug: string;
  onNavigateContact?: () => void;
  onNavigateHotels?: () => void;
}

export const DynamicPage = ({ slug, onNavigateContact, onNavigateHotels }: DynamicPageProps) => {
  const { cmsData } = useCMS();
  const page = cmsData.pages.find(p => p.slug === slug);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="py-24 text-center px-4 max-w-xl mx-auto space-y-4">
        <h2 className="text-3xl font-semibold text-[#1d1d1f]">Page Not Found</h2>
        <p className="text-sm text-[#86868b]">
          The requested page does not exist or has been unpublished by the administrator.
        </p>
        <a
          href="/"
          className="inline-block rounded-full bg-[#0071e3] text-white px-5 py-2 text-xs font-normal"
        >
          Return to Home
        </a>
      </div>
    );
  }

  const visibleSections = (page.sections || [])
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white min-h-screen text-[#1d1d1f]">
      {/* Page Header */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 border-b border-[#e5e5ea] bg-[#fbfbfd]">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-[12px] font-semibold text-[#86868b] tracking-wider uppercase">
            Spiky Cabs · {cmsData.settings.siteName}
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] text-balance">
            {page.title}
          </h1>
          {page.metaDescription && (
            <p className="text-base text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed">
              {page.metaDescription}
            </p>
          )}
        </div>
      </section>

      {/* Render Dynamic Blocks */}
      <div className="space-y-16 py-12">
        {visibleSections.map((sec) => {
          if (sec.type === 'hero') {
            return (
              <section key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="bg-[#f5f5f7] rounded-3xl overflow-hidden p-8 sm:p-14 border border-[#e5e5ea] flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                      {sec.title}
                    </h2>
                    {sec.subtitle && (
                      <p className="text-base text-[#424245] leading-relaxed">
                        {sec.subtitle}
                      </p>
                    )}
                    {sec.content && (
                      <p className="text-xs text-[#86868b] leading-relaxed">
                        {sec.content}
                      </p>
                    )}
                    {sec.buttonText && (
                      <div className="pt-2">
                        <a
                          href={sec.buttonLink || '#contact'}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-normal transition-colors"
                        >
                          <span>{sec.buttonText}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {sec.image && (
                    <div className="w-full md:w-1/2 aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={sec.image}
                        alt={sec.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (sec.type === 'text') {
            return (
              <section key={sec.id} className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-3xl p-8 space-y-4">
                  <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                    {sec.title}
                  </h3>
                  {sec.subtitle && (
                    <h4 className="text-sm font-medium text-[#0071e3]">
                      {sec.subtitle}
                    </h4>
                  )}
                  {sec.content && (
                    <p className="text-sm text-[#424245] leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          if (sec.type === 'cards') {
            const cardItems = (sec.content || '').split('·').map(s => s.trim()).filter(Boolean);
            return (
              <section key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f]">
                    {sec.title}
                  </h3>
                  {sec.subtitle && (
                    <p className="text-sm text-[#86868b]">{sec.subtitle}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cardItems.map((item, i) => (
                    <div key={i} className="p-5 bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl space-y-2">
                      <div className="w-7 h-7 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-semibold text-[#1d1d1f]">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sec.type === 'faq') {
            return (
              <section key={sec.id} className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                    {sec.title}
                  </h3>
                  {sec.subtitle && (
                    <p className="text-xs text-[#86868b]">{sec.subtitle}</p>
                  )}
                </div>

                <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-6 space-y-4 text-xs">
                  <p className="text-sm text-[#424245] leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </div>
              </section>
            );
          }

          if (sec.type === 'cta') {
            return (
              <section key={sec.id} className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-[#1d1d1f] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {sec.title}
                  </h3>
                  {sec.subtitle && (
                    <p className="text-sm text-[#a1a1a6] max-w-xl mx-auto">
                      {sec.subtitle}
                    </p>
                  )}
                  {sec.content && (
                    <p className="text-xs text-[#86868b] max-w-lg mx-auto">
                      {sec.content}
                    </p>
                  )}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${cmsData.settings.rawPhone}?text=Hi%20Spiky%20Cabs%2C%20inquiry%20from%20${encodeURIComponent(page.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-normal inline-flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{sec.buttonText || 'Inquire on WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* Hotel Recommendations CTA Banner */}
        {onNavigateHotels && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-800 shadow-xl">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Himalayan Stays</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Need Hotel Recommendations for Your Trip?
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Browse handpicked properties across Summit Hotels, Sumi Yashshree, Taj Chia Kutir, and Rare Himalayas heritage estates in Darjeeling & Sikkim.
                </p>
              </div>

              <button
                onClick={onNavigateHotels}
                className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0 inline-flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Recommended Hotels</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
