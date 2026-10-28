import { useState } from 'react';
import { X, GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#121214] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div>
            <h2 className="text-base font-bold text-white">
              {tab === 'login' ? 'Sign In to AeroProb' : 'Create an Account'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Access saved flights, recent searches, and personalized travel preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Faculty Demo Mode Banner */}
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-left">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs mb-1">
              <GraduationCap size={16} />
              <span>Faculty & Demonstration Quick Mode</span>
            </div>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Authenticate instantly as <strong>Dr. Sharma (Faculty Evaluator)</strong> with pre-configured Chennai to Mumbai route and travel history.
            </p>
            <button
              onClick={handleFacultyDemo}
              disabled={loading}
              className="w-full py-2 px-3 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <span>Launch 1-Click Faculty Demo</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full"></div>
            <span className="bg-[#121214] px-2.5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">or continue with email</span>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-zinc-500" size={15} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. / Dr. / Name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-zinc-500" size={15} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-zinc-500" size={15} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg text-xs transition border border-zinc-700 cursor-pointer"
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-zinc-400">
            {tab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-white hover:underline font-medium cursor-pointer"
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
                  className="text-white hover:underline font-medium cursor-pointer"
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