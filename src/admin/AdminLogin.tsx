import { useState } from 'react';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-4 selection:bg-[#0071e3] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5ea] shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#2997ff]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            Spiky Cabs CMS
          </h1>
          <p className="text-xs text-[#86868b]">
            Sign in to manage itineraries, pages, fleet, and site content.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
              Username or Admin Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or email"
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
              />
              <User className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-2.5 px-4 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#f5f5f7] text-[11px] text-[#86868b] text-center space-y-1">
          <div className="flex items-center justify-center gap-1">
            <KeyRound className="w-3 h-3 text-[#0071e3]" />
            <span>Default initial password: <strong className="text-[#1d1d1f] font-mono">spiky@2027</strong></span>
          </div>
          <p className="text-[10px] text-[#a1a1a6]">
            Password can be customized under Settings anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
