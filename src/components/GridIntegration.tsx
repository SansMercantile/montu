import React, { useState } from 'react';
import { PowerGridAllocation } from '../types';
import { Zap, Sun, Wind, ChevronRight, Activity, Globe } from 'lucide-react';

interface GridIntegrationProps {
  allocations: PowerGridAllocation[];
  onTriggerGridDispatch: (solarMWe: number, nuclearMWe: number) => void;
  analysisOutput: string | null;
  dispatchStrategy: string | null;
  resilienceScore: number | null;
  isHybridLoading: boolean;
}

export const GridIntegration: React.FC<GridIntegrationProps> = ({
  allocations,
  onTriggerGridDispatch,
  analysisOutput,
  dispatchStrategy,
  resilienceScore,
  isHybridLoading,
}) => {
  // Simulator states for user input on clean hybrid energy systems
  const [solarDispatchSlider, setSolarDispatchSlider] = useState<number>(140);
  const [nuclearDispatchSlider, setNuclearDispatchSlider] = useState<number>(850);

  const calculateTotalSupply = () => {
    return solarDispatchSlider + nuclearDispatchSlider;
  };

  const calculateTotalDemand = () => {
    return allocations.reduce((acc, curr) => acc + curr.demand, 0);
  };

  const handleIntegrateHybrid = () => {
    onTriggerGridDispatch(solarDispatchSlider, nuclearDispatchSlider);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm" id="grid-distribution-coordination">
      {/* Detail description of Hybrid Energy Coordination */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <span className="font-mono text-xs text-sky-600 tracking-wider uppercase block">Cap. 4 - Dynamic Grid Loading Strategy</span>
          <h3 className="text-xl font-sans font-medium text-slate-900 tracking-tight flex items-center gap-2">
            RA Clean Energy Hybrid Regulator
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Map energy delivery routes. Coordinate baseload nuclear output with rapid, solar/wind variable inputs dynamically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dynamic dispatch controller - Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5">
            <h4 className="text-sm font-sans font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-amber-500" /> Dynamic Hybrid Supply Injection Slider
            </h4>

            {/* Solar (RA Integration) */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Sun className="h-4 w-4 text-emerald-500" /> RA Solar Array Dispatch
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{solarDispatchSlider} MWe</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  value={solarDispatchSlider}
                  onChange={(e) => setSolarDispatchSlider(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-250 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400 mt-1">
                  <span>0 MWe</span>
                  <span>400 MWe (Peak Reservoirs)</span>
                </div>
              </div>

              {/* Nuclear (Base injection) */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-sky-500" /> Nuclear Baseload Injection
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{nuclearDispatchSlider} MWe</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  value={nuclearDispatchSlider}
                  onChange={(e) => setNuclearDispatchSlider(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-250 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400 mt-1">
                  <span>300 MWe Min Baseload</span>
                  <span>1200 MWe Peak Generation</span>
                </div>
              </div>
            </div>

            {/* Dispatch button */}
            <button
              onClick={handleIntegrateHybrid}
              disabled={isHybridLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              {isHybridLoading ? "Analyzing Grid Resilience..." : "Compute Hybrid Safety & Dispatch"}
            </button>
          </div>

          {/* Real-time Grid Sectors */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">Sector Load Balancer</span>
            
            {allocations.map((alloc) => {
              const totalSectorSupply = alloc.nuclearSupply + alloc.solarSupply + alloc.windSupply;
              const sectorProgress = (totalSectorSupply / alloc.demand) * 100;
              
              return (
                <div key={alloc.id} className="border border-gray-100 rounded-lg p-3.5 flex justify-between items-center">
                  <div>
                    <h5 className="font-sans font-medium text-slate-800 text-sm">{alloc.sector}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-gray-400">Demand: {alloc.demand} MWe</span>
                      <span className="text-[10px] font-mono text-gray-400">|</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-medium">Delivered: {totalSectorSupply} MWe</span>
                    </div>
                  </div>

                  <div className="w-28 shrink-0">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${sectorProgress > 98 ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                        style={{ width: `${Math.min(100, sectorProgress)}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-[9px] font-mono text-gray-500">{sectorProgress.toFixed(1)}% Saturation</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis and Dispatch Strategy Advice - Right Column */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                  <Globe className="h-4 w-4" /> RA Integrated Dispatch Analyst
                </span>
                <span className="text-[10px] font-mono text-gray-500">Node v1.4</span>
              </div>

              {isHybridLoading ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                  <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-gray-400 font-mono">Simulating clean grid resilience scenarios...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Grid Security Assessment:</span>
                    <p className="text-sm font-serif leading-relaxed text-slate-200">
                      {analysisOutput || "Baseload nuclear core yields optimal grid stabilization parameters. Intermittent renewable transient buffers are successfully aligned inside primary power storage loops."}
                    </p>
                  </div>

                  <div className="bg-slate-850 border border-slate-800 p-3 rounded-lg">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Dispatch Core Policy Directive:</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {dispatchStrategy || "Route surplus power through storage arrays to stabilize sudden micro-grid drop-offs. Maintain active watch over peak hours loading profiles."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 mt-6 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Total System Resilience Score:</span>
              <span className="font-bold text-lg text-emerald-400">
                {resilienceScore ? `${resilienceScore}%` : "98.4%"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
