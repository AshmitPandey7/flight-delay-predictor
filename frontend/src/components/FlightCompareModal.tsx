import { X, Printer, Sparkles } from 'lucide-react';

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
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Low Risk
        </span>
      );
    }
    if (level === 'Moderate') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Moderate Risk
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        High Risk
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040408]/85 backdrop-blur-md flex items-center justify-center p-4 text-left overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0e0e18] border border-purple-500/25 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-purple-500/15 flex items-center justify-between bg-[#0a0a14]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">
                Flight Disruption Risk & Value Comparison
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
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
              className="px-3.5 py-2 bg-[#161626] hover:bg-[#202036] text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-purple-500/25 transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={15} />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparative Matrix Table */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-1 gap-6">
            
            {/* Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flights.map((fl) => (
                <div
                  key={fl.id}
                  className={`p-5 rounded-2xl bg-[#07070e] border flex flex-col justify-between relative transition ${
                    fl.is_smart_recommended
                      ? 'border-purple-500 shadow-lg shadow-purple-600/15 ring-1 ring-purple-500/40'
                      : 'border-purple-500/15'
                  }`}
                >
                  {fl.is_smart_recommended && (
                    <div className="absolute -top-3 left-4 px-3 py-0.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles size={11} />
                      <span>Best Choice</span>
                    </div>
                  )}

                  <div className="text-right">
                    <button
                      onClick={() => onRemoveFlight(fl.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                      title="Remove from comparison"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-8 h-8 rounded-lg bg-[#141424] flex items-center justify-center font-bold text-xs text-purple-300 border border-purple-500/20">
                        {fl.airline?.code}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm leading-tight">{fl.airline?.name}</h4>
                        <span className="text-[11px] text-slate-400">{fl.flight_number}</span>
                      </div>
                    </div>

                    <div className="text-2xl font-black text-slate-100 mt-3">
                      ₹{fl.price_inr?.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400 block">{fl.cabin_class}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-500/15 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-semibold text-slate-200">{fl.dep_time} - {fl.arr_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-semibold text-slate-200">{fl.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stops:</span>
                      <span className="font-semibold text-slate-200">{fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-500/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Risk Status:</span>
                      {getRiskBadge(fl.prediction?.risk_level)}
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                      <div
                        style={{ width: `${fl.prediction?.probabilities?.ontime}%` }}
                        className="bg-emerald-500 h-full"
                        title={`On-Time: ${fl.prediction?.probabilities?.ontime}%`}
                      ></div>
                      <div
                        style={{ width: `${fl.prediction?.probabilities?.delayed}%` }}
                        className="bg-amber-500 h-full"
                        title={`Delayed: ${fl.prediction?.probabilities?.delayed}%`}
                      ></div>
                      <div
                        style={{ width: `${fl.prediction?.probabilities?.cancelled}%` }}
                        className="bg-rose-500 h-full"
                        title={`Cancelled: ${fl.prediction?.probabilities?.cancelled}%`}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 text-center text-[10px] pt-1">
                      <div>
                        <span className="text-slate-500 block">On-Time</span>
                        <strong className="text-emerald-400">{fl.prediction?.probabilities?.ontime}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Delayed</span>
                        <strong className="text-amber-400">{fl.prediction?.probabilities?.delayed}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Cancelled</span>
                        <strong className="text-rose-400">{fl.prediction?.probabilities?.cancelled}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-500/15">
                    <a
                      href={fl.booking_links?.makemytrip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <span>Search on MMT</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}