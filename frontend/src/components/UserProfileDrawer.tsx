import { useState } from 'react';
import { X, Settings, Clock, Bookmark, LogOut, Check, ShieldCheck } from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdatePreferences: (prefs: any) => void;
  onSelectSearch: (search: any) => void;
  onLogout: () => void;
}

export default function UserProfileDrawer({
  isOpen,
  onClose,
  user,
  onUpdatePreferences,
  onSelectSearch,
  onLogout
}: UserProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'searches' | 'saved' | 'history'>('preferences');
  
  // Local state for preferences
  const [preferredOrigin, setPreferredOrigin] = useState(user?.preferences?.preferred_origin || 'MAA');
  const [preferredDest, setPreferredDest] = useState(user?.preferences?.preferred_destination || 'BOM');
  const [cabinClass, setCabinClass] = useState(user?.preferences?.cabin_class || 'Economy');
  const [preferredAirline, setPreferredAirline] = useState(user?.preferences?.preferred_airline || '6E');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      preferred_origin: preferredOrigin,
      preferred_destination: preferredDest,
      cabin_class: cabinClass,
      preferred_airline: preferredAirline,
      default_adults: 1,
      special_fare: 'regular'
    };
    onUpdatePreferences(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040408]/80 backdrop-blur-md flex justify-end text-left">
      <div className="w-full max-w-md bg-[#0e0e18] border-l border-purple-500/20 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-purple-500/15 flex items-center justify-between bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-600/30 border border-purple-400/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">{user?.name || 'Traveler'}</h3>
                {user?.is_demo && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/35 text-[10px] font-semibold">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{user?.email || 'traveler@aero.local'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-500/15 bg-[#0a0a14]/60 px-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings size={14} />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'searches'
                ? 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={14} />
            <span>Searches ({user?.recent_searches?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'saved'
                ? 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved ({user?.saved_flights?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Predictions</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Autofill Default Routing
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Preferred Origin</label>
                    <select
                      value={preferredOrigin}
                      onChange={(e) => setPreferredOrigin(e.target.value)}
                      className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="MAA">Chennai (MAA)</option>
                      <option value="BOM">Mumbai (BOM)</option>
                      <option value="DEL">Delhi (DEL)</option>
                      <option value="BLR">Bengaluru (BLR)</option>
                      <option value="HYD">Hyderabad (HYD)</option>
                      <option value="CCU">Kolkata (CCU)</option>
                      <option value="AMD">Ahmedabad (AMD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Preferred Destination</label>
                    <select
                      value={preferredDest}
                      onChange={(e) => setPreferredDest(e.target.value)}
                      className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="BOM">Mumbai (BOM)</option>
                      <option value="DEL">Delhi (DEL)</option>
                      <option value="MAA">Chennai (MAA)</option>
                      <option value="BLR">Bengaluru (BLR)</option>
                      <option value="HYD">Hyderabad (HYD)</option>
                      <option value="AMD">Ahmedabad (AMD)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Preferred Airline</label>
                <select
                  value={preferredAirline}
                  onChange={(e) => setPreferredAirline(e.target.value)}
                  className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="6E">IndiGo (6E) - High OTP</option>
                  <option value="AI">Air India (AI)</option>
                  <option value="UK">Vistara (UK) - Premium Service</option>
                  <option value="QP">Akasa Air (QP)</option>
                  <option value="SG">SpiceJet (SG)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Default Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full bg-[#07070d] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <span>Save Travel Preferences</span>
                )}
              </button>
            </form>
          )}

          {activeTab === 'searches' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Recent Route Searches
              </span>
              {user?.recent_searches?.length > 0 ? (
                user.recent_searches.map((s: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectSearch(s);
                      onClose();
                    }}
                    className="p-3.5 bg-[#07070d] border border-purple-500/15 hover:border-purple-500/40 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 group-hover:text-purple-300">
                        <span>{s.origin_city || s.origin}</span>
                        <span className="text-purple-400">→</span>
                        <span>{s.destination_city || s.destination}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {s.origin} to {s.destination} • {s.date}
                      </p>
                    </div>
                    <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                      {s.searched_at}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No recent searches yet.</p>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Bookmarked Flights Wishlist
              </span>
              {user?.saved_flights?.length > 0 ? (
                user.saved_flights.map((fl: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#07070d] border border-purple-500/15 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">{fl.flight_number}</span>
                        <span className="text-xs text-slate-300 font-medium">{fl.airline}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {fl.route} at {fl.dep_time} • ₹{fl.price_inr?.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {fl.ontime_pct}% On-Time
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {fl.risk_level} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No flights bookmarked yet.</p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Delay Prediction History
              </span>
              {user?.prediction_history?.length > 0 ? (
                user.prediction_history.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-[#07070d] border border-purple-500/15 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.flight}</span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-purple-500/10 text-center text-xs">
                      <div className="bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                        <span className="text-[10px] text-slate-400 block">On-Time</span>
                        <span className="font-bold text-emerald-400">{item.ontime_prob}</span>
                      </div>
                      <div className="bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                        <span className="text-[10px] text-slate-400 block">Delayed</span>
                        <span className="font-bold text-amber-400">{item.delayed_prob}</span>
                      </div>
                      <div className="bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                        <span className="text-[10px] text-slate-400 block">Cancelled</span>
                        <span className="font-bold text-rose-400">{item.cancelled_prob}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No predictions logged yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-purple-500/15 bg-[#0a0a14] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Role: <span className="text-purple-300 font-semibold">{user?.role || 'Guest'}</span>
          </div>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}