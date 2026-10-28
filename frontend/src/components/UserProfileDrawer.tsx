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
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end text-left">
      <div className="w-full max-w-md bg-[#121214] border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{user?.name || 'Traveler'}</h3>
                {user?.is_demo && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-medium">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">{user?.email || 'traveler@aero.local'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings size={13} />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'searches'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock size={13} />
            <span>Searches ({user?.recent_searches?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'saved'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark size={13} />
            <span>Saved ({user?.saved_flights?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck size={13} />
            <span>Predictions</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Autofill Default Routing
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Preferred Origin</label>
                    <select
                      value={preferredOrigin}
                      onChange={(e) => setPreferredOrigin(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
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
                    <label className="block text-xs text-zinc-300 mb-1">Preferred Destination</label>
                    <select
                      value={preferredDest}
                      onChange={(e) => setPreferredDest(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
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
                <label className="block text-xs text-zinc-300 mb-1">Preferred Airline</label>
                <select
                  value={preferredAirline}
                  onChange={(e) => setPreferredAirline(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                >
                  <option value="6E">IndiGo (6E) - High OTP</option>
                  <option value="AI">Air India (AI)</option>
                  <option value="UK">Vistara (UK) - Premium Service</option>
                  <option value="QP">Akasa Air (QP)</option>
                  <option value="SG">SpiceJet (SG)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Default Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <span>Save Travel Preferences</span>
                )}
              </button>
            </form>
          )}

          {activeTab === 'searches' && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
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
                    className="p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-lg cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <span>{s.origin_city || s.origin}</span>
                        <span className="text-zinc-500">→</span>
                        <span>{s.destination_city || s.destination}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {s.origin} to {s.destination} • {s.date}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {s.searched_at}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">No recent searches yet.</p>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Bookmarked Flights Wishlist
              </span>
              {user?.saved_flights?.length > 0 ? (
                user.saved_flights.map((fl: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{fl.flight_number}</span>
                        <span className="text-xs text-zinc-400 font-medium">{fl.airline}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {fl.route} at {fl.dep_time} • ₹{fl.price_inr?.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {fl.ontime_pct}% On-Time
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {fl.risk_level} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">No flights bookmarked yet.</p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Delay Prediction History
              </span>
              {user?.prediction_history?.length > 0 ? (
                user.prediction_history.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{item.flight}</span>
                      <span className="text-[10px] text-zinc-500">{item.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-850 text-center text-xs">
                      <div className="bg-zinc-900 p-1 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">On-Time</span>
                        <span className="font-semibold text-emerald-400">{item.ontime_prob}</span>
                      </div>
                      <div className="bg-zinc-900 p-1 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Delayed</span>
                        <span className="font-semibold text-amber-400">{item.delayed_prob}</span>
                      </div>
                      <div className="bg-zinc-900 p-1 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Cancelled</span>
                        <span className="font-semibold text-rose-400">{item.cancelled_prob}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">No predictions logged yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Role: <span className="text-zinc-200 font-medium">{user?.role || 'Guest'}</span>
          </div>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-md hover:bg-zinc-900 transition cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}