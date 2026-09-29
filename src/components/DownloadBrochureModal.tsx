import { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Phone, User, ShieldCheck } from 'lucide-react';
import { CabPackage } from '../data/packagesData';
import { generatePdfBrochure } from '../utils/generatePdfBrochure';

interface DownloadBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: CabPackage | null;
  companyPhone?: string;
}

export const DownloadBrochureModal = ({
  isOpen,
  onClose,
  pkg,
  companyPhone = '+91 75860 47996'
}: DownloadBrochureModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !pkg) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsDownloading(true);

    try {
      // Send lead to backend API for admin tracking
      fetch('/api/public/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          packageTitle: pkg.title,
          packageId: pkg.id
        })
      }).catch(err => console.warn('Lead capture background note:', err));

      // Generate & download PDF
      generatePdfBrochure(pkg, { name, phone }, companyPhone);

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('PDF generation error:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e5e5ea] shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            Download Itinerary PDF
          </h3>
          <p className="text-xs sm:text-sm text-[#6e6e73]">
            Get the full day-by-day route schedule, vehicle fares, and sightseeing stops for <strong>{pkg.title}</strong>.
          </p>
        </div>

        {downloadSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-sm text-emerald-900">PDF Downloaded Successfully!</h4>
            <p className="text-xs text-emerald-700">
              Your customized itinerary brochure has been downloaded to your device.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-[#1d1d1f] mb-1.5">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all"
                />
                <User className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1d1d1f] mb-1.5">
                Mobile / WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all"
                />
                <Phone className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#86868b] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We respect your privacy. No spam calls or unsolicited messages.</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isDownloading || !name.trim() || !phone.trim()}
                className="w-full rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 px-4 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating PDF...' : 'Download Itinerary (PDF)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
