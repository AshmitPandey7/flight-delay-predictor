import { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, Search, Calendar, ChevronDown } from 'lucide-react';

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
  const depInputRef = useRef<HTMLInputElement>(null);
  const retInputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenDepartureDatePicker = () => {
    if (depInputRef.current) {
      try {
        depInputRef.current.showPicker();
      } catch {
        depInputRef.current.focus();
      }
    }
  };

  const handleOpenReturnDatePicker = () => {
    if (retInputRef.current) {
      try {
        retInputRef.current.showPicker();
      } catch {
        retInputRef.current.focus();
      }
    }
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
      <div className="bg-[#121214] border border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-7">
        
        {/* Top Controls: Segmented Trip Type & Notice */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                tripType === 'round-trip'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Round Trip
            </button>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-md border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Probability Engine Active</span>
          </div>
        </div>

        {/* Core Search Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5 relative">
          
          {/* FROM CARD (3 Cols) */}
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'origin' ? null : 'origin');
              setSearchQuery('');
            }}
            className="md:col-span-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition relative group"
          >
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">From</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition">
                {origin.city}
              </h2>
              <span className="text-xs font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {origin.iata}
              </span>
            </div>
            <p className="text-xs text-zinc-500 truncate mt-1">
              {origin.name}
            </p>
          </div>

          {/* SWAP BUTTON */}
          <button
            type="button"
            onClick={handleSwap}
            className="hidden md:flex absolute left-[24.2%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white items-center justify-center shadow-md transition transform hover:rotate-180 duration-200 cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowLeftRight size={14} />
          </button>

          {/* TO CARD (3 Cols) */}
          <div
            onClick={() => {
              setActiveDropdown(activeDropdown === 'destination' ? null : 'destination');
              setSearchQuery('');
            }}
            className="md:col-span-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition relative group"
          >
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">To</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition">
                {destination.city}
              </h2>
              <span className="text-xs font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {destination.iata}
              </span>
            </div>
            <p className="text-xs text-zinc-500 truncate mt-1">
              {destination.name}
            </p>
          </div>

          {/* DEPARTURE CARD (2 Cols) - Click opens calendar picker reliably */}
          <div
            onClick={handleOpenDepartureDatePicker}
            className="md:col-span-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition relative group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Departure</span>
              <Calendar size={13} className="text-zinc-400 group-hover:text-white transition" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white">{depFormatted.day}</span>
              <span className="text-sm font-medium text-zinc-300">{depFormatted.monthYear}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">{depFormatted.weekday}</p>

            {/* Native date picker input */}
            <input
              ref={depInputRef}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={depDate}
              onChange={(e) => setDepDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* RETURN CARD (2 Cols) */}
          <div
            onClick={() => {
              if (tripType !== 'round-trip') {
                setTripType('round-trip');
              }
              handleOpenReturnDatePicker();
            }}
            className={`md:col-span-2 bg-zinc-950 border rounded-xl p-4 cursor-pointer transition relative group ${
              tripType === 'round-trip' ? 'border-zinc-800 hover:border-zinc-600' : 'border-zinc-900 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Return</span>
              {tripType === 'round-trip' && <Calendar size={13} className="text-zinc-400 group-hover:text-white transition" />}
            </div>
            {tripType === 'round-trip' ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white">{retFormatted.day}</span>
                  <span className="text-sm font-medium text-zinc-300">{retFormatted.monthYear}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{retFormatted.weekday}</p>
                <input
                  ref={retInputRef}
                  type="date"
                  min={depDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </>
            ) : (
              <span className="text-xs text-zinc-400 hover:text-white font-medium py-3 block leading-relaxed">
                + Add return date
              </span>
            )}
          </div>

          {/* TRAVELLERS & CLASS CARD (2 Cols) */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'travellers' ? null : 'travellers')}
            className="md:col-span-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition relative group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Travellers & Class</span>
              <ChevronDown size={13} className="text-zinc-400 group-hover:text-white transition" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{adults + children + infants}</span>
              <span className="text-xs font-medium text-zinc-300">Traveller(s)</span>
            </div>
            <p className="text-xs text-zinc-400 truncate mt-1">
              {cabinClass}
            </p>
          </div>

          {/* DROPDOWN POPOVER FOR ORIGIN / DESTINATION */}
          {(activeDropdown === 'origin' || activeDropdown === 'destination') && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
              <div className="relative mb-3">
                <Search size={15} className="absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city or IATA (e.g. Chennai, MAA, BOM)..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {searchResults.map((a) => (
                  <div
                    key={a.iata}
                    onClick={() => handleSelectAirport(a)}
                    className="p-2.5 rounded-lg hover:bg-zinc-800 cursor-pointer transition flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{a.city}</span>
                        <span className="text-xs text-zinc-400">({a.country})</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate max-w-xs">{a.name}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {a.iata}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DROPDOWN POPOVER FOR TRAVELLERS & CLASS */}
          {activeDropdown === 'travellers' && (
            <div className="absolute top-full right-0 z-50 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">
                Select Travellers & Cabin
              </h4>

              {/* Adults */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-zinc-200">Adults</p>
                  <span className="text-zinc-400">12+ years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(9, adults + 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-zinc-200">Children</p>
                  <span className="text-zinc-400">2 - 12 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-zinc-200">Infants</p>
                  <span className="text-zinc-400">Under 2 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(Math.min(4, infants + 1))}
                    className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="pt-2 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Cabin Class</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Economy', 'Premium Economy', 'Business', 'First'].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setCabinClass(cls)}
                      className={`p-2 rounded-lg font-medium border text-center transition cursor-pointer ${
                        cabinClass === cls
                          ? 'bg-zinc-800 border-zinc-600 text-white font-semibold'
                          : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'
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
                className="w-full py-2 bg-white text-black font-semibold rounded-lg text-xs hover:bg-zinc-200 transition cursor-pointer"
              >
                Apply Selection
              </button>
            </div>
          )}
        </div>

        {/* Special Fares */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-medium text-zinc-400">Special Fares:</span>
          {[
            { id: 'regular', label: 'Regular Fares' },
            { id: 'student', label: 'Student Fare (Extra Baggage)' },
            { id: 'senior', label: 'Senior Citizen Discount' },
            { id: 'armed_forces', label: 'Armed Forces Rate' }
          ].map((fare) => (
            <button
              key={fare.id}
              type="button"
              onClick={() => setSpecialFare(fare.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                specialFare === fare.id
                  ? 'bg-zinc-800 border-zinc-600 text-white font-semibold'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {fare.label}
            </button>
          ))}
        </div>

        {/* SEARCH BUTTON: Clean, high-contrast white button */}
        <div className="mt-7 flex justify-center">
          <button
            onClick={handleSearchSubmit}
            className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-sm font-semibold text-black bg-white hover:bg-zinc-200 rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="tracking-wide">SEARCH FLIGHTS WITH PROBABILITIES</span>
          </button>
        </div>

      </div>
    </div>
  );
}