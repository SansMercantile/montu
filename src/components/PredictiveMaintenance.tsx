import React from 'react';
import { MaintenanceSystem } from '../types';
import { AlertCircle, CheckCircle, Flame, Wrench, ShieldAlert, BadgeAlert } from 'lucide-react';

interface PredictiveMaintenanceProps {
  systems: MaintenanceSystem[];
  onTriggerMaintenance: (systemId: string) => void;
}

export const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({ systems, onTriggerMaintenance }) => {
  
  // Progress bar styling
  const getWearColor = (wear: number) => {
    if (wear > 80) return 'bg-rose-500';
    if (wear > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusBadge = (status: 'OPTIMAL' | 'MONITOR' | 'CRITICAL') => {
    switch (status) {
      case 'OPTIMAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100">Optimal</span>;
      case 'MONITOR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-100">Watch List</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-600 border border-rose-100 animate-pulse">Critical action</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm" id="predictive-maintenance-station">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <span className="font-mono text-xs text-indigo-600 tracking-wider uppercase block">Cap. 3 - Structural Wear Intelligence</span>
          <h3 className="text-xl font-sans font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Remaining Useful Life (RUL) Forecasting
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track turbine stresses, hydraulic feed lines, and primary coolant pumps via continuous operational wear prediction.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {systems.map((sys) => (
          <div 
            key={sys.id} 
            className={`border rounded-xl p-5 hover:bg-slate-50/50 transition-colors ${sys.status === 'CRITICAL' ? 'border-rose-200 bg-rose-50/5' : 'border-gray-100'}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Information */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 font-medium">{sys.category}</span>
                  <span className="text-gray-300">•</span>
                  {getStatusBadge(sys.status)}
                </div>

                <h4 className="font-sans font-semibold text-slate-800 text-base">{sys.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Recommended Option: <b className="font-sans text-slate-700 font-medium">{sys.recommendedAction}</b></p>
              </div>

              {/* Wear Gauge */}
              <div className="w-full md:w-56 shrink-0">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Structural Stress Strain</span>
                  <span className="font-mono font-medium text-slate-700">{sys.wearLevel}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${getWearColor(sys.wearLevel)}`} style={{ width: `${sys.wearLevel}%` }} />
                </div>
              </div>

              {/* RUL prognosis */}
              <div className="text-left md:text-center w-28 shrink-0">
                <span className="text-[10px] text-gray-400 font-mono block uppercase">RUL Outlook</span>
                <span className={`text-lg font-mono font-bold ${sys.rulDays < 15 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {sys.rulDays} Days
                </span>
              </div>

              {/* Actions */}
              <div className="shrink-0">
                <button
                  onClick={() => onTriggerMaintenance(sys.id)}
                  className={`w-full py-1.5 px-3.5 rounded-lg text-xs font-medium transition-colors border shadow-sm ${sys.status === 'CRITICAL' ? 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600' : 'bg-white hover:bg-slate-50 text-slate-700 border-gray-250'}`}
                >
                  Schedule Refit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
