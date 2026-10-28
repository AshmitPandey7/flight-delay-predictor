import { useState } from 'react';
import { X, GraduationCap, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFacultyDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_faculty_demo: true })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.detail || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = '/api/user/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040408]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0e0e18] border border-purple-500/25 rounded-3xl shadow-2xl overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-500/15 flex items-center justify-between bg-[#0a0a14]">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {tab === 'login' ? 'Sign In to AeroProb' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access saved flights, recent searches, and personalized travel preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Faculty Demo Mode Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/30 text-left">
            <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm mb-1.5">
              <GraduationCap size={18} className="text-purple-400" />
              <span>Faculty & Demonstration Quick Mode</span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Instantly authenticate as <strong>Dr. Sharma (Faculty Demo)</strong> with pre-configured Chennai to Mumbai route, travel preferences, and saved predictions.
            </p>
            <button
              onClick={handleFacultyDemo}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Launch 1-Click Faculty Demo</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-purple-500/15 w-full"></div>
            <span className="bg-[#0e0e18] px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">or sign in manually</span>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. / Mr. / Ms."
                    className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            {tab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}