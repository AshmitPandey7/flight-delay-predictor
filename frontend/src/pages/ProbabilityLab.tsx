import { useState, useEffect } from 'react';
import { Beaker, Loader2, Info } from 'lucide-react';

export default function ProbabilityLab() {
  const [data, setData] = useState<any>(null);
  const [condType, setCondType] = useState('weather');
  const [condValue, setCondValue] = useState('severe');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/probability-lab')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/probability-lab/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition_type: condType, condition_value: condValue })
      });
      const d = await res.json();
      setQueryResult(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-8 text-center text-slate-400">Loading Probability Lab...</div>;

  const mOutcome = data.data.marginal_outcomes;
  const conditionals = data.data.conditional_probabilities;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
          <Beaker size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-100">Probability Lab</h1>
      </div>
      
      <p className="text-slate-400 mb-8 max-w-3xl leading-relaxed">
        Understand how conditional probability works. We start with the <strong>Marginal Probability</strong> (the overall chance of a delay across all flights). 
        Then we look at the <strong>Conditional Probability</strong> (the chance of a delay <em>given</em> a specific condition like severe weather). 
        Computed from {data.data.total_flights.toLocaleString()} raw BTS flight records.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-sky-400 mb-4 border-b border-slate-800 pb-2">1. Baseline (Marginal) P(Outcome)</h3>
          <p className="text-sm text-slate-400 mb-4">What is the baseline probability before knowing anything about the flight?</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(On-Time)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-emerald-400">{(mOutcome['On-Time'].prob * 100).toFixed(1)}%</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(Delayed)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-amber-400">{(mOutcome['Delayed'].prob * 100).toFixed(1)}%</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(Cancelled)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-rose-400">{(mOutcome['Cancelled'].prob * 100).toFixed(1)}%</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4 border-b border-slate-800 pb-2">2. Given Condition P(Delay | Weather)</h3>
          <p className="text-sm text-slate-400 mb-4">How does the delay probability shift when we know the weather condition?</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(Delayed | Clear Sky)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-emerald-400">{(conditionals['P(Delayed | Clear)'] * 100).toFixed(1)}%</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(Delayed | Moderate Rain)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-amber-400">{(conditionals['P(Delayed | Moderate)'] * 100).toFixed(1)}%</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-slate-800 rounded">
              <span>P(Delayed | Severe Storm/Fog)</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-rose-400">{(conditionals['P(Delayed | Severe_Storm_Fog)'] * 100).toFixed(1)}%</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-slate-100 mb-2">Interactive Conditional Query</h3>
        <p className="text-slate-400 mb-6 text-sm">Select a condition to evaluate its exact impact on flight outcomes with 95% Wilson Confidence Intervals.</p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Variable</label>
            <select 
              value={condType} 
              onChange={(e) => {
                setCondType(e.target.value);
                setCondValue(e.target.value === 'weather' ? 'severe' : e.target.value === 'time_of_day' ? 'evening' : 'AA');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="weather">Weather Conditions</option>
              <option value="time_of_day">Time of Day (Congestion)</option>
              <option value="carrier">Specific Airline Carrier</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
            <select 
              value={condValue} 
              onChange={(e) => setCondValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-sky-500"
            >
              {condType === 'weather' && (
                <>
                  <option value="clear">Clear / Favorable</option>
                  <option value="moderate">Moderate Rain / Wind</option>
                  <option value="severe">Severe Winter Storm / Fog</option>
                </>
              )}
              {condType === 'time_of_day' && (
                <>
                  <option value="morning">Morning (06:00 - 10:00)</option>
                  <option value="afternoon">Afternoon (11:00 - 16:00)</option>
                  <option value="evening">Evening Peak (17:00 - 21:00)</option>
                </>
              )}
              {condType === 'carrier' && (
                <>
                  <option value="AA">American Airlines (AA)</option>
                  <option value="DL">Delta Airlines (DL)</option>
                  <option value="UA">United Airlines (UA)</option>
                  <option value="WN">Southwest Airlines (WN)</option>
                  <option value="B6">JetBlue (B6)</option>
                </>
              )}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={handleQuery}
              disabled={loading}
              className="h-[46px] px-6 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Evaluate'}
            </button>
          </div>
        </div>

        {queryResult && (
          <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center gap-2 text-sky-400 bg-sky-500/10 w-fit px-4 py-2 rounded-lg border border-sky-500/20">
              <Info size={18} />
              <span className="font-medium text-sm">Evaluating: {queryResult.condition_label} (Sample size n={queryResult.sample_size_n.toLocaleString()})</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-6 rounded-xl border border-emerald-500/20 text-center">
                <h4 className="text-emerald-400 text-sm font-semibold mb-2 uppercase tracking-wider">P(On-Time | Condition)</h4>
                <div className="text-3xl font-bold text-slate-100">{(queryResult.p_ontime.probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-2">
                  95% CI: [{(queryResult.p_ontime.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_ontime.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-amber-500/20 text-center">
                <h4 className="text-amber-400 text-sm font-semibold mb-2 uppercase tracking-wider">P(Delayed | Condition)</h4>
                <div className="text-3xl font-bold text-slate-100">{(queryResult.p_delayed.probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-2">
                  95% CI: [{(queryResult.p_delayed.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_delayed.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-rose-500/20 text-center">
                <h4 className="text-rose-400 text-sm font-semibold mb-2 uppercase tracking-wider">P(Cancelled | Condition)</h4>
                <div className="text-3xl font-bold text-slate-100">{(queryResult.p_cancelled.probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-2">
                  95% CI: [{(queryResult.p_cancelled.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_cancelled.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
