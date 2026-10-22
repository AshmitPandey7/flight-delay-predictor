import { ArrowRight, CloudRain, BarChart3, Database } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            Powered by Calibrated Logistic Regression & Bayes' Theorem
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl">
            Predict Flight Delays with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Probability</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            A comprehensive statistical application that computes the probability of flight delays and cancellations using real US BTS performance records and live Open-Meteo weather data.
          </p>
          
          <button 
            onClick={() => onNavigate('predictor')}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-sky-500 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-sky-400 shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)]"
          >
            Launch Predictor
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl mb-4">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Winter Fog What-If</h3>
            <p className="text-slate-400">
              Booking in June for December? Toggle winter fog simulations to observe how conditional probability shifts based on severe weather priors.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Rigorous Statistics</h3>
            <p className="text-slate-400">
              Explore step-by-step Bayes theorem breakdowns, Wilson score confidence intervals, and 5 formal hypothesis tests with exact p-values.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Zero Fabricated Data</h3>
            <p className="text-slate-400">
              Every metric, histogram, and probability stems from a real 538,000+ flight dataset from the US Bureau of Transportation Statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
