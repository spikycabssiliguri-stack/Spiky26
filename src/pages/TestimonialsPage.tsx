import { useState } from 'react';
import { Play, Star, X, Volume2, Pause, ChevronRight } from 'lucide-react';
import { TESTIMONIALS_DATA, VideoTestimonial, COMPANY_INFO } from '../data/packagesData';
import { useCMS } from '../context/CMSContext';

export const TestimonialsPage = () => {
  const { cmsData } = useCMS();
  const testimonials = cmsData.testimonials && cmsData.testimonials.length > 0 ? cmsData.testimonials : TESTIMONIALS_DATA;
  const settings = cmsData.settings || COMPANY_INFO;
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      {/* Apple Keynote Stage Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            Traveler Stories
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Real Trips. Real Stories.
          </h1>
          <p className="text-lg sm:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed text-balance pt-2">
            Hear from families and groups who traveled Darjeeling, Gangtok, and North Sikkim with Spiky Cabs.
          </p>
        </div>
      </section>

      {/* Video Cards Grid (Apple TV+ Style) */}
      <section className="py-16 sm:py-24 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#e5e5ea] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              {/* Cinematic Video Thumbnail */}
              <div
                className="relative aspect-video bg-neutral-900 cursor-pointer overflow-hidden"
                onClick={() => {
                  setActiveVideo(t);
                  setIsPlaying(true);
                }}
              >
                <img
                  src={t.thumbnail}
                  alt={t.travelerName}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 text-[#1d1d1f] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-1 fill-current text-[#1d1d1f]" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[11px] font-mono text-white rounded-md">
                  {t.videoDuration}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#f5a623]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[12px] font-semibold text-[#86868b] ml-1.5 font-mono">
                      5.0
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#1d1d1f] font-normal leading-relaxed italic">
                    {t.videoHighlightQuote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f5f5f7]">
                  <div className="font-semibold text-sm text-[#1d1d1f]">
                    {t.travelerName}
                  </div>
                  <div className="text-xs text-[#86868b] mt-0.5">
                    {t.city} · {t.routeTaken}
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-1 font-mono">
                    Traveled in {t.vehicleUsed} ({t.travelDate})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Proof Metrics (Apple Style) */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-2">
            <span className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider">
              4.9 / 5.0 Rating
            </span>
            <h4 className="text-xl font-semibold text-[#1d1d1f]">
              Certified Local Chauffeurs
            </h4>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              Polite, non-smoking local mountain drivers who know every turn between NJP, Bagdogra, Gangtok, and Lachung.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-2">
            <span className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider">
              100% Upfront
            </span>
            <h4 className="text-xl font-semibold text-[#1d1d1f]">
              Guaranteed Transparent Tariff
            </h4>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              Every confirmed package voucher includes fuel for the agreed route, interstate road taxes, and driver stay fees.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] space-y-2">
            <span className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider">
              24/7 Desk
            </span>
            <h4 className="text-xl font-semibold text-[#1d1d1f]">
              Siliguri Hub Coordination
            </h4>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              Direct dispatch assistance throughout your journey for weather alerts, mountain road permits, and timely flight sync.
            </p>
          </div>
        </div>
      </section>

      {/* Video Player Modal (Apple Clean Sheet) */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#161617] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Viewport */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.travelerName}
                className="w-full h-full object-cover opacity-60"
              />

              <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/90 via-transparent to-black/50">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-300 font-medium">
                    Spiky Cabs Review · {activeVideo.routeTaken}
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-1.5 bg-black/60 rounded-full hover:bg-black text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl mx-auto max-w-lg">
                  <p className="text-xs text-neutral-200 italic">
                    {activeVideo.videoHighlightQuote}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#0071e3] h-full w-2/3 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-[#2997ff]"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <Volume2 className="w-4 h-4 text-neutral-300" />
                      <span>01:15 / {activeVideo.videoDuration}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">1080p Full HD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial details & transcription */}
            <div className="p-6 sm:p-8 bg-[#161617] border-t border-white/10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {activeVideo.travelerName}
                  </h3>
                  <div className="text-xs text-neutral-400">
                    {activeVideo.city} · {activeVideo.duration} · {activeVideo.vehicleUsed}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${COMPANY_INFO.rawPhone}?text=${encodeURIComponent(
                    `Hi Spiky Cabs, I would like to book a cab package similar to ${activeVideo.travelerName}'s ${activeVideo.routeTaken} trip.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 text-xs font-normal transition-colors whitespace-nowrap"
                >
                  Book this Route
                </a>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 text-xs text-neutral-300 leading-relaxed font-normal">
                "{activeVideo.fullReview}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
