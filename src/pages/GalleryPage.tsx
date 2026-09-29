import { useState } from 'react';
import { X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../data/packagesData';
import { useCMS } from '../context/CMSContext';

export const GalleryPage = () => {
  const { cmsData } = useCMS();
  const galleryItems = cmsData.gallery && cmsData.gallery.length > 0 ? cmsData.gallery : GALLERY_DATA;
  const [filter, setFilter] = useState<'all' | 'darjeeling' | 'sikkim' | 'bhutan' | 'fleet'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      {/* Apple Keynote Stage Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            Visual Archive
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Scenes from the Road.
          </h1>
          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed text-balance pt-2">
            Capturing the misty passes, golden Kanchenjunga dawn, and glacial lakes across our Himalayan routes.
          </p>

          {/* Apple Segmented Pill Filter */}
          <div className="flex items-center justify-center gap-1 pt-6 flex-wrap">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'darjeeling', label: 'Darjeeling' },
              { id: 'sikkim', label: 'Sikkim & Yumthang' },
              { id: 'bhutan', label: 'Bhutan Circuit' },
              { id: 'fleet', label: 'Mountain Fleet' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#1d1d1f] text-white font-medium'
                    : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-[#d2d2d7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid (Shot on iPhone Style) */}
      <section className="py-16 sm:py-24 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="p-3 bg-black/60 backdrop-blur-md rounded-full">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-1">
                <div className="text-[11px] text-[#86868b] font-medium">
                  {item.location}
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6e6e73] line-clamp-2 pt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal (Apple Style Clean Sheet) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#86868b] font-medium">
                  {selectedPhoto.location}
                </div>
                <h3 className="font-semibold text-xl text-[#1d1d1f] mt-0.5">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-[#6e6e73] mt-1 max-w-xl">
                  {selectedPhoto.caption}
                </p>
              </div>

              <a
                href="#packages"
                onClick={() => setSelectedPhoto(null)}
                className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 text-xs font-normal transition-colors whitespace-nowrap self-start sm:self-auto inline-flex items-center gap-1"
              >
                <span>View Route</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
