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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end text-left">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">{user?.name || 'Traveler'}</h3>
                {user?.is_demo && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-semibold">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{user?.email || 'traveler@aero.local'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'preferences'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings size={14} />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'searches'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={14} />
            <span>Searches ({user?.recent_searches?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'saved'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved ({user?.saved_flights?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'history'
                ? 'border-sky-500 text-sky-400 font-semibold'
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition cursor-pointer"
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
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 group-hover:text-sky-400">
                        <span>{s.origin_city || s.origin}</span>
                        <span className="text-slate-500">→</span>
                        <span>{s.destination_city || s.destination}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {s.origin} to {s.destination} • {s.date}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">
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
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-400">{fl.flight_number}</span>
                        <span className="text-xs text-slate-300 font-medium">{fl.airline}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {fl.route} at {fl.dep_time} • ₹{fl.price_inr?.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {fl.ontime_pct}% On-Time
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.flight}</span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-900 text-center text-xs">
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
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Role: <span className="text-slate-200 font-medium">{user?.role || 'Guest'}</span>
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
