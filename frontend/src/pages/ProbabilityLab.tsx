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

  useEffect(() => {
    if (variables.length > 0 && !queryResult) {
      handleQuery();
    }
  }, [variables]);

  if (!data) {
    return (
      <div className="py-24 text-center text-zinc-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent mb-3"></div>
        <p className="text-xs">Loading Probability Lab empirical matrices...</p>
      </div>
    );
  }

  const mOutcome = data.data.marginal_outcomes;
  const conditionals = data.data.conditional_probabilities;
  const activeVar = variables.find(v => v.id === selectedVarId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-left">
      
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-zinc-900 text-white rounded-lg border border-zinc-800">
          <Microscope size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Probability Lab: Conditional Analysis
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Empirical Contingency Matrix Grounded in 538,837 US BTS Commercial Flights
          </p>
        </div>
      </div>
      
      <p className="text-zinc-400 mb-6 max-w-3xl leading-relaxed text-xs">
        Explore how conditioning on specific pre-departure variables alters flight outcome likelihoods.
        We contrast the unconditional <strong>Marginal Probability</strong> $P(Y)$ against the 
        <strong> Conditional Probability</strong> $P(Y \mid C)$ using official operations and 
        95% Wilson confidence intervals.
      </p>

      {/* Two Comparative Baseline Cards */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        
        {/* Baseline Marginal Card */}
        <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>1. Baseline Marginal Probability P(Y)</span>
            </h3>
            <span className="text-[10px] text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-medium">
              Entire Population
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Prior probability distribution across all 538,837 flights before conditioning on weather, timing, or carrier.
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(On-Time)</span>
              <span className="font-mono font-semibold text-emerald-400">
                {(mOutcome['On-Time'].prob * 100).toFixed(1)}% <span className="text-[10px] text-zinc-500 font-normal">({mOutcome['On-Time'].count.toLocaleString()})</span>
              </span>
            </li>
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(Delayed &gt; 15m)</span>
              <span className="font-mono font-semibold text-amber-400">
                {(mOutcome['Delayed'].prob * 100).toFixed(1)}% <span className="text-[10px] text-zinc-500 font-normal">({mOutcome['Delayed'].count.toLocaleString()})</span>
              </span>
            </li>
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(Cancelled)</span>
              <span className="font-mono font-semibold text-rose-400">
                {(mOutcome['Cancelled'].prob * 100).toFixed(1)}% <span className="text-[10px] text-zinc-500 font-normal">({mOutcome['Cancelled'].count.toLocaleString()})</span>
              </span>
            </li>
          </ul>
        </div>
        
        {/* Meteorological Shift Card */}
        <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span>2. Meteorological Shift P(Delay | Weather)</span>
            </h3>
            <span className="text-[10px] text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-medium">
              Observed Shifts
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            How delay likelihood surges as meteorological conditions degrade from clear skies to severe storm/fog.
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(Delayed | Clear Sky)</span>
              <span className="font-mono font-semibold text-emerald-400">
                {(conditionals['P(Delayed | Clear)'] * 100).toFixed(1)}%
              </span>
            </li>
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(Delayed | Moderate Rain/Wind)</span>
              <span className="font-mono font-semibold text-amber-400">
                {(conditionals['P(Delayed | Moderate)'] * 100).toFixed(1)}%
              </span>
            </li>
            <li className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
              <span className="font-medium text-zinc-300">P(Delayed | Severe Winter Storm/Fog)</span>
              <span className="font-mono font-semibold text-rose-400">
                {(conditionals['P(Delayed | Severe_Storm_Fog)'] * 100).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Conditional Query Component */}
      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <Filter size={15} className="text-zinc-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Interactive Conditional Probability Query
          </h3>
        </div>
        <p className="text-zinc-400 mb-5 text-xs max-w-2xl leading-relaxed">
          Select an environmental, operational, or carrier condition to compute its exact conditional likelihoods with 95% Wilson score confidence intervals.
        </p>
        
        {/* Dropdown Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              1. Conditioning Variable
            </label>
            <select 
              value={selectedVarId} 
              onChange={(e) => handleVariableChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-500 transition text-xs font-medium cursor-pointer"
            >
              {variables.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              2. Specific Condition Value
            </label>
            <select 
              value={selectedCondVal} 
              onChange={(e) => setSelectedCondVal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-500 transition text-xs font-medium cursor-pointer"
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
              className="w-full h-[36px] bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'Evaluate Condition'}
            </button>
          </div>

        </div>

        {/* Dynamic Query Evaluation Output */}
        {queryResult && (
          <div className="mt-6 pt-5 border-t border-zinc-800">
            
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-zinc-950 px-3.5 py-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-medium">
                <Info size={14} className="text-zinc-400" />
                <span>Evaluating: <strong>{queryResult.condition_label}</strong></span>
              </div>
              <span className="text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Sample Size: n = {queryResult.sample_size_n.toLocaleString()}
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-3">
              
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
                <h4 className="text-emerald-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  P(On-Time | Condition)
                </h4>
                <div className="text-2xl font-bold text-white">
                  {(queryResult.p_ontime.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  95% Wilson CI: [{(queryResult.p_ontime.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_ontime.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
                <h4 className="text-amber-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  P(Delayed &gt; 15m | Condition)
                </h4>
                <div className="text-2xl font-bold text-white">
                  {(queryResult.p_delayed.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  95% Wilson CI: [{(queryResult.p_delayed.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_delayed.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
                <h4 className="text-rose-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  P(Cancelled | Condition)
                </h4>
                <div className="text-2xl font-bold text-white">
                  {(queryResult.p_cancelled.probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  95% Wilson CI: [{(queryResult.p_cancelled.ci_95[0]*100).toFixed(1)}%, {(queryResult.p_cancelled.ci_95[1]*100).toFixed(1)}%]
                </div>
              </div>

            </div>

            {/* Plain-English Mathematical Distinction */}
            <div className="mt-4 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-200">Statistical Interpretation: </strong>
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