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

  // If not authenticated, render the Clean Landing Page
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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-white selection:text-black">
      
      {/* Global Navigation Header - Clean Professional Dark Monochrome */}
      <header className="border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name: Clean, perfectly aligned and zero clipping */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleNavigate('home')}>
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm shrink-0">
              <Plane size={18} className="transform -rotate-45" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                AeroProb
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase leading-tight">
                Flight Disruption Predictor
              </span>
            </div>
          </div>

          {/* Navigation Bar Items (Removed clumsy landing page button) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition cursor-pointer ${
                  currentPage === item.id 
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <item.icon size={14} className={currentPage === item.id ? 'text-white' : 'text-zinc-400'} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Widgets: Faculty Demo Button & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={launchFacultyDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="One-click Faculty Demo: loads Dr. Sharma profile and MAA to BOM flight search"
            >
              <GraduationCap size={15} />
              <span>Faculty Demo</span>
            </button>

            {user?.name ? (
              <button
                onClick={() => setIsProfileDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-zinc-200 hidden sm:inline">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition shadow-sm cursor-pointer"
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
      <footer className="border-t border-zinc-800/80 py-8 bg-[#09090b] mt-12 text-left">
        <div className="max-w-7xl mx-auto px-6 text-zinc-500 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-zinc-300 text-sm">
              AeroProb • Flight Delay & Cancellation Probability Predictor
            </p>
            <p className="mt-1 text-zinc-400">
              Grounded in 538,000+ US BTS flight operations, DGCA India official monthly OTP benchmarks, and Open-Meteo live weather telemetry.
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800">
            <Plane size={14} />
            <span>Calibrated Aviation Intelligence</span>
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