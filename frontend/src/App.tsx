import { useState, useEffect } from 'react';
import { Plane, BarChart2, CloudRain, Microscope, GraduationCap, LogIn, Compass } from 'lucide-react';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import Predictor from './pages/Predictor';
import ProbabilityLab from './pages/ProbabilityLab';
import Stats from './pages/Stats';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';
import UserProfileDrawer from './components/UserProfileDrawer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aero_auth') === 'true';
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [flightSearchParams, setFlightSearchParams] = useState<any>(null);

  // User Authentication & Profile
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Fetch initial profile
  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(d => {
        setUser(d);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { id: 'home', label: 'Book Flights', icon: Plane },
    { id: 'flights', label: 'Flight Results', icon: CloudRain },
    { id: 'predictor', label: 'Custom Simulator', icon: Compass },
    { id: 'probability-lab', label: 'Probability Lab', icon: Microscope },
    { id: 'stats', label: 'Statistical Insights', icon: BarChart2 },
  ];

  const handleNavigate = (page: string, params?: any) => {
    if (params) {
      setFlightSearchParams(params);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchFacultyDemo = async () => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_faculty_demo: true })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('aero_auth', 'true');
        // Preload Chennai to Mumbai search
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const demoParams = {
          origin: 'MAA',
          destination: 'BOM',
          departure_date: tomorrow,
          trip_type: 'one-way',
          cabin_class: 'Economy',
          passengers: { adults: 1, children: 0, infants: 0 },
          special_fare: 'regular'
        };
        setFlightSearchParams(demoParams);
        setCurrentPage('flights');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('aero_auth', 'true');
    setCurrentPage('home');
  };

  const handleUpdatePreferences = (prefs: any) => {
    if (!user) return;
    setUser({ ...user, preferences: prefs });
    fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs)
    }).catch(() => {});
  };

  const handleSelectRecentSearch = (search: any) => {
    handleNavigate('flights', {
      origin: search.origin,
      destination: search.destination,
      departure_date: search.date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      trip_type: 'one-way',
      cabin_class: user?.preferences?.cabin_class || 'Economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      special_fare: 'regular'
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aero_auth');
    setUser({
      name: 'Guest Traveler',
      email: 'guest@aero.local',
      is_demo: false,
      role: 'Guest',
      preferences: {
        preferred_origin: 'MAA',
        preferred_destination: 'BOM',
        cabin_class: 'Economy',
        preferred_airline: '6E',
        default_adults: 1,
        special_fare: 'regular'
      },
      recent_searches: [],
      saved_flights: [],
      prediction_history: []
    });
  };

  // If not authenticated, render the Cinematic Landing Page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onEnterApp={() => {
            setIsAuthenticated(true);
            localStorage.setItem('aero_auth', 'true');
            setCurrentPage('home');
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLaunchFacultyDemo={launchFacultyDemo}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onLaunchFacultyDemo={launchFacultyDemo}
            user={user}
          />
        );
      case 'flights':
        return (
          <FlightSearch
            initialParams={flightSearchParams}
            user={user}
            onSaveFlight={(fl) => {
              if (user) {
                const updated = [...(user.saved_flights || []), fl];
                setUser({ ...user, saved_flights: updated });
              }
            }}
          />
        );
      case 'predictor':
        return <Predictor />;
      case 'probability-lab':
        return <ProbabilityLab />;
      case 'stats':
        return <Stats />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onLaunchFacultyDemo={launchFacultyDemo}
            user={user}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07070b] text-slate-100 selection:bg-purple-500 selection:text-white">
      
      {/* Global Navigation Header - Black & Purple Theme */}
      <header className="border-b border-purple-500/15 bg-[#090910]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 border border-purple-400/30">
              <Plane size={20} className="transform -rotate-45" />
            </div>
            <div className="text-left">
              <span className="font-black text-lg tracking-tight text-white block leading-none">
                AeroProb
              </span>
              <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">
                Aviation Delay Intelligence
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition cursor-pointer ${
                  currentPage === item.id 
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/35 shadow-sm shadow-purple-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Widgets: Landing Page Shortcut, Faculty Demo Button & User Profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('aero_auth');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-xs font-semibold transition cursor-pointer"
              title="Return to the Cinematic Landing Page"
            >
              <span>Landing Page</span>
            </button>

            <button
              onClick={launchFacultyDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-950/60 to-violet-950/60 border border-purple-500/35 text-purple-300 text-xs font-bold hover:scale-105 transition shadow-sm cursor-pointer"
              title="One-click Faculty Demo: loads Dr. Sharma profile and MAA to BOM flight search"
            >
              <GraduationCap size={15} className="text-purple-400" />
              <span>Faculty Demo</span>
            </button>

            {user?.name ? (
              <button
                onClick={() => setIsProfileDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f0f18] border border-purple-500/20 hover:border-purple-500/40 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/25 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Page Render */}
      <main className="flex-1 w-full text-left">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-purple-500/15 py-10 bg-[#050509] mt-12 text-left">
        <div className="max-w-7xl mx-auto px-4 text-slate-400 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-slate-200 text-sm">
              AeroProb • Flight Delay & Cancellation Probability Predictor
            </p>
            <p className="mt-1 text-slate-400">
              Grounded in 538,000+ US BTS flight operations, DGCA India official monthly OTP benchmarks, and Open-Meteo live weather telemetry.
            </p>
          </div>
          <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-500/20">
            <Plane size={14} />
            <span>Real-time Aviation Intelligence</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Preferences & History Drawer */}
      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={user}
        onUpdatePreferences={handleUpdatePreferences}
        onSelectSearch={handleSelectRecentSearch}
        onLogout={handleLogout}
      />

    </div>
  );
}

export default App;