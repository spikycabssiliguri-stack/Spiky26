import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, FolderOpen, RefreshCw } from 'lucide-react';
import { uploadMedia } from '../services/api';
import { CMSData } from '../data/defaultCMSData';

interface ImagePickerProps {
  value: string;
  onChange: (newUrl: string) => void;
  label?: string;
  cmsData?: CMSData;
}

// Built-in high quality hill and fleet photos available for instant 1-click selection
const PRESET_GALLERY_IMAGES = [
  { name: 'Darjeeling Tiger Hill Dawn', url: '/images/gallery_tiger_hill_1790680945212.jpg' },
  { name: 'Darjeeling Toy Train Heritage', url: '/images/darjeeling_toy_train_1790684713643.jpg' },
  { name: 'Darjeeling Tea Gardens & Mirik', url: '/images/darjeeling_tea_mirik_1790680004464.jpg' },
  { name: 'Lamahatta Pine Forest & Lake', url: '/images/lamahatta_eco_park_1790685151618.jpg' },
  { name: 'Gangtok Glacial Tsomgo (Changu) Lake', url: '/images/gallery_tsomgo_lake_1790680958082.jpg' },
  { name: 'Nathula Pass Border (14,140 ft)', url: '/images/nathula_pass_sikkim_1790684731915.jpg' },
  { name: 'Gangtok Valley & Cable Car City', url: '/images/gangtok_city_view_1790684782649.jpg' },
  { name: 'North Sikkim Lachung & Yumthang Valley', url: '/images/north_sikkim_yumthang_1790679981868.jpg' },
  { name: 'Sacred Gurudongmar Lake (17,800 ft)', url: '/images/gurudongmar_lake_1790685179623.jpg' },
  { name: 'Pelling Glass Skywalk & Chenrezig', url: '/images/pelling_skywalk_sikkim_1790684762658.jpg' },
  { name: 'Ravangla Buddha Park Serenity', url: '/images/ravangla_buddha_park_1790684746815.jpg' },
  { name: 'Kalimpong Deolo Hill & Paragliding', url: '/images/deolo_hill_kalimpong_1790685166158.jpg' },
  { name: 'Toyota Innova Crysta Mountain Cab', url: '/images/fleet_innova_crysta_1790679963418.jpg' },
  { name: 'Himalayan Ridge Highway View', url: '/images/hero_himalayan_cab_1790679944443.jpg' }
];

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  label = 'Featured Image',
  cmsData
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize path if old /images/ is present
  const displayUrl = value?.startsWith('/images/') 
    ? value.replace('/images/', '/images/') 
    : value;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadMedia(file, file.name, '');
      if (res && res.media && res.media.url) {
        onChange(res.media.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Combine uploaded media from CMS and preloaded photos
  const userMedia = (cmsData?.media || []).map(m => ({
    name: m.originalName || m.filename,
    url: m.url
  }));

  const allAvailable = [...userMedia, ...PRESET_GALLERY_IMAGES];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-[#1d1d1f]">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-medium text-[#0071e3] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
          </button>
          <span className="text-[#d2d2d7]">·</span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-medium text-[#0071e3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FolderOpen className="w-3 h-3" />
            <span>Choose from Library</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Preview Thumbnail */}
        <div className="w-16 h-12 rounded-xl bg-neutral-100 border border-[#d2d2d7] overflow-hidden shrink-0 relative group">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#86868b]">
              <ImageIcon className="w-5 h-5 opacity-40" />
            </div>
          )}
        </div>

        {/* URL Input Box */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={displayUrl || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or paste image URL"
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-3 pr-8 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
          />
          {displayUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-2.5 text-[#86868b] hover:text-[#1d1d1f]"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Library Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#e5e5ea] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#f5f5f7]">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">Choose Photo Asset</h3>
                <p className="text-xs text-[#86868b]">Click any photo to instantly set it as the image.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto py-4 flex-1">
              {allAvailable.map((item, idx) => {
                const isSelected = displayUrl === item.url;
                return (
                  <button
                    key={`${item.url}-${idx}`}
                    type="button"
                    onClick={() => {
                      onChange(item.url);
                      setIsModalOpen(false);
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left aspect-video transition-all cursor-pointer ${
                      isSelected ? 'border-[#0071e3] ring-2 ring-[#0071e3]' : 'border-[#e5e5ea] hover:border-[#0071e3]'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/hero_himalayan_cab_1790679944443.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                    <div className="absolute bottom-1.5 left-2 right-2 text-white flex items-center justify-between">
                      <span className="text-[10px] font-medium truncate drop-shadow-sm">{item.name}</span>
                      {isSelected && (
                        <span className="bg-[#0071e3] rounded-full p-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#f5f5f7] flex justify-between items-center text-xs">
              <span className="text-[#86868b] text-[11px]">{allAvailable.length} photos ready</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-[#1d1d1f] hover:bg-black text-white px-4 py-1.5 text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
