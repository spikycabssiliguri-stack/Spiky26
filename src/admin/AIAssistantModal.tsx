import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Compass, 
  FileText, 
  Search, 
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { generateWithGemini, checkGeminiStatus } from '../services/api';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal = ({ isOpen, onClose }: AIAssistantModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ isConfigured: boolean; model?: string; message?: string } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Quick preset templates
  const presetTemplates = [
    {
      title: 'Package Itinerary',
      icon: Compass,
      prompt: 'Write an engaging, detailed 1-day itinerary description for a trip to Yumthang Valley and Zero Point in North Sikkim. Include altitude, morning departure advice, photo spots, and clothing recommendations.'
    },
    {
      title: 'SEO Title & Meta',
      icon: Search,
      prompt: 'Generate 3 high-converting SEO Titles (under 60 characters) and 3 Meta Descriptions (under 155 characters) for a Himalayan cab package service in Darjeeling and Gangtok.'
    },
    {
      title: 'Tour Overview',
      icon: FileText,
      prompt: 'Write a compelling, evocative 3-paragraph tour overview for a 5-Day Darjeeling & Gangtok Family Holiday with private chauffeur and tea estate exploration.'
    },
    {
      title: 'Permit Advisory',
      icon: MessageSquare,
      prompt: 'Write a clear, reassuring travel advisory explaining the Protected Area Permit (PAP) requirements for visiting Tsomgo Lake, Baba Mandir, and Nathula Pass in Sikkim.'
    }
  ];

  const fetchStatus = async () => {
    setCheckingStatus(true);
    try {
      const data = await checkGeminiStatus();
      setStatus(data);
    } catch {
      setStatus({ isConfigured: false });
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (promptToUse?: string) => {
    const textPrompt = promptToUse || prompt;
    if (!textPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const data = await generateWithGemini(textPrompt.trim());
      if (data && data.text) {
        setResponse(data.text);
      } else {
        throw new Error('No text returned from Gemini API.');
      }
    } catch (err: any) {
      console.error('Gemini Assistant Error:', err);
      setError(err?.message || 'Failed to communicate with Google AI Studio Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#d2d2d7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#e5e5ea] flex items-center justify-between bg-[#fbfbfd]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                <span>Google AI Studio Gemini Assistant</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-medium px-2 py-0.5 rounded-full">
                  Server-Side
                </span>
              </h2>
              <p className="text-[11px] text-[#86868b]">
                Generate tour copy, itineraries, and SEO meta tags using Google Gemini API.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server Status Bar */}
        <div className="px-6 py-2.5 bg-[#f5f5f7] border-b border-[#e5e5ea] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            {checkingStatus ? (
              <span className="text-[#86868b] flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Checking API status...
              </span>
            ) : status?.isConfigured ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini API Active (Server-Side · Model: {status.model || 'gemini-2.5-flash'})
              </span>
            ) : (
              <span className="text-amber-800 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                GEMINI_API_KEY environment variable not detected
              </span>
            )}
          </div>

          <button
            onClick={fetchStatus}
            disabled={checkingStatus}
            className="text-[10px] text-[#0071e3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${checkingStatus ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Missing API Key Guidance Banner (if unconfigured) */}
          {status && !status.isConfigured && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Single Vercel Variable Required</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                To enable Gemini AI generation, add <strong>only one</strong> environment variable in your Vercel project:
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950 flex items-center justify-between">
                <span>GEMINI_API_KEY = [Google AI Studio API key]</span>
                <span className="text-[10px] text-amber-700 font-sans">Settings &gt; Environment Variables</span>
              </div>
              <p className="text-[10px] text-amber-700">
                No other variables or client-side keys are needed. The API key remains 100% secure on the server.
              </p>
            </div>
          )}

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
              Quick Templates
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetTemplates.map((tmpl, idx) => {
                const Icon = tmpl.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(tmpl.prompt);
                      handleGenerate(tmpl.prompt);
                    }}
                    className="p-3 rounded-xl border border-[#d2d2d7] hover:border-[#0071e3] hover:bg-[#f5f5f7] text-left transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <Icon className="w-4 h-4 text-[#0071e3] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-[#1d1d1f] block leading-snug">
                      {tmpl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-between">
              <span>Your Prompt</span>
              <span className="text-[11px] text-[#86868b] font-normal">
                Press Generate to call secure backend route
              </span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Gemini to draft an itinerary, rewrite tour highlights, generate SEO tags, or compose travel copy..."
                className="w-full text-xs p-3.5 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[10px] text-[#86868b]">
                Powered by Google GenAI SDK · Zero client-side API key exposure
              </span>

              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt.trim()}
                className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Generation Error</span>
                <p className="text-[11px] text-red-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Response Output */}
          {response && (
            <div className="space-y-2 pt-2 border-t border-[#e5e5ea]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Gemini Generated Content</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer border border-[#d2d2d7]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#86868b]" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-[#e5e5ea] text-xs text-[#1d1d1f] leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#fbfbfd] border-t border-[#e5e5ea] flex items-center justify-between text-[11px] text-[#86868b]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Backend Proxy Route: <code className="font-mono bg-[#f5f5f7] px-1 py-0.5 rounded text-[#1d1d1f]">/api/ai/generate</code>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
