import { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Calendar, 
  Users, 
  Car, 
  Building2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  FileDown,
  Loader2
} from 'lucide-react';
import { CRMItinerary } from '../../types/crm';
import { downloadQuotationPDF, printQuotation } from '../../utils/quotationPdf';

interface QuotationModalProps {
  itinerary: CRMItinerary | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: 'Draft' | 'Shared' | 'Confirmed') => void;
}

export const QuotationModal = ({ itinerary, isOpen, onClose, onStatusChange }: QuotationModalProps) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen || !itinerary) return null;

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    showToast('Generating official PDF proposal...');
    setTimeout(() => {
      try {
        const ok = downloadQuotationPDF(itinerary);
        if (ok) {
          showToast('✓ PDF quotation downloaded successfully!');
          onStatusChange?.(itinerary.id, 'Shared');
        } else {
          showToast('Failed to generate PDF. Retrying...');
        }
      } catch (err: any) {
        console.error('PDF error:', err);
        showToast('Error generating PDF.');
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 150);
  };

  const handlePrint = () => {
    try {
      showToast('Opening print dialog...');
      printQuotation(itinerary);
      onStatusChange?.(itinerary.id, 'Shared');
    } catch (err) {
      console.warn('Print error fallback:', err);
      handleDownloadPdf();
    }
  };

  const getWhatsAppMessage = () => {
    const daysSummary = itinerary.days
      .map(d => `*Day ${d.dayNumber}:* ${d.title}${d.hotelName ? `\n_Stay:_ ${d.hotelName} (${d.roomCategoryName || 'Deluxe'}, ${d.mealPlan || 'CP'})` : ''}`)
      .join('\n\n');

    return `*Spiky Cabs & Himalayan Travels – Tour Quotation*\n` +
      `--------------------------------------------------\n` +
      `*Guest Name:* ${itinerary.guestName}\n` +
      `*Duration:* ${itinerary.durationNights} Nights / ${itinerary.durationDays} Days\n` +
      `*Travel Start Date:* ${itinerary.travelStartDate}\n` +
      `*Passengers:* ${itinerary.adults} Adults${itinerary.children ? `, ${itinerary.children} Kids` : ''}\n` +
      `*Dedicated Vehicle:* ${itinerary.vehicleName} (${itinerary.vehicleCategory})\n\n` +
      `*DAY-BY-DAY ITINERARY:*\n${daysSummary}\n\n` +
      `*QUOTATION TOTAL:* ₹${itinerary.pricing.grandTotal.toLocaleString('en-IN')} (All Inclusive)\n` +
      `*Inclusions:* Dedicated private cab, hill driver allowance, fuel, toll, parking, verified hotel stay & Sikkim permits.\n\n` +
      `For any customizations or to confirm your booking, reply to this message!`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = itinerary.guestPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Official Tour Quotation</h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  itinerary.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                  itinerary.status === 'Shared' ? 'bg-blue-100 text-blue-800' :
                  'bg-neutral-200 text-neutral-700'
                }`}>
                  {itinerary.status}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Quotation #{itinerary.id.slice(-6).toUpperCase()} · Created by {itinerary.createdByName || 'Agent'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Copy Quotation for Email or Message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Quote'}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onStatusChange?.(itinerary.id, 'Shared')}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </a>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              title="Download Official PDF Proposal file"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Print document or open browser print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toast Alert */}
        {toastMessage && (
          <div className="bg-blue-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Printable & Interactive Quotation Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 print:p-4 print:overflow-visible text-neutral-900">
          
          {/* Header Brand & Company Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                  SPIKY CABS & HIMALAYAN TRAVELS
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Government Registered Tourist Cab Operator & Bespoke Himalayan Tour Organizers
              </p>
              <p className="text-xs text-neutral-500">
                Siliguri · Darjeeling · Gangtok · North Sikkim · Bhutan
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs text-neutral-600 bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl w-full sm:w-auto">
              <div className="font-semibold text-neutral-900">Travel Desk & Bookings</div>
              <div className="flex items-center sm:justify-end gap-1">
                <Phone className="w-3 h-3 text-blue-600" />
                <span>+91 75860 47996 / +91 74780 47996</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1">
                <Mail className="w-3 h-3 text-blue-600" />
                <span>spikycabssiliguri@gmail.com</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Date: {new Date(itinerary.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Guest & Trip Details Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
            <div>
              <span className="text-neutral-500 block text-[11px] font-medium">Prepared For:</span>
              <span className="text-sm font-bold text-neutral-900 block mt-0.5">{itinerary.guestName}</span>
              <span className="text-neutral-600">{itinerary.guestPhone}</span>
              {itinerary.city && <span className="text-neutral-500 block text-[10px]">{itinerary.city}</span>}
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px] font-medium">Travel Dates:</span>
              <span className="text-sm font-bold text-neutral-900 block mt-0.5">{itinerary.travelStartDate}</span>
              <span className="text-blue-700 font-semibold">{itinerary.durationNights} Nights / {itinerary.durationDays} Days</span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px] font-medium">Guest Composition:</span>
              <span className="text-sm font-bold text-neutral-900 block mt-0.5">
                {itinerary.adults} Adults {itinerary.children > 0 ? `+ ${itinerary.children} Kids` : ''}
              </span>
              <span className="text-neutral-600">Private Exclusive Tour</span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px] font-medium">Assigned Mountain Fleet:</span>
              <span className="text-sm font-bold text-neutral-900 block mt-0.5">{itinerary.vehicleName}</span>
              <span className="text-emerald-700 font-semibold">{itinerary.vehicleCategory} (Dedicated)</span>
            </div>
          </div>

          {/* Day-by-Day Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Detailed Day-by-Day Itinerary</span>
            </h3>

            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <div key={day.dayNumber} className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        D{day.dayNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-950">{day.title}</h4>
                        <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{day.destination}</span>
                          {day.serviceName && <span>· {day.serviceName}</span>}
                        </span>
                      </div>
                    </div>

                    {day.hotelName && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium flex items-center gap-1 mt-1 sm:mt-0">
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        <span>Stay: {day.hotelName} ({day.roomCategoryName || 'Deluxe'} · {day.mealPlan || 'CP'})</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                    {day.description}
                  </p>

                  {day.sightseeingPoints && day.sightseeingPoints.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase">Key Spots:</span>
                      {day.sightseeingPoints.map((pt, idx) => (
                        <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md border border-neutral-200 font-medium">
                          {pt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons & Special Permits (if any) */}
          {itinerary.addons && itinerary.addons.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Special Excursions & Permits Included</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {itinerary.addons.map((addon) => (
                  <div key={addon.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex justify-between items-center">
                    <span className="font-semibold text-amber-950">{addon.name}</span>
                    <span className="font-bold text-neutral-900">
                      ₹{addon.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary Card */}
          <div className="p-6 rounded-3xl bg-neutral-950 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl print:bg-white print:text-neutral-900 print:border print:border-neutral-300">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold block">
                Total Tour Package Quotation
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ₹{itinerary.pricing.grandTotal.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 print:text-neutral-600">
                All Inclusive Quote · Private Cab + Hotel Stays + Permits + Driver Hill Allowances + GST
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="text-xs text-neutral-300 space-y-1 bg-white/10 p-4 rounded-2xl w-full sm:w-auto print:border print:border-neutral-200 print:text-neutral-800">
                <div className="flex justify-between gap-6">
                  <span>Cab & Sightseeing Services:</span>
                  <span className="font-bold">₹{itinerary.pricing.vehicleTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Hotel & Resort Stays:</span>
                  <span className="font-bold">₹{itinerary.pricing.hotelTotal.toLocaleString('en-IN')}</span>
                </div>
                {itinerary.pricing.addonsTotal > 0 && (
                  <div className="flex justify-between gap-6">
                    <span>Permits & Add-ons:</span>
                    <span className="font-bold">₹{itinerary.pricing.addonsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between gap-6 border-t border-white/20 pt-1 text-emerald-400 font-semibold print:text-emerald-700">
                  <span>Taxes & GST (5%):</span>
                  <span>₹{itinerary.pricing.gstAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-3">
              <h4 className="font-bold text-neutral-900 flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Package Inclusions</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-700">
                {itinerary.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-3">
              <h4 className="font-bold text-neutral-900 flex items-center gap-1.5 text-amber-700">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>Package Exclusions</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-700">
                {itinerary.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">✕</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Terms & Bank Details Footer */}
          <div className="border-t border-neutral-200 pt-6 space-y-3 text-xs text-neutral-500">
            <div className="font-semibold text-neutral-800">Booking Terms & Cancellation:</div>
            <p className="leading-relaxed whitespace-pre-line">
              {itinerary.termsAndConditions}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-neutral-400">
              <span>Spiky Cabs Official Quotation · Reg: WB/DARJ/TO-4491 · Authorized Hill Transporters</span>
              <span>Valid for 7 days from quotation generation date</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden on Print) */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-neutral-500 text-center sm:text-left">
            Export quotation directly as an official branded PDF file or share via WhatsApp
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>Download Official PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
