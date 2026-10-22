import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, Loader2, Info, Wind, CloudSnow, Search } from 'lucide-react';

function AirportAutocomplete({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  const [query, setQuery] = useState(value);
  const [options, setOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/airports/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOptions(data);
        })
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      <div className="relative">
        <input 
          value={query} 
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="e.g. DEL or Mumbai"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 pl-10 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors uppercase" 
        />
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
      </div>
      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map(opt => (
            <div 
              key={opt.iata} 
              className="px-4 py-2 hover:bg-slate-800 cursor-pointer text-left"
              onClick={() => { setQuery(opt.iata); onChange(opt.iata); setIsOpen(false); }}
            >
              <div className="font-semibold text-slate-200">{opt.iata} - {opt.name}</div>
              <div className="text-xs text-slate-400">{opt.city}, {opt.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Predictor() {
  const [origin, setOrigin] = useState('DEL');
  const [dest, setDest] = useState('BOM');
  const [carrier, setCarrier] = useState('6E');
  const [depTime, setDepTime] = useState('19:00');
  const [depDate, setDepDate] = useState('2026-12-15');
  
  const [weatherMode, setWeatherMode] = useState<'live' | 'winter_fog'>('live');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let weatherPayload = {};
      
      if (weatherMode === 'live') {
        // Fetch real live weather first
        const wRes = await fetch(`/api/weather?iata=${origin}`);
        if (!wRes.ok) throw new Error("Could not fetch weather for this airport.");
        weatherPayload = await wRes.json();
      } else {
        // Winter fog simulation
        weatherPayload = { is_winter_fog: true, visibility_m: 150, temperature_c: 4.5, precipitation_mm: 0, wind_speed_kmh: 5 };
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, dest, carrier, dep_time: depTime, dep_date: depDate, weather: weatherPayload })
      });
      if (!res.ok) throw new Error("Prediction API failed.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while calculating probability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Form Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-100">
              <MapPin className="text-sky-400" /> Flight Details
            </h2>
            
            <div className="space-y-4">
              <AirportAutocomplete label="Origin Airport" value={origin} onChange={setOrigin} />
              <AirportAutocomplete label="Destination Airport" value={dest} onChange={setDest} />
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Airline Code (e.g., 6E, AA)</label>
                <input value={carrier} onChange={e => setCarrier(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors uppercase" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                  <input type="date" value={depDate} onChange={e => setDepDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                  <input type="time" value={depTime} onChange={e => setDepTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-sky-500 [color-scheme:dark]" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="block text-sm font-medium text-slate-400 mb-3">Weather Scenario</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setWeatherMode('live')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm transition-colors ${weatherMode === 'live' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <Wind size={16} /> Live Weather
                  </button>
                  <button 
                    onClick={() => setWeatherMode('winter_fog')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm transition-colors ${weatherMode === 'winter_fog' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <CloudSnow size={16} /> Winter Fog
                  </button>
                </div>
              </div>

              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                Calculate Probability
              </button>

              {errorMsg && <div className="text-rose-400 text-sm mt-2">{errorMsg}</div>}
            </div>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className="w-full lg:w-2/3 space-y-6">
          {result ? (
            <>
              {result.is_outside_training_data && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl flex items-start gap-3">
                  <Info className="shrink-0 mt-0.5" size={18} />
                  <p className="text-sm">{result.confidence_badge}</p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-slate-400 text-sm font-medium mb-2">On-Time Probability</span>
                  <span className="text-4xl font-bold text-emerald-400">{(result.probabilities.ontime.probability * 100).toFixed(1)}%</span>
                  <span className="text-xs text-slate-500 mt-2">95% CI: ±{(result.probabilities.ontime.confidence_interval_95[1]*100 - result.probabilities.ontime.probability*100).toFixed(1)}% (n={result.probabilities.ontime.sample_size})</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center ring-1 ring-rose-500/30">
                  <span className="text-slate-400 text-sm font-medium mb-2">Delay Risk (&gt;15m)</span>
                  <span className="text-4xl font-bold text-rose-400">{(result.probabilities.delayed.probability * 100).toFixed(1)}%</span>
                  <span className="text-xs text-slate-500 mt-2">95% CI: ±{(result.probabilities.delayed.confidence_interval_95[1]*100 - result.probabilities.delayed.probability*100).toFixed(1)}% (n={result.probabilities.delayed.sample_size})</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-slate-400 text-sm font-medium mb-2">Expected Delay</span>
                  <span className="text-4xl font-bold text-amber-400">{result.expected_delay.expected_delay_minutes} <span className="text-lg">min</span></span>
                  <span className="text-xs text-slate-500 mt-2">If delayed: median {result.expected_delay.delay_if_delayed.median_minutes}m</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">How this was computed (Bayes' Theorem)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 bg-slate-950 uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Outcome <span className="lowercase">(Y)</span></th>
                        <th className="px-4 py-3">Prior <span className="lowercase">P(Y)</span></th>
                        <th className="px-4 py-3">Likelihood <span className="lowercase">P(W|Y)</span></th>
                        <th className="px-4 py-3">Numerator <span className="lowercase">P(W|Y)P(Y)</span></th>
                        <th className="px-4 py-3 text-sky-400">Posterior <span className="lowercase">P(Y|W)</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {['On-Time', 'Delayed', 'Cancelled'].map(cls => {
                        const step = result.bayes_calculation_steps;
                        return (
                          <tr key={cls} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                            <td className="px-4 py-3 font-medium text-slate-200">{cls}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_1_priors[cls].toFixed(4)}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_2_likelihoods[cls].toFixed(4)}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_3_joint_probabilities[cls].toFixed(5)}</td>
                            <td className="px-4 py-3 font-bold text-sky-400">{step.step_5_posteriors[cls].toFixed(4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-slate-400 space-y-1">
                  <p><strong>Condition (W):</strong> {result.bayes_calculation_steps.condition}</p>
                  <p><strong>Marginal Evidence P(W):</strong> {result.bayes_calculation_steps.step_4_marginal_evidence.toFixed(5)}</p>
                  <div className="mt-2 bg-slate-950 p-3 rounded-lg font-mono text-sky-300 border border-slate-800">
                    P(Outcome | Weather) = [ P(Weather | Outcome) * P(Outcome) ] / P(Weather)
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-2xl min-h-[400px]">
              Fill details and click Predict to calculate probabilities based on actual data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
