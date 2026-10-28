import { X, Printer } from 'lucide-react';

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
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Low Risk
        </span>
      );
    }
    if (level === 'Moderate') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Moderate Risk
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        High Risk
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-left overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Flight Disruption Risk & Value Comparison
              </h2>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700">
                {flights.length} Flights Selected
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Multi-criteria side-by-side evaluation balancing price, journey speed, and calibrated probability predictions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 border border-zinc-700 transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Comparative Matrix Table */}
        <div className="p-5 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-1 gap-4">
            
            {/* Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {flights.map((fl) => (
                <div
                  key={fl.id}
                  className={`p-4 rounded-xl bg-zinc-950 border flex flex-col justify-between relative transition ${
                    fl.is_smart_recommended
                      ? 'border-white shadow-md'
                      : 'border-zinc-800'
                  }`}
                >
                  {fl.is_smart_recommended && (
                    <div className="absolute -top-2.5 left-3 px-2.5 py-0.5 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Best Choice
                    </div>
                  )}

                  <div className="text-right">
                    <button
                      onClick={() => onRemoveFlight(fl.id)}
                      className="text-zinc-500 hover:text-white text-xs cursor-pointer"
                      title="Remove from comparison"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-7 rounded-md bg-zinc-900 flex items-center justify-center font-bold text-xs text-white border border-zinc-800">
                        {fl.airline?.code}
                      </span>
                      <div>
                        <h4 className="font-semibold text-white text-xs leading-tight">{fl.airline?.name}</h4>
                        <span className="text-[10px] text-zinc-500">{fl.flight_number}</span>
                      </div>
                    </div>

                    <div className="text-xl font-bold text-white mt-2">
                      ₹{fl.price_inr?.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-zinc-500 block">{fl.cabin_class}</span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Schedule:</span>
                      <span className="font-medium text-white">{fl.dep_time} - {fl.arr_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Duration:</span>
                      <span className="font-medium text-white">{fl.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stops:</span>
                      <span className="font-medium text-white">{fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">Risk:</span>
                      {getRiskBadge(fl.prediction?.risk_level)}
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden flex border border-zinc-800">
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

                    <div className="grid grid-cols-3 text-center text-[10px] pt-1 text-zinc-400">
                      <div>
                        <strong className="text-emerald-400 block">{fl.prediction?.probabilities?.ontime}%</strong>
                        <span>On-Time</span>
                      </div>
                      <div>
                        <strong className="text-amber-400 block">{fl.prediction?.probabilities?.delayed}%</strong>
                        <span>Delayed</span>
                      </div>
                      <div>
                        <strong className="text-rose-400 block">{fl.prediction?.probabilities?.cancelled}%</strong>
                        <span>Cancelled</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
                    <a
                      href={fl.booking_links?.makemytrip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
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