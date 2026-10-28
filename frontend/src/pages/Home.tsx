import { ArrowRight, BarChart3, Database, Plane, GraduationCap } from 'lucide-react';
import FlightSearchWidget from '../components/FlightSearchWidget';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  onLaunchFacultyDemo: () => void;
  user: any;
}

export default function Home({ onNavigate, onLaunchFacultyDemo, user }: HomeProps) {
  const handleWidgetSearch = (searchParams: any) => {
    onNavigate('flights', searchParams);
  };

  const handleDemoRoute = (origin: string, destination: string) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    onNavigate('flights', {
      origin,
      destination,
      departure_date: tomorrow,
      trip_type: 'one-way',
      cabin_class: 'Economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      special_fare: 'regular'
    });
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#09090b] text-zinc-100">
      
      {/* Hero Section */}
      <div className="w-full relative overflow-hidden bg-[#09090b] border-b border-zinc-800">
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#09090b]/90 to-[#09090b]"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 flex flex-col items-center text-center">
          
          {/* Faculty Demo Pill Alert */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={onLaunchFacultyDemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
            >
              <GraduationCap size={15} />
              <span>Faculty Evaluation Mode: Click to Auto-Load Chennai → Mumbai Demo</span>
              <ArrowRight size={13} />
            </button>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 max-w-4xl">
            Flight Booking with <span className="text-zinc-400">Delay Probability</span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">
            Search scheduled flights with MakeMyTrip-style convenience and evaluate real-time calibrated disruption probabilities powered by US BTS records, DGCA India priors, and live Open-Meteo weather.
          </p>

          {/* Quick Route Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs text-zinc-400 font-medium mr-1">Popular Demo Routes:</span>
            {[
              { origin: 'MAA', dest: 'BOM', label: 'Chennai → Mumbai' },
              { origin: 'DEL', dest: 'BLR', label: 'Delhi → Bengaluru' },
              { origin: 'BOM', dest: 'AMD', label: 'Mumbai → Ahmedabad' },
              { origin: 'HYD', dest: 'DEL', label: 'Hyderabad → Delhi' }
            ].map(r => (
              <button
                key={`${r.origin}-${r.dest}`}
                onClick={() => handleDemoRoute(r.origin, r.dest)}
                className="px-3 py-1 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1 cursor-pointer"
              >
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* MAKEMYTRIP-INSPIRED FLIGHT SEARCH WIDGET EMBEDDED */}
          <div className="w-full">
            <FlightSearchWidget
              defaultOrigin={user?.preferences?.preferred_origin || "MAA"}
              defaultDestination={user?.preferences?.preferred_destination || "BOM"}
              defaultCabinClass={user?.preferences?.cabin_class || "Economy"}
              onSearch={handleWidgetSearch}
            />
          </div>

        </div>
      </div>

      {/* Feature Value Props Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Why AeroProb Changes Flight Selection
          </h2>
          <p className="text-sm text-zinc-400">
            Airlines sell tickets without revealing their probability of on-time arrival. We combine real historical datasets with live meteorological telemetry to empower travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#121214] border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg w-fit mb-4">
                <Plane className="w-5 h-5 transform -rotate-45" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">MakeMyTrip-Style Booking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full flight search interface with one-way/round-trip support, passenger & cabin selection, Indian metro airports, and direct external search links to MakeMyTrip.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <span>Authentic Schedules & Fares</span>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-[#121214] border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg w-fit mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Leakage-Free Calibrated ML</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict forward-holdout validation with zero post-departure data leakage. Outputs calibrated probabilities, multi-class confusion matrices, and 95% Wilson confidence intervals.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <span>Platt-Scaled Logistic Regression</span>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-[#121214] border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg w-fit mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Real US & Indian Aviation Data</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero fabricated records. Grounded in 538,000+ US BTS flight records and DGCA India monthly airline OTP benchmarks for IndiGo, Air India, Akasa, and SpiceJet.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <span>DGCA & Open-Meteo Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}