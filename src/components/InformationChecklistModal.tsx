import { useState } from 'react';
import { X, CheckCircle2, Copy, Check, MessageCircle, Mail, HelpCircle, FileCheck, ArrowRight } from 'lucide-react';
import { COMPANY_INFO, PARTNERSHIP_INFO_CHECKLIST } from '../data/packagesData';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InformationChecklistModal = ({ isOpen, onClose }: ChecklistModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const checklistFullText = `Information Checklist for Spiky Cabs:
${PARTNERSHIP_INFO_CHECKLIST.map((item, idx) => `${item.category}\n${item.details}\n`).join('\n')}
Spiky Cabs Contact:
Phone: ${COMPANY_INFO.phone}
Email: ${COMPANY_INFO.email}
Address: ${COMPANY_INFO.address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(checklistFullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 sm:p-7 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Response to Owner Request</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                What Additional Information We Need From You
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                We have reviewed your 4 PDF itineraries and created complete cab packages. Here is the checklist of additional details you can supply to finalize your platform.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition-colors shrink-0"
              aria-label="Close Checklist Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-4">
          {PARTNERSHIP_INFO_CHECKLIST.map((item, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-neutral-900 mb-1">
                    {item.category.replace(/^[0-9.]+\s*/, '')}
                  </h3>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Prompt regarding logo & permits */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-950">
            <span className="font-bold">Pro Tip for Sikkim & Bhutan Permits:</span> If you have a specific official permit collection office or document upload WhatsApp number for voter IDs/passports (Tsomgo Lake, Nathula, Yumthang), we can wire up an automated document upload guide for your passengers.
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 py-2 px-3.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Question List'}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${COMPANY_INFO.email}?subject=Spiky%20Cabs%20Information%20Update`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 py-2 px-3.5 rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Email Updates</span>
            </a>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#005bb5] py-2 px-4 rounded-lg transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
