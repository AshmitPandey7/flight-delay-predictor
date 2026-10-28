import { useState, useEffect, useRef } from 'react';
import {
  MapPin, ArrowRight, Loader2, Info, Search, Sparkles
} from 'lucide-react';

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
    }, 250);
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
    <div className="relative text-left" ref={wrapperRef}>
      <label className="block text-xs font-semibold text-slate-300 mb-1">{label}</label>
      <div className="relative">
        <input 
          value={query} 
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="e.g. DEL, MAA, or Mumbai"
          className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl px-4 py-2.5 pl-10 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition uppercase text-sm" 
        />
        <Search className="absolute left-3 top-3 text-purple-400" size={16} />
      </div>
      {isOpen && options.length > 0 && (
        <div className="absolute z-20 w-full mt-1.5 bg-[#0e0e18] border border-purple-500/35 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
          {options.map(opt => (
            <div 
              key={opt.iata} 
              className="px-4 py-2.5 hover:bg-purple-950/40 cursor-pointer text-left transition flex items-center justify-between"
              onClick={() => { setQuery(opt.iata); onChange(opt.iata); setIsOpen(false); }}
            >
              <div>
                <div className="font-semibold text-sm text-slate-200">{opt.city} ({opt.iata})</div>
                <div className="text-xs text-slate-400 truncate max-w-xs">{opt.name}</div>
              </div>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                {opt.iata}
              </span>
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
  const [depDate, setDepDate] = useState(() => {
    return new Date(Date.now() + 86400000).toISOString().split('T')[0];
  });
  
  const [weatherPreset, setWeatherPreset] = useState<string>('live');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let weatherPayload: any = {};
      
      if (weatherPreset === 'live') {
        // Fetch real live weather from Open-Meteo
        const wRes = await fetch(`/api/weather?iata=${origin}`);
        if (wRes.ok) {
          weatherPayload = await wRes.json();
        } else {
          weatherPayload = { preset: 'clear' };
        }
      } else {
        weatherPayload = { preset: weatherPreset };
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          dest,
          carrier,
          dep_time: depTime,
          dep_date: depDate,
          weather: weatherPayload
        })
      });
      if (!res.ok) throw new Error("Prediction API failed to compute probability.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while evaluating disruption probability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-left">
      
      {/* Hypothetical Simulation Disclaimer Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/30 flex items-start gap-3">
        <Sparkles className="text-purple-400 shrink-0 mt-0.5" size={20} />
        <div>
          <h2 className="text-sm font-bold text-slate-100">
            Hypothetical Flight Simulator: Risk Evaluation for Future Scenarios
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            This module models counterfactual and future flight scenarios using calibrated logistic regression and Bayes' Theorem updates. Adjust origin, scheduled time, carrier, and meteorological presets to test disruption sensitivity.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Form Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-[#0e0e18] border border-purple-500/25 p-6 rounded-3xl shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
              <MapPin className="text-purple-400" size={18} />
              <span>Flight Parameters</span>
            </h3>
            
            <div className="space-y-4">
              <AirportAutocomplete label="Origin Airport" value={origin} onChange={setOrigin} />
              <AirportAutocomplete label="Destination Airport" value={dest} onChange={setDest} />
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Airline</label>
                <select
                  value={carrier}
                  onChange={e => setCarrier(e.target.value)}
                  className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500 transition text-sm cursor-pointer"
                >
                  <option value="6E">IndiGo (6E) - High Domestic OTP</option>
                  <option value="AI">Air India (AI) - Full Service Carrier</option>
                  <option value="UK">Vistara (UK) - Premium Service</option>
                  <option value="QP">Akasa Air (QP) - DGCA Benchmark</option>
                  <option value="SG">SpiceJet (SG) - Budget Carrier</option>
                  <option value="AA">American Airlines (AA) - BTS Benchmark</option>
                  <option value="DL">Delta Air Lines (DL) - BTS Benchmark</option>
                  <option value="UA">United Airlines (UA) - BTS Benchmark</option>
                  <option value="WN">Southwest Airlines (WN) - Point-to-Point</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={depDate}
                    onChange={e => setDepDate(e.target.value)}
                    className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={depTime}
                    onChange={e => setDepTime(e.target.value)}
                    className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/15">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Meteorological Scenario Preset
                </label>
                <select
                  value={weatherPreset}
                  onChange={e => setWeatherPreset(e.target.value)}
                  className="w-full bg-[#07070e] border border-purple-500/20 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500 transition text-sm cursor-pointer"
                >
                  <option value="live">📡 Live Telemetry (Open-Meteo Airport API)</option>
                  <option value="clear">☀️ Clear / Favorable Conditions</option>
                  <option value="moderate">🌧️ Moderate Rain & Adverse Winds (26 km/h)</option>
                  <option value="severe">⛈️ Severe Storm & Low Visibility (600m)</option>
                  <option value="winter_fog">🌫️ Winter Fog CAT III (Delhi NCR Extreme 350m)</option>
                  <option value="high_winds">💨 High Crosswinds & Squalls (54 km/h)</option>
                </select>
              </div>

              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={17} /> : <ArrowRight size={17} />}
                <span>Calculate Disruption Probability</span>
              </button>

              {errorMsg && (
                <div className="text-rose-400 text-xs p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className="w-full lg:w-2/3 space-y-6">
          {result ? (
            <>
              {result.is_outside_training_data && (
                <div className="bg-amber-500/10 border border-amber-500/25 text-amber-300 px-4 py-3 rounded-2xl flex items-start gap-3 text-xs">
                  <Info className="shrink-0 mt-0.5 text-amber-400" size={16} />
                  <p>{result.confidence_badge}</p>
                </div>
              )}

              {/* Top Probabilities Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                
                <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    On-Time Probability
                  </span>
                  <span className="text-4xl font-black text-emerald-400">
                    {(result.probabilities.ontime.probability * 100).toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-slate-400 mt-2">
                    95% Wilson CI: [{(result.probabilities.ontime.confidence_interval_95[0] * 100).toFixed(1)}%, {(result.probabilities.ontime.confidence_interval_95[1] * 100).toFixed(1)}%]
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Sample size: n={result.probabilities.ontime.sample_size.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center ring-1 ring-purple-500/30">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Delay Risk (&gt;15 min)
                  </span>
                  <span className="text-4xl font-black text-amber-400">
                    {(result.probabilities.delayed.probability * 100).toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-slate-400 mt-2">
                    95% Wilson CI: [{(result.probabilities.delayed.confidence_interval_95[0] * 100).toFixed(1)}%, {(result.probabilities.delayed.confidence_interval_95[1] * 100).toFixed(1)}%]
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Sample size: n={result.probabilities.delayed.sample_size.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Expected Delay
                  </span>
                  <span className="text-4xl font-black text-purple-300">
                    +{result.expected_delay.expected_delay_minutes} <span className="text-lg font-bold">min</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-2">
                    If delayed: median {result.expected_delay.delay_if_delayed.median_minutes}m
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Cancellation: {(result.probabilities.cancelled.probability * 100).toFixed(1)}%
                  </span>
                </div>

              </div>

              {/* Segmented Probability Bar */}
              <div className="p-6 rounded-3xl bg-[#0e0e18] border border-purple-500/20">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-200">Probability Distribution</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    result.probabilities.delayed.probability < 0.25
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : result.probabilities.delayed.probability < 0.45
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {result.probabilities.delayed.probability < 0.25 ? 'Low Disruption Risk' : result.probabilities.delayed.probability < 0.45 ? 'Moderate Disruption Risk' : 'High Disruption Risk'}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-purple-500/20">
                  <div
                    style={{ width: `${result.probabilities.ontime.probability * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`On-Time: ${(result.probabilities.ontime.probability * 100).toFixed(1)}%`}
                  ></div>
                  <div
                    style={{ width: `${result.probabilities.delayed.probability * 100}%` }}
                    className="bg-amber-500 h-full"
                    title={`Delayed: ${(result.probabilities.delayed.probability * 100).toFixed(1)}%`}
                  ></div>
                  <div
                    style={{ width: `${result.probabilities.cancelled.probability * 100}%` }}
                    className="bg-rose-500 h-full"
                    title={`Cancelled: ${(result.probabilities.cancelled.probability * 100).toFixed(1)}%`}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-300 pt-2">
                  <span>On-Time: <strong className="text-emerald-400">{(result.probabilities.ontime.probability * 100).toFixed(1)}%</strong></span>
                  <span>Delayed: <strong className="text-amber-400">{(result.probabilities.delayed.probability * 100).toFixed(1)}%</strong></span>
                  <span>Cancelled: <strong className="text-rose-400">{(result.probabilities.cancelled.probability * 100).toFixed(1)}%</strong></span>
                </div>
              </div>

              {/* Bayes' Theorem Calculation Step Breakdown */}
              <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-100">
                    Step-by-Step Bayes' Theorem Decomposition
                  </h3>
                  <span className="text-xs text-purple-400 font-semibold">
                    Calibrated Platt Scaler + DGCA Priors
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 bg-[#07070e] uppercase border-b border-purple-500/15">
                      <tr>
                        <th className="px-4 py-3">Outcome <span className="lowercase font-mono">(Y)</span></th>
                        <th className="px-4 py-3">Prior <span className="lowercase font-mono">P(Y)</span></th>
                        <th className="px-4 py-3">Likelihood <span className="lowercase font-mono">P(W|Y)</span></th>
                        <th className="px-4 py-3">Joint Numerator <span className="lowercase font-mono">P(W|Y)P(Y)</span></th>
                        <th className="px-4 py-3 text-purple-300 font-bold">Posterior <span className="lowercase font-mono">P(Y|W)</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {['On-Time', 'Delayed', 'Cancelled'].map(cls => {
                        const step = result.bayes_calculation_steps;
                        return (
                          <tr key={cls} className="border-b border-purple-500/10 last:border-0 hover:bg-purple-950/20">
                            <td className="px-4 py-3 font-semibold text-slate-200">{cls}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_1_priors[cls].toFixed(4)}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_2_likelihoods[cls].toFixed(4)}</td>
                            <td className="px-4 py-3 text-slate-400">{step.step_3_joint_probabilities[cls].toFixed(5)}</td>
                            <td className="px-4 py-3 font-black text-purple-300">{step.step_5_posteriors[cls].toFixed(4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 text-xs text-slate-400 space-y-1.5 pt-3 border-t border-purple-500/10">
                  <p><strong>Meteorological Condition (W):</strong> {result.bayes_calculation_steps.condition}</p>
                  <p><strong>Marginal Evidence P(W):</strong> {result.bayes_calculation_steps.step_4_marginal_evidence.toFixed(5)}</p>
                  <div className="mt-3 bg-[#07070e] p-3.5 rounded-xl font-mono text-purple-300 text-xs border border-purple-500/20">
                    P(Outcome | Weather) = [ P(Weather | Outcome) * P(Outcome) ] / P(Weather)
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-purple-500/20 border-dashed rounded-3xl min-h-[420px] p-8 text-center bg-[#07070d]/50">
              <Sparkles size={36} className="text-purple-500/30 mb-3" />
              <p className="font-semibold text-slate-300 text-sm">No Simulation Computed Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure your origin, destination, carrier, and meteorological preset on the left, then click Calculate Disruption Probability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}