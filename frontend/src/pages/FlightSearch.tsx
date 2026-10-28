import { useState, useEffect } from 'react';
import {
  Search, Sparkles, ShieldCheck,
  AlertTriangle, ExternalLink, Bookmark,
  BookmarkCheck, Filter, Plane, ChevronDown, ChevronUp
} from 'lucide-react';
import FlightSearchWidget from '../components/FlightSearchWidget';
import FlightCompareModal from '../components/FlightCompareModal';

interface FlightSearchProps {
  initialParams?: any;
  user?: any;
  onSaveFlight?: (flight: any) => void;
}

export default function FlightSearch({ initialParams, onSaveFlight }: FlightSearchProps) {
  const [searchParams, setSearchParams] = useState<any>(initialParams || {
    origin: 'MAA',
    destination: 'BOM',
    departure_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    trip_type: 'one-way',
    cabin_class: 'Economy',
    passengers: { adults: 1, children: 0, infants: 0 },
    special_fare: 'regular'
  });

  const [isModifyingSearch, setIsModifyingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResponse, setSearchResponse] = useState<any>(null);

  // Filters & Sorting
  const [sortBy, setSortBy] = useState<'smart' | 'price' | 'duration' | 'risk' | 'departure'>('smart');
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const maxPrice = 30000;

  // Comparison Dock
  const [comparedFlightIds, setComparedFlightIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Expanded math calculation toggles
  const [expandedMathIds, setExpandedMathIds] = useState<Record<string, boolean>>({});

  // Saved flights state
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const executeSearch = async (params: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResponse(data);
        setIsModifyingSearch(false);
        // Save search to user history
        fetch('/api/user/save-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: params.origin,
            origin_city: data.origin?.city || params.origin,
            destination: params.destination,
            destination_city: data.destination?.city || params.destination,
            date: params.departure_date
          })
        }).catch(() => {});
      } else {
        setError(data.detail || 'Failed to search flights');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(searchParams);
  }, []);

  const handleWidgetSearch = (newParams: any) => {
    setSearchParams(newParams);
    executeSearch(newParams);
  };

  const toggleCompare = (flightId: string) => {
    if (comparedFlightIds.includes(flightId)) {
      setComparedFlightIds(comparedFlightIds.filter(id => id !== flightId));
    } else {
      if (comparedFlightIds.length >= 4) {
        alert("You can compare up to 4 flights simultaneously.");
        return;
      }
      setComparedFlightIds([...comparedFlightIds, flightId]);
    }
  };

  const toggleMath = (flightId: string) => {
    setExpandedMathIds(prev => ({ ...prev, [flightId]: !prev[flightId] }));
  };

  const handleSaveToggle = (flight: any) => {
    const isSaved = !!savedIds[flight.id];
    setSavedIds(prev => ({ ...prev, [flight.id]: !isSaved }));
    if (!isSaved) {
      fetch('/api/user/save-flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flight_id: flight.id, flight_data: flight })
      }).catch(() => {});
      if (onSaveFlight) onSaveFlight(flight);
    }
  };

  // Filter & Sort Logic
  const rawFlights = searchResponse?.flights || [];
  
  const filteredFlights = rawFlights.filter((fl: any) => {
    if (selectedStops.length > 0 && !selectedStops.includes(fl.stops)) return false;
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(fl.airline?.code)) return false;
    if (selectedRiskLevels.length > 0 && !selectedRiskLevels.includes(fl.prediction?.risk_level)) return false;
    if (fl.price_inr > maxPrice) return false;
    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a: any, b: any) => {
    if (sortBy === 'smart') return (b.recommendation_score || 0) - (a.recommendation_score || 0);
    if (sortBy === 'price') return a.price_inr - b.price_inr;
    if (sortBy === 'duration') return a.duration_minutes - b.duration_minutes;
    if (sortBy === 'risk') return a.prediction.probabilities_raw.delayed - b.prediction.probabilities_raw.delayed;
    if (sortBy === 'departure') return a.dep_time.localeCompare(b.dep_time);
    return 0;
  });

  const comparedFlights = rawFlights.filter((f: any) => comparedFlightIds.includes(f.id));

  return (
    <div className="w-full min-h-screen bg-[#07070b] text-slate-100 text-left pb-28">
      
      {/* Top Search Bar & Summary Strip */}
      <div className="border-b border-purple-500/15 bg-[#090912]/90 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-300 border border-purple-500/30">
                <Plane size={20} className="transform -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-100">
                    {searchResponse?.origin?.city || searchParams.origin}
                  </h1>
                  <span className="text-purple-400 font-semibold">→</span>
                  <h1 className="text-lg font-bold text-slate-100">
                    {searchResponse?.destination?.city || searchParams.destination}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                    {searchParams.cabin_class}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Departure: {searchParams.departure_date} • {searchParams.passengers?.adults || 1} Adult
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModifyingSearch(!isModifyingSearch)}
              className="px-5 py-2.5 bg-[#121220] hover:bg-[#1a1a2e] text-purple-200 text-xs font-semibold rounded-xl border border-purple-500/30 transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Search size={14} className="text-purple-400" />
              <span>{isModifyingSearch ? 'Close Search Bar' : 'Modify Search'}</span>
            </button>
          </div>

          {/* Expandable Search Widget */}
          {isModifyingSearch && (
            <div className="mt-4 pt-4 border-t border-purple-500/15">
              <FlightSearchWidget
                defaultOrigin={searchParams.origin}
                defaultDestination={searchParams.destination}
                defaultCabinClass={searchParams.cabin_class}
                onSearch={handleWidgetSearch}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Fast Insights Highlights Strip */}
        {searchResponse && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-[#0e0e18] border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Lowest Available Fare</span>
                <span className="text-2xl font-black text-slate-100">
                  ₹{searchResponse.metadata?.cheapest_price?.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                Best Price
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e18] border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Fastest Journey Duration</span>
                <span className="text-2xl font-black text-slate-100">
                  {Math.floor(searchResponse.metadata?.fastest_duration_minutes / 60)}h {searchResponse.metadata?.fastest_duration_minutes % 60}m
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 font-bold">
                Non-Stop
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e18] border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Lowest Disruption Risk</span>
                <span className="text-2xl font-black text-emerald-400">
                  {searchResponse.metadata?.lowest_delay_risk_pct}% Risk
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-purple-400" />
                <span>Calibrated ML</span>
              </span>
            </div>
          </div>
        )}

        {/* Loading & Error States */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-slate-400 text-sm">Evaluating real-time delay probabilities for all scheduled flights...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 my-8">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle size={18} />
              <span>Flight Search Error</span>
            </div>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT FILTERS SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-5 rounded-2xl bg-[#0e0e18] border border-purple-500/20 space-y-6">
                <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <Filter size={16} className="text-purple-400" />
                    <span>Filter Flights</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStops([]);
                      setSelectedAirlines([]);
                      setSelectedRiskLevels([]);
                    }}
                    className="text-xs text-purple-400 hover:underline cursor-pointer font-semibold"
                  >
                    Reset
                  </button>
                </div>

                {/* Stops Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Stops
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 0, label: 'Non-Stop Only' },
                      { id: 1, label: '1 Stop' }
                    ].map((st) => (
                      <label key={st.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStops.includes(st.id)}
                          onChange={() => {
                            if (selectedStops.includes(st.id)) {
                              setSelectedStops(selectedStops.filter(s => s !== st.id));
                            } else {
                              setSelectedStops([...selectedStops, st.id]);
                            }
                          }}
                          className="rounded border-purple-500/30 bg-[#07070e] text-purple-600 focus:ring-purple-500"
                        />
                        <span>{st.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delay Risk Level Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Disruption Risk Level
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'Low', label: 'Low Risk (<25% delay)', color: 'text-emerald-400' },
                      { id: 'Moderate', label: 'Moderate Risk (25-45%)', color: 'text-amber-400' },
                      { id: 'High', label: 'High Risk (>45%)', color: 'text-rose-400' }
                    ].map((risk) => (
                      <label key={risk.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRiskLevels.includes(risk.id)}
                          onChange={() => {
                            if (selectedRiskLevels.includes(risk.id)) {
                              setSelectedRiskLevels(selectedRiskLevels.filter(r => r !== risk.id));
                            } else {
                              setSelectedRiskLevels([...selectedRiskLevels, risk.id]);
                            }
                          }}
                          className="rounded border-purple-500/30 bg-[#07070e] text-purple-600 focus:ring-purple-500"
                        />
                        <span className={risk.color}>{risk.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Airlines Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Airlines
                  </h4>
                  <div className="space-y-2">
                    {[
                      { code: '6E', name: 'IndiGo' },
                      { code: 'AI', name: 'Air India' },
                      { code: 'UK', name: 'Vistara' },
                      { code: 'QP', name: 'Akasa Air' },
                      { code: 'SG', name: 'SpiceJet' }
                    ].map((air) => (
                      <label key={air.code} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(air.code)}
                          onChange={() => {
                            if (selectedAirlines.includes(air.code)) {
                              setSelectedAirlines(selectedAirlines.filter(c => c !== air.code));
                            } else {
                              setSelectedAirlines([...selectedAirlines, air.code]);
                            }
                          }}
                          className="rounded border-purple-500/30 bg-[#07070e] text-purple-600 focus:ring-purple-500"
                        />
                        <span>{air.name} ({air.code})</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT FLIGHT RESULTS & SORTING */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* SORTING TAB BAR (MakeMyTrip Style) */}
              <div className="flex flex-wrap items-center gap-2 bg-[#0e0e18] border border-purple-500/20 p-1.5 rounded-2xl text-xs font-semibold">
                {[
                  { id: 'smart', label: '⚡ Smart Choice', desc: 'Best Value & Reliability' },
                  { id: 'price', label: '💰 Cheapest First', desc: 'Lowest Fare' },
                  { id: 'duration', label: '⏱️ Fastest First', desc: 'Shortest Journey' },
                  { id: 'risk', label: '🛡️ Lowest Delay Risk', desc: 'Highest On-Time %' },
                  { id: 'departure', label: '🛫 Earliest Departure', desc: 'By Schedule' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
                    }`}
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Flight Cards List */}
              {sortedFlights.length > 0 ? (
                sortedFlights.map((fl: any) => {
                  const isMathExpanded = !!expandedMathIds[fl.id];
                  const isSaved = !!savedIds[fl.id];
                  const isCompared = comparedFlightIds.includes(fl.id);

                  return (
                    <div
                      key={fl.id}
                      className={`p-6 rounded-3xl bg-[#0e0e18] border transition hover:border-purple-500/40 relative overflow-hidden ${
                        fl.is_smart_recommended
                          ? 'border-purple-500/80 shadow-xl shadow-purple-950/30 ring-1 ring-purple-500/30'
                          : 'border-purple-500/15'
                      }`}
                    >
                      {/* Smart Recommendation Banner */}
                      {fl.is_smart_recommended && (
                        <div className="mb-4 -mx-6 -mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-500/20 via-violet-500/10 to-transparent border-b border-purple-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                            <Sparkles size={14} className="text-purple-400" />
                            <span>AeroProb Smart Choice</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {fl.recommendation_reason}
                          </p>
                        </div>
                      )}

                      {/* Flight Main Header & Schedule Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* Airline & Flight Info (3 Cols) */}
                        <div className="md:col-span-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#07070e] border border-purple-500/25 flex items-center justify-center text-purple-300 font-bold text-sm shadow">
                            {fl.airline?.code}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-100 text-sm">{fl.airline?.name}</h3>
                            <p className="text-xs text-slate-400 font-medium">
                              {fl.flight_number} • {fl.aircraft}
                            </p>
                          </div>
                        </div>

                        {/* Timing & Route (5 Cols) */}
                        <div className="md:col-span-5 flex items-center justify-between px-2">
                          {/* Departure */}
                          <div className="text-left">
                            <span className="text-2xl font-black text-slate-100">{fl.dep_time}</span>
                            <span className="text-xs font-bold text-slate-300 block">{fl.origin?.city}</span>
                            <span className="text-[11px] text-slate-400">{fl.origin?.iata} • {fl.origin?.terminal}</span>
                          </div>

                          {/* Duration & Stops graphic */}
                          <div className="flex flex-col items-center px-4">
                            <span className="text-xs font-semibold text-slate-400 mb-1">{fl.duration}</span>
                            <div className="w-24 sm:w-32 h-0.5 bg-purple-900/50 relative flex items-center justify-center">
                              <Plane size={14} className="text-purple-400 transform rotate-90 absolute" />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1">{fl.stop_details}</span>
                          </div>

                          {/* Arrival */}
                          <div className="text-right">
                            <span className="text-2xl font-black text-slate-100">{fl.arr_time}</span>
                            <span className="text-xs font-bold text-slate-300 block">{fl.destination?.city}</span>
                            <span className="text-[11px] text-slate-400">{fl.destination?.iata} • {fl.destination?.terminal}</span>
                          </div>
                        </div>

                        {/* Price & Primary CTA (4 Cols) */}
                        <div className="md:col-span-4 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-purple-500/15 pt-4 md:pt-0 md:pl-6">
                          <div className="text-right">
                            <span className="text-xs text-slate-400">Total Fare</span>
                            <div className="text-2xl font-black text-slate-100">
                              ₹{fl.price_inr?.toLocaleString('en-IN')}
                            </div>
                            <span className="text-[11px] text-emerald-400 font-medium">Free Web Check-in</span>
                          </div>

                          <div className="flex items-center gap-2 mt-3 w-full justify-end">
                            <button
                              onClick={() => handleSaveToggle(fl)}
                              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                                isSaved
                                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                  : 'bg-[#07070e] border-purple-500/20 text-slate-400 hover:text-white'
                              }`}
                              title={isSaved ? 'Saved to wishlist' : 'Save flight'}
                            >
                              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                            </button>

                            {/* External booking button fixed with valid MMT search parameters and label */}
                            <a
                              href={fl.booking_links?.makemytrip}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-purple-600/25 cursor-pointer"
                              title="Open actual MakeMyTrip search results in a new tab"
                            >
                              <span>Search on MakeMyTrip (External)</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>

                      </div>

                      {/* INTEGRATED DELAY PROBABILITY ENGINE CARD */}
                      <div className="mt-5 pt-4 border-t border-purple-500/15 bg-[#07070e]/80 -mx-6 -mb-6 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Disruption Probability:
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              fl.prediction?.risk_level === 'Low'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : fl.prediction?.risk_level === 'Moderate'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {fl.prediction?.risk_level} Risk
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-purple-300 transition">
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={() => toggleCompare(fl.id)}
                                className="rounded border-purple-500/30 bg-[#07070e] text-purple-600 focus:ring-purple-500"
                              />
                              <span className="font-semibold">Compare Flight</span>
                            </label>

                            <button
                              onClick={() => toggleMath(fl.id)}
                              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Statistical Details</span>
                              {isMathExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Segmented 3-Way Probability Bar */}
                        <div className="mt-3 space-y-1.5">
                          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-purple-500/20 shadow-inner">
                            <div
                              style={{ width: `${fl.prediction?.probabilities?.ontime}%` }}
                              className="bg-emerald-500 h-full transition-all duration-500"
                              title={`On-Time: ${fl.prediction?.probabilities?.ontime}%`}
                            ></div>
                            <div
                              style={{ width: `${fl.prediction?.probabilities?.delayed}%` }}
                              className="bg-amber-500 h-full transition-all duration-500"
                              title={`Delayed (>15m): ${fl.prediction?.probabilities?.delayed}%`}
                            ></div>
                            <div
                              style={{ width: `${fl.prediction?.probabilities?.cancelled}%` }}
                              className="bg-rose-500 h-full transition-all duration-500"
                              title={`Cancelled: ${fl.prediction?.probabilities?.cancelled}%`}
                            ></div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <span>On-Time: <strong className="text-emerald-400">{fl.prediction?.probabilities?.ontime}%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                              <span>Delayed (&gt;15m): <strong className="text-amber-400">{fl.prediction?.probabilities?.delayed}%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                              <span>Cancelled: <strong className="text-rose-400">{fl.prediction?.probabilities?.cancelled}%</strong></span>
                            </div>
                            <div className="text-slate-400">
                              Expected Delay: <strong className="text-slate-200">+{fl.prediction?.expected_delay_minutes}m</strong>
                            </div>
                          </div>
                        </div>

                        {/* Primary Risk Driver */}
                        <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
                          <span className="font-semibold text-slate-300">Key Attribution Factor:</span>
                          <span className="text-slate-200">{fl.prediction?.major_risk_factor}</span>
                        </div>

                        {/* Expandable Mathematical Breakdown */}
                        {isMathExpanded && (
                          <div className="mt-4 pt-4 border-t border-purple-500/15 text-xs space-y-3 bg-[#0c0c16] p-4 rounded-2xl animate-in fade-in duration-150">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">Bayes' Theorem & Inference Breakdown</span>
                              <span className="text-[10px] text-purple-400">Calibrated Logistic Regression & DGCA Priors</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="p-2.5 rounded-xl bg-[#07070e] border border-purple-500/20">
                                <span className="text-[10px] text-slate-400 block">On-Time 95% Wilson CI</span>
                                <span className="font-bold text-emerald-400">
                                  {fl.prediction?.confidence_intervals?.ontime ? `[${fl.prediction.confidence_intervals.ontime[0] * 100}%, ${fl.prediction.confidence_intervals.ontime[1] * 100}%]` : 'N/A'}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[#07070e] border border-purple-500/20">
                                <span className="text-[10px] text-slate-400 block">Delay 95% Wilson CI</span>
                                <span className="font-bold text-amber-400">
                                  {fl.prediction?.confidence_intervals?.delayed ? `[${fl.prediction.confidence_intervals.delayed[0] * 100}%, ${fl.prediction.confidence_intervals.delayed[1] * 100}%]` : 'N/A'}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[#07070e] border border-purple-500/20">
                                <span className="text-[10px] text-slate-400 block">Live Origin Weather</span>
                                <span className="font-bold text-slate-200">
                                  {fl.prediction?.weather_summary?.temp_c}°C, Wind {fl.prediction?.weather_summary?.wind_kmh} km/h
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400">
                              {fl.prediction?.confidence_badge}
                            </p>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-[#0e0e18] border border-purple-500/20 rounded-3xl space-y-3">
                  <Plane size={36} className="mx-auto text-purple-400/50 transform -rotate-45" />
                  <h3 className="text-base font-bold text-slate-200">No Flights Match Your Filters</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try adjusting the stop count, airlines, or disruption risk thresholds in the filter sidebar.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* FLOATING COMPARISON DOCK */}
      {comparedFlightIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a14]/95 border-t border-purple-500/25 p-4 backdrop-blur-xl shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-slate-100">
                Comparing {comparedFlightIds.length} Flight{comparedFlightIds.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                {comparedFlights.map((f: any) => (
                  <span key={f.id} className="text-xs px-2.5 py-1 rounded-xl bg-[#141424] border border-purple-500/30 text-purple-200 flex items-center gap-1.5">
                    <strong>{f.flight_number}</strong>
                    <button
                      onClick={() => toggleCompare(f.id)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setComparedFlightIds([])}
                className="text-xs text-slate-400 hover:text-slate-200 font-medium px-3 py-1.5 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition cursor-pointer"
              >
                View Side-by-Side Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <FlightCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        flights={comparedFlights}
        onRemoveFlight={(id) => setComparedFlightIds(comparedFlightIds.filter(x => x !== id))}
      />

    </div>
  );
}