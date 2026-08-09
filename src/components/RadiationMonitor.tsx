import React, { useState } from 'react';
import { RadiationSensor } from '../types';
import { Shield, ShieldAlert, Activity, Heart, Compass, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface RadiationMonitorProps {
  sensors: RadiationSensor[];
  onTriggerVentPurge: (sensorId: string) => void;
}

export const RadiationMonitor: React.FC<RadiationMonitorProps> = ({ sensors, onTriggerVentPurge }) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const selectedSensor = sensors.find(s => s.id === selectedSensorId) || null;

  // Status color codes helper
  const getRadiationStatusClass = (status: 'NORMAL' | 'ELEVATED' | 'HIGH') => {
    switch (status) {
      case 'NORMAL':
        return {
          badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          indicator: 'bg-emerald-500',
          text: 'text-slate-800',
          card: 'border-gray-200/80 hover:border-emerald-200',
        };
      case 'ELEVATED':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          indicator: 'bg-amber-500',
          text: 'text-amber-800',
          card: 'border-amber-200 bg-amber-50/10 hover:border-amber-300',
        };
      case 'HIGH':
        return {
          badge: 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse',
          indicator: 'bg-rose-500 animate-ping',
          text: 'text-rose-800',
          card: 'border-rose-300 bg-rose-50/20 hover:border-rose-400',
        };
    }
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm" id="radiation-monitoring-hub">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <span className="font-mono text-xs text-emerald-600 tracking-wider uppercase block">Cap. 2 - Continuous Radiation Audit</span>
          <h3 className="text-xl font-sans font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Radiation Monitoring Network
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Real-time dosimetric reporting and continuous safeguard tracking across containment and administrative sectors.
          </p>
        </div>

        {/* Aggregate risk metrics */}
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-lg flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Global Dose</span>
              <span className="text-xs font-mono font-medium text-slate-700">0.14 μSv/h (Normal)</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-lg flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500 font-medium" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Safeguard Rule</span>
              <span className="text-xs font-mono font-semibold text-emerald-600">INTACT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sensor Cards List - Left Block */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Transducer Network Nodes</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sensors.map((sensor) => {
              const styles = getRadiationStatusClass(sensor.status);
              const isSelected = selectedSensorId === sensor.id;

              return (
                <div
                  key={sensor.id}
                  onClick={() => setSelectedSensorId(sensor.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${styles.card} ${isSelected ? 'ring-2 ring-slate-800 ring-offset-1 border-slate-300' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-400">{sensor.id}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${styles.badge}`}>
                      {sensor.status}
                    </span>
                  </div>

                  <h5 className="font-sans font-medium text-slate-800 text-sm mb-1">{sensor.location}</h5>

                  <div className="flex items-baseline justify-between mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-mono font-medium text-slate-800">{sensor.radiationLevel}</span>
                      <span className="text-[10px] text-gray-400 font-mono">μSv/h</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${styles.indicator}`} />
                      <span className="text-[10px] font-mono text-gray-500">Live</span>
                    </div>
                  </div>

                  {/* Micro sparkline of sensor history */}
                  <div className="flex items-end gap-0.5 h-6 mt-3 pt-1 border-t border-gray-100 overflow-hidden">
                    {sensor.history.map((val, i) => {
                      const maxVal = Math.max(...sensor.history, 1);
                      const normHeight = (val / maxVal) * 100;
                      return (
                        <div
                          key={i}
                          className={`w-full rounded-t-sm transition-all duration-300 ${sensor.status === 'HIGH' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                          style={{ height: `${Math.max(15, normHeight)}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safeguard Inspect Panel - Right Block */}
        <div className="lg:col-span-5">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Inspection Detail & Purging Controls</div>

          {selectedSensor ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-xs text-gray-400 block">{selectedSensor.id}</span>
                    <h4 className="font-sans font-medium text-slate-800 text-base">{selectedSensor.location}</h4>
                  </div>
                  <Radio className={`h-5 w-5 ${selectedSensor.status === 'HIGH' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 bg-white border border-slate-100 p-3 rounded-lg text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Ionizing Signal</span>
                    <span className="text-lg font-mono font-medium text-slate-800">{selectedSensor.radiationLevel} μSv/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Biological Equiv.</span>
                    <span className="text-lg font-mono font-medium text-slate-800">{(selectedSensor.radiationLevel / 1000).toFixed(5)} mSv/h</span>
                  </div>
                </div>

                <div className="space-y-3 mt-4 text-xs text-slate-600 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>EPA Regulatory Limit: <b className="font-mono text-slate-800">50 μSv/h</b> maximum peak tolerance for personnel zones.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Spectrometry details verify predominantly low-energy gamma background. Shielding material integrity at 100%.</span>
                  </div>
                  {selectedSensor.status !== 'NORMAL' && (
                    <div className="bg-amber-50 rounded p-2.5 border border-amber-100 text-amber-800 text-[11px] font-mono flex gap-1.5 mt-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Warning: Minor gaseous activation detected. Automated clean ventilation purging cycle is recommended.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vent purging override triggers */}
              <div className="mt-6">
                <button
                  onClick={() => onTriggerVentPurge(selectedSensor.id)}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors border shadow-sm ${selectedSensor.status === 'NORMAL' ? 'bg-white hover:bg-slate-50 text-slate-700 border-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'}`}
                >
                  Trigger Gaseous Filter Ventilation Purge
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
              <Compass className="h-10 w-10 text-gray-300 stroke-1 mb-3 animate-spin duration-10000" />
              <p className="text-sm font-sans font-medium text-slate-500">No sensor active</p>
              <p className="text-xs mt-1 max-w-[200px]">Select a radiation sensor node from the primary monitor map on the left.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
