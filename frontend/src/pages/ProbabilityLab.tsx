import { useState, useEffect } from 'react';
import { Microscope, Loader2, Info, Filter } from 'lucide-react';

interface VariableOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export default function ProbabilityLab() {
  const [data, setData] = useState<any>(null);
  const [variables, setVariables] = useState<VariableOption[]>([]);
  const [selectedVarId, setSelectedVarId] = useState<string>('weather');
  const [selectedCondVal, setSelectedCondVal] = useState<string>('severe');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch Probability Lab baseline data
    fetch('/api/probability-lab')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);

    // Fetch dynamic options
    fetch('/api/probability-lab/options')
      .then(res => res.json())
      .then(d => {
        if (d && Array.isArray(d.variables)) {
          setVariables(d.variables);
        }
      })
      .catch(console.error);
  }, []);

  // Update selected condition when variable changes
  const handleVariableChange = (varId: string) => {
    setSelectedVarId(varId);
    const targetVar = variables.find(v => v.id === varId);
    if (targetVar && targetVar.options.length > 0) {
      setSelectedCondVal(targetVar.options[0].value);
    }
  };

  const handleQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/probability-lab/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition_type: selectedVarId,
          condition_value: selectedCondVal
        })
      });
      const d = await res.json();
      setQueryResult(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial query once data is ready
  useEffect(() => {
    if (variables.length > 0 && !queryResult) {
      handleQuery();
    }
  }, [variables]);

  if (!data) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3"></div>
        <p className="text-sm">Loading Probability Lab empirical matrices...</p>
      </div>
    );
  }

  const mOutcome = data.data.marginal_outcomes;
  const conditionals = data.data.conditional_probabilities;
  const activeVar = variables.find(v => v.id === selectedVarId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-left">
      
      {/* Top Header */}
      <div className="flex items-center gap-3.5 mb-3">
        <div className="p-3 bg-purple-500/15 text-purple-300 rounded-2xl border border-purple-500/30">
          <Microscope size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Probability Lab: Conditional Analysis
          </h1>
          <p className="text-xs text-purple-400 font-semibold mt-0.5">
            Empirical Contingency Matrix Grounded in 538,837 US BTS Commercial Flights
          </p>
        </div>
      </div>
      
      <p className="text-slate-400 mb-8 max-w-3xl leading-relaxed text-sm">
        Explore how conditioning on specific pre-departure variables alters flight outcome likelihoods.
        We contrast the unconditional <strong>Marginal Probability</strong> $P(Y)$ against the 
        <strong> Conditional Probability</strong> $P(Y \mid C)$ using official operations and 
        95% Wilson confidence intervals.
      </p>

      {/* Two Comparative Baseline Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        
        {/* Baseline Marginal Card */}
        <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>1. Baseline Marginal Probability P(Y)</span>
            </h3>
            <span className="text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-semibold">
              Entire Population
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Prior probability distribution across all 538,837 flights before conditioning on weather, timing, or carrier.
          </p>
          <ul className="space-y-2.5 text-xs">
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(On-Time)</span>
              <span className="font-mono font-bold text-emerald-400">
                {(mOutcome['On-Time'].prob * 100).toFixed(1)}% <span className="text-[10px] text-slate-500 font-normal">({mOutcome['On-Time'].count.toLocaleString()})</span>
              </span>
            </li>
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(Delayed &gt; 15m)</span>
              <span className="font-mono font-bold text-amber-400">
                {(mOutcome['Delayed'].prob * 100).toFixed(1)}% <span className="text-[10px] text-slate-500 font-normal">({mOutcome['Delayed'].count.toLocaleString()})</span>
              </span>
            </li>
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(Cancelled)</span>
              <span className="font-mono font-bold text-rose-400">
                {(mOutcome['Cancelled'].prob * 100).toFixed(1)}% <span className="text-[10px] text-slate-500 font-normal">({mOutcome['Cancelled'].count.toLocaleString()})</span>
              </span>
            </li>
          </ul>
        </div>
        
        {/* Meteorological Shift Card */}
        <div className="bg-[#0e0e18] border border-purple-500/20 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span>2. Meteorological Shift P(Delay | Weather)</span>
            </h3>
            <span className="text-[11px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 font-semibold">
              Observed Shifts
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            How delay likelihood surges as meteorological conditions degrade from clear skies to severe storm/fog.
          </p>
          <ul className="space-y-2.5 text-xs">
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(Delayed | Clear Sky)</span>
              <span className="font-mono font-bold text-emerald-400">
                {(conditionals['P(Delayed | Clear)'] * 100).toFixed(1)}%
              </span>
            </li>
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(Delayed | Moderate Rain/Wind)</span>
              <span className="font-mono font-bold text-amber-400">
                {(conditionals['P(Delayed | Moderate)'] * 100).toFixed(1)}%
              </span>
            </li>
            <li className="flex justify-between items-center p-2.5 bg-[#07070e] border border-purple-500/15 rounded-xl">
              <span className="font-semibold text-slate-300">P(Delayed | Severe Winter Storm/Fog)</span>
              <span className="font-mono font-bold text-rose-400">
                {(conditionals['P(Delayed | Severe_Storm_Fog)'] * 100).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Conditional Query Component */}
      <div className="bg-[#0e0e18] border border-purple-500/25 p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-purple-400" />
          <h3 className="text-xl font-bold text-slate-100">
            Interactive Conditional Probability Query
          </h3>
        </div>
        <p className="text-slate-400 mb-6 text-xs leading-relaxed max-w-2xl">
          Select an environmental, operational, or carrier condition to compute its exact conditional likelihoods with 95% Wilson score confidence intervals.
        </p>
        
        {/* Dropdown Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Conditioning Variable
            </label>
            <select 
              value={selectedVarId} 
              onChange={(e) => handleVariableChange(e.target.value)}
              className="w-full bg-[#07070e] border border-purple-500/25 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition text-sm cursor-pointer"
            >
              {variables.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Specific Condition Value
            </label>
            <select 
              value={selectedCondVal} 
              onChange={(e) => setSelectedCondVal(e.target.value)}
              className="w-full bg-[#07070e] border border-purple-500/25 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition text-sm cursor-pointer"
            >
              {activeVar?.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <button 
              onClick={handleQuery}
              disabled={loading}
              className="w-full h-[48px] bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Evaluate Condition'}
            </button>
          </div>

        </div>

        {/* Dynamic Query Evaluation Output */}
        {queryResult && (
          <div className="mt-8 pt-8 border-t border-purple-500/15 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#07070e] px-4 py-3 rounded-2xl border border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
                <Info size={16} className="text-purple-400" />
                <span>Evaluating: <strong>{queryResult.condition_label}</strong></span>
              </div>
              <span className="text-[11px] text-slate-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 font-bold">
                Sample Size: n = {queryResult.sample_size_n.toLocaleString()}
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              
              <div className="bg-[#07070e] p-6 rounded-2xl border border-emerald-500/25 text-center">
                <h4 className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
                  P(On-Time | Condition)
                </h4>
                <div className="text-3xl font-black text-slate-100">
                  {(queryResult.p_ontime.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  95% Wilson CI: [{(queryResult.p_ontime.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_ontime.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

              <div className="bg-[#07070e] p-6 rounded-2xl border border-amber-500/25 text-center">
                <h4 className="text-amber-400 text-xs font-bold mb-2 uppercase tracking-wider">
                  P(Delayed &gt; 15m | Condition)
                </h4>
                <div className="text-3xl font-black text-slate-100">
                  {(queryResult.p_delayed.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  95% Wilson CI: [{(queryResult.p_delayed.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_delayed.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

              <div className="bg-[#07070e] p-6 rounded-2xl border border-rose-500/25 text-center">
                <h4 className="text-rose-400 text-xs font-bold mb-2 uppercase tracking-wider">
                  P(Cancelled | Condition)
                </h4>
                <div className="text-3xl font-black text-slate-100">
                  {(queryResult.p_cancelled.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  95% Wilson CI: [{(queryResult.p_cancelled.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_cancelled.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

            </div>

            {/* Plain-English Mathematical Distinction */}
            <div className="mt-6 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-purple-300">Statistical Interpretation Note: </strong>
              These figures denote empirical single-variable conditional frequencies $P(Y \mid C)$ across hundreds of thousands of commercial operations. 
              While descriptive frequencies illustrate macro-level operational risks, individual flight predictions in AeroProb synthesize multivariable features 
              (route distance, origin congestion, historical airline reliability, and Open-Meteo telemetry) through calibrated multivariable logistic regression.
            </div>

          </div>
        )}

      </div>

    </div>
  );
}