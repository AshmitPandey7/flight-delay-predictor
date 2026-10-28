import { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, Search, Sparkles } from 'lucide-react';

interface FlightSearchWidgetProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    trip_type: string;
    cabin_class: string;
    passengers: { adults: number; children: number; infants: number };
    special_fare: string;
  }) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultCabinClass?: string;
}

interface AirportItem {
  iata: string;
  name: string;
  city: string;
  country: string;
}

const POPULAR_AIRPORTS: AirportItem[] = [
  { iata: "MAA", city: "Chennai", name: "Chennai International Airport", country: "IN" },
  { iata: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "IN" },
  { iata: "DEL", city: "New Delhi", name: "Indira Gandhi International Airport", country: "IN" },
  { iata: "BLR", city: "Bengaluru", name: "Kempegowda International Airport", country: "IN" },
  { iata: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport", country: "IN" },
  { iata: "CCU", city: "Kolkata", name: "Netaji Subhash Chandra Bose International Airport", country: "IN" },
  { iata: "AMD", city: "Ahmedabad", name: "Sardar Vallabh Patel International Airport", country: "IN" },
  { iata: "PNQ", city: "Pune", name: "Pune International Airport", country: "IN" },
  { iata: "GOI", city: "Goa (Dabolim)", name: "Goa Dabolim International Airport", country: "IN" },
  { iata: "JAI", city: "Jaipur", name: "Jaipur International Airport", country: "IN" },
  { iata: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh International Airport", country: "IN" },
  { iata: "COK", city: "Kochi", name: "Cochin International Airport", country: "IN" }
];

export default function FlightSearchWidget({
  onSearch,
  defaultOrigin = "MAA",
  defaultDestination = "BOM",
  defaultCabinClass = "Economy"
}: FlightSearchWidgetProps) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  
  // Selection
  const [origin, setOrigin] = useState<AirportItem>(
    POPULAR_AIRPORTS.find(a => a.iata === defaultOrigin) || POPULAR_AIRPORTS[0]
  );
  const [destination, setDestination] = useState<AirportItem>(
    POPULAR_AIRPORTS.find(a => a.iata === defaultDestination) || POPULAR_AIRPORTS[1]
  );
  
  // Date calculations (tomorrow default)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [depDate, setDepDate] = useState(tomorrowStr);
  const [returnDate, setReturnDate] = useState(nextWeekStr);
  const [cabinClass, setCabinClass] = useState(defaultCabinClass);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [specialFare, setSpecialFare] = useState('regular');

  // Popover States
  const [activeDropdown, setActiveDropdown] = useState<'origin' | 'destination' | 'travellers' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AirportItem[]>(POPULAR_AIRPORTS);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update when defaults change
  useEffect(() => {
    if (defaultOrigin) {
      const match = POPULAR_AIRPORTS.find(a => a.iata === defaultOrigin);
      if (match) setOrigin(match);
    }
    if (defaultDestination) {
      const match = POPULAR_AIRPORTS.find(a => a.iata === defaultDestination);
      if (match) setDestination(match);
    }
  }, [defaultOrigin, defaultDestination]);

  // Autocomplete fetcher
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(POPULAR_AIRPORTS);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/airports/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSearchResults(data);
          } else {
            // Filter local popular list
            const q = searchQuery.toLowerCase();
            setSearchResults(
              POPULAR_AIRPORTS.filter(a =>
                a.city.toLowerCase().includes(q) ||
                a.iata.toLowerCase().includes(q) ||
                a.name.toLowerCase().includes(q)
              )
            );
          }
        })
        .catch(() => {
          const q = searchQuery.toLowerCase();
          setSearchResults(
            POPULAR_AIRPORTS.filter(a =>
              a.city.toLowerCase().includes(q) ||
              a.iata.toLowerCase().includes(q)
            )
          );
        });
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectAirport = (airport: AirportItem) => {
    if (activeDropdown === 'origin') {
      setOrigin(airport);
    } else if (activeDropdown === 'destination') {
      setDestination(airport);
    }
    setActiveDropdown(null);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin: origin.iata,
      destination: destination.iata,
      departure_date: depDate,
      return_date: tripType === 'round-trip' ? returnDate : undefined,
      trip_type: tripType,
      cabin_class: cabinClass,
      passengers: { adults, children, infants },
      special_fare: specialFare
    });
  };

  // Helper date formatting
  const formatCardDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      const day = d.getDate();
      const month = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear().toString().slice(2);
      const weekday = d.toLocaleString('en-US', { weekday: 'long' });
      return { day, monthYear: `${month}'${year}`, weekday };
    } catch {
      return { day: 15, monthYear: "Nov'26", weekday: "Sunday" };
    }
  };

  const depFormatted = formatCardDate(depDate);
  const retFormatted = formatCardDate(returnDate);

  return (
    <div ref={containerRef} className="w-full relative text-left">
      <div className="bg-[#0e0e18]/90 backdrop-blur-xl border border-purple-500/25 rounded-3xl shadow-2xl p-6 sm:p-8">
        
        {/* Top Controls: Trip Type Radio & Quick Notice */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-500/15">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'one-way'}
                onChange={() => setTripType('one-way')}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-[#0e0e18]"
              />
              <span className={`text-sm font-semibold transition ${tripType === 'one-way' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                One Way
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'round-trip'}
                onChange={() => setTripType('round-trip')}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-[#0e0e18]"
              />
              <span className={`text-sm font-semibold transition ${tripType === 'round-trip' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                Round Trip
              </span>
            </label>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/25">
            <Sparkles size={13} className="text-purple-400" />
            <span>Real-time Delay Probability Engine Active</span>
          </div>
        </div>

        {/* Core Search Cards Grid (MakeMyTrip Style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 relative">
          
          {/* FROM CARD (4 Cols) */}
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'origin' ? null : 'origin');
              setSearchQuery('');
            }}
            className="md:col-span-3 bg-[#07070e] border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-4 cursor-pointer transition relative group"
          >
            <span className="text-xs font-medium text-slate-400 block mb-1">From</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight group-hover:text-purple-300 transition">
                {origin.city}
              </h2>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                {origin.iata}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-1">
              {origin.name}
            </p>
          </div>

          {/* SWAP BUTTON (Overlay in center on desktop) */}
          <button
            type="button"
            onClick={handleSwap}
            className="hidden md:flex absolute left-[24.2%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-9 h-9 rounded-full bg-[#161626] hover:bg-purple-600 border border-purple-500/30 text-slate-300 hover:text-white items-center justify-center shadow-lg shadow-purple-950/40 transition transform hover:rotate-180 duration-300 cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowLeftRight size={15} />
          </button>

          {/* TO CARD (3 Cols) */}
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'destination' ? null : 'destination');
              setSearchQuery('');
            }}
            className="md:col-span-3 bg-[#07070e] border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-4 cursor-pointer transition relative group"
          >
            <span className="text-xs font-medium text-slate-400 block mb-1">To</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight group-hover:text-purple-300 transition">
                {destination.city}
              </h2>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                {destination.iata}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-1">
              {destination.name}
            </p>
          </div>

          {/* DEPARTURE CARD (2 Cols) */}
          <div className="md:col-span-2 bg-[#07070e] border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-4 transition relative">
            <span className="text-xs font-medium text-slate-400 block mb-1">Departure</span>
            <label className="cursor-pointer block">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-100">{depFormatted.day}</span>
                <span className="text-sm font-semibold text-slate-300">{depFormatted.monthYear}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{depFormatted.weekday}</p>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>

          {/* RETURN CARD (2 Cols) */}
          <div className={`md:col-span-2 bg-[#07070e] border rounded-2xl p-4 transition relative ${
            tripType === 'round-trip' ? 'border-purple-500/20 hover:border-purple-500/60 cursor-pointer' : 'border-purple-900/15 opacity-40'
          }`}>
            <span className="text-xs font-medium text-slate-400 block mb-1">Return</span>
            {tripType === 'round-trip' ? (
              <label className="cursor-pointer block">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-100">{retFormatted.day}</span>
                  <span className="text-sm font-semibold text-slate-300">{retFormatted.monthYear}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{retFormatted.weekday}</p>
                <input
                  type="date"
                  min={depDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setTripType('round-trip')}
                className="text-xs text-slate-400 hover:text-purple-400 font-medium py-3 block text-left cursor-pointer"
              >
                + Add return flight
              </button>
            )}
          </div>

          {/* TRAVELLERS & CLASS CARD (2 Cols) */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'travellers' ? null : 'travellers')}
            className="md:col-span-2 bg-[#07070e] border border-purple-500/20 hover:border-purple-500/60 rounded-2xl p-4 cursor-pointer transition relative group"
          >
            <span className="text-xs font-medium text-slate-400 block mb-1">Travellers & Class</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-100">{adults + children + infants}</span>
              <span className="text-xs font-bold text-slate-300">Traveller(s)</span>
            </div>
            <p className="text-xs text-purple-400 font-semibold truncate mt-1">
              {cabinClass}
            </p>
          </div>

          {/* DROPDOWN POPOVER FOR ORIGIN / DESTINATION */}
          {(activeDropdown === 'origin' || activeDropdown === 'destination') && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full max-w-md bg-[#0e0e18] border border-purple-500/35 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, airport name, or IATA (e.g. Chennai, MAA, BOM)..."
                  className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {searchResults.map((a) => (
                  <div
                    key={a.iata}
                    onClick={() => handleSelectAirport(a)}
                    className="p-2.5 rounded-xl hover:bg-purple-950/40 cursor-pointer transition flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{a.city}</span>
                        <span className="text-xs text-slate-400">({a.country})</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{a.name}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/25">
                      {a.iata}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DROPDOWN POPOVER FOR TRAVELLERS & CLASS */}
          {activeDropdown === 'travellers' && (
            <div className="absolute top-full right-0 z-50 mt-2 w-80 bg-[#0e0e18] border border-purple-500/35 rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150 space-y-4">
              <h4 className="text-sm font-bold text-slate-100 border-b border-purple-500/15 pb-2">
                Select Travellers & Cabin
              </h4>

              {/* Adults */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Adults</p>
                  <span className="text-slate-400">12+ years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-slate-100">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(9, adults + 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Children</p>
                  <span className="text-slate-400">2 - 12 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-slate-100">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Infants</p>
                  <span className="text-slate-400">Under 2 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-slate-100">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(Math.min(4, infants + 1))}
                    className="w-7 h-7 rounded bg-[#161626] text-slate-300 font-bold hover:bg-purple-900/50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="pt-2 border-t border-purple-500/15">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Cabin Class</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Economy', 'Premium Economy', 'Business', 'First'].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setCabinClass(cls)}
                      className={`p-2 rounded-xl font-medium border text-center transition cursor-pointer ${
                        cabinClass === cls
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                          : 'border-purple-500/15 text-slate-400 hover:bg-purple-950/30'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDropdown(null)}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Apply Selection
              </button>
            </div>
          )}
        </div>

        {/* Special Fare Selectors (MakeMyTrip Style) */}
        <div className="mt-6 pt-5 border-t border-purple-500/15 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Special Fares:</span>
          {[
            { id: 'regular', label: 'Regular Fares', badge: '' },
            { id: 'student', label: 'Student Fare', badge: 'Extra Baggage' },
            { id: 'senior', label: 'Senior Citizen', badge: 'Up to ₹600 off' },
            { id: 'armed_forces', label: 'Armed Forces', badge: 'Special Rate' }
          ].map((fare) => (
            <button
              key={fare.id}
              type="button"
              onClick={() => setSpecialFare(fare.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                specialFare === fare.id
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                  : 'border-purple-500/15 text-slate-400 hover:border-purple-500/40 hover:text-slate-200'
              }`}
            >
              <span>{fare.label}</span>
              {fare.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {fare.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SEARCH BUTTON */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSearchSubmit}
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-8px_rgba(147,51,234,0.6)] cursor-pointer"
          >
            <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="tracking-wide">SEARCH FLIGHTS WITH PROBABILITIES</span>
          </button>
        </div>

      </div>
    </div>
  );
}