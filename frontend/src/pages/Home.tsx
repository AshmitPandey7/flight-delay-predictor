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
    <div className="w-full flex flex-col items-center">
      {/* Hero Section with Airport & Aviation Background */}
      <div className="w-full relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/90 to-slate-950"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 flex flex-col items-center text-center">
          
          {/* Faculty Demo Pill Alert */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={onLaunchFacultyDemo}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold hover:border-sky-400 hover:scale-105 transition cursor-pointer shadow-lg shadow-sky-500/10"
            >
              <GraduationCap size={15} />
              <span>Faculty Evaluation Mode: Click to Auto-Load Chennai → Mumbai Demo</span>
              <ArrowRight size={13} />
            </button>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 max-w-4xl">
            Flight Booking with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">Delay Probability</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Search scheduled flights with MakeMyTrip-style convenience and evaluate real-time calibrated disruption probabilities powered by US BTS records, DGCA India priors, and live Open-Meteo weather.
          </p>

          {/* Quick Route Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs text-slate-400 font-semibold mr-1">Popular Demo Routes:</span>
            {[
              { origin: 'MAA', dest: 'BOM', label: 'Chennai → Mumbai' },
              { origin: 'DEL', dest: 'BLR', label: 'Delhi → Bengaluru' },
              { origin: 'BOM', dest: 'AMD', label: 'Mumbai → Ahmedabad' },
              { origin: 'HYD', dest: 'DEL', label: 'Hyderabad → Delhi' }
            ].map(r => (
              <button
                key={`${r.origin}-${r.dest}`}
                onClick={() => handleDemoRoute(r.origin, r.dest)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition flex items-center gap-1 cursor-pointer"
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
      <div className="max-w-7xl mx-auto px-4 py-20 w-full text-left">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-black text-slate-100 mb-3">
            Why AeroProb Changes Flight Selection
          </h2>
          <p className="text-sm text-slate-400">
            Airlines sell tickets without revealing their probability of on-time arrival. We combine real historical datasets with live meteorological telemetry to empower travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl w-fit mb-5 border border-blue-500/20">
                <Plane className="w-6 h-6 transform -rotate-45" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">MakeMyTrip-Style Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full flight search interface with one-way/round-trip support, passenger & cabin selection, Indian metro airports, and direct deep-links to MakeMyTrip and airline portals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-sky-400 font-semibold">
              <span>Authentic Schedules & Fares</span>
            </div>
          </div>
          
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mb-5 border border-purple-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Leakage-Free Calibrated ML</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict forward-holdout validation with zero post-departure data leakage. Outputs calibrated probabilities, multi-class confusion matrices, and 95% Wilson confidence intervals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-purple-400 font-semibold">
              <span>Platt-Scaled Logistic Regression</span>
            </div>
          </div>
          
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mb-5 border border-emerald-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Real US & Indian Aviation Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero fabricated records. Grounded in 538,000+ US BTS flight records and DGCA India monthly airline OTP benchmarks for IndiGo, Air India, Akasa, and SpiceJet.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>DGCA & Open-Meteo Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
