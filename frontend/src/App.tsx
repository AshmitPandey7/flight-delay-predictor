import { useState } from 'react';
import { Plane, BarChart2, CloudRain, Microscope } from 'lucide-react';
import Home from './pages/Home';
import Predictor from './pages/Predictor';
import ProbabilityLab from './pages/ProbabilityLab';
import Stats from './pages/Stats';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Plane },
    { id: 'predictor', label: 'Predictor & Simulator', icon: CloudRain },
    { id: 'probability-lab', label: 'Probability Lab', icon: Microscope },
    { id: 'stats', label: 'Statistics & Tests', icon: BarChart2 },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'predictor': return <Predictor />;
      case 'probability-lab': return <ProbabilityLab />;
      case 'stats': return <Stats />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400">
              <Plane size={24} className="transform -rotate-45" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-100">AeroProb</span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'bg-sky-500/10 text-sky-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full text-left">
        {renderPage()}
      </main>

      <footer className="border-t border-slate-800 py-8 bg-slate-950 mt-12 text-left">
        <div className="max-w-7xl mx-auto px-4 text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-slate-300">Flight Delay & Cancellation Probability Predictor</p>
            <p>Data strictly sourced from US BTS (2023), DGCA India, and Open-Meteo.</p>
          </div>
          <div className="flex items-center gap-2 text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-full text-xs font-medium border border-sky-500/20">
            <Plane size={14} />
            <span>Real-time Aviation Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
