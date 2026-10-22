import { useState, useEffect } from 'react';

export default function Stats() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/stats/hypothesis-tests')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch tests");
        return res.json();
      })
      .then(d => setData(d))
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div className="p-8 text-center text-rose-400">Error: {error}</div>;
  if (!data) return <div className="p-8 text-center text-slate-400">Loading Hypothesis Tests...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">Formal Statistical Inference</h1>
      <p className="text-slate-400 mb-8">
        Tested against {data.source} at α = {data.significance_threshold_alpha}
      </p>

      <div className="space-y-6">
        {Object.entries(data.tests).map(([key, test]: [string, any]) => (
          <div key={key} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-sky-400">{test.name}</h3>
              {test.decision && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${test.decision.includes('Reject H0') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                  {test.decision}
                </span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {test.null_hypothesis && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Null Hypothesis (H0)</h4>
                    <p className="text-slate-300 text-sm">{test.null_hypothesis}</p>
                  </div>
                )}
                {test.alt_hypothesis && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Alternative Hypothesis (H1)</h4>
                    <p className="text-slate-300 text-sm">{test.alt_hypothesis}</p>
                  </div>
                )}
                {key === 'correlation_analysis' && (
                  <div>
                    <p className="text-slate-300 text-sm">{test.interpretation}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm space-y-2 flex flex-col justify-center">
                {test.p_value !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">p-value:</span>
                    <span className={test.p_value < 0.05 ? "text-emerald-400 font-bold" : "text-slate-300"}>
                      {test.p_value === 0 ? "< 0.0001" : test.p_value.toExponential(4)}
                    </span>
                  </div>
                )}
                {test.pearson_p_value !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pearson p-value:</span>
                    <span className="text-emerald-400 font-bold">
                      {test.pearson_p_value === 0 ? "< 0.0001" : test.pearson_p_value.toExponential(4)}
                    </span>
                  </div>
                )}
                {test.pearson_r !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pearson r:</span>
                    <span className="text-indigo-400">{test.pearson_r}</span>
                  </div>
                )}
                {test.effect_size && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Effect Size ({test.effect_size.type}):</span>
                    <span className="text-indigo-400">{test.effect_size.value}</span>
                  </div>
                )}
                {test.test_statistic !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Test Statistic:</span>
                    <span className="text-amber-400">{test.test_statistic}</span>
                  </div>
                )}
              </div>
            </div>
            
            {test.conclusion && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-slate-400 text-sm"><strong className="text-slate-300">Conclusion:</strong> {test.conclusion}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
