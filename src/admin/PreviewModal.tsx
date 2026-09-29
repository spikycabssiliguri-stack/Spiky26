import { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ExternalLink, 
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { CMSData } from '../data/defaultCMSData';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CMSData;
}

export const PreviewModal = ({ isOpen, onClose, cmsData }: PreviewModalProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(1);

  if (!isOpen) return null;

  const deviceWidths = {
    desktop: 'w-full max-w-[1200px]',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const reloadIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  const previewUrl = selectedRoute ? `/#${selectedRoute}` : '/';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Top Preview Bar */}
      <div className="bg-[#1d1d1f] text-white rounded-2xl px-4 py-3 flex items-center justify-between gap-4 mb-3 border border-white/10 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Device Preview</span>
          </div>

          <span className="text-white/20">|</span>

          {/* Page Selector */}
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-[#2d2d2f] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#0071e3]"
          >
            <option value="">Home & Circuits</option>
            {cmsData.pages.map(p => (
              <option key={p.id} value={p.slug}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#2d2d2f] p-1 rounded-xl">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              device === 'desktop' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
            }`}
            title="Desktop (1200px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              device === 'tablet' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              device === 'mobile' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={reloadIframe}
            className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/10 cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-2">
        <div 
          className={`h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 flex flex-col ${deviceWidths[device]}`}
        >
          {device === 'mobile' && (
            <div className="bg-[#1d1d1f] h-5 w-full flex items-center justify-center">
              <div className="w-24 h-3 bg-black rounded-full"></div>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={previewUrl}
            title="Website Live Preview"
            className="w-full flex-1 border-0"
          />
        </div>
      </div>
    </div>
  );
};
