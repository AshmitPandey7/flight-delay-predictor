import { X, Printer, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

interface FlightCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  flights: any[];
  onRemoveFlight: (flightId: string) => void;
}

export default function FlightCompareModal({
  isOpen,
  onClose,
  flights,
  onRemoveFlight
}: FlightCompareModalProps) {
  if (!isOpen || flights.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const getRiskBadge = (level: string) => {
    if (level === 'Low') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Low Risk
        </span>
      );
    }
    if (level === 'Moderate') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Moderate Risk
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        High Risk
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-left overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">
                Flight Disruption Risk & Value Comparison
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold">
                {flights.length} Flights Selected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-criteria side-by-side evaluation balancing price, journey speed, and calibrated probability predictions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700 transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={15} />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparative Matrix Table */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-1 gap-6">
            
            {/* Cards Row */}
            <div className={`grid grid-cols-${flights.length} gap-4`}>
              {flights.map((fl) => (
                <div
                  key={fl.id}
                  className={`p-5 rounded-2xl bg-slate-950/80 border flex flex-col justify-between relative transition ${
                    fl.is_smart_recommended
                      ? 'border-sky-500 shadow-lg shadow-sky-500/10'
                      : 'border-slate-800'
                  }`}
                >
                  {fl.is_smart_recommended && (
                    <div className="absolute -top-3 left-4 px-3 py-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles size={11} />
                      <span>Best Choice</span>
                    </div>
                  )}

                  <button
                    onClick={() => onRemoveFlight(fl.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                    title="Remove from comparison"
                  >
                    <X size={15} />
                  </button>

                  <div>
                    {/* Airline & Number */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-100 text-sm">{fl.airline?.name}</span>
                      <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {fl.flight_number}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className="text-sm font-semibold text-slate-200 mt-2">
                      {fl.dep_time} → {fl.arr_time}
                    </div>
                    <p className="text-xs text-slate-400">
                      {fl.duration} • {fl.stop_details}
                    </p>

                    {/* Price */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400">Fare</span>
                      <div className="text-2xl font-black text-slate-100">
                        ₹{fl.price_inr?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Probability Breakdown */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Risk Assessment:</span>
                        {getRiskBadge(fl.prediction?.risk_level)}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-400 font-medium">On-Time Probability</span>
                          <span className="font-bold text-emerald-400">{fl.prediction?.probabilities?.ontime}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                          <div
                            style={{ width: `${fl.prediction?.probabilities?.ontime}%` }}
                            className="bg-emerald-500 h-full"
                          ></div>
                          <div
                            style={{ width: `${fl.prediction?.probabilities?.delayed}%` }}
                            className="bg-amber-500 h-full"
                          ></div>
                          <div
                            style={{ width: `${fl.prediction?.probabilities?.cancelled}%` }}
                            className="bg-rose-500 h-full"
                          ></div>
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                          <span>Delay Risk: <strong className="text-amber-400">{fl.prediction?.probabilities?.delayed}%</strong></span>
                          <span>Cancel Risk: <strong className="text-rose-400">{fl.prediction?.probabilities?.cancelled}%</strong></span>
                        </div>
                      </div>

                      {/* Expected Delay */}
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-400 block text-[11px]">Expected Disruption Delay</span>
                        <span className="font-bold text-slate-200 text-sm">
                          {fl.prediction?.expected_delay_minutes > 0
                            ? `+${fl.prediction.expected_delay_minutes} mins`
                            : 'On Schedule (0 min)'}
                        </span>
                      </div>

                      {/* Primary Driver */}
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Factor: <span className="text-slate-300">{fl.prediction?.major_risk_factor}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                    <a
                      href={fl.booking_links?.makemytrip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <span>Book on MakeMyTrip</span>
                      <ExternalLink size={13} />
                    </a>
                    <a
                      href={fl.booking_links?.airline_direct}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700"
                    >
                      <span>Official Airline Site</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Modal Footer Notes */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Source: Real BTS historical data, DGCA priors, and Open-Meteo live API.</span>
          <span>Predictions sum to 100% within 95% Wilson Confidence Intervals.</span>
        </div>

      </div>
    </div>
  );
}
